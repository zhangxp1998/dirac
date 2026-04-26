import { ModelInfo, openAiModelInfoSaneDefaults } from "@shared/api"
import { DiracStorageMessage, convertDiracStorageToAnthropicMessage } from "@/shared/messages/content"
import { Logger } from "@/shared/services/Logger"
import { ApiHandler, CommonApiHandlerOptions } from "../"
import { ApiStream } from "../transform/stream"
import { githubCopilotAuthManager } from "@/integrations/github-copilot/auth"
import { fetch } from "@/shared/net"
import { convertToOpenAiMessages } from "../transform/openai-format"
import { z } from "zod"

const GITHUB_COPILOT_BASE_URL = "https://api.githubcopilot.com"

const githubCopilotModelSchema = z.object({
	data: z.array(
		z.object({
			model_picker_enabled: z.boolean(),
			id: z.string(),
			name: z.string(),
			version: z.string(),
			supported_endpoints: z.array(z.string()).optional(),
			policy: z
				.object({
					state: z.string().optional(),
				})
				.optional(),
			capabilities: z.object({
				family: z.string(),
				limits: z.object({
					max_context_window_tokens: z.number(),
					max_output_tokens: z.number(),
					max_prompt_tokens: z.number(),
					vision: z
						.object({
							max_prompt_image_size: z.number(),
							max_prompt_images: z.number(),
							supported_media_types: z.array(z.string()),
						})
						.optional(),
				}),
				supports: z.object({
					adaptive_thinking: z.boolean().optional(),
					max_thinking_budget: z.number().optional(),
					min_thinking_budget: z.number().optional(),
					reasoning_effort: z.array(z.string()).optional(),
					streaming: z.boolean(),
					structured_outputs: z.boolean().optional(),
					tool_calls: z.boolean(),
					vision: z.boolean().optional(),
				}),
			}),
		}),
	),
})

export class GithubCopilotHandler implements ApiHandler {
	private options: CommonApiHandlerOptions
	private modelId: string

	constructor(options: CommonApiHandlerOptions & { apiModelId?: string }) {
		this.options = options
		this.modelId = options.apiModelId || "gpt-4o"
	}

	async *createMessage(systemPrompt: string, messages: DiracStorageMessage[]): ApiStream {
		const token = await githubCopilotAuthManager.getAccessToken()
		if (!token) {
			throw new Error("Not authenticated with GitHub Copilot. Please sign in.")
		}

		let modelData: z.infer<typeof githubCopilotModelSchema>["data"][0] | undefined
		try {
			const models = await this.fetchModels(token)
			modelData = models.find((m) => m.id === this.modelId)
		} catch (error) {
			Logger.error("[github-copilot] Failed to fetch models:", error)
		}

		// Fallback to defaults if model discovery fails
		const isAnthropicFormat = modelData?.supported_endpoints?.includes("/v1/messages") ?? false
		const url = isAnthropicFormat ? `${GITHUB_COPILOT_BASE_URL}/v1/messages` : `${GITHUB_COPILOT_BASE_URL}/v1/chat/completions`

		const headers: Record<string, string> = {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			"x-initiator": "user",
			"Openai-Intent": "conversation-edits",
			"User-Agent": "Dirac-CLI/1.0.0",
		}

		let body: any
		if (isAnthropicFormat) {
			body = {
				model: this.modelId,
				system: systemPrompt,
				messages: messages.map((m) => convertDiracStorageToAnthropicMessage(m)),
				max_tokens: modelData?.capabilities.limits.max_output_tokens || 4096,
				stream: true,
			}
		} else {
			body = {
				model: this.modelId,
				messages: [{ role: "system", content: systemPrompt }, ...convertToOpenAiMessages(messages)],
				max_tokens: modelData?.capabilities.limits.max_output_tokens || 4096,
				stream: true,
			}
		}

		const response = await fetch(url, {
			method: "POST",
			headers,
			body: JSON.stringify(body),
		})

		if (!response.ok) {
			const errorText = await response.text()
			throw new Error(`GitHub Copilot API error: ${response.status} ${response.statusText} - ${errorText}`)
		}

		if (!response.body) {
			throw new Error("No response body from GitHub Copilot API")
		}

		yield* this.handleStream(response.body, isAnthropicFormat)
	}

	private async fetchModels(token: string) {
		const response = await fetch(`${GITHUB_COPILOT_BASE_URL}/models`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		if (!response.ok) {
			throw new Error(`Failed to fetch models: ${response.statusText}`)
		}
		const data = await response.json()
		return githubCopilotModelSchema.parse(data).data
	}

	private async *handleStream(body: ReadableStream<Uint8Array>, isAnthropicFormat: boolean): ApiStream {
		const reader = body.getReader()
		const decoder = new TextDecoder()
		let buffer = ""

		try {
			while (true) {
				const { done, value } = await reader.read()
				if (done) break

				buffer += decoder.decode(value, { stream: true })
				const lines = buffer.split("\n")
				buffer = lines.pop() || ""

				for (const line of lines) {
					const trimmed = line.trim()
					if (!trimmed || !trimmed.startsWith("data: ")) {
						continue
					}
					const data = trimmed.slice(6)
					if (data === "[DONE]") {
						continue
					}

					try {
						const json = JSON.parse(data)
						if (isAnthropicFormat) {
							if (json.type === "content_block_delta" && json.delta?.text) {
								yield { type: "text", text: json.delta.text }
							} else if (json.type === "message_delta" && json.usage) {
								yield {
									type: "usage",
									inputTokens: json.usage.input_tokens || 0,
									outputTokens: json.usage.output_tokens || 0,
								}
							}
						} else {
							const delta = json.choices?.[0]?.delta
							if (delta?.content) {
								yield { type: "text", text: delta.content }
							}
							if (json.usage) {
								yield {
									type: "usage",
									inputTokens: json.usage.prompt_tokens || 0,
									outputTokens: json.usage.completion_tokens || 0,
								}
							}
						}
					} catch (e) {
						// Ignore parse errors for incomplete chunks
					}
				}
			}
		} finally {
			reader.releaseLock()
		}
	}

	getModel(): { id: string; info: ModelInfo } {
		return {
			id: this.modelId,
			info: {
				...openAiModelInfoSaneDefaults,
				description: "GitHub Copilot Native API",
			},
		}
	}
}

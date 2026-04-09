import { getSystemPrompt } from "../src/core/prompts/system-prompt"
import { ModelFamily } from "../src/shared/prompts"

async function main() {
	const { systemPrompt, tools } = await getSystemPrompt({
		ide: "vscode",
		providerInfo: {
			provider: "anthropic",
			modelId: "claude-sonnet-4-5",
			modelFamily: ModelFamily.GENERIC,
			supportsPromptCache: true,
			contextWindow: 200000,
			maxTokens: 8192,
		} as any,
		cwd: "/home/user/project",
		isTesting: true,
		enableNativeToolCalls: false,
	})

	console.log("=== SYSTEM PROMPT ===")
	console.log(systemPrompt)
	console.log("\n=== CHAR COUNT ===", systemPrompt?.length)

	if (tools) {
		console.log("\n=== TOOLS ===")
		console.log(JSON.stringify(tools, null, 2))
	}
}

main().catch(console.error)

import type { DiracTool } from "@/shared/tools"
import { DiracToolSet } from ".."
import { registerDiracToolSets } from "../tools/init"
import type { SystemPromptContext } from "../types"
import { PromptBuilder } from "./PromptBuilder"

export class PromptRegistry {
	private static instance: PromptRegistry
	public nativeTools: DiracTool[] | undefined = undefined

	private constructor() {
		registerDiracToolSets()
	}

	static getInstance(): PromptRegistry {
		if (!PromptRegistry.instance) {
			PromptRegistry.instance = new PromptRegistry()
		}
		return PromptRegistry.instance
	}

	/**
	 * Get unified system prompt
	 */
	async get(context: SystemPromptContext): Promise<string> {
		this.nativeTools = DiracToolSet.getNativeTools(context)

		const builder = new PromptBuilder(context)
		return await builder.build()
	}

	public static dispose(): void {
		PromptRegistry.instance = null as unknown as PromptRegistry
	}
}

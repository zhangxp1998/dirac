import * as fs from "node:fs/promises"
import * as path from "node:path"
import { DiracToolSet, PromptRegistry } from "../src/core/prompts/system-prompt"
import { ModelFamily } from "../src/shared/prompts"

async function listTools() {
	// Initialize registry to trigger tool registration
	PromptRegistry.getInstance()

	const allFamilies = Object.values(ModelFamily)
	const toolMap = new Map<string, Set<ModelFamily>>()

	for (const family of allFamilies) {
		const tools = DiracToolSet.getTools(family)
		for (const tool of tools) {
			const id = tool.config.id
			if (!toolMap.has(id)) {
				toolMap.set(id, new Set())
			}
			toolMap.get(id)!.add(family)
		}
	}

	let output = "=== CLINE TOOL AUDIT ===\n\n"

	const sortedToolIds = Array.from(toolMap.keys()).sort()

	for (const id of sortedToolIds) {
		const families = toolMap.get(id)!
		const isUniversal = families.has(ModelFamily.GENERIC)

		let availability: string
		if (isUniversal && families.size === allFamilies.length) {
			availability = "Universal (All Models)"
		} else if (isUniversal) {
			availability = `Universal (Generic) + ${families.size - 1} specialized variants`
		} else {
			availability = `Specialized: ${Array.from(families).sort().join(", ")}`
		}

		output += `Tool: ${id.padEnd(25)} | Availability: ${availability}\n`

		// Check for variant-specific descriptions or parameters
		const uniqueSpecs = new Set<string>()
		for (const family of families) {
			const tool = DiracToolSet.getToolByName(id, family)
			if (tool) {
				uniqueSpecs.add(
					JSON.stringify({
						desc: tool.config.description,
						params: tool.config.parameters?.map((p) => p.name).sort(),
					}),
				)
			}
		}

		if (uniqueSpecs.size > 1) {
			output += `   └─ Note: Has ${uniqueSpecs.size} different instruction variants depending on the model.\n`
		}
	}

	output += `\nTotal Tools Registered: ${toolMap.size}`

	console.log(output)

	const outputDir = path.join(process.cwd(), "test_prompts")
	await fs.mkdir(outputDir, { recursive: true })
	await fs.writeFile(path.join(outputDir, "tool-audit.txt"), output)
	console.log(`\nReport saved to ${path.join(outputDir, "tool-audit.txt")}`)
}

listTools().catch(console.error)

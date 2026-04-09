import fs from "node:fs/promises"
import path from "node:path"
import { loadRequiredLanguageParsers } from "../src/services/tree-sitter/languageParser"

async function extractDefinition(filePath: string, definitionName: string): Promise<string | null> {
	const fileContent = await fs.readFile(filePath, "utf8")
	const ext = path.extname(filePath).toLowerCase().slice(1)

	const languageParsers = await loadRequiredLanguageParsers([filePath])
	const { parser, query } = languageParsers[ext] || {}

	if (!parser || !query) {
		return `Unsupported file type: ${filePath}`
	}

	try {
		const tree = parser.parse(fileContent)
		if (!tree || !tree.rootNode) {
			return null
		}

		const matches = query.matches(tree.rootNode)
		const results: string[] = []

		for (const match of matches) {
			const nameCapture = match.captures.find((c) => c.name.includes("name"))
			const defCapture = match.captures.find((c) => !c.name.includes("name"))

			if (nameCapture && defCapture) {
				const nameText = fileContent.slice(nameCapture.node.startIndex, nameCapture.node.endIndex)
				if (nameText === definitionName) {
					const defText = fileContent.slice(defCapture.node.startIndex, defCapture.node.endIndex)
					results.push(defText)
				}
			}
		}

		if (results.length > 0) {
			return results.join("\n\n---\n\n")
		}
	} catch (error) {
		console.error(`Error parsing file ${filePath}:`, error)
	}

	return null
}

async function main() {
	const args = process.argv.slice(2)
	const input = args[0]

	if (!input || !input.includes(":")) {
		console.error("Usage: npx tsx scripts/extract-definition.ts <path-to-file>:<definition-name>")
		process.exit(1)
	}

	const lastColonIndex = input.lastIndexOf(":")
	const filePath = input.slice(0, lastColonIndex)
	const definitionName = input.slice(lastColonIndex + 1)

	try {
		const resolvedPath = path.resolve(filePath)
		const stats = await fs.stat(resolvedPath)

		if (stats.isDirectory()) {
			console.error(`Error: ${resolvedPath} is a directory. Please provide a file path.`)
			process.exit(1)
		}

		const result = await extractDefinition(resolvedPath, definitionName)
		if (result) {
			console.log(`File: ${path.relative(process.cwd(), resolvedPath)}\n`)
			console.log(result)
		} else {
			console.log(`Definition '${definitionName}' not found in ${filePath}`)
		}
	} catch (err) {
		console.error("Error:", err instanceof Error ? err.message : String(err))
		process.exit(1)
	}
}

main().catch((err) => {
	console.error("Fatal Error:", err)
	process.exit(1)
})

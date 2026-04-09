import fs from "node:fs/promises"
import path from "node:path"
import { loadRequiredLanguageParsers } from "../src/services/tree-sitter/languageParser"

async function findReferencesInFile(
	filePath: string,
	symbol: string,
	languageParsers: any,
): Promise<Array<{ line: number; text: string }> | null> {
	const fileContent = await fs.readFile(filePath, "utf8")
	const ext = path.extname(filePath).toLowerCase().slice(1)

	const { parser, query } = languageParsers[ext] || {}
	if (!parser || !query) {
		return null
	}

	try {
		const tree = parser.parse(fileContent)
		if (!tree || !tree.rootNode) {
			return null
		}

		const captures = query.captures(tree.rootNode)
		const lines = fileContent.split("\n")
		const references: Array<{ line: number; text: string }> = []

		for (const capture of captures) {
			const { node, name } = capture
			if (name === "name.reference" || name.includes("name.definition")) {
				const text = fileContent.slice(node.startIndex, node.endIndex)
				if (text === symbol) {
					const lineNum = node.startPosition.row + 1
					references.push({
						line: lineNum,
						text: lines[node.startPosition.row].trim(),
					})
				}
			}
		}

		return references.length > 0 ? references : null
	} catch (error) {
		console.error(`Error parsing file ${filePath}:`, error)
		return null
	}
}

async function main() {
	const args = process.argv.slice(2)
	const symbol = args[0]
	const targetPath = args[1] || "."

	if (!symbol) {
		console.error("Usage: npx tsx scripts/find-references.ts <symbol> [path-to-file-or-directory]")
		process.exit(1)
	}

	try {
		const resolvedPath = path.resolve(targetPath)
		const stats = await fs.stat(resolvedPath)

		let files: string[] = []
		if (stats.isDirectory()) {
			const entries = await fs.readdir(resolvedPath, { recursive: true, withFileTypes: true })
			files = entries.filter((e) => e.isFile()).map((e) => path.join(e.parentPath || resolvedPath, e.name))
		} else {
			files = [resolvedPath]
		}

		// Filter for supported extensions
		const supportedExts = [
			"js",
			"jsx",
			"ts",
			"tsx",
			"py",
			"rs",
			"go",
			"c",
			"h",
			"cpp",
			"hpp",
			"cs",
			"rb",
			"java",
			"php",
			"swift",
			"kt",
		]
		const filesToScan = files.filter((f) => supportedExts.includes(path.extname(f).toLowerCase().slice(1)))

		if (filesToScan.length === 0) {
			console.log("No supported files found to scan.")
			process.exit(0)
		}

		const languageParsers = await loadRequiredLanguageParsers(filesToScan)

		let totalFound = 0
		for (const file of filesToScan) {
			const refs = await findReferencesInFile(file, symbol, languageParsers)
			if (refs) {
				console.log(`${path.relative(process.cwd(), file)}:`)
				for (const ref of refs) {
					console.log(`  ${ref.line}: ${ref.text}`)
					totalFound++
				}
			}
		}

		if (totalFound === 0) {
			console.log(`No references found for '${symbol}'.`)
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

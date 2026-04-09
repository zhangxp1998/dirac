import { createReadStream } from "node:fs"
import path from "node:path"
import readline from "node:readline"

async function readLines(filePath: string, startLine: number, endLine: number): Promise<string> {
	const fileStream = createReadStream(filePath)
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Number.POSITIVE_INFINITY,
	})

	let currentLine = 1
	const lines: string[] = []

	for await (const line of rl) {
		if (currentLine >= startLine && currentLine <= endLine) {
			lines.push(`${currentLine}: ${line}`)
		}
		if (currentLine > endLine) {
			rl.close()
			break
		}
		currentLine++
	}

	return lines.join("\n")
}

async function main() {
	const args = process.argv.slice(2)
	const input = args[0]

	if (!input) {
		console.error("Usage: npx tsx scripts/read-lines.ts <path-to-file>:<start-line>[:<end-line>]")
		process.exit(1)
	}

	const parts = input.split(":")
	// Handle cases where the path might contain colons (Windows)
	let filePath: string
	let range: string

	if (parts.length > 2 && /^\d+(-\d+)?$/.test(parts[parts.length - 1])) {
		// likely path:start or path:start-end
		range = parts.pop()!
		filePath = parts.join(":")
	} else if (parts.length === 2) {
		filePath = parts[0]
		range = parts[1]
	} else {
		console.error("Invalid format. Use path:start or path:start-end")
		process.exit(1)
	}

	let startLine: number
	let endLine: number

	if (range.includes("-")) {
		const [s, e] = range.split("-").map(Number)
		startLine = s
		endLine = e
	} else {
		startLine = Number(range)
		endLine = startLine + 20 // Default 20 lines
	}

	if (isNaN(startLine) || isNaN(endLine)) {
		console.error("Invalid line numbers.")
		process.exit(1)
	}

	try {
		const resolvedPath = path.resolve(filePath)
		const result = await readLines(resolvedPath, startLine, endLine)

		console.log(`File: ${path.relative(process.cwd(), resolvedPath)} (Lines ${startLine}-${endLine})\n`)
		if (result) {
			console.log(result)
		} else {
			console.log("No lines found in specified range.")
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

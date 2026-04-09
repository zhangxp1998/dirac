import { BaseToolOutputProps } from "./shared"
import CodeBlock from "@/shared/ui/CodeBlock"

export const CodeOutput = ({ tool, unit }: BaseToolOutputProps) => {
	const content = unit.content || tool.content
	if (!content) return null

	// Determine language from file extension if possible
	const path = unit.path || tool.path || (tool.paths && tool.paths[0]) || ""
	const ext = path.split(".").pop() || ""
	const lang = ext === "ts" ? "typescript" : ext === "js" ? "javascript" : ext === "py" ? "python" : ext

	return (
		<div className="mt-1">
			<CodeBlock source={`\`\`\`${lang}\n${content}\n\`\`\``} />
		</div>
	)
}

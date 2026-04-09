import React from "react"

import { BaseToolOutputProps } from "./shared"
import { CommandOutputContent } from "../../CommandOutputRow"

export const TerminalOutput = ({ tool, unit }: BaseToolOutputProps) => {
	const [isOutputFullyExpanded, setIsOutputFullyExpanded] = React.useState(false)
	const content = unit.content || tool.content || (tool as any).output
	if (!content) return null

	return (
		<div className="mt-1 bg-code border border-editor-group-border rounded-sm overflow-hidden">
			<CommandOutputContent
				output={content}
				isOutputFullyExpanded={isOutputFullyExpanded}
				onToggle={() => setIsOutputFullyExpanded(!isOutputFullyExpanded)}
				isContainerExpanded={true}
			/>
		</div>
	)
}

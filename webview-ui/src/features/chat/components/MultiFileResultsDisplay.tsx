import React from "react"
import CodeAccordian from "@/shared/ui/CodeAccordian"

interface MultiFileResultsDisplayProps {
	title: string
	files: Array<{ path: string; content?: string; refs?: string[] }>
	onToggleExpand: (ts: number) => void
	isExpanded: boolean
	messageTs: number
	onPathClick?: (path: string) => void
}

const MultiFileResultsDisplay: React.FC<MultiFileResultsDisplayProps> = ({
	title,
	files,
	onToggleExpand,
	isExpanded,
	messageTs,
	onPathClick,
}) => {
	if (files.length === 0) {
		return null
	}

	return (
		<div className="flex flex-col gap-2">
			{files.map((file, index) => (
				<CodeAccordian
					code={file.content || (file.refs ? file.refs.join("\n") : "")}
					isExpanded={isExpanded}
					key={`${file.path}-${index}`}
					onPathClick={onPathClick ? () => onPathClick(file.path) : undefined}
					onToggleExpand={() => onToggleExpand(messageTs)}
					path={file.path}
				/>
			))}
		</div>
	)
}

export default MultiFileResultsDisplay

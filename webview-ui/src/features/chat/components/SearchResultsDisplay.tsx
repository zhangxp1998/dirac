import { ChevronDownIcon, ChevronRightIcon, SquareArrowOutUpRightIcon } from "lucide-react"
import React, { useMemo } from "react"
import { cn } from "@/lib/utils"
import CodeAccordian from "@/shared/ui/CodeAccordian"

interface SearchResultsDisplayProps {
	content: string
	isExpanded: boolean
	onToggleExpand: () => void
	path: string
	filePattern?: string
	onPathClick?: () => void
}

const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({
	content,
	isExpanded,
	onToggleExpand,
	path,
	filePattern,
	onPathClick,
}) => {
	const parsedData = useMemo(() => {
		// Check if this is a multi-workspace result
		const multiWorkspaceMatch = content.match(/^Found \d+ results? across \d+ workspaces?\./m)

		if (!multiWorkspaceMatch) {
			// Single workspace result - return as is
			return { isMultiWorkspace: false }
		}

		// Parse multi-workspace results
		const lines = content.split("\n")
		const sections: Array<{ workspace: string; content: string }> = []
		let currentWorkspace: string | null = null
		let currentContent: string[] = []

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i]

			// Check for workspace header
			if (line.startsWith("## Workspace: ")) {
				// Save previous workspace section if exists
				if (currentWorkspace && currentContent.length > 0) {
					sections.push({
						workspace: currentWorkspace,
						content: currentContent.join("\n"),
					})
				}

				// Start new workspace section
				currentWorkspace = line.replace("## Workspace: ", "").trim()
				currentContent = []
			} else if (currentWorkspace) {
				// Add line to current workspace content
				currentContent.push(line)
			}
		}

		// Save last workspace section
		if (currentWorkspace && currentContent.length > 0) {
			sections.push({
				workspace: currentWorkspace,
				content: currentContent.join("\n"),
			})
		}

		return { isMultiWorkspace: true, sections, summaryLine: lines[0] }
	}, [content])

	const fullPath = path + (filePattern ? `/(${filePattern})` : "")

	// For single workspace, use the standard CodeAccordian
	if (!parsedData.isMultiWorkspace) {
		return (
			<CodeAccordian
				code={content}
				isExpanded={isExpanded}
				language="plaintext"
				onPathClick={onPathClick}
				onToggleExpand={onToggleExpand}
				path={fullPath}
			/>
		)
	}

	// For multi-workspace results, render a custom view
	const { sections, summaryLine } = parsedData

	return (
		<div
			style={{
				borderRadius: 3,
				backgroundColor: "var(--vscode-textCodeBlock-background)",
				overflow: "hidden",
				border: "1px solid var(--vscode-editorGroup-border)",
			}}>
			<div
				aria-label={isExpanded ? "Collapse search results" : "Expand search results"}
				onClick={onToggleExpand}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault()
						e.stopPropagation()
						onToggleExpand()
					}
				}}
				style={{
					color: "var(--vscode-descriptionForeground)",
					display: "flex",
					alignItems: "center",
					padding: "9px 10px",
					cursor: "pointer",
					userSelect: "none",
					WebkitUserSelect: "none",
					MozUserSelect: "none",
					msUserSelect: "none",
				}}
				tabIndex={0}>
				<div className="flex items-center overflow-hidden mr-2 flex-1">
					<span>/</span>
					<span
						className={cn(
							"ph-no-capture whitespace-nowrap overflow-hidden text-ellipsis text-left [direction: rtl]",
							{
								"hover:underline cursor-pointer text-link": !!onPathClick,
							},
						)}
						onClick={(e) => {
							if (onPathClick) {
								e.stopPropagation()
								onPathClick()
							}
						}}
						title={onPathClick ? "Open file in editor" : undefined}>
						{fullPath + "\u200E"}
					</span>
					{onPathClick && (
						<span
							className="p-1 -mr-1 ml-1 hover:bg-description/20 rounded-xs transition-colors shrink-0"
							onClick={(e) => {
								e.stopPropagation()
								onPathClick()
							}}
							title="Open file in editor">
							<SquareArrowOutUpRightIcon className="size-3 text-description hover:text-foreground" />
						</span>
					)}
				</div>
				<div style={{ flexGrow: 1 }} />
				{isExpanded ? (
					<ChevronDownIcon size={16} style={{ margin: "1px 0" }} />
				) : (
					<ChevronRightIcon size={16} style={{ margin: "1px 0" }} />
				)}
			</div>

			{isExpanded && (
				<div style={{ padding: "10px", borderTop: "1px solid var(--vscode-editorGroup-border)" }}>
					{/* Summary line */}
					<div
						style={{
							marginBottom: "12px",
							fontWeight: "bold",
							color: "var(--vscode-foreground)",
						}}>
						{summaryLine}
					</div>

					{/* Workspace sections */}
					{sections?.map((section: any, index: number) => (
						<div
							key={`workspace-${section.workspace}`}
							style={{ marginBottom: index < sections.length - 1 ? "16px" : 0 }}>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									gap: "6px",
									marginBottom: "8px",
									padding: "4px 8px",
									backgroundColor: "var(--vscode-editor-background)",
									borderRadius: "3px",
									border: "1px solid var(--vscode-editorWidget-border)",
								}}>
								<span
									className="codicon codicon-folder"
									style={{
										fontSize: "14px",
										color: "var(--vscode-symbolIcon-folderForeground)",
									}}
								/>
								<span
									style={{
										fontWeight: "500",
										color: "var(--vscode-foreground)",
									}}>
									Workspace: {section.workspace}
								</span>
							</div>

							{/* Results for this workspace */}
							<div
								style={{
									backgroundColor: "var(--vscode-textCodeBlock-background)",
									padding: "8px",
									borderRadius: "3px",
									fontSize: "var(--vscode-editor-font-size)",
									fontFamily: "var(--vscode-editor-font-family)",
									lineHeight: "1.5",
									whiteSpace: "pre-wrap",
									wordBreak: "break-word",
									overflowWrap: "anywhere",
								}}>
								<pre style={{ margin: 0, fontFamily: "inherit" }}>{section.content.trim()}</pre>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default SearchResultsDisplay

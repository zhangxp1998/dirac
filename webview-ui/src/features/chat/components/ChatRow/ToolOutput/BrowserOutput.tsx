import CodeBlock from "@/shared/ui/CodeBlock"
import { BrowserActionBox } from "../BrowserActionBox"
import { BaseToolOutputProps } from "./shared"

export const BrowserOutput = ({ tool }: BaseToolOutputProps) => {
	switch (tool.tool) {
		case "browser_action":
			return (
				<div className="w-full">
					<BrowserActionBox
						action={tool.browser_action?.action as any}
						coordinate={tool.browser_action?.coordinate}
						text={tool.browser_action?.text}
					/>
				</div>
			)

		case "browser_action_result":
			return (
				<div className="w-full">
					<div className="bg-code border border-editor-group-border rounded-sm p-3">
						<div className="flex items-center gap-2 mb-2 text-xs opacity-70">
							<span className="lucide lucide-globe size-3" />
							<span className="truncate">{tool.path}</span>
						</div>
						{tool.content && (
							<div className="mt-2">
								<CodeBlock source={`${"```"}shell\n${tool.content}\n${"```"}`} />
							</div>
						)}
					</div>
				</div>
			)

		default:
			return null
	}
}

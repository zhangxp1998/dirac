import { BrowserAction } from "@shared/ExtensionMessage"

interface BrowserActionBoxProps {
	action: BrowserAction
	coordinate?: string
	text?: string
}

export const BrowserActionBox = ({ action, coordinate, text }: BrowserActionBoxProps) => {
	const getBrowserActionText = (action: BrowserAction, coordinate?: string, text?: string) => {
		switch (action) {
			case "launch":
				return `Launch browser at ${text}`
			case "click":
				return `Click (${coordinate?.replace(",", ", ")})`
			case "type":
				return `Type "${text}"`
			case "scroll_down":
				return "Scroll down"
			case "scroll_up":
				return "Scroll up"
			case "close":
				return "Close browser"
			default:
				return action
		}
	}

	return (
		<div className="bg-code border border-editor-group-border rounded-xs p-2.5">
			<span className="ph-no-capture font-medium">Browse Action: </span>
			<span>{getBrowserActionText(action, coordinate, text)}</span>
		</div>
	)
}

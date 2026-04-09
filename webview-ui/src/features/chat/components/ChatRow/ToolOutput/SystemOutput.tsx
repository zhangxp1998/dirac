import { DiracMessage } from "@shared/ExtensionMessage"
import { StringRequest } from "@shared/proto/dirac/common"
import { UiServiceClient } from "@/shared/api/grpc-client"
import { BaseToolOutputProps } from "./shared"

interface SystemOutputProps extends BaseToolOutputProps {
	message: DiracMessage
}

export const SystemOutput = ({ tool, isExpanded, onToggleExpand, message }: SystemOutputProps) => {
	switch (tool.tool) {
		case "summarizeTask":
		case "subagent":
			return (
				<div className="bg-code overflow-hidden border border-editor-group-border rounded-[3px]">
					<div className="text-description py-2 px-2.5 select-text">
						<span className="ph-no-capture break-words whitespace-pre-wrap">{tool.content}</span>
					</div>
				</div>
			)

		case "webFetch":
			return (
				<div
					className="bg-code rounded-xs overflow-hidden border border-editor-group-border py-2 px-2.5 cursor-pointer select-none"
					onClick={() => {
						if (tool.path) {
							UiServiceClient.openUrl(StringRequest.create({ value: tool.path })).catch((err: any) => {
								console.error("Failed to open URL:", err)
							})
						}
					}}>
					<span className="ph-no-capture whitespace-nowrap overflow-hidden text-ellipsis mr-2 [direction:rtl] text-left text-link underline">
						{tool.path + "\u200E"}
					</span>
				</div>
			)

		case "webSearch":
			return (
				<div className="bg-code border border-editor-group-border overflow-hidden rounded-xs select-text py-[9px] px-2.5">
					<span className="ph-no-capture whitespace-nowrap overflow-hidden text-ellipsis mr-2 text-left [direction:rtl]">
						{tool.path + "\u200E"}
					</span>
				</div>
			)

		case "useSkill":
			return (
				<div className="bg-code border border-editor-group-border overflow-hidden rounded-xs py-[9px] px-2.5">
					<span className="ph-no-capture font-medium">{tool.path}</span>
				</div>
			)

		case "diagnosticsScan":
		case "diagnostics_scan":
			return (
				<div className="bg-code overflow-hidden border border-editor-group-border rounded-[3px]">
					<div className="text-description py-2 px-2.5 select-text">
						<span className="ph-no-capture break-words whitespace-pre-wrap">{tool.content}</span>
					</div>
				</div>
			)

		default:
			return null
	}
}

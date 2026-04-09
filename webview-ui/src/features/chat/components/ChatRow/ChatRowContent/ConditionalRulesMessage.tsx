import { memo } from "react"
import { HEADER_CLASSNAMES } from "../ToolOutput/shared"

interface ConditionalRulesMessageProps {
	rules: Array<{ name: string; matchedConditions: Record<string, string[]> }>
}

export const ConditionalRulesMessage = memo(({ rules }: ConditionalRulesMessageProps) => {
	const names = rules.map((r) => r.name).join(", ")
	return (
		<div className={HEADER_CLASSNAMES}>
			<span style={{ fontWeight: "bold" }}>Conditional rules applied:</span>
			<span className="ph-no-capture break-words whitespace-pre-wrap">{names}</span>
		</div>
	)
})

ConditionalRulesMessage.displayName = "ConditionalRulesMessage"

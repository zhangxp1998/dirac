import { DiracDefaultTool } from "@/shared/tools"
import type { DiracToolSpec } from "../spec"

// HACK: Placeholder to act as tool dependency
export const focus_chain: DiracToolSpec = {
	id: DiracDefaultTool.TODO,
	name: "focus_chain",
	description: "",
	contextRequirements: (context) => context.focusChainSettings?.enabled === true,
}

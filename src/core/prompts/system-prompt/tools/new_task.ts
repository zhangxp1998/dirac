import { DiracDefaultTool } from "@/shared/tools"
import type { DiracToolSpec } from "../spec"

const id = DiracDefaultTool.NEW_TASK

export const new_task: DiracToolSpec = {
	id,
	name: "new_task",
	description: "Creates a new task with preloaded context from the current conversation.",
	parameters: [
		{
			name: "context",
			required: true,
			instruction:
				"Detailed summary of the conversation so far, including current work, technical concepts, modified files, problems solved, and exact pending next steps.",
			usage: "Detailed conversation summary here",
		},
	],
}

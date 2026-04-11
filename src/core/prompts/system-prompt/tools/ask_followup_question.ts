import { DiracDefaultTool } from "@/shared/tools"
import type { DiracToolSpec } from "../spec"

const id = DiracDefaultTool.ASK

export const ask_followup_question: DiracToolSpec = {
	id,
	name: "ask_followup_question",
	description: "Asks the user a clarifying question when you encounter ambiguities or need more details.",
	parameters: [
		{
			name: "question",
			required: true,
			instruction: "The question to ask the user.",
			usage: "Your question here",
		},
		{
			name: "options",
			required: false,
			instruction: "Optional array of 2-5 predefined answer options. DO NOT include options to toggle Act mode.",
			usage: '["Option 1", "Option 2"]',
		},
	],
}

export const ask_followup_question_variants = [ask_followup_question]

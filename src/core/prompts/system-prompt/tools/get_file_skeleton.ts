import { DiracDefaultTool } from "@/shared/tools"
import type { DiracToolSpec } from "../spec"

const id = DiracDefaultTool.GET_FILE_SKELETON

export const get_file_skeleton: DiracToolSpec = {
	id,
	name: "get_file_skeleton",
	description:
		"Reads the structural outline of one or more files by extracting the lines where classes, functions, and methods are defined (including nested definitions) while stripping all implementation logic. Use this to quickly understand multiple files' structures and APIs before requesting specific functions.",
	parameters: [
		{
			name: "paths",
			required: true,
			type: "array",
			items: { type: "string" },
			instruction: "An array of relative paths to the source files.",
			usage: '["src/utils/math.ts", "src/utils/string.py"]',
		},
	],
}

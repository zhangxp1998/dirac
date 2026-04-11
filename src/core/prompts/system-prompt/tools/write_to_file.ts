import { DiracDefaultTool } from "@/shared/tools"
import type { DiracToolSpec } from "../spec"

const id = DiracDefaultTool.FILE_NEW

export const write_to_file: DiracToolSpec = {
	id,
	name: "write_to_file",
	description: "Creates a new file or completely overwrites an existing file. Automatically creates required directories.",
	parameters: [
		{
			name: "path",
			required: true,
			instruction: "The path of the file to write to.",
			usage: "File path here",
		},
		{
			name: "content",
			required: true,
			instruction: "The COMPLETE intended content of the file. Do not truncate or omit any parts.",
			usage: "Full file content here",
		},
	],
}

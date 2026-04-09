import { DiracDefaultTool } from "@/shared/tools"
import type { DiracToolSpec } from "../spec"
import { TASK_PROGRESS_PARAMETER } from "../types"

const id = DiracDefaultTool.SEARCH

export const search_files: DiracToolSpec = {
	id,
	name: "search_files",
	description:
		"Regex search across files in a specified directory. Skips non-useful content (.git, node_modules, build artifacts, etc. and all files and directories starting with a dot). Prefer AST tools over this when reasonable.",
	parameters: [
		{
			name: "path",
			required: true,
			instruction: "The path of the directory to search in.",
			usage: "Directory path here",
		},
		{
			name: "regex",
			required: true,
			instruction: "The regular expression pattern to search for (Rust regex syntax).",
			usage: "Regex pattern here",
		},
		{
			name: "file_pattern",
			required: false,
			instruction: "Glob pattern to filter files (e.g., '*.ts').",
			usage: "*.ts",
		},
		{
			name: "context_lines",
			required: false,
			instruction: "Optional number of context lines to show before and after each match (0-10, default 0).",
			usage: "2",
		},
		TASK_PROGRESS_PARAMETER,
	],
}

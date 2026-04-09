import { DiracDefaultTool } from "@/shared/tools"
import type { DiracToolSpec } from "../spec"
import { TASK_PROGRESS_PARAMETER } from "../types"

export const web_fetch: DiracToolSpec = {
	id: DiracDefaultTool.WEB_FETCH,
	name: "web_fetch",
	description: `Fetches content from a specified URL and analyzes it using your prompt
- Takes a URL and analysis prompt as input
- Fetches the URL content and processes based on your prompt
- Use this tool when you need to retrieve and analyze web content
- The URL must be a fully-formed valid URL
- The prompt must be at least 2 characters
- HTTP URLs will be automatically upgraded to HTTPS
- This tool is read-only and does not modify any files`,
	contextRequirements: (context) => context.diracWebToolsEnabled === true,
	parameters: [
		{
			name: "url",
			required: true,
			instruction: "The URL to fetch content from",
			usage: "https://example.com/docs",
		},
		{
			name: "prompt",
			required: true,
			instruction: "The prompt to use for analyzing the webpage content",
			usage: "Summarize the main points and key takeaways",
		},
		TASK_PROGRESS_PARAMETER,
	],
}

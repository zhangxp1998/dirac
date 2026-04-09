import { DiracDefaultTool } from "@/shared/tools"
import type { DiracToolSpec } from "../spec"
import { TASK_PROGRESS_PARAMETER } from "../types"

export const web_search: DiracToolSpec = {
	id: DiracDefaultTool.WEB_SEARCH,
	name: "web_search",
	description: `Performs a web search and returns relevant results
- Takes a search query as input and returns search results with titles and URLs
- Optionally filter results by allowed or blocked domains
- Use this tool when you need to search the web for information
- The query must be at least 2 characters
- You may provide either allowed_domains OR blocked_domains, but NOT both
- Domains should be provided as a JSON array of strings
- This tool is read-only and does not modify any files`,
	contextRequirements: (context) => context.diracWebToolsEnabled === true,
	parameters: [
		{
			name: "query",
			required: true,
			instruction: "The search query to use",
			usage: "latest developments in AI",
		},
		{
			name: "allowed_domains",
			required: false,
			instruction: "JSON array of domains to restrict results to",
			usage: '["example.com", "github.com"]',
		},
		{
			name: "blocked_domains",
			required: false,
			instruction: "JSON array of domains to exclude from results",
			usage: '["ads.com", "spam.com"]',
		},
		TASK_PROGRESS_PARAMETER,
	],
}

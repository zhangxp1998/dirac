import { DiracStorageMessage } from "@/shared/messages/content"
import { DiracDefaultTool } from "@/shared/tools"

/**
 * Transforms tool call messages between different tool formats based on native tool support.
 * Converts between different tool formats as needed.
 *
 * @param diracMessages - Array of messages containing tool calls to transform
 * @param nativeTools - Array of tools natively supported by the current provider
 * @returns Transformed messages array, or original if no transformation needed
 */
export function transformToolCallMessages(
	diracMessages: DiracStorageMessage[],
	nativeTools?: DiracDefaultTool[],
): DiracStorageMessage[] {
	// Early return if no messages or native tools provided
	if (!diracMessages?.length || !nativeTools?.length) {
		return diracMessages
	}

	// Create Sets for O(1) lookup performance
	const nativeToolSet = new Set(nativeTools)
	const usedToolSet = new Set<string>()

	// Single pass: collect all tools used in assistant messages
	for (const msg of diracMessages) {
		if (msg.role === "assistant" && Array.isArray(msg.content)) {
			for (const block of msg.content) {
				if (block.type === "tool_use" && block.name) {
					usedToolSet.add(block.name)
				}
			}
		}
	}

	// Early return if no tools were used
	if (usedToolSet.size === 0) {
		return diracMessages
	}

	// Determine which conversion to apply
	const hasFileEditNative = nativeToolSet.has(DiracDefaultTool.EDIT_FILE) || nativeToolSet.has(DiracDefaultTool.FILE_NEW)

	const hasFileEditUsed = usedToolSet.has(DiracDefaultTool.EDIT_FILE) || usedToolSet.has(DiracDefaultTool.FILE_NEW)

	return diracMessages
}

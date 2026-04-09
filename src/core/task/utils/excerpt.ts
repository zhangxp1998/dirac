/**
 * Truncates a string to a maximum length and adds an ellipsis if necessary.
 *
 * @param text The text to truncate.
 * @param maxChars The maximum number of characters.
 * @returns The truncated text.
 */
export function excerpt(text: string | undefined, maxChars = 1200): string {
	if (!text) {
		return ""
	}

	const trimmed = text.trim()
	if (trimmed.length <= maxChars) {
		return trimmed
	}

	return `${trimmed.slice(0, maxChars)}...`
}

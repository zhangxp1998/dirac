const SAFE_BASE_COMMANDS = ["ls", "pwd", "date", "whoami", "uname", "cat", "grep", "find", "head", "tail", "cd", "clear", "echo", "hostname", "df", "du", "ps", "free", "uptime", "wc", "sort", "uniq", "file", "stat", "diff", "rg", "cut"]

const SAFE_GIT_SUBCOMMANDS = ["status", "log", "diff", "branch", "show", "remote"]

/**
 * Checks if a CLI command is considered "harmless" and safe for auto-approval.
 * This function handles piped commands and rejects output redirection to disk.
 *
 * @param command The CLI command to check
 * @returns true if the command is deemed safe, false otherwise
 */
export function isSafeCommand(command: string): boolean {
	let normalized = command.trim()

	// Special case: allow 2>/dev/null at the end of the command
	const devNullRedirection = "2>/dev/null"
	if (normalized.endsWith(devNullRedirection)) {
		normalized = normalized.slice(0, -devNullRedirection.length).trim()
	}

	// 1. Reject output redirection (avoids disk writes)
	if (normalized.includes(">") || normalized.includes(">>")) {
		return false
	}

	// 2. Split by common shell operators to check each part
	// Handles |, &&, ||, ;
	const segments = normalized.split(/\|\||&&|[|;]|\n/)

	for (const segment of segments) {
		const trimmed = segment.trim()
		if (!trimmed) {
			continue
		}

		const parts = trimmed.split(/\s+/)
		const baseCommand = parts[0].toLowerCase()

		// 3. Special handling for git to only allow read-only operations
		if (baseCommand === "git") {
			if (parts.length < 2) {
				return false
			}
			const subcommand = parts[1].toLowerCase()
			if (!SAFE_GIT_SUBCOMMANDS.includes(subcommand)) {
				return false
			}
		} else if (!SAFE_BASE_COMMANDS.includes(baseCommand)) {
			// 4. Check against general safe list
			return false
		}
	}

	return true
}

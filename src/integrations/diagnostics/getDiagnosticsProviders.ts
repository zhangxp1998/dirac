import { IDiagnosticsProvider } from "./IDiagnosticsProvider"
import { LinterFeedbackProvider } from "./LinterFeedbackProvider"
import { SyntaxFeedbackProvider } from "./SyntaxFeedbackProvider"

export function getDiagnosticsProviders(
	useLinterOnlyForSyntax = false,
	timeoutMs?: number,
	delayMs?: number,
): IDiagnosticsProvider[] {
	if (useLinterOnlyForSyntax) {
		return [new SyntaxFeedbackProvider()]
	}
	return [new SyntaxFeedbackProvider(), new LinterFeedbackProvider(timeoutMs, delayMs)]
}

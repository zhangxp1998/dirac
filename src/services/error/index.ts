import { ErrorSettings } from "./providers/IErrorProvider"

export { DiracError, DiracErrorType } from "./DiracError"
export { type ErrorProviderConfig, ErrorProviderFactory, type ErrorProviderType } from "./ErrorProviderFactory"
export { ErrorService } from "./ErrorService"
export type { ErrorSettings, IErrorProvider } from "./providers/IErrorProvider"
export { DiracErrorProvider } from "./providers/DiracErrorProvider"

export function getErrorLevelFromString(level: string | undefined): ErrorSettings["level"] {
	switch (level) {
		case "disabled":
		case "off":
			return "off"
		case "error":
		case "crash":
			return "error"
		default:
			return "all"
	}
}

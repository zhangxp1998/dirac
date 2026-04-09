import type { ExtensionMessage } from "@shared/ExtensionMessage"
import { PLATFORM_CONFIG } from "../../config/platform.config"

export type WebviewMessage = {
	type: string
	[key: string]: any
}

class VSCodeAPI {
	public postMessage(message: WebviewMessage) {
		PLATFORM_CONFIG.postMessage(message)
	}

	public onMessage(callback: (message: ExtensionMessage) => void) {
		const listener = (event: MessageEvent) => {
			const message = event.data as ExtensionMessage
			callback(message)
		}
		window.addEventListener("message", listener)
		return () => window.removeEventListener("message", listener)
	}
}

export const vscodeApi = new VSCodeAPI()

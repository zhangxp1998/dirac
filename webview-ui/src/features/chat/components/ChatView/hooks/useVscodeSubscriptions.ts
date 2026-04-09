import { RefObject, useEffect } from "react"
import { UiServiceClient } from "@/shared/api/grpc-client"

interface UseVscodeSubscriptionsOptions {
	isHidden: boolean
	textAreaRef: RefObject<HTMLTextAreaElement>
	setInputValue: (value: (prev: string) => string) => void
}

export const useVscodeSubscriptions = ({ isHidden, textAreaRef, setInputValue }: UseVscodeSubscriptionsOptions) => {
	// Subscribe to show webview events
	useEffect(() => {
		const cleanup = UiServiceClient.subscribeToShowWebview(
			{},
			{
				onResponse: (event: any) => {
					if (!isHidden && !event.preserveEditorFocus) {
						textAreaRef.current?.focus()
					}
				},
				onError: (error: any) => {
					console.error("Error in showWebview subscription:", error)
				},
				onComplete: () => {
					console.log("showWebview subscription completed")
				},
			},
		)
		return cleanup
	}, [isHidden, textAreaRef])

	// Set up addToInput subscription
	useEffect(() => {
		const cleanup = UiServiceClient.subscribeToAddToInput(
			{},
			{
				onResponse: (event: any) => {
					if (event.value) {
						setInputValue((prevValue) => {
							const newText = event.value
							const newTextWithNewline = newText + "\n"
							return prevValue ? `${prevValue}\n${newTextWithNewline}` : newTextWithNewline
						})
						setTimeout(() => {
							if (textAreaRef.current) {
								textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight
								textAreaRef.current.focus()
							}
						}, 0)
					}
				},
				onError: (error: any) => {
					console.error("Error in addToInput subscription:", error)
				},
				onComplete: () => {
					console.log("addToInput subscription completed")
				},
			},
		)
		return cleanup
	}, [setInputValue, textAreaRef])
}

import { memo, useEffect, useRef } from "react"
import { useSize } from "react-use"
import { ChatRowContent } from "./ChatRowContent/ChatRowContent"
import { ChatRowProps } from "./types"

const ChatRow = memo(
	(props: ChatRowProps) => {
		const { isLast, onHeightChange, message } = props
		const prevHeightRef = useRef(0)

		const [chatrow, { height }] = useSize(
			<div className="relative pt-2.5 px-4 group transition-all duration-300 hover:bg-white/5">
				<ChatRowContent {...props} />
			</div>,
		)

		useEffect(() => {
			const isInitialRender = prevHeightRef.current === 0
			if (isLast && height !== 0 && height !== Number.POSITIVE_INFINITY && height !== prevHeightRef.current) {
				if (!isInitialRender) {
					onHeightChange(height > prevHeightRef.current)
				}
				prevHeightRef.current = height
			}
		}, [height, isLast, onHeightChange, message])

		return chatrow
	},
	(prevProps, nextProps) => {
		return (
			prevProps.message === nextProps.message &&
			prevProps.isLast === nextProps.isLast &&
			prevProps.isExpanded === nextProps.isExpanded &&
			prevProps.isRequestInProgress === nextProps.isRequestInProgress &&
			prevProps.inputValue === nextProps.inputValue &&
			prevProps.mode === nextProps.mode &&
			prevProps.reasoningContent === nextProps.reasoningContent &&
			prevProps.responseStarted === nextProps.responseStarted &&
			prevProps.lastModifiedMessage === nextProps.lastModifiedMessage
		)
	},
)

export default ChatRow

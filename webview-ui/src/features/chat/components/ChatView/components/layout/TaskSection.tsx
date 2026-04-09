import { DiracMessage } from "@shared/ExtensionMessage"
import React from "react"
import TaskHeader from "@/features/chat/components/TaskHeader/TaskHeader"
import { MessageHandlers } from "../../types/chatTypes"

interface TaskSectionProps {
	task: DiracMessage
	apiMetrics: {
		totalCost: number
	}
	messageHandlers: MessageHandlers
	lastProgressMessageText?: string
	showFocusChainPlaceholder?: boolean
}

/**
 * Task section shown when there's an active task
 * Includes the task header and manages task-specific UI
 */
export const TaskSection: React.FC<TaskSectionProps> = ({
	task,
	apiMetrics,
	messageHandlers,
	lastProgressMessageText,
	showFocusChainPlaceholder,
}) => {
	return (
		<TaskHeader
			lastProgressMessageText={lastProgressMessageText}
			onClose={messageHandlers.handleTaskCloseButtonClick}
			onSendMessage={messageHandlers.handleSendMessage}
			showFocusChainPlaceholder={showFocusChainPlaceholder}
			task={task}
			totalCost={apiMetrics.totalCost}
		/>
	)
}

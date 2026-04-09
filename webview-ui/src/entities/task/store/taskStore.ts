import type { HistoryItem } from "@shared/HistoryItem"
import { create } from "zustand"

interface TaskState {
	taskHistory: HistoryItem[]
	totalTasksSize: number | null
	currentTaskItem?: HistoryItem

	// Actions
	setTaskHistory: (history: HistoryItem[]) => void
	setTotalTasksSize: (size: number | null) => void
	setCurrentTaskItem: (item?: HistoryItem) => void
}

export const useTaskStore = create<TaskState>((set) => ({
	taskHistory: [],
	totalTasksSize: null,
	currentTaskItem: undefined,

	setTaskHistory: (history) => set({ taskHistory: history }),
	setTotalTasksSize: (size) => set({ totalTasksSize: size }),
	setCurrentTaskItem: (item) => set({ currentTaskItem: item }),
}))

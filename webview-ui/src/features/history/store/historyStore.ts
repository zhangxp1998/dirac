import type { HistoryItem } from "@shared/HistoryItem"
import { create } from "zustand"

interface HistoryState {
	taskHistory: HistoryItem[]
	totalTasksSize: number | null

	// Actions
	setTaskHistory: (history: HistoryItem[]) => void
	setTotalTasksSize: (size: number | null) => void
}

export const useHistoryStore = create<HistoryState>((set) => ({
	taskHistory: [],
	totalTasksSize: null,

	setTaskHistory: (history) => set({ taskHistory: history }),
	setTotalTasksSize: (size) => set({ totalTasksSize: size }),
}))

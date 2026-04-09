import { create } from "zustand"

interface UserState {
	userInfo?: any
	activeOrganization: any | null

	// Actions
	setUserInfo: (info?: any) => void
}

export const useUserStore = create<UserState>((set) => ({
	userInfo: undefined,
	activeOrganization: null,

	setUserInfo: (info) => set({ userInfo: info }),
}))

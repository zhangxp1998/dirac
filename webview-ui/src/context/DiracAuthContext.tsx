import type React from "react"
import { createContext, useContext } from "react"

// Define User type (you may need to adjust this based on your actual User type)
export interface DiracUser {
	uid: string
	email?: string
	displayName?: string
	photoUrl?: string
	appBaseUrl?: string
}

export interface DiracAuthContextType {
	diracUser: DiracUser | null
	organizations: any[] | null
	activeOrganization: any | null
}

export const DiracAuthContext = createContext<DiracAuthContextType | undefined>(undefined)

export const DiracAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<DiracAuthContext.Provider
			value={{
				diracUser: null,
				organizations: null,
				activeOrganization: null,
			}}>
			{children}
		</DiracAuthContext.Provider>
	)
}

export const useDiracAuth = () => {
	const context = useContext(DiracAuthContext)
	if (context === undefined) {
		throw new Error("useDiracAuth must be used within a DiracAuthProvider")
	}
	return context
}

export const useDiracSignIn = () => {
	return {
		isLoginLoading: false,
		handleSignIn: () => {},
	}
}

export const handleSignOut = async () => {}

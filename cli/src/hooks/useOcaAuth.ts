/**
 * Hook for OCA OAuth authentication flow in the CLI.
 * Handles starting auth, subscribing to status updates, and notifying on success.
 */

import type { Controller } from "@/core/controller"

interface UseOcaAuthOptions {
	controller: Controller | undefined
	/** If provided, controls when subscription is active (for external state management like AuthView's step) */
	enabled?: boolean
	onSuccess?: () => void | Promise<void>
	onError?: (error: Error) => void
}

interface UseOcaAuthResult {
	/** Whether we're waiting for auth to complete (only relevant when not using `enabled` prop) */
	isWaiting: boolean
	/** Start the OAuth flow - opens browser */
	startAuth: () => void
	/** Cancel waiting for auth */
	cancelAuth: () => void
	/** The authenticated user, if any */
	user: any | null
	/** Whether user is currently authenticated */
	isAuthenticated: boolean
}

export function useOcaAuth({ controller, enabled, onSuccess, onError }: UseOcaAuthOptions): UseOcaAuthResult {
	return {
		isWaiting: false,
		startAuth: () => {},
		cancelAuth: () => {},
		user: null,
		isAuthenticated: false,
	}
}

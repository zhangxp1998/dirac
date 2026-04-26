import { Box, Text, useInput } from "ink"
import Spinner from "ink-spinner"
import React, { useCallback, useEffect, useState } from "react"
import { githubCopilotAuthManager } from "@/integrations/github-copilot/auth"
import { openExternal } from "@/utils/env"
import { COLORS } from "../constants/colors"
import { useStdinContext } from "../context/StdinContext"

interface GithubAuthViewProps {
	onComplete: () => void
	onCancel: () => void
}

export const GithubAuthView: React.FC<GithubAuthViewProps> = ({ onComplete, onCancel }) => {
	const { isRawModeSupported } = useStdinContext()
	const [step, setStep] = useState<"initiating" | "waiting" | "success" | "error">("initiating")
	const [authData, setAuthData] = useState<{
		verification_uri: string
		user_code: string
		device_code: string
		interval: number
	} | null>(null)
	const [errorMessage, setErrorMessage] = useState("")

	const startAuth = useCallback(async () => {
		try {
			setStep("initiating")
			const data = await githubCopilotAuthManager.initiateDeviceFlow()
			setAuthData(data)
			setStep("waiting")

			// Open browser
			await openExternal(data.verification_uri)

			// Start polling
			await githubCopilotAuthManager.pollForToken(data.device_code, data.interval)
			setStep("success")
			setTimeout(onComplete, 1500)
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : String(error))
			setStep("error")
		}
	}, [onComplete])

	useEffect(() => {
		startAuth()
	}, [startAuth])

	useInput(
		(_, key) => {
			if (key.escape) {
				onCancel()
			}
		},
		{ isActive: isRawModeSupported },
	)

	return (
		<Box flexDirection="column" padding={1}>
			{step === "initiating" && (
				<Box>
					<Text color={COLORS.primaryBlue}>
						<Spinner type="dots" />
					</Text>
					<Text color="white"> Initiating GitHub authentication...</Text>
				</Box>
			)}

			{step === "waiting" && authData && (
				<Box flexDirection="column">
					<Box>
						<Text color={COLORS.primaryBlue}>
							<Spinner type="dots" />
						</Text>
						<Text color="white"> Waiting for GitHub authorization...</Text>
					</Box>
					<Text> </Text>
					<Text color="white">1. Open: </Text>
					<Text color="cyan" bold underline>
						{authData.verification_uri}
					</Text>
					<Text> </Text>
					<Text color="white">2. Enter code: </Text>
					<Text color="yellow" bold>
						{authData.user_code}
					</Text>
					<Text> </Text>
					<Text color="gray">The browser should have opened automatically.</Text>
					<Text color="gray">Press Esc to cancel.</Text>
				</Box>
			)}

			{step === "success" && (
				<Box>
					<Text color="green">✔</Text>
					<Text color="white"> Successfully authenticated with GitHub Copilot!</Text>
				</Box>
			)}

			{step === "error" && (
				<Box flexDirection="column">
					<Text color="red" bold>
						Authentication Error
					</Text>
					<Text color="white">{errorMessage}</Text>
					<Text> </Text>
					<Text color="gray">Press Esc to go back.</Text>
				</Box>
			)}
		</Box>
	)
}

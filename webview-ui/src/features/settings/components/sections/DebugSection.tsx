import { useSettingsStore } from "@/features/settings/store/settingsStore"
import { StateServiceClient } from "@/shared/api/grpc-client"
import { Button } from "@/shared/ui/button"
import Section from "../Section"

interface DebugSectionProps {
	onResetState: (resetGlobalState?: boolean) => Promise<void>
	renderSectionHeader: (tabId: string) => JSX.Element | null
}

const DebugSection = ({ onResetState, renderSectionHeader }: DebugSectionProps) => {
	const { setShowWelcome } = useSettingsStore()
	return (
		<div>
			{renderSectionHeader("debug")}
			<Section>
				<Button onClick={() => onResetState()} variant="error">
					Reset Workspace State
				</Button>
				<Button onClick={() => onResetState(true)} variant="error">
					Reset Global State
				</Button>
				<p className="text-xs mt-[5px] text-(--vscode-descriptionForeground)">
					This will reset all global state and secret storage in the extension.
				</p>
			</Section>
			<Section>
				<Button
					onClick={async () =>
						await StateServiceClient.setWelcomeViewCompleted({ value: false })
							.catch(() => {})
							.finally(() => setShowWelcome(true))
					}
					variant="secondary">
					Reset Onboarding State
				</Button>
			</Section>
		</div>
	)
}

export default DebugSection

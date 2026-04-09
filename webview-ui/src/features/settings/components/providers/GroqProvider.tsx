import { Mode } from "@shared/ExtensionMessage"
import { useSettingsStore } from "@/features/settings/store/settingsStore"
import { ApiKeyField } from "../common/ApiKeyField"
import GroqModelPicker from "../GroqModelPicker"
import { useApiConfigurationHandlers } from "../utils/useApiConfigurationHandlers"

/**
 * Props for the GroqProvider component
 */
interface GroqProviderProps {
	showModelOptions: boolean
	isPopup?: boolean
	currentMode: Mode
}

/**
 * The Groq provider configuration component
 */
export const GroqProvider = ({ showModelOptions, isPopup, currentMode }: GroqProviderProps) => {
	const { apiConfiguration } = useSettingsStore()
	const { handleFieldChange } = useApiConfigurationHandlers()

	return (
		<div>
			<ApiKeyField
				initialValue={apiConfiguration?.groqApiKey || ""}
				onChange={(value: string) => handleFieldChange("groqApiKey", value)}
				providerName="Groq"
				signupUrl="https://console.groq.com/keys"
			/>

			{showModelOptions && <GroqModelPicker currentMode={currentMode} isPopup={isPopup} />}
		</div>
	)
}

import { Mode } from "@shared/ExtensionMessage"
import { useSettingsStore } from "@/features/settings/store/settingsStore"
import BasetenModelPicker from "../BasetenModelPicker"
import { ApiKeyField } from "../common/ApiKeyField"
import { useApiConfigurationHandlers } from "../utils/useApiConfigurationHandlers"

/**
 * Props for the BasetenProvider component
 */
interface BasetenProviderProps {
	showModelOptions: boolean
	isPopup?: boolean
	currentMode: Mode
}

/**
 * The Baseten provider configuration component
 */
export const BasetenProvider = ({ showModelOptions, isPopup, currentMode }: BasetenProviderProps) => {
	const { apiConfiguration } = useSettingsStore()
	const { handleFieldChange } = useApiConfigurationHandlers()

	return (
		<div>
			<ApiKeyField
				initialValue={apiConfiguration?.basetenApiKey || ""}
				onChange={(value: string) => handleFieldChange("basetenApiKey", value)}
				providerName="Baseten"
				signupUrl="https://app.baseten.co/settings/api_keys"
			/>

			{showModelOptions && <BasetenModelPicker currentMode={currentMode} isPopup={isPopup} />}
		</div>
	)
}

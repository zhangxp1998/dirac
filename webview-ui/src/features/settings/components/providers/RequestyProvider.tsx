import { toRequestyServiceUrl } from "@shared/clients/requesty"
import { Mode } from "@shared/ExtensionMessage"
import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react"
import { useState } from "react"
import { useSettingsStore } from "@/features/settings/store/settingsStore"
import { ApiKeyField } from "../common/ApiKeyField"
import { DebouncedTextField } from "../common/DebouncedTextField"
import RequestyModelPicker from "../RequestyModelPicker"
import { useApiConfigurationHandlers } from "../utils/useApiConfigurationHandlers"

/**
 * Props for the RequestyProvider component
 */
interface RequestyProviderProps {
	showModelOptions: boolean
	isPopup?: boolean
	currentMode: Mode
}

/**
 * The Requesty provider configuration component
 */
export const RequestyProvider = ({ showModelOptions, isPopup, currentMode }: RequestyProviderProps) => {
	const { apiConfiguration } = useSettingsStore()
	const { handleFieldChange } = useApiConfigurationHandlers()

	const [requestyEndpointSelected, setRequestyEndpointSelected] = useState(!!apiConfiguration?.requestyBaseUrl)

	const resolvedUrl = toRequestyServiceUrl(apiConfiguration?.requestyBaseUrl, "app")
	const apiKeyUrl = resolvedUrl != null ? new URL("api-keys", resolvedUrl).toString() : undefined

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<ApiKeyField
				initialValue={apiConfiguration?.requestyApiKey || ""}
				onChange={(value: string) => handleFieldChange("requestyApiKey", value)}
				providerName="Requesty"
				signupUrl={apiKeyUrl}
			/>
			<VSCodeCheckbox
				checked={requestyEndpointSelected}
				onChange={(e: any) => {
					const isChecked = e.target.checked === true
					setRequestyEndpointSelected(isChecked)

					if (!isChecked) {
						handleFieldChange("requestyBaseUrl", undefined)
					}
				}}>
				Use custom base URL
			</VSCodeCheckbox>
			{requestyEndpointSelected && (
				<DebouncedTextField
					initialValue={apiConfiguration?.requestyBaseUrl ?? ""}
					onChange={(value: string) => {
						if (value.length === 0) {
							handleFieldChange("requestyBaseUrl", undefined)
						} else {
							handleFieldChange("requestyBaseUrl", value)
						}
					}}
					placeholder="Custom base URL"
					style={{ width: "100%", marginBottom: 5 }}
					type="text"
				/>
			)}
			{showModelOptions && (
				<RequestyModelPicker baseUrl={apiConfiguration?.requestyBaseUrl} currentMode={currentMode} isPopup={isPopup} />
			)}
		</div>
	)
}

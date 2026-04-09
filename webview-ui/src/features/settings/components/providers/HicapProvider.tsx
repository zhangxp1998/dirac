import { Mode } from "@shared/ExtensionMessage"
import { useEffect } from "react"
import { useSettingsStore } from "@/features/settings/store/settingsStore"
import { DebouncedTextField } from "../common/DebouncedTextField"
import HicapModelPicker from "../HicapModelPicker"
import { useApiConfigurationHandlers } from "../utils/useApiConfigurationHandlers"

/**
 * Props for the HicapProvider component
 */
interface HicapProviderProps {
	showModelOptions: boolean
	isPopup?: boolean
	currentMode: Mode
}

/**
 * The Hicap provider configuration component
 */
export const HicapProvider = ({ showModelOptions, isPopup, currentMode }: HicapProviderProps) => {
	const { apiConfiguration, refreshHicapModels } = useSettingsStore()
	const { handleFieldChange } = useApiConfigurationHandlers()

	useEffect(() => {
		if (apiConfiguration?.hicapApiKey && apiConfiguration?.hicapApiKey.length === 32) {
			refreshHicapModels()
		}
	}, [apiConfiguration?.hicapApiKey])

	return (
		<div>
			<div>
				<DebouncedTextField
					initialValue={apiConfiguration?.hicapApiKey || ""}
					onChange={(value: string) => {
						handleFieldChange("hicapApiKey", value)
						if (value.length === 32) {
							refreshHicapModels()
						}
					}}
					placeholder="Enter API Key..."
					style={{ width: "100%" }}
					type="password">
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							width: "100%",
							margin: "10px 0 0 0",
						}}>
						<span style={{ fontWeight: 500 }}>Hicap API Key</span>
					</div>
				</DebouncedTextField>
			</div>

			{showModelOptions && (
				<div style={{ margin: "10px 0 0 0" }}>
					<HicapModelPicker currentMode={currentMode} isPopup={isPopup} />
				</div>
			)}
		</div>
	)
}

import { DEFAULT_AUTO_APPROVAL_SETTINGS } from "@shared/AutoApprovalSettings"
import { DEFAULT_BROWSER_SETTINGS } from "@shared/BrowserSettings"
import { Environment } from "@shared/config-types"
import type { DiracMessage, ExtensionState } from "@shared/ExtensionMessage"
import { DEFAULT_PLATFORM } from "@shared/ExtensionMessage"
import { create } from "zustand"

interface SettingsState {
	version: string
	apiConfiguration: any
	navigateToAccount: () => void
	setShowWelcome: (show: boolean) => void
	availableTerminalProfiles: any[]
	hicapModels: any
	refreshHicapModels: () => void
	diracModels: any
	refreshDiracModels: () => void
	openRouterModels: any
	refreshOpenRouterModels: () => void
	vercelAiGatewayModels: any
	refreshVercelAiGatewayModels: () => void
	liteLlmModels: any
	refreshLiteLlmModels: () => void
	basetenModels: any
	groqModels: any
	huggingFaceModels: any
	requestyModels: any
	openAiCodexIsAuthenticated: boolean
	openAiCodexEmail?: string
	autoApprovalSettings: ExtensionState["autoApprovalSettings"]
	browserSettings: ExtensionState["browserSettings"]
	preferredLanguage: string
	mode: string
	platform: string
	environment: Environment
	telemetrySetting: string
	distinctId: string
	planActSeparateModelsSetting: boolean
	enableCheckpointsSetting: boolean
	shellIntegrationTimeout: number
	terminalReuseEnabled: boolean
	vscodeTerminalExecutionMode: string
	terminalOutputLineLimit: number
	maxConsecutiveMistakes: number
	defaultTerminalProfile: string
	isNewUser: boolean
	welcomeViewCompleted: boolean
	strictPlanModeEnabled: boolean
	yoloModeToggled: boolean
	customPrompt?: string
	useAutoCondense: boolean
	subagentsEnabled: boolean
	diracWebToolsEnabled: { user: boolean; featureFlag: boolean }
	worktreesEnabled: { user: boolean; featureFlag: boolean }
	favoritedModelIds: string[]
	lastDismissedInfoBannerVersion: number
	lastDismissedModelBannerVersion: number
	optOutOfRemoteConfig: boolean
	remoteConfigSettings: Record<string, any>
	backgroundCommandRunning: boolean
	backgroundCommandTaskId?: string
	lastDismissedCliBannerVersion: number
	backgroundEditEnabled: boolean
	doubleCheckCompletionEnabled: boolean

	// Toggles
	globalDiracRulesToggles: Record<string, boolean>
	localDiracRulesToggles: Record<string, boolean>
	localCursorRulesToggles: Record<string, boolean>
	localWindsurfRulesToggles: Record<string, boolean>
	localAgentsRulesToggles: Record<string, boolean>
	localWorkflowToggles: Record<string, boolean>
	globalWorkflowToggles: Record<string, boolean>
	globalSkillsToggles: Record<string, boolean>
	localSkillsToggles: Record<string, boolean>
	remoteRulesToggles: Record<string, boolean>
	remoteWorkflowToggles: Record<string, boolean>

	// Workspace
	workspaceRoots: any[]
	primaryRootIndex: number
	isMultiRootWorkspace: boolean
	multiRootSetting: { user: boolean; featureFlag: boolean }
	hooksEnabled: boolean
	triggerNativeToolCall: boolean
	nativeToolCallSetting: boolean
	enableParallelToolCalling: boolean
	writePromptMetadataEnabled: boolean
	writePromptMetadataDirectory?: string

	// Chat & History (Moved from other stores)
	diracMessages: DiracMessage[]
	taskHistory: any[]
	currentTaskItem?: any
	checkpointManagerErrorMessage?: string
	expandTaskHeader: boolean
	totalTasksSize: number
	dismissedBanners: any[]
	banners: any[]
	welcomeBanners: any[]

	// Navigation Actions
	navigateToSettings: (section?: string) => void
	navigateToSettingsModelPicker: (options: { targetSection?: string }) => void
	navigateToHistory: () => void
	navigateToChat: () => void
	navigateToWorktrees: () => void
	onRelinquishControl: (callback: () => void) => () => void

	// Actions
	setSettings: (settings: Partial<SettingsState>) => void
	setDiracMessages: (messages: DiracMessage[]) => void
	updatePartialMessage: (message: DiracMessage) => void
	setTaskHistory: (history: any[]) => void
	setExpandTaskHeader: (expand: boolean) => void
	setTotalTasksSize: (size: number) => void
	setGlobalDiracRulesToggles: (toggles: Record<string, boolean>) => void
	setLocalDiracRulesToggles: (toggles: Record<string, boolean>) => void
	setLocalCursorRulesToggles: (toggles: Record<string, boolean>) => void
	setLocalWindsurfRulesToggles: (toggles: Record<string, boolean>) => void
	setLocalAgentsRulesToggles: (toggles: Record<string, boolean>) => void
	setLocalWorkflowToggles: (toggles: Record<string, boolean>) => void
	setGlobalWorkflowToggles: (toggles: Record<string, boolean>) => void
	setGlobalSkillsToggles: (toggles: Record<string, boolean>) => void
	setLocalSkillsToggles: (toggles: Record<string, boolean>) => void
	setRemoteRulesToggles: (toggles: Record<string, boolean>) => void
	setRemoteWorkflowToggles: (toggles: Record<string, boolean>) => void
	setGroqModels: (models: any) => void
	setHuggingFaceModels: (models: any) => void
	setRequestyModels: (models: any) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
	autoApprovalSettings: DEFAULT_AUTO_APPROVAL_SETTINGS,
	browserSettings: DEFAULT_BROWSER_SETTINGS,
	preferredLanguage: "English",
	mode: "act",
	platform: DEFAULT_PLATFORM,
	environment: Environment.production,
	telemetrySetting: "unset",
	distinctId: "",
	planActSeparateModelsSetting: true,
	enableCheckpointsSetting: true,
	shellIntegrationTimeout: 4000,
	terminalReuseEnabled: true,
	vscodeTerminalExecutionMode: "vscodeTerminal",
	terminalOutputLineLimit: 500,
	maxConsecutiveMistakes: 3,
	defaultTerminalProfile: "default",
	isNewUser: false,
	welcomeViewCompleted: false,
	strictPlanModeEnabled: false,
	yoloModeToggled: false,
	customPrompt: undefined,
	useAutoCondense: false,
	subagentsEnabled: false,
	diracWebToolsEnabled: { user: true, featureFlag: false },
	worktreesEnabled: { user: true, featureFlag: false },
	favoritedModelIds: [],
	lastDismissedInfoBannerVersion: 0,
	lastDismissedModelBannerVersion: 0,
	optOutOfRemoteConfig: false,
	remoteConfigSettings: {},
	backgroundCommandRunning: false,
	backgroundCommandTaskId: undefined,
	lastDismissedCliBannerVersion: 0,
	backgroundEditEnabled: false,
	doubleCheckCompletionEnabled: false,

	globalDiracRulesToggles: {},
	localDiracRulesToggles: {},
	localCursorRulesToggles: {},
	localWindsurfRulesToggles: {},
	localAgentsRulesToggles: {},
	localWorkflowToggles: {},
	globalWorkflowToggles: {},
	globalSkillsToggles: {},
	localSkillsToggles: {},
	assertion: {},
	remoteRulesToggles: {},
	remoteWorkflowToggles: {},

	workspaceRoots: [],
	primaryRootIndex: 0,
	isMultiRootWorkspace: false,
	multiRootSetting: { user: false, featureFlag: false },
	hooksEnabled: false,
	nativeToolCallSetting: false,
	enableParallelToolCalling: false,
	writePromptMetadataEnabled: false,
	writePromptMetadataDirectory: undefined,

	version: "0.0.0",
	apiConfiguration: {},
	navigateToAccount: () => {},
	setShowWelcome: () => {},
	availableTerminalProfiles: [],
	hicapModels: {},
	refreshHicapModels: () => {},
	diracModels: {},
	refreshDiracModels: () => {},
	openRouterModels: {},
	refreshOpenRouterModels: () => {},
	like: {},
	vercelAiGatewayModels: {},
	refreshVercelAiGatewayModels: () => {},
	prototype: {},
	liteLlmModels: {},
	refreshLiteLlmModels: () => {},
	basetenModels: {},
	groqModels: {},
	huggingFaceModels: {},
	requestyModels: {},
	openAiCodexIsAuthenticated: false,
	openAiCodexEmail: undefined,

	triggerNativeToolCall: false,
	diracMessages: [],
	taskHistory: [],
	currentTaskItem: undefined,
	checkpointManagerErrorMessage: undefined,
	expandTaskHeader: false,
	totalTasksSize: 0,
	dismissedBanners: [],
	banners: [],
	welcomeBanners: [],
	navigateToSettings: () => {},
	navigateToSettingsModelPicker: () => {},
	navigateToHistory: () => {},
	navigateToChat: () => {},
	navigateToWorktrees: () => {},
	onRelinquishControl: () => () => {},
	setDiracMessages: (messages) => set({ diracMessages: messages }),
	updatePartialMessage: (message) =>
		set((state) => {
			const lastIndex = state.diracMessages.findLastIndex((msg) => msg.ts === message.ts)
			if (lastIndex !== -1) {
				const newMessages = [...state.diracMessages]
				newMessages[lastIndex] = message
				return { diracMessages: newMessages }
			}
			return state
		}),
	setTaskHistory: (history) => set({ taskHistory: history }),
	setExpandTaskHeader: (expand) => set({ expandTaskHeader: expand }),
	setTotalTasksSize: (size) => set({ totalTasksSize: size }),
	setGlobalDiracRulesToggles: (toggles) => set({ globalDiracRulesToggles: toggles }),
	setLocalDiracRulesToggles: (toggles) => set({ localDiracRulesToggles: toggles }),
	setLocalCursorRulesToggles: (toggles) => set({ localCursorRulesToggles: toggles }),
	setLocalWindsurfRulesToggles: (toggles) => set({ localWindsurfRulesToggles: toggles }),
	setLocalAgentsRulesToggles: (toggles) => set({ localAgentsRulesToggles: toggles }),
	setLocalWorkflowToggles: (toggles) => set({ localWorkflowToggles: toggles }),
	setGlobalWorkflowToggles: (toggles) => set({ globalWorkflowToggles: toggles }),
	setGlobalSkillsToggles: (toggles) => set({ globalSkillsToggles: toggles }),
	setLocalSkillsToggles: (toggles) => set({ localSkillsToggles: toggles }),
	setRemoteRulesToggles: (toggles) => set({ remoteRulesToggles: toggles }),
	setRemoteWorkflowToggles: (toggles) => set({ remoteWorkflowToggles: toggles }),
	setGroqModels: () => {},
	setHuggingFaceModels: () => {},
	setRequestyModels: () => {},
	setSettings: (settings) =>
		set((state) => {
			return { ...state, ...settings }
		}),
}))

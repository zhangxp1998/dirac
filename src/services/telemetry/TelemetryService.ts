import { HostProvider } from "@hosts/host-provider"
import type { BrowserSettings } from "@shared/BrowserSettings"
import { ApiFormat, apiFormatToJSON } from "@shared/proto/dirac/models"
import { ShowMessageType } from "@shared/proto/host/window"
import type { TaskFeedbackType } from "@shared/WebviewMessage"
import * as os from "os"
import { Setting } from "@/shared/proto/index.host"
import { Logger } from "@/shared/services/Logger"
import { Mode } from "@/shared/storage/types"
import { version as extensionVersion } from "../../../package.json"
import type { ITelemetryProvider, TelemetryProperties } from "./providers/ITelemetryProvider"
import { TelemetryProviderFactory } from "./TelemetryProviderFactory"

/**
 * Represents telemetry event categories that can be individually enabled or disabled
 * When adding a new category, add it both here and to the initial values in telemetryCategoryEnabled
 * Ensure `if (!this.isCategoryEnabled('<category_name>')` is added to the capture method
 */
type TelemetryCategory = "checkpoints" | "browser" | "subagents" | "skills" | "hooks"

/**
 * Terminal type for telemetry differentiation
 */
export type TerminalType = "vscode" | "standalone"

/**
 * VSCode-specific output capture methods
 */
export type VscodeOutputMethod = "shell_integration" | "clipboard" | "none"

/**
 * Standalone-specific output capture methods
 */
export type StandaloneOutputMethod = "child_process" | "child_process_error"

/**
 * Combined type for terminal output methods
 */
export type TerminalOutputMethod = VscodeOutputMethod | StandaloneOutputMethod

/**
 * Enum for terminal output failure reasons
 */
export enum TerminalOutputFailureReason {
	TIMEOUT = "timeout",
	NO_SHELL_INTEGRATION = "no_shell_integration",
	CLIPBOARD_FAILED = "clipboard_failed",
}

/**
 * Enum for terminal user intervention actions
 */
export enum TerminalUserInterventionAction {
	PROCESS_WHILE_RUNNING = "process_while_running",
	MANUAL_PASTE = "manual_paste",
	CANCELLED = "cancelled",
}

/**
 * Enum for terminal hang stages
 */
export enum TerminalHangStage {
	WAITING_FOR_COMPLETION = "waiting_for_completion",
	BUFFER_STUCK = "buffer_stuck",
	STREAM_TIMEOUT = "stream_timeout",
}

export type TelemetryMetadata = {
	/**
	 * The extension or dirac-core version. JetBrains and CLI have different
	 * versioning than the VSCode Extension, but on those platforms this will be the _dirac-core version_
	 * which uses the same as the versioning as the VSCode extension.
	 */
	extension_version: string
	/**
	 * The type of dirac distribution, e.g VSCode Extension, JetBrains Plugin or CLI. This
	 * is different than the `platform` because there are many variants of VSCode and JetBrains but they
	 * all use the same extension or plugin.
	 */
	dirac_type: string
	/** The name of the host IDE or environment e.g. VSCode, Cursor, IntelliJ Professional Edition, etc. */
	platform: string
	/** The version of the host environment */
	platform_version: string
	/** The operating system type, e.g. darwin, win32. This is the value returned by os.platform() */
	os_type: string
	/** The operating system version e.g. 'Windows 10 Pro', 'Darwin Kernel Version 21.6.0...'
	 * This is the value returned by os.version() */
	os_version: string
	/** Whether the extension is running in development mode */
	is_dev: string | undefined
}

/**
 * Token usage data shared across telemetry capture methods.
 * Used by both `captureTokenUsage` and `captureConversationTurnEvent`.
 */
export interface TokenUsage {
	tokensIn?: number
	tokensOut?: number
	cacheWriteTokens?: number
	cacheReadTokens?: number
	totalCost?: number
}

/**
 * Maximum length for error messages to prevent excessive data
 */
const MAX_ERROR_MESSAGE_LENGTH = 500

/**
 * TelemetryService handles telemetry event tracking for the Dirac extension
 * Uses an abstracted telemetry provider to support multiple analytics backends
 * Respects user privacy settings and VSCode's global telemetry configuration
 */
export class TelemetryService {
	public static readonly METRICS = {}
	private static readonly EVENTS = {}
	private telemetryCategoryEnabled = new Map<string, boolean>()
	private userId?: string
	private activeOrg: any = null
	private grpcResponseCount = 0
	private taskTurnCounts = new Map<string, number>()
	private taskToolCallCounts = new Map<string, number>()
	private taskErrorCounts = new Map<string, number>()

	public static async create(): Promise<TelemetryService> {
		return new TelemetryService([], {
			extension_version: "0.0.0",
			platform: "unknown",
			platform_version: "unknown",
			dirac_type: "unknown",
			os_type: "unknown",
			os_version: "unknown",
			is_dev: undefined,
		})
	}

	constructor(
		private providers: ITelemetryProvider[],
		private telemetryMetadata: TelemetryMetadata,
	) {}

	public addProvider(_provider: ITelemetryProvider) {}
	public removeProvider(_name: string) {}
	public async updateTelemetryState(_didUserOptIn: boolean): Promise<void> {}
	public captureUserOptOut(): void {}
	public captureUserOptIn(): void {}
	public capture(_event: { event: string; properties?: TelemetryProperties }): void {}
	public captureRequired(_event: string, _properties?: TelemetryProperties): void {}
	private captureToProviders(_event: string, _properties: TelemetryProperties, _required: boolean): void {}
	private getStandardAttributes(_extra?: TelemetryProperties): TelemetryProperties { return {} as any }
	private recordCounter(..._args: any[]): void {}
	private recordHistogram(..._args: any[]): void {}
	private recordGauge(..._args: any[]): void {}
	private incrementTaskCounter(_store: Map<string, number>, _ulid: string): number { return 0 }
	private resetTaskAggregates(_ulid: string): void {}
	public captureExtensionActivated() {}
	public captureExtensionStorageError(_errorMessage: string, _eventName: string) {}
	public captureAuthStarted(_provider?: string) {}
	public captureAuthSucceeded(_provider?: string) {}
	public captureAuthFailed(_provider?: string) {}
	public captureAuthLoggedOut(_provider?: string, _reason?: string) {}
	public identifyAccount(_userInfo: any) {}
	public captureTaskCreated(_ulid: string, _apiProvider?: string, _openAiCompatibleDomain?: string) {}
	public captureTaskRestarted(_ulid: string, _apiProvider?: string, _openAiCompatibleDomain?: string) {}
	public captureTaskCompleted(..._args: any[]) {}
	public captureConversationTurnEvent(..._args: any[]) {}
	public captureTokenUsage(..._args: any[]) {}
	public captureModeSwitch(_ulid: string, _mode: Mode) {}
	public captureSummarizeTask(..._args: any[]) {}
	public captureTaskFeedback(_ulid: string, _feedbackType: TaskFeedbackType) {}
	public captureToolUsage(..._args: any[]) {}
	public captureSkillUsed(..._args: any[]) {}
	public captureCheckpointUsage(..._args: any[]) {}
	public captureModelSelected(..._args: any[]) {}
	public captureBrowserToolStart(..._args: any[]) {}
	public captureBrowserToolEnd(..._args: any[]) {}
	public captureBrowserError(..._args: any[]) {}
	public captureOptionSelected(..._args: any[]) {}
	public captureOptionsIgnored(..._args: any[]) {}
	public captureGeminiApiPerformance(..._args: any[]) {}
	public captureModelFavoritesUsage(..._args: any[]) {}
	public captureButtonClick(..._args: any[]) {}
	public captureProviderApiError(..._args: any[]) {}
	public captureSlashCommandUsed(..._args: any[]) {}
	public captureFeatureToggle(..._args: any[]) {}
	public captureDiracRuleToggled(..._args: any[]) {}
	public captureAutoCondenseToggle(..._args: any[]) {}
	public captureYoloModeToggle(..._args: any[]) {}
	public captureDiracWebToolsToggle(..._args: any[]) {}
	public captureTaskInitialization(..._args: any[]) {}
	public captureRulesMenuOpened() {}
	public captureTerminalExecution(..._args: any[]) {}
	public captureTerminalOutputFailure(..._args: any[]) {}
	public captureTerminalUserIntervention(..._args: any[]) {}
	public captureTerminalHang(..._args: any[]) {}
	public captureWorkspaceInitialized(..._args: any[]) {}
	public captureWorkspaceInitError(..._args: any[]) {}
	public captureMultiRootCheckpoint(..._args: any[]) {}
	public captureWorkspacePathResolved(..._args: any[]) {}
	public captureWorkspaceSearchPattern(..._args: any[]) {}
	public captureWorktreeViewOpened(..._args: any[]) {}
	public captureWorktreeCreated(..._args: any[]) {}
	public captureWorktreeMergeAttempted(..._args: any[]) {}
	public isCategoryEnabled(_category: TelemetryCategory): boolean { return false }
	public getProviders(): ITelemetryProvider[] { return [] }
	public isEnabled(): boolean { return false }
	public getSettings() {
		return {
			hostEnabled: false,
			level: "off",
		}
	}
	public captureMentionUsed(..._args: any[]) {}
	public captureMentionFailed(..._args: any[]) {}
	public captureMentionSearchResults(..._args: any[]) {}
	public captureSubagentToggle(..._args: any[]) {}
	public captureSubagentExecution(..._args: any[]) {}
	public captureOnboardingProgress(..._args: any[]) {}
	public captureHookCacheAccess(..._args: any[]) {}
	public captureHookExecution(..._args: any[]) {}
	public captureHookDiscovery(..._args: any[]) {}
	public captureAiOutputAccepted(..._args: any[]) {}
	public captureAiOutputRejected(..._args: any[]) {}
	public captureHostEvent(..._args: any[]) {}
	public captureGrpcResponseSize(..._args: any[]): void {}
	public safeCapture(telemetryFn: () => void, _context?: string): void {
		try {
			telemetryFn()
		} catch (error) {
			// ignore
		}
	}
	public async dispose(): Promise<void> {}

}
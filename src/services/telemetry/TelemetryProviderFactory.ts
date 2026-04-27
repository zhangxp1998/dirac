import { DiracEndpoint } from "@/config"
import { isDiracTelemetryConfigValid, diracTelemetryConfig } from "@/shared/services/config/dirac-telemetry-config"
import { Logger } from "@/shared/services/Logger"
import type { ITelemetryProvider, TelemetryProperties, TelemetrySettings } from "./providers/ITelemetryProvider"
import { DiracTelemetryProvider } from "./providers/DiracTelemetryProvider"

/**
 * Supported telemetry provider types
 */
export type TelemetryProviderType = "dirac" | "no-op"

/**
 * Configuration for telemetry providers
 */
export type TelemetryProviderConfig =
	| { type: "dirac"; apiKey?: string; host?: string }
	/** OpenTelemetry collector
	 * @param config - Config for this specific collector
	 * @param bypassUserSettings - When true, telemetry is sent regardless of the user's Dirac telemetry opt-in/opt-out settings.
	 * This is used for:
	 * 	- User-controlled collectors configured via environment variables (e.g., DIRAC_OTEL_TELEMETRY_ENABLED).
	 * 	- Organization-controlled collectors configured via remote config.
	 */
	| { type: "no-op" }

/**
 * Factory class for creating telemetry providers
 * Allows easy switching between different analytics providers
 */
export class TelemetryProviderFactory {
	/**
	 * Creates multiple telemetry providers based on configuration
	 * Supports dual tracking during transition period
	 */
	public static async createProviders(): Promise<ITelemetryProvider[]> {
		const configs = TelemetryProviderFactory.getDefaultConfigs()
		const providers: ITelemetryProvider[] = []

		for (const config of configs) {
			try {
				const provider = await TelemetryProviderFactory.createProvider(config)
				providers.push(provider)
			} catch (error) {
				Logger.error(`Failed to create telemetry provider: ${config.type}`, error)
			}
		}

		// Always have at least a no-op provider
		if (providers.length === 0) {
			providers.push(new NoOpTelemetryProvider())
		}

		Logger.info("TelemetryProviderFactory: Created providers - " + providers.map((p) => p.name).join(", "))
		return providers
	}

	/**
	 * Creates a single telemetry provider based on the provided configuration
	 * @param config Configuration for the telemetry provider
	 * @returns ITelemetryProvider instance
	 */
	private static async createProvider(config: TelemetryProviderConfig): Promise<ITelemetryProvider> {
		switch (config.type) {
			case "dirac": {
				return await new DiracTelemetryProvider().initialize()
			}
			case "no-op":
				return new NoOpTelemetryProvider()
			default:
				Logger.error(`Unsupported telemetry provider type: ${(config as { type?: string }).type ?? "unknown"}`)
				return new NoOpTelemetryProvider()
		}
	}

	/**
	 * Gets the default telemetry provider configuration
	 * @returns Default configuration using available providers
	 */
	public static getDefaultConfigs(): TelemetryProviderConfig[] {
		const configs: TelemetryProviderConfig[] = []

		// Skip Dirac in selfHosted mode - enterprise customers should not send telemetry to Dirac
		if (!DiracEndpoint.isSelfHosted() && isDiracTelemetryConfigValid(diracTelemetryConfig)) {
			configs.push({ type: "dirac", ...diracTelemetryConfig })
		}

		// Skip build-time OTEL in selfHosted mode - enterprise customers should not send telemetry to Dirac's collector

		return configs.length > 0 ? configs : [{ type: "no-op" }]
	}
}

/**
 * No-operation telemetry provider for when telemetry is disabled
 * or for testing purposes
 */
export class NoOpTelemetryProvider implements ITelemetryProvider {
	readonly name = "NoOpTelemetryProvider"
	private isOptIn = true

	log(_event: string, _properties?: TelemetryProperties): void {
		Logger.log(`[NoOpTelemetryProvider] ${_event}: ${JSON.stringify(_properties)}`)
	}
	logRequired(_event: string, _properties?: TelemetryProperties): void {
		Logger.log(`[NoOpTelemetryProvider] REQUIRED ${_event}: ${JSON.stringify(_properties)}`)
	}
	identifyUser(_userInfo: any, _properties?: TelemetryProperties): void {
		Logger.info(`[NoOpTelemetryProvider] identifyUser - ${JSON.stringify(_userInfo)} - ${JSON.stringify(_properties)}`)
	}
	isEnabled(): boolean {
		return false
	}
	getSettings(): TelemetrySettings {
		return {
			hostEnabled: false,
			level: "off",
		}
	}
	recordCounter(
		_name: string,
		_value: number,
		_attributes?: TelemetryProperties,
		_description?: string,
		_required = false,
	): void {
		// no-op
	}
	recordHistogram(
		_name: string,
		_value: number,
		_attributes?: TelemetryProperties,
		_description?: string,
		_required = false,
	): void {
		// no-op
	}
	recordGauge(
		_name: string,
		_value: number | null,
		_attributes?: TelemetryProperties,
		_description?: string,
		_required = false,
	): void {
		// no-op
	}

	async forceFlush() {}
	async dispose(): Promise<void> {
		Logger.info(`[NoOpTelemetryProvider] Disposing (optIn=${this.isOptIn})`)
	}
}

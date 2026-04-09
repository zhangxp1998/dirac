import { DiracEndpoint } from "@/config"
import { isDiracTelemetryConfigValid, diracTelemetryConfig } from "@/shared/services/config/dirac-telemetry-config"
import { Logger } from "@/shared/services/Logger"
import type { FeatureFlagsAndPayloads, IFeatureFlagsProvider } from "./providers/IFeatureFlagsProvider"
import { DiracFeatureFlagsProvider } from "./providers/DiracFeatureFlagsProvider"

/**
 * Supported feature flags provider types
 */
export type FeatureFlagsProviderType = "dirac" | "no-op"

/**
 * Configuration for feature flags providers
 */
export interface FeatureFlagsProviderConfig {
	type: FeatureFlagsProviderType
}

/**
 * Factory class for creating feature flags providers
 * Allows easy switching between different feature flag providers
 */
export class FeatureFlagsProviderFactory {
	/**
	 * Creates a feature flags provider based on the provided configuration
	 * @param config Configuration for the feature flags provider
	 * @returns IFeatureFlagsProvider instance
	 */
	public static createProvider(config: FeatureFlagsProviderConfig): IFeatureFlagsProvider {
		switch (config.type) {
			case "dirac": {
				return new DiracFeatureFlagsProvider()
			}
			default:
				return new NoOpFeatureFlagsProvider()
		}
	}

	/**
	 * Gets the default feature flags provider configuration
	 * @returns Default configuration using Dirac, or no-op for self-hosted mode
	 */
	public static getDefaultConfig(): FeatureFlagsProviderConfig {
		// Use no-op provider in self-hosted mode to avoid external network calls
		if (DiracEndpoint.isSelfHosted()) {
			return { type: "no-op" }
		}
		const hasValidConfig = isDiracTelemetryConfigValid(diracTelemetryConfig)
		return {
			type: hasValidConfig ? "dirac" : "no-op",
		}
	}
}

/**
 * No-operation feature flags provider for when feature flags are disabled
 * or for testing purposes
 */
class NoOpFeatureFlagsProvider implements IFeatureFlagsProvider {
	async getAllFlagsAndPayloads(_: { flagKeys?: string[] }): Promise<FeatureFlagsAndPayloads | undefined> {
		return {}
	}

	public isEnabled(): boolean {
		return true
	}

	public getSettings() {
		return {
			enabled: true,
			timeout: 1000,
		}
	}

	public async dispose(): Promise<void> {
		Logger.info("[NoOpFeatureFlagsProvider] Disposing")
	}
}

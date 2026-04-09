import { Boolean } from "@shared/proto/dirac/common"
import { isDiracCliInstalled } from "@/utils/cli-detector"
import { Controller } from ".."

/**
 * Check if the Dirac CLI is installed
 * @param controller The controller instance
 * @returns Boolean indicating if CLI is installed
 */
export async function checkCliInstallation(_controller: Controller): Promise<Boolean> {
	try {
		const isInstalled = await isDiracCliInstalled()
		return Boolean.create({ value: isInstalled })
	} catch {
		return Boolean.create({ value: false })
	}
}

import { ensureCacheDirectoryExists, GlobalFileNames } from "@core/storage/disk"
import { fileExistsAtPath } from "@utils/fs"
import fs from "fs/promises"
import path from "path"
import { Logger } from "@/shared/services/Logger"

import type { ModelInfo } from "@shared/api"
import type { Controller } from ".."
import { refreshOpenRouterModels } from "./refreshOpenRouterModels"

export async function refreshDiracModels(controller: Controller): Promise<Record<string, ModelInfo>> {
	return refreshOpenRouterModels(controller)
}
/**
 * Read cached Dirac models from disk
 * @returns The cached models or undefined if not found
 */
export async function readDiracModelsFromCache(): Promise<Record<string, ModelInfo> | undefined> {
	try {
		const diracModelsFilePath = path.join(await ensureCacheDirectoryExists(), GlobalFileNames.diracModels)
		const fileExists = await fileExistsAtPath(diracModelsFilePath)
		if (fileExists) {
			const fileContents = await fs.readFile(diracModelsFilePath, "utf8")
			return JSON.parse(fileContents)
		}
	} catch (error) {
		Logger.error("Error reading Dirac models from cache:", error)
	}
	return undefined
}

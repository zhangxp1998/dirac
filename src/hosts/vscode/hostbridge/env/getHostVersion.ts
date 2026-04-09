import { EmptyRequest } from "@shared/proto/dirac/common"
import * as vscode from "vscode"
import { ExtensionRegistryInfo } from "@/registry"
import { DiracClient } from "@/shared/dirac"
import { GetHostVersionResponse } from "@/shared/proto/index.host"

export async function getHostVersion(_: EmptyRequest): Promise<GetHostVersionResponse> {
	return {
		platform: vscode.env.appName,
		version: vscode.version,
		diracType: DiracClient.VSCode,
		diracVersion: ExtensionRegistryInfo.version,
	}
}

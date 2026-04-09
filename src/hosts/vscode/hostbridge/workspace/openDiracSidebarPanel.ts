import * as vscode from "vscode"
import { ExtensionRegistryInfo } from "@/registry"
import { OpenDiracSidebarPanelRequest, OpenDiracSidebarPanelResponse } from "@/shared/proto/index.host"

export async function openDiracSidebarPanel(_: OpenDiracSidebarPanelRequest): Promise<OpenDiracSidebarPanelResponse> {
	await vscode.commands.executeCommand(`${ExtensionRegistryInfo.views.Sidebar}.focus`)
	return {}
}

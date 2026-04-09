import * as vscode from "vscode"
import { PrepareDiagnosticsRequest, PrepareDiagnosticsResponse } from "@/shared/proto/index.host"

export async function prepareDiagnostics(request: PrepareDiagnosticsRequest): Promise<PrepareDiagnosticsResponse> {
	try {
		await Promise.all(
			request.filePaths.map(async (filePath) => {
				try {
					await vscode.workspace.openTextDocument(vscode.Uri.file(filePath))
				} catch (error) {
					// Ignore errors opening documents
				}
			}),
		)
		return { success: true }
	} catch (error) {
		return { success: false }
	}
}

import { ApiProviderInfo } from "../../../core/api"
import { WorkspaceRootManager } from "../../../core/workspace/WorkspaceRootManager"
import { UrlContentFetcher } from "../../../services/browser/UrlContentFetcher"
import { FileContextTracker } from "../../context/context-tracking/FileContextTracker"
import { Controller } from "../../controller"
import { DiracIgnoreController } from "../../ignore/DiracIgnoreController"
import { StateManager } from "../../storage/StateManager"
import { FocusChainManager } from "../focus-chain"
import { TaskState } from "../TaskState"

export interface ContextLoaderDependencies {
	ulid: string
	stateManager: StateManager
	controller: Controller
	cwd: string
	urlContentFetcher: UrlContentFetcher
	fileContextTracker: FileContextTracker
	workspaceManager?: WorkspaceRootManager
	diracIgnoreController: DiracIgnoreController
	FocusChainManager?: FocusChainManager
	taskState: TaskState
	getCurrentProviderInfo: () => ApiProviderInfo
	getEnvironmentDetails: (includeFileDetails?: boolean) => Promise<string>
}

// Mock the vscode module so prompt code runs outside the extension host
const Module = require("module")

const mock = {
	workspace: {
		workspaceFolders: [],
		getConfiguration: () => ({ get: () => undefined }),
		onDidChangeConfiguration: () => ({ dispose: () => {} }),
	},
	window: {
		activeTextEditor: undefined,
		visibleTextEditors: [],
		showInformationMessage: () => {},
		showErrorMessage: () => {},
	},
	env: {
		shell: process.env.SHELL || "/bin/bash",
		appName: "Visual Studio Code",
		uiKind: 1,
	},
	Uri: {
		file: (p) => ({ fsPath: p, path: p }),
		parse: (s) => ({ fsPath: s, path: s }),
	},
	EventEmitter: class {
		fire() {}
		event = () => ({ dispose: () => {} })
	},
	Disposable: { from: () => ({ dispose: () => {} }) },
	extensions: { getExtension: () => undefined },
	commands: { executeCommand: async () => {} },
}

// Register the mock so any subsequent require('vscode') returns it
const originalRequire = Module.prototype.require
Module.prototype.require = function (id) {
	if (id === "vscode") {
		return mock
	}
	return originalRequire.call(this, id)
}

module.exports = mock

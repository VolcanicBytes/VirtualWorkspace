import * as vscode from 'vscode';
import * as path from 'path';
import { ConfigurationKeys, Constants } from './constants';
import { StatusBar } from './statusbarProxy';
import { VirtualWorkspace } from './virtualWorkspace';

export function activate(context: vscode.ExtensionContext) {
	StatusBar.InitializeStatusBar();
	const virtualWorkspace: VirtualWorkspace = new VirtualWorkspace();
	context.subscriptions.push(
		vscode.commands.registerCommand(Constants.VirtualWorkspace_SaveAsCommand, (args) => {
			let location: string | null = computeLocationPath(args, context);

			virtualWorkspace.BeginSaveAs(location).then((success) => {
				if (success) {
					const dirName = path.dirname(virtualWorkspace.destinationPath);
					context.globalState.update(Constants.LastOpenDialogLocation, dirName);
				}
			});
		}),
		vscode.commands.registerCommand(Constants.VirtualWorkspace_RestoreCommand, (args) => {
			let location: string | null = computeLocationPath(args, context);

			virtualWorkspace.Restore(location).then((success) => {
				if (success) {
					const dirName = path.dirname(virtualWorkspace.destinationPath);
					context.globalState.update(Constants.LastOpenDialogLocation, dirName);
				}
			});
		}),
		vscode.commands.registerCommand(Constants.VirtualWorkspace_AddFileCommand, () => {
			virtualWorkspace.AddActiveEditorToCurrentList();
		}),
		vscode.commands.registerCommand(Constants.VirtualWorkspace_RemoveFileCommand, () => {
			virtualWorkspace.RemoveActiveEditorFromCurrentList();
		}),
		vscode.commands.registerCommand(Constants.VirtualWorkspace_CancelSaveCommand, () => {
			virtualWorkspace.CancelSaveAs();
		}),
		vscode.window.onDidChangeActiveTextEditor((e) => {
			virtualWorkspace.Update(e);
		})
	);

	virtualWorkspace.CheckActiveEditorForVirtualWorkspace();
}

function computeLocationPath(args: any, context: vscode.ExtensionContext) {
	let path: string | null = null;
	const e = <string>args;
	if (e != null && e.length > 0) {
		path = <string>e;
	}

	if (!path) {
		const workbenchConfig = vscode.workspace.getConfiguration(Constants.VirtualWorkspace);
		const overrideOpenDialogLocation = workbenchConfig.get<string | null>(ConfigurationKeys.OverrideOpenDialogLocation, null);
		const rememberLastOpenDialogLocation = workbenchConfig.get<boolean>(ConfigurationKeys.RembemerLastOpenDialogLocation, false);

		if (overrideOpenDialogLocation != null && overrideOpenDialogLocation.trim() != '') {
			path = overrideOpenDialogLocation;
		}
		else if (rememberLastOpenDialogLocation) {
			path = context.globalState.get<string | null>(Constants.LastOpenDialogLocation, null);
		}
	}
	return path;
}

export function deactivate() { }

import * as vscode from 'vscode';
import { Constants } from './constants';
import { StatusBar } from './statusbarProxy';
import { VirtualWorkspace } from './virtualWorkspace';

export function activate(context: vscode.ExtensionContext) {
	StatusBar.InitializeStatusBar();
	const virtualWorkspace: VirtualWorkspace = new VirtualWorkspace();
	context.subscriptions.push(
		vscode.commands.registerCommand(Constants.VirtualWorkspace_SaveAsCommand, () => {
			virtualWorkspace.BeginSaveAs();
		}),
		vscode.commands.registerCommand(Constants.VirtualWorkspace_RestoreCommand, () => {
			virtualWorkspace.Restore();
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

export function deactivate() { }

import * as vscode from 'vscode';
import { Constants } from './constants';
import { StatusBar } from './statusbarProxy';
import { VirtualSpace } from './virtualSpace';

export function activate(context: vscode.ExtensionContext) {
	StatusBar.InitializeStatusBar();
	const virtualSpace: VirtualSpace = new VirtualSpace();
	context.subscriptions.push(
		vscode.commands.registerCommand(Constants.VirtualSpace_SaveAsCommand, () => {
			virtualSpace.BeginSaveAs();
		}),
		vscode.commands.registerCommand(Constants.VirtualSpace_RestoreCommand, () => {
			virtualSpace.Restore();
		}),
		vscode.commands.registerCommand(Constants.VirtualSpace_AddFileCommand, () => {
			virtualSpace.AddActiveEditorToCurrentList();
		}),
		vscode.commands.registerCommand(Constants.VirtualSpace_RemoveFileCommand, () => {
			virtualSpace.RemoveActiveEditorFromCurrentList();
		}),
		vscode.commands.registerCommand(Constants.VirtualSpace_CancelSaveCommand, () => {
			virtualSpace.CancelSaveAs();
		}),
		vscode.window.onDidChangeActiveTextEditor((e) => {
			virtualSpace.Update(e);
		})
	);

	virtualSpace.CheckActiveEditorForVirtualSpace();
}

export function deactivate() { }

import * as vscode from 'vscode';
import { Constants, Tooltips } from './constants';
export class StatusBar {
    private static statusBarItem: vscode.StatusBarItem;

    public static InitializeStatusBar() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
        this.statusBarItem.command = Constants.VirtualSpace_CancelSaveCommand;
        this.statusBarItem.tooltip = Tooltips.CancelTip;
        this.statusBarItem.text = Constants.Statusbar_SaveText;
        this.Hide();
    }

    public static Display(message: string) {
        this.statusBarItem.text = message;
        this.statusBarItem.show();
    }
    public static DisplaySaveProgress() {
        this.Display(Constants.Statusbar_SaveText);
    }
    public static DisplayRestoreProgress() {
        this.Display(Constants.Statusbar_RestoreText);
    }
    public static Hide() {
        this.statusBarItem.hide();
    }

}
export class Constants {
    public static Extension: string = 'code-virtualworkspace';
    public static OldExtension: string = 'code-virtualspace';
    public static readonly VirtualWorkspace = "virtualWorkspace";
    public static readonly ContextIsOpen = "virtualWorkspaceIsOpen";
    public static readonly VirtualWorkspace_SaveAsCommand = "virtualWorkspace.saveAs";
    public static readonly VirtualWorkspace_RestoreCommand = "virtualWorkspace.restore";
    public static readonly VirtualWorkspace_AddFileCommand = "virtualWorkspace.addFileToCurrentList";
    public static readonly VirtualWorkspace_RemoveFileCommand = "virtualWorkspace.removeFileFromCurrentList";
    public static readonly VirtualWorkspace_CancelSaveCommand = "virtualWorkspace.cancelSave";
    public static readonly CloseAllEditorCommand = "workbench.action.closeAllEditors";

    public static readonly Statusbar_SaveText = "Saving virtual space...";
    public static readonly Statusbar_RestoreText = "Restoring virtual space...";

    public static QuickPickPlaceHolder: string = 'Select the files to restore (or just hit Enter to load them all)';
    public static SaveVirtualWorkspaceLabel: string = 'Save the current virtual workspace';
    public static RestoreVirtualWorkspaceLabel: string = 'Restore a virtual workspace';
    public static AddFileToListResponse: string = 'Add active file';
    public static RemoveFileFromListResponse: string = 'Remove active file';

    public static maxNTry: number = 3;
    public static maxNBeginTry: number = 3;
    public static ReTriggerWatchdogDelay: number = 1000;
    public static PreviewFileLength: number = 40;
}
export class Tooltips {
    public static readonly CancelTip = 'Click to cancel';
}

export type BuiltInCommands = 'vscode.open' | 'setContext' | 'workbench.action.closeActiveEditor' | 'workbench.action.nextEditor';
export const BuiltInCommands = {
    CloseActiveEditor: 'workbench.action.closeActiveEditor' as BuiltInCommands,
    NextEditor: 'workbench.action.nextEditor' as BuiltInCommands,
    Open: 'vscode.open' as BuiltInCommands,
    SetContext: 'setContext' as BuiltInCommands
};
export class Constants {
    public static Extension: string = 'code-virtualspace';
    public static readonly VirtualSpace = "virtualSpace";
    public static readonly ContextIsOpen = "virtualSpaceIsOpen";
    public static readonly VirtualSpace_SaveAsCommand = "virtualSpace.saveAs";
    public static readonly VirtualSpace_RestoreCommand = "virtualSpace.restore";
    public static readonly VirtualSpace_AddFileCommand = "virtualSpace.addFileToCurrentList";
    public static readonly VirtualSpace_RemoveFileCommand = "virtualSpace.removeFileFromCurrentList";
    public static readonly VirtualSpace_CancelSaveCommand = "virtualSpace.cancelSave";
    public static readonly CloseAllEditorCommand = "workbench.action.closeAllEditors";

    public static readonly Statusbar_SaveText = "Saving virtual space...";
    public static readonly Statusbar_RestoreText = "Restoring virtual space...";

    public static QuickPickPlaceHolder: string = 'Select the files to restore (or just hit Enter to load them all)';
    public static SaveVirtualSpaceLabel: string = 'Save the current virtual workspace';
    public static RestoreVirtualSpaceLabel: string = 'Restore a virtual workspace';
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
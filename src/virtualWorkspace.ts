import * as vscode from 'vscode';
import * as path from 'path';
import { AdditionBoxProxy } from './additionBoxManager';
import { BuiltInCommands, Constants } from './constants';
import { DataAccessLayer } from './DataAccessLayer';
import { DocumentInfo } from './model/documentInfo';
import { StatusBar } from './statusbarProxy';
import { Watchdog } from './watchdog';

export class VirtualWorkspace {

    public destinationPath: string = "";
    private dataAccess: DataAccessLayer = new DataAccessLayer();
    private additionBox: AdditionBoxProxy;
    private documentInfoList: DocumentInfo[] = new Array<DocumentInfo>();
    private openEditors = new Array<vscode.TextEditor>();
    private openEditorNames: string[] = new Array();
    private saveInProgress: boolean = false;
    private nTry = Constants.maxNTry;
    private nBeginTry = Constants.maxNBeginTry;

    private reTriggerWatchdog: Watchdog;

    constructor() {
        this.additionBox = new AdditionBoxProxy(this);
        this.reTriggerWatchdog = new Watchdog(() => this.GotoNextEditor(), Constants.ReTriggerWatchdogDelay);
    }

    /**
     * CheckActiveEditorForVirtualWorkspace
     */
    public async CheckActiveEditorForVirtualWorkspace() {
        try {
            const textEditor = vscode.window.activeTextEditor;
            if (textEditor == undefined)
                return;
            const doc = textEditor.document;
            if (doc == undefined || doc.uri.scheme !== 'file' || doc.languageId !== Constants.VirtualWorkspace)
                return;
            await this.Restore(null, doc.uri.fsPath);
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * SaveAs
     */
    public async BeginSaveAs(folderPath: string | null): Promise<boolean> {
        const fileName = await this.dataAccess.showSaveDialog(folderPath);
        if (!fileName)
            return false;
        this.destinationPath = fileName;

        this.ResetData();
        await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
        this.saveInProgress = true;
        StatusBar.DisplaySaveProgress();
        this.reTriggerWatchdog.Reset();
        await vscode.commands.executeCommand('workbench.action.firstEditorInGroup');
        return true;
    }


    /**
     * CancelSave
     */
    public CancelSaveAs() {
        this.saveInProgress = false;
        StatusBar.Hide();
        this.reTriggerWatchdog.Clear();
        vscode.commands.executeCommand('setContext', Constants.ContextIsOpen, false);
    }


    /**
     * Restore
     */
    public async Restore(folderName: string | null, fileName?: string): Promise<boolean> {

        if (!fileName)
            fileName = await this.dataAccess.showOpenDialog(folderName);

        if (!fileName)
            return false;

        try {
            await vscode.commands.executeCommand(Constants.CloseAllEditorCommand);
        } catch (error) {
            console.error(error);
        }

        this.destinationPath = fileName;
        this.ResetData();
        const unfilteredList = this.documentInfoList = this.dataAccess.RestoreDocumentInfoList(this.destinationPath);

        if (!await this.AskAndApplyUserFilter())
            return false;

        StatusBar.DisplayRestoreProgress();
        const textEditorListCount = this.documentInfoList.length;
        for (let index = 0; index < textEditorListCount; index++) {
            let textInfo = this.documentInfoList[index];
            try {
                await textInfo.OpenInCode();
            } catch (error) {
                console.error(error);
            }

            this.openEditorNames.push(textInfo.fileName);
        }
        this.documentInfoList = unfilteredList;
        StatusBar.Hide();
        this.additionBox.DisplayRestoredList(this.openEditorNames);
        vscode.commands.executeCommand('setContext', Constants.ContextIsOpen, true);
        return true;
    }

    public async AskAndApplyUserFilter() {
        const quickPickItems = this.documentInfoList.map((fileInfo, idx) => {
            let fileName = fileInfo.fileName;
            let description = '';
            if (fileInfo.uri.scheme == 'untitled') {
                if (fileInfo.text) {
                    const availablePreviewLength = fileInfo.text.length > Constants.PreviewFileLength ? Constants.PreviewFileLength : fileInfo.text.length;
                    description = fileInfo.text.substring(0, availablePreviewLength);
                }
            }
            else {
                let dirname = path.dirname(fileInfo.fileName);
                fileName = path.relative(dirname, fileInfo.fileName);
                description = dirname;
            }

            return {
                label: fileName,
                description: description,
                fileName: fileInfo.fileName,
                index: idx,
                picked: false
            }
        });

        const selectedFileNames = await vscode.window.showQuickPick(quickPickItems, { placeHolder: Constants.QuickPickPlaceHolder, canPickMany: true });
        if (selectedFileNames === undefined) {
            return false;
        }
        else if (selectedFileNames && selectedFileNames.length > 0) {
            const fileIndex = selectedFileNames.map(v => v.index);
            this.documentInfoList = this.documentInfoList.filter((cv, idx) => fileIndex.includes(idx));
        }
        return true;
    }

    public Update(currentTextEditor?: vscode.TextEditor) {
        if (!this.saveInProgress)
            return;

        this.reTriggerWatchdog.Reset();

        if (currentTextEditor) {
            this.nTry = Constants.maxNTry;
            const doc = currentTextEditor.document;
            if (doc != null) {
                if (!this.openEditorNames.includes(doc.fileName)) {
                    this.openEditorNames.push(doc.fileName);
                    this.openEditors.push(currentTextEditor);
                    this.GotoNextEditor();
                }
                else if (this.nBeginTry-- > 0) {
                    this.GotoNextEditor();
                } else {
                    this.CommitSave();
                }
            }
        }
        else {
            if (this.nTry-- > 0)
                this.GotoNextEditor();
            else
                this.CommitSave();
        }
    }

    public RemoveActiveEditorFromCurrentList() {
        const textEditor = vscode.window.activeTextEditor;
        if (textEditor == undefined)
            return;
        const doc = textEditor.document;
        if (doc == undefined)
            return;

        // this.openEditors.push(textEditor);
        this.RemoveFromOpenEditorNames(doc.fileName);
        this.RemoveDocumentInfoFromList(doc);
        this.SaveDocumentInfoList();
    }


    public RemoveDocumentInfoFromList(doc: vscode.TextDocument) {
        const fileName = doc.fileName;
        const list = this.documentInfoList;
        const listCount = list.length;
        for (let index = 0; index < listCount; index++) {
            const document = list[index];
            if (document.fileName == fileName) {
                this.documentInfoList.splice(index, 1);
                break;
            }
        }
    }

    public AddActiveEditorToCurrentList() {
        const textEditor = vscode.window.activeTextEditor;
        if (textEditor == undefined)
            return;
        const doc = textEditor.document;
        if (doc == undefined)
            return;

        // this.openEditors.push(textEditor);
        this.openEditorNames.push(doc.fileName);
        // this.CommitSave();
        this.AppendDocumentInfoToList(textEditor.viewColumn, doc);
        this.SaveDocumentInfoList();
    }


    private GotoNextEditor() {
        vscode.commands.executeCommand(BuiltInCommands.NextEditor);
    }

    private CommitSave() {
        StatusBar.Hide();
        this.saveInProgress = false;
        this.reTriggerWatchdog.Clear();

        for (let i = 0; i < this.openEditors.length; i++) {
            const textEditor = this.openEditors[i];
            const vc = textEditor.viewColumn;
            const doc = textEditor.document;
            if (!doc)
                continue;
            this.AppendDocumentInfoToList(vc, doc);
        }

        this.SaveDocumentInfoList();
    }

    private AppendDocumentInfoToList(vc: vscode.ViewColumn | undefined, doc: vscode.TextDocument) {
        let info = DocumentInfo.ComposeFrom(vc, doc);
        this.documentInfoList.push(info);
    }

    private SaveDocumentInfoList() {
        this.dataAccess.SaveDocumentInfoList(this.destinationPath, this.documentInfoList);
        this.additionBox.DisplaySavedList(this.openEditorNames);
        vscode.commands.executeCommand('setContext', Constants.ContextIsOpen, true);
    }

    private ResetData() {
        this.openEditors = new Array();
        this.openEditorNames = new Array();
        this.nBeginTry = Constants.maxNBeginTry;
        this.documentInfoList = new Array();
    }
    private RemoveFromOpenEditorNames(fileName: string) {
        const index = this.openEditorNames.indexOf(fileName);
        if (index > -1)
            // this.openEditorNames = 
            this.openEditorNames.splice(index, 1);
    }
}
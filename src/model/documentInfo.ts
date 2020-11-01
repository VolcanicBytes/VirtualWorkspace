import * as vscode from 'vscode';
import { ViewColumn } from 'vscode';
import { BuilderUtils } from '../builderUtils';

export class DocumentInfo {

    public viewColumn?: ViewColumn;
    public text?: string;
    public language?: string;
    public uri: vscode.Uri;
    public get fileName(): string {
        return this.uri.fsPath;
    }

    public static ComposeFrom(vc: vscode.ViewColumn | undefined, doc: vscode.TextDocument) {
        let info = new DocumentInfo(doc.uri, vc, doc.languageId);
        if (doc.uri.scheme == 'untitled')
            info.text = doc.getText();
        return info;
    }

    /**
     * A document info
     */
    constructor(uri: vscode.Uri, viewColumn?: ViewColumn, language?: string) {
        this.uri = uri;
        this.viewColumn = viewColumn;
        this.language = language ?? 'text';
    }

    public async OpenInCode() {
        try {
            if (this.uri.scheme === 'file') {
                // await this.openDocument();
                await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(this.uri.fsPath), { viewColumn: this.viewColumn, preview: false });
            }
            else {
                try {
                    if (this.uri.scheme === 'untitled') {
                        const doc = await vscode.workspace.openTextDocument({ language: this.language });
                        const textEditor = await vscode.window.showTextDocument(doc, { preview: false, viewColumn: this.viewColumn });

                        await textEditor.edit((builder) => {
                            BuilderUtils.EmptyDocument(builder, doc);
                            BuilderUtils.InsertInDocument(builder, this.text);
                        });
                    }
                    else {
                        await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(this.uri.fsPath), { viewColumn: this.viewColumn, preview: false });
                    }
                } catch (error) {
                    await this.openDocument();
                }
            }
        } catch (error) {
            await vscode.window.showErrorMessage('An error has occurred while opening the file ' + this.uri.toString() + ':  ' + error);
        }
    }

    private async openDocument() {
        const systemFile = await vscode.workspace.openTextDocument(this.uri);
        return vscode.window.showTextDocument(systemFile, { preview: false, viewColumn: this.viewColumn });
    }

}
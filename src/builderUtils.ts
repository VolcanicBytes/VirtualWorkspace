import * as vscode from 'vscode';

export class BuilderUtils {
    private static FileBeginPosition: vscode.Position = new vscode.Position(0, 0);
    public static InsertInDocument(builder: vscode.TextEditorEdit, text: string | undefined) {
        builder.insert(this.FileBeginPosition, text!);
    }

    public static EmptyDocument(builder: vscode.TextEditorEdit, doc: vscode.TextDocument) {
        const endPos = doc.lineAt(doc.lineCount - 1);
        const range = new vscode.Range(this.FileBeginPosition, endPos.range.end);
        builder.delete(range);
    }
}
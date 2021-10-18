import * as fs from 'fs';
import { OpenDialogOptions, SaveDialogOptions, Uri, window } from 'vscode';
import { Constants } from './constants';
import { DocumentInfo } from "./model/documentInfo";
import { DocumentInfoSerializer } from './model/documentInfoSerializer';

export class DataAccessLayer {
    /**
     * Restore a DocumentInfoList
     */
    RestoreDocumentInfoList(fileName: string): DocumentInfo[] {
        var textContent = fs.readFileSync(fileName);
        const srcList = DocumentInfoSerializer.Deserialize(textContent.toString()) as DocumentInfo[];
        const list = new Array<DocumentInfo>(srcList.length);
        const itemList = srcList;
        const srcItemListCount = itemList.length;
        for (let i = 0; i < srcItemListCount; i++) {
            const srcItem = itemList[i];
            const item = new DocumentInfo(srcItem.uri, srcItem.viewColumn, srcItem.language);
            item.text = srcItem.text;
            list[i] = item;
        }
        return list;
    }

    /**
     * SaveDocumentInfoList
     */
    public SaveDocumentInfoList(path: string | undefined, list: DocumentInfo[]) {
        let hasOldContent = false;

        try {
            if (path?.endsWith(Constants.OldExtension)) {
                hasOldContent = true;
                const oldPath = path!;
                // const newPath = path.replace(Constants.OldExtension, Constants.Extension);
                const newPath = path.substr(0, path.length - Constants.OldExtension.length) + Constants.Extension;
                fs.writeFileSync(newPath, DocumentInfoSerializer.Serialize(list));
                if (fs.existsSync(oldPath))
                    fs.unlinkSync(oldPath);
            }
        } catch (error) {
            console.log("VirtualWorkspace: can't delete old file: " + error);
            hasOldContent = false;
        }

        if (!hasOldContent)
            fs.writeFileSync(path!, DocumentInfoSerializer.Serialize(list));
    }

    public async showOpenDialog(folderPath: string | null) {
        var defaultUri: Uri | undefined;

        if (folderPath)
            defaultUri = Uri.file(folderPath);

        const options: OpenDialogOptions = {
            openLabel: Constants.RestoreVirtualWorkspaceLabel,
            filters: { 'virtualWorkspace': [Constants.Extension, Constants.OldExtension] },
        };
        if (defaultUri)
            options.defaultUri = defaultUri;

        const fileNames = await window.showOpenDialog(options);
        if (!fileNames)
            return undefined;
        return fileNames[0].fsPath;
    }

    public async showSaveDialog(folderPath: string | null) {
        var defaultUri: Uri | undefined;

        if (folderPath)
            defaultUri = Uri.file(folderPath);

        const options: SaveDialogOptions = {
            saveLabel: Constants.SaveVirtualWorkspaceLabel,
            filters: { 'virtualWorkspace': [Constants.Extension] },
        };
        if (defaultUri)
            options.defaultUri = defaultUri;

        const fileNames = await window.showSaveDialog(options);
        return fileNames ? fileNames.fsPath : undefined;
    }
}
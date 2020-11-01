import * as fs from 'fs';
import { window } from 'vscode';
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
        fs.writeFileSync(path!, DocumentInfoSerializer.Serialize(list));
    }

    public async showOpenDialog() {
        const fileNames = await window.showOpenDialog({ openLabel: Constants.RestoreVirtualSpaceLabel, filters: { 'virtualSpace': [Constants.Extension] } });
        if (!fileNames)
            return undefined;
        return fileNames[0].fsPath;
    }

    public async showSaveDialog() {
        const fileNames = await window.showSaveDialog({ saveLabel: Constants.SaveVirtualSpaceLabel, filters: { 'virtualSpace': [Constants.Extension] } });
        return fileNames ? fileNames.fsPath : undefined;
    }
}
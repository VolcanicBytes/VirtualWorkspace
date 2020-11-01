import * as vscode from 'vscode';
import { Constants } from './constants';
import { VirtualSpace } from './virtualSpace';

export class AdditionBoxProxy {
    public virtualSpace: VirtualSpace;

    constructor(virtualSpace: VirtualSpace) {
        this.virtualSpace = virtualSpace;
    }

    /**
     * ShowMessage
     */
    public async ShowMessage(message: string) {
        const addResponse = Constants.AddFileToListResponse;
        const removeResponse = Constants.RemoveFileFromListResponse;
        const response = await vscode.window.showInformationMessage(message, 'Ok', addResponse, removeResponse);
        if (response == addResponse) {
            this.virtualSpace.AddActiveEditorToCurrentList();
        }
        else if (response == removeResponse) {
            this.virtualSpace.RemoveActiveEditorFromCurrentList();
        }
    }

    public async DisplayRestoredList(list: string[]) {
        let message = `VirtualSpace restored list of ${list.length} files: `;
        message = this.appendListToMessage(list, message);
        await this.ShowMessage(message);
    }

    public async DisplaySavedList(list: string[]) {
        let message = `VirtualSpace saved list of ${list.length} files: `;
        message = this.appendListToMessage(list, message);
        await this.ShowMessage(message);
    }

    private appendListToMessage(list: string[], message: string) {
        const namesCount: number = list.length;
        for (let i = 0; i < namesCount; i++) {
            const fileName = list[i];
            message += ` "${fileName}", `;
        }
        return message;
    }
}
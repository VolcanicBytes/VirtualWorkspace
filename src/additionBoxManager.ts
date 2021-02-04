import * as vscode from 'vscode';
import { Constants } from './constants';
import { VirtualWorkspace } from './virtualWorkspace';

export class AdditionBoxProxy {
    public virtualWorkspace: VirtualWorkspace;

    constructor(virtualWorkspace: VirtualWorkspace) {
        this.virtualWorkspace = virtualWorkspace;
    }

    /**
     * ShowMessage
     */
    public async ShowMessage(message: string) {
        const addResponse = Constants.AddFileToListResponse;
        const removeResponse = Constants.RemoveFileFromListResponse;
        const response = await vscode.window.showInformationMessage(message, 'Ok', addResponse, removeResponse);
        if (response == addResponse) {
            this.virtualWorkspace.AddActiveEditorToCurrentList();
        }
        else if (response == removeResponse) {
            this.virtualWorkspace.RemoveActiveEditorFromCurrentList();
        }
    }

    public async DisplayRestoredList(list: string[]) {
        let message = `VirtualWorkspace restored list of ${list.length} files: `;
        message = this.appendListToMessage(list, message);
        await this.ShowMessage(message);
    }

    public async DisplaySavedList(list: string[]) {
        let message = `VirtualWorkspace saved list of ${list.length} files: `;
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
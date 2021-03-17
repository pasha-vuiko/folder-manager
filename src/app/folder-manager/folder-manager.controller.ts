import {FolderManagerService} from './folder-manager.service';
import {FolderInterface} from './types/folder.interface';

export class FolderManagerController {
    folderManagerService = new FolderManagerService();

    createFolder(folderNames: string): string {
        this.folderManagerService.createFolder(folderNames);

        return folderNames;
    }

    getFolders(): FolderInterface[] {
        return this.folderManagerService.folders;
    }

    moveFolder(folderName: string, folderDestinationName: string): void {
        this.folderManagerService.moveFolder(folderName, folderDestinationName);
    }

    deleteFolder(folderName: string): void {
        this.folderManagerService.deleteFolder(folderName);
    }

    executeCommand(commandStr: string): void {
        // TODO Complete
    }
}

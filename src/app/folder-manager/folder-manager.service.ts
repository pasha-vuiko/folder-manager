import {FolderInterface} from './types/folder.interface';
import {LoggerService} from '../../shared/services/logger.service';
import {ErrorEnum} from '../../shared/types/error.enum';

export class FolderManagerService {
    static instance: FolderManagerService;
    static exists: boolean;

    // tslint:disable-next-line:variable-name
    private _folders: FolderInterface[] = [];
    private loggerService = new LoggerService();

    constructor() {
        if (FolderManagerService.exists) {
            return FolderManagerService.instance;
        }

        FolderManagerService.instance = this;
        FolderManagerService.exists = true;
    }

    createFolder(folderName: string): void {
        const [...folders] = folderName.split('/');

        const folder: FolderInterface = {} as FolderInterface;

        if (folders.length >= 1) {
            folder.name = folders[folders.length - 1];
            folder.parentName = folders[folders.length - 2];
        }

        folder.parentName = folder.parentName || '';

        this._folders.push(folder);
    }

    moveFolder(folderName: string, destinationFolderName: string): void {
        const foundDestinationFolder = this._folders.find(f => f.name === destinationFolderName);

        if (!destinationFolderName || !foundDestinationFolder) {
            this.loggerService.logError(ErrorEnum.MOVE_NOT_EXIST, destinationFolderName);
            return;
        }

        const foundFolderIndex: number = this.folders.findIndex(f => f.name === folderName);

        this._folders[foundFolderIndex].parentName = destinationFolderName;
    }

    get folders(): FolderInterface[] {
        return this._folders;
    }

    getFoldersByParent(parentFolderName: string): FolderInterface[] {
        return this._folders.filter(f => f.parentName === parentFolderName);
    }

    deleteFolder(folderName: string): void {
        const folderIndex = this._folders.findIndex(f => f.name === folderName);

        if (!folderIndex) {
            this.loggerService.logError(ErrorEnum.DELETE_NOT_EXIST, folderName);
        }

        this._folders.splice(folderIndex, 1);
    }
}

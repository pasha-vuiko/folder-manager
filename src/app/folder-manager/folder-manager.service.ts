import {FolderInterface} from './types/folder.interface';
import {LoggerService} from '../../shared/services/logger.service';
import {ErrorEnum} from '../../shared/types/error.enum';
import {singleton} from 'tsyringe';

@singleton()
export class FolderManagerService {
    // tslint:disable-next-line:variable-name
    private _folders: FolderInterface[] = [];

    constructor(private loggerService: LoggerService) {
    }

    public createFolder(folderPath: string): void {
        const folders = folderPath.split('/');

        const folder: FolderInterface = {} as FolderInterface;

        if (folders.length >= 1) {
            if (!this.folderExists(folderPath, true)) {
                this.loggerService.logError(ErrorEnum.FOLDER_NOT_EXIST, folderPath);
                return;
            }

            folder.name = folders[folders.length - 1];
            folder.parentName = folders[folders.length - 2];
        }

        folder.parentName = folder.parentName || '';

        this._folders.push(folder);
    }

    public moveFolder(folderPath: string, destinationFolderName: string): void {
        const folders = folderPath.split('/');

        if (folders.length > 1) {
            if (!this.folderExists(folderPath, true)) {
                this.loggerService.logError(ErrorEnum.FOLDER_NOT_EXIST, folderPath);
                return;
            }
        }

        const foundFolderIndex: number = this._folders.findIndex(f => {
            if (folders.length > 1) {
                return f.name === folders[folders.length - 1] && f.parentName === folders[folders.length - 2];
            } else {
                return f.name === folders[folders.length - 1];
            }
        });

        if (foundFolderIndex === -1) {
            this.loggerService.logError(ErrorEnum.MOVE_NOT_EXIST, destinationFolderName);
            return;
        }

        this._folders[foundFolderIndex].parentName = destinationFolderName;
    }

    public deleteFolder(folderPath: string): void {
        const folders = folderPath.split('/');

        if (!this.folderExists(folderPath, false, true)) {
            this.loggerService.logError(ErrorEnum.DELETE_NOT_EXIST, folderPath);
            return;
        }

        const folderIndex = this._folders.findIndex(f => {
            if (folders.length > 1) {
                return f.name === folders[folders.length - 1] && f.parentName === folders[folders.length - 2];
            } else {
                return f.name === folders[folders.length - 1];
            }
        });

        if (!folderIndex) {
            this.loggerService.logError(ErrorEnum.DELETE_NOT_EXIST, folderPath);
        }

        this._folders.splice(folderIndex, 1);
    }

    get folders(): FolderInterface[] {
        return this._folders;
    }

    private folderExists(folderPath: string, exceptLast = false, onDelete = false): boolean {
        let exists = true;

        const folders = folderPath.split('/');

        folders.forEach((folderName, i) => {
            if (exceptLast) {
                if (i === folders.length - 1) {
                    return;
                }
            }

            if (i === 0) {
                exists = this.folderExistsInParent(folderName);

                if (!exists) {
                    return;
                }
            }

            if (i >= 1) {
                exists = this.folderExistsInParent(folderName, folders[i - 1]);

                if (!exists) {
                    return;
                }
            }
        });

        return exists;
    }

    public printFolderList(folders = [] as FolderInterface[], indent = 0): void {
        const topFolders = this._folders.filter(f => f.parentName === '');

        this.recursivePrint(topFolders);
    }

    private recursivePrint(folders: FolderInterface[], indent = 0): void {
        folders.forEach(folder => {
            this.loggerService.logFolder(folder.name, indent, '-');

            const childFolders = this.getFoldersByParent(folder.name);

            if (childFolders.length) {
                this.recursivePrint(childFolders, indent + 1);
            }
        });
    }

    private folderExistsInParent(folderName: string, parentFolderName = ''): boolean {
        const folders = this.getFoldersByParent(parentFolderName);

        return !!folders.length;
    }

    private getFoldersByParent(parentFolderName = ''): FolderInterface[] {
        return this._folders.filter(f => f.parentName === parentFolderName);
    }
}

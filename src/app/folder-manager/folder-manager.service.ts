import { FolderInterface } from './types/folder.interface';
import { LoggerService } from '../../shared/services/logger.service';
import { ErrorEnum } from '../../shared/types/error.enum';
import { singleton } from 'tsyringe';

@singleton()
export class FolderManagerService {

  constructor(private loggerService: LoggerService) {}

  get folders(): FolderInterface[] {
    return this._folders;
  }
  // tslint:disable-next-line:variable-name
  private _folders: FolderInterface[] = [];

  private static getParentFolderPath(folderPath: string): string {
    const folders = folderPath.split('/');

    folders.pop();

    return folders.join('/');
  }

  private static getFolderNameByPath(folderPath: string): string {
    const folders = folderPath.split('/');

    return folders[folders.length - 1];
  }

  public createFolder(folderPath: string): void {
    const folders = folderPath.split('/');

    const folder: FolderInterface = {} as FolderInterface;

    if (folders.length > 1) {
      // check of existing of folder
      if (!this.folderParentExists(folderPath)) {
        this.loggerService.logError(ErrorEnum.FOLDER_NOT_EXIST, folderPath);
        return;
      }

      folder.name = folders[folders.length - 1];
      folder.parentName = folders[folders.length - 2];
    } else {
      folder.name = folderPath;
      folder.parentName = '';
    }

    folder.path = folderPath;

    this._folders.push(folder);
  }

  public moveFolder(folderPath: string, destinationFolderName: string): void { // TODO fix
    const folders = folderPath.split('/');

    if (folders.length > 1) {
      if (!this.folderParentExists(folderPath)) {
        this.loggerService.logError(ErrorEnum.FOLDER_NOT_EXIST, folderPath);
        return;
      }
    }

    const foundFolderIndex: number = this._folders.findIndex(f => f.path === folderPath);

    if (foundFolderIndex === -1) {
      this.loggerService.logError(
        ErrorEnum.MOVE_NOT_EXIST,
        destinationFolderName
      );
      return;
    }

    const folderName = FolderManagerService.getFolderNameByPath(folderPath);

    this._folders[foundFolderIndex].parentName = destinationFolderName;
    this._folders[foundFolderIndex].path = `${destinationFolderName}/${folderName}`;
  }

  public deleteFolder(folderPath: string): void {
    const folderIndex = this._folders.findIndex((f) =>
      f.path === folderPath
    );

    if (folderIndex === -1) {
      this.loggerService.logError(ErrorEnum.DELETE_NOT_EXIST, folderPath);
      return;
    }

    this._folders.splice(folderIndex, 1);
  }

  private folderParentExists(folderPath: string): boolean {
    const parentPath = FolderManagerService.getParentFolderPath(folderPath);

    return !!this._folders.find((f) => f.path === parentPath);
  }

  public printFolderList(): void {
    const topFolders = this._folders
      .filter((f) => f.parentName === '')
      .sort((f1, f2) =>
        new Intl.Collator().compare(f1.name, f2.name)
      );

    this.recursivePrint(topFolders);

    console.log(this._folders);
  }

  private recursivePrint(folders: FolderInterface[], indent = 0): void {
    folders.forEach((folder) => {
      this.loggerService.logFolder(folder.name, indent, ' ');

      const childFolders = this.getFoldersByParent(folder.name);

      if (childFolders.length) {
        childFolders.sort((f1, f2) =>
          new Intl.Collator().compare(f1.name, f2.name)
        );

        this.recursivePrint(childFolders, indent + 1);
      }
    });
  }

  private getFoldersByParent(parentFolderName = ''): FolderInterface[] {
    return this._folders.filter((f) => f.parentName === parentFolderName);
  }
}

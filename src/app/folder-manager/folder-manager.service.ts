import { LoggerService } from '../../shared/services/logger.service';
import { singleton } from 'tsyringe';
import { FolderTreeInterface } from './types/folder-tree.interface';
import { ErrorEnum } from '../../shared/types/error.enum';

@singleton()
export class FolderManagerService {
  // tslint:disable-next-line:variable-name
  private _folders: FolderTreeInterface[] = [];

  constructor(private loggerService: LoggerService) {}

  public createFolder(folderPath: string): void {
    const folderNames = folderPath.split('/');

    if (folderNames.length > 1) {
      if (!this.findFolderParent(folderPath)) {
        // check of existing of folder
        this.loggerService.logError(ErrorEnum.FOLDER_NOT_EXIST, folderPath);
        return;
      }

      this.createSubFolder(this._folders, folderNames);
      return;
    }

    const newFolder: FolderTreeInterface = {
      name: folderNames[0],
      children: [],
    };

    this._folders.push(newFolder);
  }

  private createSubFolder(folders: FolderTreeInterface[], folderNames: string[]): void {
    if (!folderNames.length) {
      this.loggerService.logError(ErrorEnum.FOLDER_NOT_EXIST);
      return;
    }

    const [folderParent, ...folderChildren] = folderNames;

    const foundIndex = folders.findIndex((f) => f.name === folderParent);

    if (foundIndex === -1) {
      this.loggerService.logError(ErrorEnum.FOLDER_NOT_EXIST, folderParent);
      return;
    }

    if (folderNames.length === 2) {
      const newFolder: FolderTreeInterface = {
        name: folderNames[1],
        children: [],
      };

      folders[foundIndex].children.push(newFolder);
      return;
    }

    this.createSubFolder(folders[foundIndex].children, folderChildren);
  }

  public findFolder(folderPath: string): FolderTreeInterface | null {
    const folderNames = folderPath.split('/');

    return this.findFolderRecursive(this._folders, folderNames);
  }

  public findFolderParent(folderPath: string): FolderTreeInterface | null {
    const folderNames = folderPath.split('/');

    folderNames.pop();

    return this.findFolderRecursive(this._folders, folderNames);
  }

  private findFolderRecursive(
    folders: FolderTreeInterface[],
    folderNames: string[]
  ): FolderTreeInterface | null {
    if (!folderNames.length) {
      this.loggerService.logError(ErrorEnum.FOLDER_NOT_EXIST);
      return null;
    }

    const [folderParent, ...folderChildren] = folderNames;

    const foundIndex = folders.findIndex((f) => f.name === folderParent);

    const foundFolder = folders[foundIndex];

    if (!folderChildren.length) {
      return foundFolder || null;
    }

    if (!foundFolder) {
      this.loggerService.logError(ErrorEnum.FOLDER_NOT_EXIST, folderParent);
      return null;
    }

    if (foundFolder.children.length) {
      return this.findFolderRecursive(foundFolder.children, folderChildren);
    }

    return foundFolder || null;
  }

  public moveFolder(folderPath: string, destinationFolderName: string): void {
    const folderNames = folderPath.split('/');

    this.moveFolderRecursive(this._folders, folderNames, destinationFolderName);
  }

  private moveFolderRecursive(
    folders: FolderTreeInterface[],
    folderNames: string[],
    destinationFolderName: string
  ): void {
    if (!folderNames.length) {
      this.loggerService.logError(ErrorEnum.FOLDER_NOT_EXIST);
      return;
    }

    const [folderParent, ...folderChildren] = folderNames;

    const foundIndex = folders.findIndex((f) => f.name === folderParent);

    if (foundIndex === -1) {
      this.loggerService.logError(ErrorEnum.DELETE_NOT_EXIST, folderParent);
      return;
    }

    if (folderNames.length === 1) {
      const foundDestinationFolder = this.findFolder(destinationFolderName);

      if (foundDestinationFolder) {
        foundDestinationFolder.children.push(folders[foundIndex]);
        folders.splice(foundIndex, 1);
      }
      return;
    }

    this.moveFolderRecursive(folders[foundIndex].children, folderChildren, destinationFolderName);
  }

  public deleteFolder(folderPath: string): void {
    const folderNames = folderPath.split('/');

    this.deleteFolderRecursive(this._folders, folderNames, folderPath);
  }

  private deleteFolderRecursive(
    folders: FolderTreeInterface[],
    folderNames: string[],
    folderPath: string
  ): void {
    if (!folderNames.length) {
      this.loggerService.logError(ErrorEnum.FOLDER_NOT_EXIST);
      return;
    }

    const [folderParent, ...folderChildren] = folderNames;

    const foundIndex = folders.findIndex((f) => f.name === folderParent);

    if (foundIndex === -1) {
      this.loggerService.logError(ErrorEnum.DELETE_NOT_EXIST, folderPath, folderParent);
      return;
    }

    if (folderNames.length === 1) {
      folders.splice(foundIndex, 1);
      return;
    }

    this.deleteFolderRecursive(folders[foundIndex].children, folderChildren, folderPath);
  }

  get folders(): FolderTreeInterface[] {
    return this._folders;
  }

  public printFolderList(): void {
    this.recursivePrint(this._folders);
  }

  private recursivePrint(folders: FolderTreeInterface[], indent = 0): void {
    folders.forEach((folder) => {
      this.loggerService.logFolder(folder.name, indent, ' ');

      const childFolders = folder.children;

      if (childFolders.length) {
        this.recursivePrint(childFolders, indent + 1);
      }
    });
  }
}

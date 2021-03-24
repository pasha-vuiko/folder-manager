import 'reflect-metadata';

import { FolderManagerService } from '../folder-manager.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { FolderInterface } from '../types/folder.interface';

jest.mock('../../../shared/services/logger.service');

describe('FolderManagerService', () => {
  let folderManagerService: FolderManagerService;

  beforeEach(() => {
    folderManagerService = new FolderManagerService(new LoggerService());
  });

  it('should create folder', () => {
    folderManagerService.createFolder('fruits');

    const folders: FolderInterface[] = folderManagerService.folders;

    const expected = [{
      name: 'fruits',
      parentName: '',
      path: 'fruits'
    }] as FolderInterface[];

    expect(new Set(folders)).toEqual(new Set(expected));
  });

  it('should create folder with parent', () => {
    folderManagerService.createFolder('fruits');
    folderManagerService.createFolder('fruits/apples');

    const folders: FolderInterface[] = folderManagerService.folders;

    const expected: FolderInterface[] = [
      { name: 'apples', parentName: 'fruits', path: 'fruits/apples' },
      { name: 'fruits', parentName: '', path: 'fruits' },
    ];

    expect(new Set(folders)).toEqual(new Set(expected));
  });

  xit('should move folder', () => {
    folderManagerService.createFolder('fruits');
    folderManagerService.createFolder('foods');
    folderManagerService.createFolder('fruits/apples');
    folderManagerService.moveFolder('fruits/apples', 'foods');

    const folders: FolderInterface[] = folderManagerService.folders;

    const expected: FolderInterface[] = [
      { name: 'apples', parentName: 'foods', path: 'foods/apples' },
      { name: 'fruits', parentName: '', path: 'fruits' },
      { name: 'foods', parentName: '', path: 'foods' },
    ];

    expect(new Set(folders)).toEqual(new Set(expected));
  });

  it('should delete folder', () => {
    folderManagerService.createFolder('fruits');
    folderManagerService.createFolder('foods');
    folderManagerService.createFolder('fruits/apples');
    folderManagerService.deleteFolder('fruits/apples');

    const folders: FolderInterface[] = folderManagerService.folders;

    const expected: FolderInterface[] = [
      { name: 'fruits', parentName: '', path: 'fruits' },
      { name: 'foods', parentName: '', path: 'foods' },
    ];

    expect(new Set(folders)).toEqual(new Set(expected));
  });
});

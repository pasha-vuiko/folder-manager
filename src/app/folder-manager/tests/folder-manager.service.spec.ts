import 'reflect-metadata';

import { FolderManagerService } from '../folder-manager.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { FolderTreeInterface } from '../types/folder-tree.interface';

jest.mock('../../../shared/services/logger.service');

describe('FolderManagerService', () => {
  let folderManagerService: FolderManagerService;

  beforeEach(() => {
    folderManagerService = new FolderManagerService(new LoggerService());
  });

  it('should find folder', () => {
    (folderManagerService as any)._folders = [
      {
        name: 'fruits',
        children: [
          {
            name: 'apples',
            children: [],
          },
          {
            name: 'oranges',
            children: [
              {
                name: 'skin',
                children: [],
              },
            ],
          },
        ],
      },
    ];

    const foundFolder = folderManagerService.findFolder('fruits/oranges/skin');

    const expected = [{ name: 'skin', children: [] }] as FolderTreeInterface[];

    expect(new Set([foundFolder])).toEqual(new Set(expected));
  });

  it('should create folder', () => {
    folderManagerService.createFolder('fruits');

    const folders: FolderTreeInterface[] = folderManagerService.folders;

    const expected = [
      { name: 'fruits', children: [] },
    ] as FolderTreeInterface[];

    expect(new Set(folders)).toEqual(new Set(expected));
  });

  it('should create nested folder', () => {
    folderManagerService.createFolder('fruits');
    folderManagerService.createFolder('fruits/apples');

    const folders: FolderTreeInterface[] = folderManagerService.folders;

    const expected: FolderTreeInterface[] = [
      {
        name: 'fruits',
        children: [
          {
            name: 'apples',
            children: [],
          },
        ],
      },
    ];

    expect(new Set(folders)).toEqual(new Set(expected));
  });

  it('should move folder', () => {
    folderManagerService.createFolder('fruits');
    folderManagerService.createFolder('foods');
    folderManagerService.createFolder('fruits/apples');
    folderManagerService.moveFolder('fruits/apples', 'foods');

    const folders: FolderTreeInterface[] = folderManagerService.folders;

    const expected: FolderTreeInterface[] = [
      {
        name: 'fruits',
        children: [],
      },
      {
        name: 'foods',
        children: [
          {
            name: 'apples',
            children: [],
          },
        ],
      },
    ];

    expect(new Set(folders)).toEqual(new Set(expected));
  });

  it('should delete folder', () => {
    folderManagerService.createFolder('fruits');
    folderManagerService.createFolder('foods');
    folderManagerService.createFolder('fruits/apples');
    folderManagerService.createFolder('fruits/apples/lal');
    folderManagerService.deleteFolder('fruits/apples/lal');

    const folders: FolderTreeInterface[] = folderManagerService.folders;

    const expected: FolderTreeInterface[] = [
      {
        name: 'fruits',
        children: [{ name: 'apples', children: [] }],
      },
      { name: 'foods', children: [] },
    ];

    expect(new Set(folders)).toEqual(new Set(expected));
  });
});

import 'reflect-metadata';

import {FolderManagerService} from '../folder-manager.service';
import {LoggerService} from '../../../shared/services/logger.service';
import {FolderInterface} from '../types/folder.interface';

jest.mock('../../../shared/services/logger.service');

describe('FolderManagerService', () => {
    let folderManagerService: FolderManagerService;

    beforeEach(() => {
        folderManagerService = new FolderManagerService(new LoggerService());
    });

    it('should create folder', () => {
        folderManagerService.createFolder('fruits');

        const folders: FolderInterface[] = folderManagerService.folders.sort();

        expect(folders).toEqual([{ name: 'fruits', parentName: '' }].sort() as FolderInterface[]);
    });

    it('should create folder with parent', () => {
        folderManagerService.createFolder('fruits');
        folderManagerService.createFolder('fruits/apples');

        const folders: FolderInterface[] = folderManagerService.folders;

        const expected: FolderInterface[] = [
            { name: 'apples', parentName: 'fruits' },
            { name: 'fruits', parentName: '' }
        ];

        expect(new Set(folders)).toEqual(new Set(expected));
    });

    it('should move folder', () => {
        folderManagerService.createFolder('fruits');
        folderManagerService.createFolder('foods');
        folderManagerService.createFolder('fruits/apples');
        folderManagerService.moveFolder('fruits/apples', 'foods');

        const folders: FolderInterface[] = folderManagerService.folders;

        const expected: FolderInterface[] = [
            { name: 'apples', parentName: 'foods' },
            { name: 'fruits', parentName: '' },
            { name: 'foods', parentName: '' }
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
            { name: 'fruits', parentName: '' },
            { name: 'foods', parentName: '' }
        ];

        expect(new Set(folders)).toEqual(new Set(expected));
    });

    it('folder should exist', () => {
        folderManagerService.createFolder('fruits');
        folderManagerService.createFolder('fruits/apples');

        const exists = (folderManagerService as any).folderExists('fruits/apples', false);

        expect(exists).toBe(true);
    });

    it('top folder should not exist', () => {
        folderManagerService.createFolder('fruits');
        folderManagerService.createFolder('fruits/apples');

        const exists = (folderManagerService as any).folderExists('apples', false);

        expect(exists).toBe(false);
    });

    it('folder should exist in parent', () => {
        folderManagerService.createFolder('fruits');
        folderManagerService.createFolder('fruits/apples');

        const exists = (folderManagerService as any).folderExistsInParent('apples', 'fruits');

        expect(exists).toBe(true);
    });
});

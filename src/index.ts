import 'reflect-metadata';

import {FolderManagerController} from './app/folder-manager/folder-manager.controller';
import {ParseInputService} from './shared/services/parseInput.service';

const controller = new FolderManagerController();
// const parser = new ParseInputService();

controller.createFolder('fruits');
controller.createFolder('apples');
controller.createFolder('pines');

controller.moveFolder('apples', 'fruits');

console.log(controller.getFolders());
// console.log(parser.parseInput(path.resolve(__dirname, 'assets', 'input.txt')));

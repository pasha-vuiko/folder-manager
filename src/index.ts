import 'reflect-metadata';

import {FolderManagerController} from './app/folder-manager/folder-manager.controller';
import {ParseInputService} from './shared/services/parseInput.service';
import path from 'path';
import {container} from 'tsyringe';

const controller = container.resolve(FolderManagerController);
const parser = container.resolve(ParseInputService);

const commands = parser.parseInput(path.resolve(__dirname, 'assets', 'input.txt'));

commands.forEach(c => {
    controller.executeCommand(c);
});

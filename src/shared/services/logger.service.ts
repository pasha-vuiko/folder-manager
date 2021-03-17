import {ErrorEnum} from '../types/error.enum';
import {FolderInterface} from '../../app/folder-manager/types/folder.interface';

export class LoggerService { // TODO add command colors
    logCommand(commandName: string, commandParamsStr: string): void {
        console.log(commandName, commandParamsStr);
    }

    logError(error: ErrorEnum, commandParamsStr: string ): void {
        switch (error) {
            case ErrorEnum.DELETE_NOT_EXIST: console.log(`Cannot delete ${commandParamsStr} - ${commandParamsStr} does not exist`); break;
            case ErrorEnum.MOVE_NOT_EXIST: console.log(`Cannot move ${commandParamsStr} - ${commandParamsStr} does not exist`); break;
            case ErrorEnum.FOLDER_NOT_EXIST: console.log(`Error folder ${commandParamsStr} does not exist`); break;
        }
    }

    logFolderList(folders: FolderInterface): any {
        // TODO Complete
        return;
    }
}

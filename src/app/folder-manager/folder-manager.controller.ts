import { FolderManagerService } from './folder-manager.service';
import { injectable } from 'tsyringe';
import { CommandsEnum } from './types/commands.enum';
import { LoggerService } from '../../shared/services/logger.service';
import { ErrorEnum } from '../../shared/types/error.enum';

@injectable()
export class FolderManagerController {
  constructor(
    private folderManagerService: FolderManagerService,
    private loggerService: LoggerService
  ) {}

  public createFolder(folderPath: string): string {
    this.folderManagerService.createFolder(folderPath);

    return folderPath;
  }

  public moveFolder(folderPath: string, folderDestinationName: string): void {
    this.folderManagerService.moveFolder(folderPath, folderDestinationName);
  }

  public deleteFolder(folderPath: string): void {
    this.folderManagerService.deleteFolder(folderPath);
  }

  public printFolderList(): void {
    this.folderManagerService.printFolderList();
  }

  public executeCommand(commandStr: string): void {
    const [command, ...commandParams] = commandStr.split(' ');

    this.loggerService.logCommand(
      command as CommandsEnum,
      commandParams.join(' ')
    );

    switch (command as CommandsEnum) {
      case CommandsEnum.CREATE:
        this.createFolder(commandParams.join(''));
        break;

      case CommandsEnum.MOVE:
        {
          const [folderName, folderDestinationName] = commandParams;
          this.moveFolder(folderName, folderDestinationName);
        }
        break;

      case CommandsEnum.DELETE:
        this.deleteFolder(commandParams.join(''));
        break;

      case CommandsEnum.LIST:
        this.printFolderList();
        break;

      default:
        this.loggerService.logError(ErrorEnum.COMMAND_NOT_EXIST);
    }
  }
}

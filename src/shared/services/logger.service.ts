import { ErrorEnum } from '../types/error.enum';
import { singleton } from 'tsyringe';
import { CommandsEnum } from '../../app/folder-manager/types/commands.enum';
import chalk from 'chalk';

@singleton()
export class LoggerService {
  public logCommand(commandName: CommandsEnum, commandParamsStr: string): void {
    switch (commandName) {
      case CommandsEnum.CREATE:
        console.log(chalk.green(commandName), commandParamsStr);
        break;

      case CommandsEnum.MOVE:
        console.log(chalk.blue(commandName), commandParamsStr);
        break;

      case CommandsEnum.DELETE:
        console.log(chalk.red(commandName), commandParamsStr);
        break;

      case CommandsEnum.LIST:
        console.log(chalk.yellow(commandName), commandParamsStr);
        break;

      default:
        console.log(chalk.cyan(commandName), commandParamsStr);
    }
  }

  public logError(
    error: ErrorEnum,
    commandParamsStr?: string,
    errorPath = ''
  ): void {
    switch (error) {
      case ErrorEnum.DELETE_NOT_EXIST:
        console.log(
          chalk.red(
            `Cannot delete ${commandParamsStr} - ${errorPath} does not exist`
          )
        );
        break;
      case ErrorEnum.MOVE_NOT_EXIST:
        console.log(
          chalk.red(
            `Cannot move ${commandParamsStr} - ${errorPath} does not exist`
          )
        );
        break;
      case ErrorEnum.FOLDER_NOT_EXIST:
        console.log(
          chalk.red(`Error folder ${commandParamsStr} does not exist`)
        );
        break;
      default:
        console.log('Command not exists');
    }
  }

  public logFolder(
    folderName: string,
    indentCount: number,
    indentChar: string
  ): void {
    console.log(indentChar.repeat(indentCount) + folderName);
  }
}

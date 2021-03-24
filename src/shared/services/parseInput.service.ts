import fs from 'fs';
import { singleton } from 'tsyringe';

@singleton()
export class ParseInputService {
  public parseInput(path: string): string[] {
    const result = fs.readFileSync(path, { encoding: 'utf-8' });

    return result.split('\r\n');
  }
}

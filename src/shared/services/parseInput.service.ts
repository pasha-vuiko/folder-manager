import fs from 'fs';

export class ParseInputService {
    parseInput(path: string): string[] {
        const result = fs.readFileSync(path, { encoding: 'utf-8'}); // TODO Change to read stream

        return result.split('\r\n');
    }
}

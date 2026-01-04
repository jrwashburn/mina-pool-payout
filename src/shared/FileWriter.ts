import { IFileWriter } from './Model.js';
import fs from 'node:fs';
import { injectable } from 'inversify';
@injectable()
export class FileWriter implements IFileWriter {
  async write(fileName: string, jsonObject: string): Promise<void> {
    fs.writeFile(fileName, jsonObject, function (err: NodeJS.ErrnoException | null) {
      if (err) throw err;
      console.log(`wrote payout information to ${fileName}`);
    });
  }
}

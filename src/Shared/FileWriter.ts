import { IFileWriter } from "./Model"
import fs from "fs"

export class FileWriter implements IFileWriter {
    async write(fileName: string, jsonObject: any): Promise<void> {
        fs.writeFile(fileName, jsonObject, function (err: any) {
            if (err) throw err;
                console.log(`wrote payout details to ${fileName}`);
          });
    }

}
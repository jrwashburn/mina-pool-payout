export interface IFileWriter {
    write(fileName: string, jsonObject: string): Promise<void>;
}

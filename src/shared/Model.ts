export interface IFileWriter {
    write(fileName: string, jsonObject : any) : Promise <void>
}
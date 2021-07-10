
import { injectable } from "inversify";
import provider from "../../utils/provider-selector";
import { Blocks } from "./dataprovider-types";
import { IBlockDataProvider } from "./Models";


@injectable()
export class ArchiveBlockDataProvider implements IBlockDataProvider {

    //TODO: Refactor the core logic here
    async getLatestHeight(): Promise<number> {
        return await provider.getLatestHeight()
    }
    async getBlocks(key: string, minHeight: number, maxHeight: number): Promise<Blocks> {
        return await provider.getBlocks(key, minHeight, maxHeight)
    }


}
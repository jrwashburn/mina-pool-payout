
import { IBlockDataProvider } from "./Models";

import { getBlocks, getLatestHeight } from './dataprovider-archivedb/block-queries-sql'
import { injectable } from "inversify";
import { Blocks } from "./dataprovider-types";

@injectable()
export class ArchiveBlockDataProvider implements IBlockDataProvider {

    //TODO: Refactor the core logic here
    async getLatestHeight(): Promise<number> {
        return await getLatestHeight()
    }
    async getBlocks(key: string, minHeight: number, maxHeight: number): Promise<Blocks> {
        return await getBlocks(key, minHeight, maxHeight)
    }


}
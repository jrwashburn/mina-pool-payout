import { Blocks } from "../core/dataprovider-types";
import { IBlockDataProvider } from "./Models";

import { getBlocks, getLatestHeight } from '../core/dataprovider-archivedb/block-queries-sql'
import { injectable } from "inversify";

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
import { Blocks } from "../core/dataprovider-types";
import { IBlockDataProvider } from "./Models";

import { getBlocks, getLatestHeight } from '../core/dataprovider-minaexplorer/block-queries-gql'

export class MinaExplorerBlockDataProvider implements IBlockDataProvider{
    getLatestHeight(): Promise<number> {
        return getLatestHeight()
    }
    async getBlocks(key: string, minHeight: number, maxHeight: number): Promise<Blocks> {
        return await getBlocks(key, minHeight, maxHeight)
    }

}
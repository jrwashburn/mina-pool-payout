
import { injectable } from "inversify";
import { IBlockDataProvider } from "./Models";
import { Blocks } from "./dataprovider-types";
import provider from "../../utils/provider-selector";

@injectable()
export class MinaExplorerBlockDataProvider implements IBlockDataProvider{
    getLatestHeight(): Promise<number> {
        return provider.getLatestHeight()
    }
    async getBlocks(key: string, minHeight: number, maxHeight: number): Promise<Blocks> {
        return await provider.getBlocks(key, minHeight, maxHeight)
    }

}
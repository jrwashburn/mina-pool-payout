import { Blocks, Stake } from "../core/dataprovider-types";

export interface IDataProviderFactory<T> {
    build(dataSource: string) : T
}

export interface IBlockDataProvider {
    getLatestHeight() : Promise<number>,
    getBlocks(key: string, minHeight: number, maxHeight: number): Promise<Blocks>
}

export interface IStakeDataProvider {
    getStakes(ledgerHash: string, key: string): Promise<[Stake[], number]>
}
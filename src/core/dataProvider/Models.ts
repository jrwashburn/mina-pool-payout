import { Blocks, Ledger } from './dataprovider-types';

export interface IDataProviderFactory<T> {
    build(dataSource: string): T;
}

export interface IBlockDataProvider {
    getLatestHeight(): Promise<number>;
    getBlocks(key: string, minHeight: number, maxHeight: number): Promise<Blocks>;
    getMinMaxBlocksByEpoch(epoch: number, fork: number): Promise<{ min: number; max: number }>;
}

export interface IStakeDataProvider {
    getStakes(ledgerHash: string, key: string): Promise<Ledger>;
}

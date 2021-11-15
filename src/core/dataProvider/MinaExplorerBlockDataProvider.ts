import { injectable } from 'inversify';
import { IBlockDataProvider } from './Models';
import { Blocks } from './dataprovider-types';
import provider from '../../utils/provider-selector';

@injectable()
export class MinaExplorerBlockDataProvider implements IBlockDataProvider {
    getMinMaxBlocksByEpoch(epoch: number): Promise<{ min: number; max: number }> {
        return provider.getMinMaxBlocksByEpoch(epoch);
    }
    getLatestHeight(): Promise<number> {
        return provider.getLatestHeight();
    }
    async getBlocks(key: string, minHeight: number, maxHeight: number): Promise<Blocks> {
        return await provider.getBlocks(key, minHeight, maxHeight);
    }
}

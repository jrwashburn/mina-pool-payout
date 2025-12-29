import { injectable } from 'inversify';
import { IBlockDataProvider } from './Models.js';
import { Blocks } from './dataprovider-types.js';
import provider from '../../composition/provider-selector.js';

@injectable()
export class MinaExplorerBlockDataProvider implements IBlockDataProvider {
  getMinMaxBlocksByEpoch(epoch: number, fork: number): Promise<{ min: number; max: number }> {
    return provider.getMinMaxBlocksByEpoch(epoch, fork);
  }
  getLatestHeight(): Promise<number> {
    return provider.getLatestHeight();
  }
  async getBlocks(key: string, minHeight: number, maxHeight: number): Promise<Blocks> {
    return await provider.getBlocks(key, minHeight, maxHeight);
  }
}

import { injectable } from 'inversify';
import provider from '../../composition/provider-selector.js';
import { Blocks } from './dataprovider-types.js';
import { IBlockDataProvider } from './Models.js';

@injectable()
export class ArchiveBlockDataProvider implements IBlockDataProvider {
  //TODO: Refactor the core logic here
  getMinMaxBlocksByEpoch(epoch: number, fork: number): Promise<{ min: number; max: number }> {
    return provider.getMinMaxBlocksByEpoch(epoch, fork);
  }
  async getLatestHeight(): Promise<number> {
    return await provider.getLatestHeight();
  }
  async getBlocks(key: string, minHeight: number, maxHeight: number): Promise<Blocks> {
    return await provider.getBlocks(key, minHeight, maxHeight);
  }
}

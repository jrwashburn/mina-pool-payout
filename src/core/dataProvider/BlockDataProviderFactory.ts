import { injectable } from 'inversify';
import { IBlockDataProvider, IDataProviderFactory } from './Models.js';
import { ArchiveBlockDataProvider } from './ArchiveBlockDataProvider.js';
import { MinaExplorerBlockDataProvider } from './MinaExplorerBlockDataProvider.js';
import { ApiBlockDataProvider } from './ApiBlockDataProvider.js';

@injectable()
export class BlockDataProviderFactory implements IDataProviderFactory<IBlockDataProvider> {
  build(dataSource: string): IBlockDataProvider {
    if (dataSource === 'ARCHIVEDB') {
      return new ArchiveBlockDataProvider();
    } else if (dataSource === 'API') {
      return new ApiBlockDataProvider();
    }
    return new MinaExplorerBlockDataProvider();
  }
}

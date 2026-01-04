import { injectable } from 'inversify';
import { ArchiveStakeDataProvider } from './ArchiveStakesDataProvider.js';
import { MinaExplorerStakeDataProvider } from './MinaExplorerStakeDataProvider.js';
import { IDataProviderFactory, IStakeDataProvider } from './Models.js';
import { ApiStakeDataProvider } from './ApiStakesDataProvider.js';

@injectable()
export class StakeDataProviderFactory implements IDataProviderFactory<IStakeDataProvider> {
  build(dataSource: string): IStakeDataProvider {
    if (dataSource === 'ARCHIVEDB') {
      return new ArchiveStakeDataProvider();
    } else if (dataSource === 'API') {
      return new ApiStakeDataProvider();
    }
    return new MinaExplorerStakeDataProvider();
  }
}

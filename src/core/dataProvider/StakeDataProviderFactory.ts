import { injectable } from 'inversify';
import { ArchiveStakeDataProvider } from './ArchiveStakesDataProvider';
import { MinaExplorerStakeDataProvider } from './MinaExplorerStakeDataProvider';
import { IDataProviderFactory, IStakeDataProvider } from './Models';
import { ApiStakeDataProvider } from './ApiStakesDataProvider';

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

import { injectable } from 'inversify';
import { ArchiveStakeDataProvider } from './ArchiveStakesDataProvider';
import { MinaExplorerStakeDataProvider } from './MinaExplorerStakeDataProvider';
import { IDataProviderFactory, IStakeDataProvider } from './Models';

@injectable()
export class StakeDataProviderFactory implements IDataProviderFactory<IStakeDataProvider> {
    build(dataSource: string): IStakeDataProvider {
        if (dataSource === 'ARCHIVEDB') {
            return new ArchiveStakeDataProvider();
        }
        return new MinaExplorerStakeDataProvider();
    }
}

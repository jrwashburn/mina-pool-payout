import { injectable } from 'inversify';
import { ArchiveBlockDataProvider } from './ArchiveBlockDataProvider';
import { MinaExplorerBlockDataProvider } from './MinaExplorerBlockDataProvider';
import { IBlockDataProvider, IDataProviderFactory } from './Models';
import { ApiBlockDataProvider } from './ApiBlockDataProvider';

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

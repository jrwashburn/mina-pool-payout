import { injectable } from "inversify";
import { ArchiveBlockDataProvider } from "./ArchiveBlockDataProvider";
import { MinaExplorerBlockDataProvider } from "./MinaExplorerBlockDataProvider";
import { IBlockDataProvider, IDataProviderFactory } from "./Models";


@injectable()
export class BlockDataProviderFactory implements IDataProviderFactory<IBlockDataProvider> {
     build(dataSource: string) : IBlockDataProvider {
        if (dataSource === "ARCHIVEDB") {
            return new ArchiveBlockDataProvider()
        }
        return new MinaExplorerBlockDataProvider()
    }

}
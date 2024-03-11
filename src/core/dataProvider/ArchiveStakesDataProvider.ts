import { injectable } from 'inversify';
import { getStakes } from './dataprovider-archivedb/staking-ledger-json-file';
import { Ledger } from './dataprovider-types';
import { IStakeDataProvider } from './Models';

@injectable()
export class ArchiveStakeDataProvider implements IStakeDataProvider {
  //TODO: Refactor the core logic here
  async getStakes(ledgerHash: string, key: string): Promise<Ledger> {
    return getStakes(ledgerHash, key);
  }
}

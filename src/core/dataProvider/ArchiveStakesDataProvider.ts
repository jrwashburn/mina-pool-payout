import { injectable } from 'inversify';
import { getStakes } from './dataprovider-archivedb/staking-ledger-json-file.js';
import { Ledger } from './dataprovider-types.js';
import { IStakeDataProvider } from './Models.js';

@injectable()
export class ArchiveStakeDataProvider implements IStakeDataProvider {
  //TODO: Refactor the core logic here
  async getStakes(ledgerHash: string, key: string): Promise<Ledger> {
    return getStakes(ledgerHash, key);
  }
}

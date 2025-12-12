import { injectable } from 'inversify';
import { getStakes } from './dataprovider-api/staking-ledger-api.js';
import { Ledger } from './dataprovider-types.js';
import { IStakeDataProvider } from './Models.js';

@injectable()
export class ApiStakeDataProvider implements IStakeDataProvider {
  async getStakes(ledgerHash: string, key: string): Promise<Ledger> {
    return getStakes(ledgerHash, key);
  }
}

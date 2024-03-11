import { injectable } from 'inversify';
import { getStakes } from './dataprovider-api/staking-ledger-api';
import { Ledger } from './dataprovider-types';
import { IStakeDataProvider } from './Models';

@injectable()
export class ApiStakeDataProvider implements IStakeDataProvider {
  async getStakes(ledgerHash: string, key: string): Promise<Ledger> {
    return getStakes(ledgerHash, key);
  }
}

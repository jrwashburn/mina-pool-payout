import { Ledger } from './dataprovider-types.js';
import { IStakeDataProvider as IStakeDataProvider } from './Models.js';
import { getStakes } from './dataprovider-minaexplorer/staking-ledger-gql.js';
import { injectable } from 'inversify';

@injectable()
export class MinaExplorerStakeDataProvider implements IStakeDataProvider {
  //TODO: Refactor the core logic here
  async getStakes(ledgerHash: string, key: string): Promise<Ledger> {
    return getStakes(ledgerHash, key);
  }
}

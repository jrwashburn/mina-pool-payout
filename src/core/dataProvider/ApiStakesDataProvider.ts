import { injectable } from 'inversify';
import { getStakes } from './dataprovider-api/staking-ledger-api';
import { Stake } from './dataprovider-types';
import { IStakeDataProvider } from './Models';

@injectable()
export class ApiStakeDataProvider implements IStakeDataProvider {
    async getStakes(ledgerHash: string, key: string): Promise<[Stake[], number]> {
        return getStakes(ledgerHash, key);
    }
}

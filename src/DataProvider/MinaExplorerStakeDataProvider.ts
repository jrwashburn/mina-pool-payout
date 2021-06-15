import { Stake } from "../core/dataprovider-types";
import { IStakeDataProvider as IStakeDataProvider } from "./Models";
import { getStakes } from '../core/dataprovider-minaexplorer/staking-ledger-gql'
import { injectable } from "inversify";

@injectable()
export class MinaExplorerStakeDataProvider implements IStakeDataProvider {

    //TODO: Refactor the core logic here
    async getStakes(ledgerHash: string, key: string): Promise<[Stake[], number]> {
        return getStakes(ledgerHash, key)
    }
}
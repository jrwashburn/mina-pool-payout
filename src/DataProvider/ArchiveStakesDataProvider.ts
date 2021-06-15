import { Stake } from "../core/dataprovider-types";
import { IStakeDataProvider as IStakeDataProvider } from "./Models";

import { getStakes } from '../core/dataprovider-archivedb/staking-ledger-json-file'
import { injectable } from "inversify";

@injectable()
export class ArchiveStakeDataProvider implements IStakeDataProvider {

    //TODO: Refactor the core logic here
    async getStakes(ledgerHash: string, key: string): Promise<[Stake[], number]> {
        return getStakes(ledgerHash, key)
    }
}
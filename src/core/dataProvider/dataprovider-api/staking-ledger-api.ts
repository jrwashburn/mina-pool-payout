import { Stake } from '../dataprovider-types';

const baseUrl = process.env.PAYOUT_API_ENDPOINT;

export async function getStakes(ledgerHash: string, key: string): Promise<[Stake[], number]> {
    const result = await fetch(`${baseUrl}/staking-ledger/${ledgerHash}?key=${key}`)
                    .then(x => x.json());

    let stakingLedgers = result as StakingLedgerResponse;

    return [stakingLedgers.stakes, stakingLedgers.totalbalance];
}


interface StakingLedgerResponse{
    stakes: Stake[];
    totalbalance: number;
}
import { fetchGraphQL } from '../../../infrastructure/graphql-me';
import { Stake, LedgerEntry } from '../dataprovider-types';
import { calculateUntimedSlot, getPublicKeyShareClass } from '../../../utils/staking-ledger-util';
import { gql } from '@apollo/client/core';

const LEDGERQUERY = gql`
    query stakingLedger($ledgerHash: String, $delegate: String) {
        stakes(limit: 10000, query: { ledgerHash: $ledgerHash, delegate: $delegate }) {
            pk
            balance
            delegate
            timing {
                cliff_amount
                cliff_time
                initial_minimum_balance
                vesting_increment
                vesting_period
            }
        }
    }
`;

// for a given key, find all the stakers delegating to the provided public key (according to the provided epoch staking ledger)
// determine when key will be unlocked and eligible for supercharged coinbase awards
export async function getStakes(ledgerHash: string, key: string): Promise<[Stake[], number]> {
    let totalStakingBalance = 0;
    let stakers: Stake[] = [];
    const { errors, data } = await fetchGraphQL(LEDGERQUERY, { ledgerHash: ledgerHash, delegate: key });

    if (errors) {
        console.log(errors);
        throw new Error('could not get ledger from MinaExplorer');
    } else {
        stakers = data.stakes.map((stake: LedgerEntry) => {
            const balance = Number(stake.balance);
            totalStakingBalance += balance;
            return {
                publicKey: stake.pk,
                total: 0,
                totalToBurn: 0,
                stakingBalance: balance,
                untimedAfterSlot: calculateUntimedSlot(stake),
                shareClass: getPublicKeyShareClass(stake.pk),
            };
        });
    }
    return [stakers, totalStakingBalance];
}

import { calculateUntimedSlot, getPublicKeyShareClass } from '../../../utils/staking-ledger-util';
import { Ledger, LedgerEntry, Stake } from '../dataprovider-types';
import fs from 'fs';
import path from 'path';

// for a given key, find all the stakers delegating to the provided public key (according to the provided epoch staking ledger)
// determine when key will be unlocked and eligible for supercharged coinbase awards
export function getStakes(ledgerHash: string, key: string): Ledger {
    let totalStakingBalance = 0;
    const ledgerFile = path.join(__dirname, '..', '..', '..', 'data', 'ledger', `${ledgerHash}.json`);
    try {
        const data = fs.readFileSync(ledgerFile, 'utf-8');
        const ledger = JSON.parse(data);
        const stakers: Stake[] = ledger
            .filter((entry: LedgerEntry) => entry.delegate == key)
            .map((stake: LedgerEntry) => {
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
        return { stakes: stakers, totalStakingBalance: totalStakingBalance };
    } catch (error) {
        throw new Error(`Could not load ledger file ${ledgerFile} for hash ${ledgerHash}`);
    }
}
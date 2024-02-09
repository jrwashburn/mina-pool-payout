import { calculateUntimedSlot, getPublicKeyShareClass } from '../../../utils/staking-ledger-util';
import { Ledger, LedgerEntry, Stake } from '../dataprovider-types';
import fs from 'fs';

// for a given key, find all the stakers delegating to the provided public key (according to the provided epoch staking ledger)
// determine when key will be unlocked and eligible for supercharged coinbase awards
export function getStakes(ledgerHash: string, key: string): Ledger {
    let totalStakingBalance = 0;
    // get the stakes from staking ledger json
    // TODO: this might need to be reworked for large files
    const ledgerDirectory = '../../../data/ledger'; // TODO: Move this back to .env
    const ledgerFile = `${ledgerDirectory}/${ledgerHash}.json`;
    // if (!fs.existsSync(ledgerFile)){ throw new Error(`Couldn't locate ledger for hash ${ledgerHash}`)}

    fs.readFile(ledgerFile, 'utf-8', (error, data) => {
        if (error) {
            throw error;
        }

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
    });

    throw new Error(`Couldn't locate ledger for hash ${ledgerHash}`);
}

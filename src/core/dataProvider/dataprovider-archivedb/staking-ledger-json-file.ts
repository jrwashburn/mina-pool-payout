import { calculateUntimedSlot, getPublicKeyShareClass } from '../../../utils/staking-ledger-util';
import { LedgerEntry, Stake } from '../dataprovider-types';

// for a given key, find all the stakers delegating to the provided public key (according to the provided epoch staking ledger)
// determine when key will be unlocked and eligible for supercharged coinbase awards
export function getStakes(ledgerHash: string, key: string): [Stake[], number] {
    let totalStakingBalance = 0;
    // get the stakes from staking ledger json
    // TODO: this might need to be reworked for large files
    const ledgerDirectory = '../../../data/ledger'; // TODO: Move this back to .env
    const ledgerFile = `${ledgerDirectory}/${ledgerHash}.json`;
    // if (!fs.existsSync(ledgerFile)){ throw new Error(`Couldn't locate ledger for hash ${ledgerHash}`)}

    //TODO: Find a different way to handle this without doing require in const
    const ledger = require(ledgerFile);

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
    return [stakers, totalStakingBalance];
}

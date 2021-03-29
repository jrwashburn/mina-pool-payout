import { Block, Stake, LedgerEntry } from '../dataprovider-types'
import { calculateUntimedSlot, getPublicKeyShareClass } from '../stakes-util'
import fs from "fs";

// for a given key, find all the stakers delegating to the provided public key (according to the provided epoch staking ledger)
// determine when key will be unlocked and eligible for supercharged coinbase awards
export function getStakes (ledgerHash: string, key: string): [Stake[], number] {
  let totalStakingBalance: number = 0;
  // get the stakes from staking ledger json
  // TODO: this might need to be reworked for large files
  const ledgerDirectory = "../../data/ledger"; // TODO: Move this back to .env
  const ledgerFile = `${ledgerDirectory}/${ledgerHash}.json`;
  // if (!fs.existsSync(ledgerFile)){ throw new Error(`Couldn't locate ledger for hash ${ledgerHash}`)}
  const ledger = require(ledgerFile);

  const stakers: Stake[] = ledger
    .filter((entry: LedgerEntry) => entry.delegate == key)
    .map((stake: LedgerEntry) => {
      const balance = Number(stake.balance);
      totalStakingBalance += balance;
      return {
        publicKey: stake.pk,
        total: 0,
        stakingBalance: balance,
        untimedAfterSlot: calculateUntimedSlot(stake),
        shareClass: getPublicKeyShareClass(stake.pk)
      };
    });
  return [stakers, totalStakingBalance];
}

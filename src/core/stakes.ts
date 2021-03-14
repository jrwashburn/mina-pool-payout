export type StakingKey = {
  publicKey: string,
  total: number,
  stakingBalance: number,
  untimedAfterSlot: number
};

//TODO: Add remaining field definitions as needed
export type LedgerEntry =   {
  pk: string,
  balance: number,
  delegate: string
};

// for a given key, find all the stakers delegating to the provided public key (according to the provided epoch staking ledger)
// calculate timed weighting
export function getStakes(ledgerHash: string, key: string, globalSlotStart: number, slotsPerEpoch: number): [StakingKey[], number] {
  let totalStakingBalance: number = 0;
  // get the stakes from staking ledger json
  // TODO: this might need to be reworked for large files
  const ledgerDirectory = "../data/ledger"; // TODO: Move this back to .env
  const ledgerFile = `${ledgerDirectory}/${ledgerHash}.json`;
  // if (!fs.existsSync(ledgerFile)){ throw new Error(`Couldn't locate ledger for hash ${ledgerHash}`)}
  const ledger = require(ledgerFile);

  const stakers: StakingKey[] = ledger
    .filter((entry: LedgerEntry) => entry.delegate == key)
    .map((stake: LedgerEntry) => {
      const balance = Number(stake.balance);
      totalStakingBalance += balance;
      return {
        publicKey: stake.pk,
        total: 0,
        stakingBalance: balance,
        untimedAfterSlot: calculateUntimedSlot(stake)
      };
    });
  return [stakers, totalStakingBalance];
}
  
// Changed from original implementation to simply return the slot number at which account beomes untimed
function calculateUntimedSlot(stake: any): number {

  // account is not locked if there is no timing section at all
  if (typeof (stake.timing) === 'undefined') {
    // Untimed for full epoch so we have the maximum weighting of 1
    return 0;
  } else {
    const vestingPeriod: number = Number(stake.timing.vesting_period);
    const vestingIncrement: number = Number(stake.timing.vesting_increment);
    const cliffTime: number = Number(stake.timing.cliff_time);
    const cliffAmount: number = Number(stake.timing.cliff_amount);
    const initialMinimumBalance: number = Number(stake.timing.initial_minimum_balance);

    if (vestingIncrement == 0) {
      //if vestingIncrement is zero, account may never unlock
      if (cliffAmount == initialMinimumBalance) {
        return cliffTime;
      } else {
        throw new Error('Timed Account with no increment - unsure how to handle');
      }
    } else {
      return ((((initialMinimumBalance - cliffAmount) / vestingIncrement) * vestingPeriod) + cliffTime);
    }
  }
}

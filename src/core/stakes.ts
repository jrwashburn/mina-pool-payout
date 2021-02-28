// TODO: where should we get ledger from - currently expects export from 'coda ledger export staking-epoch-ledger'
import ledger from "../data/staking-epoch-ledger.json";

export type StakingKey = { 
  publicKey: string;
  total: number;
  stakingBalance: number;
  untimedAfterSlot: number;
  timedWeighting: number;
  };

// for a given key, find all the stakers delegating to the provided public key (according to the provided epoch staking ledger)
// calculate timed weighting 
export function getStakes(key: string, globalSlotStart: number, slotsPerEpoch: number ): [StakingKey[], number] {
  let stakes = ledger.filter((x) => x.delegate == key);
  let stakers: StakingKey[] = [];
  let totalStakingBalance: number = 0;
  
  stakes.forEach((stake: any) => {
    let balance = Number(stake.balance);
    stakers.push({
      publicKey: stake.pk,
      total: 0,
      stakingBalance: balance,
      untimedAfterSlot: calculateUntimedSlot(stake),
      timedWeighting: 1 // TODO: POPULATE THIS
    });
    totalStakingBalance += balance;
  });
  return [stakers, totalStakingBalance];
}

// TODO: reimplement timing check
// Changed from original implementation to simply return the slot number at which account beomes untimed
function calculateUntimedSlot( stake: any): number {
  
  // account is not locked if there is no timing section at all
  if ( typeof(stake.timing) === 'undefined') {
    // Untimed for full epoch so we have the maximum weighting of 1
    return 0;
  } else {
    let vestingPeriod: number = Number(stake.timing.vesting_period);
    let vestingIncrement: number = Number(stake.timing.vesting_increment);
    let cliffTime: number = Number(stake.timing.cliff_time);
    let cliffAmount: number = Number(stake.timing.cliff_amount);
    let initialMinimumBalance: number = Number(stake.timing.initial_minimum_balance);

    if (vestingIncrement = 0) { 
      // TODO: This may be a dangerous assumption; it's repeated below if vestingPeriod = 0
      // Instead of cliffTime, it may be that the balance is never really unlocked at all and it should not be supercharged
      // better approach may be to check if cliffAmount = initialMinimumBalance, then it is okay to assume cliffTime, else infinity?
      return cliffTime;
    } else {
      return (((( initialMinimumBalance - cliffAmount) / vestingIncrement ) * vestingPeriod) + cliffTime) ;
    }
  }
}
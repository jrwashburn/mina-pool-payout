import ledger from "../data/staking-epoch-ledger.json";

export type StakingKeys = { 
  publicKey: string;
  total: number;
  stakingBalance: number;
  timedWeighting: number;
  }[];

export function getStakes(key: string, globalSlotStart: number, slotsPerEpoch: number ) {
  let stakes = ledger.filter((x) => x.delegate == key);
  let stakers: StakingKeys = [];
  let totalStakingBalance = 0;
  
  stakes.forEach((stake: any) => {
    let balance = +stake.balance;
    stakers.push({
      publicKey: stake.pk,
      total: 0,
      stakingBalance: balance,
      timedWeighting: timedWeighting(stake, globalSlotStart, slotsPerEpoch)
    });
    totalStakingBalance += balance;
  });
  return {stakes, totalStakingBalance};
}

// TODO: reimplement timing check
export function timedWeighting(
  ledger: any,
  globalSlotStart: number,
  slotsPerEpoch: number
): number {
  // Takes in a staking ledger and determines the timed factor for the account

  //console.log(ledger);
  return 1;
  /*
if (!ledger.timing) {
    // Untimed for full epoch so we have the maximum weighting of 1
    return 1;
  } else {
    // This is timed at the end of the epoch so we always return 0
    if (ledger.timing.timed_epoch_end) {
      return 0;
    } else {
      // This must be timed for only a portion of the epoch
      let timedEnd = ledger.timing.untimed_slot;
      let globalSlotEnd = globalSlotStart + slotsPerEpoch;
      // Need to get the global slot start and end of the epoch
      return (globalSlotEnd - timedEnd / slotsPerEpoch);
    }
  }
  */
}
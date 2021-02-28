// TODO: where should we get ledger from - currently expects export from 'coda ledger export staking-epoch-ledger'
import ledger from "../data/staking-epoch-ledger.json";

export type StakingKeys = { 
  publicKey: string;
  total: number;
  stakingBalance: number;
  untimedAfterSlot: number;
  }[];

// for a given key, find all the stakers delegating to the provided public key (according to the provided epoch staking ledger)
// calculate timed weighting 
export function getStakes(key: string, globalSlotStart: number, slotsPerEpoch: number ): StakingKeys {
  let stakes = ledger.filter((x) => x.delegate == key);
  let stakers: StakingKeys = [];
  
  stakes.forEach((stake: any) => {
    let balance = +stake.balance;
    stakers.push({
      publicKey: stake.pk,
      total: 0,
      stakingBalance: balance,
      untimedAfterSlot: timedWeighting(stake)
    });
  });
  return stakers;
}

// TODO: reimplement timing check
export function timedWeighting( stake: any): number {
  
  // account is not locked if there is no timing section at all
  if ( typeof(stake.timing) === 'undefined') {
    // Untimed for full epoch so we have the maximum weighting of 1
    return 1;
  } else {

    let vestingPeriod: number = stake.timing.vesting_period.tonumber();
    let vestingIncrement: number = stake.timing.vesting_increment.tonumber();
    let cliffTime: number = stake.timing.cliff_time.tonumber();
    let cliffAmount: number = stake.timing.cliff_amount.tonumber();
    let initialMinimumBalance: number = stake.timing.initial_minimum_balance.tonumber();

    if (((( initialMinimumBalance - cliffAmount) / vestingIncrement ) * vestingPeriod) + cliffTime) < 
    
    ((initial minimum balance - cliff amount / vesting increment ) * vesting_period) + cliff_time)


    //Account is not locked if the cliff has been reached and there is no more incremental vesting?
    if ( stake.timing.vesting_period == "0" || stake.timing.vesting_increment =="0")

    // This is timed at the end of the epoch so we always return 0
    if (stake.timing.timed_epoch_end) {
      return 0;
    } else {
      // This must be timed for only a portion of the epoch
      let timedEnd = ledger.timing.
      let globalSlotEnd = globalSlotStart + slotsPerEpoch;
      // Need to get the global slot start and end of the epoch
      return (globalSlotEnd - timedEnd / slotsPerEpoch);
    }
  }
  */
/*
def calculate_end_slot_timed_balance(timing):
        vested_height_global_slot = int(timing["cliff_time"]) + (
            (int(timing["initial_minimum_balance"]) -
             int(timing["cliff_amount"])) /
            int(timing["vesting_increment"])) * int(timing["vesting_period"])

    return int(vested_height_global_slot)

*/

  /* EXAMPLE w/ and w/out timing:
   {
    "pk": "B62qiy32p8kAKnny8ZFwoMhYpBppM1DWVCqAPBYNcXnsAHhnfAAuXgg",
    "balance": "0.000001",
    "delegate": "B62qiy32p8kAKnny8ZFwoMhYpBppM1DWVCqAPBYNcXnsAHhnfAAuXgg",
    "token": "1",
    "token_permissions": {},
    "receipt_chain_hash": "2mzbV7WevxLuchs2dAMY4vQBS6XttnCUF8Hvks4XNBQ5qiSGGBQe",
    "voting_for": "3NK2tkzqqK5spR2sZ7tujjqPksL45M3UUrcA4WhCkeiPtnugyE2x",
    "permissions": {
      "stake": true,
      "edit_state": "signature",
      "send": "signature",
      "set_delegate": "signature",
      "set_permissions": "signature",
      "set_verification_key": "signature"
    }
  },
  {
    "pk": "B62qmqMrgPshhHKLJ7DqWn1KeizEgga5MuGmWb2bXajUnyivfeMW6JE",
    "balance": "372093",
    "delegate": "B62qrecVjpoZ4Re3a5arN6gXZ6orhmj1enUtA887XdG5mtZfdUbBUh4",
    "timing": {
      "initial_minimum_balance": "372093", 
      "cliff_time": "86400",
      "cliff_amount": "372093",
      "vesting_period": "1",
      "vesting_increment": "0"
    },
    "token": "1",
    "token_permissions": {},
    "receipt_chain_hash": "2mzbV7WevxLuchs2dAMY4vQBS6XttnCUF8Hvks4XNBQ5qiSGGBQe",
    "voting_for": "3NK2tkzqqK5spR2sZ7tujjqPksL45M3UUrcA4WhCkeiPtnugyE2x",
    "permissions": {
      "stake": true,
      "edit_state": "signature",
      "send": "signature",
      "set_delegate": "signature",
      "set_permissions": "signature",
      "set_verification_key": "signature"
    }
  },

  Another example:
      "timing": {
      "initial_minimum_balance": "66000",
      "cliff_time": "172800",
      "cliff_amount": "16500",
      "vesting_period": "1",
      "vesting_increment": "0"
    },

  */
}
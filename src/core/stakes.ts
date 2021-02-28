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
export function getStakes(key: string, globalSlotStart: number, slotsPerEpoch: number ): StakingKeys {  //{StakingKeys, number}
  let stakes = ledger.filter((x) => x.delegate == key);
  let stakers: StakingKeys = [];
  let totalStakingBalance: number = 0;
  
  stakes.forEach((stake: any) => {
    let balance = Number(stake.balance);
    stakers.push({
      publicKey: stake.pk,
      total: 0,
      stakingBalance: balance,
      untimedAfterSlot: timedWeighting(stake)
    });
    totalStakingBalance += balance;
  });
  return stakers; //{stakers, totalStakingBalance};
}

// TODO: reimplement timing check
// Changed from original implementation to simply return the slot number at which account beomes untimed
export function timedWeighting( stake: any): number {
  
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

    return (((( initialMinimumBalance - cliffAmount) / vestingIncrement ) * vestingPeriod) + cliffTime) ;
    // sample: 66k min, 16500 vest at 1 year, 1650 per month thereafter 
    // e.g. ((60000 - 12000 = 48000) / 150 = 320) * 6 = 1920 ) + 150 = 2070 
    }
  }

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

  Another example:
    "timing": {
      "initial_minimum_balance": "60000",
      "cliff_time": "150",
      "cliff_amount": "12000",
      "vesting_period": "6",
      "vesting_increment": "150"

  */
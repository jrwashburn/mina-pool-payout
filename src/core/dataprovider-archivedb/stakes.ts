import { Block, Stake, LedgerEntry } from "../dataprovider-interface";
import fs from "fs";

// for a given key, find all the stakers delegating to the provided public key (according to the provided epoch staking ledger)
// determine when key will be unlocked and eligible for supercharged coinbase awards
export function getStakes(ledgerHash: string, key: string): [Stake[], number] {
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
        shareClass: GetPublicKeyShareClass(stake.pk)
      };
    });
  return [stakers, totalStakingBalance];
}

export function stakeIsLocked(stake: Stake, block: Block) {
  return stake.untimedAfterSlot && stake.untimedAfterSlot > block.globalslotsincegenesis;
}

const foundationAddresses = fs.readFileSync(`${__dirname}/../../data/nps-addresses/Mina_Foundation_Addresses.csv`).toString().split(/[\n\r]+/);
const o1labsAddresses = fs.readFileSync(`${__dirname}/../../data/nps-addresses/O1_Labs_addresses.csv`).toString().split(/[\n\r]+/);

function GetPublicKeyShareClass(key: string) {
  if (foundationAddresses.includes(key) || o1labsAddresses.includes(key)) {
    return "NPS";
  } else {
    return "Common";
  }
}

// Changed from original implementation to simply return the slot number at which account beomes untimed
function calculateUntimedSlot(ledgerEntry: LedgerEntry): number {

  // account is not locked if there is no timing section at all
  if (typeof (ledgerEntry.timing) === 'undefined') {
    // Untimed for full epoch so we have the maximum weighting of 1
    return 0;
  } else {
    const vestingPeriod: number = Number(ledgerEntry.timing.vesting_period);
    const vestingIncrement: number = Number(ledgerEntry.timing.vesting_increment);
    const cliffTime: number = Number(ledgerEntry.timing.cliff_time);
    const cliffAmount: number = Number(ledgerEntry.timing.cliff_amount);
    const initialMinimumBalance: number = Number(ledgerEntry.timing.initial_minimum_balance);

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

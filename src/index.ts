import { getPayouts } from "./core/payouts";
import { StakingKey, getStakes } from "./core/stakes";

// TODO: Error handling
// TODO: Check mina vs nano calcs
// TODO: Add parameter to run read-only vs. write which would persist max height processed so it is not re-processed in future

async function main() {
  // TODO: Fail if any required values missing from .env
  const stakingPoolPublicKey: string = process.env.POOL_PUBLIC_KEY || "";
  const globalSlotStart = Number(process.env.GLOBAL_SLOT_START);
  const minHeight = Number(process.env.MIN_HEIGHT); // This can be the last known payout or this could be a starting date
  const minimumConfirmations = Number(process.env.MIN_CONFIRMATIONS);
  // MAX_HEIGHT is optional - if not provided, set to max
  let maximumHeight = 0;
  if (typeof (process.env.MAX_HEIGHT) === 'undefined') {
    maximumHeight = Number.MAX_VALUE;
  } else {
    maximumHeight = Number(process.env.MAX_HEIGHT);
  }
  const slotsPerEpoch = Number(process.env.SLOTS_PER_EPOCH);
  const commissionRate = Number(process.env.COMMISSION_RATE);

  console.log(`This script will payout from block ${minHeight} to the lower of maximum height ${maximumHeight} or the current max height minus required confirmations of: ${minimumConfirmations}`);

  // get the stakes from staking ledger json
  // TODO: move path to staking ledger files to env
  let [stakers, totalStake] = getStakes(stakingPoolPublicKey, globalSlotStart, slotsPerEpoch);

  const payouts = await getPayouts(stakingPoolPublicKey, minHeight, minimumConfirmations, maximumHeight, stakers, totalStake, commissionRate);
  console.log(payouts);
}

main();

import { getPayouts } from "./core/payouts";

// TODO: Error handling
// TODO: Check mina vs nano calcs
// TODO: Add parameter to run read-only vs. write which would persist max height processed so it is not re-processed in future

async function main() {
  // TODO: Fail if any required values missing from .env
  const stakingPoolPublicKey: string = process.env.POOL_PUBLIC_KEY || "";
  const globalSlotStart = Number(process.env.GLOBAL_SLOT_START);
  const minHeight = Number(process.env.MIN_HEIGHT); // This can be the last known payout or this could be a starting date
  // TODO: Get K programatically? Required dependency on a running node
  const minimumConfirmations = Number(process.env.MIN_CONFIRMATIONS);
  const slotsPerEpoch = Number(process.env.SLOTS_PER_EPOCH);
  const commissionRate = Number(process.env.COMMISSION_RATE);

  console.log(`This script will payout from block ${minHeight} to the current max height minus required confirmations of: ${minimumConfirmations}`);
  const payouts = await getPayouts(stakingPoolPublicKey, minHeight, globalSlotStart, minimumConfirmations, slotsPerEpoch, commissionRate);
  console.log(payouts);
}

main();

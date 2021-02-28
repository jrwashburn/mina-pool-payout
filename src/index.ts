import { getPayouts } from "./core/payouts";

// TODO: Error handling
// TODO: Check mina vs nano calcs
// TODO: Add parameter to run read-only vs. write which would persist max height processed so it is not re-processed in future

async function main() {
  // TODO: Fail if any required values missing from .env
  const stakingPoolKey: string = process.env.MINA_KEY || "";
  const globalSlotStart = Number(process.env.GLOBAL_SLOT_START);
  const minHeight = Number(process.env.MIN_HEIGHT); // This can be the last known payout or this could be a starting date
  // TODO: Get K programatically? Required dependency on a running node
  const k = Number(process.env.K);
  const slotsPerEpoch = Number(process.env.SLOTS_PER_EPOCH);
  const commissionRate = Number(process.env.COMMISSION_RATE);

  console.log(`This script will payout from blocks ${minHeight} to the current max height minus k: ${k}`);
  const payouts = await getPayouts(stakingPoolKey, minHeight, globalSlotStart, k, slotsPerEpoch, commissionRate);
  console.log(payouts);
}

main();

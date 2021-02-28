import { getPayouts } from "./core/payouts";

//TODO: Error handling
//TODO: Check mina vs nano calcs

async function main() {
  //TODO: Fail if any required values missing from .env
  //TODO: Use stakingEpoch and chainId?
  const stakingPoolKey: string = process.env.MINA_KEY || "";
  const globalSlotStart = Number(process.env.GLOBAL_SLOT_START);
  const minHeight = Number(process.env.MIN_HEIGHT); // This can be the last known payout or this could be a starting date
  // TODO: Get K programatically
  const k = Number(process.env.K);
  const slotsPerEpoch = Number(process.env.SLOTS_PER_EPOCH);
  const commissionRate = Number(process.env.COMMISSION_RATE);
  
  const payouts = await getPayouts(stakingPoolKey, minHeight, globalSlotStart, k, slotsPerEpoch, commissionRate);
  console.log(payouts);
}

main();

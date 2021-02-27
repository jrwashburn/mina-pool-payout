import { getPayouts } from "./core/payouts";

//TODO: Error handling
//TODO: Check mina vs nano calcs

async function main() {
  //TODO: Fail if any required values missing from .env
  //TODO: Use stakingEpoch and chainId?
  const key: string = process.env.MINA_KEY || "";
  const stakingEpoch = Number(process.env.STAKING_EPOCH);
  const globalSlotStart = Number(process.env.GLOBAL_SLOT_START);
  const chainId = Number(process.env.CHAIN_ID); // can be multiple epoch if hard fork - TODO this should use staking ledger hash
  const minHeight = Number(process.env.MIN_HEIGHT); // This can be the last known payout or this could be a starting date

  const payouts = await getPayouts(key, minHeight, stakingEpoch, chainId, globalSlotStart);
  console.log(payouts);
}

main();

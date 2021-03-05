var fs = require('fs');
import { getPayouts } from "./core/payouts";
import { getStakes } from "./core/stakes";
import { getBlocks, getLatestHeight } from "./core/queries";

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
  let configuredMaximum = 0;
  if (typeof (process.env.MAX_HEIGHT) === 'undefined') {
    configuredMaximum = Number.MAX_VALUE;
  } else {
    configuredMaximum = Number(process.env.MAX_HEIGHT);
  }
  const slotsPerEpoch = Number(process.env.SLOTS_PER_EPOCH);
  const commissionRate = Number(process.env.COMMISSION_RATE);

  let maximumHeight = await determineLastBlockHeightToProcess(configuredMaximum, minimumConfirmations);

  console.log(`This script will payout from block ${minHeight} to maximum height ${maximumHeight}`);

  // get the stakes from staking ledger json
  // TODO: move path to staking ledger files to env
  let [stakers, totalStake] = getStakes(stakingPoolPublicKey, globalSlotStart, slotsPerEpoch);
  console.log(`The pool total staking balance is ${totalStake}`);

  // get the blocks from archive db
  const blocks = await getBlocks(stakingPoolPublicKey, minHeight, maximumHeight);

  let [payouts, blocksIncluded, allBlocksTotalRewards, allBlocksTotalPoolFees, totalPayout] = await getPayouts(blocks, stakers, totalStake, commissionRate);

  // Checking total results
  console.log(`We won these blocks: ${blocksIncluded}`);
  console.log(`We are paying out based on total rewards of ${allBlocksTotalRewards} nanomina in this window.`);
  console.log(`That is ${allBlocksTotalRewards / 1000000000} mina`);
  console.log(`The Pool Fee is is ${allBlocksTotalPoolFees / 1000000000} mina`);
  console.log(`Total Payout should be ${(allBlocksTotalRewards) - (allBlocksTotalPoolFees)} nanomina or ${((allBlocksTotalRewards) - (allBlocksTotalPoolFees)) / 1000000000} mina`)
  console.log(`The Total Payout is actually: ${totalPayout} nm or ${totalPayout / 1000000000} mina`)



  //TODO: Store data
  // 1 - write storePayout to payout_details_[ccyymmddhhmmss]_[lastBlockHeight].json
  // 2 - write payoutJson to payout_transactions_[ccyymmddhhmmss]_[lastBlockHeight].json
  // 3 - write control file to log last block processed. payout_control.json format tbd. append-only {payoutDetails: hash, payoutTransactions: hash, lastBlockProcessed: blockHeight}
  // control file should be based on command line flag
  // calculate will run the process and generate the files - append DRAFT to filename after [lastBlockHeight]
  // commit will run the process, hash the payoutjson, hash the storePayout file and save those to the control file along with the last block processed

  fs.writeFile("payouts.json", JSON.stringify(payouts), function (err: any) {
    if (err) throw err;
    console.log('wrote payouts to payouts.json');
  }
  );
}

async function determineLastBlockHeightToProcess(maximumHeight: number, minimumConfirmations: number): Promise<number> {
  // Finality is understood to be max height minus k blocks. unsafe to process blocks above maxHeight since they could change if there is a long running, short-range fork
  // Alternatively, stop processing at maximum height if lower than finality
  // TODO: where does this really belong?
  let maximum = 0
  const finalityHeight = await getLatestHeight() - minimumConfirmations;
  if (finalityHeight > maximumHeight) {
    maximum = maximumHeight;
  } else {
    maximum = finalityHeight;
  }
  return maximum;
}
main();

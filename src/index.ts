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
  const minimumHeight = Number(process.env.MIN_HEIGHT); // This can be the last known payout or this could be a starting date
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

  console.log(`This script will payout from block ${minimumHeight} to maximum height ${maximumHeight}`);

  // get the stakes from staking ledger json
  // TODO: move path to staking ledger files to env
  let [stakers, totalStake] = getStakes(stakingPoolPublicKey, globalSlotStart, slotsPerEpoch);
  console.log(`The pool total staking balance is ${totalStake}`);

  // get the blocks from archive db
  const blocks = await getBlocks(stakingPoolPublicKey, minimumHeight, maximumHeight);

  let [payouts, storePayout, blocksIncluded, allBlocksTotalRewards, allBlocksTotalPoolFees, totalPayout] = await getPayouts(blocks, stakers, totalStake, commissionRate);

  // Checking total results
  console.log(`We won these blocks: ${blocksIncluded}`);
  console.log(`We are paying out based on total rewards of ${allBlocksTotalRewards} nanomina in this window.`);
  console.log(`That is ${allBlocksTotalRewards / 1000000000} mina`);
  console.log(`The Pool Fee is is ${allBlocksTotalPoolFees / 1000000000} mina`);
  console.log(`Total Payout should be ${(allBlocksTotalRewards) - (allBlocksTotalPoolFees)} nanomina or ${((allBlocksTotalRewards) - (allBlocksTotalPoolFees)) / 1000000000} mina`)
  console.log(`The Total Payout is actually: ${totalPayout} nm or ${totalPayout / 1000000000} mina`)

  let runDateTime = new Date();
  let payoutTransactionsFileName = `payout_transactions_${longDateString(runDateTime)}_${minimumHeight}_${maximumHeight}.json`

  fs.writeFile(payoutTransactionsFileName, JSON.stringify(payouts), function (err: any) {
    if (err) throw err;
    console.log(`wrote payouts transactions to ${payoutTransactionsFileName}`);
  });

  let payoutDetailsFileName = `payout_details_${longDateString(runDateTime)}_${minimumHeight}_${maximumHeight}.json`
  fs.writeFile(payoutDetailsFileName, JSON.stringify(storePayout), function (err: any) {
    if (err) throw err;
    console.log(`wrote payout details to ${payoutDetailsFileName}`);
  });
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

function longDateString(d: Date) {
  return d.getFullYear() + String(d.getMonth()).padStart(2, '0') + String(d.getDay()).padStart(2, '0') + '_' +
    String(d.getHours()).padStart(2, '0') + String(d.getMinutes()).padStart(2, '0') + String(d.getSeconds()).padStart(2, '0');
};

main();

import { getPayouts } from "./core/payouts";
import { getStakes } from "./core/stakes";
import { getBlocks, getLatestHeight } from "./core/queries";
// TODO: move path to staking ledger files to env
// where should we get ledger from - currently expects export from 'coda ledger export staking-epoch-ledger'
import ledger from "./data/staking-epoch-ledger.json";
import CodaSDK, { keypair } from "@o1labs/client-sdk";
import { signTransactionsToSend } from "./core/sign";
import { stringify } from "node:querystring";
import fs from "fs";

// TODO: create mina currency types

async function main() {
  // TODO: Error handling
  // TODO: Add parameter to run read-only vs. write which would persist max height processed so it is not re-processed in future
  // TODO: Fail if any required values missing from .env
  const stakingPoolPublicKey: string = process.env.POOL_PUBLIC_KEY || "";
  const globalSlotStart = Number(process.env.GLOBAL_SLOT_START) || 0;
  const minimumHeight = Number(process.env.MIN_HEIGHT); // This can be the last known payout or this could be a starting date
  const minimumConfirmations = Number(process.env.MIN_CONFIRMATIONS) || 0;
  const slotsPerEpoch = Number(process.env.SLOTS_PER_EPOCH);
  const commissionRate = Number(process.env.COMMISSION_RATE);
  const transactionFee = Number(process.env.SEND_TRANSACTION_FEE) || 0;
  const nonce = Number(process.env.STARTING_NONCE) || 0;
  const senderKeys: keypair = {
    privateKey: process.env.PRIVATE_KEY || "",
    publicKey: process.env.PUBLIC_KEY || ""
  };

  // MAX_HEIGHT is optional - if not provided, set to max
  let configuredMaximum = 0;
  if (typeof (process.env.MAX_HEIGHT) === 'undefined') {
    configuredMaximum = Number.MAX_VALUE;
  } else {
    configuredMaximum = Number(process.env.MAX_HEIGHT);
  }

  // get current maximum block height from database and determine what max block height for this run will be
  const maximumHeight = await determineLastBlockHeightToProcess(configuredMaximum, minimumConfirmations);

  console.log(`This script will payout from block ${minimumHeight} to maximum height ${maximumHeight}`);

  // get the stakes from staking ledger json
  const [stakers, totalStake] = getStakes(ledger, stakingPoolPublicKey, globalSlotStart, slotsPerEpoch);
  console.log(`The pool total staking balance is ${totalStake}`);

  // get the blocks from archive db
  const blocks = await getBlocks(stakingPoolPublicKey, minimumHeight, maximumHeight);

  // run the payout calculation for those blocks
  const [payouts, storePayout, payoutFileString, blocksIncluded, allBlocksTotalRewards, allBlocksTotalPoolFees, totalPayout] = await getPayouts(blocks, stakers, totalStake, commissionRate, transactionFee);

  // Output total results and transaction files for input to next process, details file for audit log
  console.log(`We won these blocks: ${blocksIncluded}`);
  console.log(`We are paying out based on total rewards of ${allBlocksTotalRewards} nanomina in this window.`);
  console.log(`That is ${allBlocksTotalRewards / 1000000000} mina`);
  console.log(`The Pool Fee is is ${allBlocksTotalPoolFees / 1000000000} mina`);
  console.log(`Total Payout should be ${(allBlocksTotalRewards) - (allBlocksTotalPoolFees)} nanomina or ${((allBlocksTotalRewards) - (allBlocksTotalPoolFees)) / 1000000000} mina`)
  console.log(`The Total Payout is actually: ${totalPayout} nm or ${totalPayout / 1000000000} mina`)

  const runDateTime = new Date();
  const payoutTransactionsFileName = generateOutputFileName("payout_transactions", runDateTime, minimumHeight, maximumHeight);

  fs.writeFile(payoutTransactionsFileName, JSON.stringify(payouts), function (err: any) {
    if (err) throw err;
    console.log(`wrote payouts transactions to ${payoutTransactionsFileName}`);
  });

  const payoutDetailsFileName = generateOutputFileName("payout_details", runDateTime, minimumHeight, maximumHeight);
  fs.writeFile(payoutDetailsFileName, JSON.stringify(storePayout), function (err: any) {
    if (err) throw err;
    console.log(`wrote payout details to ${payoutDetailsFileName}`);
  });

  const payoutBatchFileName = generateOutputFileName("payout_batch", runDateTime, minimumHeight, maximumHeight);
  fs.writeFile(payoutBatchFileName, payoutFileString, function (err: any) {
    if (err) throw err;
    console.log(`wrote payout details to ${payoutBatchFileName}`);
  });

  signTransactionsToSend(payouts, senderKeys, nonce);
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

function generateOutputFileName(identifier: string, runDateTime: Date, minimumHeight: number, maximumHeight: number) {
  return `./src/data/${identifier}_${longDateString(runDateTime)}_${minimumHeight}_${maximumHeight}.json`;
}

function longDateString(d: Date) {
  return d.toISOString().replace(/\D/g,'')
};

main();

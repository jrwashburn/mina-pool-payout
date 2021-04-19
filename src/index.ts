import { getPayouts, PayoutDetails, PayoutTransaction, substituteAndExcludePayToAddresses } from "./core/payout-calculator";
import { Blocks } from "./core/dataprovider-types";
import hash from "object-hash";
import yargs, { boolean } from "yargs";
import { keypair } from "@o1labs/client-sdk";
import { sendSignedTransactions } from "./core/send-payments";
import fs from "fs";

// TODO: create mina currency types

const args = yargs.options({
  "payouthash": { type: "string", alias: ["h", "hash"] },
  "minheight": { type: "number", alias: ["m", "min"], demandOption: true },
  "maxheight": { type: "number", alias: ["x", "max"], default: Number.MAX_VALUE },
  "verbose": {type: "boolean", alias: ["v"], default: false}
}).argv;

async function main () {
  // TODO: Error handling
  // TODO: Add parameter to run read-only vs. write which would persist max height processed so it is not re-processed in future
  // TODO: Fail if any required values missing from .env
  const commissionRate = Number(process.env.COMMISSION_RATE) || 0.05;
  const stakingPoolPublicKey: string = process.env.POOL_PUBLIC_KEY || "";
  const payoutMemo: string = process.env.POOL_MEMO || "";
  const payorSendTransactionFee = (Number(process.env.SEND_TRANSACTION_FEE) || 0) * 1000000000;
  // TODO: validate and then move this downt to send-payments to consolidated client-sdk 
  // TODO: introduce -network flag to support test, pass to send-payments
  let senderKeys: keypair = {
    privateKey: process.env.SEND_PRIVATE_KEY || "",
    publicKey: process.env.SEND_PUBLIC_KEY || ""
  };
  const minimumConfirmations = Number(process.env.MIN_CONFIRMATIONS) || 290;
  const minimumHeight = args.minheight;
  const configuredMaximum = args.maxheight;
  const blockDataSource = process.env.BLOCK_DATA_SOURCE || 'ARCHIVEDB'
  const verbose = args.verbose;

  if ( blockDataSource != "ARCHIVEDB" && blockDataSource != "MINAEXPLORER" ) {
    throw new Error ('Unkown Data Source')
  }

  const blockProvider = (blockDataSource == "ARCHIVEDB") ?
    require("./core/dataprovider-archivedb/block-queries-sql") :
    require("./core/dataprovider-minaexplorer/block-queries-gql")

  const stakesProvider = (blockDataSource == "ARCHIVEDB") ?
    require("./core/dataprovider-archivedb/staking-ledger-json-file") :
    require("./core/dataprovider-minaexplorer/staking-ledger-gql")
  
  // get current maximum block height from database and determine what max block height for this run will be
  const maximumHeight = await determineLastBlockHeightToProcess(configuredMaximum, minimumConfirmations, await blockProvider.getLatestHeight());

  console.log(`This script will payout from block ${minimumHeight} to maximum height ${maximumHeight}`);

  let blocks: Blocks = [];
  blocks = await blockProvider.getBlocks(stakingPoolPublicKey, minimumHeight, maximumHeight)
     
  let payouts: PayoutTransaction[] = [];
  let storePayout: PayoutDetails[] = [];

  const ledgerHashes = [...new Set(blocks.map(block => block.stakingledgerhash))];

  console.log(`Processing mina pool payout for block producer key: ${stakingPoolPublicKey} `)
  Promise.all(ledgerHashes.map(async ledgerHash => {
    console.log(`### Calculating payouts for ledger ${ledgerHash}`)
    
    const [stakers, totalStake] = await stakesProvider.getStakes(ledgerHash, stakingPoolPublicKey)
    console.log(`The pool total staking balance is ${totalStake}`);

    // run the payout calculation for those blocks
    const ledgerBlocks = blocks.filter(x => x.stakingledgerhash == ledgerHash);
    const [ledgerPayouts, ledgerStorePayout, blocksIncluded, totalPayout] = await getPayouts(ledgerBlocks, stakers, totalStake, commissionRate);
    payouts.push(...ledgerPayouts);
    storePayout.push(...ledgerStorePayout);

    // Output total results and transaction files for input to next process, details file for audit log
    console.log(`We won these blocks: ${blocksIncluded}`);
    console.log(`The Total Payout is: ${totalPayout} nm or ${totalPayout / 1000000000} mina`)
  })).then( async () => {
    // Aggregate to a single transaction per key and track the total for funding transaction
    let totalPayoutFundsNeeded = 0
    let transactions: PayoutTransaction[] = [...payouts.reduce((r, o) => {
      const item: PayoutTransaction = r.get(o.publicKey) || Object.assign({}, o, {
        amount: 0,
        fee: 0,
      });
      item.amount += o.amount;
      item.fee = payorSendTransactionFee;
      return r.set(o.publicKey, item);
    }, new Map).values()];

    if (verbose) {
      console.table(storePayout, ["publicKey", "blockHeight", "shareClass", "stakingBalance", "effectiveNPSPoolWeighting", "effectiveCommonPoolWeighting", "coinbase", "totalRewards", "totalRewardsNPSPool", "totalRewardsCommonPool", "payout"]);
    }

    console.log(`before substitutions and exclusions`)
    console.table(transactions);
    const payoutHash = hash(storePayout, { algorithm: "sha256" });
    transactions = await substituteAndExcludePayToAddresses ( transactions );
    transactions.map((t) => {totalPayoutFundsNeeded += t.amount + t.fee});
    console.log(`after substitutions and exclusions`)
    console.table(transactions);

    const runDateTime = new Date();
    const payoutTransactionsFileName = generateOutputFileName("payout_transactions", runDateTime, minimumHeight, maximumHeight);

    fs.writeFile(payoutTransactionsFileName, JSON.stringify(transactions), function (err: any) {
      if (err) throw err;
      console.log(`wrote payouts transactions to ${payoutTransactionsFileName}`);
    });

    const payoutDetailsFileName = generateOutputFileName("payout_details", runDateTime, minimumHeight, maximumHeight);
    fs.writeFile(payoutDetailsFileName, JSON.stringify(storePayout), function (err: any) {
      if (err) throw err;
      console.log(`wrote payout details to ${payoutDetailsFileName}`);
    });

    console.log(`Total Funds Required for Payout = ${totalPayoutFundsNeeded}`);
    console.log(`Fund via: mina_ledger_wallet send-payment --offline --network testnet --nonce FUNDERNONCE --fee 0.1 BIP44ACCOUNT FUNDING_FROM_ADDRESS ${senderKeys.publicKey} ${totalPayoutFundsNeeded / 1000000000}`);

    if (args.payouthash) {
      console.log(`### Processing signed payout for hash ${args.payouthash}...`)
      if (args.payouthash == payoutHash) {
        // TODO: replace destination key, remove excluded sends 
        sendSignedTransactions(transactions, senderKeys, payoutMemo);
        const paidblockStream = fs.createWriteStream(`${__dirname}/data/.paidblocks`, { flags: 'a' });
        blocks.forEach((block) => {
          paidblockStream.write(`${block.blockheight}|${block.statehash}\n`);
        });
        paidblockStream.end();
      } else {
        console.error("HASHES DON'T MATCH");
      }
    } else {
      console.log(`PAYOUT HASH: ${payoutHash}`);
    }
  });
}

async function determineLastBlockHeightToProcess (maximumHeight: number, minimumConfirmations: number, latestHeight: number): Promise<number> {
  // Finality is understood to be max height minus k blocks. unsafe to process blocks above maxHeight since they could change if there is a long running, short-range fork
  // Alternatively, stop processing at maximum height if lower than finality
  // TODO: where does this really belong?
  let maximum = 0
  // TODO #13 get "getBlocks" and "getLatestHeight" based on data souce
  const finalityHeight = latestHeight - minimumConfirmations;
  
  if (finalityHeight > maximumHeight) {
    maximum = maximumHeight;
  } else {
    maximum = finalityHeight;
  }
  return maximum;
}

function generateOutputFileName (identifier: string, runDateTime: Date, minimumHeight: number, maximumHeight: number) {
  return `./src/data/${identifier}_${longDateString(runDateTime)}_${minimumHeight}_${maximumHeight}.json`;
}

function longDateString (d: Date) {
  return d.toISOString().replace(/\D/g, '')
};

main();

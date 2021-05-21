import { PayoutTransaction } from "../core/payout-calculator";
import { sendSignedTransactions } from "../core/send-payments";
import { ISender, PaymentConfiguration } from "./Model";
import fs from "fs"
import { Block } from "../core/dataprovider-types";

export class TransactionSender implements ISender {
    async send(config: PaymentConfiguration, calculatedHash: string, transactions: PayoutTransaction[], blocks: Block[]): Promise<void> {
        const { payoutHash, senderKeys, payoutMemo } = config
        
        if (payoutHash) {
            console.log(`### Processing signed payout for hash ${payoutHash}...`)
            if (payoutHash == calculatedHash) {
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
    }

}
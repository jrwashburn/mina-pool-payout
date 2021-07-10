
import { sendSignedTransactions } from "../../utils/send-payments";
import fs from "fs"
import hash from "object-hash";
import { PaymentConfiguration } from "../../configuration/Model";
import { injectable } from "inversify";
import { ISender } from "./Model";
import { PayoutTransaction } from "../payoutCalculator/Model";
import { PaymentProcess } from "../payment/Model";

@injectable()
export class TransactionSender implements ISender {
    async send(config: PaymentConfiguration, transactions: PayoutTransaction[], paymentProcess: PaymentProcess): Promise<void> {
        const { payoutHash, senderKeys, payoutMemo } = config
        
        const { blocks } = paymentProcess

        const calculatedHash = hash(paymentProcess.storePayout, { algorithm: "sha256" }); 
        
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
            console.log(`PAYOUT HASH: ${calculatedHash}`);
          }
    }

}
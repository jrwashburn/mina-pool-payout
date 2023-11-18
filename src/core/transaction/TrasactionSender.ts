import { getNonce, sendSignedBurnTransactions, sendSignedTransactions } from '../../utils/send-payments';
import { signPayment, keypair, signed, payment } from '@o1labs/client-sdk';
import fs from 'fs';
import hash, { MD5 } from 'object-hash';
import { PaymentConfiguration } from '../../configuration/Model';
import { injectable } from 'inversify';
import { ISender } from './Model';
import { PaymentProcess } from '../payment/Model';

@injectable()
export class TransactionSender implements ISender {
    async send(config: PaymentConfiguration, paymentProcess: PaymentProcess): Promise<void> {
        const { payoutHash, senderKeys, burnAddress, payorSendTransactionFee, payoutMemo, bpKeyMd5Hash} = config;

        const { blocks, payouts } = paymentProcess;

        const calculatedHash = hash(paymentProcess.storePayout, { algorithm: 'sha1' });

        if (payoutHash) {
            console.log(`### Processing signed payout for hash ${payoutHash}...`);
            if (payoutHash == calculatedHash) {
                
                sendSignedTransactions(payouts, senderKeys, payoutMemo, bpKeyMd5Hash, paymentProcess.totalBurn, burnAddress, payorSendTransactionFee);
                const paidblockStream = fs.createWriteStream(`${__dirname}/../../data/.paidblocks`, { flags: 'a' });
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

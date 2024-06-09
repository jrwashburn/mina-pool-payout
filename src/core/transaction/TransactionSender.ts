import { sendSignedTransactions } from '../../utils/send-payments';
import fs from 'fs';
import { createHash } from 'node:crypto';
import { PaymentConfiguration } from '../../configuration/Model';
import { injectable } from 'inversify';
import { ISender } from './Model';
import { PaymentProcess } from '../payment/Model';
import { Readable } from 'stream';

@injectable()
export class TransactionSender implements ISender {
  async send(config: PaymentConfiguration, paymentProcess: PaymentProcess): Promise<void> {
    const { payoutHash, senderKeys } = config;
    const { blocks, payoutTransactions } = paymentProcess;
    const calculatingHash = createHash('sha1');

    //const calculatedHash = hash(paymentProcess.payoutDetails, { algorithm: 'sha1' });
    //const calculatedHash = createHash('sha1').update(JSON.stringify(paymentProcess.payoutDetails)).digest('hex');
    const payoutDetailsStream = new Readable({ objectMode: true });
    payoutDetailsStream._read = () => { };
    payoutTransactions.forEach(transaction => {
      payoutDetailsStream.push(JSON.stringify(transaction));
    });
    payoutDetailsStream.push(null);

    const calculatedHash = await new Promise((resolve, reject) => {
      payoutDetailsStream.on('data', (data) => {
        calculatingHash.update(data);
      }).on('end', () => {
        resolve(calculatingHash.digest('hex'));
      }).on('error', (err) => {
        reject(err);
      });
    });

    payoutDetailsStream.destroy();

    if (payoutHash) {
      console.log(`### Processing signed payout for hash ${payoutHash}...`);
      if (payoutHash == calculatedHash) {
        sendSignedTransactions(payoutTransactions, senderKeys, config.doNotTransmit);
        const paidblockStream = fs.createWriteStream(`${__dirname}/../../data/.paidblocks`, { flags: 'a' });
        blocks.forEach((block) => {
          paidblockStream.write(`${block.blockheight}|${block.statehash}\n`);
        });
        paidblockStream.end();
      } else {
        console.error(`\x1b[41mERROR: HASHES DON'T MATCH. Expected: ${payoutHash} Calculated: ${calculatedHash}\x1b[0m`);
      }
    } else {
      console.log(`PAYOUT HASH: ${calculatedHash}`);
    }
  }
}

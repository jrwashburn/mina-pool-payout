import type { IFileWriter } from '../../shared/Model.js';
import { PaymentConfiguration } from '../../configuration/Model.js';
import { inject, injectable } from 'inversify';
import TYPES from '../../composition/Types.js';
import { ITransactionProcessor } from './Model.js';
import { PaymentProcess } from '../payment/Model.js';
import { createWriteStream, WriteStream } from 'node:fs';

@injectable()
export class TransactionProcessor implements ITransactionProcessor {
  private fileWriter: IFileWriter;

  constructor(@inject(TYPES.IFileWriter) fileWriter: IFileWriter) {
    this.fileWriter = fileWriter;
  }

  async write(config: PaymentConfiguration, paymentProcess: PaymentProcess): Promise<void> {
    const runDateTime = new Date();
    const { payoutDetails, maximumHeight, payoutTransactions } = paymentProcess;
    const { minimumHeight } = config;
    const payoutTransactionsFileName = this.generateOutputFileName(
      'payout_transactions',
      runDateTime,
      minimumHeight,
      maximumHeight,
    );
    const payoutTransactionsStream = createWriteStream(payoutTransactionsFileName);
    const payoutDetailsFileName = this.generateOutputFileName(
      'payout_details',
      runDateTime,
      minimumHeight,
      maximumHeight,
    );
    const payoutDetailsStream = createWriteStream(payoutDetailsFileName);

    try {
      console.log(`writing transactions to ${payoutTransactionsFileName}`);
      this.writeJsonObjToFile(payoutTransactionsStream, payoutTransactions);
      if (!config.doNotSaveTransactionDetails) {
        console.log(`writing details to ${payoutDetailsFileName}`);
        this.writeJsonObjToFile(payoutDetailsStream, payoutDetails);
      } else {
        console.log('skipping writing details to file due to DO_NOT_SAVE_TRANSACTION_DETAILS environment setting');
      }
      console.log('finished writing log files');
    } catch (error) {
      console.error('Error writing details to log file', error);
    }
  }

  private generateOutputFileName(
    identifier: string,
    runDateTime: Date,
    minimumHeight: number,
    maximumHeight: number,
  ) {
    return `./src/data/${identifier}_${this.longDateString(runDateTime)}_${minimumHeight}_${maximumHeight}.json`;
  }

  private longDateString(d: Date) {
    return d.toISOString().replace(/\D/g, '');
  }

  private writeJsonObjToFile(stream: WriteStream, data: object[]): void {
    let index = 0;

    function writeObjects() {
      let ok = true;
      while (index < data.length && ok) {
        ok = stream.write(JSON.stringify(data[index]));
        index++;
      }
      if (index < data.length) {
        if (!ok) {
          stream.once('drain', writeObjects)
        }
        else {
          stream.end();
        }
      }
    }
    writeObjects();
  }
}


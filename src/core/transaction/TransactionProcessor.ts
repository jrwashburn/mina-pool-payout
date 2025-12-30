import { IFileWriter } from '../../shared/Model';
import { PaymentConfiguration } from '../../configuration/Model';
import { inject, injectable } from 'inversify';
import TYPES from '../../composition/Types';
import { ITransactionProcessor } from './Model';
import { PaymentProcess } from '../payment/Model';
import { createWriteStream, WriteStream } from 'fs';

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
      this.writeJsonObjToFile(payoutTransactionsStream, payoutTransactions, config.useLegacyJsonFormat);
      if (!config.doNotSaveTransactionDetails) {
        console.log(`writing details to ${payoutDetailsFileName}`);
        this.writeJsonObjToFile(payoutDetailsStream, payoutDetails, config.useLegacyJsonFormat);
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

  private writeJsonObjToFile(stream: WriteStream, data: object[], useLegacyFormat: boolean = false): void {
    let index = 0;
    
    if (!useLegacyFormat) {
      // Write opening bracket for JSON array format
      stream.write('[');
    }

    function writeObjects() {
      let ok = true;
      while (index < data.length && ok) {
        if (!useLegacyFormat && index > 0) {
          // Write comma before each object except the first (JSON array format)
          ok = stream.write(',');
          if (!ok) {
            stream.once('drain', writeObjects);
            return;
          }
        }
        ok = stream.write(JSON.stringify(data[index]));
        index++;
      }
      if (index < data.length) {
        if (!ok) {
          stream.once('drain', writeObjects);
        }
      } else {
        if (!useLegacyFormat) {
          // Write closing bracket for JSON array format
          stream.write(']');
        }
        stream.end();
      }
    }
    writeObjects();
  }
}


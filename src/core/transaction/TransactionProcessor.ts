import { IFileWriter } from '../../shared/Model';
import { PaymentConfiguration } from '../../configuration/Model';
import { inject, injectable } from 'inversify';
import TYPES from '../../composition/Types';
import { ITransactionProcessor } from './Model';
import { PaymentProcess } from '../payment/Model';
import { createWriteStream } from 'fs';

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
    //this.fileWriter.write(payoutTransactionsFileName, JSON.stringify(payoutTransactions));
    const payoutTransactionsStream = createWriteStream(payoutTransactionsFileName);
    payoutTransactions.forEach(transaction => payoutTransactionsStream.write(JSON.stringify(transaction)));
    console.log(`writing transactions to ${payoutTransactionsFileName}`);
    await new Promise((resolve, reject) => {
      payoutTransactionsStream.on('finish', resolve);
      payoutTransactionsStream.on('error', reject);
      payoutTransactionsStream.end();
    });

    const payoutDetailsFileName = this.generateOutputFileName(
      'payout_details',
      runDateTime,
      minimumHeight,
      maximumHeight,
    );
    //this.fileWriter.write(payoutDetailsFileName, JSON.stringify(payoutDetails));
    const payoutDetailsStream = createWriteStream(payoutDetailsFileName);
    payoutDetails.forEach(detail => payoutDetailsStream.write(JSON.stringify(detail)));
    console.log(`writing transactions to ${payoutDetailsFileName}`);
    await new Promise((resolve, reject) => {
      payoutDetailsStream.on('finish', resolve);
      payoutDetailsStream.on('error', reject);
      payoutDetailsStream.end();
    });
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
}


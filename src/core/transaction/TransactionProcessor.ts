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
  private _payoutTransactionsFileName: string = '';
  private _payoutDetailsFileName: string = '';

  constructor(@inject(TYPES.IFileWriter) fileWriter: IFileWriter) {
    this.fileWriter = fileWriter;
  }

  get payoutTransactionsFileName(): string {
    return this._payoutTransactionsFileName;
  }

  get payoutDetailsFileName(): string {
    return this._payoutDetailsFileName;
  }

  async write(config: PaymentConfiguration, paymentProcess: PaymentProcess): Promise<void> {
    const runDateTime = new Date();

    const { payoutDetails, maximumHeight, payoutTransactions } = paymentProcess;
    const { minimumHeight } = config;
    this._payoutTransactionsFileName = this.generateOutputFileName(
      'payout_transactions',
      runDateTime,
      minimumHeight,
      maximumHeight,
    );

    //this.fileWriter.write(payoutTransactionsFileName, JSON.stringify(payoutTransactions));
    const payoutTransactionsStream = createWriteStream(this._payoutTransactionsFileName);
    payoutTransactions.forEach(transaction => payoutTransactionsStream.write(JSON.stringify(transaction)));
    payoutTransactionsStream.end();

    this._payoutDetailsFileName = this.generateOutputFileName(
      'payout_details',
      runDateTime,
      minimumHeight,
      maximumHeight,
    );
    //this.fileWriter.write(payoutDetailsFileName, JSON.stringify(payoutDetails));
    const payoutDetailsStream = createWriteStream(this._payoutDetailsFileName);
    payoutDetails.forEach(detail => payoutDetailsStream.write(JSON.stringify(detail)));
    payoutDetailsStream.end();
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


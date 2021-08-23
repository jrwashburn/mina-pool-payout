import { IFileWriter } from "../../shared/Model";
import { PaymentConfiguration } from "../../configuration/Model";
import { inject, injectable } from "inversify";
import TYPES from "../../composition/Types";
import { ITransactionProcessor } from "./Model";
import { PaymentProcess } from "../payment/Model";


@injectable()
export class TransactionProcessor implements ITransactionProcessor {
    
  private fileWriter : IFileWriter

  constructor(@inject(TYPES.IFileWriter) fileWriter : IFileWriter) {
    this.fileWriter = fileWriter
  }
  async write(config: PaymentConfiguration, 
              paymentProcess: PaymentProcess): Promise<void> {
        
        const runDateTime = new Date();

        const { storePayout, maximumHeight, totalPayoutFundsNeeded, payouts } = paymentProcess

        const { minimumHeight} = config
        
        const payoutTransactionsFileName = this.generateOutputFileName("payout_transactions", runDateTime, minimumHeight, maximumHeight);
    
        this.fileWriter.write(payoutTransactionsFileName, JSON.stringify(payouts))

        const payoutDetailsFileName = this.generateOutputFileName("payout_details", runDateTime, minimumHeight, maximumHeight);
        
        this.fileWriter.write(payoutDetailsFileName, JSON.stringify(storePayout))
        
        console.log(`Fund via: mina_ledger_wallet send-payment --offline --network testnet --nonce FUNDERNONCE --fee 0.1 BIP44ACCOUNT FUNDING_FROM_ADDRESS ${config.senderKeys.publicKey} ${totalPayoutFundsNeeded / 1000000000}`);
    
    }

    private generateOutputFileName (identifier: string, runDateTime: Date, minimumHeight: number, maximumHeight: number) {
        return `./src/data/${identifier}_${this.longDateString(runDateTime)}_${minimumHeight}_${maximumHeight}.json`;
    }

    private longDateString (d: Date) {
        return d.toISOString().replace(/\D/g, '')
    }

}
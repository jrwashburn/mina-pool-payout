import { PayoutTransaction } from "../core/payout-calculator";
import { ITransactionWriter, PaymentConfiguration } from "./Model";
import fs from "fs";

export class TransactionWriter implements ITransactionWriter {
    async write(transactions: PayoutTransaction[], config: PaymentConfiguration, maximumHeight: number, totalPayoutFundsNeeded: number): Promise<void> {
        
        const runDateTime = new Date();

        const { minimumHeight} = config
        
        const payoutTransactionsFileName = this.generateOutputFileName("payout_transactions", runDateTime, minimumHeight, maximumHeight);
    
        fs.writeFile(payoutTransactionsFileName, JSON.stringify(transactions), function (err: any) {
          if (err) throw err;
          console.log(`wrote payouts transactions to ${payoutTransactionsFileName}`);
        });
    
        const payoutDetailsFileName = this.generateOutputFileName("payout_details", runDateTime, minimumHeight, maximumHeight);
        //storePayout 
        //Abstract this behavior
        //fs.writeFile(payoutDetailsFileName, JSON.stringify(storePayout), function (err: any)
        fs.writeFile(payoutDetailsFileName, JSON.stringify(transactions), function (err: any) {
          if (err) throw err;
          console.log(`wrote payout details to ${payoutDetailsFileName}`);
        });
    
        
        console.log(`Fund via: mina_ledger_wallet send-payment --offline --network testnet --nonce FUNDERNONCE --fee 0.1 BIP44ACCOUNT FUNDING_FROM_ADDRESS ${config.senderKeys.publicKey} ${totalPayoutFundsNeeded / 1000000000}`);
    
    }

    private generateOutputFileName (identifier: string, runDateTime: Date, minimumHeight: number, maximumHeight: number) {
        return `./src/data/${identifier}_${this.longDateString(runDateTime)}_${minimumHeight}_${maximumHeight}.json`;
    }

    private longDateString (d: Date) {
        return d.toISOString().replace(/\D/g, '')
    }

}
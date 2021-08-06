import { IPaymentBuilder, IPaymentProcessor as IPaymentProcessor, PaymentProcess  } from "./Model"
import { PayoutDetails, PayoutTransaction } from "../payoutCalculator/Model";
import { PaymentConfiguration } from "../../configuration/Model";
import { ConfigurationManager } from "../../configuration/ConfigurationManager";
import { inject, injectable } from "inversify";
import TYPES from "../../composition/Types";
import { ISender, ITransactionBuilder, ITransactionProcessor } from "../transaction/Model";
import { Block } from "../dataProvider/dataprovider-types";

@injectable()
export class PaymentProcessor implements IPaymentProcessor {
    
    private paymentBuilder : IPaymentBuilder
    private transactionBuilder : ITransactionBuilder
    private transactionProcessor : ITransactionProcessor
    private sender : ISender

    public constructor(
        @inject(TYPES.IPaymentBuilder) paymentBuilder: IPaymentBuilder,
        @inject(TYPES.ITransactionBuilder) transactionBuilder: ITransactionBuilder,
        @inject(TYPES.ITransactionProcessor) transactionProcessor: ITransactionProcessor,
        @inject(TYPES.ISender) sender: ISender
    ) {
        this.paymentBuilder = paymentBuilder,
        this.transactionBuilder = transactionBuilder,
        this.transactionProcessor = transactionProcessor,
        this.sender = sender
    }

    async run(args: any): Promise<void> {
        ConfigurationManager.build(args)
        
        const configuration = ConfigurationManager.Setup 

        if (this.isValid(configuration)) {
            
            let paymentProcess = await this.paymentBuilder.build() 
            
            let transactions = await this.transactionBuilder.build(paymentProcess,configuration)

            paymentProcess.totalPayoutFundsNeeded = await this.calculateTotalPayoutFundsNeeded(transactions)
            
            await this.transactionProcessor.write(transactions, configuration, paymentProcess) 

            await this.sender.send(configuration, transactions, paymentProcess)

            await this.printTotalResults(paymentProcess)
            
        } else {
            //TODO: Use a custom error class
            throw new Error ('Unkown Data Source')
        }
        
    }

    private async printTotalResults(paymentProcess: PaymentProcess) : Promise<void> {

        const getTotalsFromBlocks = (blocks: Block[]) => {
            let coinbasesum = 0
            let feetransferfromcoinbasesum = 0
            let usercommandtransactionfeessum = 0
            blocks.forEach (block => {
                coinbasesum += block.coinbase ?? 0
                feetransferfromcoinbasesum += block.feetransferfromcoinbase ?? 0
                usercommandtransactionfeessum += block.usercommandtransactionfees
            })

            return {coinbasesum, feetransferfromcoinbasesum, usercommandtransactionfeessum}
        }

        const getTotalPayouts = (transactions: PayoutTransaction[]) => {
            let amountsum = 0
            let feesum = 0

            transactions.forEach(transaction => {
                amountsum += transaction.amount ?? 0
                feesum += transaction.fee ?? 0
            })

            return {amountsum,feesum}
        }

        console.log('------------------- Payout Results ------------------')

        const {coinbasesum, feetransferfromcoinbasesum, usercommandtransactionfeessum} = getTotalsFromBlocks(paymentProcess.blocks)

        const netcoinbasereceived = coinbasesum - feetransferfromcoinbasesum - usercommandtransactionfeessum

        const {amountsum,feesum} = getTotalPayouts(paymentProcess.payouts)

        console.log(`Total Coin Base Generated: ${coinbasesum}`)
        console.log(`Total User Transaction Fees Generated: ${usercommandtransactionfeessum}`)
        console.log(`Total Snark Fees Paid: ${feetransferfromcoinbasesum}`)
        console.log(`Net Coinbase Received: ${netcoinbasereceived}`)
        console.log(`Total Payouts Sent: ${amountsum}`)
        console.log(`Total Payout Transaction Fees: ${feesum}`)
        console.log(`Net MINA to Pool Operator: ${netcoinbasereceived - amountsum - feesum}`)
        
        console.log('------------------- Payout Results ------------------')
    }

    private async calculateTotalPayoutFundsNeeded(transactions: PayoutTransaction[]) : Promise<number> {
        let totalPayoutFundsNeeded = 0

        transactions.map((t) => {totalPayoutFundsNeeded += t.amount + t.fee}); //probably move this

        console.log(`Total Funds Required for Payout = ${totalPayoutFundsNeeded}`);

        return totalPayoutFundsNeeded
    }

    private async isValid(config : PaymentConfiguration) : Promise<boolean> {
        
        if (config.blockDataSource != "ARCHIVEDB" && config.blockDataSource != "MINAEXPLORER") {
            return false
        }

        return true
        }
 }


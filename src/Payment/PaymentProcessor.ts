import { FileWriter } from "../Shared/FileWriter";
import { BlockProcessor } from "./BlockProcessor";
import { IPaymentProcessor as IPaymentProcessor, PaymentConfiguration } from "./Model";
import { PaymentBuilder } from "./PaymentBuilder";
import { PayoutProcessor } from "./PayoutProcessor";
import { TransactionBuilder } from "./TransactionBuilder";
import { TransactionProcessor } from "./TransactionWriter";
import hash from "object-hash";
import { TransactionSender } from "./TrasactionSender";
import { PayoutTransaction } from "../core/payout-calculator";

export class PaymentProcessor implements IPaymentProcessor {
    
    async run(args: any): Promise<void> {
        const configuration = await this.setup(args)
        //use a container for this
        const blockProcessor  = new BlockProcessor()
        const payoutCalculator = new PayoutProcessor()
        const fileWriter = new FileWriter()

        const payments = new PaymentBuilder(configuration,blockProcessor,payoutCalculator)
        
        const transactionBuilder = new TransactionBuilder()

        const transactionWriter = new TransactionProcessor(fileWriter)

        const sender = new TransactionSender();

        if (this.isValid(configuration)) {
            
            const { payouts, storePayout, maximumHeight, blocks } = await payments.build() //This needs to be its own class
            
            const transactions = await transactionBuilder.build(payouts, storePayout,configuration)

            const payoutHash = hash(storePayout, { algorithm: "sha256" }); 

            const totalPayoutFundsNeeded = await this.calculateTotalPayoutFundsNeeded(transactions)
            
            await transactionWriter.write(transactions, configuration, maximumHeight, totalPayoutFundsNeeded, storePayout) 

            await sender.send(configuration, payoutHash, transactions, blocks)
            
        } else {
            //TODO: Use a custom error class
            throw new Error ('Unkown Data Source')
        }
        
    }

    private async calculateTotalPayoutFundsNeeded(transactions: PayoutTransaction[]) : Promise<number> {
        let totalPayoutFundsNeeded = 0

        transactions.map((t) => {totalPayoutFundsNeeded += t.amount + t.fee}); //probably move this

        console.log(`Total Funds Required for Payout = ${totalPayoutFundsNeeded}`);

        return totalPayoutFundsNeeded
    }

    private async setup(args: any) : Promise<PaymentConfiguration> {
        //move this outside
        let configuration : PaymentConfiguration = {
            commissionRate: Number(process.env.COMMISSION_RATE) || 0.05,
            stakingPoolPublicKey : process.env.POOL_PUBLIC_KEY || "",
            payoutMemo : process.env.POOL_MEMO || "",
            senderKeys : {
                privateKey: process.env.SEND_PRIVATE_KEY || "",
                publicKey: process.env.SEND_PUBLIC_KEY || ""
            },
            payorSendTransactionFee : (Number(process.env.SEND_TRANSACTION_FEE) || 0) * 1000000000,
            minimumConfirmations : Number(process.env.MIN_CONFIRMATIONS) || 290,
            minimumHeight : args.minheight,
            configuredMaximum : args.maxheight,
            blockDataSource : process.env.BLOCK_DATA_SOURCE || 'ARCHIVEDB',
            verbose : args.verbose,
            payoutHash: args.payouthash 
        }

        return configuration
    }

    private async isValid(config : PaymentConfiguration) : Promise<boolean> {
        
        if (config.blockDataSource != "ARCHIVEDB" && config.blockDataSource != "MINAEXPLORER") {
            return false
        }

        return true
        }
 }

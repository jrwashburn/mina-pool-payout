import { BlockProcessor } from "./BlockProcessor";
import { PaymentGenerator, PaymentConfiguration } from "./Model";
import { PaymentBuilder } from "./PaymentBuilder";
import { PayoutProcessor } from "./PayoutProcessor";
import { TransactionBuilder } from "./TransactionBuilder";
import { TransactionWriter } from "./TransactionWriter";

export class Payment implements PaymentGenerator {
    
    async run(args: any): Promise<void> {
        const configuration = await this.setup(args)
        //USE IOC
        const blockHandler  = new BlockProcessor()
        const payoutCalculator = new PayoutProcessor()

        const payments = new PaymentBuilder(configuration,blockHandler,payoutCalculator)
        
        const transactionBuilder = new TransactionBuilder()

        const transactionWriter = new TransactionWriter()

        if (this.isValid(configuration)) {
            // chage this to its out wrapper
            const { payouts, storePayout } = await payments.build()
            
            const transactions = await transactionBuilder.build(payouts, storePayout,configuration)
            
            //writeTransactions
            await transactionWriter.write(transactions, configuration, 1,2) //use correct numbers from wrapper
            
            //sendPayments
        } else {
            //TODO: Use a custom error class
            throw new Error ('Unkown Data Source')
        }
        
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

import { FileWriter } from "../Shared/FileWriter";
import { BlockProcessor } from "./BlockProcessor";
import { IPaymentProcessor as IPaymentProcessor  } from "./Model";
import { PaymentBuilder } from "./PaymentBuilder";
import { PayoutCalculator } from "./PayoutCalculator";
import { TransactionBuilder } from "./TransactionBuilder";
import { TransactionProcessor } from "./TransactionWriter";
import { TransactionSender } from "./TrasactionSender";
import { PayoutTransaction } from "../core/payout-calculator";
import { PaymentConfiguration } from "../Configuration/Model";
import { ConfigurationManager } from "../Configuration/ConfigurationManager";
import { BlockDataProviderFactory } from "../DataProvider/BlockDataProviderFactory";
import { StakeDataProviderFactory } from "../DataProvider/StakeDataProviderFactory";
import { AddressRemover } from "./AddressRemover";

export class PaymentProcessor implements IPaymentProcessor {
    
    async run(args: any): Promise<void> {
        const configuration = await ConfigurationManager.setup(args)
        
        const { paymentBuilder, transactionBuilder, transactionProcessor, sender } = await this.behaviorSetup(configuration)

        if (this.isValid(configuration)) {
            
            let paymentProcess = await paymentBuilder.build() 
            
            let transactions = await transactionBuilder.build(paymentProcess,configuration)

            paymentProcess.totalPayoutFundsNeeded = await this.calculateTotalPayoutFundsNeeded(transactions)
            
            await transactionProcessor.write(transactions, configuration, paymentProcess) 

            await sender.send(configuration, transactions, paymentProcess)
            
        } else {
            //TODO: Use a custom error class
            throw new Error ('Unkown Data Source')
        }
        
    }

    private async behaviorSetup(configuration: PaymentConfiguration) : Promise<{ paymentBuilder: PaymentBuilder, transactionBuilder: TransactionBuilder, transactionProcessor: TransactionProcessor, sender: TransactionSender }> {
        
        //Replace this with a container
        
        const blockProcessor  = new BlockProcessor()

        const payoutCalculator = new PayoutCalculator()

        const fileWriter = new FileWriter()

        const blockDataProviderFactory = new BlockDataProviderFactory()

        const stakeDataProviderFactory = new StakeDataProviderFactory()

        const paymentBuilder = new PaymentBuilder(configuration,blockProcessor,payoutCalculator, blockDataProviderFactory,stakeDataProviderFactory )
        
        const addressRemover = new AddressRemover()

        const transactionBuilder = new TransactionBuilder(addressRemover)

        const transactionProcessor = new TransactionProcessor(fileWriter)

        const sender = new TransactionSender();  
        
        return { paymentBuilder, transactionBuilder, transactionProcessor, sender }
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

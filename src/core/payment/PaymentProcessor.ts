import { IPaymentBuilder, IPaymentProcessor as IPaymentProcessor, ISummarizer, PaymentProcess } from './Model';
import { PaymentConfiguration } from '../../configuration/Model';
import { ConfigurationManager } from '../../configuration/ConfigurationManager';
import { inject, injectable } from 'inversify';
import TYPES from '../../composition/Types';
import { ISender, ITransactionBuilder, ITransactionProcessor } from '../transaction/Model';

@injectable()
export class PaymentProcessor implements IPaymentProcessor {
    private paymentBuilder: IPaymentBuilder;
    private transactionBuilder: ITransactionBuilder;
    private transactionProcessor: ITransactionProcessor;
    private sender: ISender;
    private summarizer: ISummarizer<PaymentProcess>;

    public constructor(
        @inject(TYPES.IPaymentBuilder) paymentBuilder: IPaymentBuilder,
        @inject(TYPES.ITransactionBuilder) transactionBuilder: ITransactionBuilder,
        @inject(TYPES.ITransactionProcessor) transactionProcessor: ITransactionProcessor,
        @inject(TYPES.ISender) sender: ISender,
        @inject(TYPES.PaymentSummarizer) summarizer: ISummarizer<PaymentProcess>,
    ) {
        (this.paymentBuilder = paymentBuilder),
            (this.transactionBuilder = transactionBuilder),
            (this.transactionProcessor = transactionProcessor),
            (this.sender = sender);
        this.summarizer = summarizer;
    }

    async run(args: any): Promise<void> {
        await ConfigurationManager.build(args);

        const configuration = ConfigurationManager.Setup;

        if (await this.isValid(configuration)) {
            const paymentProcess = await this.paymentBuilder.build();

            await this.transactionBuilder.build(paymentProcess, configuration);

            await this.calculateTotalPayoutFundsNeeded(paymentProcess, configuration);

            await this.transactionProcessor.write(configuration, paymentProcess);

            await this.sender.send(configuration, paymentProcess);

            await this.summarizer.calculateTotals(paymentProcess);

            await this.summarizer.printTotals(paymentProcess);

            await this.summarizer.writeTotals(configuration, paymentProcess);
        } else {
            //TODO: Use a custom error class
            throw new Error('Unkown Data Source');
        }
    }

    private async calculateTotalPayoutFundsNeeded(paymentProcess: PaymentProcess, configuration: PaymentConfiguration) {
        let totalPayoutFundsNeeded = 0;

        paymentProcess.payouts.map((t) => {
            totalPayoutFundsNeeded += t.amount + t.fee;
        });

        console.log(`Total Funds Required for Payout = ${totalPayoutFundsNeeded}`);
    }

    private async isValid(config: PaymentConfiguration): Promise<boolean> {
        if (config.blockDataSource != 'ARCHIVEDB' && config.blockDataSource != 'MINAEXPLORER') {
            return false;
        }

        return true;
    }
}

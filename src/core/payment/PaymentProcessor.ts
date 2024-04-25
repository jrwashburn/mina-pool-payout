import { IPaymentBuilder, IPaymentProcessor as IPaymentProcessor, ISummarizer, PaymentProcess } from './Model';
import { PaymentConfiguration } from '../../configuration/Model';
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
    (this.summarizer = summarizer);
  }

  async run(configuration: PaymentConfiguration): Promise<void> {
    const paymentProcess = await this.paymentBuilder.build();
    await this.transactionBuilder.build(paymentProcess, configuration);
    await this.calculateTotalPayoutFundsNeeded(paymentProcess, configuration);
    await this.transactionProcessor.write(configuration, paymentProcess);
    await this.sender.send(configuration, paymentProcess);
    await this.summarizer.calculateTotals(paymentProcess);
    await this.summarizer.printTotals(paymentProcess);
    await this.summarizer.writeTotals(configuration, paymentProcess);
  }

  private async calculateTotalPayoutFundsNeeded(paymentProcess: PaymentProcess, configuration: PaymentConfiguration) {
    let totalPayoutFundsNeeded = 0;

    paymentProcess.payoutTransactions.map((t) => {
      totalPayoutFundsNeeded += t.amount + t.fee;
    });

    console.log(
      `Total Funds Required for Payout = ${totalPayoutFundsNeeded} nanoMINA or ${totalPayoutFundsNeeded / 1000000000
      } MINA`,
    );
    console.log(
      `Fund via: mina_ledger_wallet send-payment --offline --network testnet --nonce FUNDERNONCE --fee 0.1 BIP44ACCOUNT FUNDING_FROM_ADDRESS ${configuration.senderKeys.publicKey
      } ${totalPayoutFundsNeeded / 1000000000}`,
    );
  }
}

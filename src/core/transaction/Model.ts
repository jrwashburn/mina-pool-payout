import { PaymentConfiguration } from '../../configuration/Model';
import { PaymentProcess } from '../payment/Model';
import { PayoutTransaction } from '../payoutCalculator/Model';

export interface ITransactionBuilder {
    build(paymentProcess: PaymentProcess, config: PaymentConfiguration): Promise<PayoutTransaction[]>;
}

export interface ITransactionProcessor {
    write(config: PaymentConfiguration, paymentProcess: PaymentProcess): Promise<void>;
}

export interface ISender {
    send(config: PaymentConfiguration, paymentProcess: PaymentProcess): Promise<void>;
}
import { PaymentConfiguration } from '../../configuration/Model.js';
import { PaymentProcess } from '../payment/Model.js';
import { PayoutTransaction } from '../payoutCalculator/Model.js';

export interface ITransactionBuilder {
    build(paymentProcess: PaymentProcess, config: PaymentConfiguration): Promise<PayoutTransaction[]>;
}

export interface ITransactionProcessor {
    write(config: PaymentConfiguration, paymentProcess: PaymentProcess): Promise<void>;
}

export interface ISender {
    send(config: PaymentConfiguration, paymentProcess: PaymentProcess): Promise<void>;
}
import { PaymentConfiguration } from "../../configuration/Model";
import { PaymentProcess } from "../payment/Model";
import { PayoutTransaction } from "../payoutCalculator/Model";


export interface ITransactionBuilder {
    build(paymentProcess: PaymentProcess, config: PaymentConfiguration) : Promise<PayoutTransaction[]>
}

export interface ITransactionProcessor {
    write(transactions: PayoutTransaction[], config: PaymentConfiguration, paymentProcess: PaymentProcess): Promise<void>
}

export interface ISender {
    send(config: PaymentConfiguration, transactions: PayoutTransaction[], paymentProcess: PaymentProcess) : Promise<void>
}
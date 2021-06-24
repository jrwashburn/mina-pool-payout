import { PaymentConfiguration } from "../../Configuration/Model";
import { PaymentProcess } from "../Payment/Model";
import { PayoutTransaction } from "../PayoutCalculator/Model";


export interface ITransactionBuilder {
    build(paymentProcess: PaymentProcess, config: PaymentConfiguration) : Promise<PayoutTransaction[]>
}

export interface ITransactionProcessor {
    write(transactions: PayoutTransaction[], config: PaymentConfiguration, paymentProcess: PaymentProcess): Promise<void>
}

export interface ISender {
    send(config: PaymentConfiguration, transactions: PayoutTransaction[], paymentProcess: PaymentProcess) : Promise<void>
}
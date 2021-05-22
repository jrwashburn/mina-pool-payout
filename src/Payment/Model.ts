import { PaymentConfiguration } from "../Configuration/Model";
import { Block, Stake } from "../core/dataprovider-types";
import { PayoutDetails, PayoutTransaction } from "../core/payout-calculator";

export interface IPaymentProcessor {
    run(args: any) : Promise<void>
}

export interface PaymentProcess {
    payouts: PayoutTransaction[],
    storePayout: PayoutDetails[],
    maximumHeight: number,
    blocks: Block[],
    totalPayoutFundsNeeded: number
}

export interface IPaymentBuilder {
    build() : Promise<PaymentProcess>
}

export interface ISender {
    send(config: PaymentConfiguration, transactions: PayoutTransaction[], paymentProcess: PaymentProcess) : Promise<void>
}

export interface ITransactionBuilder {
    build(paymentProcess: PaymentProcess, config: PaymentConfiguration) : Promise<PayoutTransaction[]>
}

export interface ITransactionProcessor {
    write(transactions: PayoutTransaction[], config: PaymentConfiguration, paymentProcess: PaymentProcess): Promise<void>
}

export interface IBlockProcessor {
    determineLastBlockHeightToProcess(max: number, min:number, latestHeight: number) : Promise<number>
}

export interface PayoutCalculator {
    getPayouts(blocks: Block[], stakers: Stake[], totalStake: number, commisionRate: number ) 
    : Promise<[
        payoutJson: PayoutTransaction[], 
        storePayout: PayoutDetails[], 
        blocksIncluded: number[],
        totalPayout: number
    ]>
}




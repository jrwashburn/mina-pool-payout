import { Block } from "../dataProvider/dataprovider-types";
import {PayoutDetails,PayoutTransaction} from "../payoutCalculator/Model"

export interface IPaymentProcessor {
    run(args: any) : Promise<void>
}

export interface PaymentProcess {
    payouts: PayoutTransaction[],
    storePayout: PayoutDetails[],
    maximumHeight: number,
    blocks: Block[],
    totalPayoutFundsNeeded: number,
    totals?: PaymentTotals
}

export interface PaymentTotals {
    coinBaseSum: number,
    userCommandTransactionFeeSum: number,
    freeTransferFromCoinBaseSum: number,
    netCoinBaseReceveid: number,
    payoutAmountsSum: number,
    payoutFeesSum: number,
    netMinaToPoolOperator: number

}

export interface IPaymentBuilder {
    build() : Promise<PaymentProcess>
}



export interface ISubstituteAndExcludePayToAddresses {
    remove(transactions: PayoutTransaction[]) : Promise<PayoutTransaction[]>
}

export interface IBlockProcessor {
    determineLastBlockHeightToProcess(max: number, min:number, latestHeight: number) : Promise<number>
}

export interface ISummarizer<T> {
    calculateTotals(base: T) : Promise<void>
    printTotals(base: T): Promise<void>
}




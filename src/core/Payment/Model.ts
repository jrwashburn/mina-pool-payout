import { PaymentConfiguration } from "../../Configuration/Model";
import { Block } from "../DataProvider/dataprovider-types";
import {PayoutDetails,PayoutTransaction} from "../PayoutCalculator/Model"

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



export interface IAddressRemover {
    remove(transactions: PayoutTransaction[]) : Promise<PayoutTransaction[]>
}

export interface IBlockProcessor {
    determineLastBlockHeightToProcess(max: number, min:number, latestHeight: number) : Promise<number>
}




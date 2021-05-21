import { keypair } from "@o1labs/client-sdk";
import { Block, Stake } from "../core/dataprovider-types";
import { PayoutDetails, PayoutTransaction } from "../core/payout-calculator";

export interface IPaymentProcessor {
    run(args: any) : Promise<void>
}

export interface PaymentConfiguration {
    commissionRate: number
    stakingPoolPublicKey: string,
    payoutMemo: string,
    payorSendTransactionFee : number,
    senderKeys: keypair,
    minimumConfirmations : number,
    minimumHeight: number,
    configuredMaximum: number,
    blockDataSource: string,
    verbose: boolean,
    payoutHash: string
}

export interface Payment {
    payout: PayoutTransaction[],
    storePayout: PayoutDetails[]
}

export interface IPaymentBuilder {
    build() : Promise<{payouts: PayoutTransaction[], storePayout: PayoutDetails[], maximumHeight: number, blocks: Block[]}>
}

export interface ISender {
    send(config: PaymentConfiguration, calculatedHash: string, transactions: PayoutTransaction[], blocks: Block[]) : Promise<void>
}

export interface ITransactionBuilder {
    build(payouts: PayoutTransaction[], storePayout: PayoutDetails[], config: PaymentConfiguration) : Promise<PayoutTransaction[]>
}

export interface ITransactionProcessor {
    write(transactions: PayoutTransaction[], config: PaymentConfiguration, maximumHeight: number, totalPayoutFundsNeeded: number, storePayout: PayoutDetails[]): Promise<void>
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




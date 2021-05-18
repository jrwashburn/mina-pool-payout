import { keypair } from "@o1labs/client-sdk";
import { Block, Stake } from "../core/dataprovider-types";
import { PayoutDetails, PayoutTransaction } from "../core/payout-calculator";

export interface PaymentGenerator {
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
    verbose: boolean
}

export interface Builder {
    build() : Promise<void>
}

export interface BlockHandler {
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


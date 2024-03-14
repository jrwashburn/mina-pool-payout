import { Block } from '../dataProvider/dataprovider-types';
import { PaymentConfiguration } from '../../configuration/Model';
import { PayoutDetails, PayoutTransaction } from '../payoutCalculator/Model';

export interface IPaymentProcessor {
    run(args: unknown): Promise<void>;
}

export interface PaymentProcess {
    payouts: PayoutTransaction[];
    payoutsBeforeExclusions: PayoutTransaction[];
    storePayout: PayoutDetails[];
    maximumHeight: number;
    blocks: Block[];
    totalPayoutFundsNeeded: number;
    totalPayouts: number;
    totalBurn: number;
    totals?: PaymentTotals;
}

export interface PaymentTotals {
    coinBaseSum: number;
    userCommandTransactionFeeSum: number;
    feeTransferFromCoinBaseSum: number;
    netCoinBaseReceived: number;
    payoutAmountsSum: number;
    payoutFeesSum: number;
    netMinaToPoolOperator: number;
    payoutBurnSum: number;
    payoutStakersSum: number;
}

export interface IPaymentBuilder {
    build(): Promise<PaymentProcess>;
}

export interface ISubstituteAndExcludePayToAddresses {
    run(transactions: PayoutTransaction[]): Promise<PayoutTransaction[]>;
}

export interface IBlockProcessor {
    determineLastBlockHeightToProcess(max: number, min: number, latestHeight: number): Promise<number>;
}

export interface ISummarizer<T> {
    calculateTotals(base: T): Promise<void>;
    printTotals(base: T): Promise<void>;
    writeTotals(config: PaymentConfiguration, base: T): Promise<void>;
}

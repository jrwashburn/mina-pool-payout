import { inject, injectable } from 'inversify';
import { Block } from '../dataProvider/dataprovider-types';
import { PayoutTransaction } from '../payoutCalculator/Model';
import { IFileWriter } from '../../shared/Model';
import { ISummarizer, PaymentProcess } from './Model';
import { PaymentConfiguration } from '../../configuration/Model';
import TYPES from '../../composition/Types';

@injectable()
export class PaymentSummarizer implements ISummarizer<PaymentProcess> {
    private fileWriter: IFileWriter;

    constructor(@inject(TYPES.IFileWriter) fileWriter: IFileWriter) {
        this.fileWriter = fileWriter;
    }

    async calculateTotals(base: PaymentProcess): Promise<void> {
        const getTotalsFromBlocks = (blocks: Block[]) => {
            let coinbasesum = 0;
            let feetransferfromcoinbasesum = 0;
            let usercommandtransactionfeessum = 0;
            blocks.forEach((block) => {
                coinbasesum += block.coinbase ?? 0;
                feetransferfromcoinbasesum += block.feetransferfromcoinbase ?? 0;
                usercommandtransactionfeessum += block.usercommandtransactionfees ?? 0;
            });

            return { coinbasesum, feetransferfromcoinbasesum, usercommandtransactionfeessum };
        };

        const getTotalAmountSum = (transactions: PayoutTransaction[]) => {
            let amountsum = 0;

            transactions.forEach((transaction) => {
                amountsum += transaction.amount ?? 0;
            });

            return amountsum;
        };

        const getTotalFeeSum = (transactions: PayoutTransaction[]) => {
            let feesum = 0;

            transactions.forEach((transaction) => {
                feesum += transaction.fee ?? 0;
            });

            return feesum;
        };

        const { coinbasesum, feetransferfromcoinbasesum, usercommandtransactionfeessum } = getTotalsFromBlocks(
            base.blocks,
        );

        const netcoinbasereceived = coinbasesum - feetransferfromcoinbasesum + usercommandtransactionfeessum;

        const amountsum = getTotalAmountSum(base.payoutsBeforeExclusions);

        const feesum = getTotalFeeSum(base.payouts);

        base.totals = {
            coinBaseSum: coinbasesum / 1000000000,
            feeTransferFromCoinBaseSum: feetransferfromcoinbasesum / 1000000000,
            userCommandTransactionFeeSum: usercommandtransactionfeessum / 1000000000,
            netCoinBaseReceived:
                (coinbasesum - feetransferfromcoinbasesum + usercommandtransactionfeessum) / 1000000000,
            payoutAmountsSum: amountsum / 1000000000,
            payoutFeesSum: feesum / 1000000000,
            netMinaToPoolOperator: (netcoinbasereceived - amountsum - feesum) / 1000000000,
        };
    }

    async printTotals(base: PaymentProcess): Promise<void> {
        console.log('------------------- Summary & Totals ------------------');
        console.log('Calculations based on entire pool');

        console.log(`Total Coin Base Generated: ${base.totals?.coinBaseSum}`);
        console.log(
            `User Transaction Fees Generated (net of snark fees): ${base.totals?.userCommandTransactionFeeSum}`,
        );
        console.log(`Total Snark Fees Paid From Coinbase: ${base.totals?.feeTransferFromCoinBaseSum}`);
        console.log(`Net Coinbase Received: ${base.totals?.netCoinBaseReceived}`);
        console.log(`Total Amounts Due To Stakers: ${base.totals?.payoutAmountsSum}`);
        console.log(`Total Payout Transaction Fees: ${base.totals?.payoutFeesSum}`);
        console.log(`Net MINA to Pool Operator (after send transaction fees): ${base.totals?.netMinaToPoolOperator}`);

        console.log('------------------- Summary & Totals ------------------');
    }

    async writeTotals(config: PaymentConfiguration, base: PaymentProcess): Promise<void> {
        const runDateTime = new Date();

        const { maximumHeight, totals } = base;
        const { minimumHeight } = config;
        const payoutSummaryFileName = this.generateOutputFileName(
            'payout_summary',
            runDateTime,
            minimumHeight,
            maximumHeight,
        );

        const data = {
            ...totals,
            defaultCommissionRate: config.defaultCommissionRate,
            stakingPoolPublicKey: config.stakingPoolPublicKey,
            payorComissionRates: config.commissionRatesByPublicKey,
        };

        this.fileWriter.write(payoutSummaryFileName, JSON.stringify(data));
    }

    private generateOutputFileName(
        identifier: string,
        runDateTime: Date,
        minimumHeight: number,
        maximumHeight: number,
    ) {
        return `./src/data/${identifier}_${this.longDateString(runDateTime)}_${minimumHeight}_${maximumHeight}.json`;
    }

    private longDateString(d: Date) {
        return d.toISOString().replace(/\D/g, '');
    }
}

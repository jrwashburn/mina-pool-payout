import { injectable } from "inversify";
import { Block } from "../dataProvider/dataprovider-types";
import { PayoutTransaction } from "../payoutCalculator/Model";
import { ISummarizer, PaymentProcess } from "./Model";

@injectable()
export class PaymentSummarizer implements ISummarizer<PaymentProcess> {
    async calculateTotals(base: PaymentProcess) : Promise<void> {

        const getTotalsFromBlocks = (blocks: Block[]) => {
            let coinbasesum = 0
            let feetransferfromcoinbasesum = 0
            let usercommandtransactionfeessum = 0
            blocks.forEach (block => {
                coinbasesum += block.coinbase ?? 0
                feetransferfromcoinbasesum += block.feetransferfromcoinbase ?? 0
                usercommandtransactionfeessum += block.usercommandtransactionfees ?? 0
            })

            return {coinbasesum, feetransferfromcoinbasesum, usercommandtransactionfeessum}
        }

        const getTotalPayouts = (transactions: PayoutTransaction[]) => {
            let amountsum = 0
            let feesum = 0

            transactions.forEach(transaction => {
                amountsum += transaction.amount ?? 0
                feesum += transaction.fee ?? 0
            })

            return {amountsum,feesum}
        }

        const {coinbasesum, feetransferfromcoinbasesum, usercommandtransactionfeessum} = getTotalsFromBlocks(base.blocks)

        const netcoinbasereceived = coinbasesum - feetransferfromcoinbasesum + usercommandtransactionfeessum

        const {amountsum,feesum} = getTotalPayouts(base.payouts)

        base.totals = {
            coinBaseSum: coinbasesum / 1000000000,
            feeTransferFromCoinBaseSum: feetransferfromcoinbasesum / 1000000000,
            userCommandTransactionFeeSum: usercommandtransactionfeessum / 1000000000,
            netCoinBaseReceived: ( coinbasesum - feetransferfromcoinbasesum + usercommandtransactionfeessum ) / 1000000000,
            payoutAmountsSum: amountsum / 1000000000,
            payoutFeesSum: feesum / 1000000000,
            netMinaToPoolOperator: ( netcoinbasereceived - amountsum - feesum ) / 1000000000
        }
    }

    async printTotals(base: PaymentProcess): Promise<void> {
        console.log('------------------- Summary & Totals ------------------')
        console.log('Calculations based on entire pool - ignoring substitutions and exclusions.')

        console.log(`Total Coin Base Generated: ${base.totals?.coinBaseSum}`)
        console.log(`User Transaction Fees Generated (net of snark fees): ${base.totals?.userCommandTransactionFeeSum}`)
        console.log(`Total Snark Fees Paid From Coinbase: ${base.totals?.feeTransferFromCoinBaseSum}`)
        console.log(`Net Coinbase Received: ${base.totals?.netCoinBaseReceived}`)
        console.log(`Total Amounts Due To Stakers: ${base.totals?.payoutAmountsSum}`)
        console.log(`Total Payout Transaction Fees: ${base.totals?.payoutFeesSum}`)
        console.log(`Net MINA to Pool Operator (before send transaction fees): ${base.totals?.netMinaToPoolOperator}`)

        console.log('------------------- Summary && Totals ------------------')

    }


}

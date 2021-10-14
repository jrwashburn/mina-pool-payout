import { inject, injectable } from 'inversify';
import TYPES from '../../composition/Types';
import { PaymentConfiguration } from '../../configuration/Model';
import { ISubstituteAndExcludePayToAddresses, PaymentProcess } from '../payment/Model';
import { PayoutTransaction } from '../payoutCalculator/Model';
import { ITransactionBuilder, IFeeCalculatorFactory, IFeeCalculator } from './Model';

@injectable()
export class TransactionBuilder implements ITransactionBuilder {
    private substituteAndExcludePayToAddresses: ISubstituteAndExcludePayToAddresses;
    private feeCalculator: IFeeCalculator

    constructor(@inject(TYPES.IAddressRemover) addressRemover: ISubstituteAndExcludePayToAddresses,
    @inject(TYPES.FeeCalculatorFactory) feeCalculatorFactory: IFeeCalculatorFactory) {
        this.substituteAndExcludePayToAddresses = addressRemover;
        this.feeCalculator = feeCalculatorFactory.create('none')
    }
    async build(paymentProcess: PaymentProcess, config: PaymentConfiguration): Promise<PayoutTransaction[]> {
        // Aggregate to a single transaction per key and track the total for funding transaction

        const { payouts, storePayout } = paymentProcess;

        let transactions: PayoutTransaction[] = [
            ...payouts
                .reduce((r, o) => {
                    const item: PayoutTransaction =
                        r.get(o.publicKey) ||
                        Object.assign({}, o, {
                            amount: 0,
                            fee: 0,
                            amountMina: 0,
                            feeMina: 0,
                        });

                    item.amount += o.amount;
                    this.feeCalculator.calculate(item, config);
                    return r.set(o.publicKey, item);
                }, new Map())
                .values(),
        ];

        if (config.verbose) {
            console.table(storePayout, [
                'publicKey',
                'blockHeight',
                'shareClass',
                'stakingBalance',
                'effectiveNPSPoolWeighting',
                'effectiveCommonPoolWeighting',
                'coinbase',
                'totalRewards',
                'totalRewardsNPSPool',
                'totalRewardsCommonPool',
                'payout',
            ]);
        }

        console.log(`before substitutions and exclusions`);

        console.table(transactions);

        paymentProcess.payoutsBeforeExclusions = transactions;

        transactions = await this.substituteAndExcludePayToAddresses.run(transactions);

        console.log(`after substitutions and exclusions`);

        console.table(transactions);

        paymentProcess.payouts = transactions;

        return transactions;
    }
}

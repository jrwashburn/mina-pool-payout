import { inject, injectable } from 'inversify';
import TYPES from '../../composition/Types.js';
import { PaymentConfiguration } from '../../configuration/Model.js';
import type { ISubstituteAndExcludePayToAddresses } from '../payment/Model.js';
import { PaymentProcess } from '../payment/Model.js';
import { PayoutTransaction } from '../payoutCalculator/Model.js';
import { ITransactionBuilder } from './Model.js';

@injectable()
export class TransactionBuilder implements ITransactionBuilder {
  private substituteAndExcludePayToAddresses: ISubstituteAndExcludePayToAddresses;

  constructor(@inject(TYPES.IAddressRemover) addressRemover: ISubstituteAndExcludePayToAddresses) {
    this.substituteAndExcludePayToAddresses = addressRemover;
  }
  async build(paymentProcess: PaymentProcess, config: PaymentConfiguration): Promise<PayoutTransaction[]> {
    // Aggregate to a single transaction per key and track the total for funding transaction

    const { payoutTransactions, payoutDetails } = paymentProcess;

    let transactions: PayoutTransaction[] = [
      ...payoutTransactions
        .reduce((r, o) => {
          const summaryGrouping = `${o.publicKey}:${o.summaryGroup}`;
          const item: PayoutTransaction =
            r.get(summaryGrouping) ||
            Object.assign({}, o, {
              amount: 0,
              fee: 0,
              amountMina: 0,
              feeMina: 0,
              memo: '',
            });

          item.amount += o.amount;
          item.fee = config.payorSendTransactionFee;
          item.amountMina = item.amount / 1000000000;
          item.feeMina = item.fee / 1000000000;
          item.memo = o.memo;
          return r.set(summaryGrouping, item);
        }, new Map())
        .values(),
    ];

    if (config.verbose) {
      console.table(payoutDetails, [
        'publicKey',
        'blockHeight',
        'shareClass',
        'stakingBalance',
        'sumEffectiveCommonPoolStakes',
        'effectiveCommonPoolWeighting',
        'coinbase',
        'totalRewards',
        'totalRewardsCommonPool',
        'payout',
        'toBurn',
      ]);
    }

    console.log(`before substitutions and exclusions`);

    console.table(transactions);

    paymentProcess.payoutsBeforeExclusions = JSON.parse(JSON.stringify(transactions));

    transactions = await this.substituteAndExcludePayToAddresses.run(transactions);

    console.log(`after substitutions and exclusions`);

    console.table(transactions);

    paymentProcess.payoutTransactions = transactions;

    return transactions;
  }
}

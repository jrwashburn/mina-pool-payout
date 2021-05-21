import { PayoutDetails, PayoutTransaction, substituteAndExcludePayToAddresses } from "../core/payout-calculator";
import { ITransactionBuilder, PaymentConfiguration } from "./Model";

export class TransactionBuilder implements ITransactionBuilder {
    async build(payouts: PayoutTransaction[], storePayout: PayoutDetails[], config: PaymentConfiguration): Promise<PayoutTransaction[]> {
            // Aggregate to a single transaction per key and track the total for funding transaction
    let transactions: PayoutTransaction[] = [...payouts.reduce((r, o) => {
      const item: PayoutTransaction = r.get(o.publicKey) || Object.assign({}, o, {
        amount: 0,
        fee: 0,
      });
      item.amount += o.amount;
      item.fee = config.payorSendTransactionFee;
      return r.set(o.publicKey, item);
    }, new Map).values()];

    if (config.verbose) {
      console.table(storePayout, ["publicKey", "blockHeight", "shareClass", "stakingBalance", "effectiveNPSPoolWeighting", "effectiveCommonPoolWeighting", "coinbase", "totalRewards", "totalRewardsNPSPool", "totalRewardsCommonPool", "payout"]);
    }

    console.log(`before substitutions and exclusions`)
    
    console.table(transactions);

    transactions = await substituteAndExcludePayToAddresses ( transactions );
    
    console.log(`after substitutions and exclusions`)
    
    console.table(transactions);

    return transactions

    }

}


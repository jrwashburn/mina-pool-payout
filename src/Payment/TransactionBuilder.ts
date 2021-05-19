import { PayoutDetails, PayoutTransaction, substituteAndExcludePayToAddresses } from "../core/payout-calculator";
import { ITransactionBuilder, PaymentConfiguration } from "./Model";
import hash from "object-hash";

export class TransactionBuilder implements ITransactionBuilder {
    async build(payouts: PayoutTransaction[], storePayout: PayoutDetails[], config: PaymentConfiguration): Promise<PayoutTransaction[]> {
            // Aggregate to a single transaction per key and track the total for funding transaction
    let totalPayoutFundsNeeded = 0
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

    const payoutHash = hash(storePayout, { algorithm: "sha256" }); //probably move this

    transactions = await substituteAndExcludePayToAddresses ( transactions );
    
    transactions.map((t) => {totalPayoutFundsNeeded += t.amount + t.fee});

    console.log(`Total Funds Required for Payout = ${totalPayoutFundsNeeded}`);
    
    console.log(`after substitutions and exclusions`)
    
    console.table(transactions);

    return transactions

    }

}


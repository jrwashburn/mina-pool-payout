import { inject, injectable } from "inversify";
import TYPES from "../../Composition/Types";
import { PaymentConfiguration } from "../../Configuration/Model";
import { PayoutTransaction } from "../PayoutCalculator/Model";
import { PaymentProcess, IAddressRemover } from "../Payment/Model";
import {ITransactionBuilder} from './Model'

@injectable()
export class TransactionBuilder implements ITransactionBuilder {

  private addressRemover: IAddressRemover

  constructor(@inject(TYPES.IAddressRemover) addressRemover: IAddressRemover) {
    this.addressRemover = addressRemover
  }
  async build(paymentProcess: PaymentProcess, config: PaymentConfiguration): Promise<PayoutTransaction[]> {
            // Aggregate to a single transaction per key and track the total for funding transaction

      let { payouts, storePayout } = paymentProcess
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

    transactions = await this.addressRemover.remove(transactions);
    
    console.log(`after substitutions and exclusions`)
    
    console.table(transactions);

    return transactions

    }

}

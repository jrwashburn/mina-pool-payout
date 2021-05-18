import { Block, Stake } from "../core/dataprovider-types";
import { PayoutTransaction, PayoutDetails } from "../core/payout-calculator";
import { PayoutCalculator } from "./Model";

export class PayoutProcessor implements PayoutCalculator {
    getPayouts(blocks: Block[], stakers: Stake[], totalStake: number, commisionRate: number): Promise<[payoutJson: PayoutTransaction[], storePayout: PayoutDetails[], blocksIncluded: number[], totalPayout: number]> {
        throw new Error("Method not implemented.");
    }

}
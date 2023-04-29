import { KeyCommissionRate } from '../../configuration/Model';
import { Block, Stake, ShareClass } from '../dataProvider/dataprovider-types';
import { IFeeCalculator } from '../transaction/Model';

export type PayoutDetails = {
    publicKey: string;
    blockHeight: number;
    globalSlot: number;
    publicKeyUntimedAfter: number;
    shareClass: ShareClass;
    stateHash: string;
    effectiveNPSPoolWeighting: number;
    effectiveNPSPoolStakes: number;
    effectiveCommonPoolWeighting: number;
    effectiveCommonPoolStakes: number;
    effectiveSuperchargedPoolWeighting: number;
    effectiveSuperchargedPoolStakes: number;
    stakingBalance: number;
    sumEffectiveNPSPoolStakes: number;
    sumEffectiveCommonPoolStakes: number;
    sumEffectiveSuperchargedPoolStakes: number;
    superchargedWeightingDiscount: number;
    dateTime: number;
    coinbase: number;
    totalRewards: number;
    totalRewardsNPSPool: number;
    totalRewardsCommonPool: number;
    totalRewardsSuperchargedPool: number;
    payout: number;
    isEffectiveSuperCharge: boolean;
};

export type PayoutTransaction = {
    publicKey: string;
    amount: number;
    fee: number;
    amountMina: number;
    feeMina: number;
};

export interface IPayoutCalculator {
    getPayouts(
        blocks: Block[],
        stakers: Stake[],
        totalStake: number,
        commisionRate: number,
        mfCommissionRate: number,
        o1CommissionRate: number,
        comissionRates: KeyCommissionRate,
    ): Promise<
        [payoutJson: PayoutTransaction[], storePayout: PayoutDetails[], blocksIncluded: number[], totalPayout: number]
    >;
}

export interface IFeeCalculatorFactory {
    create(): IFeeCalculator;
}

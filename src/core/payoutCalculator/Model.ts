import { KeyedRate } from '../../configuration/Model';
import { Block, Stake, ShareClass } from '../dataProvider/dataprovider-types';
import { IFeeCalculator } from '../transaction/Model';

export type PayoutDetails = {
    publicKey: string;
    owner: string;
    blockHeight: number;
    globalSlot: number;
    publicKeyUntimedAfter: number;
    winnerShareOwner: string;
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
    totalRewardsToBurn: number;
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
    memo: string;
    summaryGroup: number;
};

export interface IPayoutCalculator {
    getPayouts(
        blocks: Block[],
        stakers: Stake[],
        totalStake: number,
        commisionRate: number,
        mfCommissionRate: number,
        o1CommissionRate: number,
        investorsCommissionRate: number,
        comissionRates: KeyedRate,
        burnRates: KeyedRate,
        burnAddress: string,
        bpKeyMd5Hash: string,
        configuredMemo: string,
    ): Promise<
        [
            payoutTransactions: PayoutTransaction[],
            payoutDetails: PayoutDetails[],
            blocksIncluded: number[],
            totalPayout: number,
            totalSuperchargedToBurn: number,
            totalNegotiatedBurn: number,
        ]
    >;
}

export interface IFeeCalculatorFactory {
    create(): IFeeCalculator;
}

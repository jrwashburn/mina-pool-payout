import { injectable } from 'inversify';
import { KeyCommissionRate } from '../../configuration/Model';
import { stakeIsLocked } from '../../utils/staking-ledger-util';
import { Block, Stake } from '../dataProvider/dataprovider-types';
import { IPayoutCalculator, PayoutDetails, PayoutTransaction } from './Model';

@injectable()
export class PayoutCalculatorIsolateSuperCharge implements IPayoutCalculator {
    async getPayouts(
        blocks: Block[],
        stakers: Stake[],
        totalStake: number,
        defaultCommissionRate: number,
        mfCommissionRate: number,
        o1CommissionRate: number,
        investorsCommissionRate: number,
        commissionRates: KeyCommissionRate,
    ): Promise<
        [payoutJson: PayoutTransaction[], storePayout: PayoutDetails[], blocksIncluded: number[], totalPayout: number, totalToBurn: number]
    > {
        //TODO: JC - Shared Logic must be moved into its own class, then isolate change in behaviors
        // Initialize some stuff
        const blocksIncluded: number[] = [];
        const storePayout: PayoutDetails[] = [];
        let sumCoinbase = 0;
        let sumCoinbaseNoSuperchargedRewards = 0;
        let sumToBurnForSanityCheck = 0;

        // for each block, calculate the effective stake of each staker
        blocks.forEach((block: Block) => {
            // Keep a log of all blocks we processed
            blocksIncluded.push(block.blockheight);
            
            if (typeof block.coinbase === 'undefined' || block.coinbase == 0) {
                // no coinbase, don't need to do anything
            } else {
                const winner = this.getWinner(stakers, block);
                const coinbase = block.coinbase;
                const winnerStakeIsLocked = stakeIsLocked(winner, block);
                const burnSuperChargedRewards = (coinbase == 1440000000000) && (winner.shareClass.shareOwner == 'MF' || winner.shareClass.shareOwner == 'INVEST');

                sumCoinbase += coinbase;

                let sumEffectiveCommonPoolStakes = 0;
                let sumEffectiveNPSPoolStakes = 0;
                let sumEffectiveSuperchargedPoolStakes = 0;
                const effectivePoolStakes: {
                    [key: string]: { npsStake: number; commonStake: number; superchargedStake: number };
                } = {};

                let totalRewards = coinbase + block.feetransfertoreceiver - block.feetransferfromcoinbase;
                let totalNPSPoolRewards = winnerStakeIsLocked ? coinbase : coinbase / 2;
                let totalSuperchargedPoolRewards = winnerStakeIsLocked ? 0 : coinbase / 2;
                
                let totalCommonPoolRewards = totalRewards - totalNPSPoolRewards - totalSuperchargedPoolRewards;
                let blockRewardsToBurn = 0;
                
                if (burnSuperChargedRewards) {
                    totalRewards = (coinbase / 2) + block.feetransfertoreceiver - block.feetransferfromcoinbase;
                    totalNPSPoolRewards = coinbase / 2;
                    totalSuperchargedPoolRewards = coinbase / 2;
                    totalCommonPoolRewards = totalRewards - totalNPSPoolRewards - totalSuperchargedPoolRewards;
                    blockRewardsToBurn = coinbase / 2;
                    sumToBurnForSanityCheck += blockRewardsToBurn;
                }

                sumCoinbaseNoSuperchargedRewards += totalNPSPoolRewards;
                let totalUnweightedCommonStake = 0;

                // Determine the non-participating and common pool weighting for each staker
                stakers.forEach((staker: Stake) => {
                    const effectiveNPSStake = staker.stakingBalance;
                    let effectiveSuperchargedStake = 0;
                    let effectiveCommonStake = 0;
                    // common stake stays at 0 for NPS shares - they do not participate with the common in fees or supercharged block coinbase
                    if (staker.shareClass.shareClass == 'Common') {
                        effectiveCommonStake = staker.stakingBalance;
                        totalUnweightedCommonStake += staker.stakingBalance;
                        if (!stakeIsLocked(staker, block)) {
                            effectiveSuperchargedStake = staker.stakingBalance;
                        }
                    }
                    sumEffectiveNPSPoolStakes += effectiveNPSStake;
                    sumEffectiveCommonPoolStakes += effectiveCommonStake;
                    sumEffectiveSuperchargedPoolStakes += effectiveSuperchargedStake;
                    effectivePoolStakes[staker.publicKey] = {
                        npsStake: effectiveNPSStake,
                        commonStake: effectiveCommonStake,
                        superchargedStake: effectiveSuperchargedStake,
                    };
                });

                // Sense check the effective pool stakes must be at least equal to total_staking_balance and less than 2x
                if (sumEffectiveNPSPoolStakes != totalStake) {
                    throw new Error('NPS Share must be equal to total staked amount');
                }
                if (sumEffectiveCommonPoolStakes !== totalUnweightedCommonStake) {
                    throw new Error('Common share must equal total common stake');
                }
                if (totalSuperchargedPoolRewards > 0 && totalSuperchargedPoolRewards !== 720000000000) {
                    throw new Error('Winner unlocked, but supercharged coinbase share is not 720 MINA');
                }

                stakers.forEach((staker: Stake) => {
                    const effectiveNPSPoolWeighting =
                        sumEffectiveNPSPoolStakes > 0
                            ? effectivePoolStakes[staker.publicKey].npsStake / sumEffectiveNPSPoolStakes
                            : 0;
                    const effectiveCommonPoolWeighting =
                        sumEffectiveCommonPoolStakes > 0
                            ? effectivePoolStakes[staker.publicKey].commonStake / sumEffectiveCommonPoolStakes
                            : 0;
                    const effectiveSuperchargedPoolWeighting =
                        sumEffectiveSuperchargedPoolStakes > 0
                            ? effectivePoolStakes[staker.publicKey].superchargedStake /
                              sumEffectiveSuperchargedPoolStakes
                            : 0;

                    let blockTotal = 0;

                    //TODO APPLY NEW COMMISSION RATES Extract function
                    const commissionRate = commissionRates[staker.publicKey]
                        ? commissionRates[staker.publicKey].commissionRate
                        : defaultCommissionRate;
                    
                    //!!!!!!! IMPORTANT !!!!!!! : Increment the  totalToBurn only if the following conditions have been met:
                    // Only if the WINNER IS MF or INVEST and coinbase = 1440
                    // But Also and only in case the winner == the staker. This will avoid burning the same amount several times
                    // if We increment this for each staker, the total to burn will be huge if the number of stakers is high !!
                    // this is another way to make sure we burn only 1 time per supercharged block won by MF or INVET
                    if (winner.publicKey == staker.publicKey && burnSuperChargedRewards) { 
                        staker.totalToBurn += blockRewardsToBurn;
                    }
                    
                    if (staker.shareClass.shareClass == 'Common') {
                        blockTotal =
                            Math.floor((1 - commissionRate) * totalNPSPoolRewards * effectiveNPSPoolWeighting) +
                            Math.floor((1 - commissionRate) * totalCommonPoolRewards * effectiveCommonPoolWeighting) +
                            Math.floor(
                                (1 - commissionRate) *
                                    totalSuperchargedPoolRewards *
                                    effectiveSuperchargedPoolWeighting,
                            );
                    } else if (staker.shareClass.shareClass == 'NPS') {
                        if (staker.shareClass.shareOwner == 'MF') {
                            blockTotal = Math.floor(
                                (1 - mfCommissionRate) * totalNPSPoolRewards * effectiveNPSPoolWeighting,
                            );
                        } else if (staker.shareClass.shareOwner == 'INVEST') {
                            blockTotal = Math.floor(
                                (1 - investorsCommissionRate) * totalNPSPoolRewards * effectiveNPSPoolWeighting,
                            );
                        } else if (staker.shareClass.shareOwner == 'O1') {
                            blockTotal = Math.floor(
                                (1 - o1CommissionRate) * totalNPSPoolRewards * effectiveNPSPoolWeighting,
                            );
                        } else {
                            throw new Error(
                                'NPS shares should be owned by MF or O1. Found NPS Shares with other owner.',
                            );
                        }
                    } else {
                        throw new Error(
                            'Shares should be common or non-participating. Found shares with other shareClass.',
                        );
                    }

                    staker.total += blockTotal;

                    // Store this data in a structured format for later querying and for the payment script, handled seperately
                    storePayout.push({
                        publicKey: staker.publicKey,
                        blockHeight: block.blockheight,
                        globalSlot: block.globalslotsincegenesis,
                        publicKeyUntimedAfter: staker.untimedAfterSlot,
                        shareClass: staker.shareClass,
                        stateHash: block.statehash,
                        stakingBalance: staker.stakingBalance,
                        effectiveNPSPoolWeighting: effectiveNPSPoolWeighting,
                        effectiveNPSPoolStakes: effectivePoolStakes[staker.publicKey].npsStake,
                        effectiveCommonPoolWeighting: effectiveCommonPoolWeighting,
                        effectiveCommonPoolStakes: effectivePoolStakes[staker.publicKey].commonStake,
                        effectiveSuperchargedPoolWeighting: effectiveSuperchargedPoolWeighting,
                        effectiveSuperchargedPoolStakes: effectivePoolStakes[staker.publicKey].superchargedStake,
                        sumEffectiveNPSPoolStakes: sumEffectiveNPSPoolStakes,
                        sumEffectiveCommonPoolStakes: sumEffectiveCommonPoolStakes,
                        sumEffectiveSuperchargedPoolStakes: sumEffectiveSuperchargedPoolStakes,
                        superchargedWeightingDiscount: 0,
                        dateTime: block.blockdatetime,
                        coinbase: coinbase,
                        totalRewards: totalRewards,
                        totalRewardsNPSPool: totalNPSPoolRewards,
                        totalRewardsCommonPool: totalCommonPoolRewards,
                        totalRewardsSuperchargedPool: totalSuperchargedPoolRewards,
                        payout: blockTotal,
                        isEffectiveSuperCharge: true,
                        toBurn: blockRewardsToBurn,
                    });
                });
            }
        });

        const payoutJson: PayoutTransaction[] = [];
        let totalPayout = 0;
        let totalToBurn = 0;
        stakers.forEach((staker: Stake) => {
            const amount = staker.total;
            if (amount > 0) {
                payoutJson.push({
                    publicKey: staker.publicKey,
                    owner: staker.shareClass.shareOwner,
                    numberOfBlocks: blocksIncluded.length,
                    sumCoinbase: sumCoinbase / 1000000000,
                    sumCoinbaseNoSuperchargedRewards: sumCoinbaseNoSuperchargedRewards / 1000000000,
                    amount: amount,
                    fee: 0,
                    amountMina: 0,
                    feeMina: 0,
                    amountToBurn: staker.totalToBurn,
                    amountToBurnMina: 0,
                });
                totalPayout += amount;
                totalToBurn += staker.totalToBurn;
            }
        });

        if (sumToBurnForSanityCheck !== totalToBurn) {
            throw new Error('sumToBurnForSanityCheck !== totalToBurn !! this should never happen',);
        } else if (sumToBurnForSanityCheck > sumCoinbase / 2) { 
            throw new Error('sumToBurnForSanityCheck is too high. It s more than 1/2 of the sum of coinbases!! this should never happen',);
        }

        return [payoutJson, storePayout, blocksIncluded, totalPayout, totalToBurn];
    }

    private getWinner(stakers: Stake[], block: Block): Stake {
        const winners = stakers.filter((x) => x.publicKey == block.winnerpublickey);
        if (winners.length != 1) {
            throw new Error('Should have exactly 1 winner.');
        }
        return winners[0];
    }
}
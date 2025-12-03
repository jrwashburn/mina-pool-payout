import { injectable } from 'inversify';
import { KeyedRate } from '../../configuration/Model';
import { Block, Stake } from '../dataProvider/dataprovider-types';
import { IPayoutCalculator, PayoutDetails, PayoutTransaction } from './Model';
import { Decimal } from 'decimal.js';
import { ForkConstants } from './ForkConstants';

@injectable()
export class PayoutCalculatorPostSuperChargeKeepFees implements IPayoutCalculator {
  private fork: number;

  constructor(fork: number) {
    this.fork = fork;
  }

  async getPayouts(
    blocks: Block[],
    stakers: Stake[],
    totalStake: number,
    defaultCommissionRate: number,
    mfCommissionRate: number,
    o1CommissionRate: number,
    investorsCommissionRate: number,
    commissionRates: KeyedRate,
    burnRates: KeyedRate,
    burnAddress: string,
    bpKeyMd5Hash: string,
    configuredMemo: string,
  ): Promise<[
    payoutTranaction: PayoutTransaction[],
    payoutDetails: PayoutDetails[],
    blocksIncluded: number[],
    totalPayout: number,
    totalSuperchargedToBurn: number,
    totalNegotiatedBurn: number,
  ]> {
    console.log('Using Post Super Charge Payout Calculator');
    //TODO: JC - Shared Logic must be moved into its own class, then isolate change in behaviors
    // Initialize some stuff
    const REGULARCOINBASE = ForkConstants.getRegularCoinbase(this.fork);
    const blocksIncluded: number[] = [];
    const payoutDetails: PayoutDetails[] = [];
    let totalNegotiatedBurn = 0;

    // for each block, calculate the effective stake of each staker
    blocks.forEach((block: Block) => {
      // Keep a log of all blocks we processed
      blocksIncluded.push(block.blockheight);

      if (typeof block.coinbase === 'undefined' || block.coinbase == 0) {
        // no coinbase, don't need to do anything
      } else {
        const poolStakes: { [key: string]: { stake: number } } = {};
        const thisBlockReward = block.coinbase; // Intentionally excluding fees from the payout, they are kept for the pool owner
        let sumPoolStakes = new Decimal(0.0);

        // Determine the non-participating and common pool weighting for each staker
        stakers.forEach((staker: Stake) => {
          const stakerStake = new Decimal(staker.stakingBalance);
          sumPoolStakes = sumPoolStakes.plus(stakerStake);
          poolStakes[staker.publicKey] = { stake: stakerStake.toNumber() };
        });

        // Sense check the effective pool stakes must be at least equal to total_staking_balance and less than 2x
        if (sumPoolStakes.toNumber() !== totalStake) {
          throw new Error('Sum of pool shares must be equal to total staked amount');
        }
        ForkConstants.validateCoinbase(this.fork, block.coinbase);

        stakers.forEach((staker: Stake) => {
          const stakerPoolWeight = sumPoolStakes.greaterThan(0) ? poolStakes[staker.publicKey].stake / sumPoolStakes.toNumber() : 0;
          const commissionRate = commissionRates[staker.publicKey]
            ? commissionRates[staker.publicKey].rate
            : defaultCommissionRate;
          let blockTotal = 0;

          if (staker.shareClass.shareClass == 'Common') {
            blockTotal =
              Math.floor((1 - commissionRate) * thisBlockReward * stakerPoolWeight);
          } else if (staker.shareClass.shareClass == 'NPS') {
            if (staker.shareClass.shareOwner == 'MF') {
              blockTotal = Math.floor(
                (1 - mfCommissionRate) * thisBlockReward * stakerPoolWeight);
            } else if (staker.shareClass.shareOwner == 'O1') {
              blockTotal = Math.floor(
                (1 - o1CommissionRate) * thisBlockReward * stakerPoolWeight);
            } else if (staker.shareClass.shareOwner == 'INVEST') {
              blockTotal = Math.floor(
                (1 - investorsCommissionRate) * thisBlockReward * stakerPoolWeight);
            } else if (staker.shareClass.shareOwner == 'BURN') {
              blockTotal = Math.floor(
                (1 - commissionRate) * thisBlockReward * stakerPoolWeight);
            } else {
              throw new Error(
                'NPS shares should be MF or O1 or INVEST or BURN. Found NPS Shares with other owner.',
              );
            }
          } else {
            throw new Error(
              'Shares should be common or non-participating. Found shares with other shareClass.',
            );
          }

          // After calculating the block award, if the delegate has a fractional burn, move some of the blocktotal to the burn address
          const negotiatedBurnRate = burnRates[staker.publicKey] ? burnRates[staker.publicKey].rate : 0;
          const negotiatedBurnAmount = Math.floor(blockTotal * negotiatedBurnRate);
          totalNegotiatedBurn += negotiatedBurnAmount;
          blockTotal -= negotiatedBurnAmount;
          staker.total += blockTotal;

          // Store this data in a structured format for later querying and for the payment script, handled seperately
          // Must keep effective weights for different pools for backward compatibility
          payoutDetails.push({
            publicKey: staker.publicKey,
            owner: staker.shareClass.shareOwner,
            blockHeight: block.blockheight,
            globalSlot: block.globalslotsincegenesis,
            publicKeyUntimedAfter: staker.untimedAfterSlot,
            winnerShareOwner: '',
            shareClass: staker.shareClass,
            stateHash: block.statehash,
            effectiveNPSPoolWeighting: 0,
            effectiveNPSPoolStakes: 0,
            effectiveCommonPoolWeighting: stakerPoolWeight,
            effectiveCommonPoolStakes: poolStakes[staker.publicKey].stake,
            effectiveSuperchargedPoolWeighting: 0,
            effectiveSuperchargedPoolStakes: 0,
            stakingBalance: staker.stakingBalance,
            sumEffectiveNPSPoolStakes: 0,
            sumEffectiveCommonPoolStakes: sumPoolStakes.toNumber(),
            sumEffectiveSuperchargedPoolStakes: 0,
            superchargedWeightingDiscount: 0,
            dateTime: block.blockdatetime,
            coinbase: block.coinbase,
            totalRewards: thisBlockReward,
            totalRewardsToBurn: 0,
            totalRewardsNPSPool: 0,
            totalRewardsCommonPool: thisBlockReward,
            totalRewardsSuperchargedPool: 0,
            payout: blockTotal,
            isEffectiveSuperCharge: true,
          });
        });
        if (totalNegotiatedBurn > 0) {
          payoutDetails.push({
            publicKey: burnAddress,
            owner: 'BURN',
            blockHeight: block.blockheight,
            globalSlot: block.globalslotsincegenesis,
            publicKeyUntimedAfter: 0,
            winnerShareOwner: '',
            shareClass: { shareClass: 'BURN', shareOwner: 'BURN' },
            stateHash: block.statehash,
            stakingBalance: 0,
            effectiveNPSPoolWeighting: 0,
            effectiveNPSPoolStakes: 0,
            effectiveCommonPoolWeighting: 0,
            effectiveCommonPoolStakes: 0,
            sumEffectiveNPSPoolStakes: 0,
            sumEffectiveCommonPoolStakes: 0,
            superchargedWeightingDiscount: 0,
            dateTime: block.blockdatetime,
            coinbase: 0,
            totalRewards: 0,
            totalRewardsToBurn: totalNegotiatedBurn,
            totalRewardsNPSPool: 0,
            totalRewardsCommonPool: 0,
            payout: 0,
            isEffectiveSuperCharge: false,
            effectiveSuperchargedPoolWeighting: 0,
            effectiveSuperchargedPoolStakes: 0,
            sumEffectiveSuperchargedPoolStakes: 0,
            totalRewardsSuperchargedPool: 0,
          });
        }
      }
    });

    const payoutTransactions: PayoutTransaction[] = [];
    let totalPayout = 0;
    stakers.forEach((staker: Stake) => {
      const amount = staker.total;
      if (amount > 0) {
        payoutTransactions.push({
          publicKey: staker.publicKey,
          amount: amount,
          fee: 0,
          amountMina: 0,
          feeMina: 0,
          memo:
            staker.shareClass.shareOwner === 'MF' || staker.shareClass.shareOwner === 'INVEST'
              ? bpKeyMd5Hash
              : configuredMemo,
          summaryGroup: 0,
        });
        totalPayout += amount;
      }
    });
    if (totalNegotiatedBurn > 0) {
      payoutTransactions.push({
        publicKey: burnAddress,
        amount: totalNegotiatedBurn,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: configuredMemo,
        summaryGroup: 2,
      });
    }
    return [payoutTransactions, payoutDetails, blocksIncluded, totalPayout, 0, totalNegotiatedBurn];
  }
}
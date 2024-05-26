import { injectable } from 'inversify';
import { KeyedRate } from '../../configuration/Model';
import { stakeIsLocked } from '../../utils/staking-ledger-util';
import { Block, Stake } from '../dataProvider/dataprovider-types';
import { IPayoutCalculator, PayoutDetails, PayoutTransaction } from './Model';
import { Decimal } from 'decimal.js';

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
    commissionRates: KeyedRate,
    burnRates: KeyedRate,
    burnAddress: string,
    bpKeyMd5Hash: string,
    configuredMemo: string,
  ): Promise<
    [
      payoutTranaction: PayoutTransaction[],
      payoutDetails: PayoutDetails[],
      blocksIncluded: number[],
      totalPayout: number,
      totalSuperchargedToBurn: number,
      totalNegotiatedBurn: number,
    ]
  > {
    console.log('Using Isolate Super Charge Payout Calculator');
    //TODO: JC - Shared Logic must be moved into its own class, then isolate change in behaviors
    // Initialize some stuff
    const SUPERCHARGEDCOINBASE = 1440000000000;
    const REGULARCOINBASE = 720000000000;
    const blocksIncluded: number[] = [];
    const payoutDetails: PayoutDetails[] = [];
    let totalSuperchargedToBurn = 0;
    let totalNegotiatedBurn = 0;

    // for each block, calculate the effective stake of each staker
    blocks.forEach((block: Block) => {
      // Keep a log of all blocks we processed
      blocksIncluded.push(block.blockheight);

      if (typeof block.coinbase === 'undefined' || block.coinbase == 0 || stakers.length == 0) {
        // no coinbase or no stakers, don't need to do anything
      } else {
        const winner = this.getWinner(stakers, block);
        const winnerStakeIsLocked = stakeIsLocked(winner, block);
        const burnSuperChargedRewards =
          block.coinbase == SUPERCHARGEDCOINBASE &&
          (winner.shareClass.shareOwner == 'MF' ||
            winner.shareClass.shareOwner == 'INVEST' ||
            winner.shareClass.shareOwner == 'BURN');
        let sumEffectiveCommonPoolStakes = new Decimal(0.0);
        let sumEffectiveNPSPoolStakes = new Decimal(0.0);
        let sumEffectiveSuperchargedPoolStakes = new Decimal(0.0);
        const effectivePoolStakes: {
          [key: string]: { npsStake: number; commonStake: number; superchargedStake: number };
        } = {};

        const totalRewards = block.coinbase + block.feetransfertoreceiver - block.feetransferfromcoinbase;
        const totalNPSPoolRewards = winnerStakeIsLocked ? block.coinbase : REGULARCOINBASE;
        const burnSuperchargedAmount = burnSuperChargedRewards ? REGULARCOINBASE : 0;
        const totalSuperchargedPoolRewards =
          winnerStakeIsLocked || burnSuperChargedRewards ? 0 : REGULARCOINBASE;
        const totalCommonPoolRewards =
          totalRewards - totalNPSPoolRewards - burnSuperchargedAmount - totalSuperchargedPoolRewards;
        totalSuperchargedToBurn += burnSuperchargedAmount;

        let totalUnweightedCommonStake = new Decimal(0.0);

        // Determine the non-participating and common pool weighting for each staker
        stakers.forEach((staker: Stake) => {
          const effectiveNPSStake = new Decimal(staker.stakingBalance);
          let effectiveSuperchargedStake = new Decimal(0.0);
          let effectiveCommonStake = new Decimal(0.0);
          // common stake stays at 0 for NPS shares - they do not participate with the common in fees or supercharged block coinbase
          if (staker.shareClass.shareClass == 'Common') {
            effectiveCommonStake = new Decimal(staker.stakingBalance);
            totalUnweightedCommonStake = totalUnweightedCommonStake.plus(effectiveCommonStake);
            if (!stakeIsLocked(staker, block) && !burnSuperChargedRewards) {
              effectiveSuperchargedStake = effectiveCommonStake;
            }
          }
          sumEffectiveNPSPoolStakes = sumEffectiveNPSPoolStakes.plus(effectiveNPSStake);
          sumEffectiveCommonPoolStakes = sumEffectiveCommonPoolStakes.plus(effectiveCommonStake);
          sumEffectiveSuperchargedPoolStakes = sumEffectiveSuperchargedPoolStakes.plus(effectiveSuperchargedStake);
          effectivePoolStakes[staker.publicKey] = {
            npsStake: effectiveNPSStake.toNumber(),
            commonStake: effectiveCommonStake.toNumber(),
            superchargedStake: effectiveSuperchargedStake.toNumber(),
          };
        });

        // Sense check the effective pool stakes must be at least equal to total_staking_balance and less than 2x
        if (sumEffectiveNPSPoolStakes.toNumber() !== totalStake) {
          throw new Error('NPS Share must be equal to total staked amount');
        }
        if (sumEffectiveCommonPoolStakes.toNumber() !== totalUnweightedCommonStake.toNumber()) {
          throw new Error('Common share must equal total common stake');
        }
        if (totalSuperchargedPoolRewards > 0 && totalSuperchargedPoolRewards !== REGULARCOINBASE) {
          throw new Error('Winner unlocked, but supercharged coinbase share is not 720 MINA');
        }

        stakers.forEach((staker: Stake) => {
          const effectiveNPSPoolWeighting =
            sumEffectiveNPSPoolStakes.greaterThan(0)
              ? effectivePoolStakes[staker.publicKey].npsStake / sumEffectiveNPSPoolStakes.toNumber()
              : 0;
          const effectiveCommonPoolWeighting =
            sumEffectiveCommonPoolStakes.greaterThan(0)
              ? effectivePoolStakes[staker.publicKey].commonStake / sumEffectiveCommonPoolStakes.toNumber()
              : 0;
          const effectiveSuperchargedPoolWeighting =
            sumEffectiveSuperchargedPoolStakes.greaterThan(0)
              ? effectivePoolStakes[staker.publicKey].superchargedStake /
              sumEffectiveSuperchargedPoolStakes.toNumber()
              : 0;

          //TODO APPLY NEW COMMISSION RATES Extract function
          const commissionRate = commissionRates[staker.publicKey]
            ? commissionRates[staker.publicKey].rate
            : defaultCommissionRate;

          let blockTotal = 0;
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
            } else if (staker.shareClass.shareOwner == 'O1') {
              blockTotal = Math.floor(
                (1 - o1CommissionRate) * totalNPSPoolRewards * effectiveNPSPoolWeighting,
              );
            } else if (staker.shareClass.shareOwner == 'INVEST') {
              blockTotal = Math.floor(
                (1 - investorsCommissionRate) * totalNPSPoolRewards * effectiveNPSPoolWeighting,
              );
            } else if (staker.shareClass.shareOwner == 'BURN') {
              blockTotal = Math.floor(
                (1 - commissionRate) * totalNPSPoolRewards * effectiveNPSPoolWeighting,
              );
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
          payoutDetails.push({
            publicKey: staker.publicKey,
            owner: staker.shareClass.shareOwner,
            blockHeight: block.blockheight,
            globalSlot: block.globalslotsincegenesis,
            publicKeyUntimedAfter: staker.untimedAfterSlot,
            winnerShareOwner: winner.shareClass.shareOwner,
            shareClass: staker.shareClass,
            stateHash: block.statehash,
            effectiveNPSPoolWeighting: effectiveNPSPoolWeighting,
            effectiveNPSPoolStakes: effectivePoolStakes[staker.publicKey].npsStake,
            effectiveCommonPoolWeighting: effectiveCommonPoolWeighting,
            effectiveCommonPoolStakes: effectivePoolStakes[staker.publicKey].commonStake,
            effectiveSuperchargedPoolWeighting: effectiveSuperchargedPoolWeighting,
            effectiveSuperchargedPoolStakes: effectivePoolStakes[staker.publicKey].superchargedStake,
            stakingBalance: staker.stakingBalance,
            sumEffectiveNPSPoolStakes: sumEffectiveNPSPoolStakes.toNumber(),
            sumEffectiveCommonPoolStakes: sumEffectiveCommonPoolStakes.toNumber(),
            sumEffectiveSuperchargedPoolStakes: sumEffectiveSuperchargedPoolStakes.toNumber(),
            superchargedWeightingDiscount: 0,
            dateTime: block.blockdatetime,
            coinbase: block.coinbase,
            totalRewards: totalRewards,
            totalRewardsToBurn: 0,
            totalRewardsNPSPool: totalNPSPoolRewards,
            totalRewardsCommonPool: totalCommonPoolRewards,
            totalRewardsSuperchargedPool: totalSuperchargedPoolRewards,
            payout: blockTotal,
            isEffectiveSuperCharge: true,
          });
        });
        if (totalSuperchargedToBurn > 0) {
          payoutDetails.push({
            publicKey: burnAddress,
            owner: 'BURN',
            blockHeight: block.blockheight,
            globalSlot: block.globalslotsincegenesis,
            publicKeyUntimedAfter: 0,
            winnerShareOwner: winner.shareClass.shareOwner,
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
            totalRewardsToBurn: totalSuperchargedToBurn,
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
        if (totalNegotiatedBurn > 0) {
          payoutDetails.push({
            publicKey: burnAddress,
            owner: 'BURN',
            blockHeight: block.blockheight,
            globalSlot: block.globalslotsincegenesis,
            publicKeyUntimedAfter: 0,
            winnerShareOwner: winner.shareClass.shareOwner,
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
    if (totalSuperchargedToBurn > 0) {
      payoutTransactions.push({
        publicKey: burnAddress,
        amount: totalSuperchargedToBurn,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: bpKeyMd5Hash,
        summaryGroup: 1,
      });
    }
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
    return [payoutTransactions, payoutDetails, blocksIncluded, totalPayout, totalSuperchargedToBurn, totalNegotiatedBurn];
  }

  private getWinner(stakers: Stake[], block: Block): Stake {
    const winners = stakers.filter((x) => x.publicKey == block.winnerpublickey);
    if (winners.length != 1) {
      throw new Error('Should have exactly 1 winner.');
    }
    return winners[0];
  }
}
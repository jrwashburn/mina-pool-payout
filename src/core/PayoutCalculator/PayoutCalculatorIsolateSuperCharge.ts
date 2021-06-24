
import { injectable } from "inversify";
import { Block, Stake } from "../DataProvider/dataprovider-types";
import { IPayoutCalculator } from "./Model";
import { PayoutDetails,PayoutTransaction } from "./Model"
import { stakeIsLocked } from "../../Utils/staking-ledger-util";

// per foundation and o1 rules, the maximum fee is 5%, excluding fees and supercharged coinbase
// see https://minaprotocol.com/docs/advanced/foundation-delegation-program
const npsCommissionRate = 0.05;

@injectable()
export class PayoutCalculatorIsolateSuperCharge implements IPayoutCalculator {
    async getPayouts(blocks: Block[], stakers: Stake[], totalStake: number, commisionRate: number): Promise<[payoutJson: PayoutTransaction[], storePayout: PayoutDetails[], blocksIncluded: number[], totalPayout: number]> {
    
    //TODO: JC - Shared Logic must be moved into its own class, then isolate change in behaviors
        // Initialize some stuff
  let blocksIncluded: number[] = [];
  let storePayout: PayoutDetails[] = [];

  // for each block, calculate the effective stake of each staker
  blocks.forEach((block: Block) => {
    // Keep a log of all blocks we processed
    blocksIncluded.push(block.blockheight);

    if (typeof block.coinbase === "undefined" || block.coinbase == 0) {
      // no coinbase, don't need to do anything
    } else {
      const winner = this.getWinner(stakers, block);

      let sumEffectiveCommonPoolStakes = 0;
      let sumEffectiveNPSPoolStakes = 0;
      let sumEffectiveSuperchargedPoolStakes = 0;
      let effectivePoolStakes: {
        [key: string]: { npsStake: number; commonStake: number; superchargedStake: number; };
      } = {};

      const transactionFees = block.usercommandtransactionfees || 0;
      const totalRewards =
        block.coinbase +
        block.feetransfertoreceiver -
        block.feetransferfromcoinbase;
      const totalNPSPoolRewards = stakeIsLocked(winner, block)
        ? block.coinbase
        : block.coinbase / 2;
      const totalSuperchargedPoolRewards = stakeIsLocked(winner, block)
        ? 0
        : block.coinbase / 2;
      const totalCommonPoolRewards = totalRewards - totalNPSPoolRewards - totalSuperchargedPoolRewards;

      let totalUnweightedCommonStake = 0;

      // Determine the non-participating and common pool weighting for each staker
      stakers.forEach((staker: Stake) => {
        let effectiveNPSStake = staker.stakingBalance;
        let effectiveSuperchargedStake = 0;
        let effectiveCommonStake = 0;
        // common stake stays at 0 for NPS shares - they do not participate with the common in fees or supercharged block coinbase
        if (staker.shareClass == "Common") {
          effectiveCommonStake = staker.stakingBalance;
          totalUnweightedCommonStake += staker.stakingBalance;
          if ( !stakeIsLocked(staker,block)) {
            effectiveSuperchargedStake = staker.stakingBalance;
          }
        }
        sumEffectiveNPSPoolStakes += effectiveNPSStake;
        sumEffectiveCommonPoolStakes += effectiveCommonStake;
        sumEffectiveSuperchargedPoolStakes += effectiveSuperchargedStake;
        effectivePoolStakes[staker.publicKey] = {
          npsStake: effectiveNPSStake,
          commonStake: effectiveCommonStake,
          superchargedStake: effectiveSuperchargedStake
        };
      });

      // Sense check the effective pool stakes must be at least equal to total_staking_balance and less than 2x
      if (sumEffectiveNPSPoolStakes != totalStake) {
        throw new Error("NPS Share must be equal to total staked amount");
      }
      if (sumEffectiveCommonPoolStakes !== totalUnweightedCommonStake ) {
        throw new Error(
          "Common share must equal total common stake"
        );
      }

      stakers.forEach((staker: Stake) => {
        const effectiveNPSPoolWeighting = (sumEffectiveNPSPoolStakes > 0)
          ? effectivePoolStakes[staker.publicKey].npsStake /
          sumEffectiveNPSPoolStakes
          : 0;
        const effectiveCommonPoolWeighting = (sumEffectiveCommonPoolStakes > 0)
          ? effectivePoolStakes[staker.publicKey].commonStake /
          sumEffectiveCommonPoolStakes
          : 0;
        const effectiveSuperchargedPoolWeighting = (sumEffectiveSuperchargedPoolStakes > 0)
          ? effectivePoolStakes[staker.publicKey].superchargedStake /
          sumEffectiveSuperchargedPoolStakes
          : 0;

        let blockTotal = 0;
        if (staker.shareClass == "Common") {
          blockTotal =
            Math.floor(
              (1 - commisionRate) *
                totalNPSPoolRewards *
                effectiveNPSPoolWeighting
            ) +
            Math.floor(
              (1 - commisionRate) *
                totalCommonPoolRewards *
                effectiveCommonPoolWeighting
            ) + 
            Math.floor(
              (1 - commisionRate) *
                totalSuperchargedPoolRewards *
                effectiveSuperchargedPoolWeighting
            );
        } else if (staker.shareClass == "NPS") {
          blockTotal = Math.floor(
            (1 - npsCommissionRate) *
              totalNPSPoolRewards *
              effectiveNPSPoolWeighting
          );
        } else throw new Error('Staker share class is unknown');

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
          effectiveNPSPoolStakes:
            effectivePoolStakes[staker.publicKey].npsStake,
          effectiveCommonPoolWeighting: effectiveCommonPoolWeighting,
          effectiveCommonPoolStakes:
            effectivePoolStakes[staker.publicKey].commonStake,
          effectiveSuperchargedPoolWeighting: effectiveSuperchargedPoolWeighting,
          effectiveSuperchargedPoolStakes: 
            effectivePoolStakes[staker.publicKey].superchargedStake,
          sumEffectiveNPSPoolStakes: sumEffectiveNPSPoolStakes,
          sumEffectiveCommonPoolStakes: sumEffectiveCommonPoolStakes,
          sumEffectiveSuperchargedPoolStakes: sumEffectiveSuperchargedPoolStakes,
          superchargedWeightingDiscount: 0,
          dateTime: block.blockdatetime,
          coinbase: block.coinbase,
          totalRewards: totalRewards,
          totalRewardsNPSPool: totalNPSPoolRewards,
          totalRewardsCommonPool: totalCommonPoolRewards,
          totalRewardsSuperchargedPool: totalSuperchargedPoolRewards,
          payout: blockTotal,
          isEffectiveSuperCharge: true,
        });
      });
    }
  });

  let payoutJson: PayoutTransaction[] = [];
  let totalPayout = 0;
  stakers.forEach((staker: Stake) => {
    const amount = staker.total;
    if (amount > 0) {
      payoutJson.push({
        publicKey: staker.publicKey,
        amount: amount,
        fee: 0,
      });
      totalPayout += amount;
    }
  });
  return [payoutJson, storePayout, blocksIncluded, totalPayout];
    }

    private getWinner (stakers: Stake[], block: Block): Stake {
        const winners = stakers.filter((x) => x.publicKey == block.winnerpublickey);
            if (winners.length != 1) {
              throw new Error("Should have exactly 1 winner.");
            }
            return winners[0];
      }
    
 }





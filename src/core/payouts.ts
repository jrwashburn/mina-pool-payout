import { Block } from "./queries";
import { stakeIsLocked, Stake } from "./stakes";

export async function getPayouts(blocks: Block[], stakers: Stake[], totalStake: number, commissionRate: number):
  Promise<[payoutJson: PayoutTransaction[], storePayout: PayoutDetails[], blocksIncluded: number[], totalPayout: number]> {

  // Initialize some stuff
  let blocksIncluded: number[] = [];
  let storePayout: PayoutDetails[] = [];

  // for each block, calculate the effective stake of each staker
  blocks.forEach((block: Block) => {

    // Keep a log of all blocks we processed
    blocksIncluded.push(block.blockheight);

    if (typeof (block.coinbase) === 'undefined' || block.coinbase == 0) {
      // no coinbase, don't need to do anything
    } else {

      const winner = getWinner(stakers, block);

      let sumEffectiveCommonPoolStakes = 0;
      let sumEffectiveNPSPoolStakes = 0;
      let effectivePoolStakes: { [key: string]: number } = {};

      // Determine the supercharged discount for the block
      const txFees = block.usercommandtransactionfees || 0;
      const superchargedWeightingDiscount = txFees / block.coinbase;
      const totalRewards = block.blockpayoutamount;
      const totalNPSPoolRewards = stakeIsLocked(winner, block) ? block.coinbase : block.coinbase / 2;
      const totalNPSPoolFees = .05 * totalNPSPoolRewards;
      const totalCommonPoolRewards = totalRewards - totalNPSPoolRewards - totalNPSPoolFees;
      const totalCommonPoolFees = commissionRate * totalCommonPoolRewards;

      // Determine the effective pool weighting based on sum of effective stakes
      stakers.forEach((staker: Stake) => {
        let effectiveStake = staker.stakingBalance;
        if (staker.shareClass == "NPS") {
          sumEffectiveNPSPoolStakes += effectiveStake;
        } else {
          // if staker is unlocked, double their share (less discount for fees)
          // otherwise regular share
          if (!stakeIsLocked(staker, block)) {
            // TODO: need to handle rounding to elminate franctional nanomina
            effectiveStake = (staker.stakingBalance * (2 - superchargedWeightingDiscount));
          }
          sumEffectiveCommonPoolStakes += effectiveStake;  
        }
        effectivePoolStakes[staker.publicKey] = effectiveStake;
      });

      // Sense check the effective pool stakes must be at least equal to total_staking_balance and less than 2x
      if ((sumEffectiveNPSPoolStakes + sumEffectiveNPSPoolStakes) > totalStake * 2) {
        throw new Error('Staking Calculation is more than 2x total stake')
      }
      if ((sumEffectiveNPSPoolStakes + sumEffectiveNPSPoolStakes) < totalStake) {
        throw new Error('Staking Calculation is less than total stake')
      }

      stakers.forEach((staker: Stake) => {
        const effectivePoolWeighting = effectivePoolStakes[staker.publicKey] / (staker.shareClass == "NPS" ? sumEffectiveNPSPoolStakes : sumEffectiveCommonPoolStakes);

        // This must be less than 1 or we have a major issue
        // TODO: assert effective_pool_weighting <= 1
        // TODO: use 9 digits precision

        const blockTotal = (staker.shareClass == "NPS") ?
          Math.round((totalNPSPoolRewards - totalNPSPoolFees) * effectivePoolWeighting) :
          Math.round((totalCommonPoolRewards - totalCommonPoolFees) * effectivePoolWeighting);  

          staker.total += blockTotal;

        // Store this data in a structured format for later querying and for the payment script, handled seperately
        storePayout.push({
          publicKey: staker.publicKey,
          blockHeight: block.blockheight,
          globalSlot: block.globalslotsincegenesis,
          publicKeyUntimedAfter: staker.untimedAfterSlot,
          shareClass: staker.shareClass,
          stateHash: block.statehash,
          effectivePoolWeighting: effectivePoolWeighting,
          effectivePoolStakes: effectivePoolStakes[staker.publicKey],
          stakingBalance: staker.stakingBalance,
          sumEffectiveNPSPoolStakes: sumEffectiveNPSPoolStakes,
          sumEffectiveCommonPoolStakes: sumEffectiveCommonPoolStakes,
          superchargedWeightingDiscount: superchargedWeightingDiscount,
          dateTime: block.blockdatetime,
          coinbase: block.coinbase,
          totalRewards: totalRewards,
          totalRewardsNPSPool: totalNPSPoolRewards, 
          totalRewardsCommonPool: totalCommonPoolRewards,
          payout: blockTotal,
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
        fee: 0
      });
      totalPayout += amount;
    }
  });

  return [payoutJson, storePayout, blocksIncluded, totalPayout];
}

function getWinner(stakers: Stake[], block: Block): Stake {
  const winners = stakers.filter(x => x.publicKey == block.winnerpublickey);
  if (winners.length != 1) {
    throw new Error("Should have exactly 1 winner.");
  }
  return winners[0];
}

export type PayoutDetails = {
  publicKey: string,
  blockHeight: number,
  globalSlot: number,
  publicKeyUntimedAfter: number,
  shareClass: "NPS"|"Common",
  stateHash: string,
  effectivePoolWeighting: number,
  effectivePoolStakes: number,
  stakingBalance: number,
  sumEffectiveNPSPoolStakes: number,
  sumEffectiveCommonPoolStakes: number,
  superchargedWeightingDiscount: number,
  dateTime: number,
  coinbase: number,
  totalRewards: number,
  totalRewardsNPSPool: number,
  totalRewardsCommonPool: number,
  payout: number
};

export type PayoutTransaction = {
  publicKey: string,
  amount: number,
  fee: number
};

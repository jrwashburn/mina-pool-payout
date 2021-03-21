import { Block } from "./queries";
import { stakeIsLocked, Stake } from "./stakes";
// per foundation and o1 rules, the maximum fee is 5%, excluding fees and supercharged coinbase
// see https://minaprotocol.com/docs/advanced/foundation-delegation-program
const npsCommissionRate = 0.05

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
      let effectivePoolStakes: { [key: string]: { npsStake: number , commonStake: number} } = {};

      const transactionFees = block.usercommandtransactionfees || 0;
      const totalRewards = block.coinbase + block.feetransfertoreceiver - block.feetransferfromcoinbase;
      const totalNPSPoolRewards = stakeIsLocked(winner, block) ? block.coinbase : block.coinbase / 2;
      const totalNPSPoolFees = npsCommissionRate * totalNPSPoolRewards;
      const totalCommonPoolRewards = totalRewards - totalNPSPoolRewards;
      const totalCommonPoolFees = commissionRate * totalCommonPoolRewards;

      // Determine the supercharged discount for the block
      //  unlocked accounts will get a double share less this discount based on the ratio of fees : coinbase
      //  unlocaked accounts generate extra coinbase, but if fees are significant, that coinbase would have a lower relative weight
      const superchargedWeightingDiscount = transactionFees / block.coinbase;

      let totalUnweightedCommonStake = 0;
      // Determine the non-participating and common pool weighting for each staker
      stakers.forEach((staker: Stake) => {
        let effectiveNPSStake = staker.stakingBalance;
        let effectiveCommonStake = 0;
        // common stake stays at 0 for NPS shares - they do not participate with the common in fees or supercharged block coinbase
        if (staker.shareClass == "Common") {
          effectiveCommonStake = !stakeIsLocked(staker, block) ? staker.stakingBalance * (2 - superchargedWeightingDiscount) : staker.stakingBalance;
          totalUnweightedCommonStake += staker.stakingBalance
        }
        sumEffectiveNPSPoolStakes += effectiveNPSStake;
        sumEffectiveCommonPoolStakes += effectiveCommonStake;
        effectivePoolStakes[staker.publicKey] = {npsStake: effectiveNPSStake, commonStake: effectiveCommonStake};
      });

      // Sense check the effective pool stakes must be at least equal to total_staking_balance and less than 2x
      if (sumEffectiveNPSPoolStakes != totalStake) {
        throw new Error('NPS Share must be equal to total staked amount');
      }
      if (sumEffectiveCommonPoolStakes > totalUnweightedCommonStake * 2) {
        throw new Error('Common weighted share must not be greater than 2x total common stake');
      }

      stakers.forEach((staker: Stake) => {
        const effectiveNPSPoolWeighting = effectivePoolStakes[staker.publicKey].npsStake / sumEffectiveNPSPoolStakes ;
        const effectiveCommonPoolWeighting = effectivePoolStakes[staker.publicKey].commonStake / sumEffectiveCommonPoolStakes;

        const blockTotal = 
          Math.round((totalNPSPoolRewards - totalNPSPoolFees) * effectiveNPSPoolWeighting ) +
          Math.round((totalCommonPoolRewards - totalCommonPoolFees) * effectiveCommonPoolWeighting);  

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
        fee: 0,
        amountMina: 0,
        feeMina: 0 
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
  effectiveNPSPoolWeighting: number, 
  effectiveNPSPoolStakes: number,
  effectiveCommonPoolWeighting: number,
  effectiveCommonPoolStakes: number,
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
  fee: number,
  amountMina: number,
  feeMina: number
};

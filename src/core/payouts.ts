import { Block } from "./queries";
import { stakeIsLocked, Stake } from "./stakes";

export async function getPayouts(blocks: Block[], stakers: Stake[], totalStake: number, commissionRate: number):
  Promise<[payoutJson: PayoutTransaction[], storePayout: PayoutDetails[], blocksIncluded: number[], allBlocksTotalRewards: number, allBlocksTotalPoolFees: number, totalPayout: number]> {

  // Initialize some stuff
  let allBlocksTotalRewards = 0;
  let allBlocksTotalPoolFees = 0;
  let blocksIncluded: number[] = [];
  let storePayout: PayoutDetails[] = [];

  // for each block, calculate the effective stake of each staker
  blocks.forEach((block: Block) => {

    // Keep a log of all blocks we processed
    blocksIncluded.push(block.blockheight);

    if (typeof (block.coinbase) === 'undefined' || block.coinbase == 0) {
      // no coinbase, don't need to do anything
    } else {

      const winners = stakers.filter(x => x.publicKey == block.winnerpublickey);
      if (winners.length != 1) {
        throw new Error("Should have exactly 1 winner.");
      }
      const winner = winners[0];

      let sumEffectivePoolStakes = 0;
      let effectivePoolStakes: { [key: string]: number } = {};

      // Determine the supercharged discount for the block
      const txFees = block.usercommandtransactionfees || 0;
      const superchargedWeightingDiscount = txFees / block.coinbase;
      const totalRewards = block.blockpayoutamount


      if (stakeIsLocked(winner, block.globalslotsincegenesis)) {
        
      }
      // NPS have to unwrap the net here now
      // have totalRewardsNPSPool and totalRewardsCommonPool
      /*
          if **./stakes.publicKeyIsLocked** ( block.winnerpublickey, block.globalslotsincegenesis)
            totalRewardsNPSPool = coinbase
          else
            totalRewardsNPSPool = coinbase / 2 (round down to nearest nanomina)
          totalRewardsCommonPool = totalRewards - totalRewardsNPSPool
      */

      //NPS remove these sums total Pool Fees and just add them up at the end.
      const totalPoolFees = commissionRate * totalRewards;
      allBlocksTotalRewards += totalRewards;
      allBlocksTotalPoolFees += totalPoolFees;

      // NPS add new field NPSStake and rename effectiveStake to commonStake?
      // only calculate the supercharged on Common keys, NPS cannot supercharge 
      // and need a new sum for each
      // All stakers will get their NPSStake share, and then common stakers will also get their superchargedStake
      // NPS Stakers are not included in the common stakers total
      // given 1000 NPS shares in 2 keys, and 500 common shares in 10 keys, 4 are unlocked
      // each NPS has a 0.25 share of the NPS pool, and each common has 0.025; pool is 2000
      // each NPS has 0 of the common. locked have ~.0714 and unlocked have ~.1428 (minus superchargedweighting discount) 
      //  of a common pool total of ~700
    
      // Determine the effective pool weighting based on sum of effective stakes
      stakers.forEach((staker: Stake) => {
        let effectiveStake = 0;
        // if staker is unlocked, double their share (less discount for fees)
        // otherwise regular share
        if (block.globalslotsincegenesis > staker.untimedAfterSlot) {
          // NPS need to do this now
          // TODO: need to handle rounding to elminate franctional nanomina
          effectiveStake = (staker.stakingBalance * (2 - superchargedWeightingDiscount));
        } else {
          effectiveStake = staker.stakingBalance;
        }
        effectivePoolStakes[staker.publicKey] = effectiveStake;
        sumEffectivePoolStakes += effectiveStake;
      });

      // NPS below only makes sense against commonStake now, add assert NPSSTake must be == total
      // Sense check the effective pool stakes must be at least equal to total_staking_balance and less than 2x
      if (sumEffectivePoolStakes > totalStake * 2) {
        throw new Error('Staking Calculation is more than 2x total stake')
      }
      if (sumEffectivePoolStakes < totalStake) {
        throw new Error('Staking Calculation is less than total stake')
      }

      stakers.forEach((staker: Stake) => {

        const effectivePoolWeighting = effectivePoolStakes[staker.publicKey] / sumEffectivePoolStakes;

        // This must be less than 1 or we have a major issue
        // TODO: assert effective_pool_weighting <= 1
        // TODO: use 9 digits precision
        // NPS handle totals at the end, and handle rounding
        /* NPS everyone gets their share of the NPS, then common get their common
          key block reward = 
          blockTotal = (totalRewardsNPSPool * NPSStake) + (totalRewardsCommonPool * CommonStake) (which is 0 for NPS keys)
        */
        const blockTotal = Math.round(
          (totalRewards - totalPoolFees) * effectivePoolWeighting
        );
        staker.total += blockTotal;

        //NPS 
        // add NPS/CommonStake and Totals

        // Store this data in a structured format for later querying and for the payment script, handled seperately
        storePayout.push({
          publicKey: staker.publicKey,
          blockHeight: block.blockheight,
          globalSlot: block.globalslotsincegenesis,
          publicKeyUntimedAfter: staker.untimedAfterSlot,
          stateHash: block.statehash,
          effectivePoolWeighting: effectivePoolWeighting,
          effectivePoolStakes: effectivePoolStakes[staker.publicKey],
          stakingBalance: staker.stakingBalance,
          sumEffectivePoolStakes: sumEffectivePoolStakes,
          superchargedWeightingDiscount: superchargedWeightingDiscount,
          dateTime: block.blockdatetime,
          coinbase: block.coinbase,
          totalRewards: totalRewards,
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

  return [payoutJson, storePayout, blocksIncluded, allBlocksTotalRewards, allBlocksTotalPoolFees, totalPayout];
}

export type PayoutDetails = {
  publicKey: string,
  blockHeight: number,
  globalSlot: number,
  publicKeyUntimedAfter: number,
  stateHash: string,
  effectivePoolWeighting: number,
  effectivePoolStakes: number,
  stakingBalance: number,
  sumEffectivePoolStakes: number,
  superchargedWeightingDiscount: number,
  dateTime: number,
  coinbase: number,
  totalRewards: number,
  payout: number
};

export type PayoutTransaction = {
  publicKey: string,
  amount: number,
  fee: number
};

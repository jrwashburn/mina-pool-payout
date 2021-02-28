import { Block, getBlocks, getLatestHeight } from "./queries";
import { StakingKey, getStakes } from "./stakes";

export async function getPayouts(stakingPoolKey: string, minHeight: number, globalSlotStart: number, k: number, slotsPerEpoch: number, commissionRate: number) {

  // Initialize some stuff
  let allBlocksTotalRewards = 0;
  let allBlocksTotalPoolFees = 0;
  let blocksIncluded: any[] = [];
  // finality understood to be max height minus k blocks. unsafe to process blocks above maxHeight since they could change if there is a long running, short-range fork
  const finalityHeight = await getLatestHeight() - k; 

  // get the stakes - but maybe move these dependencies up to index vs. payouts -> stakes and queries?
  let [stakers, totalStake] = getStakes(stakingPoolKey, globalSlotStart, slotsPerEpoch);

  console.log(`The pool total staking balance is ${totalStake}`);
  
  const blocks = await getBlocks(stakingPoolKey, minHeight, finalityHeight);

  blocks.forEach((block: Block) => {

    // Keep a log of all blocks we processed
    blocksIncluded.push(block.blockheight);

    if ( typeof(block.coinbase) === 'undefined' || block.coinbase == 0 ) {
      // TODO: confirm this is definitely true
      // no coinbase, don't need to do anything?
    } else {

      let sumEffectivePoolStakes = 0;
      let effectivePoolStakes: { [key: string]: number } = {};

      // Determine the supercharged weighting for the block
      // TODO: Should this be based on net fees, which is:
      // block.feeTransferToReceiver - block.feeTransferFromCoinbase
      // instead of txfees.
      let txFees = block.usercommandtransactionfees || 0;
      let superchargedWeighting = 1 + (1 / (1 + txFees / block.coinbase));

      // What are the rewards for the block
      let totalRewards = block.blockpayoutamount
      let totalPoolFees = Math.round(commissionRate * totalRewards);

      allBlocksTotalRewards += totalRewards;
      allBlocksTotalPoolFees += totalPoolFees;

      // TODO: Add checks & balances

      // Loop through our list of delegates to determine the weighting per block
      // Sense check the effective pool stakes must be at least equal to total_staking_balance and less than 2x
      // TODO: assert total_staking_balance <= sum_effective_pool_stakes <= 2 * total_staking_balance
      // TODO: need to handle rounding to elminate franctional nanomina

      // Determine the effective pool weighting based on sum of effective stakes
      stakers.forEach((staker: StakingKey) => {
        let superchargedContribution = (superchargedWeighting - 1) * staker.timedWeighting + 1;
        let effectiveStake = staker.stakingBalance * superchargedContribution;
        effectivePoolStakes[staker.publicKey] = effectiveStake;
        sumEffectivePoolStakes += effectiveStake;

        let effectivePoolWeighting = effectivePoolStakes[staker.publicKey] / sumEffectivePoolStakes;

        // This must be less than 1 or we have a major issue
        //TODO: assert effective_pool_weighting <= 1

        let blockTotal = Math.round(
          (totalRewards - totalPoolFees) * effectivePoolWeighting
        );
        staker.total += blockTotal;

        // Store this data in a structured format for later querying and for the payment script, handled seperately
        let storePayout = {
          publicKey: staker.publicKey,
          blockHeight: block.blockheight,
          stateHash: block.statehash,
          effectivePoolWeighting: effectivePoolWeighting,
          effectivePoolStakes: effectivePoolStakes[staker.publicKey],
          stakingBalance: staker.stakingBalance,
          sumEffectivePoolStakes: sumEffectivePoolStakes,
          superchargedWeighting: superchargedWeighting,
          dateTime: block.blockdatetime,
          coinbase: block.coinbase,
          totalRewards: totalRewards,
          payout: blockTotal,
        };
        //TODO: Store data 
      });
    }
  });

  console.log(`We won these blocks: ${blocksIncluded}`);
  console.log(`We are paying out based on total rewards of ${allBlocksTotalRewards} nanomina in this window.`);
  console.log(`That is ${allBlocksTotalRewards / 1000000000} mina`);
  console.log(`The Pool Fee is is ${allBlocksTotalPoolFees / 1000000000} mina`);
  console.log(`Total Payout should be ${(allBlocksTotalRewards ) - (allBlocksTotalPoolFees )} nanomina`)

  let payoutJson: { publicKey: string; total: number }[] = [];

  stakers.forEach((staker: StakingKey) => {
    payoutJson.push({
      publicKey: staker.publicKey,
      total: staker.total,
    });
  });
return payoutJson;
}
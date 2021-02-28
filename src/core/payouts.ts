import { Block, getBlocks, getLatestHeight } from "./queries";
import { getStakes, timedWeighting } from "./stakes";

export async function getPayouts(stakingPoolKey: string, minHeight: number, globalSlotStart: number, k: number, slotsPerEpoch: Number, commissionRate: Number) {

  // TODO: handle block range stuff (minheight to maxheight)
  const latestBlock = await getLatestHeight();
  
  // TODO: reinstate finality check for max height - temporarily removing k for testing 
  //const maxHeight = latestBlock - k;
  const maxHeight = latestBlock ;

  console.log(`This script will payout from blocks ${minHeight} to ${maxHeight}`);

  // Initialize some stuff
  let totalStakingBalance = 0;
  let payouts: {
    publicKey: string;
    total: number;
    stakingBalance: number;
    timedWeighting: number;
  }[] = [];
  let allBlocksTotalRewards = 0;
  let allBlocksTotalFees = 0;
  let blocksIncluded: any[] = [];

  // get the stakes
  let stakes = getStakes(stakingPoolKey);

  stakes.forEach((stake: any) => {
    const balance = +stake.balance;
    payouts.push({
      publicKey: stake.pk,
      total: 0,
      stakingBalance: balance,
      timedWeighting: timedWeighting(stake, globalSlotStart, slotsPerEpoch)
    });
    totalStakingBalance += balance;
  });

  console.log(`The pool total staking balance is ${totalStakingBalance}`);
  

  const blocks = await getBlocks(key, minHeight, maxHeight);

  // TODO: extract to 2-3 functions
  blocks.forEach((block: Block) => {
    // Keep a log of all blocks we processed
    blocksIncluded.push(block.blockheight);

    // TODO: check for no coinbase - if no coinbase, skip the block?
    let sumEffectivePoolStakes = 0;
    let effectivePoolStakes: { [key: string]: number } = {};

    // Determine the supercharged weighting for the block
    let txFees = block.usercommandtransactionfees || 0;
    let superchargedWeighting = 1 + 1 / (1 + txFees / block.coinbase);

    // What are the rewards for the block
    let totalRewards = block.blockpayoutamount
    let totalFees = commissionRate * totalRewards;

    console.log(`txfees: ${txFees}, superchargedWeighting: ${superchargedWeighting}, totalRewards: ${totalRewards}, totalFees: ${totalFees}, coinbase: ${block.coinbase}`);

    allBlocksTotalRewards += totalRewards;
    allBlocksTotalFees += totalFees;

    // #TODO this should match the fee transfer to the coinbase receiver. Add an assert it can't be larger.
    // #if "feeTransfer" not in b["transactions"]:
    // #    # Just coinbase so we can't pay out more than the coinbase. We also may have an orphaned block.
    // #    #assert total_rewards <= int(b["transactions"]["coinbase"])
    // #else:
    // #    # There were some fee transfers so let's _really_ make sure we don't pay out more than we received

    // Loop through our list of delegates to determine the weighting per block

    // TODO: need to handle rounding issues 

    payouts.forEach((payout: any) => {
      let superchargedContribution =
        (superchargedWeighting - 1) * payout.timedWeighting + 1;
      let effectiveStake = payout.stakingBalance * superchargedContribution;
      effectivePoolStakes[payout.publicKey] = effectiveStake;
      sumEffectivePoolStakes += effectiveStake;
    });

    // Sense check the effective pool stakes must be at least equal to total_staking_balance and less than 2x
    //TODO: assert total_staking_balance <= sum_effective_pool_stakes <= 2 * total_staking_balance

    // Determine the effective pool weighting based on sum of effective stakes
    payouts.forEach((payout: any) => {
      let effectivePoolWeighting =
        effectivePoolStakes[payout.publicKey] / sumEffectivePoolStakes;

        // This must be less than 1 or we have a major issue
      //TODO: assert effective_pool_weighting <= 1

      let blockTotal = Math.round(
        (totalRewards - totalFees) * effectivePoolWeighting
      );
      payout.total += blockTotal;

      // Store this data in a structured format for later querying and for the payment script, handled seperately
      let storePayout = {
        publicKey: payout.publicKey,
        blockHeight: block.blockheight,
        stateHash: block.statehash,
        effectivePoolWeighting: effectivePoolWeighting,
        effectivePoolStakes: effectivePoolStakes[payout.publicKey],
        stakingBalance: payout.stakingBalance,
        sumEffectivePoolStakes: sumEffectivePoolStakes,
        superchargedWeighting: superchargedWeighting,
        dateTime: block.blockdatetime,
        coinbase: block.coinbase,
        totalRewards: totalRewards,
        payout: blockTotal,
        epoch: stakingEpoch,
        chainId: chainId
      };
      //TODO: Store data 
    });
  });

  // ################################################################
  // # Print some helpful data to the screen
  // ################################################################

  console.log(`We won these blocks: ${blocksIncluded}`);

  console.log(
    `We are paying out ${allBlocksTotalRewards} nanomina in this window.`
  );

  console.log(`That is ${allBlocksTotalRewards} mina`);

  console.log(`Our fee is is ${allBlocksTotalFees} mina`);

  let payoutJson: { publicKey: string; total: number }[] = [];

  payouts.forEach((payout) => {
    payoutJson.push({
      publicKey: payout.publicKey,
      total: payout.total,
    });
  });

  console.log(payoutJson);
  return payoutJson;
}
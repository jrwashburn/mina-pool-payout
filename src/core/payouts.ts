import { Block, getBlocks, getLatestHeight } from "./queries";
import { StakingKey } from "./stakes";

export async function getPayouts(stakingPoolKey: string, minHeight: number, k: number, maximumHeight: number, stakers: StakingKey[], totalStake: number, commissionRate: number) {

  // Initialize some stuff
  let allBlocksTotalRewards = 0;
  let allBlocksTotalPoolFees = 0;
  let blocksIncluded: any[] = [];

  // Finality is understood to be max height minus k blocks. unsafe to process blocks above maxHeight since they could change if there is a long running, short-range fork
  // Alternatively, stop processing at maximum height if lower than finality
  // TODO: where does this really belong?
  let blockRangeMaximum = 0
  const finalityHeight = await getLatestHeight() - k;
  if (finalityHeight > maximumHeight) {
    blockRangeMaximum = maximumHeight;
  } else {
    blockRangeMaximum = finalityHeight;
  }

  console.log(`The pool total staking balance is ${totalStake}`);

  const blocks = await getBlocks(stakingPoolKey, minHeight, blockRangeMaximum);

  // for each block, calculate the effective stake of each staker based on 1) is the staker unlocked yet

  blocks.forEach((block: Block) => {

    // Keep a log of all blocks we processed
    blocksIncluded.push(block.blockheight);

    if (typeof (block.coinbase) === 'undefined' || block.coinbase == 0) {
      // TODO: confirm this is definitely true
      // no coinbase, don't need to do anything?
    } else {

      let sumEffectivePoolStakes = 0;
      let effectivePoolStakes: { [key: string]: number } = {};

      // Determine the supercharged discount for the block
      // TODO: Should this be based on net fees, which is:
      // block.feeTransferToReceiver - block.feeTransferFromCoinbase
      // instead of txfees.
      //
      //original py supercharged_weighting = 1 + ( 1 / (1 + int(b["txFees"]) / int(b["transactions"]["coinbase"])))

      let txFees = block.usercommandtransactionfees || 0;
      let superchargedWeightingDiscount = txFees / block.coinbase;

      //console.log(`superchargedWeighting: ${superchargedWeighting} = 1 + ( 1 / ( 1 + ${txFees} / ${block.coinbase} ) )`);

      // What are the rewards for the block
      let totalRewards = block.blockpayoutamount
      let totalPoolFees = commissionRate * totalRewards;

      allBlocksTotalRewards += totalRewards;
      allBlocksTotalPoolFees += totalPoolFees;

      // TODO: Add checks & balances

      // Loop through our list of delegates to determine the weighting per block
      // Sense check the effective pool stakes must be at least equal to total_staking_balance and less than 2x
      // TODO: assert total_staking_balance <= sum_effective_pool_stakes <= 2 * total_staking_balance
      // TODO: need to handle rounding to elminate franctional nanomina

      // Determine the effective pool weighting based on sum of effective stakes
      stakers.forEach((staker: StakingKey) => {
        let effectiveStake = 0;
        // if staker is unlocked, double their share (less discount for fees)
        // otherwise regular share
        if (block.globalslotsincegenesis > staker.untimedAfterSlot) {
          effectiveStake = (staker.stakingBalance * (2 - superchargedWeightingDiscount));
        } else {
          effectiveStake = staker.stakingBalance;
        }

        effectivePoolStakes[staker.publicKey] = effectiveStake;
        sumEffectivePoolStakes += effectiveStake;

        //console.log(`block: ${block.blockheight} key: ${staker.publicKey} stakingBalance: ${staker.stakingBalance} untimed: ${staker.untimedAfterSlot - block.globalslotsincegenesis} effectiveStake: ${effectiveStake} superchargedweightingDiscount: ${superchargedWeightingDiscount}`);
      });

      stakers.forEach((staker: StakingKey) => {
        let effectivePoolWeighting = effectivePoolStakes[staker.publicKey] / sumEffectivePoolStakes;

        // This must be less than 1 or we have a major issue
        // TODO: assert effective_pool_weighting <= 1
        // TODO: use 9 digits precision
        let blockTotal = Math.round(
          (totalRewards - totalPoolFees) * effectivePoolWeighting
        );
        staker.total += blockTotal;

        // Store this data in a structured format for later querying and for the payment script, handled seperately
        let storePayout = {
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
        };
        //console.log(storePayout);
      });
    }
  });

  console.log(`We won these blocks: ${blocksIncluded}`);
  console.log(`We are paying out based on total rewards of ${allBlocksTotalRewards} nanomina in this window.`);
  console.log(`That is ${allBlocksTotalRewards / 1000000000} mina`);
  console.log(`The Pool Fee is is ${allBlocksTotalPoolFees / 1000000000} mina`);
  console.log(`Total Payout should be ${(allBlocksTotalRewards) - (allBlocksTotalPoolFees)} nanomina`)

  let payoutJson: { publicKey: string; total: number }[] = [];

  stakers.forEach((staker: StakingKey) => {
    payoutJson.push({
      publicKey: staker.publicKey,
      total: staker.total,
    });
  });
  return payoutJson;
}

//TODO: Store data
// 1 - write storePayout to payout_details_[ccyymmddhhmmss]_[lastBlockHeight].json
// 2 - write payoutJson to payout_transactions_[ccyymmddhhmmss]_[lastBlockHeight].json
// 3 - write control file to log last block processed. payout_control.json format tbd. append-only {payoutDetails: hash, payoutTransactions: hash, lastBlockProcessed: blockHeight}
// control file should be based on command line flag
// calculate will run the process and generate the files - append DRAFT to filename after [lastBlockHeight]
// commit will run the process, hash the payoutjson, hash the storePayout file and save those to the control file along with the last block processed

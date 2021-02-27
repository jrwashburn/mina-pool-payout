import { Block, getBlocks, getLatestHeight } from "./core/queries";
import { getStakes } from "./core/stakes";

//TODO: Error handling
//TODO: Check mina vs nano calcs

async function main() {
  //TODO: Fail if any required values missing from .env
  //TODO: Use stakingEpoch and chainId?
  const key: string = process.env.MINA_KEY || "";
  const stakingEpoch = Number(process.env.STAKING_EPOCH);
  const globalSlotStart = Number(process.env.GLOBAL_SLOT_START);
  //const chainId = Number(process.env.CHAIN_ID); // can be multiple epoch if hard fork - TODO this should use staking ledger hash
  const minHeight = Number(process.env.MIN_HEIGHT); // This can be the last known payout or this could be a starting date

  //TODO: Get K programatically
  const k = Number(process.env.K);
  const slotsPerEpoch = Number(process.env.SLOTS_PER_EPOCH);
  const commissionRate = Number(process.env.COMMISSION_RATE);

  // TODO: handle block range stuff (minheight to maxheight)
  const latestBlock = await getLatestHeight();
  const maxHeight = latestBlock - k;

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
  let stakes = getStakes(key);

  stakes.forEach((stake: any) => {
    const balance = +stake.balance;
    payouts.push({
      publicKey: stake.pk,
      total: 0,
      stakingBalance: balance,
      timedWeighting: timedWeighting(stake, globalSlotStart, slotsPerEpoch),
    });
    totalStakingBalance += balance;
  });

  console.log(`The pool total staking balance is ${totalStakingBalance}`);

  const blocks = await getBlocks(key, minHeight, maxHeight);
  blocks.forEach((block: Block) => {
    // Keep a log of all blocks we processed
    blocksIncluded.push(block.blockheight);

    let sumEffectivePoolStakes = 0;
    let effectivePoolStakes: { [key: string]: number } = {};

    // Determine the supercharged weighting for the block
    let txFees = block.usercommandtransactionfees || 0;
    let superchargedWeighting = 1 + 1 / (1 + txFees / block.coinbase);

    // What are the rewards for the block
    let totalRewards = block.blockpayoutamount
    let totalFees = commissionRate * totalRewards;

    allBlocksTotalRewards += totalRewards;
    allBlocksTotalFees += totalFees;

    // #TODO this should match the fee transfer to the coinbase receiver. Add an assert it can't be larger.
    // #if "feeTransfer" not in b["transactions"]:
    // #    # Just coinbase so we can't pay out more than the coinbase. We also may have an orphaned block.
    // #    #assert total_rewards <= int(b["transactions"]["coinbase"])
    // #else:
    // #    # There were some fee transfers so let's _really_ make sure we don't pay out more than we received

    // Loop through our list of delegates to determine the weighting per block

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
        //chainId: chainId,
      };
    };
      //TODO: Store data 
    });
  };

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
}

function timedWeighting(
  ledger: any,
  globalSlotStart: number,
  slotsPerEpoch: number
): number {
  // Takes in a staking ledger and determines the timed factor for the account

  //console.log(ledger);
  return 1;
  /*
if (!ledger.timing) {
    // Untimed for full epoch so we have the maximum weighting of 1
    return 1;
  } else {
    // This is timed at the end of the epoch so we always return 0
    if (ledger.timing.timed_epoch_end) {
      return 0;
    } else {
      // This must be timed for only a portion of the epoch
      let timedEnd = ledger.timing.untimed_slot;
      let globalSlotEnd = globalSlotStart + slotsPerEpoch;
      // Need to get the global slot start and end of the epoch
      return (globalSlotEnd - timedEnd / slotsPerEpoch);
    }
  }
  */
}

main();

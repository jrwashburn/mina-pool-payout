import 'reflect-metadata';
import { KeyedRate } from '../../src/configuration/Model.js';
import { Stake } from '../../src/core/dataProvider/dataprovider-types.js';
import { PayoutCalculator } from '../../src/core/payoutCalculator/PayoutCalculator.js';
import {
  DEFAULT_BP_HASH,
  DEFAULT_MEMO,
  MINA,
  buildBlock,
  buildStake,
  cloneStakes,
  defaultBurnAddress,
  noRates,
} from './helpers.js';

describe('PayoutCalculator (regular scenarios)', () => {
  const defaultRates = {
    defaultCommissionRate: 0.1,
    mfCommissionRate: 0.15,
    o1CommissionRate: 0.12,
    investorsCommissionRate: 0.05,
  };

  const runCalculator = (
    blocks = [buildBlock()],
    stakes = [buildStake({ publicKey: 'default', balance: 100, locked: true })],
    commissionRates: KeyedRate = noRates,
    burnRates: KeyedRate = noRates,
    totalStake = stakes.reduce((sum, stake) => sum + stake.stakingBalance, 0),
  ) => {
    const calculator = new PayoutCalculator();
    const normalizedBlocks = blocks.map((block) =>
      stakes.some((stake) => stake.publicKey === block.winnerpublickey)
        ? block
        : { ...block, winnerpublickey: stakes[0].publicKey },
    );

    return calculator.getPayouts(
      normalizedBlocks,
      cloneStakes(stakes),
      totalStake,
      defaultRates.defaultCommissionRate,
      defaultRates.mfCommissionRate,
      defaultRates.o1CommissionRate,
      defaultRates.investorsCommissionRate,
      commissionRates,
      burnRates,
      defaultBurnAddress,
      DEFAULT_BP_HASH,
      DEFAULT_MEMO,
    );
  };

  it('splits common pool rewards evenly between locked stakers', async () => {
    const alice = buildStake({ publicKey: 'alice', balance: 100, locked: true });
    const bob = buildStake({ publicKey: 'bob', balance: 100, locked: true });
    const blockA = buildBlock({
      blockheight: 10,
      blockdatetime: 1,
      globalslotsincegenesis: 50,
      statehash: 'state-A',
      feetransfertoreceiver: 0.1 * MINA,
    });
    const blockB = buildBlock({
      blockheight: 11,
      blockdatetime: 2,
      globalslotsincegenesis: 60,
      statehash: 'state-B',
      feetransfertoreceiver: 0.3 * MINA,
    });

    const [transactions, details, heights, totalPayout, totalSupercharged, totalBurn] = await runCalculator(
      [blockA, blockB],
      [alice, bob],
    );

    const expectedPerBlock = [324045000000, 324135000000];
    const expectedAmount = expectedPerBlock.reduce((sum, value) => sum + value, 0);

    expect(transactions).toStrictEqual([
      {
        publicKey: 'alice',
        amount: expectedAmount,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_MEMO,
        summaryGroup: 0,
      },
      {
        publicKey: 'bob',
        amount: expectedAmount,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_MEMO,
        summaryGroup: 0,
      },
    ]);

    expect(details).toStrictEqual([
      {
        publicKey: 'alice',
        owner: '',
        blockHeight: 10,
        globalSlot: 50,
        publicKeyUntimedAfter: 999999,
        winnerShareOwner: '',
        shareClass: { shareClass: 'Common', shareOwner: '' },
        stateHash: 'state-A',
        effectiveNPSPoolWeighting: 0.5,
        effectiveNPSPoolStakes: 100,
        effectiveCommonPoolWeighting: 0.5,
        effectiveCommonPoolStakes: 100,
        effectiveSuperchargedPoolWeighting: 0,
        effectiveSuperchargedPoolStakes: 0,
        stakingBalance: 100,
        sumEffectiveNPSPoolStakes: 200,
        sumEffectiveCommonPoolStakes: 200,
        sumEffectiveSuperchargedPoolStakes: 0,
        superchargedWeightingDiscount: 0,
        dateTime: 1,
        coinbase: 720 * MINA,
        totalRewards: 720 * MINA + 0.1 * MINA,
        totalRewardsToBurn: 0,
        totalRewardsNPSPool: 720 * MINA,
        totalRewardsCommonPool: 0.1 * MINA,
        totalRewardsSuperchargedPool: 0,
        payout: expectedPerBlock[0],
        isEffectiveSuperCharge: false,
      },
      {
        publicKey: 'bob',
        owner: '',
        blockHeight: 10,
        globalSlot: 50,
        publicKeyUntimedAfter: 999999,
        winnerShareOwner: '',
        shareClass: { shareClass: 'Common', shareOwner: '' },
        stateHash: 'state-A',
        effectiveNPSPoolWeighting: 0.5,
        effectiveNPSPoolStakes: 100,
        effectiveCommonPoolWeighting: 0.5,
        effectiveCommonPoolStakes: 100,
        effectiveSuperchargedPoolWeighting: 0,
        effectiveSuperchargedPoolStakes: 0,
        stakingBalance: 100,
        sumEffectiveNPSPoolStakes: 200,
        sumEffectiveCommonPoolStakes: 200,
        sumEffectiveSuperchargedPoolStakes: 0,
        superchargedWeightingDiscount: 0,
        dateTime: 1,
        coinbase: 720 * MINA,
        totalRewards: 720 * MINA + 0.1 * MINA,
        totalRewardsToBurn: 0,
        totalRewardsNPSPool: 720 * MINA,
        totalRewardsCommonPool: 0.1 * MINA,
        totalRewardsSuperchargedPool: 0,
        payout: expectedPerBlock[0],
        isEffectiveSuperCharge: false,
      },
      {
        publicKey: 'alice',
        owner: '',
        blockHeight: 11,
        globalSlot: 60,
        publicKeyUntimedAfter: 999999,
        winnerShareOwner: '',
        shareClass: { shareClass: 'Common', shareOwner: '' },
        stateHash: 'state-B',
        effectiveNPSPoolWeighting: 0.5,
        effectiveNPSPoolStakes: 100,
        effectiveCommonPoolWeighting: 0.5,
        effectiveCommonPoolStakes: 100,
        effectiveSuperchargedPoolWeighting: 0,
        effectiveSuperchargedPoolStakes: 0,
        stakingBalance: 100,
        sumEffectiveNPSPoolStakes: 200,
        sumEffectiveCommonPoolStakes: 200,
        sumEffectiveSuperchargedPoolStakes: 0,
        superchargedWeightingDiscount: 0,
        dateTime: 2,
        coinbase: 720 * MINA,
        totalRewards: 720 * MINA + 0.3 * MINA,
        totalRewardsToBurn: 0,
        totalRewardsNPSPool: 720 * MINA,
        totalRewardsCommonPool: 0.3 * MINA,
        totalRewardsSuperchargedPool: 0,
        payout: expectedPerBlock[1],
        isEffectiveSuperCharge: false,
      },
      {
        publicKey: 'bob',
        owner: '',
        blockHeight: 11,
        globalSlot: 60,
        publicKeyUntimedAfter: 999999,
        winnerShareOwner: '',
        shareClass: { shareClass: 'Common', shareOwner: '' },
        stateHash: 'state-B',
        effectiveNPSPoolWeighting: 0.5,
        effectiveNPSPoolStakes: 100,
        effectiveCommonPoolWeighting: 0.5,
        effectiveCommonPoolStakes: 100,
        effectiveSuperchargedPoolWeighting: 0,
        effectiveSuperchargedPoolStakes: 0,
        stakingBalance: 100,
        sumEffectiveNPSPoolStakes: 200,
        sumEffectiveCommonPoolStakes: 200,
        sumEffectiveSuperchargedPoolStakes: 0,
        superchargedWeightingDiscount: 0,
        dateTime: 2,
        coinbase: 720 * MINA,
        totalRewards: 720 * MINA + 0.3 * MINA,
        totalRewardsToBurn: 0,
        totalRewardsNPSPool: 720 * MINA,
        totalRewardsCommonPool: 0.3 * MINA,
        totalRewardsSuperchargedPool: 0,
        payout: expectedPerBlock[1],
        isEffectiveSuperCharge: false,
      },
    ]);

    expect(heights).toStrictEqual([10, 11]);
    expect(totalPayout).toBe(expectedAmount * 2);
    expect(totalSupercharged).toBe(0);
    expect(totalBurn).toBe(0);
  });

  it('applies negotiated commission overrides by public key', async () => {
    const weighted = [
      buildStake({ publicKey: 'minority', balance: 200, locked: true }),
      buildStake({ publicKey: 'majority', balance: 800, locked: true }),
    ];

    const commissionRates: KeyedRate = {
      majority: { rate: 0.2 },
    };

    const [transactions] = await runCalculator([buildBlock({ blockheight: 8 })], weighted, commissionRates);

    expect(transactions).toStrictEqual([
      {
        publicKey: 'minority',
        amount: 129600000000,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_MEMO,
        summaryGroup: 0,
      },
      {
        publicKey: 'majority',
        amount: 460800000000,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_MEMO,
        summaryGroup: 0,
      },
    ]);
  });

  it('calculates payouts for common and NPS share classes simultaneously', async () => {
    const common = buildStake({ publicKey: 'common', balance: 400, locked: true });
    const mf = buildStake({ publicKey: 'mf', balance: 300, shareClass: 'NPS', shareOwner: 'MF', locked: true });
    const o1 = buildStake({ publicKey: 'o1', balance: 200, shareClass: 'NPS', shareOwner: 'O1', locked: true });
    const invest = buildStake({
      publicKey: 'invest',
      balance: 100,
      shareClass: 'NPS',
      shareOwner: 'INVEST',
      locked: true,
    });

    const block = buildBlock({
      blockheight: 20,
      blockdatetime: 3,
      globalslotsincegenesis: 70,
      feetransfertoreceiver: 0.18 * MINA,
      statehash: 'state-mixed',
    });

    const [transactions] = await runCalculator([block], [common, mf, o1, invest]);

    expect(transactions).toStrictEqual([
      {
        publicKey: 'common',
        amount: 259362000000,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_MEMO,
        summaryGroup: 0,
      },
      {
        publicKey: 'mf',
        amount: 183600000000,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_BP_HASH,
        summaryGroup: 0,
      },
      {
        publicKey: 'o1',
        amount: 126720000000,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_MEMO,
        summaryGroup: 0,
      },
      {
        publicKey: 'invest',
        amount: 68400000000,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_BP_HASH,
        summaryGroup: 0,
      },
    ]);
  });

  it('applies negotiated burn rates correctly', async () => {
    const staker = buildStake({ publicKey: 'high-commission', balance: 500, locked: true });
    const burnRates: KeyedRate = {
      'high-commission': { rate: 0.5 },
    };

    const [transactions, details, heights, totalPayout, totalSupercharged, totalBurn] = await runCalculator(
      [buildBlock({ blockheight: 30 })],
      [staker],
      noRates,
      burnRates,
    );

    expect(transactions).toStrictEqual([
      {
        publicKey: 'high-commission',
        amount: 324000000000,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_MEMO,
        summaryGroup: 0,
      },
      {
        publicKey: 'B62qiburnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmp7r7UN6X',
        amount: 324000000000,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_MEMO,
        summaryGroup: 2,
      },
    ]);
    expect(details.some((detail) => detail.shareClass.shareClass === 'BURN')).toBe(true);
    expect(totalPayout).toBe(324000000000);
    expect(totalSupercharged).toBe(0);
    expect(totalBurn).toBe(324000000000);
    expect(heights).toStrictEqual([30]);
  });

  it('throws when totalStake does not match the sum of staker balances', async () => {
    await expect(
      runCalculator(
        [buildBlock()],
        [buildStake({ publicKey: 'a', balance: 100, locked: true }), buildStake({ publicKey: 'b', balance: 50, locked: true })],
        noRates,
        noRates,
        10,
      ),
    ).rejects.toThrow('NPS Share must be equal to total staked amount');
  });

  it('throws when encountering unsupported share classes', async () => {
    const invalidStake: Stake = {
      publicKey: 'vip',
      total: 0,
      stakingBalance: 100,
      untimedAfterSlot: 0,
      shareClass: { shareClass: 'VIP' as unknown as 'Common', shareOwner: '' },
      totalToBurn: 0,
    };

    await expect(runCalculator([buildBlock()], [invalidStake])).rejects.toThrow(
      'Shares should be common or non-participating. Found shares with other shareClass.',
    );
  });
});

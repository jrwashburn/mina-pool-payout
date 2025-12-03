import 'reflect-metadata';
import { KeyedRate } from '../../src/configuration/Model';
import { Block, Stake } from '../../src/core/dataProvider/dataprovider-types';
import { PayoutCalculator } from '../../src/core/payoutCalculator/PayoutCalculator';
import { PayoutCalculatorIsolateSuperCharge } from '../../src/core/payoutCalculator/PayoutCalculatorIsolateSuperCharge';
import { PayoutCalculatorPostSuperChargeCommonShareFees } from '../../src/core/payoutCalculator/PayoutCalculatorPostSuperChargeCommonShareFees';
import { PayoutCalculatorPostSuperChargeKeepFees } from '../../src/core/payoutCalculator/PayoutCalculatorPostSuperChargeKeepFees';
import { PayoutCalculatorPostSuperChargeShareFees } from '../../src/core/payoutCalculator/PayoutCalculatorPostSuperChargeShareFees';
import {
  DEFAULT_BP_HASH,
  DEFAULT_MEMO,
  MINA,
  buildBlock,
  buildStake,
  cloneStakes,
  defaultBurnAddress,
  noRates,
} from './helpers';

const FORK_ONE_RATES = {
  defaultCommissionRate: 0.1,
  mfCommissionRate: 0.15,
  o1CommissionRate: 0.12,
  investorsCommissionRate: 0.05,
};

const FORK_ZERO_RATES = {
  defaultCommissionRate: 0.1,
  mfCommissionRate: 0.08,
  o1CommissionRate: 0.05,
  investorsCommissionRate: 0.08,
};

const runPostForkCalculator = (
  calculator:
    | PayoutCalculatorPostSuperChargeShareFees
    | PayoutCalculatorPostSuperChargeKeepFees
    | PayoutCalculatorPostSuperChargeCommonShareFees,
  blocks: Block[],
  stakes: Stake[],
  commissionRates: KeyedRate = noRates,
) =>
  calculator.getPayouts(
    blocks,
    cloneStakes(stakes),
    stakes.reduce((sum, stake) => sum + stake.stakingBalance, 0),
    FORK_ONE_RATES.defaultCommissionRate,
    FORK_ONE_RATES.mfCommissionRate,
    FORK_ONE_RATES.o1CommissionRate,
    FORK_ONE_RATES.investorsCommissionRate,
    commissionRates,
    noRates,
    defaultBurnAddress,
    DEFAULT_BP_HASH,
    DEFAULT_MEMO,
  );

describe('PayoutCalculator variants', () => {
  it('post super charge (share fees) distributes transaction fees proportionally', async () => {
    const blocks = [
      buildBlock({
        blockheight: 90,
        feetransfertoreceiver: 0.5 * MINA,
      }),
    ];
    const stakes = [buildStake({ publicKey: 'one', balance: 100 }), buildStake({ publicKey: 'three', balance: 300 })];

    const calculator = new PayoutCalculatorPostSuperChargeShareFees(1);

    const [transactions] = await runPostForkCalculator(calculator, blocks, stakes);

    expect(transactions).toStrictEqual([
      {
        publicKey: 'one',
        amount: 162112500000,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_MEMO,
        summaryGroup: 0,
      },
      {
        publicKey: 'three',
        amount: 486337500000,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_MEMO,
        summaryGroup: 0,
      },
    ]);
  });

  it('post super charge (keep fees) excludes fee transfers from the pool reward', async () => {
    const blocks = [
      buildBlock({
        blockheight: 91,
        feetransfertoreceiver: 0.5 * MINA,
      }),
    ];
    const stakes = [buildStake({ publicKey: 'one', balance: 100 }), buildStake({ publicKey: 'three', balance: 300 })];

    const shareFeesCalculator = new PayoutCalculatorPostSuperChargeShareFees(1);
    const keepFeesCalculator = new PayoutCalculatorPostSuperChargeKeepFees(1);

    const [shareFeeTransactions] = await runPostForkCalculator(shareFeesCalculator, blocks, stakes);
    const [keepFeeTransactions] = await runPostForkCalculator(keepFeesCalculator, blocks, stakes);

    expect(keepFeeTransactions).toStrictEqual([
      {
        publicKey: 'one',
        amount: 162000000000,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_MEMO,
        summaryGroup: 0,
      },
      {
        publicKey: 'three',
        amount: 486000000000,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_MEMO,
        summaryGroup: 0,
      },
    ]);

    expect(shareFeeTransactions[0].amount - keepFeeTransactions[0].amount).toBe(112500000);
    expect(shareFeeTransactions[1].amount - keepFeeTransactions[1].amount).toBe(337500000);
  });

  it('post super charge (common share fees) shares fee transfers with common stakers only', async () => {
    const common = buildStake({ publicKey: 'common', balance: 200 });
    const mf = buildStake({ publicKey: 'mf', balance: 200, shareClass: 'NPS', shareOwner: 'MF' });
    const blocks = [
      buildBlock({
        blockheight: 92,
        feetransfertoreceiver: 0.4 * MINA,
      }),
    ];
    const calculator = new PayoutCalculatorPostSuperChargeCommonShareFees(1);

    const [transactions] = await runPostForkCalculator(calculator, blocks, [common, mf]);

    expect(transactions).toStrictEqual([
      {
        publicKey: 'common',
        amount: 324360000000,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_MEMO,
        summaryGroup: 0,
      },
      {
        publicKey: 'mf',
        amount: 306000000000,
        fee: 0,
        amountMina: 0,
        feeMina: 0,
        memo: DEFAULT_BP_HASH,
        summaryGroup: 0,
      },
    ]);
  });

  it('isolate super charge matches the original payout calculator for regular blocks', async () => {
    const blocks = [
      buildBlock({
        blockheight: 100,
        feetransfertoreceiver: 0.2 * MINA,
        winnerpublickey: 'a',
      }),
    ];
    const stakes = [
      buildStake({ publicKey: 'a', balance: 500, locked: true }),
      buildStake({ publicKey: 'b', balance: 500, locked: true }),
    ];

    const original = new PayoutCalculator();
    const isolate = new PayoutCalculatorIsolateSuperCharge();

    const originalResult = await original.getPayouts(
      blocks,
      cloneStakes(stakes),
      1000,
      FORK_ZERO_RATES.defaultCommissionRate,
      FORK_ZERO_RATES.mfCommissionRate,
      FORK_ZERO_RATES.o1CommissionRate,
      FORK_ZERO_RATES.investorsCommissionRate,
      noRates,
      noRates,
      defaultBurnAddress,
      DEFAULT_BP_HASH,
      DEFAULT_MEMO,
    );

    const isolateResult = await isolate.getPayouts(
      blocks,
      cloneStakes(stakes),
      1000,
      FORK_ZERO_RATES.defaultCommissionRate,
      FORK_ZERO_RATES.mfCommissionRate,
      FORK_ZERO_RATES.o1CommissionRate,
      FORK_ZERO_RATES.investorsCommissionRate,
      noRates,
      noRates,
      defaultBurnAddress,
      DEFAULT_BP_HASH,
      DEFAULT_MEMO,
    );

    expect(isolateResult[0]).toStrictEqual(originalResult[0]);
    expect(isolateResult[1].length).toBe(originalResult[1].length);
    expect(isolateResult[3]).toBe(originalResult[3]);
  });

  describe('fork 2 (Mesa) support', () => {
    it('accepts 360 MINA coinbase for fork 2', async () => {
      const blocks = [
        buildBlock({
          blockheight: 200,
          coinbase: 360 * MINA,
          feetransfertoreceiver: 0.5 * MINA,
        }),
      ];
      const stakes = [buildStake({ publicKey: 'one', balance: 100 }), buildStake({ publicKey: 'two', balance: 100 })];

      const calculator = new PayoutCalculatorPostSuperChargeShareFees(2);

      const [transactions] = await runPostForkCalculator(calculator, blocks, stakes);

      expect(transactions.length).toBe(2);
      expect(transactions[0].publicKey).toBe('one');
      expect(transactions[1].publicKey).toBe('two');
    });

    it('rejects 720 MINA coinbase for fork 2', async () => {
      const blocks = [
        buildBlock({
          blockheight: 201,
          coinbase: 720 * MINA,
        }),
      ];
      const stakes = [buildStake({ publicKey: 'one', balance: 100 })];

      const calculator = new PayoutCalculatorPostSuperChargeShareFees(2);

      await expect(runPostForkCalculator(calculator, blocks, stakes)).rejects.toThrow(
        'Coinbase must be equal to 360000000000 for fork 2 but is 720000000000',
      );
    });

    it('calculates correct payout amounts for 360 MINA (50% of fork 1)', async () => {
      const blocks = [
        buildBlock({
          blockheight: 202,
          coinbase: 360 * MINA,
          feetransfertoreceiver: 0,
        }),
      ];
      const stakes = [buildStake({ publicKey: 'one', balance: 100 }), buildStake({ publicKey: 'three', balance: 300 })];

      const fork1Calculator = new PayoutCalculatorPostSuperChargeShareFees(1);
      const fork2Calculator = new PayoutCalculatorPostSuperChargeShareFees(2);

      const [fork1Transactions] = await runPostForkCalculator(
        fork1Calculator,
        [buildBlock({ blockheight: 202, coinbase: 720 * MINA, feetransfertoreceiver: 0 })],
        stakes,
      );
      const [fork2Transactions] = await runPostForkCalculator(fork2Calculator, blocks, stakes);

      expect(fork2Transactions[0].amount).toBe(fork1Transactions[0].amount / 2);
      expect(fork2Transactions[1].amount).toBe(fork1Transactions[1].amount / 2);
    });

    it('all three calculator types work with fork 2', async () => {
      const blocks = [
        buildBlock({
          blockheight: 203,
          coinbase: 360 * MINA,
          feetransfertoreceiver: 0.2 * MINA,
        }),
      ];
      const stakes = [buildStake({ publicKey: 'one', balance: 200 }), buildStake({ publicKey: 'two', balance: 200 })];

      const shareFeesCalculator = new PayoutCalculatorPostSuperChargeShareFees(2);
      const keepFeesCalculator = new PayoutCalculatorPostSuperChargeKeepFees(2);
      const commonShareFeesCalculator = new PayoutCalculatorPostSuperChargeCommonShareFees(2);

      const [shareFeeTransactions] = await runPostForkCalculator(shareFeesCalculator, blocks, stakes);
      const [keepFeeTransactions] = await runPostForkCalculator(keepFeesCalculator, blocks, stakes);
      const [commonShareFeeTransactions] = await runPostForkCalculator(commonShareFeesCalculator, blocks, stakes);

      expect(shareFeeTransactions.length).toBe(2);
      expect(keepFeeTransactions.length).toBe(2);
      expect(commonShareFeeTransactions.length).toBe(2);

      expect(shareFeeTransactions[0].amount).toBeGreaterThan(keepFeeTransactions[0].amount);
      expect(shareFeeTransactions[1].amount).toBeGreaterThan(keepFeeTransactions[1].amount);
    });
  });
});

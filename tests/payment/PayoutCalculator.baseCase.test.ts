import 'reflect-metadata';
import { epoch71Fixture } from './fixtures/epoch-71-isolateSuperCharge.js';
import { epoch34PostSuperchargeFixture } from './fixtures/epoch-34-postSuperChargeCommon.js';
import { epoch34PostSuperchargeKeepFeesFixture } from './fixtures/epoch-34-postSuperChargeKeepFees.js';
import { epoch34PostSuperchargeShareFeesFixture } from './fixtures/epoch-34-postSuperChargeShareFees.js';
import { cloneStakes, sortTransactionsByAmount, summarizeTransactions } from './helpers.js';
import { PayoutCalculatorFactory } from '../../src/core/payoutCalculator/PayoutCalculatorFactory.js';
import { IPayoutCalculator } from '../../src/core/payoutCalculator/Model.js';

type RegressionFixture = typeof epoch71Fixture;

type RegressionScenario = {
  name: string;
  fixture: RegressionFixture;
  buildCalculator: (factory: PayoutCalculatorFactory) => IPayoutCalculator;
};

const regressionScenarios: RegressionScenario[] = [
  {
    name: 'epoch 71 (fork 0) - isolateSuperCharge',
    fixture: epoch71Fixture,
    buildCalculator: (factory) => factory.build(0, epoch71Fixture.payoutCalculator),
  },
  {
    name: 'epoch 34 (fork 1) - postSuperChargeCommonShareFees',
    fixture: epoch34PostSuperchargeFixture,
    buildCalculator: (factory) => factory.build(1, epoch34PostSuperchargeFixture.payoutCalculator),
  },
  {
    name: 'epoch 34 (fork 1) - postSuperChargeKeepFees',
    fixture: epoch34PostSuperchargeKeepFeesFixture,
    buildCalculator: (factory) => factory.build(1, epoch34PostSuperchargeKeepFeesFixture.payoutCalculator),
  },
  {
    name: 'epoch 34 (fork 1) - postSuperChargeShareFees',
    fixture: epoch34PostSuperchargeShareFeesFixture,
    buildCalculator: (factory) => factory.build(1, epoch34PostSuperchargeShareFeesFixture.payoutCalculator),
  },
];

describe('PayoutCalculator regression fixtures', () => {
  const calculatorFactory = new PayoutCalculatorFactory();

  for (const { name, fixture, buildCalculator } of regressionScenarios) {
    it(`${name} matches the historical payout distribution`, async () => {
      const calculator = buildCalculator(calculatorFactory);

      const [transactions, , heights, totalPayout, totalSupercharged, totalNegotiatedBurn] = await calculator.getPayouts(
        fixture.blocks,
        cloneStakes(fixture.stakers),
        fixture.totalStake,
        fixture.defaultCommissionRate,
        fixture.mfCommissionRate,
        fixture.o1CommissionRate,
        fixture.investorsCommissionRate,
        fixture.commissionRates,
        fixture.burnRates,
        fixture.burnAddress,
        fixture.bpKeyMd5Hash,
        fixture.payoutMemo,
      );

      const sortedActual = summarizeTransactions(sortTransactionsByAmount(transactions));
      const sortedExpected = [...fixture.expectedTransactions].sort((a, b) => {
        if (a.amount === b.amount) {
          return a.publicKey.localeCompare(b.publicKey);
        }
        return b.amount - a.amount;
      });

      expect(sortedActual).toStrictEqual(sortedExpected);
      expect(heights).toStrictEqual(fixture.expectedBlockHeights);
      expect(totalPayout).toBe(fixture.expectedTotalPayout);
      expect(totalSupercharged).toBe(0);
      expect(totalNegotiatedBurn).toBe(0);
    });
  }
});

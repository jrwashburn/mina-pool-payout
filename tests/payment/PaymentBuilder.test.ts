import './test-env';
import 'reflect-metadata';
import { ConfigurationManager } from '../../src/configuration/ConfigurationManager';
import { PaymentConfiguration } from '../../src/configuration/Model';
import { Block, Stake } from '../../src/core/dataProvider/dataprovider-types';
import { IBlockDataProvider, IDataProviderFactory, IStakeDataProvider } from '../../src/core/dataProvider/Models';
import { IPayoutCalculator, IPayoutCalculatorFactory } from '../../src/core/payoutCalculator/Model';
import { PaymentBuilder } from '../../src/core/payment/PaymentBuilder';
import { IBlockProcessor } from '../../src/core/payment/Model';
import { buildBlock, buildStake, defaultBurnAddress, DEFAULT_BP_HASH, DEFAULT_MEMO } from './helpers';

const makeConfig = (): PaymentConfiguration => ({
  blockDataSource: 'API',
  bpKeyMd5Hash: DEFAULT_BP_HASH,
  burnAddress: defaultBurnAddress,
  burnRatesByPublicKey: {},
  commissionRatesByPublicKey: {},
  configuredMaximum: 200,
  defaultCommissionRate: 0.1,
  doNotTransmit: false,
  doNotSaveTransactionDetails: false,
  epoch: 0,
  fork: 0,
  investorsCommissionRate: 0.05,
  mfCommissionRate: 0.15,
  minimumConfirmations: 15,
  minimumHeight: 100,
  o1CommissionRate: 0.12,
  payoutHash: '',
  payoutMemo: DEFAULT_MEMO,
  payorSendTransactionFee: 0,
  payoutThreshold: 0,
  senderKeys: { privateKey: '', publicKey: '' },
  slotsInEpoch: 0,
  stakingPoolPublicKey: 'POOL',
  verbose: false,
  payoutCalculator: 'original',
});

const createBuilder = (
  overrides: Partial<{
    blockProcessor: IBlockProcessor;
    payoutCalculator: IPayoutCalculator;
    blockProvider: IBlockDataProvider;
    stakeProvider: IStakeDataProvider;
  }> = {},
) => {
  const blockProcessor: IBlockProcessor = overrides.blockProcessor ?? {
    determineLastBlockHeightToProcess: jest.fn().mockResolvedValue(350),
  };

  const payoutCalculator: IPayoutCalculator = overrides.payoutCalculator ?? {
    getPayouts: jest.fn().mockResolvedValue([
      [],
      [],
      [],
      0,
      0,
      0,
    ]),
  };

  const blockProvider: IBlockDataProvider = overrides.blockProvider ?? {
    getLatestHeight: jest.fn().mockResolvedValue(400),
    getBlocks: jest.fn().mockResolvedValue([buildBlock({ blockheight: 150, stakingledgerhash: 'ledger' })]),
    getMinMaxBlocksByEpoch: jest.fn(),
  };

  const stakeProvider: IStakeDataProvider = overrides.stakeProvider ?? {
    getStakes: jest.fn().mockResolvedValue({
      stakes: [buildStake({ publicKey: 'delegate', balance: 100 })],
      totalStakingBalance: 100,
    }),
  };

  const payoutCalculatorFactory: IPayoutCalculatorFactory<IPayoutCalculator> = {
    build: jest.fn().mockReturnValue(payoutCalculator),
  };

  const blockProviderFactory: IDataProviderFactory<IBlockDataProvider> = {
    build: jest.fn().mockReturnValue(blockProvider),
  };

  const stakeProviderFactory: IDataProviderFactory<IStakeDataProvider> = {
    build: jest.fn().mockReturnValue(stakeProvider),
  };

  return {
    builder: new PaymentBuilder(blockProcessor, payoutCalculatorFactory, blockProviderFactory, stakeProviderFactory),
    blockProcessor,
    payoutCalculator,
    payoutCalculatorFactory,
    blockProvider,
    blockProviderFactory,
    stakeProvider,
    stakeProviderFactory,
  };
};

describe('PaymentBuilder', () => {
  beforeEach(() => {
    ConfigurationManager.Setup = makeConfig();
  });

  it('orchestrates dependencies with the configured arguments', async () => {
    const blocks: Block[] = [
      buildBlock({ blockheight: 120, stakingledgerhash: 'ledger-a' }),
      buildBlock({ blockheight: 130, stakingledgerhash: 'ledger-a' }),
    ];

    const blockProvider: IBlockDataProvider = {
      getLatestHeight: jest.fn().mockResolvedValue(310),
      getBlocks: jest.fn().mockResolvedValue(blocks),
      getMinMaxBlocksByEpoch: jest.fn(),
    };

    const stakeProvider: IStakeDataProvider = {
      getStakes: jest.fn().mockResolvedValue({
        stakes: [buildStake({ publicKey: 'delegate', balance: 200 })],
        totalStakingBalance: 200,
      }),
    };

    const payoutCalculator: IPayoutCalculator = {
      getPayouts: jest.fn().mockResolvedValue([[], [], [], 0, 0, 0]),
    };

    const blockProcessor: IBlockProcessor = {
      determineLastBlockHeightToProcess: jest.fn().mockResolvedValue(305),
    };

    const {
      builder,
      payoutCalculatorFactory,
      blockProviderFactory,
      stakeProviderFactory,
    } = createBuilder({ blockProcessor, blockProvider, stakeProvider, payoutCalculator });

    await builder.build();

    expect(blockProcessor.determineLastBlockHeightToProcess).toHaveBeenCalledWith(
      200,
      15,
      310,
    );
    expect(blockProviderFactory.build).toHaveBeenCalledWith('API');
    expect(stakeProviderFactory.build).toHaveBeenCalledWith('API');
    expect(blockProvider.getBlocks).toHaveBeenCalledWith('POOL', 100, 305);
    expect(stakeProvider.getStakes).toHaveBeenCalledWith('ledger-a', 'POOL');
    expect(payoutCalculatorFactory.build).toHaveBeenCalledWith(0, 'original');
    expect(payoutCalculator.getPayouts).toHaveBeenCalledTimes(1);
  });

  it('returns a payment process that reflects the calculator output', async () => {
    const unsortedBlocks: Block[] = [
      buildBlock({ blockheight: 140, stakingledgerhash: 'ledger', blockdatetime: 2 }),
      buildBlock({ blockheight: 135, stakingledgerhash: 'ledger', blockdatetime: 1 }),
    ];
    const blockProvider: IBlockDataProvider = {
      getLatestHeight: jest.fn().mockResolvedValue(320),
      getBlocks: jest.fn().mockResolvedValue(unsortedBlocks),
      getMinMaxBlocksByEpoch: jest.fn(),
    };
    const stakeProvider: IStakeDataProvider = {
      getStakes: jest.fn().mockResolvedValue({
        stakes: [
          buildStake({ publicKey: 'alpha', balance: 50 }),
          buildStake({ publicKey: 'beta', balance: 150 }),
        ],
        totalStakingBalance: 200,
      }),
    };

    const payoutTransactions = [
      { publicKey: 'beta', amount: 10, fee: 0, amountMina: 0, feeMina: 0, memo: DEFAULT_MEMO, summaryGroup: 0 },
      { publicKey: 'alpha', amount: 20, fee: 0, amountMina: 0, feeMina: 0, memo: DEFAULT_MEMO, summaryGroup: 0 },
    ];
    const payoutDetails = [
      {
        publicKey: 'beta',
        owner: '',
        blockHeight: 140,
        globalSlot: 1,
        publicKeyUntimedAfter: 0,
        winnerShareOwner: '',
        shareClass: { shareClass: 'Common', shareOwner: '' },
        stateHash: 'state-140',
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
        coinbase: 720 * 1_000_000_000,
        totalRewards: 720 * 1_000_000_000,
        totalRewardsToBurn: 0,
        totalRewardsNPSPool: 720 * 1_000_000_000,
        totalRewardsCommonPool: 0,
        totalRewardsSuperchargedPool: 0,
        payout: 10,
        isEffectiveSuperCharge: false,
      },
      {
        publicKey: 'alpha',
        owner: '',
        blockHeight: 135,
        globalSlot: 1,
        publicKeyUntimedAfter: 0,
        winnerShareOwner: '',
        shareClass: { shareClass: 'Common', shareOwner: '' },
        stateHash: 'state-135',
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
        coinbase: 720 * 1_000_000_000,
        totalRewards: 720 * 1_000_000_000,
        totalRewardsToBurn: 0,
        totalRewardsNPSPool: 720 * 1_000_000_000,
        totalRewardsCommonPool: 0,
        totalRewardsSuperchargedPool: 0,
        payout: 20,
        isEffectiveSuperCharge: false,
      },
    ];

    const payoutCalculator: IPayoutCalculator = {
      getPayouts: jest.fn().mockResolvedValue([
        payoutTransactions,
        payoutDetails,
        [135, 140],
        30,
        0,
        0,
      ]),
    };

    const { builder } = createBuilder({
      blockProvider,
      stakeProvider,
      payoutCalculator,
    });

    const process = await builder.build();

    expect(process.maximumHeight).toBe(350);
    expect(process.blocks.map((block) => block.blockheight)).toStrictEqual([135, 140]);
    expect(process.payoutTransactions).toStrictEqual([
      { ...payoutTransactions[1], amount: 20 },
      { ...payoutTransactions[0], amount: 10 },
    ]);
    expect(process.payoutDetails.map((detail) => ({ blockHeight: detail.blockHeight, publicKey: detail.publicKey }))).toStrictEqual(
      [
        { blockHeight: 135, publicKey: 'alpha' },
        { blockHeight: 140, publicKey: 'beta' },
      ],
    );
    expect(process.totalPayoutFundsNeeded).toBe(0);
    expect(process.payoutsBeforeExclusions).toStrictEqual([]);
    expect(process.totalPayouts).toBe(30);
    expect(process.totalBurn).toBe(0);
  });
});

import { Block, Ledger, Stake, ShareClass } from '../dataProvider/dataprovider-types';
import { PayoutDetails, PayoutTransaction } from '../payoutCalculator/Model';
import { PaymentConfiguration, KeyedRate } from '../../configuration/Model';
import { PaymentProcess, PaymentTotals } from '../payment/Model';

/**
 * Mock factory for creating test data
 * This utility helps create consistent mock data for tests
 */
export class MockFactory {
  /**
   * Create a mock Block
   */
  static createBlock(overrides: Partial<Block> = {}): Block {
    return {
      blockheight: 1000,
      statehash: 'state-hash-123',
      stakingledgerhash: 'ledger-hash-123',
      blockdatetime: 1615939560000,
      slot: 1000,
      globalslotsincegenesis: 10000,
      creatorpublickey: 'B62qCreatorPublicKey',
      winnerpublickey: 'B62qWinnerPublicKey',
      receiverpublickey: 'B62qReceiverPublicKey',
      coinbase: 720000000000,
      feetransfertoreceiver: 10000000,
      feetransferfromcoinbase: 0,
      usercommandtransactionfees: 10000000,
      ...overrides
    };
  }

  /**
   * Create an array of mock Blocks
   */
  static createBlocks(count: number, baseOverrides: Partial<Block> = {}): Block[] {
    return Array.from({ length: count }, (_, i) => {
      return this.createBlock({
        blockheight: 1000 + i,
        slot: 1000 + i,
        globalslotsincegenesis: 10000 + i,
        ...baseOverrides
      });
    });
  }

  /**
   * Create a mock Stake
   */
  static createStake(overrides: Partial<Stake> = {}): Stake {
    return {
      publicKey: 'B62qStakerPublicKey',
      total: 0,
      stakingBalance: 100000000000,
      untimedAfterSlot: 20000,
      shareClass: { shareClass: 'Common', shareOwner: '' },
      totalToBurn: 0,
      ...overrides
    };
  }

  /**
   * Create an array of mock Stakes
   */
  static createStakes(count: number, baseOverrides: Partial<Stake> = {}): Stake[] {
    return Array.from({ length: count }, (_, i) => {
      return this.createStake({
        publicKey: `B62qStakerPublicKey${i}`,
        ...baseOverrides
      });
    });
  }

  /**
   * Create a mock Ledger
   */
  static createLedger(stakesCount: number = 2, overrides: Partial<Ledger> = {}): Ledger {
    const stakes = this.createStakes(stakesCount);
    const totalStakingBalance = stakes.reduce((sum, stake) => sum + stake.stakingBalance, 0);
    
    return {
      stakes,
      totalStakingBalance,
      ...overrides
    };
  }

  /**
   * Create a mock PayoutTransaction
   */
  static createPayoutTransaction(overrides: Partial<PayoutTransaction> = {}): PayoutTransaction {
    return {
      publicKey: 'B62qPayoutPublicKey',
      amount: 100000000,
      fee: 10000000,
      amountMina: 0.1,
      feeMina: 0.01,
      memo: 'test-memo',
      summaryGroup: 0,
      ...overrides
    };
  }

  /**
   * Create an array of mock PayoutTransactions
   */
  static createPayoutTransactions(count: number, baseOverrides: Partial<PayoutTransaction> = {}): PayoutTransaction[] {
    return Array.from({ length: count }, (_, i) => {
      return this.createPayoutTransaction({
        publicKey: `B62qPayoutPublicKey${i}`,
        ...baseOverrides
      });
    });
  }

  /**
   * Create a mock PayoutDetail
   */
  static createPayoutDetail(overrides: Partial<PayoutDetails> = {}): PayoutDetails {
    return {
      publicKey: 'B62qPayoutDetailPublicKey',
      owner: '',
      blockHeight: 1000,
      globalSlot: 10000,
      publicKeyUntimedAfter: 20000,
      winnerShareOwner: '',
      shareClass: { shareClass: 'Common', shareOwner: '' },
      stateHash: 'state-hash-123',
      effectiveNPSPoolWeighting: 0.5,
      effectiveNPSPoolStakes: 100000000000,
      effectiveCommonPoolWeighting: 0.5,
      effectiveCommonPoolStakes: 100000000000,
      effectiveSuperchargedPoolWeighting: 0,
      effectiveSuperchargedPoolStakes: 0,
      stakingBalance: 100000000000,
      sumEffectiveNPSPoolStakes: 200000000000,
      sumEffectiveCommonPoolStakes: 200000000000,
      sumEffectiveSuperchargedPoolStakes: 0,
      superchargedWeightingDiscount: 0.00000001,
      dateTime: 1615939560000,
      coinbase: 720000000000,
      totalRewards: 720010000000,
      totalRewardsToBurn: 0,
      totalRewardsNPSPool: 720000000000,
      totalRewardsCommonPool: 10000000,
      totalRewardsSuperchargedPool: 0,
      payout: 320000000000,
      isEffectiveSuperCharge: false,
      ...overrides
    };
  }

  /**
   * Create an array of mock PayoutDetails
   */
  static createPayoutDetails(count: number, baseOverrides: Partial<PayoutDetails> = {}): PayoutDetails[] {
    return Array.from({ length: count }, (_, i) => {
      return this.createPayoutDetail({
        publicKey: `B62qPayoutDetailPublicKey${i}`,
        blockHeight: 1000 + i,
        ...baseOverrides
      });
    });
  }

  /**
   * Create mock PaymentTotals
   */
  static createPaymentTotals(overrides: Partial<PaymentTotals> = {}): PaymentTotals {
    return {
      coinBaseSum: 1440000000000,
      userCommandTransactionFeeSum: 20000000,
      feeTransferFromCoinBaseSum: 0,
      netCoinBaseReceived: 1440000000000,
      payoutAmountsSum: 640000000000,
      payoutFeesSum: 20000000,
      netMinaToPoolOperator: 800000000000,
      payoutBurnSum: 0,
      payoutStakersSum: 640000000000,
      ...overrides
    };
  }

  /**
   * Create a mock PaymentProcess
   */
  static createPaymentProcess(overrides: Partial<PaymentProcess> = {}): PaymentProcess {
    const blocks = this.createBlocks(2);
    const payoutTransactions = this.createPayoutTransactions(2);
    const payoutDetails = this.createPayoutDetails(2);
    const totals = this.createPaymentTotals();
    
    return {
      blocks,
      payoutTransactions,
      payoutsBeforeExclusions: [...payoutTransactions],
      payoutDetails,
      maximumHeight: 1001,
      totalPayoutFundsNeeded: 640020000000,
      totalPayouts: 640000000000,
      totalBurn: 0,
      totals,
      ...overrides
    };
  }

  /**
   * Create a mock PaymentConfiguration
   */
  static createPaymentConfiguration(overrides: Partial<PaymentConfiguration> = {}): PaymentConfiguration {
    return {
      blockDataSource: 'MOCK',
      bpKeyMd5Hash: 'md5-hash-123',
      burnAddress: 'B62qiburnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmp7r7UN6X',
      burnRatesByPublicKey: {},
      commissionRatesByPublicKey: {},
      configuredMaximum: 1001,
      defaultCommissionRate: 0.05,
      doNotTransmit: false,
      epoch: 0,
      fork: 0,
      investorsCommissionRate: 0.08,
      mfCommissionRate: 0.08,
      minimumConfirmations: 290,
      minimumHeight: 1000,
      o1CommissionRate: 0.05,
      payoutHash: '',
      payoutMemo: 'test-memo',
      payorSendTransactionFee: 10000000,
      payoutThreshold: 0,
      senderKeys: { publicKey: 'B62qSenderPublicKey', privateKey: 'DUMMY_PRIVATE_KEY' },
      slotsInEpoch: 7140,
      stakingPoolPublicKey: 'B62qPoolPublicKey',
      verbose: false,
      doNotSaveTransactionDetails: false,
      payoutCalculator: 'original',
      ...overrides
    };
  }

  /**
   * Create a mock KeyedRate object
   */
  static createKeyedRate(keys: string[], rate: number = 0.05): KeyedRate {
    const result: KeyedRate = {};
    keys.forEach(key => {
      result[key] = { rate };
    });
    return result;
  }
}

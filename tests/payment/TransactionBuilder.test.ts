import 'reflect-metadata';
import { vi } from 'vitest';
import { PaymentConfiguration } from '../../src/configuration/Model.js';
import { TransactionBuilder } from '../../src/core/transaction/TransactionBuilder.js';
import { ISubstituteAndExcludePayToAddresses, PaymentProcess } from '../../src/core/payment/Model.js';
import { PayoutTransaction } from '../../src/core/payoutCalculator/Model.js';

const makeConfig = (): PaymentConfiguration => ({
  blockDataSource: '',
  bpKeyMd5Hash: '',
  burnAddress: '',
  burnRatesByPublicKey: {},
  commissionRatesByPublicKey: {},
  configuredMaximum: 0,
  defaultCommissionRate: 0,
  doNotTransmit: false,
  doNotSaveTransactionDetails: false,
  epoch: 0,
  fork: 0,
  investorsCommissionRate: 0,
  mfCommissionRate: 0,
  minimumConfirmations: 0,
  minimumHeight: 0,
  o1CommissionRate: 0,
  payoutHash: '',
  payoutMemo: 'memo',
  payorSendTransactionFee: 1_000_000,
  payoutThreshold: 0,
  senderKeys: { privateKey: '', publicKey: '' },
  slotsInEpoch: 0,
  stakingPoolPublicKey: '',
  verbose: false,
  payoutCalculator: 'original',
  useLegacyJsonFormat: false,
});

describe('TransactionBuilder', () => {
  it('aggregates transactions and leaves the process state intact when thresholds are met', async () => {
    const addressRemover: ISubstituteAndExcludePayToAddresses = {
      run: vi.fn(async (transactions: PayoutTransaction[]) => transactions),
    };
    const builder = new TransactionBuilder(addressRemover);

    const paymentProcess: PaymentProcess = {
      blocks: [],
      maximumHeight: 0,
      payoutTransactions: [
        { publicKey: 'alice', amount: 5, fee: 0, amountMina: 0, feeMina: 0, memo: 'one', summaryGroup: 0 },
        { publicKey: 'alice', amount: 5, fee: 0, amountMina: 0, feeMina: 0, memo: 'two', summaryGroup: 0 },
        { publicKey: 'bob', amount: 2, fee: 0, amountMina: 0, feeMina: 0, memo: 'tri', summaryGroup: 1 },
      ],
      payoutDetails: [],
      totalPayoutFundsNeeded: 100,
      payoutsBeforeExclusions: [],
      totalPayouts: 0,
      totalBurn: 0,
    };

    const config = makeConfig();

    const transactions = await builder.build(paymentProcess, config);

    const expected = [
      {
        publicKey: 'alice',
        amount: 10,
        fee: config.payorSendTransactionFee,
        amountMina: 10 / 1_000_000_000,
        feeMina: config.payorSendTransactionFee / 1_000_000_000,
        memo: 'two',
        summaryGroup: 0,
      },
      {
        publicKey: 'bob',
        amount: 2,
        fee: config.payorSendTransactionFee,
        amountMina: 2 / 1_000_000_000,
        feeMina: config.payorSendTransactionFee / 1_000_000_000,
        memo: 'tri',
        summaryGroup: 1,
      },
    ];

    expect(transactions).toStrictEqual(expected);
    expect(paymentProcess.payoutsBeforeExclusions).toStrictEqual(expected);
    expect(paymentProcess.payoutTransactions).toStrictEqual(expected);
    expect(paymentProcess.totalPayoutFundsNeeded).toBe(100);
    expect(addressRemover.run).toHaveBeenCalledWith(expected);
  });
});

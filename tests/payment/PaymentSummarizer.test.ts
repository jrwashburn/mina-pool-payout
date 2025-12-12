import 'reflect-metadata';
import { jest } from '@jest/globals';
import { IFileWriter } from '../../src/shared/Model.js';
import { Block } from '../../src/core/dataProvider/dataprovider-types.js';
import { PaymentSummarizer } from '../../src/core/payment/PaymentSummarizer.js';
import { PaymentProcess } from '../../src/core/payment/Model.js';
import { PayoutTransaction } from '../../src/core/payoutCalculator/Model.js';

const createSummarizer = () =>
  new PaymentSummarizer({
    write: jest.fn(),
  } as unknown as IFileWriter);

describe('PaymentSummarizer', () => {
  it('computes totals for completed payment processes', async () => {
    const summarizer = createSummarizer();
    const blocks: Block[] = [
      {
        blockheight: 1,
        blockdatetime: 0,
        coinbase: 720000000000,
        creatorpublickey: '',
        feetransfertoreceiver: 200000000,
        feetransferfromcoinbase: 100000000,
        globalslotsincegenesis: 0,
        receiverpublickey: '',
        slot: 0,
        stakingledgerhash: '',
        statehash: '',
        usercommandtransactionfees: 500000000,
        winnerpublickey: '',
      },
      {
        blockheight: 2,
        blockdatetime: 0,
        coinbase: 720000000000,
        creatorpublickey: '',
        feetransfertoreceiver: 0,
        feetransferfromcoinbase: 0,
        globalslotsincegenesis: 0,
        receiverpublickey: '',
        slot: 0,
        stakingledgerhash: '',
        statehash: '',
        usercommandtransactionfees: 200000000,
        winnerpublickey: '',
      },
    ];

    const process: PaymentProcess = {
      blocks,
      maximumHeight: 0,
      payoutTransactions: [],
      payoutDetails: [],
      payoutsBeforeExclusions: [],
      totalPayoutFundsNeeded: 0,
      totalPayouts: 0,
      totalBurn: 0,
    };

    await summarizer.calculateTotals(process);

    expect(process.totals).toStrictEqual({
      coinBaseSum: (720000000000 + 720000000000) / 1_000_000_000,
      feeTransferFromCoinBaseSum: 100000000 / 1_000_000_000,
      userCommandTransactionFeeSum: (500000000 + 200000000) / 1_000_000_000,
      netCoinBaseReceived: (1440000000000 - 100000000 + 700000000) / 1_000_000_000,
      payoutAmountsSum: 0,
      payoutFeesSum: 0,
      payoutBurnSum: 0,
      payoutStakersSum: 0,
      netMinaToPoolOperator: (1440000000000 - 100000000 + 700000000) / 1_000_000_000,
    });
  });

  it('tracks payout amounts, fees, and staker totals when transactions exist', async () => {
    const summarizer = createSummarizer();
    const payoutsBeforeExclusions: PayoutTransaction[] = [
      { publicKey: 'a', amount: 2_000_000_000, fee: 0, amountMina: 2, feeMina: 0, memo: '', summaryGroup: 0 },
      { publicKey: 'b', amount: 1_000_000_000, fee: 0, amountMina: 1, feeMina: 0, memo: '', summaryGroup: 0 },
    ];
    const payoutTransactions: PayoutTransaction[] = [
      { publicKey: 'a', amount: 2_000_000_000, fee: 500_000, amountMina: 2, feeMina: 0.0005, memo: '', summaryGroup: 0 },
      { publicKey: 'b', amount: 1_000_000_000, fee: 500_000, amountMina: 1, feeMina: 0.0005, memo: '', summaryGroup: 0 },
    ];

    const process: PaymentProcess = {
      blocks: [],
      maximumHeight: 0,
      payoutTransactions,
      payoutDetails: [],
      payoutsBeforeExclusions,
      totalPayoutFundsNeeded: 0,
      totalPayouts: 0,
      totalBurn: 500_000_000,
    };

    await summarizer.calculateTotals(process);

    expect(process.totals?.payoutAmountsSum).toBe(3);
    expect(process.totals?.payoutFeesSum).toBe((500_000 + 500_000) / 1_000_000_000);
    expect(process.totals?.payoutStakersSum).toBe((3_000_000_000 - 500_000_000) / 1_000_000_000);
    expect(process.totals?.payoutBurnSum).toBe(0.5);
  });
});

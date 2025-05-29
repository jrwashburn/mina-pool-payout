import 'reflect-metadata';
import { TransactionBuilder } from '../../transaction/TransactionBuilder';
import { ISubstituteAndExcludePayToAddresses, PaymentProcess } from '../Model';
import { PaymentConfiguration } from '../../../configuration/Model';
import { PayoutTransaction } from '../../payoutCalculator/Model';

describe('Transaction Builder Tests', () => {
  describe('Should be successful', () => {
    it('when paymentProcess is success', async () => {
      const mockAddressRemover: ISubstituteAndExcludePayToAddresses = {
        run: (mockTransactions) => {
          return Promise.resolve(mockTransactions);
        },
      };

      const mockExpectedTransactions: PayoutTransaction[] = [];

      const mockPaymentProcess: PaymentProcess = {
        blocks: [],
        maximumHeight: 1,
        payoutTransactions: [],
        payoutDetails: [],
        totalPayoutFundsNeeded: 11,
        payoutsBeforeExclusions: [],
        totalPayouts: 0,
        totalBurn: 0,
      };
      const configurationMock: PaymentConfiguration = {
        defaultCommissionRate: 0.05,
        mfCommissionRate: 0.08,
        o1CommissionRate: 0.05,
        investorsCommissionRate: 0.08,
        commissionRatesByPublicKey: {},
        burnRatesByPublicKey: {},
        stakingPoolPublicKey: '',
        payoutMemo: '',
        bpKeyMd5Hash: '',
        senderKeys: {
          privateKey: '',
          publicKey: '',
        },
        payorSendTransactionFee: 0 * 1000000000,
        minimumConfirmations: 290,
        minimumHeight: 1,
        configuredMaximum: 10,
        blockDataSource: '',
        verbose: false,
        payoutHash: '',
        payoutThreshold: 0,
        epoch: 0,
        fork: 0,
        slotsInEpoch: 0,
        burnAddress: '',
        doNotTransmit: false,
        doNotSaveTransactionDetails: false,
        payoutCalculator: 'original',
      };

      const builder = new TransactionBuilder(mockAddressRemover);

      return builder.build(mockPaymentProcess, configurationMock).then((result) => {
        expect(result).toStrictEqual(mockExpectedTransactions);
      });
    });
  });
});

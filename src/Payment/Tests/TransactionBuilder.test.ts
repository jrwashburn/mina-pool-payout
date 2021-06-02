import { TransactionBuilder } from '../TransactionBuilder'
import { IAddressRemover, PaymentProcess } from '../Model'
import { PayoutTransaction } from '../../core/payout-calculator'
import { PaymentConfiguration } from '../../Configuration/Model'

describe('Transaction Builder Tests', () => {
    it('Should be successful', () => {
        it('when paymentProcess is success',() => {
            
            const mockAddressRemover:IAddressRemover = { remove: (mockTransactions) => { return new Promise(() => mockTransactions)}}

            const mockExpectedTransactions:PayoutTransaction[] = []

            const mockPaymentProcess: PaymentProcess = {blocks: [], maximumHeight: 1, payouts: [], storePayout: [], totalPayoutFundsNeeded: 11, }
            //TODO: MOVE THIS TO ITS A SETUP FILE
            const configurationMock : PaymentConfiguration = {
                commissionRate : 0.05,
                stakingPoolPublicKey: "",
                payoutMemo: "",
                senderKeys: {
                    privateKey: "",
                    publicKey: "",
                },
                payorSendTransactionFee: 0 * 1000000000,
                minimumConfirmations: 290,
                minimumHeight: 1,
                configuredMaximum: 10, 
                blockDataSource: 'ARCHIVEDB',
                verbose: false,
                payoutHash: ''
            }

            const builder = new TransactionBuilder(mockAddressRemover)

            return builder.build(mockPaymentProcess,configurationMock).then((result) => {
                expect(result).toStrictEqual(mockExpectedTransactions)
            })
        })  
    })
})
import { PaymentBuilder  } from '../PaymentBuilder'
import { PaymentConfiguration } from '../../Configuration/Model'
import { IBlockDataProvider, IDataProviderFactory, IStakeDataProvider } from '../../DataProvider/Models';
import { IBlockProcessor, IPayoutCalculator, PaymentProcess } from '../Model';

describe('Payment Builder Tests', () => {
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

    const mockedBlockProcessor: IBlockProcessor = {determineLastBlockHeightToProcess: () => new Promise(() => 10)} 
    
    const mockBlockDataProvider: IBlockDataProvider = { getBlocks: () => new Promise(() => { return [{blockheight: 1, }]}), 
                                      getLatestHeight: () => new Promise(() => 10) }
    
    const mockStakeDataProvider: IStakeDataProvider = { getStakes: () => new Promise(() => {})}

    const mockedPayoutCalculator: IPayoutCalculator = { getPayouts: () => new Promise(()=>[])} 
    
    const mockedBlockDataFactory: IDataProviderFactory<IBlockDataProvider> = { build: () => { return mockBlockDataProvider }}

    const mockedStakeDataFactory: IDataProviderFactory<IStakeDataProvider> = { build: () => { return mockStakeDataProvider }}

    describe('When all dependencies are met', () => {
        it('should call all dependencies correctly.', async () => {

            const builder = new PaymentBuilder(configurationMock, mockedBlockProcessor,mockedPayoutCalculator,mockedBlockDataFactory,mockedStakeDataFactory)
    
            const payment = await builder.build()
    
            expect(mockedBlockProcessor).toHaveBeenCalledTimes(1)
            expect(mockStakeDataProvider).toHaveBeenCalledTimes(1)
            expect(mockedPayoutCalculator).toHaveBeenCalledTimes(1)
            expect(mockedBlockDataFactory).toHaveBeenCalledTimes(1)
            expect(mockedStakeDataFactory).toHaveBeenCalledTimes(1)
            
        })
        it('should build al succesful payment process', async () => {
    
            const builder = new PaymentBuilder(configurationMock, mockedBlockProcessor,mockedPayoutCalculator,mockedBlockDataFactory,mockedStakeDataFactory)
    
            const payment = await builder.build()

            const expectedPayment: PaymentProcess = {
                blocks:[],
                maximumHeight: 1,
                payouts: [],
                storePayout: [],
                totalPayoutFundsNeeded: 0
            }

            expect(payment).toBe(expectedPayment)
             
        })
    })
})
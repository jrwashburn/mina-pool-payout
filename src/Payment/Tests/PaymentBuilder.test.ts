import { PaymentBuilder  } from '../PaymentBuilder'
import { PaymentConfiguration } from '../../Configuration/Model'
import { IBlockDataProvider, IDataProviderFactory, IStakeDataProvider } from '../../DataProvider/Models';
import { IBlockProcessor, IPayoutCalculator, PaymentProcess } from '../Model';
import { Block } from '../../core/dataprovider-types';
import { PayoutDetails, PayoutTransaction } from '../../core/payout-calculator';

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
    
    const mockedBlocks : Block[] = [{
        blockdatetime: 213456789,
        blockheight: 10,
        coinbase: 10,
        creatorpublickey: "123645789",
        feetransferfromcoinbase: 10,
        feetransfertoreceiver: 1,
        globalslotsincegenesis: 1,
        receiverpublickey: "123445676",
        slot: 1,
        stakingledgerhash: "da622bbdea9ab2c632385a78791b202a",
        statehash: "0062aca83e3d7027cd77cfe03e0fe7d9",
        usercommandtransactionfees: 10,
        winnerpublickey: "123645789"
    },{
        blockdatetime: 213456781,
        blockheight: 11,
        coinbase: 10,
        creatorpublickey: "123645789",
        feetransferfromcoinbase: 10,
        feetransfertoreceiver: 1,
        globalslotsincegenesis: 1,
        receiverpublickey: "123445676",
        slot: 1,
        stakingledgerhash: "da622bbdea9ab2c632385a78791b202a",
        statehash: "0062aca83e3d7027cd77cfe03e0fe7d9",
        usercommandtransactionfees: 10,
        winnerpublickey: "123645789"
    }
]

    const mockBlockDataProvider: IBlockDataProvider = { getBlocks: () => new Promise(() => { return mockedBlocks}), 
                                      getLatestHeight: () => new Promise(() => 11) }
    
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

            const expectedPayoutTransaction: PayoutTransaction [] = [{
                amount: 100,
                fee: 10,
                publicKey: "123645789"
            },{
                amount: 100,
                fee: 10,
                publicKey: "223645789"
            }]

            const expectedStorePayouts: PayoutDetails[] = [{
                blockHeight: 10, 
                coinbase: 10, 
                dateTime: 20210402,
                effectiveCommonPoolStakes: 10,
                effectiveCommonPoolWeighting: 11,
                effectiveNPSPoolStakes: 10,
                effectiveNPSPoolWeighting: 11,
                globalSlot: 1,
                payout: 12,
                publicKey: "123645789",
                publicKeyUntimedAfter: 123456789,
                shareClass: "NPS",
                stakingBalance: 11,
                stateHash: "",
                sumEffectiveCommonPoolStakes: 12,
                sumEffectiveNPSPoolStakes: 11,
                superchargedWeightingDiscount: 12,
                totalRewards: 1,
                totalRewardsCommonPool: 12,
                totalRewardsNPSPool: 12
            },
            {
                blockHeight: 11, 
                coinbase: 10, 
                dateTime: 20210402,
                effectiveCommonPoolStakes: 10,
                effectiveCommonPoolWeighting: 11,
                effectiveNPSPoolStakes: 10,
                effectiveNPSPoolWeighting: 11,
                globalSlot: 1,
                payout: 12,
                publicKey: "223645789",
                publicKeyUntimedAfter: 123456789,
                shareClass: "NPS",
                stakingBalance: 11,
                stateHash: "",
                sumEffectiveCommonPoolStakes: 12,
                sumEffectiveNPSPoolStakes: 11,
                superchargedWeightingDiscount: 12,
                totalRewards: 1,
                totalRewardsCommonPool: 12,
                totalRewardsNPSPool: 12
            }]

            const expectedPaymentProcess: PaymentProcess = {
                blocks: mockedBlocks,
                maximumHeight: 11,
                payouts: expectedPayoutTransaction,
                storePayout: expectedStorePayouts,
                totalPayoutFundsNeeded: 0
            }

            expect(payment).toBe(expectedPaymentProcess)
             
        })
    })
})
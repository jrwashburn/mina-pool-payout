import { PaymentBuilder  } from '../PaymentBuilder'
import { PaymentConfiguration } from '../../../Configuration/Model'
import { IBlockDataProvider, IDataProviderFactory, IStakeDataProvider } from '../../DataProvider/Models';
import { IBlockProcessor, PaymentProcess } from '../Model';
import { Block } from '../../DataProvider/dataprovider-types';
import { IPayoutCalculator, PayoutDetails, PayoutTransaction } from '../../PayoutCalculator/Model';

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
        blockdatetime: 1615939560000,
        blockheight: 995,
        coinbase: 720000000000,
        creatorpublickey: "B621234ccc",
        feetransferfromcoinbase: 0,
        feetransfertoreceiver: 10000000,
        globalslotsincegenesis: 1395,
        receiverpublickey: "B621234cccdsd",
        slot: 1395,
        stakingledgerhash: "jx7888eee",
        statehash: "3NLGHHTHNRDNd",
        usercommandtransactionfees: 10000000,
        winnerpublickey: "B62334ffdsd"
    },{
        blockdatetime: 1616188680000,
        blockheight: 987,
        coinbase: 720000000000,
        creatorpublickey: "B621234ccc",
        feetransferfromcoinbase: 0,
        feetransfertoreceiver: 10000000,
        globalslotsincegenesis: 1386,
        receiverpublickey: "B621234cccdsd",
        slot: 1386,
        stakingledgerhash: "jx7888eeed",
        statehash: "3NLGHHTHNRDNd2333",
        usercommandtransactionfees: 10000000,
        winnerpublickey: "B62334ffdsd"
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

            const builder = new PaymentBuilder(mockedBlockProcessor,mockedPayoutCalculator,mockedBlockDataFactory,mockedStakeDataFactory)
    
            builder.build().then((result) => {
                expect(mockedBlockProcessor).toHaveBeenCalledTimes(1)
                expect(mockStakeDataProvider).toHaveBeenCalledTimes(1)
                expect(mockedPayoutCalculator).toHaveBeenCalledTimes(1)
                expect(mockedBlockDataFactory).toHaveBeenCalledTimes(1)
                expect(mockedStakeDataFactory).toHaveBeenCalledTimes(1)
            })
    
        })
        it('should build a succesful payment process', async () => {
    
            const builder = new PaymentBuilder(mockedBlockProcessor,mockedPayoutCalculator,mockedBlockDataFactory,mockedStakeDataFactory)

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
                totalRewardsNPSPool: 12,
                isEffectiveSuperCharge: false,
                effectiveSuperchargedPoolStakes: 0,
                effectiveSuperchargedPoolWeighting: 0,
                sumEffectiveSuperchargedPoolStakes: 0,
                totalRewardsSuperchargedPool:0
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
                totalRewardsNPSPool: 12,
                isEffectiveSuperCharge: false,
                effectiveSuperchargedPoolStakes: 0,
                effectiveSuperchargedPoolWeighting: 0,
                sumEffectiveSuperchargedPoolStakes: 0,
                totalRewardsSuperchargedPool:0
            }]

            const expectedPaymentProcess: PaymentProcess = {
                blocks: mockedBlocks,
                maximumHeight: 11,
                payouts: expectedPayoutTransaction,
                storePayout: expectedStorePayouts,
                totalPayoutFundsNeeded: 0
            }

            builder.build().then((result) => {
                return expect(result).toBe(expectedPaymentProcess)
            })
             
        })

        
        it('should build a succesful payment process strinct', async () => {
    
            const builder = new PaymentBuilder(mockedBlockProcessor,mockedPayoutCalculator,mockedBlockDataFactory,mockedStakeDataFactory)

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
                totalRewardsNPSPool: 12,
                isEffectiveSuperCharge: false,
                effectiveSuperchargedPoolStakes: 0,
                effectiveSuperchargedPoolWeighting: 0,
                sumEffectiveSuperchargedPoolStakes: 0,
                totalRewardsSuperchargedPool:0
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
                totalRewardsNPSPool: 12,
                isEffectiveSuperCharge: false,
                effectiveSuperchargedPoolStakes: 0,
                effectiveSuperchargedPoolWeighting: 0,
                sumEffectiveSuperchargedPoolStakes: 0,
                totalRewardsSuperchargedPool:0
            }]

            const expectedPaymentProcess: PaymentProcess = {
                blocks: mockedBlocks,
                maximumHeight: 11,
                payouts: expectedPayoutTransaction,
                storePayout: expectedStorePayouts,
                totalPayoutFundsNeeded: 0
            }

            builder.build().then((result) => {
                return expect(result).toStrictEqual(expectedPaymentProcess)
            })
             
        })
    })
})
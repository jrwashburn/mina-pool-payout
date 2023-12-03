import 'reflect-metadata';
import { Block } from '../../dataProvider/dataprovider-types';
import { IBlockDataProvider, IDataProviderFactory, IStakeDataProvider } from '../../dataProvider/Models';
import { IPayoutCalculator, PayoutDetails, PayoutTransaction } from '../../payoutCalculator/Model';
import { IBlockProcessor, PaymentProcess } from '../Model';
import { PaymentBuilder } from '../PaymentBuilder';

describe('Payment Builder Tests', () => {
    const mockedBlockProcessor: IBlockProcessor = { determineLastBlockHeightToProcess: () => new Promise(() => 10) };

    const mockedBlocks: Block[] = [
        {
            blockdatetime: 1615939560000,
            blockheight: 995,
            coinbase: 720000000000,
            creatorpublickey: 'B621234ccc',
            feetransferfromcoinbase: 0,
            feetransfertoreceiver: 10000000,
            globalslotsincegenesis: 1395,
            receiverpublickey: 'B621234cccdsd',
            slot: 1395,
            stakingledgerhash: 'jx7888eee',
            statehash: '3NLGHHTHNRDNd',
            usercommandtransactionfees: 10000000,
            winnerpublickey: 'B62334ffdsd',
        },
        {
            blockdatetime: 1616188680000,
            blockheight: 987,
            coinbase: 720000000000,
            creatorpublickey: 'B621234ccc',
            feetransferfromcoinbase: 0,
            feetransfertoreceiver: 10000000,
            globalslotsincegenesis: 1386,
            receiverpublickey: 'B621234cccdsd',
            slot: 1386,
            stakingledgerhash: 'jx7888eeed',
            statehash: '3NLGHHTHNRDNd2333',
            usercommandtransactionfees: 10000000,
            winnerpublickey: 'B62334ffdsd',
        },
    ];

    const mockBlockDataProvider: IBlockDataProvider = {
        getBlocks: () =>
            new Promise(() => {
                return mockedBlocks;
            }),
        getLatestHeight: () => new Promise(() => 11),
        getMinMaxBlocksByEpoch: function (): Promise<{ min: number; max: number }> {
            throw new Error('Function not implemented.');
        },
    };

    const mockStakeDataProvider: IStakeDataProvider = {
        getStakes: () =>
            new Promise(() => {
                [
                    {
                        pk: 'B62qiy32p8kAKnny8ZFwoMhYpBppM1DWVCqAPBYNcXnsAHhnfAAuXgg',
                        balance: '0.000001',
                        delegate: 'B62qiy32p8kAKnny8ZFwoMhYpBppM1DWVCqAPBYNcXnsAHhnfAAuXgg',
                    },
                    {
                        pk: 'B62qmqMrgPshhHKLJ7DqWn1KeizEgga5MuGmWb2bXajUnyivfeMW6JE',
                        balance: '372093',
                        delegate: 'B62qrecVjpoZ4Re3a5arN6gXZ6orhmj1enUtA887XdG5mtZfdUbBUh4',
                        timing: {
                            initial_minimum_balance: '372093',
                            cliff_time: '86400',
                            cliff_amount: '372093',
                            vesting_period: '1',
                            vesting_increment: '0',
                        },
                    },
                ];
            }),
    };

    const mockedPayoutCalculator: IPayoutCalculator = { getPayouts: () => new Promise(() => [1]) };

    const mockedBlockDataFactory: IDataProviderFactory<IBlockDataProvider> = {
        build: () => {
            return mockBlockDataProvider;
        },
    };

    const mockedStakeDataFactory: IDataProviderFactory<IStakeDataProvider> = {
        build: () => {
            return mockStakeDataProvider;
        },
    };

    describe('When all dependencies are met', () => {
        it('should call all dependencies correctly.', async () => {
            const builder = new PaymentBuilder(
                mockedBlockProcessor,
                mockedPayoutCalculator,
                mockedBlockDataFactory,
                mockedStakeDataFactory,
            );

            builder.build().then(() => {
                expect(mockedBlockProcessor).toHaveBeenCalledTimes(1);
                expect(mockStakeDataProvider).toHaveBeenCalledTimes(1);
                expect(mockedPayoutCalculator).toHaveBeenCalledTimes(1);
                expect(mockedBlockDataFactory).toHaveBeenCalledTimes(1);
                expect(mockedStakeDataFactory).toHaveBeenCalledTimes(1);
            });
        });
        it('should build a succesful payment process', async () => {
            const builder = new PaymentBuilder(
                mockedBlockProcessor,
                mockedPayoutCalculator,
                mockedBlockDataFactory,
                mockedStakeDataFactory,
            );

            const expectedPayoutTransaction: PayoutTransaction[] = [
                {
                    amount: 100,
                    fee: 10,
                    publicKey: '123645789',
                    amountMina: 0,
                    feeMina: 0,
                    memo: '',
                },
                {
                    amount: 100,
                    fee: 10,
                    publicKey: '223645789',
                    amountMina: 0,
                    feeMina: 0,
                    memo: '',
                },
            ];

            const expectedStorePayouts: PayoutDetails[] = [
                {
                    blockHeight: 10,
                    coinbase: 10,
                    dateTime: 20210402,
                    effectiveCommonPoolStakes: 10,
                    effectiveCommonPoolWeighting: 11,
                    effectiveNPSPoolStakes: 10,
                    effectiveNPSPoolWeighting: 11,
                    globalSlot: 1,
                    payout: 12,
                    publicKey: '123645789',
                    publicKeyUntimedAfter: 123456789,
                    shareClass: { shareClass: 'NPS', shareOwner: 'MF' },
                    stakingBalance: 11,
                    stateHash: '',
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
                    totalRewardsSuperchargedPool: 0,
                    owner: 'MF',
                    winnerShareOwner: 'MF',
                    totalRewardsToBurn: 0,
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
                    publicKey: '223645789',
                    publicKeyUntimedAfter: 123456789,
                    shareClass: { shareClass: 'NPS', shareOwner: 'O1' },
                    stakingBalance: 11,
                    stateHash: '',
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
                    totalRewardsSuperchargedPool: 0,
                    owner: 'O1',
                    winnerShareOwner: 'MF',
                    totalRewardsToBurn: 0,
                },
            ];

            const expectedPaymentProcess: PaymentProcess = {
                blocks: mockedBlocks,
                maximumHeight: 11,
                payouts: expectedPayoutTransaction,
                storePayout: expectedStorePayouts,
                totalPayoutFundsNeeded: 0,
                payoutsBeforeExclusions: [],
                totals: {
                    coinBaseSum: 10,
                    feeTransferFromCoinBaseSum: 10,
                    netCoinBaseReceived: 10,
                    netMinaToPoolOperator: 11,
                    payoutAmountsSum: 12,
                    payoutFeesSum: 13,
                    userCommandTransactionFeeSum: 12,
                },
                totalPayouts: 0,
                totalBurn: 0,
            };

            builder.build().then((result) => {
                return expect(result).toBe(expectedPaymentProcess);
            });
        });

        it('should build a succesful payment process strinct', async () => {
            const builder = new PaymentBuilder(
                mockedBlockProcessor,
                mockedPayoutCalculator,
                mockedBlockDataFactory,
                mockedStakeDataFactory,
            );

            const expectedPayoutTransaction: PayoutTransaction[] = [
                {
                    amount: 100,
                    fee: 10,
                    publicKey: '123645789',
                    amountMina: 0,
                    feeMina: 0,
                    memo: '',
                },
                {
                    amount: 100,
                    fee: 10,
                    publicKey: '223645789',
                    amountMina: 0,
                    feeMina: 0,
                    memo: '',
                },
            ];

            const expectedStorePayouts: PayoutDetails[] = [
                {
                    blockHeight: 10,
                    coinbase: 10,
                    dateTime: 20210402,
                    effectiveCommonPoolStakes: 10,
                    effectiveCommonPoolWeighting: 11,
                    effectiveNPSPoolStakes: 10,
                    effectiveNPSPoolWeighting: 11,
                    globalSlot: 1,
                    payout: 12,
                    publicKey: '123645789',
                    publicKeyUntimedAfter: 123456789,
                    shareClass: { shareClass: 'NPS', shareOwner: 'MF' },
                    stakingBalance: 11,
                    stateHash: '',
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
                    totalRewardsSuperchargedPool: 0,
                    owner: 'MF',
                    winnerShareOwner: 'MF',
                    totalRewardsToBurn: 0,
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
                    publicKey: '223645789',
                    publicKeyUntimedAfter: 123456789,
                    shareClass: { shareClass: 'NPS', shareOwner: 'O1' },
                    stakingBalance: 11,
                    stateHash: '',
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
                    totalRewardsSuperchargedPool: 0,
                    owner: 'MF',
                    winnerShareOwner: 'MF',
                    totalRewardsToBurn: 0,
                },
            ];

            const expectedPaymentProcess: PaymentProcess = {
                blocks: mockedBlocks,
                maximumHeight: 11,
                payouts: expectedPayoutTransaction,
                storePayout: expectedStorePayouts,
                totalPayoutFundsNeeded: 0,
                payoutsBeforeExclusions: [],
                totals: {
                    coinBaseSum: 10,
                    feeTransferFromCoinBaseSum: 10,
                    netCoinBaseReceived: 10,
                    netMinaToPoolOperator: 11,
                    payoutAmountsSum: 11,
                    payoutFeesSum: 11,
                    userCommandTransactionFeeSum: 11,
                },
                totalPayouts: 0,
                totalBurn: 0,
            };

            builder.build().then((result) => {
                return expect(result).toStrictEqual(expectedPaymentProcess);
            });
        });
    });
});

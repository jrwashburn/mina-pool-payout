import { KeyCommissionRate } from '../../../configuration/Model';
import { Block, Stake, ShareClass } from '../../dataProvider/dataprovider-types';
import { PayoutCalculator } from '../../payoutCalculator/PayoutCalculator';

describe('Payout Calculator tests', () => {
    describe('should be sucessful', () => {
        it('when data is complete', () => {
            const calculator = new PayoutCalculator();

            const mockedBlocks: Block[] = [
                {
                    blockdatetime: 213456789,
                    blockheight: 10,
                    coinbase: 10,
                    creatorpublickey: '123645789',
                    feetransferfromcoinbase: 10,
                    feetransfertoreceiver: 1,
                    globalslotsincegenesis: 1,
                    receiverpublickey: '123445676',
                    slot: 1,
                    stakingledgerhash: 'da622bbdea9ab2c632385a78791b202a',
                    statehash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                    usercommandtransactionfees: 10,
                    winnerpublickey: '123645789',
                },
                {
                    blockdatetime: 213456781,
                    blockheight: 11,
                    coinbase: 10,
                    creatorpublickey: '123645782',
                    feetransferfromcoinbase: 10,
                    feetransfertoreceiver: 1,
                    globalslotsincegenesis: 1,
                    receiverpublickey: '123445672',
                    slot: 1,
                    stakingledgerhash: 'da622bbdea9ab2c632385a78791b202a',
                    statehash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                    usercommandtransactionfees: 10,
                    winnerpublickey: '123645789',
                },
            ];

            const mockStakers: Stake[] = [
                {
                    publicKey: '123645789',
                    shareClass: { shareClass: 'Common', shareOwner: '' },
                    stakingBalance: 100,
                    total: 200,
                    untimedAfterSlot: 11,
                },
                {
                    publicKey: '123645782',
                    shareClass: { shareClass: 'Common', shareOwner: '' },
                    stakingBalance: 100,
                    total: 200,
                    untimedAfterSlot: 11,
                },
            ];
            const mockResult = [
                [
                    {
                        amount: 100,
                        fee: 0,
                        publicKey: '123645789',
                    },
                    {
                        amount: 100,
                        fee: 0,
                        publicKey: '123645782',
                    },
                ],
                [
                    {
                        blockHeight: 10,
                        coinbase: 10,
                        dateTime: 213456789,
                        effectiveCommonPoolStakes: 100,
                        effectiveCommonPoolWeighting: 0.5,
                        effectiveNPSPoolStakes: 100,
                        effectiveNPSPoolWeighting: 0.5,
                        globalSlot: 1,
                        payout: -50,
                        publicKey: '123645789',
                        publicKeyUntimedAfter: 11,
                        shareClass: { shareClass: 'Common', shareOwner: '' },
                        stakingBalance: 100,
                        stateHash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                        sumEffectiveCommonPoolStakes: 200,
                        sumEffectiveNPSPoolStakes: 200,
                        superchargedWeightingDiscount: 1,
                        totalRewards: 1,
                        totalRewardsCommonPool: -9,
                        totalRewardsNPSPool: 10,
                    },
                    {
                        blockHeight: 10,
                        coinbase: 10,
                        dateTime: 213456789,
                        effectiveCommonPoolStakes: 100,
                        effectiveCommonPoolWeighting: 0.5,
                        effectiveNPSPoolStakes: 100,
                        effectiveNPSPoolWeighting: 0.5,
                        globalSlot: 1,
                        payout: -50,
                        publicKey: '123645782',
                        publicKeyUntimedAfter: 11,
                        shareClass: { shareClass: 'Common', shareOwner: '' },
                        stakingBalance: 100,
                        stateHash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                        sumEffectiveCommonPoolStakes: 200,
                        sumEffectiveNPSPoolStakes: 200,
                        superchargedWeightingDiscount: 1,
                        totalRewards: 1,
                        totalRewardsCommonPool: -9,
                        totalRewardsNPSPool: 10,
                    },
                    {
                        blockHeight: 11,
                        coinbase: 10,
                        dateTime: 213456781,
                        effectiveCommonPoolStakes: 100,
                        effectiveCommonPoolWeighting: 0.5,
                        effectiveNPSPoolStakes: 100,
                        effectiveNPSPoolWeighting: 0.5,
                        globalSlot: 1,
                        payout: -50,
                        publicKey: '123645789',
                        publicKeyUntimedAfter: 11,
                        shareClass: { shareClass: 'Common', shareOwner: '' },
                        stakingBalance: 100,
                        stateHash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                        sumEffectiveCommonPoolStakes: 200,
                        sumEffectiveNPSPoolStakes: 200,
                        superchargedWeightingDiscount: 1,
                        totalRewards: 1,
                        totalRewardsCommonPool: -9,
                        totalRewardsNPSPool: 10,
                    },
                    {
                        blockHeight: 11,
                        coinbase: 10,
                        dateTime: 213456781,
                        effectiveCommonPoolStakes: 100,
                        effectiveCommonPoolWeighting: 0.5,
                        effectiveNPSPoolStakes: 100,
                        effectiveNPSPoolWeighting: 0.5,
                        globalSlot: 1,
                        payout: -50,
                        publicKey: '123645782',
                        publicKeyUntimedAfter: 11,
                        shareClass: { shareClass: 'Common', shareOwner: '' },
                        stakingBalance: 100,
                        stateHash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                        sumEffectiveCommonPoolStakes: 200,
                        sumEffectiveNPSPoolStakes: 200,
                        superchargedWeightingDiscount: 1,
                        totalRewards: 1,
                        totalRewardsCommonPool: -9,
                        totalRewardsNPSPool: 10,
                    },
                ],
                [10, 11],
                200,
            ];

            const commissionRates: KeyCommissionRate = {};

            return calculator.getPayouts(mockedBlocks, mockStakers, 11, 0.11, commissionRates).then((result) => {
                expect(result).toStrictEqual(mockResult);
            });
        });
    });
    describe('should throw an error', () => {
        it.skip('when NPS share is not equal to staked amount', () => {
            const calculator = new PayoutCalculator();

            const mockedBlocks: Block[] = [
                {
                    blockdatetime: 213456789,
                    blockheight: 10,
                    coinbase: 10,
                    creatorpublickey: '123645789',
                    feetransferfromcoinbase: 10,
                    feetransfertoreceiver: 1,
                    globalslotsincegenesis: 1,
                    receiverpublickey: '123445676',
                    slot: 1,
                    stakingledgerhash: 'da622bbdea9ab2c632385a78791b202a',
                    statehash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                    usercommandtransactionfees: 10,
                    winnerpublickey: '123645789',
                },
                {
                    blockdatetime: 213456781,
                    blockheight: 11,
                    coinbase: 10,
                    creatorpublickey: '123645782',
                    feetransferfromcoinbase: 10,
                    feetransfertoreceiver: 1,
                    globalslotsincegenesis: 1,
                    receiverpublickey: '123445672',
                    slot: 1,
                    stakingledgerhash: 'da622bbdea9ab2c632385a78791b202a',
                    statehash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                    usercommandtransactionfees: 10,
                    winnerpublickey: '123645789',
                },
            ];

            const mockStakers: Stake[] = [
                {
                    publicKey: '123645789',
                    shareClass: { shareClass: 'NPS', shareOwner: 'MF' },
                    stakingBalance: 100,
                    total: 200,
                    untimedAfterSlot: 11,
                },
                {
                    publicKey: '123645782',
                    shareClass: { shareClass: 'NPS', shareOwner: 'O1' },
                    stakingBalance: 100,
                    total: 200,
                    untimedAfterSlot: 11,
                },
            ];

            const commissionRates: KeyCommissionRate = {};

            return calculator.getPayouts(mockedBlocks, mockStakers, 10, 0.05, 0.08, 0.05, commissionRates).then((result) => {
                expect(result).toThrow();
            });
        });
    });
});

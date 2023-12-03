import 'reflect-metadata';
import { KeyCommissionRate } from '../../../configuration/Model';
import { Block, Stake } from '../../dataProvider/dataprovider-types';
import { PayoutCalculator } from '../../payoutCalculator/PayoutCalculator';

describe('Payout Calculator tests', () => {
    describe('should be sucessful', () => {
        it('when data is complete', () => {
            const calculator = new PayoutCalculator();

            const mockedBlocks: Block[] = [
                {
                    blockdatetime: 213456789,
                    blockheight: 10,
                    coinbase: 720000000000,
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
                    coinbase: 1440000000000,
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
                    totalToBurn: 0,
                },
                {
                    publicKey: '123645782',
                    shareClass: { shareClass: 'Common', shareOwner: '' },
                    stakingBalance: 100,
                    total: 200,
                    untimedAfterSlot: 11,
                    totalToBurn: 0,
                },
            ];
            const mockResult = [
                [
                    {
                        amount: 961200000190,
                        amountMina: 0,
                        fee: 0,
                        feeMina: 0,
                        memo: 'memo',
                        publicKey: '123645789',
                    },
                    {
                        amount: 961200000190,
                        amountMina: 0,
                        fee: 0,
                        feeMina: 0,
                        memo: 'memo',
                        publicKey: '123645782',
                    },
                ],
                [
                    {
                        blockHeight: 10,
                        coinbase: 720000000000,
                        dateTime: 213456789,
                        effectiveCommonPoolStakes: 100,
                        effectiveCommonPoolWeighting: 0.5,
                        effectiveNPSPoolStakes: 100,
                        effectiveNPSPoolWeighting: 0.5,
                        effectiveSuperchargedPoolStakes: 0,
                        effectiveSuperchargedPoolWeighting: 0,
                        globalSlot: 1,
                        isEffectiveSuperCharge: false,
                        owner: '',
                        payout: 320399999995,
                        publicKey: '123645789',
                        publicKeyUntimedAfter: 11,
                        shareClass: { shareClass: 'Common', shareOwner: '' },
                        stakingBalance: 100,
                        stateHash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                        sumEffectiveCommonPoolStakes: 200,
                        sumEffectiveNPSPoolStakes: 200,
                        sumEffectiveSuperchargedPoolStakes: 0,
                        superchargedWeightingDiscount: 1.3888888888888888e-11,
                        totalRewards: 719999999991,
                        totalRewardsCommonPool: -9,
                        totalRewardsNPSPool: 720000000000,
                        totalRewardsSuperchargedPool: 0,
                        totalRewardsToBurn: 0,
                        winnerShareOwner: '',
                    },
                    {
                        blockHeight: 10,
                        coinbase: 720000000000,
                        dateTime: 213456789,
                        effectiveCommonPoolStakes: 100,
                        effectiveCommonPoolWeighting: 0.5,
                        effectiveNPSPoolStakes: 100,
                        effectiveNPSPoolWeighting: 0.5,
                        effectiveSuperchargedPoolStakes: 0,
                        effectiveSuperchargedPoolWeighting: 0,
                        globalSlot: 1,
                        isEffectiveSuperCharge: false,
                        owner: '',
                        payout: 320399999995,
                        publicKey: '123645782',
                        publicKeyUntimedAfter: 11,
                        shareClass: { shareClass: 'Common', shareOwner: '' },
                        stakingBalance: 100,
                        stateHash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                        sumEffectiveCommonPoolStakes: 200,
                        sumEffectiveNPSPoolStakes: 200,
                        sumEffectiveSuperchargedPoolStakes: 0,
                        superchargedWeightingDiscount: .000000000013888888888888888,
                        totalRewards: 719999999991,
                        totalRewardsCommonPool: -9,
                        totalRewardsNPSPool: 720000000000,
                        totalRewardsSuperchargedPool: 0,
                        totalRewardsToBurn: 0,
                        winnerShareOwner: '',
                    },
                    {
                        blockHeight: 11,
                        coinbase: 1440000000000,
                        dateTime: 213456781,
                        effectiveCommonPoolStakes: 100,
                        effectiveCommonPoolWeighting: 0.5,
                        effectiveNPSPoolStakes: 100,
                        effectiveNPSPoolWeighting: 0.5,
                        effectiveSuperchargedPoolStakes: 0,
                        effectiveSuperchargedPoolWeighting: 0,
                        globalSlot: 1,
                        isEffectiveSuperCharge: false,
                        owner: '',
                        payout: 640799999995,
                        publicKey: '123645789',
                        publicKeyUntimedAfter: 11,
                        shareClass: { shareClass: 'Common', shareOwner: '' },
                        stakingBalance: 100,
                        stateHash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                        sumEffectiveCommonPoolStakes: 200,
                        sumEffectiveNPSPoolStakes: 200,
                        sumEffectiveSuperchargedPoolStakes: 0,
                        superchargedWeightingDiscount: 6.944444444444444e-12,
                        totalRewards: 1439999999991,
                        totalRewardsCommonPool: -9,
                        totalRewardsNPSPool: 1440000000000,
                        totalRewardsSuperchargedPool: 0,
                        totalRewardsToBurn: 0,
                        winnerShareOwner: '',
                    },
                    {
                        blockHeight: 11,
                        coinbase: 1440000000000,
                        dateTime: 213456781,
                        effectiveCommonPoolStakes: 100,
                        effectiveCommonPoolWeighting: 0.5,
                        effectiveNPSPoolStakes: 100,
                        effectiveNPSPoolWeighting: 0.5,
                        effectiveSuperchargedPoolStakes: 0,
                        effectiveSuperchargedPoolWeighting: 0,
                        globalSlot: 1,
                        isEffectiveSuperCharge: false,
                        owner: '',
                        payout: 640799999995,
                        publicKey: '123645782',
                        publicKeyUntimedAfter: 11,
                        shareClass: { shareClass: 'Common', shareOwner: '' },
                        stakingBalance: 100,
                        stateHash: '0062aca83e3d7027cd77cfe03e0fe7d9',
                        sumEffectiveCommonPoolStakes: 200,
                        sumEffectiveNPSPoolStakes: 200,
                        sumEffectiveSuperchargedPoolStakes: 0,
                        superchargedWeightingDiscount: 6.944444444444444e-12,
                        totalRewards: 1439999999991,
                        totalRewardsCommonPool: -9,
                        totalRewardsNPSPool: 1440000000000,
                        totalRewardsSuperchargedPool: 0,
                        totalRewardsToBurn: 0,
                        winnerShareOwner: '',
                    },
                ],
                [10, 11],
                1922400000380,
                0,
            ];

            const commissionRates: KeyCommissionRate = {};

            return calculator
                .getPayouts(
                    mockedBlocks,
                    mockStakers,
                    200,
                    0.11,
                    0.08,
                    0.05,
                    0.08,
                    commissionRates,
                    'burnz',
                    'md5hash',
                    'memo',
                )
                .then((result) => {
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
                    coinbase: 720000000000,
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
                    coinbase: 1440000000000,
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
                    totalToBurn:0,
                },
                {
                    publicKey: '123645782',
                    shareClass: { shareClass: 'NPS', shareOwner: 'O1' },
                    stakingBalance: 100,
                    total: 200,
                    untimedAfterSlot: 11,
                    totalToBurn:0,
                },
            ];

            const commissionRates: KeyCommissionRate = {};

            return calculator
                .getPayouts(
                    mockedBlocks,
                    mockStakers,
                    10,
                    0.05,
                    0.08,
                    0.05,
                    0.08,
                    commissionRates,
                    'burnz',
                    'md5hash',
                    'memo',
                )
                .then((result) => {
                expect(result).toThrow();
            });
        });
    });
});

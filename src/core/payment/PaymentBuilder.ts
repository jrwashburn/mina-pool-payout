import { inject, injectable } from 'inversify';
import TYPES from '../../composition/Types';
import { ConfigurationManager } from '../../configuration/ConfigurationManager';
import { Block } from '../dataProvider/dataprovider-types';
import { PayoutDetails, PayoutTransaction } from '../payoutCalculator/Model';
import { IBlockDataProvider, IDataProviderFactory, IStakeDataProvider } from '../dataProvider/Models';
import { IBlockProcessor, IPaymentBuilder, PaymentProcess } from './Model';
import { IPayoutCalculator } from '../payoutCalculator/Model';

@injectable()
export class PaymentBuilder implements IPaymentBuilder {
    private blockProcessor: IBlockProcessor;
    private payoutCalculator: IPayoutCalculator;
    private stakeDataProviderFactory: IDataProviderFactory<IStakeDataProvider>;
    private blockDataProviderFactory: IDataProviderFactory<IBlockDataProvider>;

    public constructor(
        @inject(TYPES.IBlockProcessor) blockHandler: IBlockProcessor,
        @inject(TYPES.IPayoutCalculator) payoutCalculator: IPayoutCalculator,
        @inject(TYPES.BlockDataProviderFactory) blockDataProviderFactory: IDataProviderFactory<IBlockDataProvider>,
        @inject(TYPES.StakeDataProviderFactory) stakeDataProviderFactory: IDataProviderFactory<IStakeDataProvider>,
    ) {
        this.blockProcessor = blockHandler;
        this.payoutCalculator = payoutCalculator;
        this.blockDataProviderFactory = blockDataProviderFactory;
        this.stakeDataProviderFactory = stakeDataProviderFactory;
    }

    async build(): Promise<PaymentProcess> {
        const config = ConfigurationManager.Setup;

        const stakesProvider = this.stakeDataProviderFactory.build(config.blockDataSource);

        const blockProvider = this.blockDataProviderFactory.build(config.blockDataSource);

        const {
            configuredMaximum,
            minimumConfirmations,
            minimumHeight,
            stakingPoolPublicKey,
            defaultCommissionRate,
            commissionRatesByPublicKey,
        } = config;

        const latestHeight = await blockProvider.getLatestHeight();

        const maximumHeight = await this.blockProcessor.determineLastBlockHeightToProcess(
            configuredMaximum,
            minimumConfirmations,
            latestHeight,
        );

        console.log(`This script will payout from block ${minimumHeight} to maximum height ${maximumHeight}`);
        console.log(`Processing mina pool payout for block producer key: ${stakingPoolPublicKey}`);

        const blocks: Block[] = await blockProvider.getBlocks(stakingPoolPublicKey, minimumHeight, maximumHeight);

        const payouts: PayoutTransaction[] = [];

        const storePayout: PayoutDetails[] = [];

        const ledgerHashes = [...new Set(blocks.map((block) => block.stakingledgerhash))];

        return Promise.all(
            ledgerHashes.map(async (ledgerHash) => {
                console.log(`### Calculating payouts for ledger ${ledgerHash}`);

                const [stakers, totalStake] = await stakesProvider.getStakes(ledgerHash, stakingPoolPublicKey);

                console.log(`The pool total staking balance is ${totalStake}`);

                const ledgerBlocks = blocks.filter((x) => x.stakingledgerhash == ledgerHash);

                const [ledgerPayouts, ledgerStorePayout, blocksIncluded, totalPayout] =
                    await this.payoutCalculator.getPayouts(
                        ledgerBlocks,
                        stakers,
                        totalStake,
                        defaultCommissionRate,
                        commissionRatesByPublicKey,
                    );

                payouts.push(...ledgerPayouts);

                storePayout.push(...ledgerStorePayout);

                console.log(`We won these blocks: ${blocksIncluded}`);

                console.log(`The Total Payout is: ${totalPayout} nm or ${totalPayout / 1000000000} mina`);
            }),
        ).then(async () => {
            // added a sort because these payout details are hashed and need to be in a reliable order
            storePayout.sort(function (p1: PayoutDetails, p2: PayoutDetails) {
                if (p1.blockHeight + p1.publicKey < p2.blockHeight + p2.publicKey) {
                    return -1;
                }
                if (p1.blockHeight + p1.publicKey > p2.blockHeight + p2.publicKey) {
                    return 1;
                }
                return 0;
            });

            const paymentProcess: PaymentProcess = {
                payouts,
                storePayout,
                maximumHeight,
                blocks,
                totalPayoutFundsNeeded: 0,
                payoutsBeforeExclusions: [],
            };

            return paymentProcess;
        });
    }
}

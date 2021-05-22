import { PaymentConfiguration } from "../Configuration/Model";
import { Block } from "../core/dataprovider-types";
import { PayoutDetails, PayoutTransaction } from "../core/payout-calculator";
import { IBlockDataProvider, IDataProviderFactory, IStakeDataProvider } from "../DataProvider/Models";
import { IBlockProcessor, IPaymentBuilder, PaymentProcess, PayoutCalculator } from "./Model";

export class PaymentBuilder implements IPaymentBuilder {
    
    private config : PaymentConfiguration
    private blockHandler : IBlockProcessor
    private payoutCalculator : PayoutCalculator
    private blockProvider: IBlockDataProvider
    private stakesProvider: IStakeDataProvider

    public constructor(configuration : PaymentConfiguration, blockHandler: IBlockProcessor, payoutCalculator: PayoutCalculator,
                        blockDataProviderFactory: IDataProviderFactory<IBlockDataProvider>, stakeDataProviderFactory: IDataProviderFactory<IStakeDataProvider>) {
                            
        this.config = configuration
        this.blockHandler = blockHandler
        this.payoutCalculator = payoutCalculator
        this.stakesProvider = stakeDataProviderFactory.build(this.config.blockDataSource)
        this.blockProvider = blockDataProviderFactory.build(this.config.blockDataSource)
    }

    async build(): Promise<PaymentProcess> {
        
        const { configuredMaximum, minimumConfirmations, minimumHeight, stakingPoolPublicKey, commissionRate } = this.config
        
        const latestHeight = await this.blockProvider.getLatestHeight()
        
        const maximumHeight = await this.blockHandler.determineLastBlockHeightToProcess(configuredMaximum, minimumConfirmations, latestHeight)
        
        console.log(`This script will payout from block ${minimumHeight} to maximum height ${maximumHeight}`)

        let blocks : Block[] = await this.blockProvider.getBlocks(stakingPoolPublicKey, minimumHeight, maximumHeight)

        let payouts: PayoutTransaction[] = []
          
        let storePayout: PayoutDetails[] = []

        const ledgerHashes = [...new Set(blocks.map(block => block.stakingledgerhash))]

        return Promise.all(ledgerHashes.map(async ledgerHash => {
            console.log(`### Calculating payouts for ledger ${ledgerHash}`)

            const [stakers, totalStake] = await this.stakesProvider.getStakes(ledgerHash, stakingPoolPublicKey)
            
            console.log(`The pool total staking balance is ${totalStake}`);

            const ledgerBlocks = blocks.filter(x => x.stakingledgerhash == ledgerHash)

            const [ledgerPayouts, ledgerStorePayout, blocksIncluded, totalPayout] = await this.payoutCalculator.getPayouts(ledgerBlocks, stakers, totalStake, commissionRate)
            
            payouts.push(...ledgerPayouts)
            
            storePayout.push(...ledgerStorePayout)

            console.log(`We won these blocks: ${blocksIncluded}`);

            console.log(`The Total Payout is: ${totalPayout} nm or ${totalPayout / 1000000000} mina`)
        })).then( async () => {
            
            let paymentProcess : PaymentProcess = { payouts, storePayout, maximumHeight, blocks, totalPayoutFundsNeeded: 0}

            return paymentProcess
        })
    }
}
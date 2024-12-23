import { inject, injectable } from 'inversify';
import TYPES from '../../composition/Types';
import { Block } from '../dataProvider/dataprovider-types';
import { IPayoutCalculatorFactory, IPayoutCalculator, PayoutDetails, PayoutTransaction } from '../payoutCalculator/Model';
import { IBlockDataProvider, IDataProviderFactory, IStakeDataProvider } from '../dataProvider/Models';
import { IBlockProcessor, IPaymentBuilder, PaymentProcess } from './Model';
import { ConfigurationManager } from '../../configuration/ConfigurationManager';

@injectable()
export class PaymentBuilder implements IPaymentBuilder {
  private blockProcessor: IBlockProcessor;
  private payoutCalculatorFactory: IPayoutCalculatorFactory<IPayoutCalculator>;
  private stakeDataProviderFactory: IDataProviderFactory<IStakeDataProvider>;
  private blockDataProviderFactory: IDataProviderFactory<IBlockDataProvider>;

  public constructor(
    @inject(TYPES.IBlockProcessor) blockHandler: IBlockProcessor,
    @inject(TYPES.PayoutCalculatorFactory) payoutCalculatorFactory: IPayoutCalculatorFactory<IPayoutCalculator>,
    @inject(TYPES.BlockDataProviderFactory) blockDataProviderFactory: IDataProviderFactory<IBlockDataProvider>,
    @inject(TYPES.StakeDataProviderFactory) stakeDataProviderFactory: IDataProviderFactory<IStakeDataProvider>,
  ) {
    this.blockProcessor = blockHandler;
    this.payoutCalculatorFactory = payoutCalculatorFactory;
    this.blockDataProviderFactory = blockDataProviderFactory;
    this.stakeDataProviderFactory = stakeDataProviderFactory;
  }

  async build(): Promise<PaymentProcess> {
    const config = ConfigurationManager.Setup;
    const stakesProvider = this.stakeDataProviderFactory.build(config.blockDataSource);
    const blockProvider = this.blockDataProviderFactory.build(config.blockDataSource);
    const payoutCalculator = this.payoutCalculatorFactory.build(config.fork, config.payoutCalculator);

    const {
      configuredMaximum,
      minimumConfirmations,
      minimumHeight,
      stakingPoolPublicKey,
      defaultCommissionRate,
      mfCommissionRate,
      o1CommissionRate,
      investorsCommissionRate,
      commissionRatesByPublicKey,
      burnRatesByPublicKey,
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
    blocks.sort((a, b) => a.blockheight - b.blockheight);

    const payoutTransactions: PayoutTransaction[] = [];

    const payoutDetails: PayoutDetails[] = [];

    let globalTotalPayout = 0;
    let globalTotalToBurn = 0;

    const ledgerHashes = [...new Set(blocks.map((block) => block.stakingledgerhash))];

    return Promise.all(
      ledgerHashes.map(async (ledgerHash) => {
        console.log(`### Calculating payouts for ledger ${ledgerHash}`);

        const ledger = await stakesProvider.getStakes(ledgerHash, stakingPoolPublicKey);
        console.log(`The pool total staking balance is ${ledger.totalStakingBalance}`);

        const ledgerBlocks = blocks.filter((x) => x.stakingledgerhash == ledgerHash);

        const [
          ledgerPayouts,
          ledgerPayoutDetails,
          blocksIncluded,
          totalPayout,
          totalSuperchargedToBurn,
          totalNegotiatedBurn,
        ] = await payoutCalculator.getPayouts(
          ledgerBlocks,
          ledger.stakes,
          Number(ledger.totalStakingBalance),
          defaultCommissionRate,
          mfCommissionRate,
          o1CommissionRate,
          investorsCommissionRate,
          commissionRatesByPublicKey,
          burnRatesByPublicKey,
          config.burnAddress,
          config.bpKeyMd5Hash,
          config.payoutMemo,
        );
        payoutTransactions.push(...ledgerPayouts);

        globalTotalPayout = totalPayout;
        globalTotalToBurn = totalSuperchargedToBurn + totalNegotiatedBurn;
        //ADD TOTAL TO NEGOTIATED BURN

        for (let i = 0; i < ledgerPayoutDetails.length; i++) {
          payoutDetails.push(ledgerPayoutDetails[i]);
        }

        console.log(`We won these blocks: ${blocksIncluded}`);

        console.log(`The Total Payout is: ${totalPayout} nm or ${totalPayout / 1000000000} mina`);

        console.log(
          `The Total amount to burn is: ${globalTotalToBurn} nm or ${globalTotalToBurn / 1000000000} mina`,
        );
      }),
    ).then(async () => {
      // added a sort because these payout details are hashed and need to be in a reliable order
      payoutTransactions.sort((p1: PayoutTransaction, p2: PayoutTransaction) => {
        if (p1.amount !== p2.amount) {
          return p2.amount - p1.amount; // sort by amount in descending order
        }
        return p1.publicKey.localeCompare(p2.publicKey); // sort by publicKey in ascending order if amounts are equal
      });
      payoutDetails.sort(function (p1: PayoutDetails, p2: PayoutDetails) {
        if (p1.blockHeight + p1.publicKey < p2.blockHeight + p2.publicKey) {
          return -1;
        }
        if (p1.blockHeight + p1.publicKey > p2.blockHeight + p2.publicKey) {
          return 1;
        }
        return 0;
      });

      const paymentProcess: PaymentProcess = {
        payoutTransactions,
        payoutDetails,
        maximumHeight,
        blocks,
        totalPayoutFundsNeeded: 0,
        payoutsBeforeExclusions: [],
        totalPayouts: globalTotalPayout,
        totalBurn: globalTotalToBurn,
      };

      return paymentProcess;
    });
  }
}

import { Container } from 'inversify';
import 'reflect-metadata';
import TYPES from './Types.js';

import { IBlockDataProvider, IDataProviderFactory, IStakeDataProvider } from '../core/dataProvider/Models.js';
import {
  ISubstituteAndExcludePayToAddresses,
  IBlockProcessor,
  IPaymentBuilder,
  IPaymentProcessor,
  ISummarizer,
  PaymentProcess,
} from '../core/payment/Model.js';
import { IPayoutCalculator } from '../core/payoutCalculator/Model.js';
import { BlockProcessor } from '../core/payment/BlockProcessor.js';
import { PaymentBuilder } from '../core/payment/PaymentBuilder.js';
import { PaymentProcessor } from '../core/payment/PaymentProcessor.js';
import { TransactionBuilder } from '../core/transaction/TransactionBuilder.js';
import { BlockDataProviderFactory } from '../core/dataProvider/BlockDataProviderFactory.js';
import { StakeDataProviderFactory } from '../core/dataProvider/StakeDataProviderFactory.js';
import { IFileWriter } from '../shared/Model.js';
import { FileWriter } from '../shared/FileWriter.js';
import { ISender, ITransactionBuilder, ITransactionProcessor } from '../core/transaction/Model.js';
import { TransactionSender } from '../core/transaction/TransactionSender.js';
import { TransactionProcessor } from '../core/transaction/TransactionProcessor.js';
import { IPayoutCalculatorFactory } from '../core/payoutCalculator/Model.js';
import { PayoutCalculatorFactory } from '../core/payoutCalculator/PayoutCalculatorFactory.js';
import { SubstituteAndExcludePayToAddressesForSuperCharge } from '../core/payment/SubstituteAndExcludePayToAddressesForSuperCharge.js';
import { PaymentSummarizer } from '../core/payment/PaymentSummarizer.js';

const container = new Container();

container.bind<IBlockProcessor>(TYPES.IBlockProcessor).to(BlockProcessor);
container.bind<IPaymentBuilder>(TYPES.IPaymentBuilder).to(PaymentBuilder);
container.bind<IPaymentProcessor>(TYPES.IPaymentProcessor).to(PaymentProcessor);
container.bind<ITransactionBuilder>(TYPES.ITransactionBuilder).to(TransactionBuilder);
container.bind<ITransactionProcessor>(TYPES.ITransactionProcessor).to(TransactionProcessor);
container.bind<ISender>(TYPES.ISender).to(TransactionSender);
container.bind<IDataProviderFactory<IBlockDataProvider>>(TYPES.BlockDataProviderFactory).to(BlockDataProviderFactory);
container.bind<IDataProviderFactory<IStakeDataProvider>>(TYPES.StakeDataProviderFactory).to(StakeDataProviderFactory);
container.bind<IFileWriter>(TYPES.IFileWriter).to(FileWriter);
container.bind<ISummarizer<PaymentProcess>>(TYPES.PaymentSummarizer).to(PaymentSummarizer);
container.bind<IPayoutCalculatorFactory<IPayoutCalculator>>(TYPES.PayoutCalculatorFactory).to(PayoutCalculatorFactory);
container
  .bind<ISubstituteAndExcludePayToAddresses>(TYPES.IAddressRemover)
  .to(SubstituteAndExcludePayToAddressesForSuperCharge);

export default container;

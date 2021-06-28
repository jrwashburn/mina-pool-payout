import { Container } from "inversify"
import TYPES from "./Types"
import "reflect-metadata"

import { IBlockDataProvider, IDataProviderFactory, IStakeDataProvider } from "../core/dataProvider/Models"
import { IAddressRemover, IBlockProcessor, IPaymentBuilder, IPaymentProcessor } from '../core/payment/Model'
import { IPayoutCalculator } from "../core/payoutCalculator/Model"
import { BlockProcessor } from "../core/payment/BlockProcessor"
import { PaymentBuilder } from "../core/payment/PaymentBuilder"
import { PaymentProcessor } from "../core/payment/PaymentProcessor"
import { TransactionBuilder } from "../core/transaction/TransactionBuilder"
import { BlockDataProviderFactory } from "../core/dataProvider/BlockDataProviderFactory"
import { StakeDataProviderFactory } from "../core/dataProvider/StakeDataProviderFactory"
import { IFileWriter } from "../shared/Model"
import { FileWriter } from "../shared/FileWriter"
import { ISender, ITransactionBuilder, ITransactionProcessor } from "../core/transaction/Model"
import { TransactionSender } from "../core/transaction/TrasactionSender"
import { TransactionProcessor } from "../core/transaction/TransactionProcessor"
import { PayoutCalculatorIsolateSuperCharge } from "../core/payoutCalculator/PayoutCalculatorIsolateSuperCharge"
import { AddressRemoverForSuperCharge } from "../core/payment/SubstituteAndExcludePayToAddressesForSuperCharge"


var container = new Container()


container.bind<IBlockProcessor>(TYPES.IBlockProcessor).to(BlockProcessor)
container.bind<IPaymentBuilder>(TYPES.IPaymentBuilder).to(PaymentBuilder)
container.bind<IPaymentProcessor>(TYPES.IPaymentProcessor).to(PaymentProcessor)
container.bind<ITransactionBuilder>(TYPES.ITransactionBuilder).to(TransactionBuilder)
container.bind<ITransactionProcessor>(TYPES.ITransactionProcessor).to(TransactionProcessor)
container.bind<ISender>(TYPES.ISender).to(TransactionSender)
container.bind<IDataProviderFactory<IBlockDataProvider>>(TYPES.BlockDataProviderFactory).to(BlockDataProviderFactory)
container.bind<IDataProviderFactory<IStakeDataProvider>>(TYPES.StakeDataProviderFactory).to(StakeDataProviderFactory)
container.bind<IFileWriter>(TYPES.IFileWriter).to(FileWriter)
//Add a factory to change Calculator based on a setting or argument
container.bind<IPayoutCalculator>(TYPES.IPayoutCalculator).to(PayoutCalculatorIsolateSuperCharge) 
container.bind<IAddressRemover>(TYPES.IAddressRemover).to(AddressRemoverForSuperCharge)
export default container

import { Container } from "inversify"
import TYPES from "./Types"
import "reflect-metadata"

import { IBlockDataProvider, IDataProviderFactory, IStakeDataProvider } from "../DataProvider/Models"
import { IAddressRemover, IBlockProcessor, IPaymentBuilder, IPaymentProcessor, IPayoutCalculator, ISender, ITransactionBuilder, ITransactionProcessor } from '../Payment/Model'
import { AddressRemover } from "../Payment/AddressRemover"
import { BlockProcessor } from "../Payment/BlockProcessor"
import { PaymentBuilder } from "../Payment/PaymentBuilder"
import { PaymentProcessor } from "../Payment/PaymentProcessor"
import { PayoutCalculator } from "../Payment/PayoutCalculator"
import { TransactionBuilder } from "../Payment/TransactionBuilder"
import { TransactionProcessor } from "../Payment/TransactionProcessor"
import { TransactionSender } from "../Payment/TrasactionSender"
import { BlockDataProviderFactory } from "../DataProvider/BlockDataProviderFactory"
import { StakeDataProviderFactory } from "../DataProvider/StakeDataProviderFactory"
import { IFileWriter } from "../Shared/Model"
import { FileWriter } from "../Shared/FileWriter"


var container = new Container()

container.bind<IAddressRemover>(TYPES.IAddressRemover).to(AddressRemover)
container.bind<IBlockProcessor>(TYPES.IBlockProcessor).to(BlockProcessor)
container.bind<IPaymentBuilder>(TYPES.IPaymentBuilder).to(PaymentBuilder)
container.bind<IPaymentProcessor>(TYPES.IPaymentProcessor).to(PaymentProcessor)
container.bind<IPayoutCalculator>(TYPES.IPayoutCalculator).to(PayoutCalculator)
container.bind<ITransactionBuilder>(TYPES.ITransactionBuilder).to(TransactionBuilder)
container.bind<ITransactionProcessor>(TYPES.ITransactionProcessor).to(TransactionProcessor)
container.bind<ISender>(TYPES.ISender).to(TransactionSender)
container.bind<IDataProviderFactory<IBlockDataProvider>>(TYPES.BlockDataProviderFactory).to(BlockDataProviderFactory)
container.bind<IDataProviderFactory<IStakeDataProvider>>(TYPES.StakeDataProviderFactory).to(StakeDataProviderFactory)
container.bind<IFileWriter>(TYPES.IFileWriter).to(FileWriter)

export default container

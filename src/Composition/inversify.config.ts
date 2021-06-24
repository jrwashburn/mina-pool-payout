import { Container } from "inversify"
import TYPES from "./Types"
import "reflect-metadata"

import { IBlockDataProvider, IDataProviderFactory, IStakeDataProvider } from "../Core/DataProvider/Models"
import { IAddressRemover, IBlockProcessor, IPaymentBuilder, IPaymentProcessor } from '../Core/Payment/Model'
import { IPayoutCalculator } from "../Core/PayoutCalculator/Model"
import { BlockProcessor } from "../Core/Payment/BlockProcessor"
import { PaymentBuilder } from "../Core/Payment/PaymentBuilder"
import { PaymentProcessor } from "../Core/Payment/PaymentProcessor"
import { TransactionBuilder } from "../Core/Transaction/TransactionBuilder"
import { BlockDataProviderFactory } from "../Core/DataProvider/BlockDataProviderFactory"
import { StakeDataProviderFactory } from "../Core/DataProvider/StakeDataProviderFactory"
import { IFileWriter } from "../Shared/Model"
import { FileWriter } from "../Shared/FileWriter"
import { ISender, ITransactionBuilder, ITransactionProcessor } from "../Core/Transaction/Model"
import { TransactionSender } from "../Core/Transaction/TrasactionSender"
import { TransactionProcessor } from "../Core/Transaction/TransactionProcessor"
import { PayoutCalculatorIsolateSuperCharge } from "../Core/PayoutCalculator/PayoutCalculatorIsolateSuperCharge"
import { AddressRemoverForSuperCharge } from "../Core/Payment/AddressRemoverForSuperCharge"


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

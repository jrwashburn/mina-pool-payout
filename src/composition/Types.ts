const TYPES = {
  BlockDataProviderFactory: Symbol('BlockDataProviderFactory'),
  StakeDataProviderFactory: Symbol('StakeDataProviderFactory'),
  PayoutCalculatorFactory: Symbol('PayoutCalculatorFactory'),
  IAddressRemover: Symbol('IAddressRemover'),
  IBlockProcessor: Symbol('IBlockProcessor'),
  IPaymentBuilder: Symbol('IPaymentBuilder'),
  IPaymentProcessor: Symbol('IPaymentProcessor'),
  ITransactionBuilder: Symbol('ITransactionBuilder'),
  ITransactionProcessor: Symbol('ITransactionWriter'),
  ISender: Symbol('ITransactionSender'),
  IFileWriter: Symbol('IFileWriter'),
  PaymentConfiguration: Symbol('PaymentConfiguration'),
  PaymentSummarizer: Symbol('PaymentSummarizer'),
};

export default TYPES;

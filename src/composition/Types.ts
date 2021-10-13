const TYPES = {
    ArchiveBlockDataProvider: Symbol('ArchiveBlockDataProvider'),
    ArchiveStakesDataProvider: Symbol('ArchiveStakesDataProvider'),
    BlockDataProviderFactory: Symbol('BlockDataProviderFactory'),
    MinaExplorerDataProvider: Symbol('MinaExplorerDataProvider'),
    MinaExplorerStakeDataProvider: Symbol('MinaExplorerStakeDataProvider'),
    StakeDataProviderFactory: Symbol('StakeDataProviderFactory'),
    FeeCalculatorFactory: Symbol('FeeCalculatorFactory'),
    IFeeCalculator: Symbol('IFeeCalculator'),
    IAddressRemover: Symbol('IAddressRemover'),
    IBlockProcessor: Symbol('IBlockProcessor'),
    IPaymentBuilder: Symbol('IPaymentBuilder'),
    IPaymentProcessor: Symbol('IPaymentProcessor'),
    IPayoutCalculator: Symbol('IPayoutCalculator'),
    ITransactionBuilder: Symbol('ITransactionBuilder'),
    ITransactionProcessor: Symbol('ITransactionWriter'),
    ISender: Symbol('ITransactionSender'),
    IFileWriter: Symbol('IFileWriter'),
    PaymentConfiguration: Symbol('PaymentConfiguration'),
    PaymentSummarizer: Symbol('PaymentSummarizer'),
};

export default TYPES;

import { PaymentConfiguration } from './Model';

export class ConfigurationManager {
    public static Setup: PaymentConfiguration;
    public static async build(args: any) {
        this.Setup = {
            commissionRate: Number(process.env.COMMISSION_RATE),
            stakingPoolPublicKey: process.env.POOL_PUBLIC_KEY || '',
            payoutMemo: process.env.POOL_MEMO || 'mina-pool-payout',
            senderKeys: {
                privateKey: process.env.SEND_PRIVATE_KEY || '',
                publicKey: process.env.SEND_PUBLIC_KEY || '',
            },
            payorSendTransactionFee: (Number(process.env.SEND_TRANSACTION_FEE) || 0) * 1000000000,
            minimumConfirmations: Number(process.env.MIN_CONFIRMATIONS) || 290,
            minimumHeight: args.minheight,
            configuredMaximum: args.maxheight,
            blockDataSource: process.env.BLOCK_DATA_SOURCE || 'ARCHIVEDB',
            verbose: args.verbose,
            payoutHash: args.payouthash,
            payoutThreshold: Number(process.env.SEND_PAYOUT_THRESHOLD) * 1000000000 || 0,
        };
        if (Number.isNaN(this.Setup.commissionRate)) {
            console.log('ERROR: Comission Rate is not a number - please set COMMISSION_RATE in .env file');
            throw new Error('.env COMMISSION_RATE not set');
        }
        if (this.Setup.payorSendTransactionFee < 1000000) {
            console.log(
                'WARNING: Payor Send Transaction Fee is too low or not specified, set SEND_TRANSACTION_FEE of at least 0.001 in .env file',
            );
        }
        if (this.Setup.stakingPoolPublicKey === '') {
            console.log('WARNING: Staking Pool Public Key not provided - please specify POOL_PUBLIC_KEY in .env file');
        }
    }
}

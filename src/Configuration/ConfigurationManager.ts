import { PaymentConfiguration } from "./Model"

export class ConfigurationManager {

    public static Setup : PaymentConfiguration
    public static async build(args: any) {
        this.Setup = {
            commissionRate: Number(process.env.COMMISSION_RATE) || 0.05,
            stakingPoolPublicKey : process.env.POOL_PUBLIC_KEY || "",
            payoutMemo : process.env.POOL_MEMO || "",
            senderKeys : {
                privateKey: process.env.SEND_PRIVATE_KEY || "",
                publicKey: process.env.SEND_PUBLIC_KEY || ""
            },
            payorSendTransactionFee : (Number(process.env.SEND_TRANSACTION_FEE) || 0) * 1000000000,
            minimumConfirmations : Number(process.env.MIN_CONFIRMATIONS) || 290,
            minimumHeight : args.minheight,
            configuredMaximum : args.maxheight,
            blockDataSource : process.env.BLOCK_DATA_SOURCE || 'ARCHIVEDB',
            verbose : args.verbose,
            payoutHash: args.payouthash,
            payoutThreshold : Number(process.env.SEND_PAYOUT_THRESHOLD) * 1000000000 || 0
        }
        
    }

}
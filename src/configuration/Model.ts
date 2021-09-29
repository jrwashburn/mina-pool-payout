import { keypair } from '@o1labs/client-sdk';

export interface PaymentConfiguration {
    commissionRate: number;
    stakingPoolPublicKey: string;
    payoutMemo: string;
    payorSendTransactionFee: number;
    senderKeys: keypair;
    minimumConfirmations: number;
    minimumHeight: number;
    configuredMaximum: number;
    blockDataSource: string;
    verbose: boolean;
    payoutHash: string;
    payoutThreshold: number;
}

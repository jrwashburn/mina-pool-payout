import { keypair } from '@o1labs/client-sdk';

export interface PaymentConfiguration {
    blockDataSource: string;
    commissionRatesByPublicKey: KeyCommissionRate;
    configuredMaximum: number;
    defaultCommissionRate: number;
    mfCommissionRate: number;
    o1CommissionRate: number;
    epoch: number;
    minimumConfirmations: number;
    minimumHeight: number;
    payoutHash: string;
    payoutMemo: string;
    payorSendTransactionFee: number;
    payoutThreshold: number;
    senderKeys: keypair;
    slotsInEpoch: number;
    stakingPoolPublicKey: string;
    verbose: boolean;
}

export interface KeyCommissionRate {
    [publicKey: string]: { commissionRate: number };
}

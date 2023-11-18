import { keypair } from '@o1labs/client-sdk';

export interface PaymentConfiguration {
    blockDataSource: string;
    commissionRatesByPublicKey: KeyCommissionRate;
    configuredMaximum: number;
    defaultCommissionRate: number;
    mfCommissionRate: number;
    o1CommissionRate: number;
    investorsCommissionRate: number;
    epoch: number;
    minimumConfirmations: number;
    minimumHeight: number;
    payoutHash: string;
    payoutMemo: string;
    bpKeyMd5Hash: string;
    payorSendTransactionFee: number;
    payoutThreshold: number;
    senderKeys: keypair;
    slotsInEpoch: number;
    stakingPoolPublicKey: string;
    verbose: boolean;
    burnAddress: string;
}

export interface KeyCommissionRate {
    [publicKey: string]: { commissionRate: number , burnSuperchargedRewards: boolean};
}

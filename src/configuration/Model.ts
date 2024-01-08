import { keypair } from '@o1labs/client-sdk';

export interface PaymentConfiguration {
    blockDataSource: string;
    bpKeyMd5Hash: string;
    burnAddress: string;
    burnRatesByPublicKey: KeyedRate;
    commissionRatesByPublicKey: KeyedRate;
    configuredMaximum: number;
    defaultCommissionRate: number;
    epoch: number;
    investorsCommissionRate: number;
    mfCommissionRate: number;
    minimumConfirmations: number;
    minimumHeight: number;
    o1CommissionRate: number;
    payoutHash: string;
    payoutMemo: string;
    payorSendTransactionFee: number;
    payoutThreshold: number;
    senderKeys: keypair;
    slotsInEpoch: number;
    stakingPoolPublicKey: string;
    verbose: boolean;
}

export interface KeyedRate {
    [publicKey: string]: { rate: number };
}

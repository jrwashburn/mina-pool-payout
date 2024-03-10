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
    fork: number;
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

const baseUrl = process.env.PAYOUT_DATA_PROVIDER_API_ENDPOINT;
if (!baseUrl) {
    throw new Error('The PAYOUT_API_ENDPOINT environment variable is not set.');
}
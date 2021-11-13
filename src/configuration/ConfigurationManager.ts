import { PaymentConfiguration, KeyCommissionRate } from './Model';
import fs from 'fs';
import { getCommentRange } from 'typescript';

export class ConfigurationManager {
    public static Setup: PaymentConfiguration;
    public static async build(args: any) {
        this.Setup = {
            defaultCommissionRate: Number(process.env.COMMISSION_RATE),
            commissionRatesByPublicKey: await getComissionRates(),
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
            payoutThreshold: Number(process.env.SEND_PAYOUT_THRESHOLD) * 1000000000 || 0
        };
        if (Number.isNaN(this.Setup.defaultCommissionRate)) {
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

const getComissionRates = async (): Promise<KeyCommissionRate> => {
    const path = `${__dirname}/../data/.negotiatedFees`;

    if (fs.existsSync(path)) {
        let commissionRates: KeyCommissionRate = {}

        console.log('Found .negotiatedFees file. Using Payor Specific Commission Rates.')

        const raw = fs.readFileSync(path, 'utf-8');

        const rows = raw.split(/\r?\n/);
        
        rows.forEach((x, index) => {
            const [key, rate] = x.split('|');

            const takeRate = Number.parseFloat(rate);
            
            const result = validateCommission(key, takeRate, index);
            
            if (!result.isValid) {
                console.log(result.error);
                throw new Error(result.error);
            }

            commissionRates[key] = { commissionRate: takeRate };
        });

        return commissionRates;
    }

    return {};
};

const validateCommission = (key : string, rate :number, index: number) => {
    const line = index + 1;

    let result = { error: "", isValid: false}

    if (!key) {
        return { ...result, error: `ERROR: Public Key is invalid at line ${line}. `}
    }

    if (isNaN(rate)) {
        return { ...result, error: `ERROR: Negotiated Fee is not a number. Key: ${key} at line ${line}.`}
    }

    if (rate < 0.0 || rate > 0.5) {
        return { ...result, error: `ERROR: Negotiated Fees is outside of acceptable ranges 0.0-0.5. Key: ${key} at line ${line}.`}
    }

    return { ...result, isValid: true}
}

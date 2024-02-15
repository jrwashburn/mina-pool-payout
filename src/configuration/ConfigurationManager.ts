import { PaymentConfiguration, KeyedRate } from './Model';
import fs from 'fs';
import Container from '../composition/inversify.config';
import { IBlockDataProvider, IDataProviderFactory } from '../core/dataProvider/Models';
import TYPES from '../composition/Types';
import { createHash } from 'node:crypto';

export class ConfigurationManager {
    public static Setup: PaymentConfiguration;
    public static async build(args: any) {
        this.Setup = {
            defaultCommissionRate: Number(process.env.COMMISSION_RATE),
            mfCommissionRate: Number(process.env.MF_COMMISSION_RATE || 0.08),
            o1CommissionRate: Number(process.env.O1_COMMISSION_RATE || 0.05),
            investorsCommissionRate: Number(process.env.INVESTORS_COMMISSION_RATE || 0.08),
            epoch: args.epoch ?? Number(args.epoch),
            slotsInEpoch: Number(process.env.NUM_SLOTS_IN_EPOCH),
            commissionRatesByPublicKey: await getComissionRates(),
            burnRatesByPublicKey: await getBurnRates(),
            stakingPoolPublicKey: process.env.POOL_PUBLIC_KEY || '',
            payoutMemo: process.env.POOL_MEMO || 'mina-pool-payout',
            bpKeyMd5Hash: getMemoMd5Hash(process.env.POOL_PUBLIC_KEY || ''),
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
            burnAddress: 'B62qiburnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmp7r7UN6X',
        };

        await this.validate();

        if (this.Setup.epoch) {
            await this.setupEpochMode();
        }
    }

    private static async setupEpochMode() {
        console.log(`Working for configured Epoch: ${this.Setup.epoch}`);

        const dataProvider = Container.get<IDataProviderFactory<IBlockDataProvider>>(TYPES.BlockDataProviderFactory);

        const provider = dataProvider.build(this.Setup.blockDataSource);

        const { min, max } = await provider.getMinMaxBlocksByEpoch(this.Setup.epoch);

        this.Setup.minimumHeight = min;

        this.Setup.configuredMaximum = max;

        console.log(
            `Epoch Minimum Height: ${this.Setup.minimumHeight} - Epoch Maximum Height: ${this.Setup.configuredMaximum}`,
        );
    }

    private static async validate() {
        if (Number.isNaN(this.Setup.defaultCommissionRate)) {
            console.log('ERROR: Comission Rate is not a number - please set COMMISSION_RATE in .env file');
            throw new Error('.env COMMISSION_RATE not set');
        }
        if (Number.isNaN(this.Setup.o1CommissionRate)) {
            console.log('ERROR: Comission Rate is not a number - please set O1_COMMISSION_RATE in .env file');
            throw new Error('.env COMMISSION_RATE not set');
        }
        if (Number.isNaN(this.Setup.mfCommissionRate)) {
            console.log('ERROR: Comission Rate is not a number - please set MF_COMMISSION_RATE in .env file');
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

        if (!this.Setup.epoch && (!this.Setup.minimumHeight || !this.Setup.configuredMaximum)) {
            const msg = 'ERROR: Minimum or maximum block height not provided.';
            console.log(msg);
            throw new Error(msg);
        }
    }
}

const getComissionRates = async (): Promise<KeyedRate> => {
    const path = `${__dirname}/../data/.negotiatedFees`;
    const arbitraryMaxRate = 0.5;
    return getKeyedRates(path, arbitraryMaxRate);
};

const getBurnRates = async (): Promise<KeyedRate> => {
    const path = `${__dirname}/../data/.negotiatedBurn`;
    const arbitraryMaxRate = 1.0;
    return getKeyedRates(path, arbitraryMaxRate);
};

const getKeyedRates = async (configurationPath: string, maxRate: number): Promise<KeyedRate> => {
    const keyedList: KeyedRate = {};
    if (fs.existsSync(configurationPath)) {
        console.log(`Found ${configurationPath} file. Using Specific Rates.`);

        const raw = fs.readFileSync(configurationPath, 'utf-8');

        const rows = raw.split(/\r?\n/).filter((row) => row);

        rows.forEach((x, index) => {
            const [key, rate] = x.split('|');

            const parsedRate = Number.parseFloat(rate);

            const result = validateRate(key, parsedRate, index, maxRate);

            if (!result.isValid) {
                console.log(result.error);
                throw new Error(result.error);
            }

            keyedList[key] = { rate: parsedRate };
        });
    }
    return keyedList;
};

const validateRate = (key: string, rate: number, index: number, maxRate: number) => {
    const line = index + 1;

    const result = { error: '', isValid: false };

    if (!key) {
        return { ...result, error: `ERROR: Public Key is invalid at line ${line}. ` };
    }

    if (isNaN(rate)) {
        return { ...result, error: `ERROR: Negotiated Rate is not a number. Key: ${key} at line ${line}.` };
    }

    if (rate < 0.0 || rate > maxRate) {
        return {
            ...result,
            error: `ERROR: Negotiated Rate is outside of acceptable ranges 0.0-${maxRate}. Key: ${key} at line ${line}.`,
        };
    }

    return { ...result, isValid: true };
};

const getMemoMd5Hash = (memo: string) => {
    if (typeof memo !== 'string' || memo.length === 0) {
        return createHash('md5').update('default-memo-value').digest('hex');
    } else {
        return createHash('md5').update(memo).digest('hex');
    }
};

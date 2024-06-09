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
      fork: args.fork ?? null,
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
      doNotTransmit: args.donottransmit || false,
      doNotSaveTransactionDetails: (process.env.DO_NOT_SAVE_TRANSACTION_DETAILS?.toLowerCase() === 'true') || false,
    };

    await this.validate();

    if (Number.isInteger(this.Setup.epoch)) {
      await this.setupEpochMode();
    }
  }

  private static async setupEpochMode() {
    console.log(`Working for configured Epoch: ${this.Setup.epoch} for Fork: ${this.Setup.fork}`);

    const dataProvider = Container.get<IDataProviderFactory<IBlockDataProvider>>(TYPES.BlockDataProviderFactory);

    const provider = dataProvider.build(this.Setup.blockDataSource);

    const { min, max } = await provider.getMinMaxBlocksByEpoch(this.Setup.epoch, this.Setup.fork);

    this.Setup.minimumHeight = min;

    this.Setup.configuredMaximum = max;

    console.log(
      `Epoch Minimum Height: ${this.Setup.minimumHeight} - Epoch Maximum Height: ${this.Setup.configuredMaximum}`,
    );
  }

  private static async validate() {
    let msg = '';
    if (Number.isNaN(this.Setup.defaultCommissionRate)) {
      msg += 'ERROR: Comission Rate is not a number - please set COMMISSION_RATE in .env file';
    }
    if (Number.isNaN(this.Setup.o1CommissionRate)) {
      msg += 'ERROR: Comission Rate is not a number - please set O1_COMMISSION_RATE in .env file';
    }
    if (Number.isNaN(this.Setup.mfCommissionRate)) {
      msg += 'ERROR: Comission Rate is not a number - please set MF_COMMISSION_RATE in .env file';
    }
    if (this.Setup.payorSendTransactionFee < 1000000) {
      msg += 'ERROR: Payor Send Transaction Fee is too low or not specified, set SEND_TRANSACTION_FEE of at least 0.001 in .env file';
    }
    if (this.Setup.stakingPoolPublicKey === '') {
      msg += 'ERROR: Staking Pool Public Key not provided - please specify POOL_PUBLIC_KEY in .env file';
    }
    if (!Number.isInteger(this.Setup.epoch) && (!this.Setup.minimumHeight || !this.Setup.configuredMaximum)) {
      msg += 'ERROR: Minimum or maximum block height not provided.';
    }
    if (Number.isInteger(this.Setup.epoch) && !Number.isInteger(this.Setup.fork)) {
      msg += `ERROR: Must provide fork number when processing by epoch - e.g. "npm run payout -- -e ${this.Setup.epoch} -f 0"`;
    }
    if (this.Setup.fork < 0 || this.Setup.fork > 1) {
      msg += 'ERROR: Fork number must be 0 or 1. Data provider must be updated to be aware of any additional forks.';
    }
    if (this.Setup.fork == 1 && (this.Setup.blockDataSource === 'ARCHIVEDB' || this.Setup.blockDataSource === 'MINAEXPLORER')) {
      msg += 'ERROR: Fork 1 is not currently supported by ARCHIVEDB or MINAEXPLORER data sources.';
    }
    if (msg !== '') {
      console.log('\x1b[31m%s\x1b[0m', msg);
      process.exit(1);
    }
    if (this.Setup.blockDataSource === 'ARCHIVEDB') {
      console.log('\x1b[31m%s\x1b[0m', '******************************');
      console.log('\x1b[31m%s\x1b[0m', 'WARNING: ARCHIVEDB data source only supports fork 0 currently. Please get in touch with @jrwashburn to notify that you need archivedb support for the hard fork.');
      console.log('\x1b[31m%s\x1b[0m', '******************************');
    }
    if (this.Setup.blockDataSource === 'MINAEXPLORER') {
      console.log('\x1b[31m%s\x1b[0m', '******************************');
      console.log('\x1b[31m%s\x1b[0m', 'WARNING: MINAEXPLORER data source will be deprecated at the hard fork. Switch to alternative api providers such as api.minastakes.com or the Mina Foundation equivalent.');
      console.log('\x1b[31m%s\x1b[0m', '******************************');
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

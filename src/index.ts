import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ConfigurationManager } from './configuration/ConfigurationManager.js';
import Container from './composition/inversify.config.js';
import { IPaymentProcessor } from './core/payment/Model.js';
import { PaymentConfiguration } from './configuration/Model.js';
import TYPES from './composition/Types.js';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { getDirname } from './utils/path-helpers.js';

const __dirname = getDirname(import.meta.url);

// TODO: create mina currency types

const { version } = JSON.parse(
  readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'),
) as { version: string };

const oargs = yargs(hideBin(process.argv)).options({
  payouthash: { type: 'string', alias: ['h', 'hash'] },
  minheight: { type: 'number', alias: ['m', 'min'] },
  maxheight: { type: 'number', alias: ['x', 'max'], default: Number.MAX_VALUE },
  verbose: { type: 'boolean', alias: ['v'], default: false },
  epoch: { type: 'number', alias: ['e'] },
  fork: { type: 'number', alias: ['f'] },
  donottransmit: { type: 'boolean', alias: ['d'], default: false },
  legacyjsonformat: { type: 'boolean', alias: ['l'], default: false },
}).argv;

const main = async () => {
  console.log(`*** MINAPOOL PAYOUT ${version} ***\n`);

  await ConfigurationManager.build(oargs);
  const configuration = ConfigurationManager.Setup;
  await isValid(configuration)

  const payment = Container.get<IPaymentProcessor>(TYPES.IPaymentProcessor);

  payment.run(configuration);
};

async function isValid(config: PaymentConfiguration): Promise<boolean> {
  if (
    config.blockDataSource != 'ARCHIVEDB' &&
    config.blockDataSource != 'MINAEXPLORER' &&
    config.blockDataSource != 'API'
  ) {
    return false;
  }
  return true;
}

main();

import yargs from 'yargs';
import { ConfigurationManager } from './configuration/ConfigurationManager';
import Container from './composition/inversify.config';
import { IPaymentProcessor } from './core/payment/Model';
import { PaymentConfiguration } from './configuration/Model';
import TYPES from './composition/Types';
import { readFileSync } from 'fs';
import path from 'path';

// TODO: create mina currency types

const { version } = JSON.parse(
  readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'),
) as { version: string };

const oargs = yargs.options({
  payouthash: { type: 'string', alias: ['h', 'hash'] },
  minheight: { type: 'number', alias: ['m', 'min'] },
  maxheight: { type: 'number', alias: ['x', 'max'], default: Number.MAX_VALUE },
  verbose: { type: 'boolean', alias: ['v'], default: false },
  epoch: { type: 'number', alias: ['e'] },
  fork: { type: 'number', alias: ['f'] },
  donottransmit: { type: 'boolean', alias: ['d'], default: false },
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

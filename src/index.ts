import yargs from 'yargs';
import Container from './composition/inversify.config';
import { IPaymentProcessor } from './core/payment/Model';
import TYPES from './composition/Types';
import { version } from '../package.json';

// TODO: create mina currency types

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

  const payment = Container.get<IPaymentProcessor>(TYPES.IPaymentProcessor);

  payment.run(oargs);
};

main();

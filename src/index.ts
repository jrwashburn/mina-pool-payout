import yargs from 'yargs';
import Container from './composition/inversify.config';
import { IPaymentProcessor } from './core/payment/Model';
import TYPES from './composition/Types';

// TODO: create mina currency types

const oargs = yargs.options({
    payouthash: { type: 'string', alias: ['h', 'hash'] },
    minheight: { type: 'number', alias: ['m', 'min'] },
    maxheight: { type: 'number', alias: ['x', 'max'], default: Number.MAX_VALUE },
    verbose: { type: 'boolean', alias: ['v'], default: false },
    epoch: { type: 'number', alias: ['e'] },
}).argv;

const main = async () => {
    console.log('*** MINAPOOL PAYOUT v0.0.1 ***\n');

    const payment = Container.get<IPaymentProcessor>(TYPES.IPaymentProcessor);

    payment.run(oargs);
};

main();

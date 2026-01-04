import { resendSignedPaymentFromFile } from './utils/resend-payment.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const args = yargs(hideBin(process.argv)).options({
  fromNonce: { type: 'number', alias: ['f'] },
  toNonce: { type: 'number', alias: ['t'] },
}).argv;
console.log('*** RESENDING TRANSACTIONS ***\n');
resendSignedPaymentFromFile(args);

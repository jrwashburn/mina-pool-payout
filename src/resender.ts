import { resendSignedPaymentFromFile } from './utils/resend-payment';
import yargs from 'yargs';
const args = yargs.options('fromNonce', { type: 'number', alias: ['f'] }).argv;
console.log('*** RESENDING TRANSACTIONS ***\n');
resendSignedPaymentFromFile(args);

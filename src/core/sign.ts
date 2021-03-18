import { keypair, payment, signPayment as mSignPayment } from "mainnet-client-sdk";
import { signPayment as tSignPayment } from "testnet-client-sdk";
import { PayoutTransaction } from "./payouts";
import fs from "fs";

const signPayment = 
    typeof(process.env.TESTNET) === 'string' && 
    process.env.TESTNET.toLowerCase() == 'true' ?
    tSignPayment :
    mSignPayment;

export async function signTransactionsToSend(payoutsToSign: PayoutTransaction[], keys: keypair, nonce: number) {
    payoutsToSign.forEach((payout: PayoutTransaction) => {
        const paymentTransaction: payment = { to: payout.publicKey, from: keys.publicKey, fee: payout.fee, amount: payout.amount, nonce: nonce };
        try {
            const signedPayment = signPayment(paymentTransaction, keys);
            const data = JSON.stringify(signedPayment);
            // Writes them to a file by nonce for broadcasting
            fs.writeFileSync("./src/data/" + nonce + ".json", data);
            nonce++;
        }
        catch (Error) { console.log(Error); }
        finally { };
    });
};



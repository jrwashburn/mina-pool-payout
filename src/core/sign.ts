import { keypair, payment, signPayment as mSignPayment } from "mainnet-client-sdk";
import { signPayment as tSignPayment } from "testnet-client-sdk";
import { PayoutTransaction } from "./payouts";
import fs from "fs";
import { getNonce, sendSignedPayment } from "./graph-queries";
import { sign } from "node:crypto";

const signPayment =
    typeof (process.env.TESTNET) === 'string' &&
        process.env.TESTNET.toLowerCase() == 'true' ?
        tSignPayment :
        mSignPayment;

export async function signTransactionsWithOptionalSend(payoutsToSign: PayoutTransaction[], keys: keypair, memo: string, signOnly: boolean, signOnlyNonce: number) {
    let nonce = signOnly ? signOnlyNonce : await getNonce(keys.publicKey);
    payoutsToSign.reduce(async (previousPromise, payout) => {
        await previousPromise;
        return new Promise<void>((resolve, reject) => {
            setTimeout(async () => {
                console.log(`#### Processing nonce ${nonce}...`);
                const paymentTransaction: payment = { to: payout.publicKey, from: keys.publicKey, fee: payout.fee, amount: payout.amount, nonce: nonce, memo: memo };
                try {
                    const signedPayment = signPayment(paymentTransaction, keys);
                    if (!signOnly) {
                        const data = await sendSignedPayment(signedPayment);
                    }
                    // Writes them to a file by nonce for broadcasting
                    fs.writeFileSync("./src/data/" + nonce + ".json", JSON.stringify(data));
                    nonce++;
                }
                catch (Error) { console.log(Error); }
                finally { };
                resolve();
            }, 5000); //TODO: Move timeout to .env
        });
    }, Promise.resolve());
};

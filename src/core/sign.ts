import { signPayment, keypair, payment } from "@o1labs/client-sdk";
import { PayoutTransaction } from "./payouts";
import fs from "fs";
import { getNonce, sendSignedPayment } from "./graph-queries";

export async function sendSignedTransactions(payoutsToSign: PayoutTransaction[], keys: keypair, memo: string) {
    let nonce = await getNonce(keys.publicKey);
    payoutsToSign.reduce( async (previousPromise, payout) => {
        await previousPromise;
        return new Promise<void>((resolve, reject) => {
            setTimeout(async () => {
                console.log(`#### Processing nonce ${nonce}...`);
                const paymentTransaction: payment = { to: payout.publicKey, from: keys.publicKey, fee: payout.fee, amount: payout.amount, nonce: nonce, memo: memo };
                try {
                    const signedPayment = signPayment(paymentTransaction, keys);
                    const data = await sendSignedPayment(signedPayment);
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

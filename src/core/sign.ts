import CodaSDK, { signPayment, keypair, payment } from "@o1labs/client-sdk";
import { PayoutTransaction } from "./payouts";

export async function signTransactionsToSend(payoutsToSign: PayoutTransaction[], keys: keypair): Promise<void> {
    const payorPublicKey: string = process.env.PAYOR_PUBLIC_KEY || "";
    let nonce = Number(process.env.STARTING_NONCE) || 0;
    let fs = require('fs');

    payoutsToSign.forEach((payout: PayoutTransaction) => {
        let paymentTransaction: payment = { to: payout.publicKey, from: payorPublicKey, fee: payout.fee, amount: payout.amount, nonce: nonce };
        try {
            let signedPayment = signPayment(paymentTransaction, keys);
            let data = JSON.stringify(signedPayment);
            // Writes them to a file by nonce for broadcasting
            fs.writeFileSync("./src/data/" + nonce + ".json", data);
            nonce++;
        }
        catch (Error) { console.log(Error); }
        finally { };
    });
    return;
};

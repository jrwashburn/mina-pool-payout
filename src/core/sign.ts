import { signPayment, keypair, payment } from "@o1labs/client-sdk";
import { PayoutTransaction } from "./payouts";
import fs from "fs";
import { sendSignedPayment } from "./graph-queries";

export async function sendSignedTransactions(payoutsToSign: PayoutTransaction[], keys: keypair, nonce: number) {
    payoutsToSign.forEach((payout: PayoutTransaction) => {
        const paymentTransaction: payment = { to: payout.publicKey, from: keys.publicKey, fee: payout.fee, amount: payout.amount, nonce: nonce };
        try {
            const signedPayment = signPayment(paymentTransaction, keys);
            const data = sendSignedPayment(signedPayment);
            // Writes them to a file by nonce for broadcasting
            fs.writeFileSync("./src/data/" + nonce + ".json", JSON.stringify(data));
            nonce++;
        }
        catch (Error) { console.log(Error); }
        finally { };
    });
};



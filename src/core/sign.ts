import CodaSDK, { signPayment, keypair, payment } from "@o1labs/client-sdk";
import { PayoutTransaction } from "./payouts";
import fs from "fs";

export async function signTransactionsToSend(payoutsToSign: PayoutTransaction[], keys: keypair) {
    const payorPublicKey: string = process.env.PAYOR_PUBLIC_KEY || "";
    let nonce = Number(process.env.STARTING_NONCE) || 0;

    payoutsToSign.forEach((payout: PayoutTransaction) => {
        const paymentTransaction: payment = { to: payout.publicKey, from: payorPublicKey, fee: payout.fee, amount: payout.amount, nonce: nonce };
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

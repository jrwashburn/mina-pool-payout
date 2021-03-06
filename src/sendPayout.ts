import CodaSDK, { keypair } from "@o1labs/client-sdk";
import { PayoutTransaction } from "./core/payouts";
import { payment } from "@o1labs/client-sdk";

export async function SignTransactionsToSend() {
    const payorPublicKey: string = process.env.PAYOR_PUBLIC_KEY || "";
    let nonce = Number(process.env.STARTING_NONCE) || 0;
    let senderKeys: keypair = {
        privateKey: "ABC", //privatekey(process.env.PRIVATE_KEY),
        publicKey: "CDE" //process.env.PUBLIC_KEY
    };

    let fs = require('fs');

    const toProcessFolder = './data/toProcess/';
    let transactionList: any;

    const files = fs.readdir(toProcessFolder);
    files.array.forEach((f: any) => {
        fs.readFile(f, 'utf8', (err: any, jsonString: string) => {
            if (err) throw err;
            transactionList = JSON.parse(jsonString);
        });
        transactionList.foreach((payout: PayoutTransaction) => {
            let paymentTransaction: payment = { to: payout.publicKey, from: payorPublicKey, fee: payout.fee, amount: payout.amount, nonce: nonce };
            let signedPayment = CodaSDK.signPayment(paymentTransaction, senderKeys);
            let data = JSON.stringify(signedPayment);
            // Writes them to a file by nonce for broadcasting
            fs.writeFileSync("./data/toSend/" + nonce + ".json", data);
            nonce++;
        });

    });
};

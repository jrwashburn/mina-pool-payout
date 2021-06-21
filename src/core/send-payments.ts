import { signPayment, keypair, signed, payment } from "@o1labs/client-sdk";
import { PayoutTransaction } from "./payout-calculator/payout-calculator-isolate-supercharge";
import fs from "fs";
import { fetchGraphQL } from "../infrastructure/graphql";

const graphqlEndpoint = process.env.SEND_PAYMENT_GRAPHQL_ENDPOINT || "https://localhost:3085";

async function sendSignedPayment (payment: signed<payment>) {
  const operationsDoc = `
    mutation SendSignedPayment {
      __typename
      sendPayment(
        input: {
          fee: "${payment.payload.fee}"
          amount: "${payment.payload.amount}"
          to: "${payment.payload.to}"
          from: "${payment.payload.from}"
          nonce: "${payment.payload.nonce}"
          validUntil: "${payment.payload.validUntil}"
          memo: "${payment.payload.memo}"
        }
        signature: {
          field: "${payment.signature.field}",
          scalar: "${payment.signature.scalar}"
        }
      ) {
        payment {
          amount
          fee
          kind
          memo
          nonce
          source {
            publicKey
          }
          receiver {
            publicKey
          }
          isDelegation
        }
      }
    }
  `;

  fs.writeFileSync("./src/data/" + payment.payload.nonce + ".gql", operationsDoc);

  console.log(operationsDoc);
  const { errors, data } = await fetchGraphQL(
    operationsDoc,
    "SendSignedPayment",
    {},
    graphqlEndpoint
  );
  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }
  return data;
}

export async function getNonce (publicKey: string) {
  const operationsDoc = `
    query GetNonce($publicKey: PublicKey!) {
      account(publicKey: $publicKey) {
        inferredNonce
      }
    }
  `;
  const { errors, data } = await fetchGraphQL(
    operationsDoc,
    "GetNonce",
    { "publicKey": publicKey },
    graphqlEndpoint
  );
  if (errors) {
    console.log(`not able to get the nonce`)
    console.log(errors);
  }
  return data.account.inferredNonce ?? 0;
}

export async function sendSignedTransactions (payoutsToSign: PayoutTransaction[], keys: keypair, memo: string) {
  let nonce = await getNonce(keys.publicKey);
  payoutsToSign.reduce(async (previousPromise, payout) => {
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

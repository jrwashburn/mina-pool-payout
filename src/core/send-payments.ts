import { signed, payment } from "@o1labs/client-sdk";
import fs from "fs";
import { fetchGraphQL } from "../infrastructure/graphql";

const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT || "https://localhost:3085";


export async function sendSignedPayment(payment: signed<payment>) {
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

export async function getNonce(publicKey: string) {
  const operationsDoc = `
    query GetNonce($publicKey: String) {
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

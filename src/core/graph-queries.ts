import fetch from "node-fetch";

const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT || "https://localhost:3085";

async function fetchGraphQL(
  operationsDoc: string,
  operationName: string,
  variables: {}
) {
  const result = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
  return await result.json();
}

/*
function executeSendSignedPayment() {
  const operationsDoc = `
    mutation SendSignedPayment {
      __typename
      sendPayment(input: {fee: "", amount: "", to: "", from: "", nonce: "", validUntil: "", memo: ""}, signature: {field: "", scalar: ""})
    }
  `;
  return fetchGraphQL(operationsDoc, "SendSignedPayment", {});
}

export async function sendSignedPayment() {
  const { errors, data } = await executeSendSignedPayment();
  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }
  return data;
}
*/

export async function sendSignedPayment(fee:number, amount:number, to:string, from:string, nonce:number, validUntil:number, memo:string, signatureField:string, signatureScalar:string) {
  const operationsDoc = `
    mutation SendSignedPayment {
      __typename
      sendPayment(
        input: {
          fee: "${fee}"
          amount: "${amount}"
          to: "${to}"
          from: "${from}"
          nonce: "${nonce}"
          validUntil: "${validUntil}"
          memo: "${memo}"
        }
        signature: { 
          field: "${signatureField}", 
          scalar: "${signatureScalar}" 
        }
      )
    }
  `;
  const { errors, data } = await fetchGraphQL(operationsDoc, "SendSignedPayment", {});
  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }
  return data;
}

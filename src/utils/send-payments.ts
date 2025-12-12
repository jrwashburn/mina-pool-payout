/* eslint-disable @typescript-eslint/no-explicit-any */
import Client from 'mina-signer'
import fs from 'node:fs';
import { sendPaymentGraphQL, fetchGraphQL } from '../infrastructure/graphql-pay.js';
import { PayoutTransaction } from '../core/payoutCalculator/Model.js';
import { gql } from '@apollo/client/core';
import { print } from 'graphql';

type UInt64 = string | number | bigint;
type UInt32 = number | string | bigint;
interface SignedLegacy<T> {
  data: T;
  signature: {
    field: string;
    scalar: string;
  };
}

const minaClient = new Client({ network: 'mainnet' });
interface Payment {
  to: PublicKey;
  from: PublicKey;
  fee: UInt64;
  nonce: UInt32;
  memo?: string;
  validUntil?: UInt32;
  amount: UInt64;
}
type PublicKey = string;
type PrivateKey = string;

async function getPaymentMutation(payment: SignedLegacy<Payment>): Promise<any> {
  const operationsDoc = gql`
    mutation SendSignedPayment {
      __typename
      sendPayment(
        input: {
          fee: "${payment.data.fee}"
          amount: "${payment.data.amount}"
          to: "${payment.data.to}"
          from: "${payment.data.from}"
          nonce: "${payment.data.nonce}"
          validUntil: "${payment.data.validUntil}"
          memo: "${payment.data.memo}"
        }
        signature: {
          field: "${payment.signature.field}",
          scalar: "${payment.signature.scalar}"
        }
      ) {
        payment {
          amount
          fee
          id
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
  return operationsDoc;
}

export async function getNonce(publicKey: string): Promise<any> {
  const operationsDoc = gql`
        query GetNonce($publicKey: PublicKey!) {
            account(publicKey: $publicKey) {
                inferredNonce
            }
        }
    `;
  const { errors, data } = await fetchGraphQL(operationsDoc, { publicKey: publicKey });
  if (errors) {
    console.log(`not able to get the nonce`);
    console.log(errors);
  }
  return data.account.inferredNonce ?? 0;
}

export async function sendSignedTransactions(payoutsToSign: PayoutTransaction[], senderKeys: { publicKey: PublicKey, privateKey: PrivateKey }, doNotTransmit: boolean): Promise<any> {
  let continueSending = !doNotTransmit;
  let timeout = continueSending ? 5000 : 0;
  let nonce = await getNonce(senderKeys.publicKey);

  payoutsToSign.reduce(async (previousPromise, payout) => {
    await previousPromise;
    return new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        console.log(`#### Processing nonce ${nonce}...`);
        const paymentTransaction: Payment = {
          to: payout.publicKey,
          from: senderKeys.publicKey,
          fee: payout.fee,
          amount: payout.amount,
          nonce: nonce,
          memo: payout.memo,
        };

        try {
          // 20221105 - changing to always write gql file, and always increment nonce
          // if any transmission errors encontered, now still generate and sign transactions, but do not send
          // this will allow resending transactions later via resend-payments command.
          // ---------> send payouts
          const signedPayment: SignedLegacy<Payment> = await minaClient.signPayment(paymentTransaction, senderKeys.privateKey);
          const opsDoc = await getPaymentMutation(signedPayment);
          //console.log(opsDoc);
          fs.writeFileSync('./src/data/' + nonce + '.gql', print(opsDoc));
          if (continueSending) {
            const { error, data } = await sendPaymentGraphQL(opsDoc, {});
            fs.writeFileSync('./src/data/' + nonce + '.json', JSON.stringify(data));
          } else {
            console.log(`Generated gql file for nonce ${nonce}; not attempting to send transaction`);
          }
        } catch (Error) {
          console.error(Error);
          continueSending = false;
          //reset timeout to 0 - delay is not necessary since we won't send transactions now
          timeout = 0;
          console.error(`*** ERROR SENDING TRANSACTIONS - STOPPED SENDING AT NONCE ${nonce} *** `);
        }
        //increment nonce even on errror - now saving files to send later.
        nonce++;
        resolve();
      }, timeout); //TODO: Move timeout to .env
    });
  }, Promise.resolve());
}

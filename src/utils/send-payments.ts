/* eslint-disable @typescript-eslint/no-explicit-any */
import { signPayment, keypair, signed, payment } from '@o1labs/client-sdk';
import fs from 'fs';
import { sendPaymentGraphQL, fetchGraphQL } from '../infrastructure/graphql-pay';
import { PayoutTransaction } from '../core/payoutCalculator/Model';
import { gql } from '@apollo/client/core';
import { print } from 'graphql';
import { PaymentProcess } from '../core/payment/Model';
import { PaymentConfiguration } from '../configuration/Model';

async function getPaymentMutation(payment: signed<payment>): Promise<any> {
    const operationsDoc = gql`
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

export async function sendSignedTransactions(payoutsToSign: PayoutTransaction[], keys: keypair): Promise<any> {
    let continueSending = true;
    let timeout = 5000;
    let nonce = await getNonce(keys.publicKey);

    payoutsToSign.reduce(async (previousPromise, payout) => {
        await previousPromise;
        return new Promise<void>((resolve, reject) => {
            setTimeout(async () => {
                console.log(`#### Processing nonce ${nonce}...`);
                const paymentTransaction: payment = {
                    to: payout.publicKey,
                    from: keys.publicKey,
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
                    const signedPayment = signPayment(paymentTransaction, keys);
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
                    console.log(Error);
                    continueSending = false;
                    //reset timeout to 0 - delay is not necessary since we won't send transactions now
                    timeout = 0;
                    console.log(`*** ERROR SENDING TRANSACTIONS - STOPPED SENDING AT NONCE ${nonce} *** `);
                }
                //increment nonce even on errror - now saving files to send later.
                nonce++;
                resolve();
            }, timeout); //TODO: Move timeout to .env
        });
    }, Promise.resolve());
}

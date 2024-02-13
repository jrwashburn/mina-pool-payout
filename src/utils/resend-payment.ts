/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from '@apollo/client/core';
import fs from 'fs';
import path from 'path';
import { sendPaymentGraphQL } from '../infrastructure/graphql-pay';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function resendSignedPaymentFromFile(args: any): Promise<void> {
    const dir = path.join(__dirname, '/../data/');
    const fromNonce = args.fromNonce;
    const toNonce = args.toNonce;
    const fileList = fs.readdirSync(dir).filter((f) => {
        if (f.substring(f.indexOf('.')) === '.gql') {
            if (
                Number(f.substring(0, f.indexOf('.'))) >= Number(fromNonce) &&
                Number(f.substring(0, f.indexOf('.'))) <= Number(toNonce)
            ) {
                return true;
            } else {
                return false;
            }
        }
    });

    for (const f of fileList) {
        console.log(`processing file ${f}`);
        await sendSignedPaymentFromFile(path.join(dir, f));
        await delay5s();
    }
}

async function sendSignedPaymentFromFile(filename: string): Promise<void> {
    const fileData = fs.readFileSync(filename);
    const paymentDoc = gql`
        ${fileData.toString()}
    `;
    try {
        await sendPaymentGraphQL(paymentDoc, {});
        console.log(`Sent payments for nonce: ${filename} again.`);
    } catch (error) {
        console.error(`Failed to send payments for nonce ${filename}`);
        throw error;
    }
}

function delay5s() {
    console.log('wiating 5s');
    return new Promise((d) => setTimeout(d, 5000));
}

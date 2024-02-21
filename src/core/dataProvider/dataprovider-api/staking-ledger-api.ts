import fetch from 'node-fetch';
import { Ledger } from '../dataprovider-types';

const baseUrl = process.env.PAYOUT_DATA_PROVIDER_API_ENDPOINT;
if (!baseUrl) {
    throw new Error('The PAYOUT_API_ENDPOINT environment variable is not set.');
}
export async function getStakes(ledgerHash: string, key: string): Promise<Ledger> {
    const url = `${baseUrl}/staking-ledgers/${ledgerHash}?key=${key}`;
    const responseData = (await fetch(url).then((x) => x.json())) as Ledger;
    responseData.stakes = responseData.stakes.map((stake) => ({
        ...stake,
        total: stake.total ?? 0,
    }));
    return responseData;
}

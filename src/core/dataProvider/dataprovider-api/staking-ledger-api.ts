import { Stake } from '../dataprovider-types';

const baseUrl = process.env.PAYOUT_API_ENDPOINT;

export async function getStakes(ledgerHash: string, key: string): Promise<[Stake[], number]> {
    const responseData = await fetch(`${baseUrl}/staking-ledger/${ledgerHash}?key=${key}`)
                    .then(x => x.json());

    const { result, error, telemetry, messages } = responseData;

    if(error){
        throw new Error(`Error Code: ${error.code}, Message: ${error.message}`)
    }

    let stakingLedgers: [Stake[], number] = [result[0] as Stake[], result[1] as number];
    return stakingLedgers;
}
import fetch from 'node-fetch';
import fs from 'fs';
import { Blocks } from '../dataprovider-types';
import { parse } from 'csv-parse';

const baseUrl = process.env.PAYOUT_DATA_PROVIDER_API_ENDPOINT;
if (!baseUrl) {
    throw new Error('The PAYOUT_API_ENDPOINT environment variable is not set.');
}
export async function getLatestHeight(): Promise<number> {
    const responseData = await fetch(`${baseUrl}/consensus`).then((x) => x.json());
    return Number(responseData.blockHeight);
}

export async function getMinMaxBlocksByEpoch(epoch: number, fork: number): Promise<{ min: number; max: number }> {
    const responseData = await fetch(`${baseUrl}/epoch/${epoch}?fork=${fork}`).then((x) => x.json());
    return { min: Number(responseData.minBlockHeight), max: Number(responseData.maxBlockHeight) };
}

export async function getBlocks(key: string, minHeight: number, maxHeight: number): Promise<Blocks> {
    const responseData = await fetch(`${baseUrl}/blocks?key=${key}&minHeight=${minHeight}&maxHeight=${maxHeight}`).then(
        (x) => x.json(),
    );
    let blocks = responseData.blocks as Blocks;

    const blockFile = `${__dirname}/../../../data/.paidblocks`;

    const filterBlocks = () => {
        return new Promise((resolve, reject) => {
            fs.createReadStream(blockFile)
                .pipe(parse({ delimiter: '|' }))
                .on('data', (record) => {
                    blocks = blocks.filter(
                        (block) => !(block.blockheight == record[0] && block.statehash == record[1]),
                    );
                })
                .on('end', resolve)
                .on('error', reject);
        });
    };
    if (fs.existsSync(blockFile)) {
        await filterBlocks();
    }
    return blocks;
}

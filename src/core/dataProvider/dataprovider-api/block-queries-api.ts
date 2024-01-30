import fetch from "node-fetch";
import fs from 'fs';
import { Blocks } from '../dataprovider-types';
import { parse } from 'csv-parse';

const baseUrl = process.env.PAYOUT_API_ENDPOINT;

export async function getLatestHeight(): Promise<number> {
    const result = await fetch(`${baseUrl}/consensus`)
                    .then(x => x.json());

    let consensus = result as Consensus;

    return consensus.blockHeight;
}

export async function getMinMaxBlocksByEpoch(epoch: number) {
    const result = await fetch(`${baseUrl}/epoch/${epoch}`)
    .then(x => x.json());

    var minMax = result as MinMax;

    return { min: minMax.minHeight, max: minMax.maxHeight };
}

export async function getBlocks(key: string, minHeight: number, maxHeight: number): Promise<Blocks> {
    const result = await fetch(`${baseUrl}/blocks?key=${key}&minHeight=${minHeight}&maxHeight=${maxHeight}`)
                            .then(x => x.json());
    
    let blocks = result as Blocks;

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

interface MinMax {
    minHeight: number;
    maxHeight: number;
}

interface Consensus{
    blockHeight: number;
}
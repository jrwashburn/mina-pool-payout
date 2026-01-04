import fs from 'node:fs';
import { Blocks } from '../dataprovider-types.js';
import { parse } from 'csv-parse';
import { getDirname } from '../../../utils/path-helpers.js';

const __dirname = getDirname(import.meta.url);

const baseUrl = process.env.PAYOUT_DATA_PROVIDER_API_ENDPOINT;
if (!baseUrl) {
  throw new Error('The PAYOUT_API_ENDPOINT environment variable is not set.');
}
export async function getLatestHeight(): Promise<number> {
  const response = await fetch(`${baseUrl}/consensus`);
  if (!response.ok) {
    throw new Error(`HTTP error! ${baseUrl}/consensus returned status: ${response.status} ${response.statusText}`);
  }
  const responseData = await response.json();

  return Number(responseData.blockHeight);
}

export async function getMinMaxBlocksByEpoch(epoch: number, fork: number): Promise<{ min: number; max: number }> {
  const response = await fetch(`${baseUrl}/epoch/${epoch}?fork=${fork}`);
  if (!response.ok) {
    throw new Error(`HTTP error! ${baseUrl}/epoch/${epoch}?fork=${fork} returned status: ${response.status} ${response.statusText}`);
  }
  const responseData = await response.json();
  return { min: Number(responseData.minBlockHeight), max: Number(responseData.maxBlockHeight) };
}

export async function getBlocks(key: string, minHeight: number, maxHeight: number): Promise<Blocks> {
  const response = await fetch(`${baseUrl}/blocks?key=${key}&minHeight=${minHeight}&maxHeight=${maxHeight}`);
  if (!response.ok) {
    throw new Error(`HTTP error! ${baseUrl}/blocks?key=${key}&minHeight=${minHeight}&maxHeight=${maxHeight} returned status: ${response.status} ${response.statusText}`);
  }
  const responseData = await response.json();
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

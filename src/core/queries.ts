import { db } from "../infrastructure/database";
import fs from "fs";
import parse from "csv-parse";

const blockQuery = `
    SELECT
    b.height AS blockHeight,
    b.state_hash AS stateHash,
    slh.value as stakingLedgerHash,
    b.timestamp AS blockDateTime,
    b.global_slot AS slot,
    b.global_slot_since_genesis AS globalSlotSinceGenesis,
    pkc.value AS creatorPublicKey,
    pkw.value AS winnerPublicKey,
    pk.value AS recevierPublicKey,
    coalesce( bif.coinbase, 0) AS coinbase,
    coalesce( bif2.feeTransferToReceiver, 0) AS feeTransferToReceiver,
    coalesce( bif.feeTransferFromCoinbase, 0) AS feeTransferFromCoinbase,
    coalesce( btf.userCommandTransactionFees, 0) AS userCommandTransactionFees
    FROM blocks b
    INNER JOIN public_keys pkc ON b.creator_id = pkc.id
    INNER JOIN public_keys pkw ON b.block_winner_id = pkw.id
    INNER JOIN epoch_data ed ON b.staking_epoch_data_id = ed.id
    INNER JOIN snarked_ledger_hashes slh ON ed.ledger_hash_id = slh.id
    LEFT JOIN
        (
        SELECT
            bic.block_id,
            sum( CASE WHEN ic.type = 'coinbase' THEN coalesce( ic.fee, 0) ELSE 0 END ) AS coinbase,
            sum( CASE WHEN ic.type = 'fee_transfer_via_coinbase' THEN coalesce( ic.fee, 0) ELSE 0 END) AS feeTransferFromCoinbase,
            max( CASE WHEN ic.type = 'coinbase' THEN ic.receiver_id ELSE NULL END) AS coinbaseReceiverId
        FROM blocks_internal_commands bic
        INNER JOIN internal_commands ic ON bic.internal_command_id = ic.id
        GROUP BY bic.block_id
        ) bif ON b.id = bif.block_id
    LEFT JOIN
        public_keys pk on pk.id = bif.coinbaseReceiverId
    LEFT JOIN
        (
        SELECT
            bic.block_id,
            sum( CASE WHEN ic.type = 'fee_transfer' THEN coalesce( ic.fee, 0) ELSE 0 END) AS feeTransferToReceiver,
            ic.receiver_id
        FROM blocks_internal_commands bic
        INNER JOIN internal_commands ic ON bic.internal_command_id = ic.id
        GROUP BY bic.block_id, ic.receiver_id
        ) bif2 ON b.id = bif2.block_id AND bif2.receiver_id = bif.coinbaseReceiverId
    LEFT JOIN
        (
        SELECT
            buc.block_id,
            sum( coalesce( uc.fee, 0) ) AS userCommandTransactionFees
        FROM blocks_user_commands buc
        INNER JOIN user_commands uc ON buc.user_command_id = uc.id
        WHERE  buc.status = 'applied'
        GROUP BY buc.block_id
        ) btf ON b.id = btf.block_id
    WHERE b.id IN (
        WITH RECURSIVE chain AS (
            SELECT id, state_hash, parent_id, creator_id, snarked_ledger_hash_id, ledger_hash, height, timestamp
            FROM blocks b
            WHERE height = (select MAX(height) from blocks)
            UNION ALL
            SELECT b.id, b.state_hash, b.parent_id, b.creator_id, b.snarked_ledger_hash_id, b.ledger_hash, b.height, b.timestamp
            FROM blocks b
            INNER JOIN chain ON b.id = chain.parent_id
        )
        SELECT distinct c.id
        FROM chain c
    )
    AND pkc.value = $1
    AND b.height >= $2
    AND b.height <= $3
    ORDER BY blockheight DESC;
`;

const getHeightsMissingQuery = `
  SELECT h as height
  FROM (SELECT h::int FROM generate_series($1 , $2) h
  LEFT JOIN blocks b 
  ON h = b.height where b.height is null) as v
`;

const getNullParentsQuery = `
  SELECT height FROM blocks WHERE parent_id is null AND height >= $1 AND height <= $2
`;

export async function getLatestHeight() {
  const result = await db.one<Height>(`
      SELECT MAX(height) AS height FROM public.blocks
  `);
  return result.height;
}

export async function getHeightMissing(minHeight: number, maxHeight: number) {
  const heights: Array<Height> = await db.any(getHeightsMissingQuery, [minHeight, maxHeight]);
  return heights.map(x=> x.height);
}

export async function getNullParents(minHeight: number, maxHeight: number) {
  const heights: Array<Height> = await db.any(getNullParentsQuery, [minHeight, maxHeight]);
  return heights.map(x=> x.height);
}

export async function getBlocks(key: string, minHeight: number, maxHeight: number) {
  let blocks: Blocks = await db.any(blockQuery, [key, minHeight, maxHeight]);

  const blockFile = `${__dirname}/../data/.paidblocks`;
  
  const filterBlocks = () => {
    return new Promise((resolve, reject) => {
      fs.createReadStream(blockFile)
        .pipe(parse({delimiter: "|"}))
        .on("data", (record) => {
          blocks = blocks.filter(block => !(block.blockheight == record[0] && block.statehash == record[1]));
        })
        .on("end", resolve)
        .on("error", reject);
    });
  };
  if (fs.existsSync(blockFile)) {
    await filterBlocks();
  }
  return blocks;
}

type Height = {
  height: number;
};

export type Block = {
  blockheight: number;
  statehash: string;
  stakingledgerhash: string;
  blockdatetime: number;
  slot: number;
  globalslotsincegenesis: number;
  creatorpublickey: string;
  winnerpublickey: string;
  receiverpublickey: string;
  coinbase: number;
  feetransfertoreceiver: number;
  feetransferfromcoinbase: number;
  usercommandtransactionfees: number;
};

export type Blocks = Array<Block>;

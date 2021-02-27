import { db } from "../infrastructure/database";

const blockQuery = `
    SELECT
    b.height AS blockHeight,
    b.state_hash AS stateHash, 
    b.timestamp as blockDateTime,
    b.global_slot_since_genesis AS globalSlotSinceGenesis,
    pkc.value AS creatorPublicKey, 
    pkw.value AS winnerPublicKey,
    pk.value AS recevierPublicKey,
    coalesce( bif.coinbase, 0) AS coinbase,
    coalesce( bif2.snarkfeesToReceiver, 0) AS snarkfeesToReceiver,
    coalesce( bif.snarkfeesFromCoinbase, 0) AS snarkfeesFromCoinbase,
    coalesce( bif.coinbase + bif2.snarkfeesToReceiver - bif.snarkfeesFromCoinbase, 0) AS blockPayoutAmount,
    coalesce( btf.userCommandTransactionFees, 0) AS userCommandTransactionFees
    FROM blocks b
    INNER JOIN public_keys pkc ON b.creator_id = pkc.id
    INNER JOIN public_keys pkw ON b.block_winner_id = pkw.id
    LEFT JOIN
        ( 
        SELECT
            bic.block_id,
            sum( CASE WHEN ic.type = 'coinbase' THEN coalesce( ic.fee, 0) ELSE 0 END ) AS coinbase,
            sum( CASE WHEN ic.type = 'fee_transfer_via_coinbase' THEN coalesce( ic.fee, 0) ELSE 0 END) AS snarkfeesFromCoinbase,
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
            sum( CASE WHEN ic.type = 'fee_transfer' THEN coalesce( ic.fee, 0) ELSE 0 END) AS snarkfeesToReceiver,
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

export async function getLatestHeight() {
  const result = await db.one<LatestHeight>(`
        SELECT MAX(height) AS height FROM public.blocks
    `);
  return result.height;
}

export async function getBlocks(key: string, minHeight: number, maxHeight: number) {
  return (await db.any(blockQuery, [key, minHeight, maxHeight])) as Blocks;
}

type LatestHeight = {
  height: number;
};

export type Block = {
//  block_archive_id: number;
  blockheight: number;
  statehash: string;
//  parenthash: string;
  blockdatetime: number;
//  slot: number;
  globalslotsincegenesis: number;
  creatorpublickey: string;
  winnerpublickey: string;
  receiverpublickey: string;
  coinbase: number;
  snarkfeestoreceiver: number;
  snarkfeesfromcoinbase: number;
  blockpayoutamount: number;
  usercommandtransactionfees: number;
};

export type Blocks = Array<Block>;

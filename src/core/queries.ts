import { db } from "../infrastructure/database";

const blockQuery = `
    SELECT 
        b.id AS block_archive_id,
        b.height AS blockHeight,
        b.state_hash AS stateHash,
        b.parent_hash AS parentHash,
        b.timestamp AS blockDateTime,
        b.global_slot AS slot,
        b.global_slot_since_genesis AS globalSlotSinceGenesis,
        pkc.value AS creator,
        pkw.value AS winner,
        bif.coinbase,
        bif.snarkfees,
        btf.txfees
    FROM blocks b
        INNER JOIN public_keys pkc ON b.creator_id = pkc.id
        INNER JOIN public_keys pkw ON b.block_winner_id = pkw.id
        LEFT JOIN (
            SELECT bic.block_id,
                sum(
                    CASE
                        WHEN ic.type = 'coinbase' THEN ic.fee
                        ELSE 0
                    END
                ) AS coinbase,
                sum(
                    CASE
                        WHEN ic.type = 'fee_transfer' THEN ic.fee
                        ELSE 0
                    END
                ) AS snarkfees
            FROM blocks_internal_commands bic
                INNER JOIN internal_commands ic ON bic.internal_command_id = ic.id
            GROUP BY bic.block_id
        ) bif ON b.id = bif.block_id
        LEFT JOIN (
            SELECT buc.block_id,
                sum(uc.fee) AS txFees
            FROM blocks_user_commands buc
                INNER JOIN user_commands uc ON buc.user_command_id = uc.id
            WHERE buc.status = 'applied'
            GROUP BY buc.block_id
        ) btf ON b.id = btf.block_id
    WHERE pkc.value = $1
    AND b.height >= $2
    AND b.height <= $3
    AND b.id IN (
            WITH RECURSIVE chain AS (
                SELECT id,
                    state_hash,
                    parent_id,
                    creator_id,
                    snarked_ledger_hash_id,
                    ledger_hash,
                    height,
                    timestamp
                FROM blocks b
                WHERE height = (
                        select MAX(height)
                        from blocks
                    )
                UNION ALL
                SELECT b.id,
                    b.state_hash,
                    b.parent_id,
                    b.creator_id,
                    b.snarked_ledger_hash_id,
                    b.ledger_hash,
                    b.height,
                    b.timestamp
                FROM blocks b
                    INNER JOIN chain ON b.id = chain.parent_id
            )
            SELECT distinct c.id
            FROM chain c
        )
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
  block_archive_id: number;
  blockheight: number;
  statehash: string;
  parenthash: string;
  blockdatetime: number;
  slot: number;
  globalslotsincegenesis: number;
  creator: string;
  winner: string;
  coinbase: number;
  snarkfees: number;
  txfees: number;
};

export type Blocks = Array<Block>;

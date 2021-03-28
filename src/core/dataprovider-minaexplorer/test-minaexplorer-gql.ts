import { useQuery, gql } from '@apollo/client';
import { Blocks } from "../dataprovider-interface";

const blockQuery = gql`
query blockData {
  blocks(sortBy: BLOCKHEIGHT_ASC, query: {canonical: true, creator: $1, blockHeight_gte: $2}, limit: $3) {
    stateHash
    protocolState {
      consensusState {
        stakingEpochData {
          ledger {
            hash
          }
        }
        slot
        slotSinceGenesis
        blockHeight
      }
      blockchainState {
        date
      }
    }
    creatorAccount {
      publicKey
    }
    winnerAccount {
      publicKey
    }
    transactions {
      coinbaseReceiverAccount {
        publicKey
      }
      coinbase
      feeTransfer {
        fee
        recipient
        type
      }
      userCommands {
        fee
      }
    }
    txFees
  }
}`;

export async function getLatestHeight() {
    const result = await db.one<LatestHeight>(`
        SELECT MAX(height) AS height FROM public.blocks
    `);
    return result.height;
}

export async function getBlocks(key: string, minHeight: number, maxHeight: number) {
    let blocks: Blocks = await db.any(blockQuery, [key, minHeight, maxHeight]);

    const blockFile = `${__dirname}/../data/.paidblocks`;

    const filterBlocks = () => {
        return new Promise((resolve, reject) => {
            fs.createReadStream(blockFile)
                .pipe(parse({ delimiter: "|" }))
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

type LatestHeight = {
    height: number;
};

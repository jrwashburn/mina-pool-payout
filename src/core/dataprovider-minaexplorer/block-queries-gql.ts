import { fetchGraphQL } from '../../infrastructure/graphql';
import { Blocks } from "../dataprovider-types";

const graphqlEndpoint = process.env.MINAEXPLORER_GRAPHQL_ENDPOINT || "https://localhost:3085";

const blockQuery = `
query blockData( $creator: String, $blockHeight_gte: Int, $limit: Int  ) {
  blocks(sortBy: BLOCKHEIGHT_ASC, query: {canonical: true, creator: $creator, blockHeight_gte: $blockHeight_gte }, limit: $limit ) {
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

export async function getBlocksFromMinaExplorer (key: string, minHeight: number, maxHeight: number): Promise<Blocks> {

  const { errors, data } = await fetchGraphQL(
    blockQuery,
    'blockData',
    {
      creator: key,
      blockHeight_gte: minHeight,
      limit: (maxHeight - minHeight)
    },
    graphqlEndpoint
  );
  if (errors) {
    console.log(`not able to get the blocks`)
    console.log(errors);
  }
  console.log(data)
  return data
}

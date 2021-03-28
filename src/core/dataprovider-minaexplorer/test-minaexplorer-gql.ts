import { useQuery, gql } from '@apollo/client';

const blockQuery = gql`
query blockData {
  blocks(sortBy: BLOCKHEIGHT_ASC, query: {canonical: true, creator: , blockHeight_gte: }, limit: ) {
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

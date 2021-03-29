import { fetchGraphQL } from '../../infrastructure/graphql';
import { Block, Blocks } from "../dataprovider-types";

const graphqlEndpoint = process.env.MINAEXPLORER_GRAPHQL_ENDPOINT || "https://localhost:3085";

// TODO switch to lodash? https://github.com/APIs-guru/graphql-lodash

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
  let flatBlocks: Blocks = []
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
    console.log(errors)
    throw new Error('could not get block from mina explorer');
  } else {
    //let b: Blocks = data.blocks
    data.blocks.forEach((meBlock: any) => {
      console.log(JSON.stringify(meBlock))
      flatBlocks.push({
        blockheight: meBlock.protocolState.consensusState.blockHeight,
        statehash: meBlock.stateHash,
        stakingledgerhash: meBlock.protocolState.consensusState.stakingEpochData.ledger.hash,
        blockdatetime: meBlock.protocolState.blockchainState.date,
        slot: meBlock.protocolState.consensusState.slot,
        globalslotsincegenesis: meBlock.protocolState.consensusState.slotSinceGenesis,
        creatorpublickey: meBlock.creatorAccount.publicKey,
        winnerpublickey: meBlock.winnerAccount.publicKey,
        receiverpublickey: meBlock.transactions.coinbaseReceiverAccount.publicKey,
        coinbase: meBlock.transactions.coinbase,
        feetransfertoreceiver: meBlock.transactions.feeTransfer,
        feetransferfromcoinbase: 0,
        usercommandtransactionfees: meBlock.txFees
      })
    })
  }
  return flatBlocks
}

/*

{
         {
        "creatorAccount": {
          "publicKey": "B62qrxNgwAdhGYZv1BXQRt2HgopUceFyrtXZMikwsuaHu5FigRJjhwY"
        },
        "protocolState": {
          "blockchainState": {
            "date": "1616016420000"
          },
          "consensusState": {
            "blockHeight": 303,
            "slot": 429,
            "slotSinceGenesis": 429,
            "stakingEpochData": {
              "ledger": {
                "hash": "jx7buQVWFLsXTtzRgSxbYcT8EYLS8KCZbLrfDcJxMtyy4thw2Ee"
              }
            }
          }
        },
        "stateHash": "3NKQvqG1a5MJrtRaJHezuASArkDZWtMV6UfJMUUR5gQ8qTcSmEvy",
        "transactions": {
          "coinbase": "720000000000",
          "coinbaseReceiverAccount": {
            "publicKey": "B62qqa9g4CFfkSuX2j22S52z6UfcDcS9tMTgQrFKZ21v7GrEP6Zu5Tc"
          },
          "feeTransfer": [
            {
              "fee": "10000000",
              "recipient": "B62qqa9g4CFfkSuX2j22S52z6UfcDcS9tMTgQrFKZ21v7GrEP6Zu5Tc",
              "type": "Fee_transfer"
            }
          ],
          "userCommands": [
            {
              "fee": 10000000
            }
          ]
        },
        "txFees": "10000000",
        "winnerAccount": {
          "publicKey": "B62qq8sm8HemutQiT6VuDKNWKLAi1Tvz1jrnttVajpL8zdaXMq6M9gu"
        }
      },
*/

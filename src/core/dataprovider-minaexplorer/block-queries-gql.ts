import { fetchGraphQL } from '../../infrastructure/graphql';
import { Blocks } from "../dataprovider-types";
import fs from "fs";
import parse from "csv-parse";

type minaExplorerBlock =
  {
    creatorAccount: { publicKey: string },
    stateHash: string,
    protocolState: {
      consensusState: {
        blockHeight: number,
        slot: number,
        slotSinceGenesis: number,
        stakingEpochData: {
          ledger: { hash: string }
        }
      },
      blockchainState: { date: string },
    },
    winnerAccount: { publicKey: string },
    transactions: {
      coinbase: string,
      coinbaseReceiverAccount: { publicKey: string },
      feeTransfer: [{
        fee: string,
        recipient: string,
        type: string
      }],
      userCommands: [{ fee: number }]
    },
    txFees: string,
  }


const graphqlEndpoint = process.env.MINAEXPLORER_GRAPHQL_ENDPOINT || "https://localhost:3085";

// TODO switch to lodash? https://github.com/APIs-guru/graphql-lodash

const blockQuery = `
query blockData( $creator: String, $blockHeight_gte: Int, $blockHeight_lte: Int  ) {
  blocks(limit: 1000, sortBy: BLOCKHEIGHT_ASC, query: {canonical: true, creator: $creator, blockHeight_gte: $blockHeight_gte , blockHeight_lte: $blockHeight_lte } ) {
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

const tipQuery = `
query LatestHeight {
  blocks(sortBy: BLOCKHEIGHT_DESC, query: { canonical: true }, limit: 1) {
    blockHeight
  }
}`

export async function getLatestHeightFromMinaExplorer () {
  const { errors, data } = await fetchGraphQL(
    tipQuery,
    'LatestHeight',
    {},
    graphqlEndpoint)
  return (data.blocks[0].blockHeight);
}

export async function getBlocksFromMinaExplorer (key: string, minHeight: number, maxHeight: number): Promise<Blocks> {
  let flatBlocks: Blocks = []
  const { errors, data } = await fetchGraphQL(
    blockQuery,
    'blockData',
    {
      creator: key,
      blockHeight_gte: minHeight,
      blockHeight_lte: maxHeight
    },
    graphqlEndpoint
  );
  if (errors) {
    console.log(errors)
    throw new Error('could not get block from mina explorer');
  } else {
    data.blocks.map((meBlock: minaExplorerBlock) => {
      flatBlocks.push({
        blockheight: meBlock.protocolState.consensusState.blockHeight,
        statehash: meBlock.stateHash,
        stakingledgerhash: meBlock.protocolState.consensusState.stakingEpochData.ledger.hash,
        blockdatetime: +meBlock.protocolState.blockchainState.date,
        slot: meBlock.protocolState.consensusState.slot,
        globalslotsincegenesis: meBlock.protocolState.consensusState.slotSinceGenesis,
        creatorpublickey: meBlock.creatorAccount.publicKey,
        winnerpublickey: meBlock.winnerAccount.publicKey,
        receiverpublickey: meBlock.transactions.coinbaseReceiverAccount.publicKey,
        coinbase: +meBlock.transactions.coinbase,
        feetransfertoreceiver: meBlock.transactions.feeTransfer.filter(x => x.recipient === meBlock.transactions.coinbaseReceiverAccount.publicKey).reduce((sum, y) => sum + (+y.fee), 0),
        feetransferfromcoinbase: meBlock.transactions.feeTransfer.filter(x => x.type === 'Fee_transfer_via_coinbase').reduce((sum, y) => sum + (+y.fee), 0),
        usercommandtransactionfees: +meBlock.txFees
      })
    })
  }
  // TODO move this up a layer to a helper / werapper - identical code in block-queries-sql.ts for archivedb.
  const blockFile = `${__dirname}/../../data/.paidblocks`;

  const filterBlocks = () => {
    return new Promise((resolve, reject) => {
      fs.createReadStream(blockFile)
        .pipe(parse({ delimiter: "|" }))
        .on("data", (record) => {
          flatBlocks = flatBlocks.filter(block => !(block.blockheight == record[0] && block.statehash == record[1]));
        })
        .on("end", resolve)
        .on("error", reject);
    });
  };
  if (fs.existsSync(blockFile)) {
    await filterBlocks();
  }
  return flatBlocks
}

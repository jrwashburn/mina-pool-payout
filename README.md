# mina-pool-payout

_Inspired by [minaexplorer - mina-payout-script](https://github.com/garethtdavies/mina-payout-script)_
This started out as a port from the original, but has morphed into a slightly different payout algorithm, so we don't want you thinking this will generate exactly the same results.

This script will calculate or transmit the required payouts for accounts delegating to a given account.

Currently, the operational assumptions are in flux so the output and control mechanisms are changing rapidly. As soon  as things settle, we'll updat this!
// TODO: explain calculate vs. transmit modes, key config vales to maintain, etc.


## Getting started

### Setting up your environment

Copy `sample.env` to `.env` and make the following changes within the `.env`:

- Set `COMMISSION_RATE` to the commission your pool charges. Default is assumed to be the Mina Foundation maximum rate of .05 if a value is not provided.

- Set `POOL_PUBLIC_KEY` to the public key of the pool account being tracked for payouts. This should be the block producer public key.

- Set `POOL_MEMO` to the DiscordID or other message to be sent in the payout memo field

- Set `SEND_TRANSACTION_FEE` to the transaction fee for payout transactions. It is specified in the .env file in MINA, but will be translated to NANOMINA for the actual payment transactions. Double check that this is in Mina!

- Set `SEND_PRIVATE_KEY` to the sender private key
The private key value can be retrieved from a pk file by running the mina advanced dump-keypair command, e.g.

    ```bash
    mina advanced dump-keypair --privkey-path keys/my-payout-wallet
    ```

- Set `SEND_PUBLIC_KEY` to the sender public key. It can also be blank if generating ephemeral keys.

- Set `MIN_CONFIRMATIONS` to whatever number of confirmed blocks you require before paying out. Default to 290 or "k" to use the assumed network finality.

    The process will include blocks at a height up to the **lower of** `MAX_HEIGHT` and the current tip minus `MIN_CONFIRMATIONS`.

    To clarify - `MAX_HEIGHT` only applies _below_ the minimum confirmation window. (i.e. Given a  current block height of 1,500; `MAX_HEIGHT` of 5,000; and `MIN_CONFIRMATIONS` of 290, the process will consider blocks up to height 1210 (1500-290). If `MAX_HEIGHT` were set to 1,000, then the process would consider blocks up to height 1000.)

- Populate `DATABASE_URL` with the connection string for your archive node Postgresql instance. This will typically look something like:

    ```
    DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASENAME
    ```

- Set `GRAPHQL_ENDPOINT` to the url of a graphql server that can send transactions. (e.g. http://127.0.0.1:3085/graphql ) This is required to transmit payout transactions; payouts will be broadcast via this endpoint.

- Export the relevant staking ledger and place in src/data/ledger directory. You can export the current staking ledger with:

    ```
    coda ledger export staking-epoch-ledger > staking-epoch-ledger.json
    ```

### Running the script

- Run `npm install` to install the project dependencies.
- Run `npm run payout -- -m={MIN_BLOCK} [-x={MAX_BLOCK}]` to run the script as a dry run, where `{MIN_BLOCK}` is the lowest blockheight to process, and `{MAX_BLOCK}` is the highest blockheight to process. This will not transmit any actual payments and will output a hash of the payment details.
- Run `npm run payout -- -m={MIN_BLOCK} [-x={MAX_BLOCK} -h={PAYOUT_HASH}` where `{PAYOUT_HASH}` is the hash produced during the dry run in the prior step. If this run produces the same hash (i.e. nothing has changed since the dry run), then the signed payment(s) will be transmitted.

For example, this will process blocks 0-1000, output a summary table, write detailed data to files, and provide a hash of the payouts it intends to make.

```npm run payout -- -m=0 x=1000```

After verifying the results and confirming you are ready to payout, but adding the -h parameter with the hash provided by the output above, as long as the caluclations are the same, the payments will be signed and sent.

```npm run payout -- -m=0 x=1000 -h=84cd21b7b566dc1c84cf06039462e013851df483ad61c229d1830285934dcae2```


### Seeing Results ###

The process will output summary informaiton to the console, and will generate several files under the src/data directory. Files will include:

```bash
./src/data/payout_details_[datetime_minblock_maxblock].json - contains the detailed calculations for each delegator key at each block.
./src/data/payout_transactions_[datetime_minblock_maxblock].json - contains the list of payout transactions that should be sent.
./src/data/[nonce].json - contains a signed transaction for each payment that should be sent. These are also broadcast to the network on the graphql endpoint.
```

The process will also maintain a list of blocks for which it generated signed payout transactions. These are stored in .paidblocks:

```
./src/data/.paidblocks - contains block height number and statehash for each block that has been processed
```

.paidblocks is used to filter future runs - so that you should not duplicate payouts by running repeatedly. This file may need to be manipulated if you sign but do not send transactions and want to reprocess a block. By removing a block (or several) from the paidblocks file, the process will calculate (and can payout) those blocks again.

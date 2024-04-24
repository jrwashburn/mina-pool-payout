# Overview

This application will calculate, and may sign and transmit, the required payouts for accounts delegating to a given account.
It also may send the supercharged rewards to a burn address.
The burn of the supercharged rewards is related to blocks won by Mina Foundation or delegators who want to burn their supercharged rewards.
_The burn address is: B62qiburnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmp7r7UN6X_ . It's a public address without a private key. The tokens held by this address are locked forever.

### Delegation Program requirements

The application implements the rules fo the Mina Foundation and O1 Labs Delegation Program requirements, including:

-   All the rewards should be sent back to the delegators. Only the commision rate should be kept by the Block Producer.
-   The supercharged rewards of the blocks won by Mina Foundation should be sent to the burn address: `B62qiburnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmp7r7UN6X`
-   The supercharged rewards of the blocks won by the delegators who requested to burn their supercharged rewards should be sent to the burn address: `B62qiburnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmp7r7UN6X`
-   The memo field of the payback and burn transaction should contain the md5 value of the block producer's public key that received the delegation.

## Calculating and Sending Payments

Payouts may be calculated (and then sent) for a specific range of block heights, or for an entire epoch. Details on the calculation can be found in [Payout Calculation.md](https://github.com/jrwashburn/mina-pool-payout/blob/main/PayoutCalculation.md)

### Commands to payout per epoch

-   `npm run payout -- -e [epoch number] -f [fork number]` will run the calculation for a specific epoch on a specific fork number, beginning with fork 0.
-   `npm run payout -- -e [epoch number] -f [fork number] -h [dry run hash]` will re-run the calculation, confirm they match the original run, and then automatically send payments to the network.

### Commands to payout for a block height range

-   `npm run payout -- -m [min block height] -x [max block height]` will run the calculation for a specific range of block heights. Min block and Max block heights will be included.
-   `npm run payout -- -m [min block height] -x [max block height] -h [dry run hash]` will re-run the calculation, confirm they match the original run, and then automatically send payments to the network.

-   In between runs, depending on your key management process, you may need to transmit funds to the wallet that is configured to make the payments. This is assumed to be an offline process and is intentionally not automated to support movement of funds from a cold wallet to a hot wallet used for payments. **Note that you must wait for the funding transaction to complete before running the final payout.**

-   The blocks that were paid will be saved and will be excluded from future runs. (If you need to re-run for some reason, the processed blocks are saved in src/data/.paidblocks)

## Simple Setup (ht: discord/@naamah8064)

For more details, see [In Depth](#In Depth Configuration & Operation) below

### Install Prerequisites

-   Install nodejs/typescript/npm  
    https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

### Download and install mina-pool-payout

```bash
git clone https://github.com/jrwashburn/mina-pool-payout.git
cd mina-pool-payout
npm install
cp sample.env .env
```

### Configuration settings for your pool

Edit file to set environment variables:

```bash
nano .env
```

Set `POOL_PUBLIC_KEY` to your node public key  
Set `COMMISSION_RATE` to your commission rate  
Set `POOL_MEMO` to a value that will be used for the memo of your payouts (except mina foundation payout)  
Set `SEND_PRIVATE_KEY` to your sender private key  
Set `SEND_PAYMENT_GRAPHQL` to your local node or a proxy e.g. `SEND_PAYMENT_GRAPHQL_ENDPOINT=http://127.0.0.1:3085/graphql`
Set `PAYOUT_DATA_PROVIDER_API_ENDPOINT` to a payout data provider root endpoint e.g. `PAYOUT_DATA_PROVIDER_API_ENDPOINT=https://api.minastakes.com`

#### Key Management

Because the payout script can send payments, it is recommended to generate and use an isolated keypair for these payouts. You may want to rotate this key periodically as well.  
A keypair can be created with the mina-generate-keypair application and then exported with the mina application.
For example:

```bash
mina-generate-keypair --privkey-path keys/payout-key-2024
mina advanced dump-keypair --privkey-path keys/payout-key-2024
```

#### Other dependencies

-   Access to a Mina Archive database, or to the MinaExplorer graphql API (until hardfork), or to a mina-payout-data-provider API endpoint such as `https://api.minastakes.com`
-   If payments are to be sent, access to a graphql endpoint that can send signed transactions is required. This may be your own node, or third party proxy.

### Important

Before to send any payout please make sure:

-   Execute the payout script in a dry run mode first. (DO NOT set -h as a parameter).
-   Verify / check all the outputs of the script as highlighted in the image below.
-   Make sure the total payout amount is valid and aligned with the details displayed during the execution of the script.
-   Make sure the total amount to BURN is valid and aligned with the details displayed during the execution of the script.
-   Make sure the total coinbase amount is valid and aligned with the details displayed during the execution of the script.
-   You can see more details by enabling the debug mode. This can be achieved by adding --verbose=true to the command line.

#### Example 1:

![Alt Verification steps](./src/img/dry-run-supercharged.png?raw=true)

#### Example 2:

![Alt Verification steps](./src/img/dry-run-no-supercharged.png?raw=true)

# In Depth Configuration & Operation

## Setting up your environment

Copy `sample.env` to `.env` and make the following changes within the `.env`:

-   Set `BLOCK_DATA_SOURCE` to either ARCHIVEDB or MINAEXPLORER or API.
-   ARCHIVEDB will use the database connection string to get blocks and the current max height, and will expect [hash].json files for the ledgers being processed.
-   MINAEXPLORER will use endpoint specified in MINAEXPLORER_GRAPHQL_ENDPOINT (expect: https://graphql.minaexplorer.com) to get blocks and the staking ledger
-   API will use an endpoint specified in PAYOUT_DATA_PROVIDER_API_ENDPOINT (one available endpoint is https://api.minastakes.com)

-   Set `COMMISSION_RATE` to the commission your pool charges unknown delegators. (Mina Foundation and O1 delegations have separate configurations in the .env file, and you can set override rates for known delegators -- see "Using payor specific commission rates" below.)

-   Set `MF_COMMISSION_RATE` to the commission your pool charges for Mina Foundation delegations, if any. Mina Foundation maximum rate was .05 from inception until delegation cycle 10, after which the maximum allowable is 0.08.

-   Set `O1_COMMISSION_RATE` to the commission your pool charges for O(1) Labs delegations, if any.

-   Set `INVESTORS_COMMISSION_RATE` to the commission your pool charges for Investors delegations, if any. the defaul value is 0.08.

-   Set `POOL_PUBLIC_KEY` to the public key of the pool account being tracked for payouts. This should be the block producer public key.

-   Set `POOL_MEMO` to the DiscordID or other message to be sent in the payout memo field. Note that in case of Mina Foundation is the winner, the memo will be forced to the md5 hash value of the BP Key.

-   Set `SEND_TRANSACTION_FEE` to the transaction fee for payout transactions. It is specified in the .env file in MINA, but will be translated to NANOMINA for the actual payment transactions. Double check that this is in Mina!

-   Set `SEND_PAYOUT_THRESHOLD` to a minimum threshold which payout amounts must exceed to be sent. Default is 0, and payout transaction amount must _exceed_ this number to be sent. Also specified in Mina!

-   Set `SEND_PRIVATE_KEY` to the sender private key
    The private key value can be retrieved from a pk file by running the mina advanced dump-keypair command, e.g.

```
mina advanced dump-keypair --privkey-path keys/my-payout-wallet
```

-   Set `SEND_PUBLIC_KEY` to the sender public key. It can also be blank if generating ephemeral keys.

-   Set `MIN_CONFIRMATIONS` to whatever number of confirmed blocks you require before paying out. Default to 290 or "k" to use the assumed network finality.

The process will include blocks at a height up to the **lower of** `MAX_HEIGHT` and the current tip minus `MIN_CONFIRMATIONS`.

To clarify - `MAX_HEIGHT` only applies _below_ the minimum confirmation window. (i.e. Given a current block height of 1,500; `MAX_HEIGHT` of 5,000; and `MIN_CONFIRMATIONS` of 290, the process will consider blocks up to height 1210 (1500-290). If `MAX_HEIGHT` were set to 1,000, then the process would consider blocks up to height 1000.)

-   Populate `DATABASE_URL` with the connection string for your archive node Postgresql instance. This will typically look something like:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASENAME
```

-   Set `SEND_PAYMENT_GRAPHQL_ENDPOINT` to the url of a graphql server that can send transactions. (e.g. http://127.0.0.1:3085/graphql ) This is required to transmit payout transactions; payouts will be broadcast via this endpoint.

-   Note @vanphandinh / beaconchain#8571 has provided a graphql proxy https://github.com/vanphandinh/mina-graphql-proxy which can be used to transmit payments

-   minaexplorer provides a graphql endpoint that will shutdown at Hard Fork of mainnet: https://proxy.minaexplorer.com/graphql

-   Set `MINAEXPLORER_GRAPHQL_ENDPOINT` to the url of the mina explorer graphql api if the block data source is set to minaexplorer.

-   Set `PAYOUT_DATA_PROVIDER_API_ENDPOINT=https://api.minastakes.com` or to the url of the preferred data provider.

## Providing the Staking Ledgers

-   Export the staking ledger and place it in src/data/ledger directory. You can export the current staking ledger with:

```
mina ledger export staking-epoch-ledger > staking-epoch-ledger.json
```

-   and the next epoch's ledger is available via:

```
mina ledger export next-epoch-ledger > next-epoch-ledger.json
```

-   The files can then be hashed and renamed with:

```
mina ledger hash --ledger-file staking-epoch-ledger.json | xargs -I % cp staking-epoch-ledger.json %.json
mina ledger hash --ledger-file next-epoch-ledger.json | xargs -I % cp next-epoch-ledger.json %.json
```

## Handling special accounts - suppressing or redirecting payouts

You can control whether payouts for a specific key should be skipped or redirected to another key. This is configured with a file named ".substitutePayTo" which should be placed in the src/data directory.
The file is pipe-delimited and contains 2 columns - the first column is the public key to consider, and the second is either the keyword "EXCLUDE", or the payout address to redirect payments to.

-   Public Key|EXCLUDE
-   Public Key|Redirected To Public Key
-   Public Key|SPLIT|Second public key|Fraction

In the example content below, the first row would cause any payouts to the first key to not be sent. This may be useful for the pool operator's keys. The second row would cause any payouts to the key ending in WCvh to be sent instead to the key ending in Ez3yB. This is useful for redirecting new tokens that would be paid to a locked account to go to an unlocked account instead. The third row would split the payout such that 0.4\*payout (40 percent of the payout) goes to the key ending in WCvh and the rest to the key ending in Ez3yB.

```
B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L|EXCLUDE
B62qinpqDF7ongjhpvJLz7QBsExP1BkpceED6GuThYYbSVSbk1nWCvh|B62qoigHEtJCoZ5ekbGHWyr9hYfc6fkZ2A41h9vvVZuvty9amzEz3yB
B62qinpqDF7ongjhpvJLz7QBsExP1BkpceED6GuThYYbSVSbk1nWCvh|SPLIT|B62qoigHEtJCoZ5ekbGHWyr9hYfc6fkZ2A41h9vvVZuvty9amzEz3yB|0.4
```

To enable these features, create a file src/data/.substitutePayTo and configure it according to your situation.

## Using payor specific commission rates

You can use payor specific commission rates. They will override the value of `COMMISSION_RATE` based on the public key specified. To use this feature,
please create a file named ".negotiatedFees" in the src/data directory. The file should contain a list of "public key|commission rate|" combination. Note that the fee should be expressed as a number (can be a decimal).
Example:

```
B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L|0.012573
B62qinpqDF7ongjhpvJLz7QBsExP1BkpceED6GuThYYbSVSbk1nWCvh|0.012544
```

If no file is present, the process will use the default `COMMISSION_RATE` value

## Burning a fraction of rewards

Some delegates may request that a pool burn a portion of their rewards. The payout will burn a specific percentage of the rewards that would have been paid out ot a delegate if specified. To use this feature, create a file named .negotiatedBurn in the src/data directory. The file should contain rows in the format: "puyblic key|burn percentage". The burn percentage shoudl be expressed as a number. For example, the following configuration would would burn 5.05% of the payout to the specific key.

```
B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L|0.0505
```

## Adding accounts as Non-Paticipating and burning their supercharged coinbase

You can add accounts as non-participating and burn their supercharged coinbase. This is configured with a file named ".burnSupercharged" which should be placed in the src/data directory. Simply place the public key address in the .burnSupercharged file and the process will treat that key similar to Investor and MF keys and will burn any supercharged coinbase they create, and will put the account in the non-participating payout pool (they will never earn a part of supercharged coinbases.) If you use the standard payout (not isolate supercharged) then they may still be weighted if unlocked, but by default will not receive any supercharged coinbase unless you have changed the code to run the original payout calculator.

## Running payout for a full epoch

You can run payout for full epoch by using the command `-e={EPOCH_NUMBER}`. This will ignore any min or max height if provided. Example:

`npm run payout -- -e=14`

The program will get min and max block height for the epoch from mina explorer, or calculate based on fixed slots in epoch for Archivedb. Note this is based on the .env file setting NUM_SLOTS_IN_EPOCH which is currently 7140 per mainnet consensus parameters.

## Running the script

-   Run `npm install` to install the project dependencies.
-   Run `npm run payout -- -m={MIN_BLOCK} [-x={MAX_BLOCK}]` to run the script as a dry run, where `{MIN_BLOCK}` is the lowest blockheight to process, and `{MAX_BLOCK}` is the highest blockheight to process. This will not transmit any actual payments and will output a hash of the payment details.
-   Run `npm run payout -- -m={MIN_BLOCK} [-x={MAX_BLOCK} -h={PAYOUT_HASH}` where `{PAYOUT_HASH}` is the hash produced during the dry run in the prior step. If this run produces the same hash (i.e. nothing has changed since the dry run), then the signed payment(s) will be transmitted.

For example, this will process blocks 0-1000, output a summary table, write detailed data to files, and provide a hash of the payouts it intends to make.

`npm run payout -- -m=0 -x=1000`

After verifying the results and confirming you are ready to payout, but adding the -h parameter with the hash provided by the output above, as long as the calculations are the same, the payments will be signed and sent.

`npm run payout -- -m=0 -x=1000 -h=84cd21b7b566dc1c84cf06039462e013851df483ad61c229d1830285934dcae2`

NOTE: Prior versions also output the entire calculation list for every block. That is now suppressed by default, but still visible by using a -verbose (or -v) flag at runtime. For example: `npm run payout -- -m=0 -x=1000 -v=true`

## Seeing Results

The process will output summary information to the console, and will generate several files under the src/data directory. Files will include:

```
./src/data/payout_details_[datetime_minblock_maxblock].json - contains the detailed calculations for each delegator key at each block.
./src/data/payout_transactions_[datetime_minblock_maxblock].json - contains the list of payout transactions that should be sent.
./src/data/[nonce].json - contains a signed transaction for each payment that should be sent. These are also broadcast to the network on the graphql endpoint.
```

The process will also maintain a list of blocks for which it generated signed payout transactions. These are stored in .paidblocks:

```
./src/data/.paidblocks - contains block height number and statehash for each block that has been processed
```

.paidblocks is used to filter future runs - so that you will not duplicate payouts by running repeatedly. This file may need to be manipulated if you sign but do not send transactions and want to reprocess a block. By removing a block (or several) from the paidblocks file, the process will calculate (and can payout) those blocks again.

## Handling failed transmissions

Sometimes a transaction is successfully sent to the node, but then fails to actually send in the network. As of 5/11/2022, the application will continue to generate, sign, and store .gql files for each transaction; however, it will no longer attempt to send transactions to the network after encountering a failure. Instead, the transactions not sent can be resent using the resend command.

`npm run resend -- -fromNone=[nonce] -toNonce=[nonce]`

All attempted payouts are automatically logged in the src/data directory. The resend command will scan the src/data directory for files named .gql, and attempt to resend all files that have a nonce (based on the file name) _equal to_ or between the supplied parameters. (The from/to parameters can be shortened: `-fromNonce` alias -f; `-toNonce` alias -t.)

For example, `npm run resend -- -f=3102 -t=3104` will try to re-transmit any files it finds named 3102.gql up to 3104.gql. This command uses the graphql endpoint specified in the .env file.

## Calculating and saving signed payouts without attempting to broadcast

Some pools may want to use other sending strategies and have requested to simply generate signed files without attempting to send them. This is now supported with the command line parameter `-doNotTransmit` or `-d`.

For example `npm run payout -- -e 76 -f 0 -h eb630596e9805a163d4720f9a0fd5f44e7087628 -d ` will generate the nonce.gql files but will not attempt to broadcast the transactions.

# mina-pool-payout calculation history

_Inspired by [minaexplorer - mina-payout-script](https://github.com/garethtdavies/mina-payout-script)_
This started out as a port from the original, but has morphed a fair amount. As of PR 59, direct comparisons between the two are no longer expected to produce the same results. The main differences vs. the Mina Explorer implementation include:

-   mina-payout-script spreads an unlocked key's weighted supercharged award across the entire epoch if it will unlock at any point during the epoch. mina-pool-payout will only supercharge an account after it is unlocked.
-   mina-pool-payout will (as of PR 59) reserve supercharged rewards entirely for unlocked keys versus spreading the supercharged award across normal coinbase blocks as well. This will result in more variability in unlocked payout versus mina-payout-script.
-   mina-pool-payout will (as of PR 107) burn supercharged rewards if the block was created by keys specified by Mina Foundation as be owned by MF or "investors".

### How are the rewards calculated ?

`https://github.com/jrwashburn/mina-pool-payout/blob/main/src/core/payoutCalculator/PayoutCalculatorIsolateSuperCharge.ts`

### How to compute the md5 hash of the block producer's public key?

Using node:crypto, `createHash('md5').update(BPKEY).digest('hex')`
`https://github.com/jrwashburn/mina-pool-payout/blob/main/src/configuration/ConfigurationManager.ts`

### How are the supercharged rewards burned ?

The supercharged portion that should be burned is sent to the burn address when payments are sent.
`https://github.com/jrwashburn/mina-pool-payout/blob/main/src/utils/send-payments.ts` (see getMemoMd5Hash)

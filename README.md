# Important

Before to send any payout please make sure:

-   Execute the payout script in a dry run mode first. (DO NOT set -h as parameter).
-   Verfify / check all the outputs of the script as highlighted in the image below.
-   Make sure the total payout amount is valid and aligned with the details displayed during the execution of the script.
-   Make sure the total amount to BURN is valid and aligned with the details displayed during the execution of the script.
-   Make sure the total coinbase amount is valid and aligned with the details displayed during the execution of the script.
-   You can see more details by enabling the debug mode. This can achieved by addin --verbose=true to the command line.

![Verification steps](https://github.com/jrwashburn/mina-pool-payout/tree/main/src/img/verification.png?raw=true)

# mina-pool-payout

_Inspired by [minaexplorer - mina-payout-script](https://github.com/garethtdavies/mina-payout-script)_
This started out as a port from the original, but has morphed a fair amount. As of PR 59, direct comparisons between the two are no longer expected to produce the same results. The main differences vs. the Mina Explorer implementation include:

-   mina-payout-script spreads an unlocked key's weighted supercharged award across the entire epoch if it will unlock at any point during the epoch. mina-pool-payout will only supercharge an account after it is unlocked.
-   mina-pool-payout will (as of PR 59) reserve supercharged rewards entirely for unlocked keys versus spreading the supercharged award across normal coinbase blocks as well. This will result in more variability in unlocked payout versus mina-payout-script.

# Mina Foundation Delegation Program requirements

-   All the rewards should be sent back to the delegator. Only the commision rate should be kept by the Block Producer.
-   The supercharged rewards of the blocks won by Mina Foundation should be sent to the burn address: `B62qiburnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmp7r7UN6X`
-   The supercharged rewards of the blocks won by the delegators who requested to burn their supercharged rewards should be sent to the burn address: `B62qiburnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmp7r7UN6X`
-   The memo field of the payback and burn transaction should contain the md5 value of the block producer's public key that received the delegation.

# How are the rewards calculated ?

Please check here:

```
https://github.com/jrwashburn/mina-pool-payout/blob/main/src/core/payoutCalculator/PayoutCalculatorIsolateSuperCharge.ts
```

# How to compute the md5 hash of the block producer's public key ?

Please check here:

```
https://github.com/jrwashburn/mina-pool-payout/blob/main/src/configuration/ConfigurationManager.ts
```

# How are the supercharged rewards burned ?

Please check here:

```
https://github.com/jrwashburn/mina-pool-payout/blob/main/src/utils/send-payments.ts
```

# Dependencies

-   This code uses language features of Typescript v3.7 and Node 14.
-   The host this runs from will either require access to a Mina Archive database, or to the MinaExplorer graphql API.
-   If payments are to be sent, access to a graphql endpoint that can send signed transactions is required.

# Operational Overview

This application will calculate, and may sign and transmit, the required payouts for accounts delegating to a given account.
It also may send the supercharged rewards to a burn address .
The burn of the supercharged rewards is related to blocks won by Mina Foundation or delegators who want to burn their supercharged rewards.
_The burn address is: B62qiburnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmp7r7UN6X_ . It's a public address without a private key. The tokens held by this address are locked forever.

The recommended run process is:

-   copy any updated ledger files to the machine that will run the payout process
    (See Providing the Staking Ledgers below)
-   run payout process read only for a given block range (you can provide a min height and max height on the command line)
    This will process the blocks in the range (inclusive) and calculate and display the calculations per delegator per block, and the summary payout plan and a hash of the projected payouts.
-   review the payout plan, confirm, and then transmit funds to the wallet that is configured to make the payments.
    This is assumed to be an offline process and is intentionally not automated.
-   when confident of the plan, re-run the payout process with the same height parameters, and including the hash calculated in the prior run
    This step will recalculate, verify the payout plan has not changed (via the hash), and then sign and transmit payments via the payor key.
    The blocks that were paid will be saved and will be excluded from future runs. (If you need to re-run for some reason, the processed blocks are saved in .paidblocks)
    Note that you should wait for the offline funding transaction to be completed if the funds are required to be able to make the payout.

# Getting started

## Setting up your environment

Copy `sample.env` to `.env` and make the following changes within the `.env`:

-   Set `BLOCK_DATA_SOURCE` to either ARCHIVEDB or MINAEXPLORER.

-   ARCHIVEDB will use the database connection string to get blocks and the current max height, and will expect [hash].json files for the ledgers being processed.
-   MINAEXPLORER will use endpoint specified in MINAEXPLORER_GRAPHQL_ENDPOINT (expect: graphql.minaexplorer.com) to get blocks and the staking ledger

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

In the example content below, the first row would cause any payouts to the first key to not be sent. This may be useful for the pool operator's keys. The second row would cause any payouts to the key ending in WCvh to be sent instead to the key ending in Ez3yB. This is useful for redirecting new tokens that would be paid to a locked account to go to an unlocked account instead.

```
B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L|EXCLUDE
B62qinpqDF7ongjhpvJLz7QBsExP1BkpceED6GuThYYbSVSbk1nWCvh|B62qoigHEtJCoZ5ekbGHWyr9hYfc6fkZ2A41h9vvVZuvty9amzEz3yB
```

To enable these features, create a file src/data/.substitutePayTo and configure it according to your situation.

## Using payor specific commission rates and specifying to burn supercharged rewards or not

You can use payor specific commission rates. They will override the value of `COMMISSION_RATE` based on the public key specified. To use this feature,
please create a file named ".negotiatedFees" in the src/data directory. The file should contain a list of "public key|commission rate|" combination. Note that the fee should be expressed as a number (can be a decimal).
Example:

```
B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L|0.012573
B62qinpqDF7ongjhpvJLz7QBsExP1BkpceED6GuThYYbSVSbk1nWCvh|0.012544
```

If no file is present, the process will use the default `COMMISSION_RATE` value and will not burn the supercharged rewards (except the ones of Mina Foundation).

## Running payout for a full epoch

You can run payout for full epoch by using the command `-e={EPOCH_NUMBER}`. This will ignore any min or max height if provided. Example:

`npm run payout -- -e=14`

The program will get min and max block height for the epoch from mina explorer, or calculate based on fixed slots in epoch for Archivedb. Note this is based on the .env file setting NUM_SLOTS_IN_EPOCH which is currently 7140 per mainnet consensus parameters.

# Running the script

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

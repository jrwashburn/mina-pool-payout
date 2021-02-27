# mina-pool-payout

This script will calculate the required payouts for accounts delegating to a given account. The script will output JSON containing a list of public keys and their payout amounts, e.g.:

```json
[
  {
    "publicKey": "B62qkbdgRRJJfqcyVd23s9tgCkNYuGMCmZHKijnJGqYgs9N3UdjcRtR",
    "total": 4644003513
  },
  {
    "publicKey": "B62qqMo7X8i2NnMxrtKf3PAWfbEADk4V1ojWhGeH6Gvye9hrMjBiZjM",
    "total": 22577193721
  }
]
```

## Getting started

### Setting up your environment

1. Copy `sample.env` to `.env` and make the following changes within the `.env`:
2. Populate `MINA_KEY` with the public key of the account being tracked for payouts.
3. Populate `DATABASE_URL` with the connection string for your archive node Postgresql instance. This will typically look something like:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASENAME
```

4. Set your `COMMISSION_RATE`. This is initially default to the maximum rate of .05
5. Set `MIN_HEIGHT` to the last known payout block.

### Running the script

1. Run `npm install` to install the project dependencies.
2. Run `npm start` to start the local development server.

Note that `npm start` current defaults to run `nodemon` in order to speed development. The process will continue running and automatically restart when changes to the source files are detected.

import { Block, Stake } from '../../../src/core/dataProvider/dataprovider-types.js';

type FixtureTransaction = { publicKey: string; amount: number; fee: number; memo: string };

// NOTE: Update by rerunning payouts for epoch 71 (documents/test-runs-across-data-providers.log),
// exporting the refreshed payout_details/payout_transactions JSON, and regenerating this file.
const blocks: Block[] = [
  {
    "blockheight": 328228,
    "blockdatetime": 1707282000000,
    "coinbase": 1440000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 240172202,
    "globalslotsincegenesis": 507460,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 507460,
    "stakingledgerhash": "jxiXyAr4NX6Ne1jxMU4WsiYc6SeBajSQZgmro9b63yDfQEeunD3",
    "statehash": "3NL8rfQyukeRWRn7NuEBJeSjQtCxsz5U3HUtf9Mjxawj5fJWFBTc",
    "usercommandtransactionfees": 240172202,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 328328,
    "blockdatetime": 1707314040000,
    "coinbase": 1440000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 118458424,
    "globalslotsincegenesis": 507638,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 507638,
    "stakingledgerhash": "jxiXyAr4NX6Ne1jxMU4WsiYc6SeBajSQZgmro9b63yDfQEeunD3",
    "statehash": "3NKEjMHsTLsBTgqaeoMt4zhYdjSZ2w5sBfsTpLtGhvycvKETckBo",
    "usercommandtransactionfees": 118458424,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 328780,
    "blockdatetime": 1707485940000,
    "coinbase": 1440000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 664172202,
    "globalslotsincegenesis": 508593,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 508593,
    "stakingledgerhash": "jxiXyAr4NX6Ne1jxMU4WsiYc6SeBajSQZgmro9b63yDfQEeunD3",
    "statehash": "3NKucmC8qiNn45GHgiRZ9poWovnd7ECsweHr7YPtnmYComL4Np5E",
    "usercommandtransactionfees": 664172202,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 329140,
    "blockdatetime": 1707616440000,
    "coinbase": 1440000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 1635172202,
    "globalslotsincegenesis": 509318,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 509318,
    "stakingledgerhash": "jxiXyAr4NX6Ne1jxMU4WsiYc6SeBajSQZgmro9b63yDfQEeunD3",
    "statehash": "3NLpSdgYe6gp1EtHLXqUgUMj3guFWxs8o14Yc6dHRP2aNXofwcyL",
    "usercommandtransactionfees": 1635172202,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 329445,
    "blockdatetime": 1707712740000,
    "coinbase": 1440000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 76072202,
    "globalslotsincegenesis": 509853,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 509853,
    "stakingledgerhash": "jxiXyAr4NX6Ne1jxMU4WsiYc6SeBajSQZgmro9b63yDfQEeunD3",
    "statehash": "3NKECiUhCC4mo3Tk2uNjcsLrLiDtbLuroBDVihJKwg598LaugXB3",
    "usercommandtransactionfees": 76072202,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 329826,
    "blockdatetime": 1707832440000,
    "coinbase": 1440000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 1081647747,
    "globalslotsincegenesis": 510518,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 510518,
    "stakingledgerhash": "jxiXyAr4NX6Ne1jxMU4WsiYc6SeBajSQZgmro9b63yDfQEeunD3",
    "statehash": "3NK4Xafi1AGJUj8FSSRR8jpeQsxqGqtWRUK42U3kfrcLwaSTrTD2",
    "usercommandtransactionfees": 1081647747,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 329927,
    "blockdatetime": 1707865920000,
    "coinbase": 1440000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 218808323,
    "globalslotsincegenesis": 510704,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 510704,
    "stakingledgerhash": "jxiXyAr4NX6Ne1jxMU4WsiYc6SeBajSQZgmro9b63yDfQEeunD3",
    "statehash": "3NLxTwUzMTWeKACDBW6DiyKbkniTYEX33KgeWQbxC7qkHRnipELT",
    "usercommandtransactionfees": 218808323,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 330730,
    "blockdatetime": 1708118280000,
    "coinbase": 1440000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 977322617,
    "globalslotsincegenesis": 512106,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 512106,
    "stakingledgerhash": "jxiXyAr4NX6Ne1jxMU4WsiYc6SeBajSQZgmro9b63yDfQEeunD3",
    "statehash": "3NLFyc8rhTEyn2MTPEvUt1VCqVqLxNEZsJpcuak3SYC1iCoBDFrw",
    "usercommandtransactionfees": 977322617,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 331677,
    "blockdatetime": 1708419240000,
    "coinbase": 1440000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 1472558339,
    "globalslotsincegenesis": 513778,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 513778,
    "stakingledgerhash": "jxiXyAr4NX6Ne1jxMU4WsiYc6SeBajSQZgmro9b63yDfQEeunD3",
    "statehash": "3NLPqs6BVpHYoeo2yuhUuQP8VKdH5Th1scLwcjWX42SL3oowJenX",
    "usercommandtransactionfees": 1472558339,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  }
];
const stakers: Stake[] = [
  {
    "publicKey": "B62qkWU8KTP44FSD43HdJcs8PGkTqbG9N7PF87idheAaHy8jL2JAXnj",
    "total": 0,
    "stakingBalance": 486774.077354547,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmNbNedwwDB3bLUzgeN6gAYXmnY4U9WBS6Ze92HghtU7x3v7a2sS",
    "total": 0,
    "stakingBalance": 272265.8466907,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qoigHEtJCoZ5ekbGHWyr9hYfc6fkZ2A41h9vvVZuvty9amzEz3yB",
    "total": 0,
    "stakingBalance": 102344.954552477,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qnr6wsfZxsxFk9xEZvsgKTLTmFmd9czVieRpEv4YnQmHUaVMMDTa",
    "total": 0,
    "stakingBalance": 64934.280982264,
    "untimedAfterSlot": 86400,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpjEJn5boKL7nqM7G49V4zY3jeE2M3czqG8FXJEbAADstvfF9T7Q",
    "total": 0,
    "stakingBalance": 21505.000756681,
    "untimedAfterSlot": 691200.000603229,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmMGz5dWhmrx7JgKtnmb4mqu87tqXsMr6wcRmnGzHrd3Y43iwhG9",
    "total": 0,
    "stakingBalance": 21134.792238612,
    "untimedAfterSlot": 691200.000603229,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpcj9hFMzmpwPs2qXD12atDdjZcDZCXBMNnxy5NJuNErYmJrTrL9",
    "total": 0,
    "stakingBalance": 4991.64198298,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qoGEXsSDG69BoYUQUuiG8NJ25m1hM9VceF1F36ntC6qxqNBdzwCT",
    "total": 0,
    "stakingBalance": 4536.91547884,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qk449L7LDANBXVHdEcbvTnQqtxqweHptUwKqy1tHVxvGJrKapDwN",
    "total": 0,
    "stakingBalance": 2405.204227782,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmmFAkd55Vzz4f9F6v5zziAiEnBZArQrmumd3giacLNxhJ4ydHuZ",
    "total": 0,
    "stakingBalance": 2129.6249,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qnHjLNaDwc4WWy3BLJMmeS6YATWoTYd6MYJemF3uXRNaEoPAc9GV",
    "total": 0,
    "stakingBalance": 2128.5128422,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qkGXYkt4DHG3imcFic5zXRdWfcyQTGFEhbMypVLxmrqP7nsyCTte",
    "total": 0,
    "stakingBalance": 1001.7999,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmpKqzKsgu1q2bG5USonaptVm7q5tJohJUkFverKF8GRJdHdHnZ6",
    "total": 0,
    "stakingBalance": 999.9899,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qn62D9WA9C14MMU9vxaE7VspFNeVDD6BtrZ86SzzwYtRqk9Dcsir",
    "total": 0,
    "stakingBalance": 900.0009996,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qowtmtUeYUnvjWSDysfJQjk8kNva58xkZHwiAykjLyWcZxgF6mbr",
    "total": 0,
    "stakingBalance": 869.585113648,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qrwjtHjSk7BdT2e9qscBXCNrSbwy4VPzRC4yn9de7y7LGEJuCNGr",
    "total": 0,
    "stakingBalance": 692.850992908,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qojHAgRv7rkbAH5vN5jYU4y4CcPH8cgzevFKKKgXLFgJDNJgzQuG",
    "total": 0,
    "stakingBalance": 527.1899,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qqeKZX2etkrguVWr9NQiLVQJBJ48En6SvDVGFyKPghW3QZAVyVNj",
    "total": 0,
    "stakingBalance": 500.2399,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qoDXzDeD2B5xfJqYvv6UrNvxb4hH5HT3nMvv72z5M4RKrNjHL6jv",
    "total": 0,
    "stakingBalance": 432.092632301,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpbireFMvbNfiwiFEoz44TLB9EYuMHJ71PV89WtjH6iY9ef8pwMn",
    "total": 0,
    "stakingBalance": 345.099025386,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qrj8zTWCZAxK2EvVqscM2c1JDQuDm4GWa3uJpveb2oxCyWcRHGsF",
    "total": 0,
    "stakingBalance": 308.2999,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qkXuDEWRBJSNh9QoPcUgpP9SHcYDtDcvvRVJYPnnYiMmWaV9xSr5",
    "total": 0,
    "stakingBalance": 301.2699,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qrM4SEK2uM99CkfJCBZcN1xtV4DzWjq9sWpimTEjJD2ZUH9CcDT9",
    "total": 0,
    "stakingBalance": 224.948424354,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qp6opXDeizxByVqaj5SKrWHPTmUxvXRCgi35zkGpRwk7T5UEsraC",
    "total": 0,
    "stakingBalance": 213.7999,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qnmehRBzPWnSFFisurehmi8VTPhipWwu53EShdk9qv2yonXPhQsF",
    "total": 0,
    "stakingBalance": 211.791424103,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjJagzFcvC42qxEtWMyVBK5GpLzpeE6RMZ5uEqy3ZisezCLazCN1",
    "total": 0,
    "stakingBalance": 198.9899,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qkyi3CLthcpGDfg4V3UAcijDPFQw5uDeEBaAKdJ5UQk5SNpk2QZ6",
    "total": 0,
    "stakingBalance": 186.51385977,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpr7RYckfwA7dxryu6K7StHarRkXQzVDQ1Hq3vPcwL25bNxb526f",
    "total": 0,
    "stakingBalance": 120.9531,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpQN96tZ9kQNmUVLt6QmtHe5VTJcM9dsN14rkbnGLEcdawpPYvdY",
    "total": 0,
    "stakingBalance": 100.9899,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qkSumb4MunaxubL64a5FvXhGjkUDniXfpLJqhAHxL3zbmicy9Z6K",
    "total": 0,
    "stakingBalance": 99.0899,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmJAmEyc92HwT65SHMmdsV5c9pbZ1jFn1jdCLY5Q2XDYbhZaSddG",
    "total": 0,
    "stakingBalance": 86.8899,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qqLZqEEQEAu7wjVLurUmEfsKuyhkywBdajEKK8wKcpBWtn9q9gqb",
    "total": 0,
    "stakingBalance": 59.84802172,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qj1VUVZgzoEvCd9GNvbQgkkmeedyHCtf68PKJBCcPZBxEYdDnKUV",
    "total": 0,
    "stakingBalance": 16.522393014,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qoaxDvGEGYaWAMWG9Qk5uuKykVC3NgbUhudTRRNoTExiVJWH2CdD",
    "total": 0,
    "stakingBalance": 2.1089,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qk5BJ7DWW62eTzPamzA1iQNbxwVevjgSqBRrpoSi89pAXuJEhvG1",
    "total": 0,
    "stakingBalance": 1.872772757,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmJrcWKJF4djtGz5zMJPH4bR16PnK18BHTsJgN9YWtQugE2EgLra",
    "total": 0,
    "stakingBalance": 1.598837119,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qqhjgsKWN466fxzjyrp1uH2zqFT5gMnuBLdHY9CMxRaiER6M97JS",
    "total": 0,
    "stakingBalance": 0.263292625,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "total": 0,
    "stakingBalance": 0.081177004,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qinpqDF7ongjhpvJLz7QBsExP1BkpceED6GuThYYbSVSbk1nWCvh",
    "total": 0,
    "stakingBalance": 0,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qkcjubxpCvKyJvtisJqVrnNcXHE7EeZPbQ9FNJbTbFwXPVcYnjgX",
    "total": 0,
    "stakingBalance": 0,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qqqmMh6bk7u8JTDWQfkpgmL43WWSDL3soV9aYkgua2eRU6YNM9wf",
    "total": 0,
    "stakingBalance": 0,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qqyZ86GsrRV96xuiStZhJW5D9fzFZvasE6aAToRH8PP2bU2TsM8V",
    "total": 0,
    "stakingBalance": 0,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  }
];
const expectedTransactions: FixtureTransaction[] = [
  {
    "publicKey": "B62qkWU8KTP44FSD43HdJcs8PGkTqbG9N7PF87idheAaHy8jL2JAXnj",
    "amount": 6170294320433,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmNbNedwwDB3bLUzgeN6gAYXmnY4U9WBS6Ze92HghtU7x3v7a2sS",
    "amount": 3451211733813,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoigHEtJCoZ5ekbGHWyr9hYfc6fkZ2A41h9vvVZuvty9amzEz3yB",
    "amount": 1297313314682,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnr6wsfZxsxFk9xEZvsgKTLTmFmd9czVieRpEv4YnQmHUaVMMDTa",
    "amount": 823099757725,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpjEJn5boKL7nqM7G49V4zY3jeE2M3czqG8FXJEbAADstvfF9T7Q",
    "amount": 133376801553,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmMGz5dWhmrx7JgKtnmb4mqu87tqXsMr6wcRmnGzHrd3Y43iwhG9",
    "amount": 131080720342,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpcj9hFMzmpwPs2qXD12atDdjZcDZCXBMNnxy5NJuNErYmJrTrL9",
    "amount": 63273501205,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoGEXsSDG69BoYUQUuiG8NJ25m1hM9VceF1F36ntC6qxqNBdzwCT",
    "amount": 57509438378,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qk449L7LDANBXVHdEcbvTnQqtxqweHptUwKqy1tHVxvGJrKapDwN",
    "amount": 30488102527,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmmFAkd55Vzz4f9F6v5zziAiEnBZArQrmumd3giacLNxhJ4ydHuZ",
    "amount": 26994889469,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnHjLNaDwc4WWy3BLJMmeS6YATWoTYd6MYJemF3uXRNaEoPAc9GV",
    "amount": 26980793155,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkGXYkt4DHG3imcFic5zXRdWfcyQTGFEhbMypVLxmrqP7nsyCTte",
    "amount": 12698704618,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmpKqzKsgu1q2bG5USonaptVm7q5tJohJUkFverKF8GRJdHdHnZ6",
    "amount": 12675761262,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qn62D9WA9C14MMU9vxaE7VspFNeVDD6BtrZ86SzzwYtRqk9Dcsir",
    "amount": 11408313037,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qowtmtUeYUnvjWSDysfJQjk8kNva58xkZHwiAykjLyWcZxgF6mbr",
    "amount": 11022764623,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrwjtHjSk7BdT2e9qscBXCNrSbwy4VPzRC4yn9de7y7LGEJuCNGr",
    "amount": 8782502484,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qojHAgRv7rkbAH5vN5jYU4y4CcPH8cgzevFKKKgXLFgJDNJgzQuG",
    "amount": 6682600798,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqeKZX2etkrguVWr9NQiLVQJBJ48En6SvDVGFyKPghW3QZAVyVNj",
    "amount": 6340985585,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoDXzDeD2B5xfJqYvv6UrNvxb4hH5HT3nMvv72z5M4RKrNjHL6jv",
    "amount": 5477158371,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpbireFMvbNfiwiFEoz44TLB9EYuMHJ71PV89WtjH6iY9ef8pwMn",
    "amount": 4374437030,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrj8zTWCZAxK2EvVqscM2c1JDQuDm4GWa3uJpveb2oxCyWcRHGsF",
    "amount": 3907975392,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkXuDEWRBJSNh9QoPcUgpP9SHcYDtDcvvRVJYPnnYiMmWaV9xSr5",
    "amount": 3818863882,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrM4SEK2uM99CkfJCBZcN1xtV4DzWjq9sWpimTEjJD2ZUH9CcDT9",
    "amount": 2851421318,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qp6opXDeizxByVqaj5SKrWHPTmUxvXRCgi35zkGpRwk7T5UEsraC",
    "amount": 2710103848,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnmehRBzPWnSFFisurehmi8VTPhipWwu53EShdk9qv2yonXPhQsF",
    "amount": 2684644634,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjJagzFcvC42qxEtWMyVBK5GpLzpeE6RMZ5uEqy3ZisezCLazCN1",
    "amount": 2522373929,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkyi3CLthcpGDfg4V3UAcijDPFQw5uDeEBaAKdJ5UQk5SNpk2QZ6",
    "amount": 2364229020,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpr7RYckfwA7dxryu6K7StHarRkXQzVDQ1Hq3vPcwL25bNxb526f",
    "amount": 1533188092,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpQN96tZ9kQNmUVLt6QmtHe5VTJcM9dsN14rkbnGLEcdawpPYvdY",
    "amount": 1280136785,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkSumb4MunaxubL64a5FvXhGjkUDniXfpLJqhAHxL3zbmicy9Z6K",
    "amount": 1256052590,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmJAmEyc92HwT65SHMmdsV5c9pbZ1jFn1jdCLY5Q2XDYbhZaSddG",
    "amount": 1101406744,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqLZqEEQEAu7wjVLurUmEfsKuyhkywBdajEKK8wKcpBWtn9q9gqb",
    "amount": 758626892,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qj1VUVZgzoEvCd9GNvbQgkkmeedyHCtf68PKJBCcPZBxEYdDnKUV",
    "amount": 209436009,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoaxDvGEGYaWAMWG9Qk5uuKykVC3NgbUhudTRRNoTExiVJWH2CdD",
    "amount": 26732164,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qk5BJ7DWW62eTzPamzA1iQNbxwVevjgSqBRrpoSi89pAXuJEhvG1",
    "amount": 23739046,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmJrcWKJF4djtGz5zMJPH4bR16PnK18BHTsJgN9YWtQugE2EgLra",
    "amount": 20266678,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqhjgsKWN466fxzjyrp1uH2zqFT5gMnuBLdHY9CMxRaiER6M97JS",
    "amount": 3337461,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "amount": 1028981,
    "fee": 0,
    "memo": "jrwashburn#0765"
  }
];

export const epoch71Fixture = {
  blocks,
  stakers,
  totalStake: 993555.531873392,
  defaultCommissionRate: 0.05,
  mfCommissionRate: 0.08,
  o1CommissionRate: 0.05,
  investorsCommissionRate: 0.08,
  commissionRates: {},
  burnRates: {},
  burnAddress: 'B62qiburnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmp7r7UN6X',
  payoutMemo: 'jrwashburn#0765',
  bpKeyMd5Hash: 'aa6e6ee40b7c72a7d744596dfa628be3',
  payoutCalculator: 'isolateSuperCharge',
  expectedTransactions,
  expectedBlockHeights: [328228, 328328, 328780, 329140, 329445, 329826, 329927, 330730, 331677],
  expectedTotalPayout: 12318160164555,
};

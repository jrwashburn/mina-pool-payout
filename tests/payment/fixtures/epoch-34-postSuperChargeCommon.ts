import { KeyedRate } from '../../../src/configuration/Model.js';
import { Block, Stake } from '../../../src/core/dataProvider/dataprovider-types.js';

type FixtureTransaction = { publicKey: string; amount: number; fee: number; memo: string };

const blocks: Block[] = [
  {
    "blockheight": 489137,
    "blockdatetime": 1761588900000,
    "coinbase": 720000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 10000000,
    "globalslotsincegenesis": 809165,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 809165,
    "stakingledgerhash": "jwjmGqiXosGg6Yo9Nz3EnDh9v8iHdbtgAS5KWVyrGAp7cnzavX8",
    "statehash": "3NKf1xm1uCKwJX2Q5Pnms65btjmx5qDGqzK55srUo8T2U8xK1e5u",
    "usercommandtransactionfees": 10000000,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 489165,
    "blockdatetime": 1761600960000,
    "coinbase": 720000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 20000000,
    "globalslotsincegenesis": 809232,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 809232,
    "stakingledgerhash": "jwjmGqiXosGg6Yo9Nz3EnDh9v8iHdbtgAS5KWVyrGAp7cnzavX8",
    "statehash": "3NKbb61VpiCWJqc4HZwWtYFKRAfBuLfbm1kKLz2jvP274GUzPdoe",
    "usercommandtransactionfees": 20000000,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 489215,
    "blockdatetime": 1761620220000,
    "coinbase": 720000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 120700000,
    "globalslotsincegenesis": 809339,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 809339,
    "stakingledgerhash": "jwjmGqiXosGg6Yo9Nz3EnDh9v8iHdbtgAS5KWVyrGAp7cnzavX8",
    "statehash": "3NKsBo9sycNcB7ZpNi8CCooncJrtXGxjWocekK2RkKLi3E8yLYUc",
    "usercommandtransactionfees": 120700000,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 489463,
    "blockdatetime": 1761724620000,
    "coinbase": 720000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 302550000,
    "globalslotsincegenesis": 809919,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 809919,
    "stakingledgerhash": "jwjmGqiXosGg6Yo9Nz3EnDh9v8iHdbtgAS5KWVyrGAp7cnzavX8",
    "statehash": "3NLxUcwJwdHQZkybG7RMR4kXPdXLjpBgjdagjaQq19wUH4NzyjPf",
    "usercommandtransactionfees": 302550000,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 489794,
    "blockdatetime": 1761878340000,
    "coinbase": 720000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 20000000,
    "globalslotsincegenesis": 810773,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 810773,
    "stakingledgerhash": "jwjmGqiXosGg6Yo9Nz3EnDh9v8iHdbtgAS5KWVyrGAp7cnzavX8",
    "statehash": "3NLiDpj1CjCxHFnRHZ72dLMcf6UNfe9GUKdxfFUuqfLtMLYg1kcT",
    "usercommandtransactionfees": 20000000,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 490769,
    "blockdatetime": 1762277220000,
    "coinbase": 720000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 1899800000,
    "globalslotsincegenesis": 812989,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 812989,
    "stakingledgerhash": "jwjmGqiXosGg6Yo9Nz3EnDh9v8iHdbtgAS5KWVyrGAp7cnzavX8",
    "statehash": "3NL2gjtXqSAQBURTaisdvf4YXQgFZJ2XrGpqa6Zo9V2SsogF2YP8",
    "usercommandtransactionfees": 1899800000,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 490879,
    "blockdatetime": 1762324920000,
    "coinbase": 720000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 476700000,
    "globalslotsincegenesis": 813254,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 813254,
    "stakingledgerhash": "jwjmGqiXosGg6Yo9Nz3EnDh9v8iHdbtgAS5KWVyrGAp7cnzavX8",
    "statehash": "3NLZ9e9oEQkD6xe2EfvjqouZd7MRfxL2a1CAEp7hxh3ZErDuFxCB",
    "usercommandtransactionfees": 476700000,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 490931,
    "blockdatetime": 1762343640000,
    "coinbase": 720000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 200000000,
    "globalslotsincegenesis": 813358,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 813358,
    "stakingledgerhash": "jwjmGqiXosGg6Yo9Nz3EnDh9v8iHdbtgAS5KWVyrGAp7cnzavX8",
    "statehash": "3NK4eBW4N16zZJLRAXQQ9w4QcrephorvPGRDS7mL9WFdFQbQR5nF",
    "usercommandtransactionfees": 200000000,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 491009,
    "blockdatetime": 1762377660000,
    "coinbase": 720000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 716100000,
    "globalslotsincegenesis": 813547,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 813547,
    "stakingledgerhash": "jwjmGqiXosGg6Yo9Nz3EnDh9v8iHdbtgAS5KWVyrGAp7cnzavX8",
    "statehash": "3NKrEWwKWzb3bpf13po1SNQVzExkgzUz2MfURnR2a1rSeSBWwrQh",
    "usercommandtransactionfees": 716100000,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 491033,
    "blockdatetime": 1762386300000,
    "coinbase": 720000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 500000000,
    "globalslotsincegenesis": 813595,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 813595,
    "stakingledgerhash": "jwjmGqiXosGg6Yo9Nz3EnDh9v8iHdbtgAS5KWVyrGAp7cnzavX8",
    "statehash": "3NKebdpkWnpkojS1sGLfPf3ci7iAiHHgHKH8NLHGU7UrJdCC2kJ1",
    "usercommandtransactionfees": 500000000,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 491345,
    "blockdatetime": 1762507080000,
    "coinbase": 720000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 250901250,
    "globalslotsincegenesis": 814266,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 814266,
    "stakingledgerhash": "jwjmGqiXosGg6Yo9Nz3EnDh9v8iHdbtgAS5KWVyrGAp7cnzavX8",
    "statehash": "3NKfDBi2xjv946p3eWQWWZkJe2kog8ey2Ht6ZE8Q3MTHxzFRTRHz",
    "usercommandtransactionfees": 250901250,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  },
  {
    "blockheight": 491392,
    "blockdatetime": 1762526160000,
    "coinbase": 720000000000,
    "creatorpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "feetransferfromcoinbase": 0,
    "feetransfertoreceiver": 362000000,
    "globalslotsincegenesis": 814372,
    "receiverpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "slot": 814372,
    "stakingledgerhash": "jwjmGqiXosGg6Yo9Nz3EnDh9v8iHdbtgAS5KWVyrGAp7cnzavX8",
    "statehash": "3NLbx2G5Ki2USfAdvLtTx11D1j6KFJrXbmxvYHhs1qLe6V4vKUGf",
    "usercommandtransactionfees": 362000000,
    "winnerpublickey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L"
  }
];
const stakers: Stake[] = [
  {
    "publicKey": "B62qjGkpDRu6bxJWRDdDRP3pByUvdnf2rQBdSuXTF2YkSpxmKkgdbss",
    "total": 0,
    "stakingBalance": 790899.025,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "NPS",
      "shareOwner": "MF"
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpLif5N7kkrSxFoh5B5iNL2s1k2tKhbuN7FLmybYM2AcwzmTuyrX",
    "total": 0,
    "stakingBalance": 632750.481390222,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "NPS",
      "shareOwner": "O1"
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpjEJn5boKL7nqM7G49V4zY3jeE2M3czqG8FXJEbAADstvfF9T7Q",
    "total": 0,
    "stakingBalance": 247786.829117749,
    "untimedAfterSlot": 691200.000603229,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmNbNedwwDB3bLUzgeN6gAYXmnY4U9WBS6Ze92HghtU7x3v7a2sS",
    "total": 0,
    "stakingBalance": 137106.140095597,
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
    "stakingBalance": 25028.240749547,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmMGz5dWhmrx7JgKtnmb4mqu87tqXsMr6wcRmnGzHrd3Y43iwhG9",
    "total": 0,
    "stakingBalance": 10025.645029654,
    "untimedAfterSlot": 691200.000603229,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qkbLxftUetPeHUR4K16d8JEsmXbZTPu6LCD4bD1tdx7y8x8Y9nA2",
    "total": 0,
    "stakingBalance": 6290.319349379,
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
    "stakingBalance": 5740.219122549,
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
    "stakingBalance": 4525.631981195,
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
    "stakingBalance": 2954.653000965,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmrrg2rPHXcFUNZoWSAtBS1kPYTcrvutdteffBayTZGsnpeK4hSJ",
    "total": 0,
    "stakingBalance": 2380.400460878,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpUH5qcvknkBNa8N1RVwn2sZCUxiffmvShXZ1hBgKmaJRYmKDFtz",
    "total": 0,
    "stakingBalance": 2159.722386003,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qn5JSSckhhCXnMiDtDNKDa95zdhoTv7biatmiB6HS9YuwoH63xNc",
    "total": 0,
    "stakingBalance": 1719.441898963,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qkUYxBqfxc4KBWw9pCX6MShVNYXBLb8M2s4enWBDDMbuWK8P9kjZ",
    "total": 0,
    "stakingBalance": 1526.600521681,
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
    "stakingBalance": 1491.762752848,
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
    "stakingBalance": 1218.404711404,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmwNXELHLkPPWnHRkVxEShPeuwWXXWfxYwfFP1ybA4rgsjexqYBf",
    "total": 0,
    "stakingBalance": 1162.216440578,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpcsKkUsZLxqp5hv4XV1NapG9KowUDDcT18GXo3XcS5sGzdFqxxB",
    "total": 0,
    "stakingBalance": 1115.447393889,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qkg8neN5o1xVq2LG6VHygGsqf5UsitTFcgvWgRubwduTdUfK7JCd",
    "total": 0,
    "stakingBalance": 956.992454268,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpQ4Mi9SwFx5mGo5iPZFS7DMcEc3zkv7Gxdo6W6GLPv828nHdVmo",
    "total": 0,
    "stakingBalance": 932.210149071,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qrUGAj9uft5f2g6LPxGB8vRycbZNYjDmNTmS13GqScLTupnw1WkM",
    "total": 0,
    "stakingBalance": 926.843001359,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qkmBdeg8z5ukKH3hCtXKiMRdhBoHJWeUCURFuPg8xvzGY4uTkjVn",
    "total": 0,
    "stakingBalance": 809.794098379,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qnnKrqqGdabhVHiVmsfqAzK7KbhMQvuXsREJVkFeKWfyHxhmw7We",
    "total": 0,
    "stakingBalance": 799.65621914,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qiaGTKNY3Yk7ASDqvJz56hhpX59tRKJ7K9NUtLDySrjrPguKHFyZ",
    "total": 0,
    "stakingBalance": 798.378196658,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjqAQfj5pgYgfUEqTVM4mdj8m61rVRAaLBqhAJUjsSBgpmFiq9P5",
    "total": 0,
    "stakingBalance": 708.213928769,
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
    "stakingBalance": 647.768435681,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjADS8mz88VSsUcJZ5M5LumY2ftmzD4Uovd6CforS3sctKzHCf14",
    "total": 0,
    "stakingBalance": 630.10996847,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjKbNLZQ2ZQHHUooxNURFKShtGmgkibgLLGVzb47sng7wfHr85CG",
    "total": 0,
    "stakingBalance": 614.276665409,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qna7SRdnVJgyWqcxBrVpRHcXeYcbTTsvpnuydTjdGYvL5hsB1ofj",
    "total": 0,
    "stakingBalance": 592.462803296,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qkA7WVaJEk2TyTTkdXCPbaAT6EiHPHB9SyP2tPtcH8fKexEgt4mH",
    "total": 0,
    "stakingBalance": 583.721420993,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmCimUz8zLKbsZDLSzmrm13G3Eb6c7KKEw1ywHS9Xah4JCqpruei",
    "total": 0,
    "stakingBalance": 583.721420993,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qomqB27xwfVxd2KUkDLEmM6DJZcRPPy6ubBkCvjk64EZNgVPBrtK",
    "total": 0,
    "stakingBalance": 583.721420993,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpPBagTeXM9mveDEb9szqFHiBj1NqRNFmTAcVXLZFcK1qwTmUpix",
    "total": 0,
    "stakingBalance": 583.70962959,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qqg89aW2Ky4npHUR5YT1RSL4BkmAwibQPurHWRNACBBe5tuPpFAt",
    "total": 0,
    "stakingBalance": 581.451442746,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpKmGZLAymDDTqPvGsSK7ErWxUg2anLoPnm6QX4H1ubiAuwhxmcZ",
    "total": 0,
    "stakingBalance": 561.97310269,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qk96mW2hsrALqWoQqnCWyTpkbsKmNpRBqp6YnwoEiaQVvmmfn2ds",
    "total": 0,
    "stakingBalance": 531.048768566,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpXYJFaNaYdP21Qov9UHYBpStE1Rx48gFEn3sAn6hScvvoYnzMgY",
    "total": 0,
    "stakingBalance": 494.656580679,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qrF9avbuS1jfdbXvqy6YuhJr7DdjogCWtHcGYEfMi3XGy1QdSVGq",
    "total": 0,
    "stakingBalance": 476.188968771,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjpTbdmeBDuCLofnYUGv3cMZFxKbqu266nLYT45FYzZFLD3iHjsT",
    "total": 0,
    "stakingBalance": 451.091344821,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpjTyiNz1QvNRdAX9WUA7bx8zALSxUsC6AkZz4D54xVbqr915ztB",
    "total": 0,
    "stakingBalance": 376.567145749,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qnj1Mtc2qYDXFTAooVaGdt82W9HWu1XnrmtzwM43sLnjJYAdwxwe",
    "total": 0,
    "stakingBalance": 326.214900949,
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
    "stakingBalance": 260.173307912,
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
    "stakingBalance": 257.911394707,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qipxYHcDhUnWxQkzWZCQjQueigHkCUCVwU4n3wr3o4cdxxZ91aPX",
    "total": 0,
    "stakingBalance": 237.154218525,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qn8tS8E5t6Qs8CLwPkUNCsUqCbX2STza3HXRDoJdXKxx3dyM4aZt",
    "total": 0,
    "stakingBalance": 236.028617387,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qrcCp195eiS7TPTN3hgn88EwtMCEbJ9FgdVVJtsiuPyQ9NnVpBZ4",
    "total": 0,
    "stakingBalance": 213.22423765,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjRkHdv9eGPAvTJjB1y7qgyLFrBnipZpyoKPzd6bP5La3sJZajRa",
    "total": 0,
    "stakingBalance": 211.456582989,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qomNdG8BHSxCcgQSF2uv3nrP4S7yrETBNmASQnqL8qroPrSdcRVW",
    "total": 0,
    "stakingBalance": 199.466246664,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qr38fgeRPnWdXSSrKGwBB9SHTbQ6DYwk7oKMHExWW5fgoK8fHv2B",
    "total": 0,
    "stakingBalance": 194.83688652,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qq1YJNr1jdxTMCAuQdb4cgu5U91CRLY3AHgnUXtUn6LKx8BcuttT",
    "total": 0,
    "stakingBalance": 178.146386497,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qowDLdtUzG4VYsTb6JAQsJDx9XxvxfDzatb2ZKCr9DCp3HZKFtKK",
    "total": 0,
    "stakingBalance": 157.414369049,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qiYS7LJSunkSjiZenPifsqeaBcZ8DivvYAYMiic2iNPfxSHEQHyn",
    "total": 0,
    "stakingBalance": 128.135996116,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpDbie83q9m26ejcHhEmtSdbHGuUd9CxSCHGbABhnouvvmJgeCbg",
    "total": 0,
    "stakingBalance": 127.645115503,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qm38y2SHPx6Qv2nwpRyegPM4TDiuFBjGDfhHqJgZCd1j5m1amoyK",
    "total": 0,
    "stakingBalance": 122.833958264,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpUEp5aSkK9MwBJDt7hMTFpS5QN5eYjSm162oGH6M5WuspSnPH7X",
    "total": 0,
    "stakingBalance": 120.400269079,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qijSsDtum3W8Em9v6qBG1p4ms6f518KDJGzvg4ChDvLLNxuknstC",
    "total": 0,
    "stakingBalance": 115.924283275,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qrjMZ8HAtzS69hK8UxcHYqNpkzrT8CDR93enhQid8TAP26hksmUN",
    "total": 0,
    "stakingBalance": 106.625925642,
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
    "stakingBalance": 73.519774265,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjf5Bp2SXq3ZhCa8zf68FeXFMpyDibU85MrxxZ97NUdNcqiVQpFA",
    "total": 0,
    "stakingBalance": 62.528363332,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjL8reca5GBHSLL56mjRhidNcZbvZ3dDjkcn8udDamV3gBduqdGM",
    "total": 0,
    "stakingBalance": 48.048971529,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qibE3XXWvJJ2witvF9UHSW5N3YxbnRb4LLwreMPViKEbnaYRjCiN",
    "total": 0,
    "stakingBalance": 41.876334823,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qqR8ZM8UmL7dZEwD9dR5NnTYu4UrNk663okVgu9KfdhQ9QpjUHf4",
    "total": 0,
    "stakingBalance": 35.683487417,
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
    "stakingBalance": 25.532991169,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qr1iTaiBnMABRYHxNLtXnYzcW3Kr4mojiBg177XC4t33iD7ZXRsp",
    "total": 0,
    "stakingBalance": 22.469677495,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjVEYEepC5KM4igHuuw7E5d5sCW7MFGPqRir94CVUCMeiXXHF8aE",
    "total": 0,
    "stakingBalance": 21.652035916,
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
    "stakingBalance": 20.296787444,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qp3ES848GVohMjxLdv768RysY16VNUWBdkdX7H8UKrTx3ZoSMx4V",
    "total": 0,
    "stakingBalance": 19.251404123,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qrTGqJfwPXLgR9FEosc3CkHCNGVTaQYe2v58hXFTiQeX7AyCsg8z",
    "total": 0,
    "stakingBalance": 19.192961675,
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
    "stakingBalance": 15.176967861,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qqWVPmZq7kTPPXir2EQ8GUFF8PDm2mGE5gS9q2NMtEtGknWmoqAa",
    "total": 0,
    "stakingBalance": 13.718611469,
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
    "stakingBalance": 12.479376765,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qkTDX59fTdZvGVH42yhfUfGaKTJ71FRqkD71p1UGd32tygHGoSiJ",
    "total": 0,
    "stakingBalance": 11.92253408,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qk7mwRHHqXo9uwHXXb3Lti8rtowwGUcpGQNmqbFb1VggjtCQEKoC",
    "total": 0,
    "stakingBalance": 11.074237814,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjxPaAL3NNdFbmxNFDME3xUnwquCsj44AZX6ToevYFsHuRH5Z2nJ",
    "total": 0,
    "stakingBalance": 10.588297144,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qqr9ekFvzri2LLmHVeH1iquz9EXnkSb3jmrKwZtq4WNLmNn5MeNN",
    "total": 0,
    "stakingBalance": 10.141357345,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qrHrm23nhXzNdvuimpYzhUVXddzhkVLA1kSkfLhdhyRraYrG25ng",
    "total": 0,
    "stakingBalance": 9.774495259,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmp5jc2AHy43qN1To1di3DWmuB4PEk53cFB9A6Rf6MDtLP1jH5Rw",
    "total": 0,
    "stakingBalance": 8.571885683,
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
    "stakingBalance": 8.428071549,
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
    "stakingBalance": 8.133526141,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qnGBCFuSSw1hPFFhMptFyLcAXg2GpWFNbBYQom7ZDdv6NrrTByzQ",
    "total": 0,
    "stakingBalance": 7.916273486,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qj4BduTVPQpUWQ6Ge2KiiQoaiujMpSr2pRHx7ZP7YF1V5GBptGzi",
    "total": 0,
    "stakingBalance": 7.053342491,
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
    "stakingBalance": 6.081177004,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qqjtzsC8Uv5dUhe6mxwecUjJi6UTB82a78onVbEhjbRL4gdVnA7w",
    "total": 0,
    "stakingBalance": 5.613461887,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmYFyXMuYE78pPiozBSmEYNfTnurGzSfPjZhjjpumNxM3RyndK1W",
    "total": 0,
    "stakingBalance": 5.528111874,
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
    "stakingBalance": 5.493731378,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjQYSDE1gSgFTemZDkSdRPPg8aCoP36VAnS6MrMsq16h29Xfcii5",
    "total": 0,
    "stakingBalance": 4.460824831,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qofuuZxZpg8fbdE5uV4pwF4RBKHuQsHfvFEp2MVsYu7BxRx39tEY",
    "total": 0,
    "stakingBalance": 4.265032002,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpZLKfn3EXhD3HU2QSRUXhJ2fNoDmH83pAk6Th2pxJPyRovV1BkL",
    "total": 0,
    "stakingBalance": 3.294373977,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qq6UKWhzxrEuyFm46QoxP8fNXrHRJz6N7S2Zhnuww9mDnYzNhfcN",
    "total": 0,
    "stakingBalance": 3.294373977,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qnaFP3qPgBfyY51ea1c4iSBQD2D3vZ7Ff3F8zb5jgSRxDuMD3h38",
    "total": 0,
    "stakingBalance": 3.28360558,
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
    "stakingBalance": 2.909683731,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmog4xQjk5a1FKyqNXLbQKwnsTN797EfT7wXT53uCcBpNuyLQpda",
    "total": 0,
    "stakingBalance": 2.67337986,
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
    "stakingBalance": 2.591245648,
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
    "stakingBalance": 2.300590621,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qihv96NnW2PTuaqyCaiFdqm6fnbQfAYfyb21XnBQeeLvHBAk7fqi",
    "total": 0,
    "stakingBalance": 2.121581443,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qrMSeLWGB5SkCMiohZLQrd8jPEoxsktLWzeLNtnw7GMh1zykUAQi",
    "total": 0,
    "stakingBalance": 2.121581443,
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
    "stakingBalance": 1.964076833,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjSu6iy4aVAJ1NDXECvbJW3UziKUoS8QYMzcNgPW3APuAFoioYpJ",
    "total": 0,
    "stakingBalance": 1.936316414,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qqCY1g6hvhjGQwAR2DAVwBjojvxAgAeRwUkhLMnoH93557bzZnGu",
    "total": 0,
    "stakingBalance": 1.674160711,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qnyDgWWFHTVKFRJoLCWWgKe4mfRJzBFXMMJ163RjjVxxcgPnqAWT",
    "total": 0,
    "stakingBalance": 1.555282463,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qoDpMaxGj7W64rEy2Qnn8nWuVeuUzwahBEwg2aw6rZofn6kVUbWG",
    "total": 0,
    "stakingBalance": 1.188233123,
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
    "stakingBalance": 1.166729605,
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
    "stakingBalance": 0.950190231,
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
    "stakingBalance": 0.863533792,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjoSQPK9nQze84TAeoCsNn7z3dWi6Crxzq1FE6eC7pHQAsbM9VwW",
    "total": 0,
    "stakingBalance": 0.849837953,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qnVeh96Nx4nLikmjr58p44FR2Q4jrdqX58ARcFCBS7gqEk3baBti",
    "total": 0,
    "stakingBalance": 0.644248702,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qonXAYHauG3g5LUWF8UkLaoha2gSh292Dixaw6PdLxFTzXzzyGkz",
    "total": 0,
    "stakingBalance": 0.552380554,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qnMmkrG4EPbfqZtPtpii174hC46MrbXyfE3W9RjLcW1Vm7GMRZwu",
    "total": 0,
    "stakingBalance": 0.518476605,
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
    "stakingBalance": 0.278205045,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qqwNbAoivZGASXLExDhbWARBBT6tPKVQxUPPrxYrmaaM3o3AapMn",
    "total": 0,
    "stakingBalance": 0.145451016,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpV7BQVkVwTcx5sm7qUXSdwpy3AyjPhhZ16RUEE4xjfWgP8NYjoZ",
    "total": 0,
    "stakingBalance": 0.126414539,
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
    "stakingBalance": 0.121859966,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjYgdYhgUY1dLcuy28hCPpRDMdth4RFGo5VoYjnsCPZ6TJZTRRUf",
    "total": 0,
    "stakingBalance": 0.11354181,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpLwJk82BM3pH3wAEmAeLuaScfwwEpZeABWJghX7MmZrGufY67Qf",
    "total": 0,
    "stakingBalance": 0.108677967,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qqhbSGUW56jjikxUYJsW8674b11PZRTrerLycJVxMkSjSakfG4Dy",
    "total": 0,
    "stakingBalance": 0.10072885,
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
    "stakingBalance": 0.097433384,
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
    "stakingBalance": 0.089991792,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qrodVyskqz5Ld3aA5MjB2RXkYUwzjuoveGaNQZJ4HSKdb8SfncZM",
    "total": 0,
    "stakingBalance": 0.082134324,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmC1mbpozWA5LXRsQnmN3bBbu6WCUmtcHYZz5gKU8hH9gpHy2j84",
    "total": 0,
    "stakingBalance": 0.078976867,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qnrCSpPc8dLsoDrvXqYysYr8dEyLhnVqUQ2VkAb5qEosDwBAzKc8",
    "total": 0,
    "stakingBalance": 0.078701872,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qiuuSboSrp8ZW8ifbcDVZNubHp3SMKiVP8z2KQrrWXPNTUG941jx",
    "total": 0,
    "stakingBalance": 0.0787,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qokcyDx91t9MHwFTHTzQ77Rv6SAQ8xHqdsV5thnGaqkaVjYb8Kch",
    "total": 0,
    "stakingBalance": 0.078677284,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qp4vteujR2Q9Bhh2kTWTKd6ZKuqSgbUDT4vpy94eVgPyeW1kXDJg",
    "total": 0,
    "stakingBalance": 0.078649804,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qrJ3nsqccoyM1jbrM9iCVJ4J61yuzLC4WVxksTMaZLUYy5VFSShC",
    "total": 0,
    "stakingBalance": 0.064724094,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qnJVQcj4gvfY1GBFryQZ4RJgfwqmVwCXB6umnH5cJQPFMLvotRL3",
    "total": 0,
    "stakingBalance": 0.063953413,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qrc2Y9L8fvpMrMcWuZ4qCuFpTDa3RLvUYg91wtQaeU4f2xyYu2wu",
    "total": 0,
    "stakingBalance": 0.061871899,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qrpBLx4SgQBsbQVFPY9aKxVyyAboKvgmxA1Tv8eYwFokZY5Ksduy",
    "total": 0,
    "stakingBalance": 0.061738134,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmLLtt6rAfbsgbkFiVYeFH8npSABBErj3DGqpxBcF9H2kDMvc55k",
    "total": 0,
    "stakingBalance": 0.061620414,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qr3kQibM6m88MPFdrUCLppCphTx29rLLAgMGvVdbX5yF6UGnBRQT",
    "total": 0,
    "stakingBalance": 0.061608701,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjk8gV2exRwRdHsTwQcpbHmt2cd1ZrXypSEUjiMu3qcg4DmshGhy",
    "total": 0,
    "stakingBalance": 0.061540769,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qnvJVpgGbxuviuEhV4jdDVhSFTEB6tBMbD1BeKGSLvw69g9DidjK",
    "total": 0,
    "stakingBalance": 0.055857095,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qouNgTR3wA4Q3k4swY4ExuJ3jbEc87Qe7Wy88Ew6g2yP9s2aTjFv",
    "total": 0,
    "stakingBalance": 0.055334077,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qiYHw2wqcYmCsoxRfFwYmAMTj8cwTBULJoewZ7bqhTCcEcRobHVW",
    "total": 0,
    "stakingBalance": 0.044180255,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qn29kPY7Lom1uZFqVN68dwJsLj9xmrckaMAVf2cYh27JdRd6VHH6",
    "total": 0,
    "stakingBalance": 0.029659968,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmLHpWmgZbam2DCdiShNC9jRuifCqHT9byo2kP7HkY3zkiTdVxps",
    "total": 0,
    "stakingBalance": 0.028519584,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qr5X4FDmPYyPjnjCNs8R6LfZqzYeYDrUf9a3gjzxqppkujdzPqfz",
    "total": 0,
    "stakingBalance": 0.0237325,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qjdzSu2UxcXSyZte7QS5S33PcZfNdv8LqKBzLa1xP12V1tEhx5aN",
    "total": 0,
    "stakingBalance": 0.019995651,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "Common",
      "shareOwner": ""
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmgnRxeMJcEGfF9Hbr1FzLPuzPqhzXvacK3rJ4LVnNdURp2jxvzG",
    "total": 0,
    "stakingBalance": 0.010787463,
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
    "publicKey": "B62qksjC1ZbGgdAz2VVdwY1YGMccNKbFZfCjpjq8KBkaeiF52d9szso",
    "total": 0,
    "stakingBalance": 0,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "NPS",
      "shareOwner": "MF"
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qmD3wTgybNasijqCx5hqTBvvioecaNSNTMvrxyuHkyZzrM38cCTh",
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
    "publicKey": "B62qmZFJN86FaPewT225BQUytfvncvJ8kwbF4zjbQHvXoa6o5YeSykt",
    "total": 0,
    "stakingBalance": 0,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "NPS",
      "shareOwner": "O1"
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qn62D9WA9C14MMU9vxaE7VspFNeVDD6BtrZ86SzzwYtRqk9Dcsir",
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
    "publicKey": "B62qnr6wsfZxsxFk9xEZvsgKTLTmFmd9czVieRpEv4YnQmHUaVMMDTa",
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
    "publicKey": "B62qoASpshsiwXKao4hrcx98GkqWjMMDR1TpWqZ2vWFGKGKWnMqjsah",
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
    "publicKey": "B62qoHSDhreaNJ3QL6SX1TXt3QvMLNf5Bt1GMSe86p9TUm2Ui7QwtYm",
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
    "publicKey": "B62qpqrjDLeoP6R9darEYMpykQqr7xrLxHdsY6LNyLuW4CC8kgZpviK",
    "total": 0,
    "stakingBalance": 0,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "NPS",
      "shareOwner": "O1"
    },
    "totalToBurn": 0
  },
  {
    "publicKey": "B62qpUDNRQosRHsfJBsH5MLRkbJ8kRbPUHKQBj8Wu6Z8VUeSRKJT25j",
    "total": 0,
    "stakingBalance": 0,
    "untimedAfterSlot": 0,
    "shareClass": {
      "shareClass": "NPS",
      "shareOwner": "O1"
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
  },
  {
    "publicKey": "B62qrwjtHjSk7BdT2e9qscBXCNrSbwy4VPzRC4yn9de7y7LGEJuCNGr",
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
    "publicKey": "B62qjGkpDRu6bxJWRDdDRP3pByUvdnf2rQBdSuXTF2YkSpxmKkgdbss",
    "amount": 3319451597904,
    "fee": 0,
    "memo": "aa6e6ee40b7c72a7d744596dfa628be3"
  },
  {
    "publicKey": "B62qpLif5N7kkrSxFoh5B5iNL2s1k2tKhbuN7FLmybYM2AcwzmTuyrX",
    "amount": 2742291152256,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpjEJn5boKL7nqM7G49V4zY3jeE2M3czqG8FXJEbAADstvfF9T7Q",
    "amount": 1076330976475,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmNbNedwwDB3bLUzgeN6gAYXmnY4U9WBS6Ze92HghtU7x3v7a2sS",
    "amount": 595558634703,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoigHEtJCoZ5ekbGHWyr9hYfc6fkZ2A41h9vvVZuvty9amzEz3yB",
    "amount": 108717121485,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmMGz5dWhmrx7JgKtnmb4mqu87tqXsMr6wcRmnGzHrd3Y43iwhG9",
    "amount": 43549176281,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkbLxftUetPeHUR4K16d8JEsmXbZTPu6LCD4bD1tdx7y8x8Y9nA2",
    "amount": 27323750774,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnHjLNaDwc4WWy3BLJMmeS6YATWoTYd6MYJemF3uXRNaEoPAc9GV",
    "amount": 24934237511,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoGEXsSDG69BoYUQUuiG8NJ25m1hM9VceF1F36ntC6qxqNBdzwCT",
    "amount": 19658340618,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qk449L7LDANBXVHdEcbvTnQqtxqweHptUwKqy1tHVxvGJrKapDwN",
    "amount": 12834356687,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmrrg2rPHXcFUNZoWSAtBS1kPYTcrvutdteffBayTZGsnpeK4hSJ",
    "amount": 10339931138,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpUH5qcvknkBNa8N1RVwn2sZCUxiffmvShXZ1hBgKmaJRYmKDFtz",
    "amount": 9381354574,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qn5JSSckhhCXnMiDtDNKDa95zdhoTv7biatmiB6HS9YuwoH63xNc",
    "amount": 7468873873,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkUYxBqfxc4KBWw9pCX6MShVNYXBLb8M2s4enWBDDMbuWK8P9kjZ",
    "amount": 6631213742,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qowtmtUeYUnvjWSDysfJQjk8kNva58xkZHwiAykjLyWcZxgF6mbr",
    "amount": 6479886209,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmpKqzKsgu1q2bG5USonaptVm7q5tJohJUkFverKF8GRJdHdHnZ6",
    "amount": 5292479561,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmwNXELHLkPPWnHRkVxEShPeuwWXXWfxYwfFP1ybA4rgsjexqYBf",
    "amount": 5048410196,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpcsKkUsZLxqp5hv4XV1NapG9KowUDDcT18GXo3XcS5sGzdFqxxB",
    "amount": 4845255829,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkg8neN5o1xVq2LG6VHygGsqf5UsitTFcgvWgRubwduTdUfK7JCd",
    "amount": 4156962756,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpQ4Mi9SwFx5mGo5iPZFS7DMcEc3zkv7Gxdo6W6GLPv828nHdVmo",
    "amount": 4049313929,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrUGAj9uft5f2g6LPxGB8vRycbZNYjDmNTmS13GqScLTupnw1WkM",
    "amount": 4026000230,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkmBdeg8z5ukKH3hCtXKiMRdhBoHJWeUCURFuPg8xvzGY4uTkjVn",
    "amount": 3517565782,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnnKrqqGdabhVHiVmsfqAzK7KbhMQvuXsREJVkFeKWfyHxhmw7We",
    "amount": 3473529085,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qiaGTKNY3Yk7ASDqvJz56hhpX59tRKJ7K9NUtLDySrjrPguKHFyZ",
    "amount": 3467977637,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjqAQfj5pgYgfUEqTVM4mdj8m61rVRAaLBqhAJUjsSBgpmFiq9P5",
    "amount": 3076324072,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qojHAgRv7rkbAH5vN5jYU4y4CcPH8cgzevFKKKgXLFgJDNJgzQuG",
    "amount": 2813762268,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjADS8mz88VSsUcJZ5M5LumY2ftmzD4Uovd6CforS3sctKzHCf14",
    "amount": 2737057804,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjKbNLZQ2ZQHHUooxNURFKShtGmgkibgLLGVzb47sng7wfHr85CG",
    "amount": 2668281454,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qna7SRdnVJgyWqcxBrVpRHcXeYcbTTsvpnuydTjdGYvL5hsB1ofj",
    "amount": 2573526879,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkA7WVaJEk2TyTTkdXCPbaAT6EiHPHB9SyP2tPtcH8fKexEgt4mH",
    "amount": 2535556251,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmCimUz8zLKbsZDLSzmrm13G3Eb6c7KKEw1ywHS9Xah4JCqpruei",
    "amount": 2535556251,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qomqB27xwfVxd2KUkDLEmM6DJZcRPPy6ubBkCvjk64EZNgVPBrtK",
    "amount": 2535556251,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpPBagTeXM9mveDEb9szqFHiBj1NqRNFmTAcVXLZFcK1qwTmUpix",
    "amount": 2535505029,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqg89aW2Ky4npHUR5YT1RSL4BkmAwibQPurHWRNACBBe5tuPpFAt",
    "amount": 2525695968,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpKmGZLAymDDTqPvGsSK7ErWxUg2anLoPnm6QX4H1ubiAuwhxmcZ",
    "amount": 2441086387,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qk96mW2hsrALqWoQqnCWyTpkbsKmNpRBqp6YnwoEiaQVvmmfn2ds",
    "amount": 2306757948,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpXYJFaNaYdP21Qov9UHYBpStE1Rx48gFEn3sAn6hScvvoYnzMgY",
    "amount": 2148678356,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrF9avbuS1jfdbXvqy6YuhJr7DdjogCWtHcGYEfMi3XGy1QdSVGq",
    "amount": 2068459155,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjpTbdmeBDuCLofnYUGv3cMZFxKbqu266nLYT45FYzZFLD3iHjsT",
    "amount": 1959440649,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpjTyiNz1QvNRdAX9WUA7bx8zALSxUsC6AkZz4D54xVbqr915ztB",
    "amount": 1635724074,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnj1Mtc2qYDXFTAooVaGdt82W9HWu1XnrmtzwM43sLnjJYAdwxwe",
    "amount": 1417005096,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnmehRBzPWnSFFisurehmi8VTPhipWwu53EShdk9qv2yonXPhQsF",
    "amount": 1130135081,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qp6opXDeizxByVqaj5SKrWHPTmUxvXRCgi35zkGpRwk7T5UEsraC",
    "amount": 1120309830,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qipxYHcDhUnWxQkzWZCQjQueigHkCUCVwU4n3wr3o4cdxxZ91aPX",
    "amount": 1030145266,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qn8tS8E5t6Qs8CLwPkUNCsUqCbX2STza3HXRDoJdXKxx3dyM4aZt",
    "amount": 1025255905,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrcCp195eiS7TPTN3hgn88EwtMCEbJ9FgdVVJtsiuPyQ9NnVpBZ4",
    "amount": 926198735,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjRkHdv9eGPAvTJjB1y7qgyLFrBnipZpyoKPzd6bP5La3sJZajRa",
    "amount": 918520439,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qomNdG8BHSxCcgQSF2uv3nrP4S7yrETBNmASQnqL8qroPrSdcRVW",
    "amount": 866437078,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qr38fgeRPnWdXSSrKGwBB9SHTbQ6DYwk7oKMHExWW5fgoK8fHv2B",
    "amount": 846328171,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qq1YJNr1jdxTMCAuQdb4cgu5U91CRLY3AHgnUXtUn6LKx8BcuttT",
    "amount": 773828337,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qowDLdtUzG4VYsTb6JAQsJDx9XxvxfDzatb2ZKCr9DCp3HZKFtKK",
    "amount": 683773066,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qiYS7LJSunkSjiZenPifsqeaBcZ8DivvYAYMiic2iNPfxSHEQHyn",
    "amount": 556594311,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpDbie83q9m26ejcHhEmtSdbHGuUd9CxSCHGbABhnouvvmJgeCbg",
    "amount": 554462029,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qm38y2SHPx6Qv2nwpRyegPM4TDiuFBjGDfhHqJgZCd1j5m1amoyK",
    "amount": 533563434,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpUEp5aSkK9MwBJDt7hMTFpS5QN5eYjSm162oGH6M5WuspSnPH7X",
    "amount": 522992021,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qijSsDtum3W8Em9v6qBG1p4ms6f518KDJGzvg4ChDvLLNxuknstC",
    "amount": 503549340,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrjMZ8HAtzS69hK8UxcHYqNpkzrT8CDR93enhQid8TAP26hksmUN",
    "amount": 463159333,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqLZqEEQEAu7wjVLurUmEfsKuyhkywBdajEKK8wKcpBWtn9q9gqb",
    "amount": 319353572,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjf5Bp2SXq3ZhCa8zf68FeXFMpyDibU85MrxxZ97NUdNcqiVQpFA",
    "amount": 271609320,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjL8reca5GBHSLL56mjRhidNcZbvZ3dDjkcn8udDamV3gBduqdGM",
    "amount": 208714059,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qibE3XXWvJJ2witvF9UHSW5N3YxbnRb4LLwreMPViKEbnaYRjCiN",
    "amount": 181901487,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqR8ZM8UmL7dZEwD9dR5NnTYu4UrNk663okVgu9KfdhQ9QpjUHf4",
    "amount": 155001131,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrj8zTWCZAxK2EvVqscM2c1JDQuDm4GWa3uJpveb2oxCyWcRHGsF",
    "amount": 110909638,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qr1iTaiBnMABRYHxNLtXnYzcW3Kr4mojiBg177XC4t33iD7ZXRsp",
    "amount": 97603281,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjVEYEepC5KM4igHuuw7E5d5sCW7MFGPqRir94CVUCMeiXXHF8aE",
    "amount": 94051622,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qj1VUVZgzoEvCd9GNvbQgkkmeedyHCtf68PKJBCcPZBxEYdDnKUV",
    "amount": 88164722,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qp3ES848GVohMjxLdv768RysY16VNUWBdkdX7H8UKrTx3ZoSMx4V",
    "amount": 83623816,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrTGqJfwPXLgR9FEosc3CkHCNGVTaQYe2v58hXFTiQeX7AyCsg8z",
    "amount": 83369958,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmmFAkd55Vzz4f9F6v5zziAiEnBZArQrmumd3giacLNxhJ4ydHuZ",
    "amount": 65925373,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqWVPmZq7kTPPXir2EQ8GUFF8PDm2mGE5gS9q2NMtEtGknWmoqAa",
    "amount": 59590588,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqeKZX2etkrguVWr9NQiLVQJBJ48En6SvDVGFyKPghW3QZAVyVNj",
    "amount": 54207629,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkTDX59fTdZvGVH42yhfUfGaKTJ71FRqkD71p1UGd32tygHGoSiJ",
    "amount": 51788833,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qk7mwRHHqXo9uwHXXb3Lti8rtowwGUcpGQNmqbFb1VggjtCQEKoC",
    "amount": 48104018,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjxPaAL3NNdFbmxNFDME3xUnwquCsj44AZX6ToevYFsHuRH5Z2nJ",
    "amount": 45993203,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqr9ekFvzri2LLmHVeH1iquz9EXnkSb3jmrKwZtq4WNLmNn5MeNN",
    "amount": 44051795,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrHrm23nhXzNdvuimpYzhUVXddzhkVLA1kSkfLhdhyRraYrG25ng",
    "amount": 42458229,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmp5jc2AHy43qN1To1di3DWmuB4PEk53cFB9A6Rf6MDtLP1jH5Rw",
    "amount": 37234356,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpbireFMvbNfiwiFEoz44TLB9EYuMHJ71PV89WtjH6iY9ef8pwMn",
    "amount": 36609658,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkGXYkt4DHG3imcFic5zXRdWfcyQTGFEhbMypVLxmrqP7nsyCTte",
    "amount": 35330219,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnGBCFuSSw1hPFFhMptFyLcAXg2GpWFNbBYQom7ZDdv6NrrTByzQ",
    "amount": 34386521,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qj4BduTVPQpUWQ6Ge2KiiQoaiujMpSr2pRHx7ZP7YF1V5GBptGzi",
    "amount": 30638143,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "amount": 26415266,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqjtzsC8Uv5dUhe6mxwecUjJi6UTB82a78onVbEhjbRL4gdVnA7w",
    "amount": 24383617,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmYFyXMuYE78pPiozBSmEYNfTnurGzSfPjZhjjpumNxM3RyndK1W",
    "amount": 24012874,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrM4SEK2uM99CkfJCBZcN1xtV4DzWjq9sWpimTEjJD2ZUH9CcDT9",
    "amount": 23863530,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjQYSDE1gSgFTemZDkSdRPPg8aCoP36VAnS6MrMsq16h29Xfcii5",
    "amount": 19376825,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qofuuZxZpg8fbdE5uV4pwF4RBKHuQsHfvFEp2MVsYu7BxRx39tEY",
    "amount": 18526340,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpZLKfn3EXhD3HU2QSRUXhJ2fNoDmH83pAk6Th2pxJPyRovV1BkL",
    "amount": 14310016,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qq6UKWhzxrEuyFm46QoxP8fNXrHRJz6N7S2Zhnuww9mDnYzNhfcN",
    "amount": 14310016,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnaFP3qPgBfyY51ea1c4iSBQD2D3vZ7Ff3F8zb5jgSRxDuMD3h38",
    "amount": 14263241,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpr7RYckfwA7dxryu6K7StHarRkXQzVDQ1Hq3vPcwL25bNxb526f",
    "amount": 12639004,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmog4xQjk5a1FKyqNXLbQKwnsTN797EfT7wXT53uCcBpNuyLQpda",
    "amount": 11612562,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoaxDvGEGYaWAMWG9Qk5uuKykVC3NgbUhudTRRNoTExiVJWH2CdD",
    "amount": 11255781,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qk5BJ7DWW62eTzPamzA1iQNbxwVevjgSqBRrpoSi89pAXuJEhvG1",
    "amount": 9993240,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qihv96NnW2PTuaqyCaiFdqm6fnbQfAYfyb21XnBQeeLvHBAk7fqi",
    "amount": 9215665,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrMSeLWGB5SkCMiohZLQrd8jPEoxsktLWzeLNtnw7GMh1zykUAQi",
    "amount": 9215665,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmJrcWKJF4djtGz5zMJPH4bR16PnK18BHTsJgN9YWtQugE2EgLra",
    "amount": 8531504,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjSu6iy4aVAJ1NDXECvbJW3UziKUoS8QYMzcNgPW3APuAFoioYpJ",
    "amount": 8410920,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqCY1g6hvhjGQwAR2DAVwBjojvxAgAeRwUkhLMnoH93557bzZnGu",
    "amount": 7272175,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnyDgWWFHTVKFRJoLCWWgKe4mfRJzBFXMMJ163RjjVxxcgPnqAWT",
    "amount": 6755795,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoDpMaxGj7W64rEy2Qnn8nWuVeuUzwahBEwg2aw6rZofn6kVUbWG",
    "amount": 5161411,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpQN96tZ9kQNmUVLt6QmtHe5VTJcM9dsN14rkbnGLEcdawpPYvdY",
    "amount": 5068006,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmJAmEyc92HwT65SHMmdsV5c9pbZ1jFn1jdCLY5Q2XDYbhZaSddG",
    "amount": 4127398,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkSumb4MunaxubL64a5FvXhGjkUDniXfpLJqhAHxL3zbmicy9Z6K",
    "amount": 3750980,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjoSQPK9nQze84TAeoCsNn7z3dWi6Crxzq1FE6eC7pHQAsbM9VwW",
    "amount": 3691495,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnVeh96Nx4nLikmjr58p44FR2Q4jrdqX58ARcFCBS7gqEk3baBti",
    "amount": 2798458,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qonXAYHauG3g5LUWF8UkLaoha2gSh292Dixaw6PdLxFTzXzzyGkz",
    "amount": 2399402,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnMmkrG4EPbfqZtPtpii174hC46MrbXyfE3W9RjLcW1Vm7GMRZwu",
    "amount": 2252139,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqhjgsKWN466fxzjyrp1uH2zqFT5gMnuBLdHY9CMxRaiER6M97JS",
    "amount": 1208449,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqwNbAoivZGASXLExDhbWARBBT6tPKVQxUPPrxYrmaaM3o3AapMn",
    "amount": 631798,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpV7BQVkVwTcx5sm7qUXSdwpy3AyjPhhZ16RUEE4xjfWgP8NYjoZ",
    "amount": 549101,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkyi3CLthcpGDfg4V3UAcijDPFQw5uDeEBaAKdJ5UQk5SNpk2QZ6",
    "amount": 529315,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjYgdYhgUY1dLcuy28hCPpRDMdth4RFGo5VoYjnsCPZ6TJZTRRUf",
    "amount": 493185,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpLwJk82BM3pH3wAEmAeLuaScfwwEpZeABWJghX7MmZrGufY67Qf",
    "amount": 472066,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqhbSGUW56jjikxUYJsW8674b11PZRTrerLycJVxMkSjSakfG4Dy",
    "amount": 437536,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqqmMh6bk7u8JTDWQfkpgmL43WWSDL3soV9aYkgua2eRU6YNM9wf",
    "amount": 423220,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkXuDEWRBJSNh9QoPcUgpP9SHcYDtDcvvRVJYPnnYiMmWaV9xSr5",
    "amount": 390892,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrodVyskqz5Ld3aA5MjB2RXkYUwzjuoveGaNQZJ4HSKdb8SfncZM",
    "amount": 356761,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmC1mbpozWA5LXRsQnmN3bBbu6WCUmtcHYZz5gKU8hH9gpHy2j84",
    "amount": 343050,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnrCSpPc8dLsoDrvXqYysYr8dEyLhnVqUQ2VkAb5qEosDwBAzKc8",
    "amount": 341846,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qiuuSboSrp8ZW8ifbcDVZNubHp3SMKiVP8z2KQrrWXPNTUG941jx",
    "amount": 341846,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qokcyDx91t9MHwFTHTzQ77Rv6SAQ8xHqdsV5thnGaqkaVjYb8Kch",
    "amount": 341749,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qp4vteujR2Q9Bhh2kTWTKd6ZKuqSgbUDT4vpy94eVgPyeW1kXDJg",
    "amount": 341629,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrJ3nsqccoyM1jbrM9iCVJ4J61yuzLC4WVxksTMaZLUYy5VFSShC",
    "amount": 281132,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnJVQcj4gvfY1GBFryQZ4RJgfwqmVwCXB6umnH5cJQPFMLvotRL3",
    "amount": 277788,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrc2Y9L8fvpMrMcWuZ4qCuFpTDa3RLvUYg91wtQaeU4f2xyYu2wu",
    "amount": 268744,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrpBLx4SgQBsbQVFPY9aKxVyyAboKvgmxA1Tv8eYwFokZY5Ksduy",
    "amount": 268167,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmLLtt6rAfbsgbkFiVYeFH8npSABBErj3DGqpxBcF9H2kDMvc55k",
    "amount": 267651,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qr3kQibM6m88MPFdrUCLppCphTx29rLLAgMGvVdbX5yF6UGnBRQT",
    "amount": 267603,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjk8gV2exRwRdHsTwQcpbHmt2cd1ZrXypSEUjiMu3qcg4DmshGhy",
    "amount": 267315,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnvJVpgGbxuviuEhV4jdDVhSFTEB6tBMbD1BeKGSLvw69g9DidjK",
    "amount": 242621,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qouNgTR3wA4Q3k4swY4ExuJ3jbEc87Qe7Wy88Ew6g2yP9s2aTjFv",
    "amount": 240349,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qiYHw2wqcYmCsoxRfFwYmAMTj8cwTBULJoewZ7bqhTCcEcRobHVW",
    "amount": 191900,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qn29kPY7Lom1uZFqVN68dwJsLj9xmrckaMAVf2cYh27JdRd6VHH6",
    "amount": 128818,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmLHpWmgZbam2DCdiShNC9jRuifCqHT9byo2kP7HkY3zkiTdVxps",
    "amount": 123875,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qr5X4FDmPYyPjnjCNs8R6LfZqzYeYDrUf9a3gjzxqppkujdzPqfz",
    "amount": 103079,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjdzSu2UxcXSyZte7QS5S33PcZfNdv8LqKBzLa1xP12V1tEhx5aN",
    "amount": 86843,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmgnRxeMJcEGfF9Hbr1FzLPuzPqhzXvacK3rJ4LVnNdURp2jxvzG",
    "amount": 46852,
    "fee": 0,
    "memo": "jrwashburn#0765"
  }
];

export const epoch34PostSuperchargeFixture = {
  blocks,
  stakers,
  totalStake: 1893896.622523974,
  defaultCommissionRate: 0.05,
  mfCommissionRate: 0.08,
  o1CommissionRate: 0.05,
  investorsCommissionRate: 0.08,
  commissionRates: {} as KeyedRate,
  burnRates: {} as KeyedRate,
  burnAddress: 'B62qiburnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmp7r7UN6X',
  payoutMemo: 'jrwashburn#0765',
  bpKeyMd5Hash: 'aa6e6ee40b7c72a7d744596dfa628be3',
  payoutCalculator: 'postSuperChargeCommonShareFees',
  expectedTransactions,
  expectedBlockHeights: [489137,489165,489215,489463,489794,490769,490879,490931,491009,491033,491345,491392],
  expectedTotalPayout: 8104391825179,
};

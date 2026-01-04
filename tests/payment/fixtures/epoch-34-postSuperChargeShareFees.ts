import { epoch34PostSuperchargeFixture } from './epoch-34-postSuperChargeCommon.js';

type FixtureTransaction = { publicKey: string; amount: number; fee: number; memo: string };

const {
  expectedTransactions: _,  // eslint-disable-line @typescript-eslint/no-unused-vars
  expectedTotalPayout: __,  // eslint-disable-line @typescript-eslint/no-unused-vars
  payoutCalculator: ___,  // eslint-disable-line @typescript-eslint/no-unused-vars
  ...epoch34Base
} = epoch34PostSuperchargeFixture;

const expectedTransactions: FixtureTransaction[] = [
  {
    "publicKey": "B62qjGkpDRu6bxJWRDdDRP3pByUvdnf2rQBdSuXTF2YkSpxmKkgdbss",
    "amount": 3321325993583,
    "fee": 0,
    "memo": "aa6e6ee40b7c72a7d744596dfa628be3"
  },
  {
    "publicKey": "B62qpLif5N7kkrSxFoh5B5iNL2s1k2tKhbuN7FLmybYM2AcwzmTuyrX",
    "amount": 2743839642581,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpjEJn5boKL7nqM7G49V4zY3jeE2M3czqG8FXJEbAADstvfF9T7Q",
    "amount": 1074495151937,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmNbNedwwDB3bLUzgeN6gAYXmnY4U9WBS6Ze92HghtU7x3v7a2sS",
    "amount": 594542830860,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoigHEtJCoZ5ekbGHWyr9hYfc6fkZ2A41h9vvVZuvty9amzEz3yB",
    "amount": 108531690088,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmMGz5dWhmrx7JgKtnmb4mqu87tqXsMr6wcRmnGzHrd3Y43iwhG9",
    "amount": 43474897421,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkbLxftUetPeHUR4K16d8JEsmXbZTPu6LCD4bD1tdx7y8x8Y9nA2",
    "amount": 27277146519,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnHjLNaDwc4WWy3BLJMmeS6YATWoTYd6MYJemF3uXRNaEoPAc9GV",
    "amount": 24891708888,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoGEXsSDG69BoYUQUuiG8NJ25m1hM9VceF1F36ntC6qxqNBdzwCT",
    "amount": 19624810726,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qk449L7LDANBXVHdEcbvTnQqtxqweHptUwKqy1tHVxvGJrKapDwN",
    "amount": 12812466002,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmrrg2rPHXcFUNZoWSAtBS1kPYTcrvutdteffBayTZGsnpeK4hSJ",
    "amount": 10322295025,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpUH5qcvknkBNa8N1RVwn2sZCUxiffmvShXZ1hBgKmaJRYmKDFtz",
    "amount": 9365353437,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qn5JSSckhhCXnMiDtDNKDa95zdhoTv7biatmiB6HS9YuwoH63xNc",
    "amount": 7456134732,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkUYxBqfxc4KBWw9pCX6MShVNYXBLb8M2s4enWBDDMbuWK8P9kjZ",
    "amount": 6619903342,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qowtmtUeYUnvjWSDysfJQjk8kNva58xkZHwiAykjLyWcZxgF6mbr",
    "amount": 6468833916,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmpKqzKsgu1q2bG5USonaptVm7q5tJohJUkFverKF8GRJdHdHnZ6",
    "amount": 5283452550,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmwNXELHLkPPWnHRkVxEShPeuwWXXWfxYwfFP1ybA4rgsjexqYBf",
    "amount": 5039799468,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpcsKkUsZLxqp5hv4XV1NapG9KowUDDcT18GXo3XcS5sGzdFqxxB",
    "amount": 4836991620,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkg8neN5o1xVq2LG6VHygGsqf5UsitTFcgvWgRubwduTdUfK7JCd",
    "amount": 4149872512,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpQ4Mi9SwFx5mGo5iPZFS7DMcEc3zkv7Gxdo6W6GLPv828nHdVmo",
    "amount": 4042407291,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrUGAj9uft5f2g6LPxGB8vRycbZNYjDmNTmS13GqScLTupnw1WkM",
    "amount": 4019133357,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkmBdeg8z5ukKH3hCtXKiMRdhBoHJWeUCURFuPg8xvzGY4uTkjVn",
    "amount": 3511566110,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnnKrqqGdabhVHiVmsfqAzK7KbhMQvuXsREJVkFeKWfyHxhmw7We",
    "amount": 3467604523,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qiaGTKNY3Yk7ASDqvJz56hhpX59tRKJ7K9NUtLDySrjrPguKHFyZ",
    "amount": 3462062544,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjqAQfj5pgYgfUEqTVM4mdj8m61rVRAaLBqhAJUjsSBgpmFiq9P5",
    "amount": 3071076999,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qojHAgRv7rkbAH5vN5jYU4y4CcPH8cgzevFKKKgXLFgJDNJgzQuG",
    "amount": 2808963030,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjADS8mz88VSsUcJZ5M5LumY2ftmzD4Uovd6CforS3sctKzHCf14",
    "amount": 2732389399,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjKbNLZQ2ZQHHUooxNURFKShtGmgkibgLLGVzb47sng7wfHr85CG",
    "amount": 2663730351,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qna7SRdnVJgyWqcxBrVpRHcXeYcbTTsvpnuydTjdGYvL5hsB1ofj",
    "amount": 2569137393,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkA7WVaJEk2TyTTkdXCPbaAT6EiHPHB9SyP2tPtcH8fKexEgt4mH",
    "amount": 2531231532,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmCimUz8zLKbsZDLSzmrm13G3Eb6c7KKEw1ywHS9Xah4JCqpruei",
    "amount": 2531231532,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qomqB27xwfVxd2KUkDLEmM6DJZcRPPy6ubBkCvjk64EZNgVPBrtK",
    "amount": 2531231532,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpPBagTeXM9mveDEb9szqFHiBj1NqRNFmTAcVXLZFcK1qwTmUpix",
    "amount": 2531180400,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqg89aW2Ky4npHUR5YT1RSL4BkmAwibQPurHWRNACBBe5tuPpFAt",
    "amount": 2521388071,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpKmGZLAymDDTqPvGsSK7ErWxUg2anLoPnm6QX4H1ubiAuwhxmcZ",
    "amount": 2436922797,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qk96mW2hsrALqWoQqnCWyTpkbsKmNpRBqp6YnwoEiaQVvmmfn2ds",
    "amount": 2302823471,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpXYJFaNaYdP21Qov9UHYBpStE1Rx48gFEn3sAn6hScvvoYnzMgY",
    "amount": 2145013512,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrF9avbuS1jfdbXvqy6YuhJr7DdjogCWtHcGYEfMi3XGy1QdSVGq",
    "amount": 2064931128,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjpTbdmeBDuCLofnYUGv3cMZFxKbqu266nLYT45FYzZFLD3iHjsT",
    "amount": 1956098570,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpjTyiNz1QvNRdAX9WUA7bx8zALSxUsC6AkZz4D54xVbqr915ztB",
    "amount": 1632934133,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnj1Mtc2qYDXFTAooVaGdt82W9HWu1XnrmtzwM43sLnjJYAdwxwe",
    "amount": 1414588215,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnmehRBzPWnSFFisurehmi8VTPhipWwu53EShdk9qv2yonXPhQsF",
    "amount": 1128207489,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qp6opXDeizxByVqaj5SKrWHPTmUxvXRCgi35zkGpRwk7T5UEsraC",
    "amount": 1118399000,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qipxYHcDhUnWxQkzWZCQjQueigHkCUCVwU4n3wr3o4cdxxZ91aPX",
    "amount": 1028388221,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qn8tS8E5t6Qs8CLwPkUNCsUqCbX2STza3HXRDoJdXKxx3dyM4aZt",
    "amount": 1023507201,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrcCp195eiS7TPTN3hgn88EwtMCEbJ9FgdVVJtsiuPyQ9NnVpBZ4",
    "amount": 924618992,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjRkHdv9eGPAvTJjB1y7qgyLFrBnipZpyoKPzd6bP5La3sJZajRa",
    "amount": 916953789,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qomNdG8BHSxCcgQSF2uv3nrP4S7yrETBNmASQnqL8qroPrSdcRVW",
    "amount": 864959264,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qr38fgeRPnWdXSSrKGwBB9SHTbQ6DYwk7oKMHExWW5fgoK8fHv2B",
    "amount": 844884651,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qq1YJNr1jdxTMCAuQdb4cgu5U91CRLY3AHgnUXtUn6LKx8BcuttT",
    "amount": 772508480,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qowDLdtUzG4VYsTb6JAQsJDx9XxvxfDzatb2ZKCr9DCp3HZKFtKK",
    "amount": 682606800,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qiYS7LJSunkSjiZenPifsqeaBcZ8DivvYAYMiic2iNPfxSHEQHyn",
    "amount": 555644970,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpDbie83q9m26ejcHhEmtSdbHGuUd9CxSCHGbABhnouvvmJgeCbg",
    "amount": 553516331,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qm38y2SHPx6Qv2nwpRyegPM4TDiuFBjGDfhHqJgZCd1j5m1amoyK",
    "amount": 532653376,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpUEp5aSkK9MwBJDt7hMTFpS5QN5eYjSm162oGH6M5WuspSnPH7X",
    "amount": 522100000,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qijSsDtum3W8Em9v6qBG1p4ms6f518KDJGzvg4ChDvLLNxuknstC",
    "amount": 502690475,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrjMZ8HAtzS69hK8UxcHYqNpkzrT8CDR93enhQid8TAP26hksmUN",
    "amount": 462369364,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqLZqEEQEAu7wjVLurUmEfsKuyhkywBdajEKK8wKcpBWtn9q9gqb",
    "amount": 318808871,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjf5Bp2SXq3ZhCa8zf68FeXFMpyDibU85MrxxZ97NUdNcqiVQpFA",
    "amount": 271146056,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjL8reca5GBHSLL56mjRhidNcZbvZ3dDjkcn8udDamV3gBduqdGM",
    "amount": 208358072,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qibE3XXWvJJ2witvF9UHSW5N3YxbnRb4LLwreMPViKEbnaYRjCiN",
    "amount": 181591238,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqR8ZM8UmL7dZEwD9dR5NnTYu4UrNk663okVgu9KfdhQ9QpjUHf4",
    "amount": 154736765,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrj8zTWCZAxK2EvVqscM2c1JDQuDm4GWa3uJpveb2oxCyWcRHGsF",
    "amount": 110720469,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qr1iTaiBnMABRYHxNLtXnYzcW3Kr4mojiBg177XC4t33iD7ZXRsp",
    "amount": 97436809,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjVEYEepC5KM4igHuuw7E5d5sCW7MFGPqRir94CVUCMeiXXHF8aE",
    "amount": 93891214,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qj1VUVZgzoEvCd9GNvbQgkkmeedyHCtf68PKJBCcPZBxEYdDnKUV",
    "amount": 88014356,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qp3ES848GVohMjxLdv768RysY16VNUWBdkdX7H8UKrTx3ZoSMx4V",
    "amount": 83481188,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrTGqJfwPXLgR9FEosc3CkHCNGVTaQYe2v58hXFTiQeX7AyCsg8z",
    "amount": 83227761,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmmFAkd55Vzz4f9F6v5zziAiEnBZArQrmumd3giacLNxhJ4ydHuZ",
    "amount": 65812929,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqWVPmZq7kTPPXir2EQ8GUFF8PDm2mGE5gS9q2NMtEtGknWmoqAa",
    "amount": 59488957,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqeKZX2etkrguVWr9NQiLVQJBJ48En6SvDVGFyKPghW3QZAVyVNj",
    "amount": 54115178,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkTDX59fTdZvGVH42yhfUfGaKTJ71FRqkD71p1UGd32tygHGoSiJ",
    "amount": 51700502,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qk7mwRHHqXo9uwHXXb3Lti8rtowwGUcpGQNmqbFb1VggjtCQEKoC",
    "amount": 48021977,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjxPaAL3NNdFbmxNFDME3xUnwquCsj44AZX6ToevYFsHuRH5Z2nJ",
    "amount": 45914759,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqr9ekFvzri2LLmHVeH1iquz9EXnkSb3jmrKwZtq4WNLmNn5MeNN",
    "amount": 43976663,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrHrm23nhXzNdvuimpYzhUVXddzhkVLA1kSkfLhdhyRraYrG25ng",
    "amount": 42385814,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmp5jc2AHy43qN1To1di3DWmuB4PEk53cFB9A6Rf6MDtLP1jH5Rw",
    "amount": 37170855,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpbireFMvbNfiwiFEoz44TLB9EYuMHJ71PV89WtjH6iY9ef8pwMn",
    "amount": 36547224,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkGXYkt4DHG3imcFic5zXRdWfcyQTGFEhbMypVLxmrqP7nsyCTte",
    "amount": 35269967,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnGBCFuSSw1hPFFhMptFyLcAXg2GpWFNbBYQom7ZDdv6NrrTByzQ",
    "amount": 34327877,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qj4BduTVPQpUWQ6Ge2KiiQoaiujMpSr2pRHx7ZP7YF1V5GBptGzi",
    "amount": 30585890,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "amount": 26370222,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqjtzsC8Uv5dUhe6mxwecUjJi6UTB82a78onVbEhjbRL4gdVnA7w",
    "amount": 24342038,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmYFyXMuYE78pPiozBSmEYNfTnurGzSfPjZhjjpumNxM3RyndK1W",
    "amount": 23971928,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrM4SEK2uM99CkfJCBZcN1xtV4DzWjq9sWpimTEjJD2ZUH9CcDT9",
    "amount": 23822841,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjQYSDE1gSgFTemZDkSdRPPg8aCoP36VAnS6MrMsq16h29Xfcii5",
    "amount": 19343776,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qofuuZxZpg8fbdE5uV4pwF4RBKHuQsHfvFEp2MVsYu7BxRx39tEY",
    "amount": 18494748,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpZLKfn3EXhD3HU2QSRUXhJ2fNoDmH83pAk6Th2pxJPyRovV1BkL",
    "amount": 14285616,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qq6UKWhzxrEuyFm46QoxP8fNXrHRJz6N7S2Zhnuww9mDnYzNhfcN",
    "amount": 14285616,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnaFP3qPgBfyY51ea1c4iSBQD2D3vZ7Ff3F8zb5jgSRxDuMD3h38",
    "amount": 14238918,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpr7RYckfwA7dxryu6K7StHarRkXQzVDQ1Hq3vPcwL25bNxb526f",
    "amount": 12617458,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmog4xQjk5a1FKyqNXLbQKwnsTN797EfT7wXT53uCcBpNuyLQpda",
    "amount": 11592756,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoaxDvGEGYaWAMWG9Qk5uuKykVC3NgbUhudTRRNoTExiVJWH2CdD",
    "amount": 11236591,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qk5BJ7DWW62eTzPamzA1iQNbxwVevjgSqBRrpoSi89pAXuJEhvG1",
    "amount": 9976204,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qihv96NnW2PTuaqyCaiFdqm6fnbQfAYfyb21XnBQeeLvHBAk7fqi",
    "amount": 9199952,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrMSeLWGB5SkCMiohZLQrd8jPEoxsktLWzeLNtnw7GMh1zykUAQi",
    "amount": 9199952,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmJrcWKJF4djtGz5zMJPH4bR16PnK18BHTsJgN9YWtQugE2EgLra",
    "amount": 8516954,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjSu6iy4aVAJ1NDXECvbJW3UziKUoS8QYMzcNgPW3APuAFoioYpJ",
    "amount": 8396576,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqCY1g6hvhjGQwAR2DAVwBjojvxAgAeRwUkhLMnoH93557bzZnGu",
    "amount": 7259773,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnyDgWWFHTVKFRJoLCWWgKe4mfRJzBFXMMJ163RjjVxxcgPnqAWT",
    "amount": 6744273,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoDpMaxGj7W64rEy2Qnn8nWuVeuUzwahBEwg2aw6rZofn6kVUbWG",
    "amount": 5152612,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpQN96tZ9kQNmUVLt6QmtHe5VTJcM9dsN14rkbnGLEcdawpPYvdY",
    "amount": 5059365,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmJAmEyc92HwT65SHMmdsV5c9pbZ1jFn1jdCLY5Q2XDYbhZaSddG",
    "amount": 4120372,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkSumb4MunaxubL64a5FvXhGjkUDniXfpLJqhAHxL3zbmicy9Z6K",
    "amount": 3744595,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjoSQPK9nQze84TAeoCsNn7z3dWi6Crxzq1FE6eC7pHQAsbM9VwW",
    "amount": 3685204,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnVeh96Nx4nLikmjr58p44FR2Q4jrdqX58ARcFCBS7gqEk3baBti",
    "amount": 2793694,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qonXAYHauG3g5LUWF8UkLaoha2gSh292Dixaw6PdLxFTzXzzyGkz",
    "amount": 2395321,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnMmkrG4EPbfqZtPtpii174hC46MrbXyfE3W9RjLcW1Vm7GMRZwu",
    "amount": 2248302,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqhjgsKWN466fxzjyrp1uH2zqFT5gMnuBLdHY9CMxRaiER6M97JS",
    "amount": 1206394,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqwNbAoivZGASXLExDhbWARBBT6tPKVQxUPPrxYrmaaM3o3AapMn",
    "amount": 630722,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpV7BQVkVwTcx5sm7qUXSdwpy3AyjPhhZ16RUEE4xjfWgP8NYjoZ",
    "amount": 548175,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkyi3CLthcpGDfg4V3UAcijDPFQw5uDeEBaAKdJ5UQk5SNpk2QZ6",
    "amount": 528426,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjYgdYhgUY1dLcuy28hCPpRDMdth4RFGo5VoYjnsCPZ6TJZTRRUf",
    "amount": 492353,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpLwJk82BM3pH3wAEmAeLuaScfwwEpZeABWJghX7MmZrGufY67Qf",
    "amount": 471262,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqhbSGUW56jjikxUYJsW8674b11PZRTrerLycJVxMkSjSakfG4Dy",
    "amount": 436792,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqqmMh6bk7u8JTDWQfkpgmL43WWSDL3soV9aYkgua2eRU6YNM9wf",
    "amount": 422501,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkXuDEWRBJSNh9QoPcUgpP9SHcYDtDcvvRVJYPnnYiMmWaV9xSr5",
    "amount": 390231,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrodVyskqz5Ld3aA5MjB2RXkYUwzjuoveGaNQZJ4HSKdb8SfncZM",
    "amount": 356159,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmC1mbpozWA5LXRsQnmN3bBbu6WCUmtcHYZz5gKU8hH9gpHy2j84",
    "amount": 342469,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnrCSpPc8dLsoDrvXqYysYr8dEyLhnVqUQ2VkAb5qEosDwBAzKc8",
    "amount": 341272,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qiuuSboSrp8ZW8ifbcDVZNubHp3SMKiVP8z2KQrrWXPNTUG941jx",
    "amount": 341269,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qokcyDx91t9MHwFTHTzQ77Rv6SAQ8xHqdsV5thnGaqkaVjYb8Kch",
    "amount": 341167,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qp4vteujR2Q9Bhh2kTWTKd6ZKuqSgbUDT4vpy94eVgPyeW1kXDJg",
    "amount": 341048,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrJ3nsqccoyM1jbrM9iCVJ4J61yuzLC4WVxksTMaZLUYy5VFSShC",
    "amount": 280662,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnJVQcj4gvfY1GBFryQZ4RJgfwqmVwCXB6umnH5cJQPFMLvotRL3",
    "amount": 277321,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrc2Y9L8fvpMrMcWuZ4qCuFpTDa3RLvUYg91wtQaeU4f2xyYu2wu",
    "amount": 268293,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrpBLx4SgQBsbQVFPY9aKxVyyAboKvgmxA1Tv8eYwFokZY5Ksduy",
    "amount": 267713,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmLLtt6rAfbsgbkFiVYeFH8npSABBErj3DGqpxBcF9H2kDMvc55k",
    "amount": 267204,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qr3kQibM6m88MPFdrUCLppCphTx29rLLAgMGvVdbX5yF6UGnBRQT",
    "amount": 267152,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjk8gV2exRwRdHsTwQcpbHmt2cd1ZrXypSEUjiMu3qcg4DmshGhy",
    "amount": 266857,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnvJVpgGbxuviuEhV4jdDVhSFTEB6tBMbD1BeKGSLvw69g9DidjK",
    "amount": 242209,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qouNgTR3wA4Q3k4swY4ExuJ3jbEc87Qe7Wy88Ew6g2yP9s2aTjFv",
    "amount": 239944,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qiYHw2wqcYmCsoxRfFwYmAMTj8cwTBULJoewZ7bqhTCcEcRobHVW",
    "amount": 191576,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qn29kPY7Lom1uZFqVN68dwJsLj9xmrckaMAVf2cYh27JdRd6VHH6",
    "amount": 128611,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmLHpWmgZbam2DCdiShNC9jRuifCqHT9byo2kP7HkY3zkiTdVxps",
    "amount": 123665,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qr5X4FDmPYyPjnjCNs8R6LfZqzYeYDrUf9a3gjzxqppkujdzPqfz",
    "amount": 102906,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjdzSu2UxcXSyZte7QS5S33PcZfNdv8LqKBzLa1xP12V1tEhx5aN",
    "amount": 86701,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmgnRxeMJcEGfF9Hbr1FzLPuzPqhzXvacK3rJ4LVnNdURp2jxvzG",
    "amount": 46773,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
];

export const epoch34PostSuperchargeShareFeesFixture = {
  ...epoch34Base,
  payoutCalculator: 'postSuperChargeShareFees',
  expectedTransactions,
  expectedTotalPayout: 8104330704375,
};

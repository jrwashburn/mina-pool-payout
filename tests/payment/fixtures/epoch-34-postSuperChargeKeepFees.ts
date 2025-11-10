import { epoch34PostSuperchargeFixture } from './epoch-34-postSuperChargeCommon';

type FixtureTransaction = { publicKey: string; amount: number; fee: number; memo: string };

const {
  expectedTransactions: _commonTransactions,
  expectedTotalPayout: _commonTotal,
  payoutCalculator: _commonCalculator,
  ...epoch34Base
} = epoch34PostSuperchargeFixture;

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
    "amount": 1073888758872,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmNbNedwwDB3bLUzgeN6gAYXmnY4U9WBS6Ze92HghtU7x3v7a2sS",
    "amount": 594207299652,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoigHEtJCoZ5ekbGHWyr9hYfc6fkZ2A41h9vvVZuvty9amzEz3yB",
    "amount": 108470440056,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmMGz5dWhmrx7JgKtnmb4mqu87tqXsMr6wcRmnGzHrd3Y43iwhG9",
    "amount": 43450362288,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkbLxftUetPeHUR4K16d8JEsmXbZTPu6LCD4bD1tdx7y8x8Y9nA2",
    "amount": 27261752616,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnHjLNaDwc4WWy3BLJMmeS6YATWoTYd6MYJemF3uXRNaEoPAc9GV",
    "amount": 24877661208,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoGEXsSDG69BoYUQUuiG8NJ25m1hM9VceF1F36ntC6qxqNBdzwCT",
    "amount": 19613735436,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qk449L7LDANBXVHdEcbvTnQqtxqweHptUwKqy1tHVxvGJrKapDwN",
    "amount": 12805235268,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmrrg2rPHXcFUNZoWSAtBS1kPYTcrvutdteffBayTZGsnpeK4hSJ",
    "amount": 10316469624,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpUH5qcvknkBNa8N1RVwn2sZCUxiffmvShXZ1hBgKmaJRYmKDFtz",
    "amount": 9360068088,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qn5JSSckhhCXnMiDtDNKDa95zdhoTv7biatmiB6HS9YuwoH63xNc",
    "amount": 7451926848,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkUYxBqfxc4KBWw9pCX6MShVNYXBLb8M2s4enWBDDMbuWK8P9kjZ",
    "amount": 6616167384,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qowtmtUeYUnvjWSDysfJQjk8kNva58xkZHwiAykjLyWcZxgF6mbr",
    "amount": 6465183216,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmpKqzKsgu1q2bG5USonaptVm7q5tJohJUkFverKF8GRJdHdHnZ6",
    "amount": 5280470820,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmwNXELHLkPPWnHRkVxEShPeuwWXXWfxYwfFP1ybA4rgsjexqYBf",
    "amount": 5036955252,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpcsKkUsZLxqp5hv4XV1NapG9KowUDDcT18GXo3XcS5sGzdFqxxB",
    "amount": 4834261848,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkg8neN5o1xVq2LG6VHygGsqf5UsitTFcgvWgRubwduTdUfK7JCd",
    "amount": 4147530528,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpQ4Mi9SwFx5mGo5iPZFS7DMcEc3zkv7Gxdo6W6GLPv828nHdVmo",
    "amount": 4040125956,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrUGAj9uft5f2g6LPxGB8vRycbZNYjDmNTmS13GqScLTupnw1WkM",
    "amount": 4016865156,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkmBdeg8z5ukKH3hCtXKiMRdhBoHJWeUCURFuPg8xvzGY4uTkjVn",
    "amount": 3509584356,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnnKrqqGdabhVHiVmsfqAzK7KbhMQvuXsREJVkFeKWfyHxhmw7We",
    "amount": 3465647580,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qiaGTKNY3Yk7ASDqvJz56hhpX59tRKJ7K9NUtLDySrjrPguKHFyZ",
    "amount": 3460108728,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjqAQfj5pgYgfUEqTVM4mdj8m61rVRAaLBqhAJUjsSBgpmFiq9P5",
    "amount": 3069343836,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qojHAgRv7rkbAH5vN5jYU4y4CcPH8cgzevFKKKgXLFgJDNJgzQuG",
    "amount": 2807377788,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjADS8mz88VSsUcJZ5M5LumY2ftmzD4Uovd6CforS3sctKzHCf14",
    "amount": 2730847368,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjKbNLZQ2ZQHHUooxNURFKShtGmgkibgLLGVzb47sng7wfHr85CG",
    "amount": 2662227072,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qna7SRdnVJgyWqcxBrVpRHcXeYcbTTsvpnuydTjdGYvL5hsB1ofj",
    "amount": 2567687496,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkA7WVaJEk2TyTTkdXCPbaAT6EiHPHB9SyP2tPtcH8fKexEgt4mH",
    "amount": 2529803028,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmCimUz8zLKbsZDLSzmrm13G3Eb6c7KKEw1ywHS9Xah4JCqpruei",
    "amount": 2529803028,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qomqB27xwfVxd2KUkDLEmM6DJZcRPPy6ubBkCvjk64EZNgVPBrtK",
    "amount": 2529803028,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpPBagTeXM9mveDEb9szqFHiBj1NqRNFmTAcVXLZFcK1qwTmUpix",
    "amount": 2529751920,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqg89aW2Ky4npHUR5YT1RSL4BkmAwibQPurHWRNACBBe5tuPpFAt",
    "amount": 2519965116,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpKmGZLAymDDTqPvGsSK7ErWxUg2anLoPnm6QX4H1ubiAuwhxmcZ",
    "amount": 2435547516,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qk96mW2hsrALqWoQqnCWyTpkbsKmNpRBqp6YnwoEiaQVvmmfn2ds",
    "amount": 2301523872,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpXYJFaNaYdP21Qov9UHYBpStE1Rx48gFEn3sAn6hScvvoYnzMgY",
    "amount": 2143802964,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrF9avbuS1jfdbXvqy6YuhJr7DdjogCWtHcGYEfMi3XGy1QdSVGq",
    "amount": 2063765784,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjpTbdmeBDuCLofnYUGv3cMZFxKbqu266nLYT45FYzZFLD3iHjsT",
    "amount": 1954994640,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpjTyiNz1QvNRdAX9WUA7bx8zALSxUsC6AkZz4D54xVbqr915ztB",
    "amount": 1632012588,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnj1Mtc2qYDXFTAooVaGdt82W9HWu1XnrmtzwM43sLnjJYAdwxwe",
    "amount": 1413789888,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnmehRBzPWnSFFisurehmi8VTPhipWwu53EShdk9qv2yonXPhQsF",
    "amount": 1127570784,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qp6opXDeizxByVqaj5SKrWHPTmUxvXRCgi35zkGpRwk7T5UEsraC",
    "amount": 1117767828,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qipxYHcDhUnWxQkzWZCQjQueigHkCUCVwU4n3wr3o4cdxxZ91aPX",
    "amount": 1027807848,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qn8tS8E5t6Qs8CLwPkUNCsUqCbX2STza3HXRDoJdXKxx3dyM4aZt",
    "amount": 1022929584,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrcCp195eiS7TPTN3hgn88EwtMCEbJ9FgdVVJtsiuPyQ9NnVpBZ4",
    "amount": 924097176,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjRkHdv9eGPAvTJjB1y7qgyLFrBnipZpyoKPzd6bP5La3sJZajRa",
    "amount": 916436304,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qomNdG8BHSxCcgQSF2uv3nrP4S7yrETBNmASQnqL8qroPrSdcRVW",
    "amount": 864471120,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qr38fgeRPnWdXSSrKGwBB9SHTbQ6DYwk7oKMHExWW5fgoK8fHv2B",
    "amount": 844407840,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qq1YJNr1jdxTMCAuQdb4cgu5U91CRLY3AHgnUXtUn6LKx8BcuttT",
    "amount": 772072512,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qowDLdtUzG4VYsTb6JAQsJDx9XxvxfDzatb2ZKCr9DCp3HZKFtKK",
    "amount": 682221576,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qiYS7LJSunkSjiZenPifsqeaBcZ8DivvYAYMiic2iNPfxSHEQHyn",
    "amount": 555331392,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpDbie83q9m26ejcHhEmtSdbHGuUd9CxSCHGbABhnouvvmJgeCbg",
    "amount": 553203948,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qm38y2SHPx6Qv2nwpRyegPM4TDiuFBjGDfhHqJgZCd1j5m1amoyK",
    "amount": 532352772,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpUEp5aSkK9MwBJDt7hMTFpS5QN5eYjSm162oGH6M5WuspSnPH7X",
    "amount": 521805348,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qijSsDtum3W8Em9v6qBG1p4ms6f518KDJGzvg4ChDvLLNxuknstC",
    "amount": 502406784,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrjMZ8HAtzS69hK8UxcHYqNpkzrT8CDR93enhQid8TAP26hksmUN",
    "amount": 462108420,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqLZqEEQEAu7wjVLurUmEfsKuyhkywBdajEKK8wKcpBWtn9q9gqb",
    "amount": 318628956,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjf5Bp2SXq3ZhCa8zf68FeXFMpyDibU85MrxxZ97NUdNcqiVQpFA",
    "amount": 270993036,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjL8reca5GBHSLL56mjRhidNcZbvZ3dDjkcn8udDamV3gBduqdGM",
    "amount": 208240488,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qibE3XXWvJJ2witvF9UHSW5N3YxbnRb4LLwreMPViKEbnaYRjCiN",
    "amount": 181488756,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqR8ZM8UmL7dZEwD9dR5NnTYu4UrNk663okVgu9KfdhQ9QpjUHf4",
    "amount": 154649436,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrj8zTWCZAxK2EvVqscM2c1JDQuDm4GWa3uJpveb2oxCyWcRHGsF",
    "amount": 110657988,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qr1iTaiBnMABRYHxNLtXnYzcW3Kr4mojiBg177XC4t33iD7ZXRsp",
    "amount": 97381824,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjVEYEepC5KM4igHuuw7E5d5sCW7MFGPqRir94CVUCMeiXXHF8aE",
    "amount": 93838224,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qj1VUVZgzoEvCd9GNvbQgkkmeedyHCtf68PKJBCcPZBxEYdDnKUV",
    "amount": 87964680,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qp3ES848GVohMjxLdv768RysY16VNUWBdkdX7H8UKrTx3ZoSMx4V",
    "amount": 83434080,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrTGqJfwPXLgR9FEosc3CkHCNGVTaQYe2v58hXFTiQeX7AyCsg8z",
    "amount": 83180796,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmmFAkd55Vzz4f9F6v5zziAiEnBZArQrmumd3giacLNxhJ4ydHuZ",
    "amount": 65775792,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqWVPmZq7kTPPXir2EQ8GUFF8PDm2mGE5gS9q2NMtEtGknWmoqAa",
    "amount": 59455380,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqeKZX2etkrguVWr9NQiLVQJBJ48En6SvDVGFyKPghW3QZAVyVNj",
    "amount": 54084636,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkTDX59fTdZvGVH42yhfUfGaKTJ71FRqkD71p1UGd32tygHGoSiJ",
    "amount": 51671328,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qk7mwRHHqXo9uwHXXb3Lti8rtowwGUcpGQNmqbFb1VggjtCQEKoC",
    "amount": 47994876,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjxPaAL3NNdFbmxNFDME3xUnwquCsj44AZX6ToevYFsHuRH5Z2nJ",
    "amount": 45888852,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqr9ekFvzri2LLmHVeH1iquz9EXnkSb3jmrKwZtq4WNLmNn5MeNN",
    "amount": 43951848,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrHrm23nhXzNdvuimpYzhUVXddzhkVLA1kSkfLhdhyRraYrG25ng",
    "amount": 42361896,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmp5jc2AHy43qN1To1di3DWmuB4PEk53cFB9A6Rf6MDtLP1jH5Rw",
    "amount": 37149876,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpbireFMvbNfiwiFEoz44TLB9EYuMHJ71PV89WtjH6iY9ef8pwMn",
    "amount": 36526596,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkGXYkt4DHG3imcFic5zXRdWfcyQTGFEhbMypVLxmrqP7nsyCTte",
    "amount": 35250060,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnGBCFuSSw1hPFFhMptFyLcAXg2GpWFNbBYQom7ZDdv6NrrTByzQ",
    "amount": 34308504,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qj4BduTVPQpUWQ6Ge2KiiQoaiujMpSr2pRHx7ZP7YF1V5GBptGzi",
    "amount": 30568632,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkBqSkXgkirtU3n8HJ9YgwHh3vUD6kGJ5ZRkQYGNPeL5xYL2tL1L",
    "amount": 26355336,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqjtzsC8Uv5dUhe6mxwecUjJi6UTB82a78onVbEhjbRL4gdVnA7w",
    "amount": 24328296,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmYFyXMuYE78pPiozBSmEYNfTnurGzSfPjZhjjpumNxM3RyndK1W",
    "amount": 23958396,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrM4SEK2uM99CkfJCBZcN1xtV4DzWjq9sWpimTEjJD2ZUH9CcDT9",
    "amount": 23809392,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjQYSDE1gSgFTemZDkSdRPPg8aCoP36VAnS6MrMsq16h29Xfcii5",
    "amount": 19332864,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qofuuZxZpg8fbdE5uV4pwF4RBKHuQsHfvFEp2MVsYu7BxRx39tEY",
    "amount": 18484308,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpZLKfn3EXhD3HU2QSRUXhJ2fNoDmH83pAk6Th2pxJPyRovV1BkL",
    "amount": 14277552,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qq6UKWhzxrEuyFm46QoxP8fNXrHRJz6N7S2Zhnuww9mDnYzNhfcN",
    "amount": 14277552,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnaFP3qPgBfyY51ea1c4iSBQD2D3vZ7Ff3F8zb5jgSRxDuMD3h38",
    "amount": 14230884,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpr7RYckfwA7dxryu6K7StHarRkXQzVDQ1Hq3vPcwL25bNxb526f",
    "amount": 12610332,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmog4xQjk5a1FKyqNXLbQKwnsTN797EfT7wXT53uCcBpNuyLQpda",
    "amount": 11586216,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoaxDvGEGYaWAMWG9Qk5uuKykVC3NgbUhudTRRNoTExiVJWH2CdD",
    "amount": 11230248,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qk5BJ7DWW62eTzPamzA1iQNbxwVevjgSqBRrpoSi89pAXuJEhvG1",
    "amount": 9970572,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qihv96NnW2PTuaqyCaiFdqm6fnbQfAYfyb21XnBQeeLvHBAk7fqi",
    "amount": 9194760,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrMSeLWGB5SkCMiohZLQrd8jPEoxsktLWzeLNtnw7GMh1zykUAQi",
    "amount": 9194760,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmJrcWKJF4djtGz5zMJPH4bR16PnK18BHTsJgN9YWtQugE2EgLra",
    "amount": 8512152,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjSu6iy4aVAJ1NDXECvbJW3UziKUoS8QYMzcNgPW3APuAFoioYpJ",
    "amount": 8391840,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqCY1g6hvhjGQwAR2DAVwBjojvxAgAeRwUkhLMnoH93557bzZnGu",
    "amount": 7255680,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnyDgWWFHTVKFRJoLCWWgKe4mfRJzBFXMMJ163RjjVxxcgPnqAWT",
    "amount": 6740472,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qoDpMaxGj7W64rEy2Qnn8nWuVeuUzwahBEwg2aw6rZofn6kVUbWG",
    "amount": 5149704,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpQN96tZ9kQNmUVLt6QmtHe5VTJcM9dsN14rkbnGLEcdawpPYvdY",
    "amount": 5056512,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmJAmEyc92HwT65SHMmdsV5c9pbZ1jFn1jdCLY5Q2XDYbhZaSddG",
    "amount": 4118040,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkSumb4MunaxubL64a5FvXhGjkUDniXfpLJqhAHxL3zbmicy9Z6K",
    "amount": 3742476,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjoSQPK9nQze84TAeoCsNn7z3dWi6Crxzq1FE6eC7pHQAsbM9VwW",
    "amount": 3683124,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnVeh96Nx4nLikmjr58p44FR2Q4jrdqX58ARcFCBS7gqEk3baBti",
    "amount": 2792112,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qonXAYHauG3g5LUWF8UkLaoha2gSh292Dixaw6PdLxFTzXzzyGkz",
    "amount": 2393964,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnMmkrG4EPbfqZtPtpii174hC46MrbXyfE3W9RjLcW1Vm7GMRZwu",
    "amount": 2247036,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqhjgsKWN466fxzjyrp1uH2zqFT5gMnuBLdHY9CMxRaiER6M97JS",
    "amount": 1205712,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqwNbAoivZGASXLExDhbWARBBT6tPKVQxUPPrxYrmaaM3o3AapMn",
    "amount": 630372,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpV7BQVkVwTcx5sm7qUXSdwpy3AyjPhhZ16RUEE4xjfWgP8NYjoZ",
    "amount": 547860,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkyi3CLthcpGDfg4V3UAcijDPFQw5uDeEBaAKdJ5UQk5SNpk2QZ6",
    "amount": 528120,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjYgdYhgUY1dLcuy28hCPpRDMdth4RFGo5VoYjnsCPZ6TJZTRRUf",
    "amount": 492072,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qpLwJk82BM3pH3wAEmAeLuaScfwwEpZeABWJghX7MmZrGufY67Qf",
    "amount": 471000,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqhbSGUW56jjikxUYJsW8674b11PZRTrerLycJVxMkSjSakfG4Dy",
    "amount": 436548,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qqqmMh6bk7u8JTDWQfkpgmL43WWSDL3soV9aYkgua2eRU6YNM9wf",
    "amount": 422268,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qkXuDEWRBJSNh9QoPcUgpP9SHcYDtDcvvRVJYPnnYiMmWaV9xSr5",
    "amount": 390012,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrodVyskqz5Ld3aA5MjB2RXkYUwzjuoveGaNQZJ4HSKdb8SfncZM",
    "amount": 355956,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmC1mbpozWA5LXRsQnmN3bBbu6WCUmtcHYZz5gKU8hH9gpHy2j84",
    "amount": 342276,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qiuuSboSrp8ZW8ifbcDVZNubHp3SMKiVP8z2KQrrWXPNTUG941jx",
    "amount": 341076,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnrCSpPc8dLsoDrvXqYysYr8dEyLhnVqUQ2VkAb5qEosDwBAzKc8",
    "amount": 341076,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qokcyDx91t9MHwFTHTzQ77Rv6SAQ8xHqdsV5thnGaqkaVjYb8Kch",
    "amount": 340980,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qp4vteujR2Q9Bhh2kTWTKd6ZKuqSgbUDT4vpy94eVgPyeW1kXDJg",
    "amount": 340860,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrJ3nsqccoyM1jbrM9iCVJ4J61yuzLC4WVxksTMaZLUYy5VFSShC",
    "amount": 280500,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnJVQcj4gvfY1GBFryQZ4RJgfwqmVwCXB6umnH5cJQPFMLvotRL3",
    "amount": 277164,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrc2Y9L8fvpMrMcWuZ4qCuFpTDa3RLvUYg91wtQaeU4f2xyYu2wu",
    "amount": 268140,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qrpBLx4SgQBsbQVFPY9aKxVyyAboKvgmxA1Tv8eYwFokZY5Ksduy",
    "amount": 267564,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmLLtt6rAfbsgbkFiVYeFH8npSABBErj3DGqpxBcF9H2kDMvc55k",
    "amount": 267048,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qr3kQibM6m88MPFdrUCLppCphTx29rLLAgMGvVdbX5yF6UGnBRQT",
    "amount": 267000,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjk8gV2exRwRdHsTwQcpbHmt2cd1ZrXypSEUjiMu3qcg4DmshGhy",
    "amount": 266712,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qnvJVpgGbxuviuEhV4jdDVhSFTEB6tBMbD1BeKGSLvw69g9DidjK",
    "amount": 242076,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qouNgTR3wA4Q3k4swY4ExuJ3jbEc87Qe7Wy88Ew6g2yP9s2aTjFv",
    "amount": 239808,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qiYHw2wqcYmCsoxRfFwYmAMTj8cwTBULJoewZ7bqhTCcEcRobHVW",
    "amount": 191472,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qn29kPY7Lom1uZFqVN68dwJsLj9xmrckaMAVf2cYh27JdRd6VHH6",
    "amount": 128532,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmLHpWmgZbam2DCdiShNC9jRuifCqHT9byo2kP7HkY3zkiTdVxps",
    "amount": 123600,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qr5X4FDmPYyPjnjCNs8R6LfZqzYeYDrUf9a3gjzxqppkujdzPqfz",
    "amount": 102852,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qjdzSu2UxcXSyZte7QS5S33PcZfNdv8LqKBzLa1xP12V1tEhx5aN",
    "amount": 86652,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
  {
    "publicKey": "B62qmgnRxeMJcEGfF9Hbr1FzLPuzPqhzXvacK3rJ4LVnNdURp2jxvzG",
    "amount": 46752,
    "fee": 0,
    "memo": "jrwashburn#0765"
  },
];

export const epoch34PostSuperchargeKeepFeesFixture = {
  ...epoch34Base,
  payoutCalculator: 'postSuperChargeKeepFees',
  expectedTransactions,
  expectedTotalPayout: 8099757012288,
};

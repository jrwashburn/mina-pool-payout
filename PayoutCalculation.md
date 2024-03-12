# Payout Calculation

The default payout calculator is src/core/payoutCalculator/PayoutCalculatorIsolateSuperCharge.ts

This calculator assigns rewards by processing all the blocks won for a given block producer in a block height range, and processes the data per staking ledger, per block, per delegate.

All pool percentages are applied on a per-block, per-delegate basis, so results may vary slightly from an aggregated approach.

## Method of Reward Allocation

1. Determine Total Rewards: **Total Coinbase + Fee Transfer To Receiver<sup>1</sup> - Fee Transfer From Coinbase<sup>1</sup>**  
   _This may alternatively be expressed as coinbase + transaction fees - snark fees._

2. Burn (some) Superchared: If the block was won by a account managed by Mina Foundation (owned by MF or "Investors") and is a supercharged block, the Total Rewards are reduced by 720 Mina and 720 Mina is burned.

3. The remaining reward is split into three pools:

-   Non-Participating Pool: All delegates share their relative portion of the total stake for the first 720 Mina for the coinbase.<sup>2</sup>
-   Supercharged Pool: Delegates (excluding MF,O1, and Investors) that have _unlocked accounts_ share proportionally in the supercharged block portion (720 Mina), if any.
-   Common Pool: Remainder (Total Reward - Burn - NPS Pool - Supercharged Pool.) All Delegates _except Non Participating Shares_ (Mina Foundation, O1, Investors) split the remainder based on their relative share of the total common pool size.

## Example

Given a pool with delegations from:

-   Account A, Mina Foundation delegation from a locked account
-   Account B, Mina Foundation delegation from an unlocked account
-   Account C, O1 Labs delegation from a locked account
-   Account D, 01 Labs delegatino from an unlocked account
-   Account E, other delegate from a locked acocunt
-   Account F,G,H,I other delegates from an unlocked accounts

And an epoch where the pool won:

-   Block X won by Account B: M1440 coinbase, M10 transaction fees, M5 snark fees
-   Block Y won by Account D: M1440 coinbase, M8 transaction fees, M4 snark fees
-   Block Z won by Account E: M720 coinbase, M6 transaction fees, M3 snark fees

Total Rewards

-   Block X: 1440 - 720 burned + 10 fee -5 snark fee = 725 distributable, 720 burn
-   Block Y: 1440 + 8 fee - 4 snark fee = 1444 distributable
-   Block Z: 720 + 6 fee - 3 snark fee = 723 distributable

Distribution:

-   NPS Pool: 2160 (720\*3 blocks) split proportionally across Accounts A,B,C,D,E,F,G,H,I
-   Common Pool: 12 (fee balance) split proportionally across Accounts E,F,G,H,I
-   Supercharged Pool: 720 (remainder) split across accounts F,G,H,I
-   Burn Transaction: 720 mina will be burned

## NOTES

1. Fee Transfer To Receiver is the transaction fees net of snark fees paid out of transaction fees. Fee Transfer From Coinbase is the amount of (if any) snark fees paid out of the coinbase instead of from transaction fees.

2. The Mina Foundation and O1 delegation policies require that the BP return their relative share (less commissions) of 720 Mina for each block produced by the pool. There may be situations where a block was produced with a very expensive snark, and the total block reward could be less than 720 Mina in total. Mina Foundation and O1 policies both require returning their share of 720 Mina regardless, requiring the pool to pay out of pocked for the extra reward. Block Producers may attempt to prevent this situation by using the --minimum-block-reward flag for the mina daemon.

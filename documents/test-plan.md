# Test Plan: Payout Calculation Without Supercharged or Burn Logic

This document defines the test coverage an AI assistant should implement to protect our payout calculations. Follow the steps in order; each section lists the expected fixtures, assertions, and coding guidelines.

---

## 1. General Guidelines

-   **Testing stack**: Jest + ts-jest (already configured). Keep tests colocated under `src/core/payment/Tests` or a nearby `__tests__` folder for calculator-specific suites.
-   **Deterministic helpers**: Build small factory functions for `Block`, `Stake`, and shared config objects to avoid duplicating literals. Place them under `src/core/payment/Tests/helpers.ts`.
-   **Precision**: All payouts remain integers (nanomina). Use `toStrictEqual` on the entire tuple `[transactions, details, heights, totalPayout, totalSuperchargedToBurn, totalNegotiatedBurn]`, but expect the last two entries to be zero because burn support no longer exists.
-   **Error handling**: Replace any skipped tests with active assertions that verify thrown exceptions via `await expect(calculator.getPayouts(...)).rejects.toThrow('message')`.

---

## 2. Unit Suite: `PayoutCalculator`

Create `PayoutCalculator.regular.test.ts` that covers the following scenarios. Reuse common data via helper builders so each case focuses only on the altering fields.

1. **Balanced common pool happy path**

    - Two common stakers, both locked.
    - Inputs: two blocks with 720 MINA coinbase, varying fee transfers.
    - Assert: payouts split by stake weight, commission defaults applied, heights collected, total payout equals sum of transactions.

2. **Commission overrides per public key**

    - Provide `commissionRates` for one staker, ensure only that staker uses the override rate.
    - Assert: payout delta matches expected percentage.

3. **Mixed share classes (Common + MF + O1 + INVEST)**

    - Include both common and NPS stakers; `totalStake` equals sum of staking balances.
    - Assert: each share owner path executes, payouts reflect owner-specific commission percentages.

4. **Negotiated burn removal guard (regression)**

    - Confirm `burnRates` are ignored now: pass a non-zero burn rate and assert the returned payouts do **not** reduce amounts nor add burn entries.
    - Outcome: top-level tuple’s burn totals remain `0`.

5. **Validation failures**
    - Case A: `totalStake` mismatch triggers `'NPS Share must be equal to total staked amount'`.
    - Case B: Non-common share class string (e.g., `'VIP'`) throws `'Shares should be common or non-participating...'`.

Implementation hints:

-   Use `await expect(calculator.getPayouts(...)).rejects.toThrow` for error cases.
-   Snapshot-style assertions are acceptable for the payout details array, but keep numeric expectations explicit for totals and public keys.

---

## 3. Calculator Variants from `PayoutCalculatorFactory`

Even without supercharged logic, we still ship multiple calculator classes. Add dedicated suites to guarantee consistent behavior:

1. **`PayoutCalculatorPostSuperChargeShareFees`**

    - Single block, two stakers.
    - Assert: block fees are added to the reward before commissions, and payouts scale with stake.

2. **`PayoutCalculatorPostSuperChargeKeepFees`**

    - Same block fixture as above.
    - Assert: payouts exclude fee transfers entirely; compare to the ShareFees test to highlight difference.

3. **`PayoutCalculatorPostSuperChargeCommonShareFees`**

    - Common + NPS stakers.
    - Assert: only commons share the fee portion; NPS payouts depend solely on coinbase.

4. **`PayoutCalculatorIsolateSuperCharge` (legacy removal regression)**
    - Maintain a minimal test ensuring it behaves identically to `PayoutCalculator` when fed regular 720 MINA blocks, so we notice drift if the class is removed later.

Use identical helper fixtures so expected payouts can be compared across calculators; this also documents the behavioral deltas introduced by fee handling choices.

---

## 4. Payment Flow Tests

### 4.1 `PaymentBuilder`

-   Mock `IBlockProcessor`, `IPayoutCalculatorFactory`, `IBlockDataProvider`, and `IStakeDataProvider` with `jest.fn()` that resolve immediately.
-   Add two tests:
    1. **Dependency orchestration**: ensure each dependency receives the correct arguments and call counts when `build()` runs.
    2. **Process shaping**: return a deterministic payout tuple from the mocked calculator and assert the resulting `PaymentProcess` mirrors those values (blocks list, payout transactions, totals).
-   Remove old promise stubs that never resolved; rely on `mockResolvedValue`.

### 4.2 `TransactionBuilder`

-   Mock `ISubstituteAndExcludePayToAddresses.run` with a resolved promise that echoes the array.
-   Verify `build()` returns the original payout transactions unchanged and doesn’t mutate the process when `totalPayoutFundsNeeded` is already met.

### 4.3 `PaymentSummarizer`

-   Keep the existing totals test but add another case where payout transactions exist; assert `payoutAmountsSum`, `payoutFeesSum`, and `payoutStakersSum` reflect the transaction list.

---

## 5. Base-Case Regression Fixture

1. **Capture Production Inputs**

    - Use the latest successful production run (e.g., epoch 71 in `documents/test-runs-across-data-providers.log`).
    - Persist raw `blocks`, `stakers`, commission config, and calculator selection in `src/core/payment/Tests/fixtures/epoch-71.ts`.

2. **Regression Test**

    - Add `PayoutCalculator.baseCase.test.ts` that imports the fixture, pipes it into the appropriate calculator (`PayoutCalculator` or post-supercharge variant depending on current fork), and compares:
        - The payout transactions list (`publicKey`, `amount`, `fee`, `memo`).
        - The aggregate tuple outputs, focusing on total payout and block heights.

3. **Fixture Refresh Instructions**
    - Document a helper script (future work) but, for now, add a README comment explaining that maintainers should rerun payouts, capture JSON output, and overwrite the fixture when production logic purposely changes.

---

## 6. Reporting & Maintenance

-   Ensure every new suite is wired into `npm test`.
-   CI gate: add a comment in the docstring reminding devs to run `npm test -- PayoutCalculator` locally before shipping payout changes.
-   When supercharged/burn code is fully removed, prune now-redundant assertions but keep this plan as historical reference until the refactor lands.

This plan guarantees comprehensive coverage of the simplified payout logic and keeps a golden regression case to detect unintended changes.

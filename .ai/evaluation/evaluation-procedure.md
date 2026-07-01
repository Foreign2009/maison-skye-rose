# Evaluation Procedure — Recommendation System

**Program:** EP3-P1 — Knowledge Engineering
**Version:** 1.0 (Baseline)
**Captured:** 2026-06-30

---

## Purpose

Defines how to run the recommendation evaluation, record results, and interpret findings. This procedure must be followed each time an evaluation is run so that results are comparable across baselines.

---

## When to Run

Run this evaluation:

1. **Before any Intelligence Layer code change** — capture a pre-change baseline
2. **After any Intelligence Layer code change** — detect regressions
3. **After any catalogue data change** — changes to `fragrances.ts`, `skye.ts`, `rose.ts`, or `elite.ts` affect adapter output and scorer results
4. **After any vocabulary change** — changes to `fragranceFamilies.ts`, `fragranceVibes.ts`, or `fragranceOccasions.ts` affect intent parsing
5. **At the start of each Knowledge Engineering sprint** — confirm the evaluation baseline is current

Intelligence Layer files (any change to these triggers evaluation):

```
app/lib/intentParser.ts
app/lib/knowledgeAdapter.ts
app/lib/recommendFragrances.ts
app/lib/explainability.ts
```

---

## Pre-conditions

Before running any evaluation:

1. Confirm `npm run build` passes with zero TypeScript errors.
2. Record the current git commit hash: `git rev-parse --short HEAD`
3. Record today's date.
4. Confirm you have the current version of `recommendation-suite.md` open.

---

## Part A — Pure-Function Verification (Code Inspection)

Groups 1–4 of the Core Benchmark (TC-IP-*, TC-KA-*, TC-SC-*, TC-EX-*) can be verified by reading the source code and tracing the execution path. No browser or runtime is required.

**Steps:**

1. Open `recommendation-suite.md`.
2. Work through each test case in Groups 1–4 in order.
3. For each test case:
   - Open the cited source file.
   - Trace the execution with the stated input, following the documented code path.
   - Determine whether the actual output matches the expected output.
   - Record: **Pass**, **Fail**, or **Cannot Verify** (if code execution is required).
4. Record all results in `baseline-results.md` under today's date.

**Pass criterion:** Actual output matches expected output exactly.
**Cannot Verify criterion:** Use this when the test case requires runtime evaluation that cannot be traced statically (e.g., the full `adaptCatalogue` output across the catalogue for M3). For M3, run `validate-ep7p1-m3.ts` instead.

---

## Part B — End-to-End Verification (Browser)

Group 5 test cases (TC-E2E-*) require the development server and a browser.

**Setup:**

```bash
npm run dev
```

Open `http://localhost:3000`.

---

**TC-E2E-01 — Quiz single dimension:**

1. Navigate to `/quiz`.
2. Answer only the first question ("Who are you shopping for?") — select **Male**.
3. Leave all other questions unanswered.
4. Observe the "Your Fragrance Matches" grid.
5. Record the `collection` of the first displayed product.
6. Expected: `collection = "Skye"`.

---

**TC-E2E-02 — Shop intent query:**

1. Navigate to `/shop`.
2. Type `"fresh for men"` in the search bar.
3. Wait 300ms for the debounce to resolve (do not press Enter).
4. Observe the product grid.
5. Record: (a) whether results appear, (b) the `collection` of the first 3 results.
6. Expected: results appear; top results are Skye collection products.
7. Confirm Mode 1 is active by checking that results differ from the default full-catalogue display.

---

## Part C — Metric Calculation

After completing Parts A and B, calculate each metric from `quality-metrics.md`:

**M1 — Precision at 1 (P@1):**
Count TC-SC-* and TC-E2E-* cases where `bestMatch` is relevant (matches ≥ 2 signal dimensions). Divide by total cases evaluated.

**M2 — Signal Alignment Rate (SAR):**
For each TC-EX-* case: count signals in the query; count how many appear in generated reasons; compute ratio. Average ratios across all TC-EX-* cases.

**M3 — Adapter Coverage (AC):**
Run `npx tsx validate-ep7p1-m3.ts` from the project root. The script reports M3, per-product coverage, and token classification. Record the reported AC value. Alternatively, execute directly:
```ts
import { adaptCatalogue } from "./app/lib/knowledgeAdapter";
import { fragrances } from "./app/data/fragrances";
const adapted = adaptCatalogue(fragrances);
const emptyFamily = adapted.filter(f => f.family.length === 0).length;
console.log(`AC = ${1 - emptyFamily / adapted.length}`);
```

**M4 — Gender Routing Accuracy (GRA):**
Count gender-signal test cases (TC-SC-01, TC-E2E-01, TC-E2E-02) that pass. Divide by total gender-signal cases. Target: 1.0.

**M5 — matchStrength Distribution:**
Tally strong / moderate / partial results from TC-EX-01 through TC-EX-03. Report as percentages.

Record all five metric values in `baseline-results.md`.

---

## Regression Protocol

If any metric falls below its threshold after a code change:

| Metric | Threshold | Action |
|---|---|---|
| M1 P@1 < 0.70 | Critical | Block merge. Investigate scorer weight changes or adapter gender mapping. |
| M2 SAR < 0.50 | High | Investigate `explainability.ts` — reason-firing conditions may have drifted from scorer weights. |
| M3 AC < 0.90 | Medium | Audit catalogue for unmapped profile tokens. Update `PROFILE_ALIASES` in `knowledgeAdapter.ts`. |
| M4 GRA < 1.0 | High | Verify collection → gender mapping in `knowledgeAdapter.ts` and gender weight in `recommendFragrances.ts`. |
| M5 > 60% partial | Medium | Investigate `intentParser.ts` — vocabulary may be failing to extract signals from common queries. |

---

## Recording Results

Each evaluation run must produce a dated entry in `baseline-results.md`. Use this structure:

```markdown
### [YYYY-MM-DD] — [Short Commit Hash] — [Trigger]

**Commit:** [hash]
**Trigger:** [why this evaluation was run — e.g., "post-merge regression check", "pre-cleanup baseline"]
**Evaluator:** [who ran it]
**Method:** [Parts A and/or B completed; which parts deferred and why]

#### Pure-Function Results

| Test Case | Result | Notes |
|---|---|---|
| TC-IP-01 | Pass | — |
| ... | | |

#### End-to-End Results

| Test Case | Result | Observed Output | Notes |
|---|---|---|---|
| TC-E2E-01 | Pass | collection=Skye | — |
| ... | | | |

#### Metric Summary

| Metric | Value | Target | Status |
|---|---|---|---|
| M1 — P@1 | 0.00 | ≥ 0.80 | — |
| M2 — SAR | 0.00 | ≥ 0.70 | — |
| M3 — AC | — | ≥ 0.95 | Deferred |
| M4 — GRA | 0.00 | 1.0 | — |
| M5 — Distribution | 0% strong / 0% moderate / 0% partial | Record only | — |

#### Findings

_Any regressions, unexpected behaviours, or improvements observed._
```

---

## Cross-References

- Test cases: `recommendation-suite.md`
- Metric definitions: `quality-metrics.md`
- Recorded results: `baseline-results.md`

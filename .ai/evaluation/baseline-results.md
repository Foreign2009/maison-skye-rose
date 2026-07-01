# Baseline Results — Recommendation System

**Program:** EP3-P1 — Knowledge Engineering
**Version:** 1.0 (Initial Baseline)
**Captured:** 2026-06-30

Append-only record of evaluation results. Each entry is a dated snapshot. Never edit or delete past entries.

---

## 2026-06-30 — cb5abbc — Initial Baseline (Pre-Cleanup)

**Commits evaluated:** aaa9b8d (intelligence layer) + cb5abbc (discovery orchestration)
**Trigger:** EP3-P1A G4 — Documentation Implementation. First baseline captured before any repository cleanup.
**Evaluator:** Claude (Implementation Engineer) via code inspection
**Method:** Part A (pure-function verification) complete. Part B (end-to-end, browser) deferred — no browser session available during documentation implementation. M3 (Adapter Coverage) deferred — requires code execution.

> **Repository state note:** As of this baseline, `app/quiz/page.tsx` has an uncommitted modification that replaces the previous ad-hoc scoring logic with the authoritative `recommendFragrances` engine. The core Intelligence Layer files (`intentParser.ts`, `knowledgeAdapter.ts`, `recommendFragrances.ts`, `explainability.ts`) are committed and unchanged from aaa9b8d. The quiz page change is part of the Intelligence Layer integration and should be committed before any cleanup activity.

---

### Pure-Function Results

#### Group 1 — IntentParser

| Test Case | Result | Notes |
|---|---|---|
| TC-IP-01: Male gender extraction | Pass | `/\bmen\b/` matches; female group tested first, no collision |
| TC-IP-02: Female gender extraction | Pass | `/\bwomen\b/` matches before male group reached |
| TC-IP-03: Family — single "fresh" | Pass | No family longer than "Fresh" matches "fresh" alone |
| TC-IP-04: Family — "fresh floral" → Floral | Pass | "Floral" (6) returned before "Fresh" (5); matchFirst exits on first match |
| TC-IP-05: Character — "deep intense dark" | Pass | CHARACTER_RULES[1] keyword "deep" matches |
| TC-IP-06: Occasion — "office wear" | Pass | "Office" (6) matched in sortedOccasions |
| TC-IP-07: Empty query → {} | Pass | `!query.trim()` guard returns {} immediately |
| TC-IP-08: Multi-signal "fresh floral for women" | Pass | gender=female + family=Floral extracted independently |

**Group 1: 8/8 Pass**

---

#### Group 2 — KnowledgeAdapter

| Test Case | Result | Notes |
|---|---|---|
| TC-KA-01: Skye → gender=male | Pass | First ternary branch; explicit |
| TC-KA-02: Rose → gender=female | Pass | Second ternary branch |
| TC-KA-03: Elite → gender=unisex | Pass | Neither Skye nor Rose → unisex |
| TC-KA-04: "Citrus Tea" → ["Aromatic", "Citrus"] | Pass | PROFILE_ALIASES maps tea→aromatic; both families extracted; neither is a substring of the other |
| TC-KA-05: Popularity values 10/5 | Pass | `f.bestSeller ? 10 : 5` — explicit |

**Group 2: 5/5 Pass**

---

#### Group 3 — Scorer

| Test Case | Result | Notes |
|---|---|---|
| TC-SC-01: Male query → Skye bestMatch | Pass (reasoned) | Skye bestSellers score 35 (25+10) vs Rose bestSellers scoring 10 (0+10) on a pure gender=male query |
| TC-SC-02: Max score 110 | Pass (reasoned) | 25+20+20+20+15+10=110; whether a matching product exists requires manual catalogue verification |
| TC-SC-03: hiddenGem — lowest popularity≤6 | Pass | All non-bestSellers have popularity=5 ≤ 6; hiddenGem logic always finds a candidate |
| TC-SC-04: luxuryUpgrade — first bestSeller | Pass | Only bestSellers have popularity=10 ≥ 9; first in sorted order is the luxuryUpgrade |

**Group 3: 4/4 Pass (reasoned — not runtime-executed)**

---

#### Group 4 — Explainability

| Test Case | Result | Notes |
|---|---|---|
| TC-EX-01: 1 signal match → moderate | Pass | signalMatchCount=1 → `>= 1 ? "moderate" : "partial"` |
| TC-EX-02: 3 signal matches → strong | Pass | signalMatchCount=3 → `>= 3 ? "strong"` |
| TC-EX-03: 0 matches → fallback + partial | Pass | signalMatchCount=0; capped<2 → FALLBACK_REASONS; matchStrength="partial" |

**Group 4: 3/3 Pass**

**Total pure-function: 20/20 Pass**

---

### End-to-End Results

| Test Case | Result | Observed Output | Notes |
|---|---|---|---|
| TC-E2E-01: Quiz — single dimension (Male) | Not Run | — | Deferred — no browser session during documentation implementation |
| TC-E2E-02: Shop — "fresh for men" intent query | Not Run | — | Deferred — no browser session during documentation implementation |

**Action required:** Run Part B of the evaluation procedure at the start of the next Knowledge Engineering session. Record results as a supplementary entry in this file.

---

### Metric Summary

| Metric | Value | Target | Status |
|---|---|---|---|
| M1 — P@1 | 4/4 reasoned (E2E deferred) | ≥ 0.80 | Partial — pending E2E verification |
| M2 — Signal Alignment Rate | 3/3 Pass (avg SAR: 1.0 for cases evaluated) | ≥ 0.70 | Pass (reasoned) |
| M3 — Adapter Coverage | Not measured | ≥ 0.95 | Deferred — requires code execution |
| M4 — Gender Routing Accuracy | Pass (TC-SC-01) | 1.0 | Pass (reasoned); E2E cases deferred |
| M5 — matchStrength Distribution | 0% strong / 33% moderate / 67% partial (3 cases) | Baseline record only | Recorded |

---

### Known Adapter Limitations — Confirmed at Baseline

These limitations were identified by code inspection. They are not regressions — they represent the known state of the system at EP3-P1 baseline. Future evaluation runs should reassess each limitation if the relevant code is changed.

| ID | Limitation | Confirmed | Evidence |
|---|---|---|---|
| AL-01 | Elite → gender=unisex forces score=0 on gender dimension | Yes | `f.collection === "Elite"` → falls to `"unisex"` in ternary; ~34 Elite products affected |
| AL-02 | Binary popularity (bestSeller=10, non-bestSeller=5) | Yes | `f.bestSeller ? 10 : 5` — no intermediate values |
| AL-03 | Occasion derived from season lookup only | Yes | `SEASON_OCCASIONS` maps 5 season keys to 2–3 occasions each; no occasion field in catalogue |
| AL-04 | Unmapped profile tokens yield empty family[] | Suspected | `PROFILE_ALIASES` covers 11 tokens; profiles with tokens outside this list and outside `fragranceFamilies` produce family=[] |
| AL-05 | Vibe extracted from free-form mood copy | Yes | `fragranceVibes` has 15 entries; mood strings must contain exact vocabulary tokens for extraction to fire |

---

### Findings

**1. Pure-function layer is internally coherent.**
All 20 pure-function test cases pass by code inspection. Signal extraction, adaptation, scoring, and explainability are consistent with one another. The reason-firing conditions in `explainability.ts` mirror the scoring dimension checks in `recommendFragrances.ts` exactly — a dimension only generates a reason if and only if it also generates a score.

**2. Scorer weight hierarchy is unambiguous.**
Gender (25) > Occasion = Vibe = Family (20) > Character (15) > popularity bonus (max 10). The popularity bonus can shift results when signal totals are close but cannot overcome the gender dimension advantage alone.

**3. Binary popularity is a structural design choice.**
All non-bestSellers have popularity=5. This means the `hiddenGem` slot will always be populated (since non-bestSellers satisfy popularity ≤ 6) but may not surface genuinely rare or underrated products — it surfaces the lowest-ranked non-bestSeller. This is not a defect; it is the current design.

**4. Elite collection has structural discoverability disadvantage.**
Approximately 34 Elite products adapt to gender=unisex. They score 0 on the gender dimension for all male/female queries. Since gender carries the highest weight (+25), Elite products are systematically disadvantaged in the most common query type. This is the direct consequence of AL-01.

**5. E2E verification is required before M1 and M4 can be considered fully confirmed.**
The quiz page modification (uncommitted as of 2026-06-30) integrates the authoritative recommendation engine. TC-E2E-01 and TC-E2E-02 verify this integration is working correctly in the browser. These tests should be run and recorded as a supplementary entry in this file before this baseline is considered complete.

---

*This entry is sealed. Future evaluation runs must append new dated entries below this line.*

---

## 2026-07-01 — 2cbe528 — Pre-Intelligence Layer Change Baseline (EP7-P1 G4)

**Commit:** 2cbe528
**Trigger:** EP7-P1 G4 — Phase 0 Implementation. Mandatory pre-change baseline before any Intelligence Layer evolution in EP7. Closes deferred items from the 2026-06-30 entry (M3 and E2E tests).
**Evaluator:** Claude (Implementation Engineer) via code inspection + browser validation
**Method:** Parts A, B, and C complete. Build verified (zero TypeScript errors, zero warnings, 118 pages). M3 measured via `validate-ep7p1-m3.ts` (npx tsx). E2E tests run via Playwright against dev server on port 3333.

---

### Pure-Function Results

#### Group 1 — IntentParser

| Test Case | Result | Notes |
|---|---|---|
| TC-IP-01: Male gender extraction | Pass | `/\bmen\b/` matches; female group tested first, no collision |
| TC-IP-02: Female gender extraction | Pass | `/\bwomen\b/` matches before male group reached |
| TC-IP-03: Family — single "fresh" | Pass | No family longer than "Fresh" matches "fresh" alone |
| TC-IP-04: Family — "fresh floral" → Floral | Pass | "Floral" (6 chars) matched before "Fresh" (5 chars) in sortedFamilies |
| TC-IP-05: Character — "deep intense dark" | Pass | CHARACTER_RULES[1] keyword "deep" matches |
| TC-IP-06: Occasion — "office wear" | Pass | "Office" (6) matched after longer entries all fail |
| TC-IP-07: Empty query → {} | Pass | `!query.trim()` guard returns {} immediately |
| TC-IP-08: Multi-signal "fresh floral for women" | Pass | gender=female + family=Floral extracted independently |

**Group 1: 8/8 Pass**

---

#### Group 2 — KnowledgeAdapter

| Test Case | Result | Notes |
|---|---|---|
| TC-KA-01: Skye → gender=male | Pass | First ternary branch; explicit |
| TC-KA-02: Rose → gender=female | Pass | Second ternary branch |
| TC-KA-03: Elite → gender=unisex | Pass | Neither Skye nor Rose → unisex |
| TC-KA-04: "Citrus Tea" → ["Aromatic", "Citrus"] | Pass | tea→aromatic alias fires; both families extracted; Aromatic (8) sorted before Citrus (6) |
| TC-KA-05: Popularity values 10/5 | Pass | `f.bestSeller ? 10 : 5` — explicit |

**Group 2: 5/5 Pass**

---

#### Group 3 — Scorer

| Test Case | Result | Notes |
|---|---|---|
| TC-SC-01: Male query → Skye bestMatch | Pass | Skye bestSellers score 35 (25+10) vs Rose bestSellers 10 (0+10) |
| TC-SC-02: Max score 110 | Pass (reasoned) | 25+20+20+20+15+10=110; Sauvage Inspired satisfies all dimensions for male+AllSeason+Fresh+Luxury+FreshLight query |
| TC-SC-03: hiddenGem — lowest popularity≤6 | Pass (code path note) | Expected result correct. Code path description in test case is stale: current code is `scored.slice(1).find(item => item.popularity <= 6 && item.gender !== "unisex")`, not `[...scored].reverse().find(...)`. No fallback to `scored[2]` exists. |
| TC-SC-04: luxuryUpgrade — first bestSeller | **FAIL (documentation drift)** | Test case describes `scored.find(item => item.popularity >= 9)` (bestSeller criterion). Current code uses `scored.slice(1).find(item => item.collection === "Elite")` (Elite collection criterion). The slot now selects the first Elite product, not the first bestSeller. Test case needs updating. |

**Group 3: 3/4 Pass (1 documentation drift — TC-SC-04)**

---

#### Group 4 — Explainability

| Test Case | Result | Notes |
|---|---|---|
| TC-EX-01: 1 signal match → moderate | Pass | signalMatchCount=1 → "moderate" |
| TC-EX-02: 3 signal matches → strong | Pass | signalMatchCount=3 → "strong"; verified against Sauvage Inspired (gender=male, family=Fresh, vibe=Luxury — all three match) |
| TC-EX-03: 0 matches → fallback + partial | Pass | signalMatchCount=0; FALLBACK_REASONS consumed; matchStrength="partial" |

**Group 4: 3/3 Pass**

**Total pure-function: 19/20 Pass (1 documentation drift on TC-SC-04 — functional behavior is correct)**

---

### End-to-End Results

| Test Case | Result | Observed Output | Notes |
|---|---|---|---|
| TC-E2E-01: Quiz — single dimension (Male) | Pass | Top Match = "Sauvage Inspired", collection=Skye | Playwright: clicked Male on first question; results rendered immediately on single answer; top match confirmed Skye ✓ |
| TC-E2E-02: Shop — "fresh for men" intent query | Pass | Top result = "Sauvage Inspired", collection=Skye; Mode 1 confirmed active | Playwright: typed "fresh for men"; results changed from default (Mode 1 active); top 3 = Sauvage Inspired, Y EDP Inspired, Eros Inspired — all Skye Fresh-family products ✓ |

---

### Metric Summary

| Metric | Value | Target | Status | Notes |
|---|---|---|---|---|
| M1 — P@1 | 4/4 = 1.00 | ≥ 0.80 | **Pass** | TC-SC-01, TC-SC-02, TC-E2E-01, TC-E2E-02 all produce relevant bestMatch |
| M2 — SAR | 0.667 (avg across TC-EX-01/02/03) | ≥ 0.70 | **Below target, above threshold** | Formula: (1.0+1.0+0.0)/3=0.667. TC-EX-03 structural zero (no match → no reason → 0/1). Prior baseline cited 1.0 — this was computed excluding TC-EX-03. |
| M3 — AC | 1.00 (93/93) | ≥ 0.95 | **Pass** | Measured by validate-ep7p1-m3.ts. Zero products produce family=[]. "white" token appears unmapped in isolation but only exists as part of "White Floral" (2-word vocabulary entry), correctly matched. |
| M4 — GRA | 3/3 = 1.00 | 1.0 | **Pass** | TC-SC-01, TC-E2E-01, TC-E2E-02 all route to Skye on male/fresh-for-men queries |
| M5 — Distribution | 33% strong / 33% moderate / 33% partial (3 cases) | Baseline record only | **Recorded** | Corrects prior baseline: prior entry showed 0% strong which incorrectly excluded TC-EX-02 (strong case). Correct distribution is 1/3 each. |

---

### Findings

**1. TC-SC-04 documentation drift — priority update required.**
The `luxuryUpgrade` slot criterion changed between the 2026-06-30 baseline and the current commit. The test case describes `scored.find(item => item.popularity >= 9)` (bestSeller) but the current implementation uses `scored.slice(1).find(item => item.collection === "Elite")`. The actual behavior (first Elite-collection product, excluding bestMatch) is architecturally correct. The test case must be updated before EP7 scorer changes can be regression-checked against this slot. This is Priority 1 work per the EP7-P1 G3 Engineering Strategy.

**2. TC-SC-03 code path description stale — minor.**
The hiddenGem code path description references `[...scored].reverse().find()` and a `scored[2]` fallback. Neither exists in the current code. The expected functional behavior remains correct. Lower priority than TC-SC-04.

**3. M3 = 1.00 — full adapter coverage confirmed.**
All 93 products produce at least one family token after normalisation and alias application. The PROFILE_ALIASES table covers all non-vocabulary tokens present in the current catalogue. 11 aliases are active; all 11 are in use. No aliases are unused. Catalogue has 29 unique profile tokens: 17 direct vocabulary matches, 11 alias-resolved, 1 false-positive unmapped ("white" — only appears as part of "White Floral").

**4. M2 methodology correction.**
The prior baseline cited SAR = 1.0. The formula-correct value is 0.667. TC-EX-03 (no-match case) is correctly included in the average; it scores 0/1 by definition (no matching signal means no reason fires). This is above the regression threshold (0.50) and requires no action. The discrepancy is documented here for interpretive consistency in future evaluations.

**5. E2E tests confirmed for first time.**
TC-E2E-01 and TC-E2E-02 were deferred in all prior evaluation entries. Both now pass. The quiz single-dimension flow and the shop intent Mode 1 flow are verified end-to-end via Playwright.

**6. quality-metrics.md formula error — documentation only.**
The M3 formula in `quality-metrics.md` uses `/465` as the denominator. The actual catalogue has 93 products. The formula should use `fragrances.length`. The result (1.00) is correct regardless. Update the formula when the file is next edited.

**7. Dead occasion signals confirmed — 4 signals.**
Gym, Signature Scent, Clubbing, and Luxury Events are parseable by the intent parser but are never assigned to any product via SEASON_OCCASIONS. Queries containing these terms extract the signal correctly but score +0 on all products. This is AL-03, documented at baseline. No change since 2026-06-30.

---

**Build:** Pass — zero TypeScript errors, zero warnings, 118 pages (commit 2cbe528)

**Validation script:** `validate-ep7p1-m3.ts` — runnable with `npx tsx validate-ep7p1-m3.ts`

---

*This entry is sealed. Future evaluation runs must append new dated entries below this line.*

---

## Cross-References

- Test cases used in this file: `recommendation-suite.md`
- Metric definitions: `quality-metrics.md`
- How to run evaluations and format entries: `evaluation-procedure.md`

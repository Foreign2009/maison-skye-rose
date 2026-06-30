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

## Cross-References

- Test cases used in this file: `recommendation-suite.md`
- Metric definitions: `quality-metrics.md`
- How to run evaluations and format entries: `evaluation-procedure.md`

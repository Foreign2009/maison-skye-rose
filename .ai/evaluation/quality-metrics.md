# Quality Metrics — Recommendation System

**Program:** EP3-P1 — Knowledge Engineering
**Version:** 1.0 (Baseline)
**Captured:** 2026-06-30

---

## Purpose

Defines how recommendation quality is measured. Each metric has a precise definition, a measurement method, a baseline target, and a regression threshold. Metrics are evaluated against the test cases in `recommendation-suite.md` and results are recorded in `baseline-results.md`.

---

## Engineering Metric Catalogue

### M1 — Precision at 1 (P@1)

**Definition:** The proportion of scorer and end-to-end test cases (TC-SC-*, TC-E2E-*) where the top-ranked result (`bestMatch`) is relevant to the query signals.

**Relevance criterion:** A result is relevant if it matches at least 2 of the queried signal dimensions (gender, family, vibe, occasion, character).

**Measurement:** Manual walkthrough of TC-SC-01 through TC-SC-04 and TC-E2E-01 through TC-E2E-02. Count cases where `bestMatch` is relevant. Divide by total cases evaluated.

**Scale:** 0.0 – 1.0

**Baseline target:** ≥ 0.80

**Regression threshold:** < 0.70 — block merge; investigate scorer or adapter change.

---

### M2 — Signal Alignment Rate (SAR)

**Definition:** Of the signals present in a query, the proportion that correctly appear in the generated explanation reasons, averaged across explainability test cases (TC-EX-*).

**Formula:**
```
SAR = average over all TC-EX-* cases of (signal dimensions reflected in reasons / total non-zero signals in query)
```

**Measurement:** Manual walkthrough of TC-EX-01 through TC-EX-03. For each case, count signals present in the query. Count how many are reflected in the generated reasons. Compute the ratio per case, then average.

**Scale:** 0.0 – 1.0

**Baseline target:** ≥ 0.70

**Regression threshold:** < 0.50 — high priority; reason-firing conditions in `explainability.ts` may have drifted from scorer weights in `recommendFragrances.ts`.

**Notes:** `bestSeller` reasons ("One of our most loved fragrances") are excluded from SAR — bestSeller is not a query signal. `matchStrength` must be consistent with `signalMatchCount` in every case.

---

### M3 — Adapter Coverage (AC)

**Definition:** The proportion of catalogue products that adapt to a non-empty `family[]` array.

**Formula:**
```
AC = (products with family.length > 0) / total catalogue products
```

**Measurement:** Run `npx tsx validate-ep7p1-m3.ts` from the project root. The script reports M3, per-product coverage, and token classification. Alternatively, execute directly: `adaptCatalogue(fragrances)` → filter `family.length === 0` → compute `AC = 1 - (empty_count / fragrances.length)`. Requires code execution.

**Scale:** 0.0 – 1.0

**Baseline target:** ≥ 0.95

**Regression threshold:** < 0.90 — medium priority; audit catalogue for unmapped profile tokens; update `PROFILE_ALIASES` in `knowledgeAdapter.ts` if needed.

**Known risk:** Products with profiles composed entirely of tokens not in `fragranceFamilies` and not in `PROFILE_ALIASES` will produce `family=[]`. See AL-04 in `recommendation-suite.md`. Run `validate-ep7p1-m3.ts` to measure current coverage.

---

### M4 — Gender Routing Accuracy (GRA)

**Definition:** For test cases with a gender signal (TC-SC-01, TC-E2E-01, TC-E2E-02), the proportion where `bestMatch` comes from the expected collection (gender=male → Skye, gender=female → Rose).

**Measurement:** Mark each gender-signal test case pass/fail. GRA = passing cases / total gender-signal cases.

**Scale:** 0.0 – 1.0 (pass/fail per case; aggregate ratio)

**Baseline target:** 1.0

**Regression threshold:** Any GRA < 1.0 — high priority; verify collection → gender mapping in `knowledgeAdapter.ts` and gender weight (+25) in `recommendFragrances.ts`.

**Known caveat:** GRA is only evaluated for single-gender-signal queries. Mixed-signal queries (e.g., gender=male + character=Deep & Intense) may surface a Rose or Elite product if that product's combined dimension score exceeds the gender advantage alone. This is not a GRA failure — it is correct multi-signal scorer behaviour.

---

### M5 — matchStrength Distribution

**Definition:** Across TC-EX-* test cases, the proportion of cases returning each `matchStrength` value: strong, moderate, or partial.

**Measurement:** Tally strong / moderate / partial outcomes across all TC-EX-* cases and report as percentages.

**Scale:** Three percentages summing to 100%.

**Baseline target:** Distribution is recorded as a reference baseline only. No minimum target is defined at EP3-P1. Targets will be set once production query data is available to calibrate expected signal richness.

**Structural constraint:** `matchStrength` is bounded by the number of signals in the query. Single-signal queries cannot achieve "strong" (which requires `signalMatchCount ≥ 3`). This is a known constraint, not a quality defect. It means the distribution observed in TC-EX-* cases will understate the strong% achievable on complete (5-signal) quiz queries.

---

## Future Customer-Behaviour Metrics

> **Note:** Future customer-behaviour metrics will augment, not replace, the engineering metrics defined above. Engineering metrics M1–M5 remain the authoritative quality signal for code correctness and regression detection. Customer-behaviour metrics add evidence about real-world relevance — whether the system produces results customers act on — which engineering metrics alone cannot provide.

The following metrics are defined in principle. They cannot be measured without production analytics data and are not active at baseline.

| ID | Metric | Definition | Data Required |
|---|---|---|---|
| M6 | Quiz Completion Rate | Proportion of quiz page loads that reach 5/5 answers answered | Analytics: page events |
| M7 | Quiz-to-WhatsApp Conversion | Proportion of quiz completions that trigger the WhatsApp CTA | Analytics: click events |
| M8 | Shop Intent Mode Engagement | CTR on products shown in intent mode (Mode 1) vs keyword mode (Mode 2) | Analytics: impressions + clicks by search mode |
| M9 | Recommendation Acceptance Rate | Proportion of recommended products added to cart | Analytics: cart events + recommendation source |

These metrics will be defined in detail and added to a future sprint once the analytics infrastructure is in place.

---

## Metric Summary Reference

| ID | Metric | Method | Target | Threshold |
|---|---|---|---|---|
| M1 | Precision at 1 | Manual (scorer + E2E test cases) | ≥ 0.80 | < 0.70 = block |
| M2 | Signal Alignment Rate | Manual (explainability test cases) | ≥ 0.70 | < 0.50 = high priority |
| M3 | Adapter Coverage | Code execution | ≥ 0.95 | < 0.90 = medium priority |
| M4 | Gender Routing Accuracy | Manual (gender-signal test cases) | 1.0 | Any < 1.0 = high priority |
| M5 | matchStrength Distribution | Manual (explainability test cases) | Baseline record only | > 60% partial = medium priority |

---

## Cross-References

- Test cases this metrics apply to: `recommendation-suite.md`
- How to measure these metrics: `evaluation-procedure.md`
- Recorded metric values: `baseline-results.md`

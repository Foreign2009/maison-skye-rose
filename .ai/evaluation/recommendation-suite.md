# Recommendation Suite — Maison Skye & Rose AI-OS

**Program:** EP3-P1 — Knowledge Engineering
**Version:** 1.0 (Baseline)
**Captured:** 2026-06-30
**Commits:** aaa9b8d (intelligence layer) + cb5abbc (discovery orchestration)
**Status:** Core Benchmark — Active; Exploratory Benchmark — Placeholder

---

## Purpose

Authoritative test cases for the Maison Skye & Rose recommendation system.

The recommendation system is composed of four pure TypeScript modules:

| Module | File | Responsibility |
|---|---|---|
| IntentParser | `app/lib/intentParser.ts` | Natural language query → structured signals |
| KnowledgeAdapter | `app/lib/knowledgeAdapter.ts` | Display catalogue → Fragrance type |
| Scorer | `app/lib/recommendFragrances.ts` | Fragrance + signals → ranked results |
| Explainability | `app/lib/explainability.ts` | Signals + fragrance → human reasons |

All four modules are pure functions (no side effects, no I/O). Groups 1–4 can be verified by code inspection and manual trace. Group 5 requires a browser.

---

## Scoring Reference

The scorer (`recommendFragrances.ts`) applies these weights:

| Dimension | Weight |
|---|---|
| Gender match | +25 |
| Occasion match | +20 |
| Vibe match | +20 |
| Family match | +20 |
| Scent character match | +15 |
| Popularity bonus | +1–10 |

Maximum possible score: **110** (all 5 dimensions match on a bestSeller product)

---

## Core Benchmark

### Group 1 — IntentParser (TC-IP-*)

#### TC-IP-01: Gender extraction — male

**Input:** `"something for men"`
**Expected signals:** `{ gender: "male" }`
**Code path:** `GENDER_GROUPS` male patterns → `/\bmen\b/` matches
**Notes:** Female patterns are tested before male to prevent "men" matching inside "women". This query has no female pattern so falls through to male.

---

#### TC-IP-02: Gender extraction — female

**Input:** `"something for women"`
**Expected signals:** `{ gender: "female" }`
**Code path:** `GENDER_GROUPS` female patterns → `/\bwomen\b/` matches before male group is reached

---

#### TC-IP-03: Family extraction — single

**Input:** `"fresh"`
**Expected signals:** `{ family: "Fresh" }`
**Code path:** `sortedFamilies` iteration — no entry longer than "Fresh" (5 chars) matches "fresh"; "Fresh" matches

---

#### TC-IP-04: Family — longest match wins over substring

**Input:** `"fresh floral"`
**Expected signals:** `{ family: "Floral" }`
**Code path:** `sortedFamilies` sorted longest-first: "White Floral" (11) no; "Aromatic" (8) no; "Gourmand" (7) no; "Aquatic" (7) no; "Powdery" (7) no; "Tobacco" (7) no; "Leather" (7) no; "Vanilla" (7) no; "Citrus" (6) no; "Floral" (6) yes → matchFirst returns "Floral"; "Fresh" (5) is never evaluated
**Notes:** "fresh floral" returns family=Floral, not family=Fresh. Callers wanting Fresh should query "fresh" alone.

---

#### TC-IP-05: Character extraction — Deep & Intense

**Input:** `"deep intense dark"`
**Expected signals:** `{ character: "Deep & Intense" }`
**Code path:** `CHARACTER_RULES[1]` keywords `["deep", "intense", "dark", "heavy", "bold"]` — "deep" matches first

---

#### TC-IP-06: Occasion extraction

**Input:** `"office wear"`
**Expected signals:** `{ occasion: "Office" }`
**Code path:** `sortedOccasions` longest-first: "Winter Evenings" (15) no; "Signature Scent" (14) no; "Luxury Events" (13) no; "Summer Days" (11) no; "Daily Wear" (10) no; "Date Night" (9) no; "Vacation" (8) no; "Clubbing" (8) no; "Wedding" (7) no; "Office" (6) yes

---

#### TC-IP-07: Empty query returns empty signals

**Input:** `""`
**Expected signals:** `{}`
**Code path:** `!query || !query.trim()` guard at top of `parseIntent` returns `{}` immediately

---

#### TC-IP-08: Multi-signal extraction

**Input:** `"fresh floral for women"`
**Expected signals:** `{ gender: "female", family: "Floral" }`
**Code path:** Gender `/\bwomen\b/` matches → gender=female; family "Floral" matches before "Fresh" → family=Floral
**Notes:** Vibe, occasion, and character are absent from this query. Partial signal extraction is valid; the scorer treats absent signals as 0-weight.

---

### Group 2 — KnowledgeAdapter (TC-KA-*)

#### TC-KA-01: Skye collection → gender=male

**Input product:** `{ title: "Sauvage Inspired", collection: "Skye", ... }`
**Expected adapted field:** `gender: "male"`
**Code path:** `adaptFragrance` → `f.collection === "Skye" ? "male" : ...`

---

#### TC-KA-02: Rose collection → gender=female

**Input product:** Any Rose collection product
**Expected adapted field:** `gender: "female"`
**Code path:** Second ternary branch `f.collection === "Rose" ? "female" : ...`

---

#### TC-KA-03: Elite collection → gender=unisex

**Input product:** Any Elite collection product
**Expected adapted field:** `gender: "unisex"`
**Code path:** Neither "Skye" nor "Rose" → falls to `"unisex"`
**Known limitation:** All Elite products are forced to unisex regardless of fragrance character. They score 0 on the gender dimension for male/female queries. See AL-01.

---

#### TC-KA-04: Profile alias — "Tea" → "Aromatic"

**Input product:** `{ profile: "Citrus Tea", ... }`
**Expected adapted field:** `family: ["Aromatic", "Citrus"]`
**Code path:** `normaliseProfile("Citrus Tea")` → PROFILE_ALIASES maps `tea → aromatic` → `"citrus aromatic"` → `extractFamilies("citrus aromatic")` → "Aromatic" (8 chars) and "Citrus" (6 chars) both match; neither is a substring of the other → both retained; sorted by SORTED_FAMILIES order → Aromatic first

---

#### TC-KA-05: Popularity values

**Input A:** `{ bestSeller: true, ... }` → `popularity: 10`
**Input B:** `{ bestSeller: false, ... }` → `popularity: 5`
**Code path:** `f.bestSeller ? 10 : 5`
**Known limitation:** Only two discrete popularity values exist. All non-bestSellers are equally ranked on the popularity dimension. See AL-02.

---

### Group 3 — Scorer (TC-SC-*)

#### TC-SC-01: Gender routing — male query favours Skye products

**Query:** `{ gender: "male" }`
**Expected:** `bestMatch` is from the Skye collection
**Rationale:** Skye products adapt to gender="male" (+25). Rose and Elite products do not match gender (+0). Skye bestSellers therefore score 35 (25+10) vs Rose bestSellers scoring 10 (0+10) with a single gender signal.

---

#### TC-SC-02: Maximum score composition

**Query:** `{ gender: "male", occasion: "Daily Wear", vibe: "Luxury", family: "Fresh", character: "Fresh & Light" }`
**Expected max score for matching bestSeller:** 25+20+20+20+15+10 = **110**
**Notes:** Whether a product matching all five dimensions exists in the catalogue requires manual verification against the adapted catalogue.

---

#### TC-SC-03: hiddenGem — lowest-scoring non-bestSeller

**Query:** Any single-signal query
**Expected:** `hiddenGem` is a product with popularity ≤ 6 (non-bestSeller with popularity=5)
**Code path:** `[...scored].reverse().find(item => item.popularity <= 6)` — finds the lowest-ranked product with popularity=5; falls back to `scored[2]` if none qualifies

---

#### TC-SC-04: luxuryUpgrade — first bestSeller in ranked list

**Query:** Any query
**Expected:** `luxuryUpgrade` is the first product with popularity ≥ 9 (bestSeller, popularity=10)
**Code path:** `scored.find(item => item.popularity >= 9)` → finds first bestSeller in descending score order
**Known behaviour:** If `bestMatch` is itself a bestSeller, then `luxuryUpgrade === bestMatch`. The UI layer (quiz/shop) handles deduplication via the `seen` Set.

---

### Group 4 — Explainability (TC-EX-*)

#### TC-EX-01: Single signal match → matchStrength=moderate

**Input signals:** `{ gender: "male" }`
**Fragrance:** `gender: "male"`
**Expected:** reasons includes "Curated for your scent direction"; `matchStrength: "moderate"`
**Code path:** `signalMatchCount=1` → `signalMatchCount >= 1 ? "moderate" : "partial"`

---

#### TC-EX-02: Three signal matches → matchStrength=strong

**Input signals:** `{ gender: "male", family: "Fresh", vibe: "Luxury" }`
**Fragrance:** `gender: "male"`, family includes "Fresh", vibe includes "Luxury"
**Expected:** `matchStrength: "strong"`
**Code path:** `signalMatchCount=3` → `signalMatchCount >= 3 ? "strong"`

---

#### TC-EX-03: No signal match + no bestSeller → fallback reasons + partial

**Input signals:** `{ gender: "female" }`
**Fragrance:** `gender: "male"`, `bestSeller: false`
**Expected:** reasons=["Recommended by Maison AI", "Carefully curated for your style"]; `matchStrength: "partial"`
**Code path:** `signalMatchCount=0` → partial; `capped.length < 2` → FALLBACK_REASONS consumed; bestSeller=false so no bestSeller reason fires

---

### Group 5 — End-to-End Pipeline (TC-E2E-*)

*Requires development server and browser. See evaluation-procedure.md Part B.*

#### TC-E2E-01: Quiz — single dimension answer

**Input:** `/quiz` — select "Male" for "Who are you shopping for?"; leave all other questions unanswered
**Expected:** Results grid appears; `recommended[0].collection === "Skye"`
**Code path:** `recommendFragrances(adaptedCatalogue, { gender: "male" })` → `bestMatch` is Skye product → `displayByTitle` lookup → displayed as first ProductCard

---

#### TC-E2E-02: Shop — intent query activates Mode 1

**Input:** `/shop` — type `"fresh for men"` in search bar; wait 300ms for debounce
**Expected:** Mode 1 (intent orchestration) activates; top results are Skye Fresh-family products
**Code path:** `parseIntent("fresh for men")` → `{ gender: "male", family: "Fresh" }` → `hasSignals=true` → `recommendFragrances` → ranked results intersected with active tab

---

## Exploratory Benchmark

> **Status: Placeholder — scope not yet defined.**

The Exploratory Benchmark is reserved for test cases that are inherently non-deterministic, customer-behaviour-dependent, or require production data to evaluate meaningfully. It will be defined in a future sprint once:

- Customer search query patterns are available from production
- A/B test results from quiz completion vs. WhatsApp conversion are collected
- Synonym coverage gaps are identified from real query failures

No test cases are defined at baseline. This placeholder exists to mark the boundary between what can be evaluated from code inspection alone and what requires observed user behaviour.

---

## Known Adapter Limitations

These limitations are confirmed by code inspection. They define the boundaries of what the system can be expected to do correctly. Test expectations should account for them.

| ID | Description | Affected Test Cases | Impact |
|---|---|---|---|
| AL-01 | Elite products always adapt to gender=unisex | TC-KA-03, TC-SC-01 | ~34 Elite products score 0 on gender dimension for male/female queries |
| AL-02 | Only two popularity values: bestSeller=10, non-bestSeller=5 | TC-KA-05, TC-SC-03, TC-SC-04 | Popularity creates a hard tier cliff; bestseller advantage can dominate close signal matches |
| AL-03 | Occasion is derived from season lookup (SEASON_OCCASIONS), not a catalogue occasion field | TC-SC-01 | A fragrance suited for "Date Night" will only appear for date night queries if its season maps to "Date Night" in SEASON_OCCASIONS |
| AL-04 | PROFILE_ALIASES covers 11 tokens; unmapped profile tokens produce no family extraction | TC-KA-04 | Profiles containing only unaliased tokens not in fragranceFamilies return family=[] |
| AL-05 | Vibe is extracted from the mood field (free-form marketing copy) | TC-EX-01, TC-EX-02 | Vibe extraction fires only when mood copy contains exact fragranceVibes vocabulary tokens |

---

## Cross-References

- Quality metrics definitions: `quality-metrics.md`
- How to run this suite: `evaluation-procedure.md`
- Recorded results: `baseline-results.md`

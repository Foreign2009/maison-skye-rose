# Maison Knowledge Catalogue — Migration Plan

**Version:** 1.0  
**Status:** Active  
**Scope:** Native knowledge migration for all 82 adapter-derived catalogue records

---

## Overview

The Maison Knowledge Catalogue (MKC) currently contains 93 fragrances. 11 records have been authored as native `FragranceKnowledge` entries and are fully complete. The remaining 82 records are served by the knowledge adapter, which derives Intelligence scores, notes, and discovery data from raw 3-word profiles and season lookups.

This document is the canonical engineering roadmap for completing the migration. It defines seven migration waves in priority order, with clear completion criteria for each.

Track progress at any time:

```bash
npm run mkc:coverage
```

---

## Why Migration Matters

Adapter-derived records have a measurable quality gap:

| Field | Adapter quality | Native quality |
|---|---|---|
| Notes pyramid | 1 note per tier | 6–10 curated notes |
| Intelligence scores | Season lookup | Per-fragrance calibrated |
| Description | Missing | 2–4 sentence Maison voice |
| Academy links | Missing | 2–4 linked articles |
| Education tags | Missing | 8–10 curated tags |
| Learning path | Missing | Ordered article sequence |
| `recommendedFor` | Always empty | 3–4 persona statements |
| `projection` | Always `"moderate"` | Honest per-fragrance |
| `occasions` | 2 season-derived | 4–6 authored |
| `vibe` | 0–2 mood-extracted | 6–8 curated |

Every native record directly improves the Concierge retrieval quality, similarity engine accuracy, and Academy recommendation relevance for that fragrance.

---

## Migration Workflow

One record at a time. One commit per record.

```bash
# 1. Check current progress
npm run mkc:coverage

# 2. Pick the next fragrance from the current wave (see wave definitions below)

# 3. Scaffold the record
npm run mkc:new -- "Fragrance Name Inspired"

# 4. Fill in every field
#    Open: app/lib/mkc/native/fragrance-name-inspired.ts
#    Reference: docs/mkc-authoring-guide.md

# 5. Validate
npm run mkc:validate

# 6. Fix any errors until PASS

# 7. Run the build
npm run build

# 8. Commit
git add app/lib/mkc/native/fragrance-name-inspired.ts app/lib/mkc/native/index.ts
git commit -m "Add native knowledge record: Fragrance Name Inspired"
```

**Commit scope:** The record file + `native/index.ts` only. No other files.

---

## Wave Definitions

### Wave 1 — Bestsellers

**Purpose:** Replace adapter knowledge for the highest-traffic fragrances — those most likely to be recommended by the Concierge, most frequently viewed, and most conversion-critical.

**Priority:** Highest. Wave 1 should be completed before any Wave 2–7 records are authored.

**Status:** In progress — 5 of 19 bestsellers are native. 14 remaining.

**Current status:** 14 records remaining

**Dependencies:** None. Wave 1 records can be authored in any order within the wave. Authors should consult `docs/mkc-authoring-guide.md` for collection-specific guidance (Skye vs Rose).

**Expected outcome:** Every bestseller recommendation in the Concierge is backed by native Intelligence scores, authored descriptions, and Academy links. Bestseller Coverage reaches 100%.

**Definition of Done:**
- ✅ All 19 bestsellers are native records
- ✅ All pass `mkc:validate` with status PASS
- ✅ `npm run mkc:coverage` shows Bestseller Coverage: 100%
- ✅ Build passes

**Remaining records (14):**

*Skye (6):*
- Ultra Male Inspired
- Sauvage Elixir Inspired
- Y EDP Inspired
- Naxos Inspired
- Side Effect Inspired
- God Of Fire Inspired

*Rose (8) — first Rose records to author:*
- Miss Dior Inspired
- Delina Inspired
- Baccarat Rouge 540 Inspired
- Delina Exclusif Inspired
- Hypnotic Poison Inspired
- Love Don't Be Shy Inspired
- Bianco Latte Inspired
- Vanilla 28 Inspired

**Authoring guidance for Wave 1 Rose records:**
- Consult the Rose editorial direction in `docs/mkc-authoring-guide.md` before authoring the first Rose record
- Baccarat Rouge 540 Inspired → `gender: "unisex"` (original is officially unisex)
- All others → `gender: "female"`
- Use at least 2 vibes from the Rose & Elite vocabulary group

---

### Wave 2 — Skye Signature

**Purpose:** Author the mainstream Skye designer references — high-familiarity masculines with strong purchase intent and Concierge recommendation frequency.

**Priority:** High. These are the fragrances most likely to be recommended for everyday masculine discovery.

**Status:** Not started — 0 records authored

**Current record count:** 18 records

**Dependencies:** Wave 1 completion recommended before starting Wave 2. At minimum, all 6 remaining Skye Wave 1 bestsellers should be complete before Wave 2 begins, to establish authoring consistency for the Skye collection.

**Expected outcome:** All mainstream Skye designer fragrances have native knowledge, enabling accurate Concierge retrieval across the full masculine discovery range.

**Definition of Done:**
- ✅ All 18 records authored and PASS
- ✅ Skye native coverage reaches ~73% (35/48)
- ✅ Build passes

**Records (18):**
Imagination Inspired, Le Male Elixir Inspired, Stronger With You Inspired, Oud Wood Inspired, Invictus Inspired, 1 Million Inspired, Hawas Inspired, 9PM Inspired, Stronger With You Intensely Inspired, Le Beau Paradise Garden Inspired, Azzaro Most Wanted Inspired, Valentino Uomo Born In Roma Inspired, MYSLF Inspired, Acqua Di Gio Profondo Inspired, Acqua Di Gio Parfum Inspired, Prada Luna Rossa Carbon Inspired, Invictus Victory Inspired, Armani Code Parfum Inspired

---

### Wave 3 — Fresh Collection (Skye)

**Purpose:** Author the aquatic, citrus-forward, and light aromatic Skye fragrances that are the primary targets for Concierge "fresher option" exploration requests.

**Priority:** Medium. These are the alternatives most frequently explored when a customer asks to go fresher or lighter.

**Status:** Not started — 0 records authored

**Current record count:** 4 records

**Dependencies:** Wave 2 recommended first, to establish Intelligence calibration consistency for the Skye fresh/light range.

**Expected outcome:** Alternative exploration engine always has native candidates when a customer explores a `Fresh & Light` alternative.

**Definition of Done:**
- ✅ All 4 records authored and PASS
- ✅ At least 3 records have `scentCharacter: "Fresh & Light"`
- ✅ Build passes

**Records (4):**
Creed Green Irish Tweed Inspired, Silver Mountain Water Inspired, Afternoon Swim Inspired, Pacific Chill Inspired

---

### Wave 4 — Warm & Niche Skye

**Purpose:** Author the warm oriental, tobacco, oud, and niche-house Skye fragrances — specialist records requiring more careful Intelligence calibration than the mainstream range.

**Priority:** Medium.

**Status:** Not started — 0 records authored

**Current record count:** 9 records

**Dependencies:** Wave 1 and Wave 2 completion, to have a well-calibrated Intelligence reference before authoring the most extreme warm/intense Skye records.

**Expected outcome:** The full Skye warm collection has native knowledge. `Deep & Intense` and `Rich & Long Wearing` characters have strong coverage.

**Definition of Done:**
- ✅ All 9 records authored and PASS
- ✅ Skye native coverage reaches 100% (48/48)
- ✅ Build passes

**Records (9):**
Carlisle Inspired, Althair Inspired, Ombre Nomade Inspired, Torino21 Inspired, Erba Pura Inspired, Oud For Greatness Inspired, Ani Inspired, L'immensite Inspired, Arabians Tonka Inspired

---

### Wave 5 — Rose Collection

**Purpose:** Author all remaining Rose fragrances (32 records after Wave 1). This is the largest single wave and introduces the Rose editorial voice at scale.

**Priority:** Medium-High. Rose is 43% of the catalogue and currently has zero native records. Even partial Wave 5 completion meaningfully improves Rose collection Concierge quality.

**Status:** Not started — 0 records authored (Wave 1 Rose bestsellers are pre-Wave 5 and tracked there)

**Current record count:** 32 records

**Dependencies:** Wave 1 Rose bestsellers must be completed first. They establish the Rose editorial calibration before the remainder of the collection is authored. Do not start Wave 5 until all 8 Wave 1 Rose records are PASS.

**Expected outcome:** Complete Rose collection native coverage. Rose Intelligence calibration is established. Feminine vibe vocabulary is fully exercised.

**Definition of Done:**
- ✅ All 32 records authored and PASS
- ✅ Rose native coverage reaches 100% (40/40)
- ✅ Every record uses Rose-appropriate vibe vocabulary
- ✅ Intelligence scores are calibrated relative to Wave 1 Rose anchors
- ✅ Build passes

**Authoring guidance:**
- Complete `docs/mkc-authoring-guide.md` Rose collection section before authoring Wave 5
- After the first 4–5 Wave 5 Rose records, run `npm run mkc:coverage` to verify quality metrics before continuing
- Suggest authoring in sub-groups by character: floral light → balanced chypre → gourmand oriental → deep/intense

---

### Wave 6 — Elite Collection

**Purpose:** Author the Elite collection — 5 premium unisex fragrances requiring specialist editorial treatment.

**Priority:** Lower. Elite is a small collection (5 records) with lower consultation frequency than Skye or Rose. Quality is more important than speed for these records.

**Status:** Not started — 0 records authored

**Current record count:** 5 records

**Dependencies:** Wave 1 completion. Elite records benefit from established Intelligence calibration but do not depend on Rose or Skye wave completion.

**Expected outcome:** All Elite fragrances have native knowledge with appropriately restrained, luxury-first editorial copy.

**Definition of Done:**
- ✅ All 5 records authored and PASS
- ✅ All records use `gender: "unisex"`
- ✅ `versatility` scores reflect specialist character (most Elite records: 2–3)
- ✅ Build passes

**Records (5):**
Hibiscus Mahajad Inspired, Oud Mood Inspired, Gris Charnel Inspired, Kirke Overdose Inspired, Haltane Inspired

---

### Wave 7 — Complete Coverage

**Purpose:** Verify 100% native coverage, run final quality audit, and confirm migration complete.

**Priority:** Completion milestone — triggered when Waves 1–6 are done.

**Status:** Not started

**Current record count:** 0 remaining (this wave is a verification milestone, not an authoring wave)

**Dependencies:** All 82 remaining records authored (Waves 1–6 complete).

**Expected outcome:** `npm run mkc:coverage` reports 100% across all metrics. Adapter can be deprecated at this point (no active records depend on it).

**Definition of Done:**
- ✅ `npm run mkc:coverage` → Native Coverage: 100.0% (93/93)
- ✅ `npm run mkc:validate` → all 93 records PASS
- ✅ `npm run build` → clean
- ✅ Knowledge adapter is no longer the fallback for any active record

---

## Progress Summary

| Wave | Description | Total | Native | Remaining | Status |
|---|---|---|---|---|---|
| 1 | Bestsellers | 19 | 5 | 14 | In progress |
| 2 | Skye Signature | 18 | 0 | 18 | Not started |
| 3 | Skye Fresh | 4 | 0 | 4 | Not started |
| 4 | Skye Warm & Niche | 9 | 0 | 9 | Not started |
| 5 | Rose Collection | 32 | 0 | 32 | Not started |
| 6 | Elite Collection | 5 | 0 | 5 | Not started |
| 7 | Complete Coverage | — | — | — | Pending |
| | **Total** | **93** | **11** | **82** | **11.8%** |

Run `npm run mkc:coverage` for the live dashboard — this table is updated manually at milestone boundaries.

---

## Target Coverage

| Milestone | Records | Coverage |
|---|---|---|
| Wave 1 complete | 19 native | 20.4% |
| Wave 1–2 complete | 37 native | 39.8% |
| Wave 1–3 complete | 41 native | 44.1% |
| Wave 1–4 complete | 50 native | 53.8% |
| Wave 1–5 complete | 82 native | 88.2% |
| Wave 1–6 complete | 87 native | 93.5% |
| Wave 7 verified | 93 native | 100.0% |

---

## Editorial References

- Authoring guide: `docs/mkc-authoring-guide.md`
- Intelligence calibration table: `docs/mkc-authoring-guide.md#intelligence`
- Collection editorial standards: `docs/mkc-authoring-guide.md#collection-specific-editorial-standards`
- Vocabulary governance: `docs/mkc-authoring-guide.md#vocabulary-governance`
- Scaffold generator: `scripts/mkc-scaffold.ts`
- Validator: `validate-native-records.ts`
- Coverage dashboard: `scripts/mkc-coverage.ts`

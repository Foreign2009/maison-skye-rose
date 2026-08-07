# Current Task — Maison Skye & Rose

**Update this file at the start of every task.**
**Clear it when the task is complete.**

---

## How to Use This File

At the start of a new Claude Code session:
1. Update the fields below with the task you are working on
2. Load `.ai/AI_CONTEXT.md` for project orientation
3. Load `.ai/BUSINESS_RULES.md` if the task touches cart, pricing, or rewards
4. Load `.ai/KNOWN_ISSUES.md` if the task touches a known problem area
5. Read the specific source files listed under "Files Involved"

---

## Current Task

**Status:** Complete
**Program:** EP4-P3BR — Correct Home Fragrance Quality Boundary

**Goal:**
Establish the scaffold → validate → draft chain for Home Fragrance knowledge:
`validateHomeFragranceRecord()`, `mergeHomeFragrance()`, and
`buildHomeFragranceDraft()` (pure string render). No AI. No producers.
No ProducerSet. No promotion. No orchestrator extension beyond current gate.

**Acceptance Criteria:**
- [x] `validateHomeFragranceRecord(record: HomeFragranceKnowledge): ValidationResult` created
- [x] Reuses `ValidationIssue`, `ValidationResult` types (category-neutral)
- [x] Groups applied: identity, composition, editorial, discovery, commerce
- [x] Groups returned as PASS: classification, intelligence, relationships
- [x] Foundation quality: 0 notes = error, 1 note = warning, 2+ = pass
- [x] Discovery arrays empty = warnings (not errors) at scaffold stage
- [x] Missing description = warning (not error)
- [x] `mergeHomeFragrance(scaffold, ...results): HomeFragranceKnowledge` created
- [x] Failed producer results skipped in merge
- [x] `buildHomeFragranceDraft(record, validationResult): string` created — pure render, no file writes
- [x] Dynamic variant key iteration for prices/images (no hardcoded "5ml"/"10ml"/"30ml")
- [x] Draft imports `HomeFragranceKnowledge`, not `FragranceKnowledge`
- [x] Draft has no collection, gender, projection, scentCharacter, sweetness fields
- [x] Home Fragrance-specific review checklist in draft header
- [x] Validation script extended from 27 to 52 proofs (scaffold → validate → draft chain)
- [x] 52 proofs pass (`npm run mkc:validate:home-fragrance`)
- [x] Build passes: 187 routes, 0 TypeScript errors, 0 warnings
- [x] `PROJECT_STATUS.md` updated
- [x] `.ai/CURRENT_TASK.md` updated
- [x] `.ai/ENGINEERING_LOG.md` updated

**Why This Task:**
EP4-P3A established the typed contracts. EP4-P3B establishes the quality gates
and the pure rendering contract. These are the two things required before any
Home Fragrance AI producer (EP4-P3C onwards) can run: a validator to assess
the merged record, and a draft builder to render the author review file.

---

## Files Involved

**Files created (3):**
- `app/lib/mkc/homeFragranceValidator.ts` — `validateHomeFragranceRecord()`
- `scripts/factory/homeFragranceMerger.ts` — `mergeHomeFragrance()`
- `scripts/factory/HomeFragranceDraftBuilder.ts` — `buildHomeFragranceDraft()`

**Files modified (2):**
- `scripts/factory/validate-home-fragrance.ts` — Extended from 27 to 52 proofs
- `PROJECT_STATUS.md` — EP4-P3B entry added

**Files NOT modified:**
- `app/lib/mkc/homeFragranceTypes.ts` — `HomeFragranceKnowledge` unchanged
- `app/lib/mkc/types.ts` — `FragranceKnowledge` unchanged
- `app/lib/mkc/validator.ts` — Fragrance validator unchanged
- `scripts/factory/homeFragranceScaffold.ts` — Unchanged
- `scripts/factory/merger.ts` — Fragrance merger unchanged
- `scripts/factory/draftBuilder.ts` — Fragrance draft builder unchanged
- `scripts/factory/orchestrator.ts` — Unchanged
- `scripts/factory/core/types.ts` — Unchanged
- `scripts/factory/core/HomeFragranceContextBuilder.ts` — Unchanged
- All 5 fragrance producers — Unchanged
- All fragrance prompts — Unchanged
- All 93 native MKC records — Unchanged
- All application code — Unchanged

---

## Context Notes

**Last completed:** EP4-P3B — Home Fragrance Draft & Validation Foundation (2026-08-07)

Recent completed programs (newest first):
- EP4-P3B Home Fragrance Draft & Validation Foundation (2026-08-07) — validator, merger, draft builder; 52 proofs pass
- EP4-P3A Home Fragrance Production Type Foundation (2026-08-07) — Type contracts for HomeFragranceKnowledge, context, producer result; 27 proofs pass
- EP4-P3 Home Fragrance Producer Strategy Audit (2026-08-07) — 22-deliverable audit; recommended Option B (Composition + Editorial) for first ProducerSet
- EP4-P2R Correct Home Fragrance Foundation (2026-08-06) — Removed unsafe casts; introduced HomeFragranceScaffoldOutput; added validation script
- EP4-P2 Home Fragrance Foundation (2026-08-06) — HomeFragranceIntake; union expansion; registry wiring (defects corrected in EP4-P2R)

---

## Constraints

_Task closed._

---

## Context Notes

**Last completed:** EP4-P3A — Home Fragrance Production Type Foundation (2026-08-07)

Recent completed programs (newest first):
- EP4-P3A Home Fragrance Production Type Foundation (2026-08-07) — Type contracts for HomeFragranceKnowledge, context, producer result; 27 proofs pass
- EP4-P3 Home Fragrance Producer Strategy Audit (2026-08-07) — 22-deliverable audit; recommended Option B (Composition + Editorial) for first ProducerSet
- EP4-P2R Correct Home Fragrance Foundation (2026-08-06) — Removed unsafe casts; introduced HomeFragranceScaffoldOutput; added validation script
- EP4-P2 Home Fragrance Foundation (2026-08-06) — HomeFragranceIntake; union expansion; registry wiring (defects corrected in EP4-P2R)
- EP4-P1 First Multi-Category Product Strategy Audit (2026-08-06) — 20-deliverable strategic audit; Home Fragrance selected as first second category

---

## Plan

_N/A_

---

## Build Result

**Last build:** 2026-08-07 — Pass. Zero TypeScript errors. Zero warnings. 187 routes. (EP4-P3A)

---

## Suggested Commit Message

EP4-P3A — Home Fragrance Production Type Foundation

---

## Example (Filled In)

```
Status: In Progress
Program: SEO-001

Goal: Add sitemap.ts to enumerate all product and collection pages for Google indexing.

Acceptance Criteria:
- [ ] app/sitemap.ts returns all product URLs from fragrances.ts
- [ ] app/sitemap.ts returns collection, shop, and static page URLs
- [ ] Build passes with zero TypeScript errors
- [ ] Sitemap accessible at /sitemap.xml in local dev

Why: Search engines cannot discover product pages without a sitemap (KI-08).

Files to modify: app/sitemap.ts (new file)
Files NOT to modify: fragrances.ts, layout.tsx, any existing page

Constraints: Use Next.js 16 App Router sitemap format (MetadataRoute.Sitemap).
```

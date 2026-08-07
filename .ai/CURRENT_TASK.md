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
**Program:** EP4-P3A — Home Fragrance Production Type Foundation

**Goal:**
Introduce the truthful typed production contracts for Home Fragrance knowledge
without building any producers, prompts, or AI generation capability.

**Acceptance Criteria:**
- [x] `HomeFragranceKnowledge` defined in `app/lib/mkc/homeFragranceTypes.ts`
- [x] `HomeFragranceKnowledge` has no collection, gender, projection, scentCharacter, occasions, intelligence metrics, or fragrance size contracts
- [x] `HomeFragranceKnowledge` is NOT structurally assignable to `FragranceKnowledge`
- [x] `HomeFragranceScaffoldResult` defined in `scripts/factory/types.ts`
- [x] `HomeFragrancePipelineState` defined in `scripts/factory/types.ts`
- [x] `HomeFragranceFactoryContext` defined in `scripts/factory/core/types.ts` (no collection, displayFrag, nativeFragrances)
- [x] `HomeFragranceProducerResult` defined in `scripts/factory/core/types.ts` (fields: Partial<HomeFragranceKnowledge>)
- [x] `HomeFragranceContextBuilder` created — builds context from pipeline state
- [x] `scaffoldHomeFragrance()` returns `HomeFragranceScaffoldResult` (not `HomeFragranceScaffoldOutput`)
- [x] Discovery arrays initialised empty in scaffold (vibe, seasons, signatureStyle, recommendedFor)
- [x] Orchestrator branches for home-fragrance before ScaffoldRegistry — calls `scaffoldHomeFragrance()` directly
- [x] Orchestrator returns clean `"failed"` for home-fragrance (no ProducerSet registered message)
- [x] ScaffoldRegistry home-fragrance registration removed (was dead code)
- [x] No HomeFragranceBaseProducer created
- [x] No producers, prompts, or AI generation created
- [x] No draft builder created
- [x] No promotion capability created
- [x] Fragrance pipeline structurally and behaviourally unchanged
- [x] Deterministic validation: 27 proofs pass (`npm run mkc:validate:home-fragrance`)
- [x] Build passes: 187 routes, 0 TypeScript errors, 0 warnings
- [x] `PROJECT_STATUS.md` updated
- [x] `.ai/CURRENT_TASK.md` updated
- [x] `.ai/ENGINEERING_LOG.md` updated

**Why This Task:**
EP4-P3 audit established that Home Fragrance cannot safely enter the existing
fragrance production stack because `FactoryContext`, `ProducerResult.fields`,
`merger.ts`, and `draftBuilder.ts` are materially fragrance-specific.
EP4-P3A introduces the truthful typed boundary from which home fragrance AI
generation can later be built safely (EP4-P3C onwards).

---

## Files Involved

**Files created (2):**
- `app/lib/mkc/homeFragranceTypes.ts` — `HomeFragranceKnowledge` type
- `scripts/factory/core/HomeFragranceContextBuilder.ts` — `HomeFragranceContextBuilder`

**Files modified (5):**
- `scripts/factory/core/types.ts` — Added `HomeFragranceFactoryContext`, `HomeFragranceProducerResult`; imported `HomeFragranceKnowledge`
- `scripts/factory/types.ts` — Added `HomeFragranceScaffoldResult`, `HomeFragrancePipelineState`; imported `HomeFragranceKnowledge`, `HomeFragranceProducerResult`
- `scripts/factory/homeFragranceScaffold.ts` — Returns `HomeFragranceScaffoldResult`; discovery arrays initialised empty; removed `HomeFragranceScaffoldOutput` interface
- `scripts/factory/orchestrator.ts` — Home-fragrance branch added before ScaffoldRegistry; `scaffoldHomeFragrance` re-imported; ScaffoldRegistry home-fragrance registration removed
- `scripts/factory/validate-home-fragrance.ts` — Extended from 15 to 27 proofs

**Files NOT modified:**
- `app/lib/mkc/types.ts` — `FragranceKnowledge` unchanged
- `scripts/factory/scaffold.ts` — Fragrance scaffold unchanged
- `scripts/factory/merger.ts` — Fragrance merger unchanged
- `scripts/factory/draftBuilder.ts` — Fragrance draft builder unchanged
- `scripts/factory/core/BaseProducer.ts` — Unchanged
- `scripts/factory/core/ContextBuilder.ts` — Unchanged
- `scripts/factory/core/ProducerRegistry.ts` — Unchanged
- `scripts/factory/core/ScaffoldRegistry.ts` — Unchanged
- All 5 fragrance producers — Unchanged
- All fragrance prompts — Unchanged
- All 93 native MKC records — Unchanged
- All application code — Unchanged

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

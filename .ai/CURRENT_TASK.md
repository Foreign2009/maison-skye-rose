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
**Program:** EP4-P2R — Correct Home Fragrance Foundation

**Goal:**
Correct three architectural defects from EP4-P2:
1. Remove all unchecked `as FragranceIntake` / `as HomeFragranceIntake` type assertions
2. Replace fabricated `FragranceKnowledge` values in the home fragrance scaffolder with
   a truthful `HomeFragranceScaffoldOutput` type containing only genuinely derivable fields
3. Prove the home-fragrance registry wiring with a deterministic validation script

**Acceptance Criteria:**
- [x] All `as FragranceIntake` / `as HomeFragranceIntake` assertions removed from orchestrator.ts
- [x] All `as FragranceIntake` assertion removed from promotionManager.ts
- [x] `HomeFragranceScaffoldOutput` interface defined — no `collection`, `gender`, `projection`, no fragrance size keys
- [x] `scaffoldHomeFragrance()` returns `HomeFragranceScaffoldOutput` — all fields derived truthfully from intake
- [x] Fragrance scaffolder registration uses discriminant narrowing (`intake.category !== "fragrance"`)
- [x] Home fragrance scaffolder registration uses discriminant narrowing + throws "knowledge record type not yet defined"
- [x] Promotion manager uses explicit category guard + returns `rejected` for non-fragrance
- [x] `scripts/factory/validate-home-fragrance.ts` created — 15 deterministic proofs, no AI, no writes
- [x] `npm run mkc:validate:home-fragrance` — all 15 proofs pass
- [x] Fragrance pipeline unchanged
- [x] No guest-facing behaviour changes
- [x] No native MKC records modified
- [x] Build passes: 187 routes, 0 TypeScript errors, 0 warnings
- [x] `PROJECT_STATUS.md` updated
- [x] `.ai/CURRENT_TASK.md` updated
- [x] `.ai/ENGINEERING_LOG.md` updated

**Why This Task:**
EP4-P2 introduced three defects: unchecked type assertions, fabricated `FragranceKnowledge`
values in the home fragrance scaffolder (collection: "Elite", gender: "unisex", prices: 5ml/0),
and no runtime proof of the registry wiring. EP4-P2R corrects all three.

---

## Files Involved

**Files created (1):**
- `scripts/factory/validate-home-fragrance.ts` — Deterministic foundation proof script

**Files modified (3):**
- `scripts/factory/homeFragranceScaffold.ts` — Complete rewrite: `HomeFragranceScaffoldOutput` type; truthful scaffolder; no `FragranceKnowledge` import
- `scripts/factory/orchestrator.ts` — Discriminant narrowing in both scaffolder registrations; `productIntake` narrowing replaces both `as FragranceIntake` casts; `scaffoldHomeFragrance` import removed
- `scripts/factory/promotion/promotionManager.ts` — Explicit category guard; `productIntake` narrowing replaces `as FragranceIntake` cast; `FragranceIntake` import removed

**Files NOT modified:**
- `scripts/factory/types.ts` — `HomeFragranceIntake`, `ProductIntake` union unchanged
- `scripts/factory/intake.ts` — Catalogue registration unchanged
- `scripts/factory/scaffold.ts` — Fragrance scaffold logic unchanged
- All registries — unchanged
- All 5 producers — unchanged
- All application code — unchanged
- All 93 native MKC records — unchanged

---

## Constraints

_Task closed._

---

## Context Notes

**Last completed:** EP4-P2R — Correct Home Fragrance Foundation (2026-08-06)

Recent completed programs (newest first):
- EP4-P2R Correct Home Fragrance Foundation (2026-08-06) — Removed unsafe casts; introduced HomeFragranceScaffoldOutput; added validation script
- EP4-P2 Home Fragrance Foundation (2026-08-06) — HomeFragranceIntake; union expansion; registry wiring (defects corrected in EP4-P2R)
- EP4-P1 First Multi-Category Product Strategy Audit (2026-08-06) — 20-deliverable strategic audit; Home Fragrance selected as first second category
- EP3-P7 Factory Integrity Hardening (2026-08-06) — ProducerRegistry duplicate guard; single FACTORY_VERSION; single deriveSlug

---

## Plan

_N/A_

---

## Build Result

**Last build:** 2026-08-06 — Pass. Zero TypeScript errors. Zero warnings. 187 routes. (EP4-P2R)

---

## Suggested Commit Message

_N/A_

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

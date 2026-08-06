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
**Program:** EP4-P2 — Home Fragrance Foundation

**Goal:**
Introduce Home Fragrance as the factory's first real second category at the foundation level.
After this episode the factory recognises home-fragrance, resolves intake, resolves scaffold,
and blocks cleanly at producer resolution with a clear error.

**Acceptance Criteria:**
- [x] `HomeFragranceIntake` defined in `scripts/factory/types.ts`
- [x] `ProductIntake` expanded to `FragranceIntake | HomeFragranceIntake` (proper discriminated union)
- [x] Home fragrance catalogue loader registered in `defaultCatalogueRegistry` (empty — returns null)
- [x] `scripts/factory/homeFragranceScaffold.ts` created
- [x] Home fragrance scaffolder registered in `defaultScaffoldRegistry`
- [x] No producer set registered for home-fragrance (intentional)
- [x] Factory throws "No ProducerSet registered for category: home-fragrance" before AI generation
- [x] Fragrance pipeline unchanged
- [x] No guest-facing behaviour changes
- [x] No native MKC records modified
- [x] Build passes: 187 routes, 0 TypeScript errors, 0 warnings
- [x] `PROJECT_STATUS.md` updated
- [x] `.ai/CURRENT_TASK.md` updated
- [x] `.ai/ENGINEERING_LOG.md` updated

**Why This Task:**
EP4-P1 identified Home Fragrance as the optimal first second category — maximum producer
reuse, shared olfactory vocabulary, lowest intake complexity, natural fit for the Maison brand.
EP4-P2 establishes the foundation so EP4-P3 can introduce prompt calibration and the first
home fragrance draft generation.

---

## Files Involved

**Files created (1):**
- `scripts/factory/homeFragranceScaffold.ts` — Home fragrance scaffolder

**Files modified (4):**
- `scripts/factory/types.ts` — HomeFragranceIntake added; ProductIntake union expanded
- `scripts/factory/intake.ts` — Home fragrance loader registered; intake() discriminates for non-fragrance collection/source
- `scripts/factory/orchestrator.ts` — Home fragrance scaffolder registered; fragrance scaffolder cast updated
- `scripts/factory/promotion/promotionManager.ts` — Type cast added for scaffold() call (union expansion cascade fix)

**Files NOT modified:**
- `scripts/factory/scaffold.ts` — Fragrance scaffold logic unchanged
- `scripts/factory/core/CatalogueRegistry.ts` — Generic registry, unchanged
- `scripts/factory/core/ScaffoldRegistry.ts` — Generic registry, unchanged
- `scripts/factory/core/ProducerRegistry.ts` — No producer registered for home-fragrance (by design)
- All 5 producers — unchanged
- `app/lib/mkc/types.ts` — ProductCategory already contained "home-fragrance"
- All application code — unchanged
- All 93 native MKC records — unchanged

---

## Constraints

_Task closed._

---

## Context Notes

**Last completed:** EP4-P2 Home Fragrance Foundation (2026-08-06)

Recent completed programs (newest first):
- EP4-P1 First Multi-Category Product Strategy Audit (2026-08-06) — 20-deliverable strategic audit; Home Fragrance selected as first second category
- EP3-P7 Factory Integrity Hardening (2026-08-06) — ProducerRegistry duplicate guard; single FACTORY_VERSION; single deriveSlug
- EP3-P6 Registry-Driven Factory Stability Audit (2026-08-06) — 20-deliverable read-only audit; confirmed stability; 3 required fixes identified
- EP3-P5B Scaffold Resolution Foundation (2026-08-06) — ScaffoldRegistry created; orchestrator fully registry-driven

---

## Plan

_N/A_

---

## Build Result

**Last build:** 2026-08-06 — Pass. Zero TypeScript errors. Zero warnings. 187 routes. (EP4-P2)

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

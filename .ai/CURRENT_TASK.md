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
**Program:** EP3-P7 — Factory Integrity Hardening

**Goal:**
Resolve three small integrity inconsistencies identified in the EP3-P6 audit before a second product category is introduced:
1. ProducerRegistry silently overwrote duplicate category registrations.
2. FACTORY_VERSION was duplicated across orchestrator, LifecycleScanner, and DashboardService.
3. DashboardService maintained a local duplicate of the canonical deriveSlug() function.

**Acceptance Criteria:**
- [x] `ProducerRegistry.register()` throws on duplicate category registration
- [x] Error message matches the style of CatalogueRegistry and ScaffoldRegistry
- [x] `scripts/factory/version.ts` created with `export const FACTORY_VERSION = "0.5.0"`
- [x] `orchestrator.ts` imports FACTORY_VERSION from `./version` and re-exports it
- [x] `LifecycleScanner.ts` imports FACTORY_VERSION from `../version`
- [x] `DashboardService.ts` imports FACTORY_VERSION from `../version`
- [x] No stale FACTORY_VER or CURRENT_FACTORY_VERSION literals remain
- [x] `scripts/factory/core/deriveSlug.ts` created with canonical implementation
- [x] `intake.ts` imports from `./core/deriveSlug` and re-exports (preserving BatchQueue + LifecycleScanner callers)
- [x] `DashboardService.ts` imports deriveSlug from `../core/deriveSlug`; local function removed
- [x] No duplicate `function deriveSlug` definition exists anywhere in factory scripts
- [x] `BatchFactory.ts` import of FACTORY_VERSION from `../orchestrator` remains valid
- [x] `BatchQueue.ts` import of deriveSlug from `../intake` remains valid
- [x] `LifecycleScanner.ts` import of deriveSlug from `../intake` remains valid
- [x] Build passes: 187 routes, 0 TypeScript errors, 0 warnings
- [x] `PROJECT_STATUS.md` updated
- [x] `.ai/CURRENT_TASK.md` updated
- [x] `.ai/ENGINEERING_LOG.md` updated

**Why This Task:**
Three small integrity gaps identified in EP3-P6 were confirmed by repository inspection. All three were safe to fix before a second product category is registered, preventing silent configuration drift, version staleness, and slug-derivation divergence.

---

## Files Involved

**Files created (2):**
- `scripts/factory/version.ts` — Single FACTORY_VERSION export
- `scripts/factory/core/deriveSlug.ts` — Single deriveSlug() export

**Files modified (5):**
- `scripts/factory/core/ProducerRegistry.ts` — Duplicate guard added to register()
- `scripts/factory/orchestrator.ts` — Imports FACTORY_VERSION from ./version; re-exports it
- `scripts/factory/intake.ts` — Imports deriveSlug from ./core/deriveSlug; re-exports it
- `scripts/factory/lifecycle/LifecycleScanner.ts` — Imports FACTORY_VERSION from ../version
- `scripts/factory/dashboard/DashboardService.ts` — Imports FACTORY_VERSION and deriveSlug from canonical sources

**Files NOT modified:**
- `scripts/factory/batch/BatchQueue.ts` — imports deriveSlug from ../intake (preserved via re-export)
- `scripts/factory/batch/BatchFactory.ts` — imports FACTORY_VERSION from ../orchestrator (preserved via re-export)
- All 5 producers — unchanged
- All promotion, review, batch runner files — unchanged
- All application code — unchanged
- All 93 native MKC records — unchanged

---

## Constraints

_Task closed._

---

## Context Notes

**Last completed:** EP3-P7 Factory Integrity Hardening (2026-08-06)

Recent completed programs (newest first):
- EP3-P6 Registry-Driven Factory Stability Audit (2026-08-06) — 20-deliverable read-only audit; confirmed stability; identified 3 required fixes
- EP3-P5B Scaffold Resolution Foundation (2026-08-06) — ScaffoldRegistry created; orchestrator fully registry-driven
- EP3-P5A Category-Bearing Factory Intake (2026-08-06) — ProductIntake, CatalogueRegistry, IntakeResult.intake introduced
- EP3-P4 Multi-Category Factory Intake Architecture Audit (2026-08-06) — 20-deliverable read-only audit

---

## Plan

_N/A_

---

## Build Result

**Last build:** 2026-08-06 — Pass. Zero TypeScript errors. Zero warnings. 187 routes. (EP3-P7)

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

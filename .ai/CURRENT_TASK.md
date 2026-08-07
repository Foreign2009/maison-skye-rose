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
**Program:** EP4-P3CR — Home Fragrance Producer Safety Hardening

**Goal:**
Resolve four production safety issues before EP4-P3D real AI generation:
1. Cross-tier duplicate notes → error (was warning)
2. Max-notes-per-tier boundary enforced (≤ 4 per tier)
3. Untrusted AI JSON structurally validated at runtime in parse()
4. Failed/degraded producer output stops pipeline and is skipped in merger
Plus: HomeFragranceProducerRegistry for type-safe registry-driven producer selection.
Extend validate script from 109 to 123 proofs.

**Acceptance Criteria:**
- [x] Cross-tier duplicate promoted to error → `HF_COMP_CROSS_TIER_DUPLICATE` in errors, result `degraded`
- [x] Max-4 per tier enforced: `HF_COMP_NOTES_TOP_MAX`, `HF_COMP_NOTES_HEART_MAX`, `HF_COMP_NOTES_BASE_MAX`
- [x] `parseStringArray()` helper throws on missing tier, non-array, non-string element
- [x] `HomeFragranceCompositionProducer.parse()` validates root type before constructing fields
- [x] `HomeFragranceEditorialProducer.parse()` validates root type and field types before constructing fields
- [x] Pipeline breaks on `failed` or `degraded`; merges only on `success`
- [x] Merger skips both `failed` and `degraded` results
- [x] `HomeFragranceProducerRegistry` created (parallel to `ProducerRegistry`, typed to `HomeFragranceProducerSet`)
- [x] Registry not registered in production `defaultRegistry` (proof 23 preserved)
- [x] Validate script extended from 109 to 123 proofs — all pass
- [x] Build passes: 187 routes, 0 TypeScript errors, 0 warnings
- [x] `PROJECT_STATUS.md` updated
- [x] `.ai/CURRENT_TASK.md` updated
- [x] Commit created

---

## Files Involved

**Files created (1):**
- `scripts/factory/core/HomeFragranceProducerRegistry.ts` — type-safe registry for HomeFragranceProducerSet

**Files modified (5):**
- `scripts/factory/producers/HomeFragranceCompositionProducer.ts` — runtime parse + max-4 + cross-tier error
- `scripts/factory/producers/HomeFragranceEditorialProducer.ts` — runtime parse + field type guards
- `scripts/factory/homeFragrancePipeline.ts` — stop on failed/degraded, merge only on success
- `scripts/factory/homeFragranceMerger.ts` — skip degraded results (was: skip failed only)
- `scripts/factory/validate-home-fragrance.ts` — proofs 104/105 updated, proofs 110-123 added

**Files NOT modified:**
- `app/lib/mkc/homeFragranceTypes.ts` — `HomeFragranceKnowledge` unchanged
- `app/lib/mkc/homeFragranceValidator.ts` — unchanged
- `scripts/factory/homeFragranceScaffold.ts` — unchanged
- `scripts/factory/HomeFragranceDraftBuilder.ts` — unchanged
- `scripts/factory/orchestrator.ts` — unchanged (proof 23 preserved: defaultRegistry still rejects home-fragrance)
- `scripts/factory/core/ProducerRegistry.ts` — unchanged (no HomeFragranceBaseProducer ever registered)
- All 5 fragrance producers — unchanged
- All 93 native MKC records — unchanged
- All application code — unchanged

---

## Context Notes

**Last completed:** EP4-P3CR — Home Fragrance Producer Safety Hardening (2026-08-07)

Recent completed programs (newest first):
- EP4-P3CR Home Fragrance Producer Safety Hardening (2026-08-07) — 4 safety issues + registry; 123 proofs pass
- EP4-P3C Home Fragrance Producer Foundation (2026-08-07) — Composition + Editorial producers; 109 proofs pass
- EP4-P3BR Correct Home Fragrance Quality Boundary (2026-08-07) — merger type assertion, draft truthfulness, canonical slug
- EP4-P3B Home Fragrance Draft & Validation Foundation (2026-08-07) — validator, merger, draft builder; 52 proofs pass
- EP4-P3A Home Fragrance Production Type Foundation (2026-08-07) — Type contracts; 27 proofs pass

---

## Constraints

Task closed. Next: EP4-P3D — First Real AI Generation.
Safety constraints for EP4-P3D: NO PAID AI in validate script. NO REAL HOME FRAGRANCE PRODUCT. NO PERSISTENT DRAFT. NO PROMOTION.

---

## Build Result

**Last build:** 2026-08-07 — Pass. Zero TypeScript errors. Zero warnings. 187 routes. (EP4-P3CR)

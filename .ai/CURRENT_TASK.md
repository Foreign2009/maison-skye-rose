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
**Program:** EP3-P5B — Scaffold Resolution Foundation

**Goal:**
Make scaffold selection registry-driven. Introduce ScaffoldRegistry with one registered fragrance scaffolder. The orchestrator resolves scaffolders by intake category rather than directly calling scaffold(). Both ScaffoldRegistry and ProducerRegistry resolve from the same authoritative intake category.

**Acceptance Criteria:**
- [x] `ScaffoldRegistry` created in `scripts/factory/core/ScaffoldRegistry.ts`
- [x] `CategoryScaffolder = (intake: ProductIntake) => ScaffoldResult` — fully type-safe with current union
- [x] One fragrance scaffolder registered via `defaultScaffoldRegistry` in `orchestrator.ts`
- [x] Registered fragrance scaffolder calls existing `scaffold()` — behaviour unchanged
- [x] `defaultScaffoldRegistry.getScaffolder(resolvedCategory)` replaces direct `scaffold(result.intake!)` in pipeline
- [x] ScaffoldRegistry and ProducerRegistry both resolve from `resolvedCategory` (same authoritative source)
- [x] Promotion decision: Option A — `promotionManager.ts` stays calling `scaffold()` directly (fragrance-only)
- [x] Duplicate category registration throws clearly
- [x] Missing scaffolder throws clearly before any AI generation
- [x] No new categories, no new scaffolders
- [x] All 5 producers unchanged
- [x] `PipelineInput`, CLI, BatchRunner unchanged
- [x] Build passes: 187 routes, 0 TypeScript errors, 0 warnings
- [x] `PROJECT_STATUS.md` updated
- [x] `.ai/CURRENT_TASK.md` updated
- [x] `.ai/ENGINEERING_LOG.md` updated

**Why This Task:**
EP3-P5A made category explicit at intake. EP3-P5B completes the registry-driven orchestration path — the pipeline runner now resolves scaffold, producer set, AND catalogue all by category, with no hardcoded fragrance-specific logic inside `run()`.

---

## Files Involved

**Files created (1):**
- `scripts/factory/core/ScaffoldRegistry.ts` — `CategoryScaffolder` type, `ScaffoldRegistry` class

**Files modified (1):**
- `scripts/factory/orchestrator.ts` — `ScaffoldRegistry` imported; `defaultScaffoldRegistry` exported with fragrance scaffolder registration; `scaffold(result.intake!)` replaced by `scaffolder(result.intake!)`

**Files NOT modified:**
- `scripts/factory/scaffold.ts` — unchanged; called through the registered scaffolder
- `scripts/factory/types.ts` — unchanged
- `scripts/factory/intake.ts` — unchanged
- `scripts/factory/promotion/promotionManager.ts` — unchanged (Option A: stays calling scaffold() directly)
- `scripts/factory/draftBuilder.ts` — unchanged
- `scripts/factory/merger.ts` — unchanged
- `scripts/factory/review/` — unchanged
- `scripts/factory/batch/` — unchanged
- All 5 producers — unchanged
- All application code — unchanged
- All 93 native MKC records — unchanged

---

## Constraints

_Task closed._

---

## Context Notes

**Last completed:** EP3-P5B Scaffold Resolution Foundation (2026-08-06)

Recent completed programs (newest first):
- EP100-P3A Extract Shared AdminNavigation Component (2026-08-04) — 1 component created; 14 dashboards updated; Link import audited (7 preserved for body Link usage); build passes; 189 routes
- EP100-P2B Remove Terminated Executive Report Pipeline (2026-08-03) — 176 terminated files deleted (58 routes + 58 components + 60 lib/operations); 14 nav components cleaned; build passes; 189 routes (was 247)
- EP90-P2 Adaptive Experience Messaging (2026-08-03) — discovery copy on recently-viewed and fragrance-profile pages aligned with EP90-P1 routing; two prop-string changes; no component or engine changes; build passes; 247 routes
- EP90-P1 Adaptive Recommendation Strategy (2026-08-03) — ProfileRichness type introduced; getProfileRichness() replaces hasMeaningfulProfile() in ExperienceIntelligence routing; passive customers route to discovery; emerging/rich customers route to personalised; RecommendationEngine/RecommendationPipeline/RecommendationConfidence/LearningEngine/commerce/UI untouched; build passes; 247 routes
- EP80-P1 Recommendation Confidence (2026-08-03) — Recommendation now carries readonly confidence: RecommendationConfidence; RecommendationPipeline calls calculateConfidence() during assign stage; RecommendationEngine/LearningEngine/RecommendationReasonBuilder/commerce/UI untouched; build passes; 247 routes
- EP70-P1 Negative Preference Scoring (2026-08-03) — avoidedFamilies now propagates through LearnedPreferences into PreferenceProfile; scoreProfile() applies bounded avoidance penalty (−0.30/match, clamped [0,1]); RecommendationEngine/LearningEngine/RecommendationReasonBuilder/commerce untouched; build passes; 247 routes
- EP60-P2 Complete Recommendation Impression Coverage (2026-08-03) — six surfaces now emit recommendation_set_shown; CTR/save rate/ATC rate computable for all strategies; build passes; 247 routes
- EP50-P1 Explainable MiniCart Recommendations (2026-08-03) — CartCollectionItem type preserves recReason through mapping; MiniCart Complete Your Collection now displays recommendation explanations; RecommendationEngine/RecommendationReasonBuilder/LearningEngine untouched; build passes; 247 routes
- EP40-P2 Personalized MiniCart Recommendations (2026-08-03) — MiniCart "Complete Your Collection" now uses UnifiedCustomerProfile; CartRecommendationInput extended with optional profile; anonymousProfile() retained as fallback; RecommendationEngine/LearningEngine/commerce untouched; build passes; 247 routes
- EP40-P1 Personalized Recommendation Experience (2026-08-03) — product page routed through "product" experience (similar strategy); compare page routed through "compare" experience (complementary strategy); 2 files, 2 lines; RecommendationEngine/ExperienceIntelligence/LearningEngine untouched; build passes; 247 routes
- EP30-P1 Purchase Intelligence Bridge (2026-08-02) — fragrance_purchase signals emitted on confirmed orders; PurchaseInterpreter implemented; purchase intelligence flows into recommendation scoring; build passes; 247 routes
- EP20-P4 Recommendation Bridge (2026-08-02) — LearningEngine integrated at RecommendationEngine orchestration layer; concierge/search/discovery preferences now influence scoring; pipeline unchanged; build passes; 247 routes
- EP20-P3 Confidence Compositing (2026-08-02) — createCompositingCalculator + createAccumulatedResolver introduced; LearningEngine default wiring updated; build passes; 247 routes
- EP20-P2 Discovery Intelligence Documentation Sync (2026-08-02) — Pipeline verified fully operational; stale comments corrected in 3 files; no runtime changes; build passes; 247 routes
- EP20-P1 Concierge Intelligence Activation (2026-08-02) — ConciergeInterpreter active; signals emitted from ConciergePanel; build passes; 247 routes
- KI-16 Sort Behaviour Consistency (2026-08-02) — Best Sellers/New Arrivals removed from sort; filter controls unchanged; build passes; 247 routes
- KI-15 Product JSON-LD Availability (2026-08-02) — JSON-LD availability now derived from knowledge.status; build passes; 247 routes
- KI-14 Mobile MiniCart Close UX (2026-08-02) — drag handle converted to button calling onClose; build passes; 247 routes
- KI-12 Instagram URL Completion (2026-08-02) — brand.ts instagramUrl set to https://instagram.com/maisonskyeandrose; build passes
- KI-11 Documentation Closure (2026-08-02) — verified resolved by inspection; no code changes; KI-11 moved to Resolved in KNOWN_ISSUES.md
- KI-10 Documentation Closure (2026-08-02) — verified resolved by inspection; no code changes; KI-10 moved to Resolved in KNOWN_ISSUES.md
- KI-04 Cart Composite Key (2026-08-02) — commit c8dea73 — dead QuickAddBundle.tsx deleted; all active paths already canonical
- Repository Maintenance (2026-08-02) — 9 known issues marked Resolved; SPRINT.md, ENGINEERING_LOG.md, CURRENT_TASK.md updated; 5 validation scripts deleted
- Delivery Pricing Reconciliation KI-07 (2026-08-02) — commit 74c8789 — D10 Option (c) implemented in MiniCart.tsx
- PayFast Production Hardening KI-01/02/03/05/06 (2026-08-02) — commit 9f9f7f5 — payfast/route.ts rewritten, itn/route.ts created, checkout wired to PayFast
- FloatingCart Integration (2026-08-02) — commit 4356d35 — FloatingCart added to layout.tsx with cartOpen guard and aria-label
- Executive Report Pipeline (2026-07-01 → 2026-08-02) — ~30 stages implemented, pipeline terminated at Commitment by approved architecture decision

---

## Plan

_N/A_

---

## Build Result

**Last build:** 2026-08-06 — Pass. Zero TypeScript errors. Zero warnings. 187 routes. (EP3-P3)

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

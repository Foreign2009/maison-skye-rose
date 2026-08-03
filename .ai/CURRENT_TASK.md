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
**Program:** EP70-P1 — Experience Release 7.0 / Negative Preference Scoring

**Goal:**
Activate negative preference scoring so that family avoidance preferences (captured via the Concierge, learned by LearningEngine, and summarised by CustomerPreferenceSummary) now reduce the profile dimension score for candidates from avoided fragrance families during recommendation ranking.

**Acceptance Criteria:**
- [x] `avoidedFamilies: readonly string[]` added to `LearnedPreferences` interface
- [x] `computeLearnedPreferences()` populates `avoidedFamilies` from `CustomerPreferenceSummary`
- [x] `PreferenceProfile` carries `avoidedFamilies: ReadonlySet<string>`
- [x] `buildPreferenceProfile()` populates the set from `learnedPreferences.avoidedFamilies`
- [x] `scoreProfile()` applies bounded avoidance penalty (−0.30/match, max −0.45, clamped [0,1])
- [x] Customers without avoidance signals produce identical recommendations (empty set → no penalty)
- [x] Cold-start behaviour unchanged (learnedPreferences undefined → no penalty)
- [x] Preferred family scoring unchanged
- [x] RecommendationEngine, LearningEngine, RecommendationReasonBuilder unchanged
- [x] WeightedRecommendationScorer, RecommendationPipeline unchanged
- [x] CustomerProfileSync, commerce behaviour unchanged
- [x] Build passes — TypeScript clean, 0 warnings, 247 routes

**Why This Task:**
Repository inspection (PR1-P1 audit) identified that family_avoidance signals flow correctly through ConciergeInterpreter, LearningEngine, and CustomerPreferenceSummary but are dropped at computeLearnedPreferences() in RecommendationEngine.ts because LearnedPreferences had no avoidedFamilies field. The pipeline was 95% complete — only the data propagation and penalty were missing.

---

## Files Involved

**Files modified:**
- `app/lib/customer/recommendations/RecommendationContext.ts` — `avoidedFamilies: readonly string[]` added to `LearnedPreferences`
- `app/lib/customer/recommendations/RecommendationEngine.ts` — `avoidedFamilies: summary.avoidedFamilies` added to `computeLearnedPreferences()` return
- `app/lib/customer/recommendations/PreferenceScorer.ts` — `avoidedFamilies: ReadonlySet<string>` added to `PreferenceProfile`; populated in `buildPreferenceProfile()`; bounded penalty applied in `scoreProfile()`

**Files NOT modified:**
- `app/lib/customer/learning/SignalInterpreter.ts` — ConciergeInterpreter already correct
- `app/lib/customer/sync/CustomerProfileSync.ts` — recordConciergeIntent already correct
- `app/lib/customer/learning/PreferenceCandidate.ts` — positive: boolean already correct
- `app/lib/customer/learning/PreferenceAccumulator.ts` — polarity preserved in group key
- `app/lib/customer/learning/PreferenceResolver.ts` — positive field preserved through resolution
- `app/lib/customer/intelligence/CustomerPreferenceSummary.ts` — avoidedFamilies already populated
- `app/lib/customer/learning/LearningEngine.ts` — unchanged
- `app/lib/customer/recommendations/WeightedRecommendationScorer.ts` — unchanged
- `app/lib/customer/recommendations/RecommendationReasonBuilder.ts` — unchanged
- `app/lib/customer/recommendations/RecommendationPipeline.ts` — unchanged
- `app/lib/customer/recommendations/RecommendationScore.ts` — unchanged

---

## Constraints

_Task closed._

---

## Context Notes

**Last completed:** EP60-P2 Complete Recommendation Impression Coverage (2026-08-03)

Recent completed programs (newest first):
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

**Last build:** 2026-08-03 — Pass. Zero TypeScript errors. Zero warnings. 247 routes. (EP70-P1)

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

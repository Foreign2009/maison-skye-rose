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
**Program:** EP0-P3 — Foundation Programme / The Skye & Rose Stewardship & Architecture Charter

**Goal:**
Establish the operational expression of the Constitution: a Charter that translates institutional beliefs into building practice for every future engineer, designer, perfumer, packaging designer, customer experience designer, operations team, AI system, and generation of steward.

**Acceptance Criteria:**
- [x] `FOUNDATIONS/03_STEWARDSHIP_AND_ARCHITECTURE_CHARTER.md` created
- [x] Builder's Oath written — takes personal responsibility for trust, customer experience, institutional reputation, and the standard of the names
- [x] Ten Principles written — each traceable to Constitutional Articles; applicable across all builder disciplines
- [x] Skye & Rose Standard written — six questions; "No" returns the work for refinement
- [x] Engineering Doctrine written — Foundation Alignment, Repository Before Assumption, Plan Before Build, Evidence Before Implementation, Knowledge-First Architecture, Explainable Systems, Maintainability Over Cleverness, Prefer Reversibility, Build Verification
- [x] AI Stewardship Principles written — ten permanent principles; no manipulation, no pretended certainty, explainability as deployment requirement
- [x] Definition of Done written — six criteria in order; technical excellence last
- [x] Closing Commitment written — Charter most necessary when building is hardest
- [x] All three previous foundational documents NOT modified
- [x] PROJECT_STATUS.md updated with EP0-P3 entry
- [x] Self-review performed against all six quality criteria; all pass

**Why This Task:**
The Constitution states what the institution believes. Without a Charter, those beliefs remain abstract — inspiring but not actionable. The Charter bridges belief and practice, giving every builder — in any discipline, in any generation — a permanent operational standard they can apply to their work.

---

## Files Involved

**Files created (1):**
- `app/admin/components/AdminNavigation.tsx` — shared nav component; `usePathname()` active-state; 14 nav items data-driven; `"use client"`

**Files modified (14 admin dashboard components — nav extraction only):**
- `app/admin/AdminConsole.tsx`
- `app/admin/BriefingDashboard.tsx`
- `app/admin/CommerceIntelligenceDashboard.tsx`
- `app/admin/CustomerIntelligenceDashboard.tsx`
- `app/admin/ExecutiveBriefingCenter.tsx`
- `app/admin/ExecutiveOperationsDashboard.tsx`
- `app/admin/ExecutiveOperationsDigestDashboard.tsx`
- `app/admin/ExecutiveReportCenter.tsx`
- `app/admin/ExecutiveReportDashboard.tsx`
- `app/admin/IntelligenceDashboard.tsx`
- `app/admin/OperationsAlertCenter.tsx`
- `app/admin/OperationsAlertDashboard.tsx`
- `app/admin/RecommendationPerformanceDashboard.tsx`
- `app/admin/UnifiedOperationsConsole.tsx`

**Files NOT modified:**
- All admin route pages (`app/admin/*/page.tsx`) — unchanged
- All lib/operations builders and types — unchanged
- RecommendationEngine, ExperienceIntelligence, LearningEngine, analytics, commerce — unchanged

---

## Constraints

_Task closed._

---

## Context Notes

**Last completed:** EP100-P3A Extract Shared AdminNavigation Component (2026-08-04)

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

**Last build:** 2026-08-04 — Pass. Zero TypeScript errors. Zero warnings. 189 routes. (EP100-P3A)

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

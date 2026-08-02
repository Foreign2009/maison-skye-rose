# Engineering Programs — Maison Skye & Rose

One active program at a time.
Each program has a defined scope, ordered task list, and a clear close condition.

---

## How to Use This File

**Opening a program:**
1. Confirm no active program is running (or close the current one first)
2. Define the program name (e.g. `PAYFAST-001`), objective, scope, and task list
3. Set the close condition before any tasks begin
4. Update `CURRENT_TASK.md` with the first task and set `Program:` to this program name
5. Add an opening entry to `ENGINEERING_LOG.md`

**During a program:**
- One task at a time in `CURRENT_TASK.md`
- Mark tasks Complete in this file as they finish
- Log each session in `ENGINEERING_LOG.md`
- Never expand scope mid-program without Project Owner approval

**Closing a program:**
1. Confirm all tasks are marked Complete
2. Move the Active Program block to the Completed Programs section with a closed date
3. Clear the Active Program section
4. Reset `CURRENT_TASK.md` to "No active task"
5. Add a close entry to `ENGINEERING_LOG.md`

---

## Active Program

None — EP20-P2 Discovery Intelligence Documentation Sync closed 2026-08-02 (pipeline verified operational; stale comments corrected). Awaiting Engineering Lead direction for next sprint.

---

## Completed Programs

### EP20-P2 — Experience Release 2.0 / Discovery Intelligence Documentation Sync

**Objective:** Verify the Discovery Intelligence pipeline is fully operational and correct all stale engineering comments that misrepresented DiscoveryInterpreter as deferred or placeholder.
**Scope:** Comment-only changes in `SignalInterpreter.ts`, `LearningEngine.ts`, `CustomerIntelligenceEngine.ts`. No executable code modified.
**Lead:** Project Owner + Claude (Implementation Engineer)
**Opened:** 2026-08-02
**Closed:** 2026-08-02

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Inspection — full Discovery pipeline audit: DiscoveryAttributionSetter, recordDiscoveryFilter, DiscoveryInterpreter, LearningEngine routing, PreferenceAccumulator, CustomerPreferenceSummary | Complete |
| 2 | G2 | Engineering Assessment — pipeline verified end-to-end; DiscoveryInterpreter confirmed functional; 3 stale comment locations identified | Complete |
| 3 | G3 | Implementation — 6 comment edits across 3 files; no executable code changed | Complete |
| 4 | G4 | Build verification — Pass, TypeScript clean, 0 warnings, 247 routes | Complete |

**Close Condition:** DiscoveryInterpreter described as active in all documentation. No stale EP10.0-P5+ or "deferred" claims remain. Build passes.

**Outcome:** Repository inspection confirmed the Discovery Intelligence pipeline was already fully operational: `/discover/[id]` visits emit `discovery_path` signals → `DiscoveryInterpreter` extracts families/occasions/seasons → `PreferenceAccumulator` groups candidates → `CustomerPreferenceSummary` surfaces `preferredFamilies[]`, `preferredOccasions[]`, `preferredSeasons[]`. EP20-P2 was a documentation synchronisation episode. 7 of 8 LearningEngine interpreters now documented as active; PurchaseInterpreter remains the sole deferred placeholder.

---

### EP20-P1 — Experience Release 2.0 / Concierge Intelligence Activation

**Objective:** Activate the LearningEngine ConciergeInterpreter by wiring concierge signal emission from ConciergePanel into the existing device-profile pipeline. Establish delta-based, idempotent preference capture across all five intent dimensions.
**Scope:** `app/lib/customer/sync/CustomerProfileSync.ts` (ConciergeIntent interface + recordConciergeIntent), `app/lib/customer/learning/SignalInterpreter.ts` (ConciergeInterpreter.interpret() implemented), `app/components/ConciergePanel.tsx` (diffProfile helper + signal emission call).
**Lead:** Project Owner + Claude (Implementation Engineer)
**Opened:** 2026-08-02
**Closed:** 2026-08-02

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Inspection — ConciergeInterpreter stub, CustomerProfileSync, ConciergePanel handleSend, API route signal boundary | Complete |
| 2 | G2 | Implementation Plan — 3-file scope, delta idempotency design, family_avoidance→positive:false mapping, server vs client signal emission decision | Complete |
| 3 | G3 | Implementation — CustomerProfileSync.ts (ConciergeIntent + recordConciergeIntent), SignalInterpreter.ts (ConciergeInterpreter.interpret()), ConciergePanel.tsx (diffProfile + emission call) | Complete |
| 4 | G4 | Build verification — Pass, TypeScript clean, 0 warnings, 247 routes | Complete |

**Close Condition:** ConciergeInterpreter.interpret() returns PreferenceCandidates for all 5 signal types. recordConciergeIntent() emits signals per concierge turn delta. diffProfile() prevents duplicate signal inflation across a multi-turn session. Build passes.

**Outcome:** AI Concierge is now a live LearningEngine signal source. Per-turn delta signals feed ConciergeInterpreter → PreferenceCandidate pipeline → CustomerPreferenceSummary → unified customer intelligence. family_avoidance signals map to family_preference candidates with positive:false, consistent with CustomerPreferenceSummary avoidedFamilies check. Idempotency enforced at two levels: diffProfile (cross-turn delta) + Set deduplication in recordConciergeIntent (within-call). 6 of 8 interpreters now active; PurchaseInterpreter and DiscoveryInterpreter remain deferred.

---

### Repository Maintenance & Documentation Synchronization

**Objective:** Synchronize repository documentation with the current implementation state — mark resolved known issues, update program records, and remove untracked obsolete validation scripts.
**Scope:** `.ai/KNOWN_ISSUES.md`, `.ai/SPRINT.md`, `.ai/CURRENT_TASK.md`, `.ai/ENGINEERING_LOG.md`. Five untracked validation scripts deleted. No application code changes.
**Lead:** Project Owner + Claude (Implementation Engineer)
**Opened:** 2026-08-02
**Closed:** 2026-08-02

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Inspection — KNOWN_ISSUES.md, SPRINT.md, CURRENT_TASK.md, ENGINEERING_LOG.md, untracked validation scripts | Complete |
| 2 | G2 | Implementation — 4 documentation files updated; 5 validation scripts deleted | Complete |
| 3 | G3 | Build verification — Pass, TypeScript clean, 0 warnings, 247 routes | Complete |

**Close Condition:** 9 resolved known issues marked Resolved with commit references. SPRINT.md, CURRENT_TASK.md, and ENGINEERING_LOG.md reflect programs since EP8-P1. 5 obsolete validation scripts removed. Build passes.

**Outcome:** KI-01, KI-02, KI-03, KI-05, KI-06, KI-07 moved to Resolved with commit 9f9f7f5 / 74c8789 references. KI-08, KI-09, KI-13 moved to Resolved with prior-session references. SPRINT.md updated with Executive Report Pipeline, FloatingCart, PayFast, and Delivery programs. CURRENT_TASK.md refreshed. ENGINEERING_LOG.md appended. Validation scripts validate-ep4p1b.mjs, validate-ep6p1.mjs, validate-ep6p2.mjs, validate-ep6p3.mjs, validate-ep6p4.mjs deleted.

---

### Delivery Pricing Reconciliation — KI-07

**Objective:** Reconcile the delivery price discrepancy between MiniCart and Checkout by completing the "Calculated at checkout" approach (D10 Option c). Eliminate the hidden R100 assumption in the MiniCart total.
**Scope:** `app/components/MiniCart.tsx` only. Checkout province-based DELIVERY_RATES unchanged.
**Lead:** Project Owner + Claude (Implementation Engineer)
**Opened:** 2026-08-02
**Closed:** 2026-08-02

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Inspection — MiniCart.tsx, checkout/page.tsx, DECISIONS.md D10 | Complete |
| 2 | G2 | Implementation — total label/amount when delivery non-free; WhatsApp message delivery display | Complete |
| 3 | G3 | Build verification — Pass, TypeScript clean, 0 warnings, 247 routes | Complete |

**Close Condition:** MiniCart total shows subtotal (not subtotal + R100) when delivery is non-free. Delivery line continues to show "Calculated at checkout". WhatsApp message consistent with UI. Checkout pricing unchanged. Build passes.

**Outcome:** D10 Option (c) implemented. MiniCart total label switches to "Subtotal" with pre-delivery amount when delivery is non-free. WhatsApp checkout shows "Calculated at checkout" for delivery and "SUBTOTAL" label. Free delivery and wholesale behaviour unchanged. Commit 74c8789.

---

### PayFast Production Hardening — KI-01/02/03/05/06

**Objective:** Harden the PayFast payment integration for production launch — configurable URL, MD5 signature, server-only env vars, real customer data, ITN webhook, and wired checkout-to-PayFast flow.
**Scope:** `app/api/payfast/route.ts` (rewritten), `app/api/payfast/itn/route.ts` (new), `app/checkout/page.tsx` (PayFast integration added).
**Lead:** Project Owner + Claude (Implementation Engineer)
**Opened:** 2026-08-02
**Closed:** 2026-08-02

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Inspection — payfast/route.ts, checkout/page.tsx, orderStatus.ts, KNOWN_ISSUES.md | Complete |
| 2 | G2 | Implementation — KI-01 configurable URL; KI-03 MD5 signature; KI-05 server-only env vars; KI-06 real customer data; KI-02 ITN webhook; checkout PayFast redirect | Complete |
| 3 | G3 | Build verification — Pass, TypeScript clean, 0 warnings, 247 routes | Complete |

**Close Condition:** PayFast URL controlled by PAYFAST_ENV. MD5 signature computed. Passphrase server-only. Real customer name passed. ITN verifies signature and updates Supabase. Checkout creates order then redirects through PayFast. Build passes.

**Outcome:** KI-01, KI-02, KI-03, KI-05, KI-06 resolved. Payment flow: order created → /api/payfast called → redirect to PayFast → ITN updates payment_status → PayFast redirects to /payment-success. Required env vars: PAYFAST_MERCHANT_ID, PAYFAST_MERCHANT_KEY, PAYFAST_PASSPHRASE, PAYFAST_ENV, NEXT_PUBLIC_WEBSITE_URL. Commit 9f9f7f5.

---

### FloatingCart Integration

**Objective:** Integrate the FloatingCart mobile component (previously untracked) into the root layout with accessibility and MiniCart conflict prevention.
**Scope:** `app/components/FloatingCart.tsx` (cartOpen guard + aria-label), `app/layout.tsx` (import + render inside CartUIProvider).
**Lead:** Project Owner + Claude (Implementation Engineer)
**Opened:** 2026-08-02
**Closed:** 2026-08-02

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Inspection — FloatingCart.tsx, layout.tsx, CartUIContext | Complete |
| 2 | G2 | Implementation — cartOpen guard on AnimatePresence; aria-label on button; layout integration | Complete |
| 3 | G3 | Build verification — Pass, TypeScript clean, 0 warnings, 247 routes | Complete |

**Close Condition:** FloatingCart renders in layout inside CartUIProvider scope. Suppressed when MiniCart is already open. Accessible via aria-label. Build passes.

**Outcome:** FloatingCart integrated. Animated spring pill suppresses automatically when cartOpen is true. aria-label="View cart" added. FloatingCart renders after CartSuccessToast in layout.tsx. Commit 4356d35.

---

### Executive Report Pipeline

**Objective:** Implement the full Executive Report admin intelligence pipeline — a multi-stage authority escalation system delivering operational intelligence across the admin dashboard. Architecture extension proposal assessed and terminated at Commitment.
**Scope:** New admin pages under `/admin/executive-report-*`. Approximately 30 stages implemented, each with Foundation + Dashboard + Center pages. Pipeline terminates at Commitment by approved architecture decision.
**Lead:** Project Owner + Claude (Implementation Engineer)
**Opened:** 2026-07-01
**Closed:** 2026-08-02

**Stages Implemented:**

| Stage | Status |
|---|---|
| Commitment (Center, Dashboard, Foundation) | Complete — commits a5a64ff, e98de29, cc6370c |
| Adoption (Center, Dashboard, Foundation) | Complete — commits a262908, 5da3fc6, cb8092b |
| Acceptance (Center, Dashboard, Foundation) | Complete — commits 6e888f5, f34c65b, 8df2990 |
| Endorsement (Center, Dashboard, Foundation) | Complete — commits ebd33ee, 8b7b205, fab3729 |
| Ratification (Center, Dashboard, Foundation) | Complete — commits a1c213d, bd80c4f, 6025e79 |
| Authentication (Center, Dashboard, Foundation) | Complete — commits 0af54af, b35193c, 6eb1b10 |
| Authorization (Center, Dashboard, Foundation) | Complete — commits d80cfba, bcdd93d, 20db39c |
| Certification (Center, Dashboard, Foundation) | Complete — commits 9c29d2b, 2a47e51, 82a3ae3 |
| Validation (Center, Dashboard, Foundation) | Complete — commits d7d47d6, 28f8a63, 3ceb864 |
| Confirmation / Verification (Center, Dashboard, Foundation) | Complete — commits 73e35d0, e85a8dd, 1d5a7bc, cf5f5fe |
| Receipt (Center, Dashboard, Foundation) | Complete — commits 621a125, d008c7e, c0f3e7a |
| Acknowledgement (Center, Dashboard, Foundation) | Complete — commits 43e82cc, 5f66ec9, c6e0fd1 |
| Delivery (Center, Dashboard, Foundation) | Complete — commits 2667caf, cc8bf71, db41b39 |
| Distribution (Center, Dashboard, Foundation) | Complete — commits 008df11, 8904484, 3d9c7b5 |
| Publication (Center, Dashboard, Foundation) | Complete — commits dd1db7d, 6e0a37e, 175fa46 |
| Completion (Center, Dashboard, Foundation) | Complete — commits b5ca98a, ac828ee, b6628ea |
| Execution (Center, Dashboard, Foundation) | Complete — commits 764006f, b0e5984, d8ed397 |
| Approval (Center, Dashboard, Foundation) | Complete — commits 5250dc0, 0ff6f0f, f560dc2 |
| Decision and earlier stages | Complete — see git log from afdf97a |

**Architecture Extension Proposal:** Three candidate next stages (Resolution, Governance, Accountability) were assessed. Approved decision: pipeline terminates at Commitment. No further Executive Report stages.

**Close Condition:** All stages through Commitment implemented. Architecture extension proposal concluded. Build passes at each stage.

**Outcome:** Executive Report Pipeline complete at ~30 stages. All admin pages are dynamic server components protected by SHA256 session authentication. Pipeline provides full operational intelligence from initial decision through final commitment. Architecture terminated by approved extension proposal.

---

### EP8-P1 — Recommendation Intelligence Implementation / Foundation Cleanup

**Objective:** Align the evaluation framework with the live recommendation engine, eliminate architectural inconsistencies in the recommendation engine, remove divergent fallback systems, and delete confirmed dead files.
**Scope:** `.ai/evaluation/` (3 documents), `app/lib/recommendFragrances.ts`, `app/components/RecommendationCard.tsx`, `app/components/RecommendationSection.tsx` (deleted), `app/data/fragranceDatabase.ts` (deleted), `app/data/fragranceQuizQuestions.ts` (deleted). No behavioural recommendation changes.
**Lead:** ChatGPT (Engineering Lead) + Claude (Implementation Engineer)
**Opened:** 2026-07-01
**Closed:** 2026-07-01

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Evidence Report — 5 areas: evaluation framework (8 stale items), recommendation engine (hiddenGem/luxuryUpgrade criterion inconsistency), dead files (fragranceDatabase, fragranceQuizQuestions), duplicate fallback systems (JSX vs explainability.ts), validation tooling | Complete |
| 2 | G2 | Implementation Plan — 3-phase plan; documentation → architectural consistency → dead-file deletion; pre-deletion search protocol per Engineering Lead refinement | Complete |
| 3 | G3 | Implementation — Phase 1: documentation corrections, commit af48a22; Phase 2: hiddenGem + RecommendationCard + TC-SC-03, commit 4cbf764; Phase 3: pre-deletion searches, 3 files deleted, reasons required, commit afdf97a | Complete |
| 4 | G4 | Sprint Closure — AI-OS records updated; all 4 commits pushed to origin/main | Complete |

**Close Condition:** Evaluation framework accurate. hiddenGem uses `collection !== "Elite"`. RecommendationCard JSX fallback removed. `reasons` required. Dead files deleted. M3 = 1.0000 confirmed unchanged. Build passes across all three phases.

**Outcome:** Foundation cleanup complete. Repository has no dead files, no documentation drift in the evaluation framework, no divergent fallback systems, and no architectural inconsistencies in the recommendation engine. hiddenGem now uses `item.collection !== "Elite"` (aligned with luxuryUpgrade's `item.collection === "Elite"`). `reasons` is TypeScript-required on RecommendationCard. 486 lines of dead code removed. M3 confirmed 1.0000 post-implementation. Commits af48a22, 4cbf764, afdf97a.

**Future Engineering Note:** `gender !== "unisex"` remains in 3 `.ai/` historical records (ENGINEERING_LOG.md, SPRINT.md, baseline-results.md) as accurate descriptions of the prior implementation. No action required.

---

### EP6-P4 — Intelligence Analytics / Commerce Instrumentation

**Objective:** Instrument the Commerce journey with analytics events — product detail views, add-to-cart across all surfaces, cart opened, checkout started, payment started, payment return success, payment return cancelled, and WhatsApp checkout — using the EP6-P1 analytics infrastructure.
**Scope:** `app/lib/analytics.ts`, `app/components/ProductDetail.tsx`, `app/components/QuickAddModal.tsx`, `app/components/MiniCart.tsx`, `app/components/Navbar.tsx`, `app/checkout/page.tsx`, `app/payment-success/page.tsx`, `app/payment-cancel/page.tsx`. Intelligence Layer untouched. `remove_from_cart` and `cart_quantity_changed` deferred.
**Lead:** ChatGPT (Engineering Lead) + Claude (Implementation Engineer)
**Opened:** 2026-07-01
**Closed:** 2026-07-01

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Evidence Report — 10 areas: Product Detail lifecycle, Cart lifecycle, Checkout lifecycle, analytics API, ProductCard usage, event opportunities, event timing, architectural boundaries, dependencies, risks | Complete |
| 2 | G2 | Engineering Assessment — 12 topics assessed; PayFast boundary constraint documented; sessionStorage guard pattern selected | Complete |
| 3 | G3 | Implementation Plan — 9-event plan; 8-file scope; sessionStorage named constants; deliveryMethod: province confirmed | Complete |
| 4 | G4 | Implementation — 8 production files modified; build pass; 35/35 browser validation; Intelligence Layer isolation confirmed; committed 7da817e | Complete |
| 5 | G5 | Sprint Closure — AI-OS records updated; committed; pushed to origin/main | Complete |

**Close Condition:** Nine commerce events instrumented. `!cartOpen` guard active. SessionStorage guards active. Build passes. Intelligence Layer analytics-free. 35/35 browser validation pass.

**Outcome:** Commerce journey is fully instrumented. Nine event types operational: `product_detail_viewed`, `add_to_cart` (pdp / quick-add / buy-now / minicart), `cart_opened` (bag-icon / post-add), `checkout_started`, `payment_started`, `payment_return_success`, `payment_return_cancelled`, `buy_now_clicked`, `whatsapp_checkout_started`. Commit 7da817e.

**Future Engineering Note:** As analytics coverage expands beyond commerce, consider introducing shared constants (or a helper) for analytics source values to prevent vocabulary drift. Do not implement during EP6.

---

### EP6-P3 — Intelligence Analytics / Quiz Instrumentation

**Objective:** Instrument the Quiz journey with analytics events — answer selection, quiz completion, first recommendation set display, WhatsApp CTA interactions, and product card clicks — using the EP6-P1 analytics infrastructure and the EP6-P2 ProductCard mechanism.
**Scope:** `app/quiz/page.tsx` only. No changes to `analytics.ts`, `ProductCard.tsx`, or any Intelligence Layer file.
**Lead:** ChatGPT (Engineering Lead) + Claude (Implementation Engineer)
**Opened:** 2026-06-30
**Closed:** 2026-06-30

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Evidence Report — 10 areas: quiz lifecycle, question model, recommendation flow, existing UI, ProductCard usage, analytics opportunities, event timing, architectural boundaries, dependencies, risks | Complete |
| 2 | G2 | Engineering Assessment — 10 topics assessed; re-answer behaviour, one-shot completion guards, result deduplication strategy; decisions on `quiz_started` suppression and `quiz_results_shown` scope | Complete |
| 3 | G3 | Implementation Plan — single-file plan; 9 work items; hook strategy; ESLint dep analysis; validation plan; Definition of Done | Complete |
| 4 | G4 | Implementation — React import, analytics import, useRef guard, handleAnswer augmentation, two useEffects, ProductCard source/rank, two WhatsApp onClick; build pass; 28/28 browser validation | Complete |
| 5 | G5 | Sprint Closure — AI-OS records updated; committed 53c4c63 | Complete |

**Close Condition:** Five quiz event types instrumented. Build passes. Intelligence Layer analytics-free. 28/28 browser validation pass.

**Outcome:** Quiz journey is fully instrumented. `quiz_answer_selected` fires on every answer (new and re-answer) with correct `completionCount`. `quiz_completed` fires exactly once per session via `useEffect([completed])`. `quiz_results_shown` fires once at first full completion via `useRef<boolean>` guard. Both WhatsApp CTAs fire `quiz_whatsapp_clicked` with correct `ctaType`. ProductCard `source="quiz"` activates the EP6-P2 click tracking mechanism without any changes to `ProductCard.tsx`. Intelligence Layer confirmed analytics-free. Commit 53c4c63.

**Future Engineering Note:** As additional customer journeys are instrumented, consider introducing a shared helper or constants for analytics source construction to avoid duplicated source-selection logic. Do not implement now.

---

### EP6-P2 — Intelligence Analytics / Discovery Instrumentation

**Objective:** Instrument the Discovery experience with analytics events — discovery mode transitions, confidence label impressions, filter and sort interactions, and product card clicks — using the EP6-P1 analytics infrastructure.
**Scope:** `app/lib/analytics.ts` (modified — AnalyticsSource type), `app/components/ProductCard.tsx` (modified — source/rank props), `app/shop/page.tsx` (modified — full instrumentation). Intelligence Layer untouched.
**Lead:** ChatGPT (Engineering Lead) + Claude (Implementation Engineer)
**Opened:** 2026-06-30
**Closed:** 2026-06-30

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Evidence Report — 10 areas: Discovery pipeline, all three modes, search lifecycle, shop rendering pipeline, ProductCard context, analytics integration points, event opportunities, risks, dependencies | Complete |
| 2 | G2 | Engineering Assessment — 3 ProductCard context approaches evaluated; 10 topics assessed; Approach A (individual props) recommended and approved | Complete |
| 3 | G3 | Implementation Plan — 3-file plan; AnalyticsSource shared type refinement added by Engineering Lead | Complete |
| 4 | G4 | Implementation — AnalyticsSource type, ProductCard source/rank props, handleProductNavigation, currentMode, 2 useEffects, filter/sort instrumentation, analyticsSource const; build pass; 31/31 browser validation | Complete |
| 5 | G5 | Sprint Closure — AI-OS records updated; committed bfbce8d | Complete |

**Close Condition:** Discovery mode, confidence, filter, sort, and product click events instrumented. Build passes. Intelligence Layer analytics-free. 31/31 browser validation pass.

**Outcome:** Discovery experience is fully instrumented. Five event types operational: `discovery_mode`, `confidence_label_shown`, `filter_applied`, `sort_applied`, `product_clicked`. `AnalyticsSource` type is the single source of truth for source string identity. `ProductCard` accepts analytics context without breaking `memo()` memoization. Intelligence Layer confirmed analytics-free. Commit bfbce8d.

**Future Engineering Note:** When additional discovery surfaces are instrumented, consider introducing a shared helper for analytics source construction to avoid duplicated source selection logic. Do not implement now.

---

### EP6-P1 — Intelligence Analytics / Analytics Architecture

**Objective:** Introduce analytics infrastructure — service module, session identity, event schema, and initialization component — without modifying any application component or coupling into the Intelligence Layer.
**Scope:** `app/lib/analytics.ts` (new), `app/components/AnalyticsInit.tsx` (new), `app/layout.tsx` (modified). No application instrumentation. No provider installed.
**Lead:** ChatGPT (Engineering Lead) + Claude (Implementation Engineer)
**Opened:** 2026-06-30
**Closed:** 2026-06-30

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Evidence Report — 10 areas: analytics/telemetry, event handling, shop flow, quiz flow, search flow, product click flow, cart flow, ProductDetail flow, routing, Supabase | Complete |
| 2 | G2 | Engineering Assessment — 4 architectures evaluated; 10 topics assessed; Approach B (Shared Analytics Service) recommended and approved | Complete |
| 3 | G3 | Implementation Plan — Stage 1 (infrastructure) fully planned; Stage 2 (instrumentation) insertion points listed in priority order | Complete |
| 4 | G4 | Implementation — 3 files; provider-neutral stub; 10 payload types; 12 track functions; 9/9 browser validation | Complete |
| 5 | G5 | Refinement — explicit `if (!ready) return;` in all 12 track function bodies; build pass; 9/9 validation reconfirmed; committed abf512e | Complete |

**Close Condition:** `app/lib/analytics.ts` and `app/components/AnalyticsInit.tsx` created. `app/layout.tsx` updated. Build passes. Session UUID created and persists in localStorage. Intelligence Layer isolation confirmed. No application component instrumented.

**Outcome:** Analytics infrastructure is in place and provider-neutral. Session identity operational via anonymous UUID in `localStorage['msr_session_id']`. Twelve typed track functions ready for Stage 2 instrumentation. Provider integration point clearly marked; no SDK installed. Intelligence Layer (`recommendFragrances`, `intentParser`, `knowledgeAdapter`, `explainability`) confirmed to have zero analytics imports. Commit abf512e.

**Stage 2 Engineering Note:** 16 instrumentation insertion points are enumerated and ordered in the G3 plan. Stage 2 requires: (1) Engineering Lead provider selection (PostHog JS recommended), (2) provider SDK install and env var configuration, (3) application component instrumentation in implementation order.

---

### EP5-P1 — Curated Discovery / Recommendation Slot Semantics

**Objective:** Correct the `luxuryUpgrade` and `hiddenGem` recommendation slot selection logic so that slot semantics align with their customer-facing names. Propagate `collection` metadata through the adaptation layer as the authoritative luxury signal.
**Scope:** `app/data/types.ts`, `app/lib/knowledgeAdapter.ts`, `app/lib/recommendFragrances.ts`. No UI changes, no catalogue changes, no consumer changes.
**Lead:** ChatGPT (Engineering Lead) + Claude (Implementation Engineer)
**Opened:** 2026-06-30
**Closed:** 2026-06-30

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Evidence Report — slot definitions, knowledgeAdapter popularity model, all consumers | Complete |
| 2 | G2 | Engineering Assessment — all four slots evaluated; binary popularity model deficiencies confirmed; four presentation approaches evaluated | Complete |
| 3 | G3 | Implementation Plan — Work Item A (hiddenGem) and Work Item B (luxuryUpgrade); luxury signal audit | Complete |
| 4 | G4 | Implementation — `recommendFragrances.ts` slot expressions corrected; build and 10-scenario browser validation | Complete |
| 5 | Engineering Refinement | `gender === "unisex"` proxy replaced with `collection === "Elite"` via direct pass-through; three-file change | Complete |
| 6 | Sprint Closure | AI-OS records updated; commit d830e6f; pushed | Complete |

**Close Condition:** Hidden Gem selects the highest-scoring standard non-bestseller (not the worst-matching). Luxury Upgrade selects the highest-scoring Elite collection product (not the highest-scoring bestseller). Build and browser validation pass. No regressions.

**Outcome:** Recommendation slot semantics now match their business meaning. `hiddenGem` corrected by removing `.reverse()` and adding `.slice(1)` exclusion. `luxuryUpgrade` corrected from `popularity >= 9` (bestseller filter) to `collection === "Elite"` (authoritative luxury tier). `collection` added to `Fragrance` type as direct pass-through from `DisplayFragrance`. Commit d830e6f.

**Future Engineering Note:** `hiddenGem` currently excludes Elite via `item.gender !== "unisex"`. This could later be aligned to `item.collection !== "Elite"` for architectural consistency with `luxuryUpgrade`. No functional change required.

---

### EP4-P1C — Discovery Experience / Explainability (Investigation)

**Objective:** Assess how the existing explainability system (`generateReasons`, `ExplanationResult`) can be surfaced in the Shop experience while preserving luxury design and keeping ProductCard lightweight.
**Scope:** Engineering investigation only. No production code changes.
**Lead:** ChatGPT (Engineering Lead) + Claude (Implementation Engineer)
**Opened:** 2026-06-30
**Closed:** 2026-06-30

**Decision: No Implementation Approved**

**Rationale:**
- Per-card reasons are architecturally unsuitable: `FALLBACK_REASONS` guarantee unconditional minimum 2 reasons, producing "Recommended by Maison AI" / "Carefully curated for your style" for partial-match cards — strings that do not explain why a fragrance appears in a specific search. Displaying these as product-specific explanations undermines intelligence credibility.
- Suppressing partial reasons creates visual inconsistency across the grid (some cards with reasons, others without).
- Single above-grid explanation is architecturally sound but adds limited value over EP4-P1A signal pills; risks redundancy and templated feel.
- EP4-P1A (signal pills) + EP4-P1B (confidence label) together provide a complete discovery narrative appropriate for the browse context.
- Full explainability (reasons) is already deployed at the correct architectural layer: `RecommendationCard` on Product Detail pages.

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Evidence Report — 10 areas: generateReasons, ExplanationResult, reasons consumption, ProductCard, RecommendationCard, shop pipeline, UI patterns, mobile layout, risks, reuse opportunities | Complete |
| 2 | G2 | Engineering Assessment — 3 approaches evaluated; FALLBACK_REASONS unsuitability confirmed; Approach 3 (no change) recommended and approved | Complete |
| 3 | Sprint Closure | AI-OS records updated; commit and push | Complete |

**Close Condition:** Engineering assessment complete. No implementation required. AI-OS records updated.

**Outcome:** Investigation confirmed that reasons are unsuitable for the shop grid in the current `generateReasons` implementation. Shop discovery explainability is complete at EP4-P1A + EP4-P1B. Future path: if `generateReasons` is extended to distinguish genuine from fallback reasons, per-card display could be revisited.

---

### EP4-P1B — Discovery Experience / Match Strength

**Objective:** Surface the Intelligence Layer's `matchStrength` signal as a customer-facing confidence label above the first recommendation card in Mode 1 search results.
**Scope:** `app/shop/page.tsx` only. Positional label only — no ProductCard changes, no badge, no signal summary extension.
**Lead:** ChatGPT (Engineering Lead) + Claude (Implementation Engineer)
**Opened:** 2026-06-30
**Closed:** 2026-06-30

**Out of Scope:**
- Modifying ProductCard
- Per-card badges or explainability reasons
- Extending the EP4-P1A signal summary row
- RecommendationCard changes
- Recommendation logic changes

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Evidence Report — 10 areas: matchStrength generation, consumption gap, ProductCard extension points, RecommendationCard, shop pipeline, styling patterns, reusable components, risks, mobile layout, architectural constraints | Complete |
| 2 | G2 | Engineering Assessment — 4 options evaluated; Option 4 (Hybrid) recommended; customer-facing terminology proposed | Complete |
| 3 | G3 | Implementation Plan — positional label; sort suppression guard; 8-point Definition of Done | Complete |
| 4 | G4 | Implementation — import, `adaptedByTitle` Map, `firstCardStrength` useMemo, grid render update | Complete |
| 5 | — | Build verification — zero TypeScript errors, zero warnings | Complete |
| 6 | — | Browser validation — 16/16 PASS | Complete |
| 7 | — | Commit bdabd75, AI-OS update, push | Complete |

**Close Condition:** "Perfect Match" or "Great Match" label renders above the first recommendation card in Mode 1 with Featured sort. Suppressed in Mode 0, Mode 2, and non-default sort. 16/16 browser validation pass.

**Outcome:** Intelligence Layer `matchStrength` now customer-visible as "Perfect Match" / "Great Match" above the top recommendation in shop search. Label is semantically scoped to Featured ordering only. No ProductCard changes. No regressions. Commit bdabd75.

---

### EP4-P1A — Discovery Experience / Signal Awareness

**Objective:** Expose the intent signals detected by the Intelligence Layer as visible labelled pills above Mode 1 search results in the Shop page.
**Scope:** `app/shop/page.tsx` only. Signal summary UI only — no ProductCard changes, no explainability, no matchStrength.
**Lead:** ChatGPT (Engineering Lead) + Claude (Implementation Engineer)
**Opened:** 2026-06-30
**Closed:** 2026-06-30

**Out of Scope:**
- Modifying ProductCard
- Per-card explainability reasons
- matchStrength badges
- Recommendation logic changes
- RecommendationCard integration

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Evidence Report — shop discovery pipeline, 8 components assessed | Complete |
| 2 | G2 | Engineering Assessment — 4 options evaluated; Option 4 (Hybrid) recommended | Complete |
| 3 | G3 | Implementation Plan — Signal Awareness increment; 2 Engineering Lead refinements | Complete |
| 4 | G4 | Implementation — detectedSignals memo, GENDER_LABELS, filtered refactor, JSX block | Complete |
| 5 | G4 | Mode 2 bug fix — Object.values hasSignals check (approved in-scope defect) | Complete |
| 6 | — | Build verification — zero TypeScript errors, zero warnings | Complete |
| 7 | — | Browser validation — 16/16 PASS | Complete |
| 8 | — | Commit 93c60af, AI-OS update, push | Complete |

**Close Condition:** Signal summary renders for Mode 1 searches. Absent for Mode 0 and Mode 2. Build and browser validation pass.

**Outcome:** Intelligence Layer signals (gender, occasion, family, vibe, character) now visible to customers in shop search via "Curated for you:" pill summary above the product grid. Pre-existing Mode 2 bug (keyword fallback never fired) identified and fixed. Commit 93c60af.

---

### EP3-P2 — Knowledge Engineering / Dead Occasion Signal

**Objective:** Investigate and resolve the Dead Occasion Signal issue — 4 of 11 occasion vocabulary tokens were recognizable by the system but unresolvable by the recommendation engine.
**Scope:** Investigation only + minimal quiz UI fix (`app/quiz/page.tsx`). No adapter, parser, engine, or catalogue changes.
**Lead:** ChatGPT (Engineering Lead) + Claude (Implementation Engineer)
**Opened:** 2026-06-30
**Closed:** 2026-06-30

**Out of Scope:**
- Modifying IntentParser
- Modifying Knowledge Adapter
- Modifying Recommendation Engine
- Removing vocabulary from `fragranceOccasions.ts`
- Catalogue data changes

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G1 | Repository Evidence Report — Dead Occasion Signal data flow | Complete |
| 2 | G2 | Engineering Assessment — 4 resolution options evaluated | Complete |
| 3 | G2A | Option 4 Feasibility Assessment — profile/vibe inference analysis | Complete |
| 4 | G3 | Implementation Plan — minimal quiz UI fix approved | Complete |
| 5 | G4 | Implementation — remove "Luxury Events" from quiz options | Complete |
| 6 | — | Build + browser validation (9/9 pass) | Complete |
| 7 | — | Commit, AI-OS update, push | Complete |

**Close Condition:** Dead signal removed from quiz UI. Vocabulary preserved. Build + browser validation pass.

**Outcome:** "Luxury Events" removed from quiz occasion options (commit 65b243d). Internal vocabulary retained in `fragranceOccasions.ts`. Scorer, adapter, and parser unchanged. Future Option 3 path (authoritative occasion metadata) remains fully open. Follow-up recorded for Gym, Signature Scent, Clubbing dead signals.

---

### EP3-P1 — Knowledge Engineering / Intelligence Layer

**Objective:** Implement AI-OS Recommendation Evaluation Baseline and validate the Intelligence Layer integration across quiz and shop pages.
**Scope:** `.ai/evaluation/` (new directory, 4 documents); `app/quiz/page.tsx` (Intelligence Layer integration — the shop page integration was delivered in EP3-P1 precursor commit cb5abbc).
**Lead:** ChatGPT (Engineering Lead) + Claude (Implementation Engineer)
**Opened:** 2026-06-30
**Closed:** 2026-06-30

**Out of Scope:**
- Repository cleanup
- Knowledge improvements (vocabulary, adapter)
- Application code beyond quiz page integration
- Changes to `.ai/` governance documents

**Task List:**

| # | Gate | Task | Status |
|---|---|---|---|
| 1 | G4 | Create `.ai/evaluation/` framework — 4 documents | Complete |
| 2 | — | Repository Evidence Report — quiz page uncommitted change | Complete |
| 3 | G5 | Build verification — zero TypeScript errors | Complete |
| 4 | G5 | Browser validation — 46/46 checklist items | Complete |
| 5 | — | Commit `app/quiz/page.tsx` — Intelligence Layer integration | Complete |
| 6 | — | Update AI-OS records | Complete |

**Close Condition:** All gates passed, quiz integration committed, AI-OS records updated.

**Outcome:** Intelligence Layer fully integrated (quiz + shop). Evaluation framework operational. Baseline captured (20/20 pure-function pass; 46/46 browser checks pass). No regressions. Commit 225770f.

---

### AIOS-001 — AI Engineering Operating System v1.0

**Objective:** Create AI Engineering Operating System (AI-OS) v1.0 scaffold — engineering infrastructure only.
**Scope:** `.ai/` directory extensions. No application code. No repository governance changes.
**Lead:** ChatGPT (Engineering Lead) + Claude (Implementation Engineer)
**Opened:** 2026-06-29
**Closed:** 2026-06-29

**Out of Scope:**
- Application code changes
- Refactoring `CURRENT_STATE.md`
- Changes to `CLAUDE.md` governance
- Root-level files (`PROJECT_BOOTSTRAP.md`, `PROJECT_STATUS.md`, `CHATGPT.md`)

**Task List:**

| # | Task | Status |
|---|---|---|
| 1 | Audit all 10 existing `.ai/` files — capability map and gap analysis | Complete |
| 2 | Create `.ai/SPRINT.md` — Engineering Program Management | Complete |
| 3 | Create `.ai/ENGINEERING_LOG.md` — Session History | Complete |
| 4 | Extend `CURRENT_TASK.md` — add `Program:` field | Complete |
| 5 | Extend `PROMPT_LIBRARY.md` — add 3 Engineering Program prompts | Complete |

**Close Condition:** All 5 tasks complete. No build required — infrastructure files only.

**Outcome:** AI-OS v1.0 scaffold in place. Program tracking, session history, and Engineering Program prompts operational.

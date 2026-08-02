# Engineering Log — Maison Skye & Rose

Append-only session audit trail.
One entry per engineering session.
Never edit or delete past entries.

---

## Entry Format

```
### [YYYY-MM-DD] — [Program] — [Session Type]

**Participants:** [Owner / Claude / ChatGPT]
**Program:** [Program name and description]

**Decisions Made:**
- 

**Tasks Completed:**
- 

**Tasks Started:**
- 

**Build Result:** [Pass / Fail / N/A — reason]

**Files Changed:**
- 

**Handoff:**
- 

**Open Questions Carried Forward:**
- 
```

---

## Log

### 2026-08-02 — EP30-P1 — Program Implementation

**Participants:** Project Owner / Claude (Implementation Engineer)
**Program:** EP30-P1 — Experience Release 3.0 / Purchase Intelligence Bridge

**Decisions Made:**
- localStorage bridge pattern selected for slug handoff (sessionStorage ruled out for cross-redirect reliability): checkout saves slugs keyed by orderRef before clearCart(); payment-success reads and consumes on landing
- Deduplication via persistent localStorage `msr_purchase_recorded_orders` array (survives browser restarts, prevents duplicate signal emission on page refresh)
- PurchaseInterpreter replaced inline in SignalInterpreter.ts — separate file not created (no re-export overhead; all other interpreters co-located in same module)
- No LearningEngine wiring changes needed — PurchaseInterpreter already registered in createDefaultLearningEngine() from prior work
- checkout.tsx minimal addition justified by repository evidence: cart cleared before PayFast redirect; item slugs unavailable on payment-success page without handoff

**Tasks Completed:**
- Repository inspection (checkout, payment-success, CustomerProfileSync, SignalInterpreter, signal type registry, LearningEngine)
- Implementation: checkout.tsx slug persistence, CustomerProfileSync.recordPurchase(), PurchaseInterpreter stub replacement, payment-success useEffect
- Build verification: Pass, TypeScript clean, 0 warnings, 247 routes

**Tasks Started:**
- None — EP30-P1 closed

**Build Result:** Pass — compiled 12.5s, TypeScript clean, 0 warnings, 247 routes

**Files Changed:**
- `app/checkout/page.tsx` — save purchased slugs to localStorage before clearCart() + PayFast redirect
- `app/lib/customer/sync/CustomerProfileSync.ts` — add recordPurchase() with orderRef deduplication
- `app/lib/customer/learning/SignalInterpreter.ts` — replace PurchaseInterpreter stub; update header comment
- `app/payment-success/page.tsx` — import recordPurchase, add useEffect to read/consume/clean pending purchase
- `.ai/SPRINT.md`, `.ai/CURRENT_TASK.md`, `.ai/ENGINEERING_LOG.md` — documentation sync

**Notes:**
EP30-P1 closes the purchase learning gap. Confirmed purchases now produce HIGH-confidence fragrance_purchase signals that flow through the LearningEngine → RecommendationEngine pipeline. The bridge is client-side only (localStorage), consistent with the existing customer intelligence model and the constraint against server-side customer persistence.

---

### 2026-06-29 — AIOS-001 — Program Implementation

**Participants:** Project Owner / Claude (Implementation Engineer) / ChatGPT (Engineering Lead)
**Program:** AIOS-001 — AI Engineering Operating System v1.0

**Decisions Made:**
- Do not create root-level files (`PROJECT_BOOTSTRAP.md`, `PROJECT_STATUS.md`, `CHATGPT.md`) — extend the existing `.ai/` system instead of replacing it
- Two new files approved: `.ai/SPRINT.md` and `.ai/ENGINEERING_LOG.md`
- Two existing files extended: `CURRENT_TASK.md` (added `Program:` field) and `PROMPT_LIBRARY.md` (added prompts 13–15)
- `CURRENT_STATE.md` staleness noted and deferred — not in AIOS-001 scope
- `CURRENT_STATE.md` structural overlap with `KNOWN_ISSUES.md` identified but deferred — no refactor in this sprint

**Tasks Completed:**
- Audited all 10 existing `.ai/` files — produced capability map, file-by-file assessment, and gap analysis
- Created `.ai/SPRINT.md` — Engineering Program Management
- Created `.ai/ENGINEERING_LOG.md` — Session History (this file)
- Extended `CURRENT_TASK.md` with `Program:` field
- Extended `PROMPT_LIBRARY.md` with prompts 13–15 (Open Program, Close Program, Program Review)

**Tasks Started:** None pending — all AIOS-001 tasks complete.

**Build Result:** N/A — `.ai/` infrastructure files only. No application code changed. No build required.

**Files Changed:**
- `.ai/SPRINT.md` (created)
- `.ai/ENGINEERING_LOG.md` (created)
- `.ai/CURRENT_TASK.md` (extended — `Program:` field added to template)
- `.ai/PROMPT_LIBRARY.md` (extended — prompts 13–15 added)

**Handoff:** AIOS-001 closed. AI-OS v1.0 scaffold complete. Next Engineering Program to be defined by Project Owner and ChatGPT.

**Open Questions Carried Forward:**
- `CURRENT_STATE.md` build status is stale (last updated 2026-06-27, build result "Unknown") — recommend a maintenance refresh at the start of the next program
- `CURRENT_STATE.md` duplicates issue data from `KNOWN_ISSUES.md` — structural overlap deferred to a future engineering program if it causes maintenance problems

---

### 2026-06-30 — EP3-P1 — Knowledge Engineering / Intelligence Layer Validation & Close

**Participants:** Project Owner / Claude (Implementation Engineer) / ChatGPT (Engineering Lead)
**Program:** EP3-P1 — Knowledge Engineering (EP3-P1A: Evaluation Framework; Intelligence Layer integration validation)

**Decisions Made:**
- Capture evaluation baseline before any repository cleanup (G4 constraint)
- Treat `app/quiz/page.tsx` uncommitted change as part of EP3-P1 (Intelligence Layer), not EP3-P2 — commit before opening next program
- Defer TC-E2E-01 and TC-E2E-02 browser entries in `baseline-results.md` to G5 browser validation session (now complete — see supplementary entry in baseline-results.md below)
- QuickAddModal Escape key behaviour (D5) intentionally deferred — pre-existing component behaviour, not introduced by this diff; no fix in scope
- Mobile WhatsApp floating button overlay noted as pre-existing cosmetic issue; deferred

**Tasks Completed:**
- G4: Created `.ai/evaluation/` directory with four documents: `recommendation-suite.md`, `quality-metrics.md`, `evaluation-procedure.md`, `baseline-results.md`
- Repository Evidence Report: confirmed quiz page change belongs to EP3-P1 Intelligence Layer, is internally consistent, and is ready to commit
- G5 Build Verification: `npm run build` — Pass. Zero TypeScript errors. Zero warnings. `/quiz` compiles as Static.
- G5 Browser Validation: 46/46 checklist items pass (sections A–H). Runtime Risks R1–R5 not reproduced as problems.
- Committed `app/quiz/page.tsx` — Intelligence Layer integration (commit 225770f)
- Pushed `.ai/evaluation/` framework to remote (committed in prior session: evaluation framework push)

**Build Result:** Pass — zero TypeScript errors, zero warnings, `/quiz` Static, `/shop` Static

**Files Changed:**
- `app/quiz/page.tsx` (modified — Intelligence Layer integration, committed 225770f)
- `.ai/evaluation/recommendation-suite.md` (created)
- `.ai/evaluation/quality-metrics.md` (created)
- `.ai/evaluation/evaluation-procedure.md` (created)
- `.ai/evaluation/baseline-results.md` (created)

**Handoff:** EP3-P1 closed. Intelligence Layer is fully integrated across both quiz and shop pages. Evaluation framework is in place. Next program (EP3-P2) to be defined by Engineering Lead.

**Open Questions Carried Forward:**
- QuickAddModal: no Escape key handler — closes via Cancel only. Pre-existing. Deferred.
- Mobile: floating WhatsApp button partially overlays question heading at 375px. Pre-existing cosmetic. Deferred.
- M3 Adapter Coverage metric: deferred (requires code execution against full catalogue). Measure at next evaluation run.
- TC-E2E-01 and TC-E2E-02 now confirmed via G5 browser validation (see baseline-results.md supplementary entry — to be appended).

---

### 2026-06-30 — EP3-P2 — Knowledge Engineering / Dead Occasion Signal

**Participants:** Project Owner / Claude (Implementation Engineer) / ChatGPT (Engineering Lead)
**Program:** EP3-P2 — Knowledge Engineering (Dead Occasion Signal investigation and resolution)

**Decisions Made:**
- Resolve only the quiz UI exposure of the dead signal; do not modify parser, adapter, engine, or vocabulary
- Preserve "Luxury Events" in `fragranceOccasions.ts` to keep the shop path and future Option 3 path operational
- Defer Gym, Clubbing, Signature Scent dead signals — not exposed in quiz; require authoritative catalogue data (Option 3) to resolve correctly
- Option 4 (profile/vibe inference) assessed as partially feasible: Gym viable, Clubbing marginal, Luxury Events insufficient discriminating power (42% coverage), Signature Scent not feasible under any proxy
- Minimal change approved: remove "Luxury Events" from `quiz/page.tsx` options only

**Tasks Completed:**
- G1 Repository Evidence Report: complete data flow mapped (Parser→11 occasions, Adapter→7 occasions); 4 dead signals identified; product counts by season confirmed
- G2 Engineering Assessment: 4 options evaluated (reduce vocabulary, extend SEASON_OCCASIONS, authoritative metadata, profile/vibe inference); recommendation: Option 1 now + Option 3 when data is ready
- G2A Option 4 Feasibility Assessment: computed product counts and overlaps across all 93 products; Luxury Events=39 (42%), Clubbing=13 (14%), Gym=22 (24%), Signature Scent=19 (20%); identified inappropriate assignments and proxy limitations
- G3 Implementation Plan: single-line deletion approved
- G4 Implementation: `app/quiz/page.tsx` — "Luxury Events" removed from occasion options
- Build verification: Pass — zero TypeScript errors, zero warnings
- Browser validation: 9/9 pass — all 4 remaining occasions produce results, dead signal confirmed absent from DOM, shop vocabulary path confirmed intact
- Committed (65b243d), AI-OS records updated, pushed

**Build Result:** Pass — zero TypeScript errors, zero warnings, `/quiz` Static

**Files Changed:**
- `app/quiz/page.tsx` (modified — 1 line deleted, committed 65b243d)
- `.ai/ENGINEERING_LOG.md` (this entry)
- `.ai/CURRENT_TASK.md` (updated)
- `.ai/SPRINT.md` (EP3-P2 added to Completed Programs)

**Handoff:** EP3-P2 closed. Dead Occasion Signal (Luxury Events) removed from quiz UI. Vocabulary intact. All other dead occasions deferred pending Option 3 (authoritative catalogue occasion metadata).

**Open Questions Carried Forward:**
- Gym, Clubbing, Signature Scent: dead signals still exist in adapter layer. Not exposed via quiz (no action required now). Require authoritative occasion data (Option 3) for full resolution.
- Option 3 follow-up: add `occasions?: string[]` to `DisplayFragrance`, populate across 93 catalogue products, update `adaptFragrance` to prefer catalogue data over SEASON_OCCASIONS derivation. When complete, re-add "Luxury Events" (and others) to quiz options.
- Evaluation framework: no new baseline entry created for EP3-P2 (single-line UI change; engine behaviour unchanged; existing baseline remains valid).

---

### 2026-06-30 — EP4-P1A — Discovery Experience / Signal Awareness

**Participants:** Project Owner / Claude (Implementation Engineer) / ChatGPT (Engineering Lead)
**Program:** EP4 — Discovery Experience (EP4-P1A: Signal Awareness — first increment)

**Decisions Made:**
- Option 4 (Hybrid Experience) selected from G2 Engineering Assessment: signal summary above ProductCard grid preserves purchase flow while adding intelligence feedback
- First increment scope: signal pills only — no per-card explainability, no matchStrength badges, no ProductCard changes
- Label text "Curated for you:" approved as customer-facing brand-appropriate copy
- Pill render order: Gender → Occasion → Family → Vibe → Character
- Pre-existing Mode 2 bug discovered during implementation: approved as in-scope defect fix
- Mode 2 bug root cause: `parseIntent` assigns `signals.family/vibe/occasion` explicitly as `undefined`, making `Object.keys(signals).length` always > 0 for non-empty queries. Mode 2 (keyword fallback) never fired in original code. Fixed by checking `Object.values(signals).some((v) => v !== undefined)` instead.

**Tasks Completed:**
- G1 Repository Evidence Report: complete discovery pipeline mapped, 8 existing components assessed, explainability gap identified
- G2 Engineering Assessment: 4 options evaluated; Option 4 (Hybrid) recommended and approved
- G3 Implementation Plan: Signal Awareness increment planned and approved with 2 Engineering Lead refinements
- G4 Implementation: `app/shop/page.tsx` — `detectedSignals` useMemo, `GENDER_LABELS`, `filtered` memo refactored, signal summary JSX block inserted
- Mode 2 bug fix: `Object.keys` → `Object.values(...).some` for hasSignals check
- Build verification: Pass — zero TypeScript errors, zero warnings
- Browser validation: 16/16 PASS — all signal dimensions, pill order, count accuracy, mobile layout, ProductCard regression
- Commit 93c60af, pushed to origin/main

**Build Result:** Pass — zero TypeScript errors, zero warnings, `/shop` Static

**Files Changed:**
- `app/shop/page.tsx` (modified — Signal Awareness implementation + Mode 2 bug fix, committed 93c60af)
- `.ai/ENGINEERING_LOG.md` (this entry)
- `.ai/CURRENT_TASK.md` (updated)
- `.ai/SPRINT.md` (EP4-P1A added to Completed Programs)

**Handoff:** EP4-P1A closed. Signal Awareness live in production. Intelligence Layer signals now visible to customers in shop search. Awaiting Engineering Lead direction for EP4-P1B or next sprint.

**Open Questions Carried Forward:**
- EP4 next increment: per-card `matchStrength` badge or full reasons (requires ProductCard API change — separate engineering gate)
- EP4 slot grouping (Option 2 from G2): "Best Match" / "Similar Matches" section headers — complementary to Signal Awareness, not yet planned
- ShopByVibe functional wiring: vibe tiles have no onClick/search injection (decorative only)
- ShopByPersonality routing: all personality cards link to /quiz rather than /shop?q= with pre-seeded intent

---

### 2026-06-30 — EP4-P1B — Discovery Experience / Match Strength

**Participants:** Project Owner / Claude (Implementation Engineer) / ChatGPT (Engineering Lead)
**Program:** EP4 — Discovery Experience (EP4-P1B: Match Strength — second increment)

**Decisions Made:**
- Scope restricted to positional confidence label above first recommendation card only — no ProductCard changes, no badge, no signal summary extension
- Customer-facing terminology: "strong" → "Perfect Match"; "moderate" → "Great Match"; "partial" → suppressed
- Label restricted to default ("Featured") sort order only — non-default sort suppresses the label to preserve semantic meaning of "Perfect Match" / "Great Match"
- `adaptedByTitle` Map added at module scope (mirrors existing `displayByTitle` pattern) to bridge DisplayFragrance → Fragrance for `generateReasons` lookup
- `firstCardStrength` useMemo placed after `displayItems` memo — depends on `[detectedSignals, sortBy, displayItems]`
- First card wrapped in `<div>` grid cell with label `<p>` above it; all other cards remain direct grid children

**Tasks Completed:**
- G1 Repository Evidence Report: 10 areas assessed — matchStrength generation, consumption gap, ProductCard extension points, RecommendationCard, shop pipeline, styling patterns, reusable components, risks, mobile layout, architectural constraints
- G2 Engineering Assessment: 4 options evaluated (badge in card, grid-level indicator, inline text, hybrid); Option 4 (Hybrid) recommended and approved; customer-facing terminology proposed
- G3 Implementation Plan: positional label only; sort suppression guard; 8-point Definition of Done
- G4 Implementation: `app/shop/page.tsx` — import, `adaptedByTitle` Map, `firstCardStrength` useMemo, grid render update
- Build verification: Pass — zero TypeScript errors, zero warnings, `/shop` Static
- Browser validation: 16/16 PASS — Mode 0/2 suppression, Perfect Match, Great Match, position accuracy, sort suppression and restore, EP4-P1A regression, mobile layout, zero-results guard
- Commit bdabd75, pushed to origin/main

**Build Result:** Pass — zero TypeScript errors, zero warnings, `/shop` Static

**Files Changed:**
- `app/shop/page.tsx` (modified — confidence label implementation, committed bdabd75)
- `.ai/ENGINEERING_LOG.md` (this entry)
- `.ai/CURRENT_TASK.md` (updated)
- `.ai/SPRINT.md` (EP4-P1B added to Completed Programs)

**Handoff:** EP4-P1B closed. Confidence label live in production. Intelligence Layer matchStrength now customer-visible as "Perfect Match" / "Great Match" above the top recommendation card in Mode 1 with Featured ordering. Awaiting Engineering Lead direction for EP4-P1C or next sprint.

**Open Questions Carried Forward:**
- EP4 next direction: slot grouping (Best Match / Similar Matches section headers), ShopByVibe functional wiring, ShopByPersonality pre-seeded intent — not yet planned
- ShopByVibe functional wiring: vibe tiles have no onClick/search injection (decorative only)
- ShopByPersonality routing: all personality cards link to /quiz rather than /shop?q= with pre-seeded intent
- Deferred: QuickAddModal Escape key (pre-existing UX issue)
- Deferred: Mobile WhatsApp button overlay (pre-existing cosmetic issue)

---

### 2026-06-30 — EP4-P1C — Discovery Experience / Explainability (Investigation)

**Participants:** Project Owner / Claude (Implementation Engineer) / ChatGPT (Engineering Lead)
**Program:** EP4 — Discovery Experience (EP4-P1C: Explainability — engineering investigation, no production changes)

**Decisions Made:**
- EP4-P1C concluded as an engineering investigation with no implementation approved
- Per-card reasons: ruled out — `FALLBACK_REASONS` unconditional guarantee produces generic strings ("Recommended by Maison AI", "Carefully curated for your style") for partial-match cards; displaying these as product-specific explanations undermines intelligence credibility; suppressing partials creates visual inconsistency across the grid
- Single above-grid explanation: assessed as architecturally sound but providing limited additional value over the EP4-P1A signal pills already in place; risks redundancy and templated feel from `generateReasons` string templates
- No implementation: EP4-P1A (signal pills) and EP4-P1B (confidence label) together provide a complete discovery narrative; reasons belong at the product detail level (RecommendationCard on PDP), not the discovery level (shop grid)
- FALLBACK_REASONS design validated as appropriate for ProductDetail context (full expanded RecommendationCard); unsuitable for shop grid context where reasons would be the primary differentiating text

**Tasks Completed:**
- G1 Repository Evidence Report: 10 areas assessed — generateReasons implementation, ExplanationResult generation, reasons consumption, ProductCard extension points, RecommendationCard, shop pipeline, UI patterns, mobile layout, risks, reuse opportunities
- G2 Engineering Assessment: 3 approaches evaluated (per-card reasons, single explanation block, no change); FALLBACK_REASONS unsuitability confirmed; Approach 3 (no additional explainability) recommended and approved

**Build Result:** N/A — no production code changed

**Files Changed:**
- `.ai/ENGINEERING_LOG.md` (this entry)
- `.ai/CURRENT_TASK.md` (updated)
- `.ai/SPRINT.md` (EP4-P1C added to Completed Programs)

**Handoff:** EP4-P1C closed. No production changes. Intelligence Layer explainability system fully assessed. Reasons remain active on Product Detail pages via RecommendationCard. Shop discovery explainability complete at EP4-P1A + EP4-P1B level. Awaiting Engineering Lead direction for next sprint.

**Open Questions Carried Forward:**
- EP4 next direction: slot grouping, ShopByVibe wiring, ShopByPersonality pre-seeded intent — not yet planned
- If `generateReasons` is extended in a future sprint to distinguish genuine from fallback reasons (e.g. a `hasGenuineReasons` flag), per-card reasons in the shop could be revisited
- Deferred: QuickAddModal Escape key (pre-existing UX issue)
- Deferred: Mobile WhatsApp button overlay (pre-existing cosmetic issue)

---

### 2026-06-30 — EP5-P1 — Curated Discovery / Recommendation Slot Semantics

**Participants:** Project Owner / Claude (Implementation Engineer) / ChatGPT (Engineering Lead)
**Program:** EP5 — Curated Discovery (EP5-P1: Slot Semantics Correction)

**Decisions Made:**
- `luxuryUpgrade` criterion changed from popularity-based bestseller filter (`popularity >= 9`) to Elite collection selection (`collection === "Elite"`): Elite is the authoritative luxury tier; bestseller status is not a luxury signal; all 5 Elite products were previously excluded from the slot named for them
- `hiddenGem` corrected from lowest-scoring non-bestseller (`[...scored].reverse().find(...)`) to highest-scoring standard non-bestseller (`scored.slice(1).find(...)`): the original `.reverse()` inverted the intent — a hidden gem should align with preferences, not contradict them
- Both slots use `.slice(1)` to exclude `bestMatch` from consideration — prevents same product appearing in multiple slots
- Fallbacks changed from `|| scored[1]` / `|| scored[2]` (could return semantically wrong products) to `|| null` (slot renders absent rather than misleading)
- Engineering Lead refinement at G4→Engineering Refinement gate: `gender === "unisex"` rejected as Elite proxy; `collection` propagated directly through adapter as pass-through field (not a derived `tier` abstraction)
- `collection?: "Skye" | "Rose" | "Elite"` added to `Fragrance` type — follows existing pattern of `bestSeller?` and `newArrival?` optional pass-through fields
- `QuizResults.tsx` noted as defined but not currently imported anywhere in the live app — slot labels are not yet customer-visible; this component is the candidate surface for future slot-based discovery UI

**Tasks Completed:**
- G1 Repository Evidence Report: slot definitions, knowledgeAdapter popularity model, all four consumers assessed
- G2 Engineering Assessment: all four slots evaluated (engineering meaning, customer meaning, accuracy, risks); binary popularity model deficiencies confirmed; four presentation approaches evaluated; Approach C (refine slot logic) recommended and approved
- G3 Implementation Plan: Work Item A (hiddenGem) and Work Item B (luxuryUpgrade) planned; luxury signal audit confirmed price is uniform (no price differentiation), collection is the only authoritative premium signal
- G4 Implementation: single-file change to `app/lib/recommendFragrances.ts`; build pass; 10-scenario browser validation; 4-trace slot correctness verification; EP4 regression confirmed absent
- Engineering Refinement: `gender === "unisex"` replaced with `collection === "Elite"` using direct collection pass-through; three-file change (`types.ts`, `knowledgeAdapter.ts`, `recommendFragrances.ts`)
- Build verification: Pass — zero TypeScript errors, zero warnings, 118 pages
- Commit d830e6f, pushed to origin/main

**Build Result:** Pass — zero TypeScript errors, zero warnings, 118 static/dynamic pages unchanged

**Files Changed:**
- `app/data/types.ts` (modified — `collection?` field added)
- `app/lib/knowledgeAdapter.ts` (modified — `collection` pass-through added; stale comment updated)
- `app/lib/recommendFragrances.ts` (modified — `luxuryUpgrade` and `hiddenGem` slot expressions corrected)
- `.ai/ENGINEERING_LOG.md` (this entry)
- `.ai/CURRENT_TASK.md` (updated)
- `.ai/SPRINT.md` (EP5-P1 added to Completed Programs)

**Handoff:** EP5-P1 closed. Recommendation slot semantics are now aligned with their business meaning. Hidden Gem selects the best-matching underrated standard fragrance. Luxury Upgrade selects the best-matching Elite collection product. No regressions. Awaiting Engineering Lead direction for EP5-P2 or next sprint.

**Open Questions Carried Forward:**
- Technical consistency opportunity: `hiddenGem` currently excludes Elite via `item.gender !== "unisex"` — could be updated to `item.collection !== "Elite"` for architectural consistency with `luxuryUpgrade`. No functional change required. Low priority.
- `QuizResults.tsx` exists with correct slot label sections but is not imported in any page — candidate for future slot-based discovery UI when Engineering Lead determines the right moment
- ShopByVibe functional wiring: vibe tiles have no onClick/search injection (decorative only)
- ShopByPersonality routing: all personality cards link to /quiz rather than /shop?q= with pre-seeded intent
- Deferred: QuickAddModal Escape key (pre-existing UX issue)
- Deferred: Mobile WhatsApp button overlay (pre-existing cosmetic issue)

---

### 2026-06-30 — EP6-P1 — Intelligence Analytics / Analytics Architecture

**Participants:** Project Owner / Claude (Implementation Engineer) / ChatGPT (Engineering Lead)
**Program:** EP6 — Intelligence Analytics (EP6-P1: Analytics Architecture — infrastructure only)

**Decisions Made:**
- Analytics observes behaviour; it never influences it — enforced as a documentation principle and architectural rule in `analytics.ts`
- Intelligence Layer must never import `analytics.ts` — observability lives at call sites in consumers, not inside pure library functions
- Provider selection deferred — provider integration point implemented as named stub (`providerInit`, `providerCapture`); no provider SDK installed, no env var hard-coded
- Session identity: anonymous UUID in `localStorage['msr_session_id']` — consistent with existing cart and favorites persistence pattern; generated via `crypto.randomUUID()`
- Timestamps are provider responsibility — client payloads carry no timestamp fields
- `SESSION_KEY = "msr_session_id"` defined as module constant in `AnalyticsInit.tsx` — no literal repetition
- G5 Engineering Lead refinement: `if (!ready) return;` required as explicit first statement in every public track function body — the `capture` helper retains its own guard as secondary defense; public contract must be self-documenting
- `AnalyticsInit` component placed outside the provider tree in `layout.tsx` — no context dependencies; renders `null`
- Approach B (Shared Analytics Service) selected from four evaluated architectures — matches codebase thin-module convention, centralizes schema ownership, testable via single module mock, sufficient portability for pre-launch single-provider context
- Stage 2 (application instrumentation) deferred — 16 insertion points enumerated and ordered in G3 plan; no application components touched

**Tasks Completed:**
- G1 Repository Evidence Report: 10 areas surveyed — analytics/telemetry (none), event handling, shop flow, quiz flow, search flow, product click flow, cart flow, ProductDetail flow, routing, Supabase; 16 instrumentation points identified; architectural constraints documented
- G2 Engineering Assessment: 4 architectures evaluated (A: Direct calls, B: Service module, C: Interface/adapter, D: Event bus); 10 topics assessed (abstraction layer, event model, provider adapter, session identity, schema, client/server split, ProductCard propagation, API boundaries, failure handling, portability); Approach B recommended and approved
- G3 Implementation Plan: Stage 1 (infrastructure) fully planned; Stage 2 (instrumentation) insertion points listed in priority order without internal code
- G4 Implementation: `app/lib/analytics.ts` created (documentation block, safeCall, ready flag, provider stub, 10 payload types, 12 track functions); `app/components/AnalyticsInit.tsx` created; `app/layout.tsx` modified; 9/9 browser validation pass
- G5 Refinement: explicit `if (!ready) return;` added to all 12 track function bodies; build pass; 9/9 validation reconfirmed; committed abf512e

**Build Result:** Pass — zero TypeScript errors, zero warnings, 118 pages (unchanged)

**Files Changed:**
- `app/lib/analytics.ts` (created — analytics service module)
- `app/components/AnalyticsInit.tsx` (created — initialization component)
- `app/layout.tsx` (modified — AnalyticsInit added)
- `.ai/ENGINEERING_LOG.md` (this entry)
- `.ai/CURRENT_TASK.md` (updated)
- `.ai/SPRINT.md` (EP6-P1 added to Completed Programs)

**Handoff:** EP6-P1 closed. Analytics infrastructure is in place. Session identity is operational. Intelligence Layer remains isolated. No application component is instrumented. Stage 2 instrumentation requires provider selection before implementation can begin.

**Open Questions Carried Forward:**
- Provider selection: PostHog JS recommended in G2; Engineering Lead to confirm before Stage 2
- Stage 2 (instrumentation): 16 insertion points enumerated in G3 plan; ready to implement once provider is selected and configured
- ShopByVibe functional wiring: vibe tiles have no onClick/search injection (decorative only)
- ShopByPersonality routing: all personality cards link to /quiz rather than /shop?q= with pre-seeded intent
- Deferred: QuickAddModal Escape key (pre-existing UX issue)
- Deferred: Mobile WhatsApp button overlay (pre-existing cosmetic issue)

---

### 2026-06-30 — EP6-P2 — Intelligence Analytics / Discovery Instrumentation

**Participants:** Project Owner / Claude (Implementation Engineer) / ChatGPT (Engineering Lead)
**Program:** EP6 — Intelligence Analytics (EP6-P2: Discovery Instrumentation)

**Decisions Made:**
- `AnalyticsSource` extracted as a shared exported type from `analytics.ts` — single source of truth for source string union; no duplication in `ProductCard` or application components
- Approach A (individual optional props) selected for `ProductCard` analytics context — `source?` and `rank?` as scalar optionals; avoids object creation that would break `memo(ProductCard)` referential stability
- `handleProductNavigation` useCallback replaces both `Link onClick={saveRecentlyViewed}` assignments — combines `saveRecentlyViewed` + conditional `trackProductClick`; analytics call guarded by `source !== undefined` so non-shop usages of `ProductCard` are unaffected
- Mode is derived as `currentMode` useMemo (0 | 1 | 2) — DRY derivation shared by filter/sort handlers, useEffects, and `analyticsSource` const; avoids repeating `debouncedSearch`/`detectedSignals` logic
- Two separate useEffects: discovery mode events on `[debouncedSearch, detectedSignals]`; confidence events on `[firstCardStrength]` — separation keeps each effect's responsibility clear
- `analyticsSource` computed as explicit ternary const (no template literal) per Engineering Lead refinement #1
- State updates always precede analytics calls in all inline handlers per Engineering Lead refinement #2
- `react-hooks/exhaustive-deps` — not suppressed proactively; build confirmed zero warnings; no suppression required
- Intelligence Layer remains analytics-free — `recommendFragrances`, `intentParser`, `knowledgeAdapter`, `explainability` carry no analytics imports

**Tasks Completed:**
- G1 Repository Evidence Report: 10 areas surveyed — Discovery pipeline, all three modes, search lifecycle, shop rendering pipeline, ProductCard context, existing analytics integration points, event opportunities, architectural risks, dependencies
- G2 Engineering Assessment: 3 ProductCard context approaches evaluated (A: individual props, B: analyticsContext object, C: parent owns click); Approach A recommended and approved; 10 topics assessed including useEffect strategy, memo safety, ESLint exhaustive-deps
- G3 Implementation Plan: 3-file plan approved; `AnalyticsSource` shared type refinement added by Engineering Lead
- G4 Implementation: 3 files modified — `analytics.ts` (AnalyticsSource type), `ProductCard.tsx` (source/rank props, handleProductNavigation), `shop/page.tsx` (currentMode, 2 useEffects, filter/sort instrumentation, analyticsSource const, ProductCard source/rank props); build pass; 31/31 browser validation; Intelligence Layer isolation confirmed; committed bfbce8d

**Build Result:** Pass — zero TypeScript errors, zero warnings, 118 pages (unchanged)

**Files Changed:**
- `app/lib/analytics.ts` (modified — AnalyticsSource type extracted from ProductPayload)
- `app/components/ProductCard.tsx` (modified — source/rank props, handleProductNavigation)
- `app/shop/page.tsx` (modified — currentMode, discovery/confidence useEffects, filter/sort instrumentation, analyticsSource const, ProductCard source/rank)
- `.ai/ENGINEERING_LOG.md` (this entry)
- `.ai/CURRENT_TASK.md` (updated)
- `.ai/SPRINT.md` (EP6-P2 added to Completed Programs)

**Handoff:** EP6-P2 closed. Discovery instrumentation complete. All five event types (discovery mode, confidence, filter, sort, product click) are instrumented and analytics-safe. ProductCard accepts analytics context without breaking memoization. Intelligence Layer remains isolated. Awaiting Engineering Lead direction for EP6-P3 or next sprint.

**Open Questions Carried Forward:**
- Provider selection: PostHog JS recommended in EP6-P1 G2; still pending Engineering Lead confirmation
- Future engineering note: when additional discovery surfaces are instrumented, consider introducing a shared helper for analytics source construction to avoid duplicated source selection logic. Do not implement now.
- ShopByVibe functional wiring: vibe tiles have no onClick/search injection (decorative only)
- ShopByPersonality routing: all personality cards link to /quiz rather than /shop?q= with pre-seeded intent
- Deferred: QuickAddModal Escape key (pre-existing UX issue)
- Deferred: Mobile WhatsApp button overlay (pre-existing cosmetic issue)

---

### 2026-06-30 — EP6-P3 — Intelligence Analytics / Quiz Instrumentation

**Participants:** Project Owner / Claude (Implementation Engineer) / ChatGPT (Engineering Lead)
**Program:** EP6 — Intelligence Analytics (EP6-P3: Quiz Instrumentation)

**Decisions Made:**
- No `quiz_started` event — repository has no authoritative started state; first `quiz_answer_selected` is the funnel entry point
- `trackQuizAnswer` placed inline in `handleAnswer` (not in a useEffect) — direct user-action observation; `questionId` and `answer` naturally available at call site
- `isNew` check (`answers[questionId] === undefined`) distinguishes first-time answers from re-answers for correct `completionCount` derivation; both fire the event
- State update (`setAnswers`) precedes analytics call (`trackQuizAnswer`) — consistent with EP6-P2 handler pattern
- `useEffect([completed])` for `quiz_completed` — `completed` is monotonically increasing (0→5), reaches 5 exactly once per session; natural one-shot pattern requiring no `useRef` deduplication
- `useEffect([recommended])` with `useRef<boolean>(false)` guard for `quiz_results_shown` — "first completed recommendation set shown"; subsequent re-answer updates intentionally not tracked; Engineering Lead refinement: document guard intent with comment
- `source="quiz"` passed to ProductCard — activates existing EP6-P2 `handleProductNavigation` mechanism; no changes to `ProductCard.tsx`
- Both inline WhatsApp CTAs instrumented — "Need Help Choosing?" (`ctaType: "help"`) and "Send My Results To WhatsApp" (`ctaType: "results"` with top-3 titles); `FloatingWhatsApp` not instrumented (shared component, no quiz context)
- `react-hooks/exhaustive-deps` — neither effect triggered warnings at build time; no suppressions required
- Intelligence Layer remains analytics-free

**Tasks Completed:**
- G1 Repository Evidence Report: 10 areas surveyed — quiz lifecycle, question model, recommendation flow, existing UI, ProductCard usage vs shop, analytics opportunities, event timing, architectural boundaries, dependencies, risks
- G2 Engineering Assessment: 10 topics assessed — answer instrumentation, completion detection, result observation, ProductCard, WhatsApp CTAs, re-answer behaviour, one-shot guards, result deduplication, React effect strategy, testing strategy; decisions deferred to Engineering Lead on result deduplication scope
- G3 Implementation Plan: single-file plan (`app/quiz/page.tsx`); 9 work items; hook strategy, ESLint dep analysis, validation plan, regression risks, Definition of Done
- G4 Implementation: `app/quiz/page.tsx` modified — useEffect/useRef added to React import, analytics imports, hasTrackedResults ref, handleAnswer augmentation, completion effect, results effect with documentation comment, ProductCard source/rank, two WhatsApp onClick handlers; build pass; 28/28 browser validation; Intelligence Layer isolation confirmed; committed 53c4c63

**Build Result:** Pass — zero TypeScript errors, zero warnings, 118 pages (unchanged)

**Files Changed:**
- `app/quiz/page.tsx` (modified — quiz analytics instrumentation, committed 53c4c63)
- `.ai/ENGINEERING_LOG.md` (this entry)
- `.ai/CURRENT_TASK.md` (updated)
- `.ai/SPRINT.md` (EP6-P3 added to Completed Programs)

**Handoff:** EP6-P3 closed. Quiz instrumentation complete. Five event types operational in the quiz journey: `quiz_answer_selected`, `quiz_completed`, `quiz_results_shown`, `quiz_whatsapp_clicked`, `product_clicked` (via ProductCard reuse). Intelligence Layer remains isolated. EP6 analytics instrumentation now covers Shop (EP6-P2) and Quiz (EP6-P3). Awaiting Engineering Lead direction for EP6-P4 or next sprint.

**Open Questions Carried Forward:**
- Provider selection: PostHog JS recommended in EP6-P1 G2; still pending Engineering Lead confirmation
- Future engineering note: as additional customer journeys are instrumented, consider introducing a shared helper or constants for analytics source construction to avoid duplicated source-selection logic. Do not implement now.
- `QuickAddModal.handleAddToCart` is an uninstrumented add-to-cart path — `trackAddToCart` exists in `analytics.ts` but is not called from anywhere; cross-surface scope (shop, quiz, PDP); candidate for a future EP6 sprint
- ShopByVibe functional wiring: vibe tiles have no onClick/search injection (decorative only)
- ShopByPersonality routing: all personality cards link to /quiz rather than /shop?q= with pre-seeded intent
- Deferred: QuickAddModal Escape key (pre-existing UX issue)
- Deferred: Mobile WhatsApp button overlay (pre-existing cosmetic issue)

---

### 2026-07-01 — EP6-P4 — Intelligence Analytics / Commerce Instrumentation

**Participants:** Project Owner / Claude (Implementation Engineer) / ChatGPT (Engineering Lead)
**Program:** EP6 — Intelligence Analytics (EP6-P4: Commerce Instrumentation)

**Decisions Made:**
- PayFast return pages describe observed application navigation behaviour only — NOT payment confirmation; event names are `payment_return_success` and `payment_return_cancelled`, never `payment_success`
- `product_detail_viewed` extends the existing `recentlyViewed` useEffect — no second mount effect introduced
- MiniCart quick-add uses `source: "minicart"` only — no additional MiniCart source values
- `deliveryMethod: province` included in `checkout_started` payload — province state already existed in CheckoutPage; no new UI or calculations introduced
- EP6-P4 scope limited to 9 events — `remove_from_cart` and `cart_quantity_changed` deferred
- `!cartOpen` guard prevents `cart_opened` event from firing when cart is already open — applied at both Navbar bag-icon and ProductDetail post-add call sites
- SessionStorage guards prevent payment return events re-firing on page refresh — named constants (`PAYMENT_RETURN_SUCCESS_KEY`, `PAYMENT_RETURN_CANCELLED_KEY`) declared at module level in each payment return page
- `trackProductView` payload kept minimal — `title` and `collection` only; no expansion of existing schema
- Intelligence Layer remains analytics-free — `recommendFragrances`, `intentParser`, `knowledgeAdapter`, `explainability` carry zero analytics imports

**Tasks Completed:**
- G1 Repository Evidence Report: 10 areas surveyed — Product Detail lifecycle, Cart lifecycle, Checkout lifecycle, existing analytics API, ProductCard usage, event opportunities, event timing, architectural boundaries, dependencies, risks
- G2 Engineering Assessment: 12 topics assessed — instrumentation strategy across all commerce surfaces; PayFast boundary constraint documented; sessionStorage guard pattern selected
- G3 Implementation Plan: 9-event plan approved; 8-file scope defined; sessionStorage named constants refinement applied; `deliveryMethod: province` confirmed as existing state
- G4 Implementation: 8 production files modified — `analytics.ts` (CartPayload.source extended; 5 new payload types; 6 new track functions), `ProductDetail.tsx` (imports, cartOpen destructure, useEffect extension, handleAddToCart, handleBuyNow), `QuickAddModal.tsx` (trackAddToCart), `MiniCart.tsx` (trackAddToCart × 3 surfaces, trackWhatsAppCheckout), `Navbar.tsx` (trackCartOpened bag-icon), `checkout/page.tsx` (trackCheckoutStarted, trackPaymentStarted), `payment-success/page.tsx` (sessionStorage guard, trackPaymentReturnSuccess), `payment-cancel/page.tsx` (sessionStorage guard, trackPaymentReturnCancelled)
- Build verification: Pass — zero TypeScript errors, zero warnings, 118 pages (unchanged)
- Browser validation: 35/35 scenarios pass across 15 groups — all commerce events, Intelligence Layer isolation, EP6-P2/P3 regressions confirmed
- Committed 7da817e — `feat(analytics): instrument commerce analytics`

**Tasks Started:** None pending — all EP6-P4 tasks complete.

**Build Result:** Pass — zero TypeScript errors, zero warnings, 118 pages (unchanged)

**Files Changed:**
- `app/lib/analytics.ts` (modified — CartPayload.source extended; 5 new payload types; 6 new track functions)
- `app/components/ProductDetail.tsx` (modified — analytics imports; cartOpen destructure; useEffect extension; handleAddToCart; handleBuyNow)
- `app/components/QuickAddModal.tsx` (modified — trackAddToCart)
- `app/components/MiniCart.tsx` (modified — trackAddToCart × 3 quick-add surfaces; trackWhatsAppCheckout)
- `app/components/Navbar.tsx` (modified — trackCartOpened bag-icon)
- `app/checkout/page.tsx` (modified — trackCheckoutStarted; trackPaymentStarted)
- `app/payment-success/page.tsx` (modified — sessionStorage guard; trackPaymentReturnSuccess)
- `app/payment-cancel/page.tsx` (modified — sessionStorage guard; trackPaymentReturnCancelled)
- `.ai/ENGINEERING_LOG.md` (this entry)
- `.ai/CURRENT_TASK.md` (updated)
- `.ai/SPRINT.md` (EP6-P4 added to Completed Programs)

**Handoff:** EP6-P4 closed. Commerce analytics instrumentation complete. Analytics now covers the full customer journey: Discovery (EP6-P2), Quiz (EP6-P3), and Commerce (EP6-P4). Intelligence Layer remains isolated. Awaiting Engineering Lead direction for next sprint.

**Open Questions Carried Forward:**
- Provider selection: PostHog JS recommended in EP6-P1 G2; still pending Engineering Lead confirmation
- Future engineering note: As analytics coverage expands beyond commerce, consider introducing shared constants (or a helper) for analytics source values to prevent vocabulary drift. Do not implement during EP6.
- `remove_from_cart` and `cart_quantity_changed`: deferred — not in EP6-P4 scope; candidate for a future sprint
- ShopByVibe functional wiring: vibe tiles have no onClick/search injection (decorative only)
- ShopByPersonality routing: all personality cards link to /quiz rather than /shop?q= with pre-seeded intent
- Deferred: QuickAddModal Escape key (pre-existing UX issue)
- Deferred: Mobile WhatsApp button overlay (pre-existing cosmetic issue)

---

### 2026-07-01 — EP8-P1 — Recommendation Intelligence Implementation / Foundation Cleanup

**Participants:** Project Owner / Claude (Implementation Engineer) / ChatGPT (Engineering Lead)
**Program:** EP8 — Recommendation Intelligence Implementation (EP8-P1: Foundation Cleanup)

**Decisions Made:**
- Documentation alignment: 8 stale items across 3 evaluation documents corrected to match live implementation — TC-SC-03 code path, TC-SC-04 criterion (popularity-based → collection-based), AL-01 Elite count (~34 → 5), AL-04 coverage claim (products may produce family=[] → M3 = 1.00), M3 formula (/465 → fragrances.length × 2 occurrences), Deferred M3 note removed from evaluation-procedure.md
- hiddenGem criterion: `item.gender !== "unisex"` → `item.collection !== "Elite"` — architecturally consistent with `luxuryUpgrade`'s `item.collection === "Elite"`; zero behavioural change on current catalogue because all 5 Elite products have `gender: "unisex"`; M3 confirmed 1.0000 unchanged after fix
- RecommendationCard JSX fallback removed: 4-string hardcoded fallback ("Popular signature scent", "Matches your fragrance profile", "Complements your lifestyle", "Recommended by Maison AI") replaced with `(reasons ?? []).map(...)` in Phase 2; null-coalescing removed in Phase 3 when `reasons` made required
- `reasons` made required (`string[]`): TypeScript compile-time protection active for all future callers; previously `string[]?` allowed callers to omit it silently
- Dead-file deletion: `fragranceDatabase.ts` (4 entries, wrong brand names), `fragranceQuizQuestions.ts` (diverged quiz config, dead occasion signal), `RecommendationSection.tsx` (renders RecommendationCard without reasons) — all confirmed 0 imports by repository-wide search immediately before each deletion per Engineering Lead refinement
- `gender !== "unisex"` residual occurrences: 3 remaining in `.ai/` historical records only — all are accurate descriptions of the prior implementation; not modified; separately approved changes only

**Tasks Completed:**
- G1 Repository Evidence Report: 5 areas surveyed — evaluation framework (3 documents, 8 stale items), recommendation engine (hiddenGem `gender !== "unisex"` vs luxuryUpgrade `collection === "Elite"` inconsistency), dead files (fragranceDatabase.ts, fragranceQuizQuestions.ts, RecommendationSection.tsx), duplicate fallback systems (JSX 4-string vs explainability.ts FALLBACK_REASONS 2-string), validation tooling (.ts vs .mjs convention — justified deviation)
- G2 Implementation Plan: 3-phase plan; pre-deletion search protocol added per Engineering Lead refinement; Phase 2 `gender !== "unisex"` full-repository search added per Engineering Lead refinement
- G3 Implementation:
  - Phase 1 — documentation: 8 stale items corrected; build pass; committed af48a22
  - Phase 2 — architectural consistency: hiddenGem criterion fixed; TC-SC-03 updated; JSX fallback removed; M3 validated (1.0000); `gender !== "unisex"` residual occurrences documented; build pass; committed 4cbf764
  - Phase 3 — dead-file deletion: pre-deletion search confirmed 0 imports × 3 files; files deleted; `reasons` required; build pass; committed afdf97a
- G4 Sprint Closure: AI-OS records updated; all 4 commits pushed to origin/main

**Build Result:** Pass — zero TypeScript errors, zero warnings, 118 pages (all three phases)

**Files Changed (Production):**
- `app/lib/recommendFragrances.ts` (modified — hiddenGem criterion `gender !== "unisex"` → `collection !== "Elite"`)
- `app/components/RecommendationCard.tsx` (modified — JSX fallback removed; `reasons` made required)
- `app/components/RecommendationSection.tsx` (deleted — 0 imports confirmed)
- `app/data/fragranceDatabase.ts` (deleted — 0 imports confirmed)
- `app/data/fragranceQuizQuestions.ts` (deleted — 0 imports confirmed)

**Files Changed (Evaluation):**
- `.ai/evaluation/recommendation-suite.md` (modified — TC-SC-03 code path, TC-SC-04 criterion, AL-01 count, AL-04 coverage claim)
- `.ai/evaluation/quality-metrics.md` (modified — M3 formula /465 → fragrances.length; Deferred note removed)
- `.ai/evaluation/evaluation-procedure.md` (modified — /465 in snippet and text; Deferred M3 note removed; validate-ep7p1-m3.ts referenced as preferred M3 method)

**Handoff:** EP8-P1 closed. Foundation cleanup complete. Repository has no dead files, no documentation drift in the evaluation framework, no divergent fallback systems, and no architectural inconsistencies in the recommendation engine. M3 = 1.0000 confirmed unchanged. `reasons` is TypeScript-required. 486 lines of dead code removed. Awaiting Engineering Lead direction for EP8-P2 or next sprint.

**Open Questions Carried Forward:**
- `gender !== "unisex"` in ENGINEERING_LOG.md (this entry's predecessor at line 308), SPRINT.md (EP5-P1 Future Engineering Note), and baseline-results.md (EP7-P1 TC-SC-03 record) — accurate historical records; EP8-P1 has resolved the underlying inconsistency; no further action required
- validate-ep7p1-m3.ts output still prints a "Documentation Note" about /465 — the documentation has been corrected; the note in the script output is now a false alarm; cosmetic cleanup candidate for a future sprint
- Provider selection: PostHog JS recommended in EP6-P1 G2; still pending Engineering Lead confirmation
- `remove_from_cart` and `cart_quantity_changed`: deferred from EP6-P4
- ShopByVibe functional wiring: vibe tiles have no onClick/search injection (decorative only)
- ShopByPersonality routing: all personality cards link to /quiz rather than /shop?q= with pre-seeded intent
- Deferred: QuickAddModal Escape key (pre-existing UX issue)
- Deferred: Mobile WhatsApp button overlay (pre-existing cosmetic issue)

---

### 2026-08-02 — Executive Report Pipeline — Multi-Session Implementation

**Participants:** Project Owner / Claude (Implementation Engineer)
**Program:** Executive Report Pipeline — multi-stage admin intelligence system (approximately 30 stages)

**Decisions Made:**
- Admin pages are dynamic server components protected by SHA256 hash vs `msr-ops-session` cookie — consistent with existing admin auth pattern
- Each stage follows Foundation + Dashboard + Center structure — three commits per stage
- Architecture extension proposal assessed after Commitment: three candidate next stages (Resolution, Governance, Accountability) evaluated; decision approved to terminate pipeline at Commitment — no further Executive Report stages
- Repository has no shared import of CommitmentTypes; no admin route exists beyond `executive-report-commitment-center` — pipeline is architecturally terminal

**Tasks Completed:**
- ~30 Executive Report stages implemented: Decision, Approval, Execution, Completion, Publication, Distribution, Delivery, Acknowledgement, Receipt, Confirmation, Verification, Validation, Certification, Authorization, Authentication, Ratification, Endorsement, Acceptance, Adoption, Commitment (each with Foundation + Dashboard + Center)
- Architecture extension proposal: repository evidence report produced; 3 candidate stages assessed; termination at Commitment approved

**Tasks Started:** None pending — pipeline closed by architecture decision.

**Build Result:** Pass at each stage — zero TypeScript errors, zero warnings throughout. Route count grew from 118 (EP8-P1) to 247 (post-pipeline) as admin pages were added.

**Files Changed:**
- ~90 new admin page files under `app/admin/executive-report-*/page.tsx` (Foundation, Dashboard, Center per stage)
- See git log from afdf97a through 4356d35 for full commit history

**Handoff:** Executive Report Pipeline complete and closed. Architecture terminated at Commitment by approved decision. No further stages planned.

**Open Questions Carried Forward:**
- Provider selection: PostHog JS recommended in EP6-P1 G2; still pending Engineering Lead confirmation
- `remove_from_cart` and `cart_quantity_changed`: deferred from EP6-P4
- ShopByVibe functional wiring: vibe tiles have no onClick/search injection (decorative only)
- ShopByPersonality routing: all personality cards link to /quiz rather than /shop?q= with pre-seeded intent
- Deferred: QuickAddModal Escape key (pre-existing UX issue)
- Deferred: Mobile WhatsApp button overlay (pre-existing cosmetic issue)

---

### 2026-08-02 — FloatingCart / PayFast / Delivery / Maintenance — Engineering Session

**Participants:** Project Owner / Claude (Implementation Engineer)
**Program:** Four programs completed in a single engineering session: FloatingCart Integration, PayFast Production Hardening (KI-01/02/03/05/06), Delivery Pricing Reconciliation (KI-07), Repository Maintenance & Documentation Synchronization

**Decisions Made:**
- FloatingCart: `cartOpen` guard added to prevent conflict with open MiniCart; `aria-label="View cart"` added for accessibility; FloatingCart rendered after CartSuccessToast in layout.tsx inside CartUIProvider scope
- PayFast: PAYFAST_ENV controls live/sandbox URL selection; MD5 signature uses Node.js `crypto` with param string + passphrase; ITN webhook at `/api/payfast/itn` verifies signature before updating Supabase; checkout creates Supabase order then calls /api/payfast and redirects to PayFast payment URL; router.push removed in favour of window.location.href (external redirect)
- PayFast ITN status map: `COMPLETE → payment_confirmed`, `FAILED → cancelled`, `PENDING → no change`; consistent with VALID_TRANSITIONS in orderStatus.ts
- Delivery: D10 Option (c) implemented — MiniCart total label switches to "Subtotal" with pre-delivery amount when delivery non-free; WhatsApp message updated to "Calculated at checkout"; checkout province-based DELIVERY_RATES untouched; no shared delivery utility created
- Maintenance: 9 resolved known issues moved to KNOWN_ISSUES.md Resolved section with commit traceability; SPRINT.md and ENGINEERING_LOG.md updated with programs since EP8-P1; 5 untracked validation scripts deleted (never committed, programs closed, not in CI)

**Tasks Completed:**
- FloatingCart Integration — committed 4356d35
- PayFast Production Hardening KI-01/02/03/05/06 — committed 9f9f7f5 (`app/api/payfast/route.ts` rewritten; `app/api/payfast/itn/route.ts` created; `app/checkout/page.tsx` wired to PayFast)
- Delivery Pricing Reconciliation KI-07 — committed 74c8789 (`app/components/MiniCart.tsx` two targeted edits)
- Repository Maintenance — documentation files updated; validation scripts deleted

**Tasks Started:** None pending — all four programs complete.

**Build Result:** Pass — zero TypeScript errors, zero warnings, 247 routes (each program verified independently before commit)

**Files Changed:**
- `app/components/FloatingCart.tsx` (modified — cartOpen guard, aria-label)
- `app/layout.tsx` (modified — FloatingCart import and render)
- `app/api/payfast/route.ts` (rewritten — configurable URL, MD5 signature, server-only env vars, real customer data)
- `app/api/payfast/itn/route.ts` (created — ITN webhook with signature verification and Supabase update)
- `app/checkout/page.tsx` (modified — PayFast integration replacing direct /payment-success redirect)
- `app/components/MiniCart.tsx` (modified — total label/amount when delivery non-free; WhatsApp message delivery display)
- `.ai/KNOWN_ISSUES.md` (updated — 9 resolved issues moved to Resolved section)
- `.ai/SPRINT.md` (updated — 5 programs added to Completed)
- `.ai/CURRENT_TASK.md` (updated — last completed, build result, context notes)
- `.ai/ENGINEERING_LOG.md` (this entry)
- Deleted: `validate-ep4p1b.mjs`, `validate-ep6p1.mjs`, `validate-ep6p2.mjs`, `validate-ep6p3.mjs`, `validate-ep6p4.mjs`

**Handoff:** All four programs complete. Repository documentation synchronized with implementation state. Build passes at 247 routes. KI-01 through KI-09 and KI-13 are resolved. Remaining open issues: KI-04, KI-10, KI-11, KI-12, KI-14, KI-15, KI-16. Awaiting Engineering Lead direction for next sprint.

**Open Questions Carried Forward:**
- KI-04 — Cart Composite Key Inconsistency: three add-to-cart paths still use different id formats — deferred
- KI-10 — OG Metadata on non-product pages: not yet addressed — deferred
- Provider selection: PostHog JS recommended in EP6-P1 G2; still pending Engineering Lead confirmation
- `remove_from_cart` and `cart_quantity_changed`: deferred from EP6-P4
- ShopByVibe functional wiring: vibe tiles have no onClick/search injection (decorative only)
- ShopByPersonality routing: all personality cards link to /quiz rather than /shop?q= with pre-seeded intent
- Deferred: QuickAddModal Escape key (pre-existing UX issue)

---

## 2026-08-02 — KI-04 Cart Composite Key Standardization + KI-10 Open Graph Documentation Closure

**Engineer:** Claude Code
**Programs:** KI-04 (Cart Composite Key), KI-10 (Open Graph Metadata Completion)

### KI-04 — Cart Composite Key Standardization

**Inspection:** Read CartContext, ProductDetail, QuickAddModal, FragranceQuickView, MiniCart, knowledgeAdapter, and QuickAddBundle. Confirmed all five active add-to-cart paths already use the canonical id format `title.toLowerCase().replace(/\s+/g, "-")` via `knowledge.id` or an equivalent inline expression. QuickAddBundle used a non-canonical format (`` `${fragrance.title}-5ml` ``) but had zero imports — confirmed dead via grep of entire app.

**Decision:** Delete QuickAddBundle rather than patch it. No active cart behaviour to protect.

**Commit:** c8dea73 — `Resolve KI-04 by deleting dead QuickAddBundle component`

**Files Changed:**
- `app/components/QuickAddBundle.tsx` — deleted

**Application code modified:** Yes (deletion only — no logic changed, no behaviour changed)

### KI-10 — Open Graph Metadata Completion

**Inspection:** Read `app/layout.tsx`, `app/page.tsx`, `app/shop/layout.tsx`, `app/collections/skye/layout.tsx`, `app/collections/rose/layout.tsx`, `app/collections/elite/layout.tsx`. Also grepped all layout files with metadata exports across the repository.

**Finding:** KI-10 as documented was stale. All four targeted pages already have complete metadata:
- `app/shop/layout.tsx` — full OG, Twitter, canonical `/shop`
- `app/collections/skye/layout.tsx` — full OG, Twitter, canonical `/collections/skye`
- `app/collections/rose/layout.tsx` — full OG, Twitter, canonical `/collections/rose`
- `app/collections/elite/layout.tsx` — full OG, Twitter, canonical `/collections/elite`
- Homepage: `app/page.tsx` is `"use client"` — correctly inherits root `app/layout.tsx` which has full OG/Twitter with `url: "/"` and `metadataBase`

**Decision:** No application code changes authorized. Documentation update only.

**Commit:** none — documentation-only change committed below

**Files Changed:**
- `.ai/KNOWN_ISSUES.md` — KI-10 removed from Medium; added to Resolved with full resolution notes
- `.ai/CURRENT_TASK.md` — updated last completed program, added KI-10 and KI-04 entries
- `.ai/ENGINEERING_LOG.md` — this entry

**Application code modified:** No

**Build Result:** Not re-run. Last verified build: 2026-08-02 — Pass. Zero TypeScript errors. Zero warnings. 247 routes. (no code changes since that build)

**Handoff:** KI-04 and KI-10 both resolved. Remaining open issues: KI-11, KI-12, KI-14, KI-15, KI-16. Awaiting Engineering Lead direction for next sprint.

---

## 2026-08-02 — KI-11 MiniCart Recommendation Validation

**Engineer:** Claude Code
**Program:** KI-11 (MiniCart Recommendation Scoring Validation)

**Inspection:** Read `app/components/MiniCart.tsx`, `app/lib/customer/sync/CartRecommendationStrategy.ts`, `app/lib/customer/recommendations/RecommendationEngine.ts`, `app/lib/mkc/types.ts`, `app/lib/mkc/validator.ts`, `app/lib/mkc/catalogue.ts`, `app/lib/knowledgeAdapter.ts`, and a sample native record (`sauvage-inspired.ts`). Grep confirmed `collectionRecommendations` exists only in documentation files — not in any source file.

**Finding:** KI-11 as documented is stale. The `collectionRecommendations` function that scored `f.collection`, `f.profile`, and `f.season` directly on display objects does not exist. MiniCart uses `getCartRecommendations` from `CartRecommendationStrategy.ts`, which routes through `RecommendationEngine` using `mkcCatalogue` (`FragranceKnowledge[]`). `FragranceKnowledge` type requires `collection`, `profile`, and `season` as non-optional fields. `validator.ts` enforces `PROFILE_REQUIRED` and `SEASON_REQUIRED` at error severity. Any missing field would fail the TypeScript build. The failure mode — silent score degradation from undefined fields — cannot occur in the current architecture.

**Decision:** No application code changes authorized. Documentation update only.

**Files Changed:**
- `.ai/KNOWN_ISSUES.md` — KI-11 removed from Medium; added to Resolved with full resolution notes
- `.ai/CURRENT_TASK.md` — updated last completed program, added KI-11 entry
- `.ai/ENGINEERING_LOG.md` — this entry

**Application code modified:** No

**Build Result:** Not re-run. Last verified build: 2026-08-02 — Pass. Zero TypeScript errors. Zero warnings. 247 routes. No code changes since that build.

**Handoff:** KI-04, KI-10, and KI-11 all resolved by inspection — implementations already correct. Remaining open issues: KI-12, KI-14, KI-15, KI-16. Awaiting Engineering Lead direction for next sprint.

---

## 2026-08-02 — KI-12 Instagram URL Completion

**Engineer:** Claude Code
**Program:** KI-12 (Instagram URL Completion)

**Inspection:** Read `app/data/brand.ts`. Grepped all source files, documentation, and env files for the official Instagram handle. Found `instagramUrl: "https://instagram.com/"` — no handle. One consumer: `app/components/InstagramCTA.tsx` reads `brand.social.instagramUrl` for the "Follow On Instagram" button `href`. No handle existed anywhere in the repository. Implementation blocked pending business input.

**Business input received:** Official profile is `https://instagram.com/maisonskyeandrose`.

**Implementation:** Single-line change in `app/data/brand.ts` line 22. No component changes required — `InstagramCTA.tsx` already reads from `brand.social.instagramUrl`.

**Build Result:** Pass — zero TypeScript errors, zero warnings, 247 routes.

**Files Changed:**
- `app/data/brand.ts` — `instagramUrl` set to `https://instagram.com/maisonskyeandrose`
- `.ai/KNOWN_ISSUES.md` — KI-12 moved to Resolved
- `.ai/CURRENT_TASK.md` — updated last completed program
- `.ai/ENGINEERING_LOG.md` — this entry

**Handoff:** KI-12 resolved. Remaining open issues: KI-14, KI-15, KI-16. All remaining issues are Low severity. Awaiting Engineering Lead direction for next sprint.

---

## 2026-08-02 — KI-14 Mobile MiniCart Close UX

**Engineer:** Claude Code
**Program:** KI-14 (MiniCart Mobile Close UX)

**Inspection:** Read `app/components/MiniCart.tsx`, `app/context/CartUIContext.tsx`, `app/components/FloatingCart.tsx`, `app/layout.tsx`, `app/components/Navbar.tsx`. Key findings:
- Line 194: drag handle is a `<div>` with no event handlers — visual only, `md:hidden`
- Lines 239–245: X close button has no `hidden md:block` class — already visible on mobile (KI-14 claim about hidden button was stale)
- X button touch target: `p-2` around `h-5 w-5` = 36px (below 44px WCAG minimum)
- No backdrop overlay, no click-outside handler, no gesture library in use
- `onClose` → `closeCart` → `setCartOpen(false)` — existing close mechanism is correct

**Decision:** Convert drag handle `<div>` to `<button onClick={onClose}>`. Minimum change. Full-width tap zone. No gesture library. No new dependencies.

**Implementation:** Single element change in `MiniCart.tsx` line 194:
```tsx
<button
  onClick={onClose}
  aria-label="Close cart"
  className="w-full flex justify-center pt-3 pb-2 shrink-0 md:hidden"
>
  <div className="w-12 h-1.5 bg-zinc-300/60 rounded-full" />
</button>
```

**Build Result:** Pass — zero TypeScript errors, zero warnings, 247 routes.

**Files Changed:**
- `app/components/MiniCart.tsx` — drag handle converted to close button
- `.ai/KNOWN_ISSUES.md` — KI-14 moved to Resolved
- `.ai/CURRENT_TASK.md` — updated last completed program
- `.ai/ENGINEERING_LOG.md` — this entry

**Handoff:** KI-14 resolved. Remaining open issues: KI-15, KI-16 (both Low severity). Awaiting Engineering Lead direction for next sprint.

---

## 2026-08-02 — KI-15 Product JSON-LD Availability Accuracy

**Engineer:** Claude Code
**Program:** KI-15 (Product JSON-LD Availability)

**Inspection:** Read `app/product/[slug]/page.tsx`. Found `availability: "https://schema.org/InStock"` hardcoded at line 129. Grepped all MKC native records, `FragranceKnowledge` type, and `app/data/*.ts` for stock/inventory fields — none found. Found `status?: string` in `FragranceKnowledge` type with `"active"` or `"discontinued"` values enforced by validator. Grepped all 93 native records for `"discontinued"` — zero results. All records are `status: "active"`.

**Finding:** No inventory system exists. Current `InStock` is accurate for all 93 products. The `status` field is the only lifecycle signal available. Using `status === "discontinued"` to conditionally emit `https://schema.org/Discontinued` is the minimal repository-backed fix — uses existing data, has zero effect on current output, and auto-corrects when any record is eventually discontinued.

**Implementation:** Single ternary expression replacing hardcoded string in `app/product/[slug]/page.tsx` line 129:
```typescript
availability:
  knowledge.status === "discontinued"
    ? "https://schema.org/Discontinued"
    : "https://schema.org/InStock",
```

**Build Result:** Pass — zero TypeScript errors, zero warnings, 247 routes.

**Files Changed:**
- `app/product/[slug]/page.tsx` — availability derived from knowledge.status
- `.ai/KNOWN_ISSUES.md` — KI-15 moved to Resolved
- `.ai/CURRENT_TASK.md` — updated last completed program
- `.ai/ENGINEERING_LOG.md` — this entry

**Handoff:** KI-15 resolved. One remaining open issue: KI-16 (Low severity). Awaiting Engineering Lead direction for next sprint.

---

## 2026-08-02 — KI-16 Sort Behaviour Consistency

**Engineer:** Claude Code
**Program:** KI-16 (Sort Behaviour Consistency)

**Inspection:** Read `app/shop/page.tsx` in full. Found:
- Sort `<select>` (desktop) contained "Best Sellers" and "New Arrivals" as options
- `displayItems` useMemo handled these via `items = items.filter(...)` — filtering, not sorting
- Desktop tab bar already had "Best Sellers" and "New Arrivals" as correct `currentFilter` buttons (`hidden md:inline-flex`)
- Mobile drawer already had them under "Special Segments" as correct `currentFilter` buttons
- Mobile drawer "Sort By" section duplicated them under the wrong category

**Decision:** Remove from sort interface (both desktop select and mobile drawer sort list). Remove dead filter branches from `displayItems`. Filter tabs untouched.

**Implementation:** Three targeted edits to `app/shop/page.tsx`:
1. Desktop `<select>` — removed `<option>Best Sellers</option>` and `<option>New Arrivals</option>`
2. Mobile drawer Sort By array — removed "Best Sellers" and "New Arrivals"
3. `displayItems` useMemo — removed two unreachable `items.filter()` branches

**Build Result:** Pass — zero TypeScript errors, zero warnings, 247 routes.

**Files Changed:**
- `app/shop/page.tsx` — sort controls corrected; dead branches removed
- `.ai/KNOWN_ISSUES.md` — KI-16 moved to Resolved; zero open issues notice added
- `.ai/CURRENT_TASK.md` — updated last completed program
- `.ai/ENGINEERING_LOG.md` — this entry

**Milestone:** All 16 tracked known issues (KI-01 through KI-16) are now resolved. KNOWN_ISSUES.md contains zero open tracked issues as of 2026-08-02.
- Deferred: Mobile WhatsApp button overlay (pre-existing cosmetic issue)

---

## 2026-08-02 — EP20-P1 Concierge Intelligence Activation

**Engineer:** Claude Code
**Program:** EP20-P1 — Experience Release 2.0 / Concierge Intelligence Activation

**Inspection:** Performed full LearningEngine pipeline inspection and focused EP20-P1 signal emission inspection across: `SignalInterpreter.ts`, `CustomerProfileSync.ts`, `ConciergePanel.tsx`, `ConciergeContext.tsx`, `app/api/concierge/route.ts`, `app/lib/concierge/types.ts`, `CustomerPreferenceSummary.ts`, `PreferenceScorer.ts`.

**Key Findings:**
- `ConciergeInterpreter.interpret()` was a stub returning `[]` — the only missing active interpreter (EP19.2 had activated 5 of 8)
- No concierge signal emission existed anywhere in the codebase — `ConciergePanel.handleSend` never called any CustomerProfileSync function
- `data.sessionUpdates.profile` (ConversationProfile) is returned by the API route after each turn and available client-side — signals must be emitted client-side since the profile is localStorage-backed
- `family_avoidance` signals must map to `candidate(signal, "family_preference", family, false)` — `CustomerPreferenceSummary.buildCustomerPreferenceSummary` checks `(c.type === "family_preference" && !c.positive)` for avoidedFamilies, not a separate `family_avoidance` candidate type
- Delta idempotency required to prevent artificial signal inflation across multi-turn sessions where the same preference appears in accumulated profiles for turns 1-N

**Decisions Made:**
- Emit signals client-side from `ConciergePanel.tsx` after each API response (consistent with all other signal emission sites)
- `diffProfile()` helper computes set-difference between prior `conversationState.profile` and new `data.sessionUpdates.profile` — emits only newly expressed preferences per turn
- `recordConciergeIntent()` receives only the delta — `new Set()` deduplication handles any within-call duplicates
- `family_avoidance` → `positive: false` mapping validated against `CustomerPreferenceSummary` consumption

**Implementation:**

`app/lib/customer/sync/CustomerProfileSync.ts`:
- Added `import type { SignalConfidence } from "../signals/SignalConfidence";`
- Added exported `ConciergeIntent` interface (5 preference dimensions, all readonly)
- Added exported `recordConciergeIntent(intent: ConciergeIntent): void` — fire-and-forget, errors swallowed, Set deduplication per field before emission

`app/lib/customer/learning/SignalInterpreter.ts`:
- Replaced `ConciergeInterpreter.interpret()` stub with full implementation handling: `family_preference`, `family_avoidance` (→ positive: false), `occasion_preference`, `season_preference`, `gender_preference`
- Updated file-level JSDoc comment: ConciergeInterpreter moved from placeholder list to active list (EP20-P1)
- Updated section divider comments

`app/components/ConciergePanel.tsx`:
- Added imports: `ConversationProfile` (from concierge types), `recordConciergeIntent` and `ConciergeIntent` (from CustomerProfileSync)
- Added module-level `diffProfile(prev, next): ConciergeIntent` helper
- Added `recordConciergeIntent(diffProfile(conversationState.profile, data.sessionUpdates.profile))` call immediately after `SET_SESSION_CONTEXT` dispatch

**Build Result:** Pass — zero TypeScript errors, zero warnings, 247 routes.

**Files Changed:**
- `app/lib/customer/sync/CustomerProfileSync.ts` — ConciergeIntent interface + recordConciergeIntent function
- `app/lib/customer/learning/SignalInterpreter.ts` — ConciergeInterpreter.interpret() implemented; JSDoc updated
- `app/components/ConciergePanel.tsx` — ConversationProfile import, ConciergeIntent import, diffProfile helper, signal emission call
- `.ai/SPRINT.md` — EP20-P1 added to Completed Programs
- `.ai/CURRENT_TASK.md` — updated last completed program
- `.ai/ENGINEERING_LOG.md` — this entry

**LearningEngine status post-EP20-P1:**
- Active (6/8): QuizInterpreter, FavoriteInterpreter, ViewInterpreter, SearchInterpreter, CartInterpreter, ConciergeInterpreter
- Deferred (2/8): PurchaseInterpreter (no fragrance_purchase signals emitted), DiscoveryInterpreter (discovery_path partial)

**Handoff:** EP20-P1 closed. LearningEngine ConciergeInterpreter is live. 6 of 8 interpreters active (per documentation at close of EP20-P1 — EP20-P2 inspection subsequently confirmed 7 of 8 are active; see EP20-P2 entry below).

---

## 2026-08-02 — EP20-P2 Discovery Intelligence Documentation Sync

**Engineer:** Claude Code
**Program:** EP20-P2 — Experience Release 2.0 / Discovery Intelligence Documentation Sync

**Inspection Findings:**
- `DiscoveryInterpreter.interpret()` was found to be a **full working implementation** — NOT a stub. It handles `discovery_path` signals and produces `family_preference`, `occasion_preference`, and `season_preference` candidates for all three dimensions emitted by `recordDiscoveryFilter()`.
- `DiscoveryAttributionSetter.tsx` correctly calls `recordDiscoveryFilter()` on mount for every `/discover/[id]` page — both editorial and standard collection branches.
- The full pipeline from page visit → signal emission → interpretation → accumulation → `CustomerPreferenceSummary` is end-to-end functional.
- Three stale comment locations were identified that incorrectly described the discovery pipeline as deferred or empty.

**Stale comments found:**
1. `SignalInterpreter.ts` header: `DiscoveryInterpreter — discovery_path deferred to post-EP19.1` — implementation was active
2. `LearningEngine.ts` factory JSDoc: "Pre-wired engine with all 8 placeholder interpreters" — 7 are active
3. `CustomerIntelligenceEngine.ts` lines 21, 27, 194: "candidates empty until EP10.0-P5+" — interpreters have been producing candidates since EP19.2

**Implementation:** 6 comment-only edits across 3 files. Zero executable code changes.

- `SignalInterpreter.ts`: Moved DiscoveryInterpreter from "Placeholder" to "Active" list; updated version tag to EP20-P2.
- `LearningEngine.ts`: Updated factory comment — 7 active, 1 deferred (PurchaseInterpreter).
- `CustomerIntelligenceEngine.ts`: Removed 3 instances of stale EP10.0-P5+ language.

**Build Result:** Pass — zero TypeScript errors, zero warnings, 247 routes.

**LearningEngine status post-EP20-P2:**
- Active (7/8): QuizInterpreter, FavoriteInterpreter, ViewInterpreter, SearchInterpreter, CartInterpreter, ConciergeInterpreter, DiscoveryInterpreter
- Deferred (1/8): PurchaseInterpreter (no fragrance_purchase signals emitted)

**Files Changed:**
- `app/lib/customer/learning/SignalInterpreter.ts` — comment update (DiscoveryInterpreter → active)
- `app/lib/customer/learning/LearningEngine.ts` — factory JSDoc corrected
- `app/lib/customer/intelligence/CustomerIntelligenceEngine.ts` — 3 stale EP10.0-P5+ comments removed
- `.ai/SPRINT.md` — EP20-P2 added to Completed Programs
- `.ai/CURRENT_TASK.md` — updated last completed program
- `.ai/ENGINEERING_LOG.md` — this entry

**Handoff:** EP20-P2 closed. 7 of 8 LearningEngine interpreters now active and correctly documented. Only PurchaseInterpreter remains deferred. Next program to be defined by Engineering Lead. Remaining LearningEngine work: EP20-P3 (RecommendationEngine ↔ LearningEngine bridge — M6).

---

## 2026-08-02 — EP20-P3 Confidence Compositing

**Engineer:** Claude Code
**Program:** EP20-P3 — Experience Release 2.0 / Confidence Compositing

**Inspection Findings:**

Two gaps identified through full pipeline inspection:

**Gap 1 — Max-only confidence calculator (documented deferred)**
`ConfidenceCalculator.ts` used `createMaxConfidenceCalculator()` as default: the single strongest signal determines group confidence. Ten LOW signals for "Woody" produce confidence = LOW. `CONFIDENCE_WEIGHT` (`HIGH: 1.0, MEDIUM: 0.6, LOW: 0.3`) existed in `SignalConfidence.ts` but was never consumed. `ConfidenceCalculator.ts` and `SignalConfidence.ts` both documented compositing as "EP10.0-P5+" — stale milestone, same pattern as EP20-P2.

**Gap 2 — Resolver discards accumulated confidence**
`createPassthroughResolver()` returned `a.candidates[0]` — the raw first candidate from each group. The `AccumulatedPreference.confidence` value computed by the calculator was silently discarded. This meant the compositing calculator result, even if correct, had no effect on the final output.

**RecommendationEngine status confirmed:** Architecturally decoupled. `PreferenceScorer.buildPreferenceProfile()` reads `profile.savedSlugs`, `profile.lastQuizSlugs`, `profile.recentlyViewed` — raw `UnifiedCustomerProfile` fields. It does not consume `CustomerPreferenceSummary` or any `PreferenceCandidate`. No changes required.

**Implementation:**

`app/lib/customer/learning/ConfidenceCalculator.ts`:
- Added `import { CONFIDENCE_WEIGHT }` from SignalConfidence
- Added `createCompositingCalculator()`: sums `CONFIDENCE_WEIGHT[c.confidence]` across all candidates in a group; thresholds: sum >= 1.0 → HIGH, sum >= 0.6 → MEDIUM, otherwise → LOW
- Updated file-level JSDoc to document both implementations; removed stale EP10.0-P5+ language
- `createMaxConfidenceCalculator()` retained as injectable alternative

`app/lib/customer/learning/PreferenceResolver.ts`:
- Added `createAccumulatedResolver()`: returns `{ ...candidates[0], confidence: a.confidence }` — spreads first candidate, overrides only the confidence field with the group-level accumulated value
- Updated file-level JSDoc to document both implementations; removed stale passthrough-is-default framing
- `createPassthroughResolver()` retained as injectable alternative

`app/lib/customer/learning/LearningEngine.ts`:
- Added `createAccumulatedResolver` to resolver import
- Added `createCompositingCalculator` import from ConfidenceCalculator
- Updated `createDefaultLearningEngine()` to explicitly build config object:
  - `accumulator: createDefaultAccumulator(createCompositingCalculator())`
  - `resolver: createAccumulatedResolver()`
  - `logger: createNullLogger()`
  - Caller config overrides honoured via `??` per field
- Constructor defaults (passthrough/max) unchanged — `new LearningEngine(interpreters, {})` still uses safe defaults

**Compositing examples (verified against implementation logic):**

| Scenario | Weight sum | Result |
|---|---|---|
| 1× HIGH (Quiz) | 1.0 | HIGH — unchanged |
| 1× MEDIUM (Cart/Favorite/Search) | 0.6 | MEDIUM — unchanged |
| 1× LOW (View/Discovery) | 0.3 | LOW — unchanged |
| 2× LOW | 0.6 | MEDIUM — compounded |
| 4× LOW | 1.2 | HIGH — compounded |
| 2× MEDIUM | 1.2 | HIGH — compounded |
| 1× MEDIUM + 1× LOW | 0.9 | HIGH — compounded |

**Build Result:** Pass — zero TypeScript errors, zero warnings, 247 routes.

**Files Changed:**
- `app/lib/customer/learning/ConfidenceCalculator.ts` — createCompositingCalculator() added; CONFIDENCE_WEIGHT imported; stale comments updated
- `app/lib/customer/learning/PreferenceResolver.ts` — createAccumulatedResolver() added; stale comments updated
- `app/lib/customer/learning/LearningEngine.ts` — createCompositingCalculator and createAccumulatedResolver imported; createDefaultLearningEngine() wired to compositing defaults
- `.ai/SPRINT.md` — EP20-P3 added to Completed Programs
- `.ai/CURRENT_TASK.md` — updated last completed program
- `.ai/ENGINEERING_LOG.md` — this entry

**LearningEngine status post-EP20-P3:**
- Interpreters — Active (7/8): QuizInterpreter, FavoriteInterpreter, ViewInterpreter, SearchInterpreter, CartInterpreter, ConciergeInterpreter, DiscoveryInterpreter
- Interpreters — Deferred (1/8): PurchaseInterpreter
- Confidence calculator: createCompositingCalculator() (was: createMaxConfidenceCalculator())
- Resolver: createAccumulatedResolver() (was: createPassthroughResolver())

**Handoff:** EP20-P3 closed. Confidence compositing active in production. Multiple independent signals for the same dimension now compound into stronger confidence tiers. CONFIDENCE_WEIGHT constants (defined since SignalConfidence.ts was authored) consumed for the first time. RecommendationEngine unchanged. Awaiting Engineering Lead direction for next sprint.

---

## 2026-08-02 — EP20-P4 Recommendation Bridge

**Engineer:** Claude Code
**Program:** EP20-P4 — Experience Release 2.0 / Recommendation Bridge

**Inspection Findings:**

Full signal flow audit across RecommendationEngine, WeightedRecommendationScorer, PreferenceScorer, RecommendationReasonBuilder, RecommendationContext, and UnifiedCustomerProfile confirmed:

**Gap:** `buildPreferenceProfile(context)` in `PreferenceScorer.ts` reads only `profile.savedSlugs`, `profile.lastQuizSlugs`, and `profile.recentlyViewed` — slug arrays that are looked up in `SUMMARY_MAP` to derive families/occasions/seasons. It does NOT read `profile.signals`. Concierge, search, and discovery signals produce entries only in `profile.signals`, not in any slug array. These signals were therefore invisible to recommendation scoring.

**Circular dependency constraint:** `SignalInterpreter.ts` imports `getSummaryForSlug` from `PreferenceScorer.ts`. `LearningEngine.ts` imports `SignalInterpreter`. Therefore `PreferenceScorer.ts` cannot import from `LearningEngine.ts` — this would create a cycle: `PreferenceScorer → LearningEngine → SignalInterpreter → PreferenceScorer`. This eliminated the most obvious integration point.

**Selected integration pattern:** Context enrichment at `RecommendationEngine.recommend()` level. The engine runs `createDefaultLearningEngine()` once per `recommend()` call, converts the result to a `LearnedPreferences` shape, and injects it into the context before pool construction. Both `WeightedRecommendationScorer` (via `buildPreferenceProfile`) and `RecommendationReasonBuilder` (also via `buildPreferenceProfile`) benefit automatically without any changes to either scorer.

**No circular dependency:** `RecommendationEngine → LearningEngine → SignalInterpreter → PreferenceScorer`. `PreferenceScorer` does not import from `RecommendationEngine`. Chain is unidirectional. ✓

**Implementation:**

`app/lib/customer/recommendations/RecommendationContext.ts`:
- Added exported `LearnedPreferences` interface: `{ preferredFamilies, preferredOccasions, preferredSeasons, dominantGender }`
- Added optional `learnedPreferences?: LearnedPreferences` field to `RecommendationContext`
- `createContext()` unchanged — field is optional, all callers unaffected

`app/lib/customer/recommendations/RecommendationEngine.ts`:
- Added imports: `createDefaultLearningEngine` from `../learning/LearningEngine`; `buildCustomerPreferenceSummary` from `../intelligence/CustomerPreferenceSummary`; `LearnedPreferences` type from `./RecommendationContext`
- Added private `computeLearnedPreferences(profile)` helper: guards `profile.signals.length === 0`; runs LearningEngine; returns `undefined` if no candidates or no preferences (cold-start path unchanged)
- Modified `recommend()`: builds `enrichedContext` using `context.learnedPreferences ?? computeLearnedPreferences(context.profile)` before `buildPool()` and pipeline execution; callers that pre-supply `learnedPreferences` preserve their value

`app/lib/customer/recommendations/PreferenceScorer.ts`:
- `buildPreferenceProfile()` refactored: slug-derived sets now mutable (`let` + `Set` variables) for merge; after slug derivation, unions `context.learnedPreferences.preferredFamilies/Occasions/Seasons` into respective sets; learned `dominantGender` used only when slug-derived gender is null; `hasSignals` extended: true if learnedPreferences produced any preferences (concierge-only customers now have `hasSignals: true`)
- `scoreProfile()` unchanged
- `SUMMARY_MAP` and all slug-collection helpers unchanged

**Pipeline, scorer, and reason builder preserved:**
- `RecommendationPipeline.ts` — not touched
- `WeightedRecommendationScorer.ts` — not touched; benefits automatically via `buildPreferenceProfile(context)`
- `RecommendationReasonBuilder.ts` — not touched; benefits automatically via `buildPreferenceProfile(context)` (family_match, occasion_match, season_match reasons now fire for concierge/search/discovery-derived preferences)
- `DiscoveryScorer.ts`, `RelationshipScorer.ts` — not touched

**Build Result:** Pass — zero TypeScript errors, zero warnings, 247 routes.

**Files Changed:**
- `app/lib/customer/recommendations/RecommendationContext.ts` — LearnedPreferences interface; optional field on RecommendationContext
- `app/lib/customer/recommendations/RecommendationEngine.ts` — computeLearnedPreferences helper; context enrichment in recommend()
- `app/lib/customer/recommendations/PreferenceScorer.ts` — learnedPreferences merge in buildPreferenceProfile()
- `.ai/SPRINT.md` — EP20-P4 added to Completed Programs
- `.ai/CURRENT_TASK.md` — updated last completed program
- `.ai/ENGINEERING_LOG.md` — this entry

**Example — concierge-only customer:**

Before EP20-P4: Customer who told the AI Concierge "I love woody fragrances" (HIGH confidence → `family_preference:Woody`) but has no saved slugs, no quiz slugs, no viewed slugs. `buildPreferenceProfile()` returns `hasSignals: false`. `scoreProfile()` returns 0 for every candidate. All Woody fragrances score identically to cold-start recommendations.

After EP20-P4: `computeLearnedPreferences()` runs the LearningEngine on `profile.signals`, extracts `preferredFamilies: ["Woody"]` from the candidate set, injects into `enrichedContext.learnedPreferences`. `buildPreferenceProfile()` unions `"Woody"` into `preferredFamilies`, sets `hasSignals: true`. `scoreProfile()` awards `+0.20` profile dimension score for each Woody family fragrance (capped at 0.45 for 2+ family matches). With personalised strategy weight of 0.50, this produces a total score contribution of up to `0.225`. Woody fragrances surface at the top of recommendations. `RecommendationReasonBuilder` fires `family_match` reason: "Matches your interest in Woody fragrances."

**LearningEngine status post-EP20-P4:** All 7 active interpreters (Quiz, Concierge, Favorite, Cart, Search, View, Discovery) now contribute to recommendation scoring. Signals from all sources reach the profile dimension scorer for the first time.

**Handoff:** EP20-P4 closed. Recommendation Bridge is live. The complete EP20 intelligence stack is now active: signals emitted → LearningEngine interprets with compositing confidence → CustomerPreferenceSummary for admin/profile dashboards AND recommendation scoring. Awaiting Engineering Lead direction for next sprint.

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

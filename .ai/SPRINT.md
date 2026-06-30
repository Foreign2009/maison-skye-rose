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

None — EP4-P1C closed 2026-06-30 (investigation, no production changes). Awaiting Engineering Lead direction for next sprint.

---

## Completed Programs

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

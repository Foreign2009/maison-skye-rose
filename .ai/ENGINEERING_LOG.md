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

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

None — EP3-P1 closed 2026-06-30. Awaiting Engineering Lead definition of EP3-P2.

---

## Completed Programs

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

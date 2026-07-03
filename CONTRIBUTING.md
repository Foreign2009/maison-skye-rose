# Contributing — Maison Skye & Rose

**Project:** Maison Skye & Rose
**Related:** [CLAUDE.md](CLAUDE.md) · [ARCHITECTURE.md](ARCHITECTURE.md) · [DECISIONS.md](DECISIONS.md)

This document defines the engineering workflow, validation requirements, and collaboration model for all development on this repository.

---

## Core Principle: Repository First

The repository is the source of truth.

Before any engineering work:
1. Read the affected files
2. Read what they import
3. Understand the current behaviour completely
4. Only then propose a change

Never assume a file's behaviour from memory or documentation alone. Read it.

---

## Engineering Workflow

Every implementation follows this sequence without exception:

### 1. Read Affected Files

Before touching any file, read it in full. Read its imports. Understand the current implementation.

### 2. Produce a Plan

Before writing code, produce a written plan in this format:

```
## Files to Modify
List each file and explain why.

## Files NOT to Modify
Confirm what is excluded and why.

## Current Behaviour
Describe the existing implementation.

## Proposed Behaviour
Describe what will change.

## Risks
List everything that could break.

## Side Effects
UI, performance, SEO, accessibility, architectural implications.

## Build Verification
How success will be confirmed.
```

End with: **Waiting for approval before editing.**

### 3. Wait for Approval

Do not implement until the plan is reviewed and explicitly approved by the Engineering Lead.

If you discover a need to touch an unlisted file during implementation: stop, flag it, wait for re-approval. Never silently expand scope.

### 4. Implement

Modify only the files listed in the approved plan. One feature, one logical change.

### 5. Run the Build

```bash
npm run build
```

Never report a task as done without a clean build. If the build fails, fix it before continuing.

Report:
- Build result (PASS / FAIL)
- TypeScript errors (none / list)
- Warnings (none / list)
- Pages generated (count)

### 6. Verify

Manual verification is required for every change:

- UI changes: test at 375px (mobile) and 768px+ (desktop)
- Context changes: verify CartContext, FavoritesContext behaviour
- SEO changes: check page source for metadata
- Analytics changes: verify event fires without Intelligence Layer modification
- MKC changes: verify product pages SSG, adapter outputs correct

### 7. Commit

One commit per logical change. See commit format below.

---

## Engineering Program Lifecycle

Maison Skye & Rose uses a structured Engineering Program model for all non-trivial work.

### Opening a Program

1. Confirm no active program is running (check `.ai/SPRINT.md`)
2. Define: program name, objective, sprint ID (e.g., EP13-P1), scope, and close condition
3. Set the close condition before any tasks begin
4. Add an opening entry to `.ai/ENGINEERING_LOG.md`
5. Update `.ai/CURRENT_TASK.md` with `Program:` field

### Program Gates

Each sprint moves through gates:

| Gate | Deliverable |
|---|---|
| G1 | Repository Evidence Report — 9+ investigation areas |
| G2 | Engineering Assessment — strategy options evaluated |
| G3 | Implementation Plan — files, risks, side effects, Definition of Done |
| G4 | Implementation — code written, build verified |
| G5 | Sprint Closure — AI-OS records updated, commit pushed |

G3 must be approved before G4 begins. No exceptions.

### Closing a Program

1. Confirm all tasks are marked Complete
2. Move the Active Program block to Completed in `.ai/SPRINT.md`
3. Add a close entry to `.ai/ENGINEERING_LOG.md`
4. Reset `.ai/CURRENT_TASK.md` to "No active task"
5. Update `PROJECT_STATUS.md` and `REPOSITORY_STATUS.md`

---

## Git Workflow

### Branch Strategy

Current development occurs on `main`. One engineer, one branch.

### Commit Format

```
type(scope): short description under 72 characters
```

**Types:** `feat` · `fix` · `refactor` · `docs` · `chore` · `perf` · `style`

**Scope examples:** `mkc` · `analytics` · `discovery` · `commerce` · `seo` · `quiz` · `governance`

**Examples from history:**

```
feat(mkc): introduce maison fragrance profile experience
feat(analytics): activate PostHog provider via abstraction layer
feat(seo): establish production SEO foundation
fix(cart): standardize CartProduct id to URL slug format
docs(governance): establish project operating system
chore(ai-os): close EP8-P1 and update engineering records
```

### Commit Rules

- One logical change per commit
- Never combine unrelated work in a single commit
- Run `git status` before committing to review all changed files
- Never commit: `.env.local`, `node_modules/`, `.next/`
- Never commit without a passing build

---

## Coding Standards

### TypeScript

- Type everything explicitly. No `any` without a documented reason.
- Use types defined in `app/lib/mkc/types.ts` for fragrance data
- Use `interface` for object shapes passed as props
- Use `type` for unions, intersections, and utility types
- Prefer `unknown` over `any` for external data at system boundaries

### React

- `memo()` — only when the component re-renders from parent but its props have not changed
- `useCallback` — all event handlers passed as props or used in dependency arrays
- `useMemo` — derived data that is expensive to compute or passed as a prop/context value
- Apply memoization only where it reduces actual rendering cost — do not memoize trivially cheap operations

### Images

- Never use `<img>` — always `next/image`
- Always provide `sizes` prop on `fill` layout images
- `priority` only for above-the-fold images (hero, first product image)
- Always provide meaningful `alt` text

### Styling

- Tailwind utility classes only. No CSS modules. No inline `style` except dynamic values (e.g., progress bar `width`).
- Mobile-first: base classes for mobile, `md:` for desktop
- Use `clsx` or template literals for conditional class composition

### Next.js 16

- Read `AGENTS.md` before making framework-level changes
- Verify Next.js APIs against the installed version before using them
- Never assume a Next.js API from training data is correct
- Server Components are the default in the App Router — add `"use client"` only when required

---

## MKC Rules

The Maison Knowledge Catalogue is the canonical fragrance model.

1. New fragrance-consuming features must consume `FragranceKnowledge` directly or through an approved adapter
2. Never add fragrance data to a component or page — it belongs in `mkcCatalogue`
3. `DisplayFragrance` and `Fragrance` are projections — they derive from MKC, they never define it
4. `generateWhyYoullLikeIt` is the only approved source of lifestyle bullet copy — no inline copywriting in components

---

## Intelligence Layer Rules

1. The Intelligence Layer (`intentParser`, `knowledgeAdapter`, `recommendFragrances`, `explainability`) must never import `analytics.ts`
2. Intelligence Layer functions must remain pure — no React, no browser APIs, no side effects
3. Changes to the Intelligence Layer require evaluation baseline validation (see `.ai/evaluation/`)

---

## Analytics Rules

1. Analytics calls must always follow state updates — never precede them
2. Analytics must never influence recommendation or discovery behaviour
3. New track functions go in `app/lib/analytics.ts` — never inline in components
4. Every new track function must have: typed payload, `if (!ready) return;` guard, `safeCall` wrapper
5. The Intelligence Layer must never import analytics

---

## Testing

There is no automated test suite. Manual verification is required for every change.

**Mandatory checks for every implementation:**

- [ ] `npm run build` passes with zero TypeScript errors
- [ ] No new warnings in build output
- [ ] Feature works at 375px mobile
- [ ] Feature works at 768px+ desktop
- [ ] Cart add/remove behaviour unaffected (if context was touched)
- [ ] Favorites toggle behaviour unaffected (if context was touched)
- [ ] WhatsApp checkout message correct (if cart logic was touched)
- [ ] Analytics events fire without affecting recommendations (if analytics was touched)
- [ ] Intelligence Layer passes pure-function tests (if any lib/ file was touched)

**Intelligence Layer validation:**

```bash
# Run evaluation scripts if recommendation logic was changed
node validate-ep6p1.mjs
npx tsx validate-ep7p1-m3.ts
```

---

## Production Safety

Never modify without explicit Engineering Lead approval:

| File | Risk |
|---|---|
| `app/api/payfast/route.ts` | Payment initialization |
| `app/api/orders/route.ts` | Order persistence |
| `app/lib/supabase.ts` | Database client |
| `app/layout.tsx` | Root layout and provider tree |
| `app/lib/analytics.ts` | Analytics schema and session |
| All `.env.local` values | Environment secrets |

Changes to these files must be flagged, planned, and reviewed before implementation begins.

---

## Definition of Done

A task is complete only when all of the following are true:

- [ ] Plan approved by Engineering Lead before implementation began
- [ ] Implementation matches the approved plan — no silent scope expansion
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] No new warnings introduced
- [ ] Mobile experience considered and verified (375px)
- [ ] SEO unaffected (or intentionally improved and documented)
- [ ] Performance reviewed (no new unmemoized expensive computations, no new `<img>` tags)
- [ ] Analytics isolation verified if Intelligence Layer was touched
- [ ] Git commit created with correct format
- [ ] AI-OS records updated if a sprint was closed (`.ai/SPRINT.md`, `.ai/ENGINEERING_LOG.md`)
- [ ] `PROJECT_STATUS.md` updated if a program was completed or status changed

If any item is unchecked, the task is not done.

---

## AI Collaboration Model

### Claude Code — Implementation Engineer

Responsibilities: implementation, refactoring, debugging, builds, testing, commits.

Key rules:
1. Never edit without reading first
2. Always produce a plan with risks before coding
3. Never touch files outside the approved plan
4. Always run `npm run build` after implementation
5. Never commit without human approval

### ChatGPT — Engineering Lead

Responsibilities: architecture, planning, strategy, risk analysis, code review, SEO and conversion recommendations.

The Engineering Lead produces the G1+G2+G3 deliverables (evidence, assessment, plan) and approves G4 (implementation). Claude produces G4 once G3 is approved.

### Workflow

```
Engineering Lead (ChatGPT)
  → defines program objective and scope
  → reviews G1 evidence
  → selects strategy in G2
  → approves G3 plan

Claude Code
  → produces G1 repository evidence
  → produces G2 assessment options
  → produces G3 implementation plan
  → awaits G3 approval
  → executes G4 implementation
  → runs build and browser validation
  → commits and updates AI-OS records
```

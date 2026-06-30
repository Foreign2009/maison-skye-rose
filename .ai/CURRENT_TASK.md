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

**Status:** No active task
**Program:** None — EP3-P2 closed 2026-06-30

**Goal:**
_No active task. Awaiting Engineering Lead direction for next program._

**Acceptance Criteria:**
- [ ] _To be defined when next task is opened_

**Why This Task:**
_N/A_

---

## Files Involved

**Files to modify (approved):**
- _None — no active task_

**Files NOT to modify:**
- _N/A_

---

## Constraints

_None active._

---

## Context Notes

**Last completed:** EP3-P2 Dead Occasion Signal fix (2026-06-30)
- Commit: 65b243d — `feat(discovery): align quiz occasion options with supported catalogue knowledge`
- Change: removed "Luxury Events" from quiz occasion options (1 line)
- Build: pass, zero TypeScript errors, zero warnings
- Browser validation: 9/9 pass
- Vocabulary preserved in `fragranceOccasions.ts`
- Follow-up required: Gym, Signature Scent, Clubbing dead signals (deferred to Option 3 / EP3-P3)

---

## Plan

_N/A_

---

## Build Result

**Last build:** 2026-06-30 — Pass. Zero TypeScript errors. Zero warnings. (EP3-P2 G4)

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

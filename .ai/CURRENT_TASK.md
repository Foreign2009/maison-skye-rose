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
**Program:** None — EP8-P1 closed 2026-07-01 (foundation cleanup complete)

**Goal:**
_No active task. Awaiting Engineering Lead direction for EP8-P2 or next sprint._

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

**Last completed:** EP8-P1 Foundation Cleanup (2026-07-01)
- Commits: af48a22 (documentation), 4cbf764 (architectural consistency), afdf97a (dead-file deletion)
- Changes:
  - Evaluation framework: 8 stale items corrected across `recommendation-suite.md`, `quality-metrics.md`, `evaluation-procedure.md` — TC-SC-03 code path, TC-SC-04 criterion (popularity → collection), AL-01 count (34 → 5), AL-04 coverage claim, M3 formula (/465 → fragrances.length), Deferred M3 note removed
  - `app/lib/recommendFragrances.ts`: hiddenGem criterion `item.gender !== "unisex"` → `item.collection !== "Elite"` (architecturally consistent with luxuryUpgrade; zero behavioural change on current catalogue)
  - `app/components/RecommendationCard.tsx`: JSX fallback (4 hardcoded strings) removed; `reasons` made required (`string[]`)
  - Deleted: `app/data/fragranceDatabase.ts`, `app/data/fragranceQuizQuestions.ts`, `app/components/RecommendationSection.tsx` — all confirmed 0 imports before deletion
- Decisions: No behavioural recommendation changes; M3 = 1.0000 confirmed unchanged after hiddenGem criterion fix; `reasons` required enforces TypeScript compile-time protection for all future callers
- Build: Pass — zero TypeScript errors, zero warnings, 118 pages (all three phases)
- `gender !== "unisex"` residual occurrences: 3 remaining in `.ai/` historical records only (ENGINEERING_LOG.md:308, SPRINT.md:167, baseline-results.md:190) — accurate records of prior state; no action required

---

## Plan

_N/A_

---

## Build Result

**Last build:** 2026-07-01 — Pass. Zero TypeScript errors. Zero warnings. (EP8-P1 G3)

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

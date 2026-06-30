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
**Program:** None — EP6-P2 closed 2026-06-30 (discovery instrumentation complete)

**Goal:**
_No active task. Awaiting Engineering Lead direction for EP6-P3 or next sprint._

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

**Last completed:** EP6-P2 Discovery Instrumentation (2026-06-30)
- Commit: bfbce8d
- Changes: `app/lib/analytics.ts` (AnalyticsSource type extracted), `app/components/ProductCard.tsx` (source/rank props, handleProductNavigation), `app/shop/page.tsx` (currentMode, 2 useEffects, filter/sort/click instrumentation)
- Decision: Approach A (individual props) for ProductCard analytics context. AnalyticsSource as shared type. Two separate useEffects for mode events and confidence events. Explicit ternary for analyticsSource (no template literal). State updates before analytics calls in all handlers.
- Build: Pass — zero TypeScript errors, zero warnings, 118 pages
- Validation: 31/31 browser scenarios pass
- Intelligence Layer: confirmed analytics-free
- Future note: When additional discovery surfaces are instrumented, consider a shared helper for analytics source construction. Do not implement now.

---

## Plan

_N/A_

---

## Build Result

**Last build:** 2026-06-30 — Pass. Zero TypeScript errors. Zero warnings. (EP6-P2 G5)

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

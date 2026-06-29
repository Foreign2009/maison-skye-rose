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
**Program:** _e.g. AIOS-001 — or "None" if no active program_

**Goal:**
_What are we trying to achieve? One sentence._

**Acceptance Criteria:**
- [ ] _What does done look like? List each condition._
- [ ] Build passes with zero TypeScript errors
- [ ] No new warnings
- [ ] Mobile verified at 375px

**Why This Task:**
_Why does this matter? Conversion? Bug fix? SEO? Performance?_

---

## Files Involved

**Files to modify (approved):**
- _List each file and why_

**Files NOT to modify:**
- _List exclusions explicitly_

---

## Constraints

_Any constraints the AI must respect for this task._
_Example: "Do not change the WhatsApp message format." or "Keep backward compatibility with existing localStorage cart shape."_

---

## Context Notes

_Anything unusual about this task that the AI needs to know — edge cases, prior attempts, business context._

---

## Plan

_Paste the implementation plan here once produced and approved._

---

## Build Result

_Paste the build output here after implementation._

---

## Suggested Commit Message

_Record the commit message before committing._

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

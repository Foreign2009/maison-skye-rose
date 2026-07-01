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
**Program:** None — EP6-P4 closed 2026-07-01 (commerce analytics instrumentation complete)

**Goal:**
_No active task. Awaiting Engineering Lead direction for next sprint._

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

**Last completed:** EP6-P4 Commerce Instrumentation (2026-07-01)
- Commit: 7da817e
- Changes: 8 production files — `app/lib/analytics.ts` (CartPayload.source extended; 5 new payload types; 6 new track functions); `app/components/ProductDetail.tsx` (analytics imports; cartOpen destructure; useEffect extension; handleAddToCart; handleBuyNow); `app/components/QuickAddModal.tsx` (trackAddToCart); `app/components/MiniCart.tsx` (trackAddToCart × 3 surfaces; trackWhatsAppCheckout); `app/components/Navbar.tsx` (trackCartOpened bag-icon); `app/checkout/page.tsx` (trackCheckoutStarted; trackPaymentStarted); `app/payment-success/page.tsx` (sessionStorage guard; trackPaymentReturnSuccess); `app/payment-cancel/page.tsx` (sessionStorage guard; trackPaymentReturnCancelled)
- Decisions: `!cartOpen` guard prevents duplicate `cart_opened` events; sessionStorage named constants prevent payment return events re-firing on refresh; PayFast return pages describe observed navigation behaviour only; `product_detail_viewed` extends existing `recentlyViewed` useEffect; `remove_from_cart` and `cart_quantity_changed` deferred
- Build: Pass — zero TypeScript errors, zero warnings, 118 pages
- Validation: 35/35 browser scenarios pass across 15 groups
- Intelligence Layer: confirmed analytics-free
- Future note: As analytics coverage expands beyond commerce, consider introducing shared constants (or a helper) for analytics source values to prevent vocabulary drift. Do not implement during EP6.

---

## Plan

_N/A_

---

## Build Result

**Last build:** 2026-07-01 — Pass. Zero TypeScript errors. Zero warnings. (EP6-P4 G4)

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

# Known Issues — Maison Skye & Rose

**Update this file when issues are discovered or resolved.**
Severity: Critical (blocks launch) | High (degrades experience) | Medium (notable gap) | Low (cosmetic/minor)

---

## High

## Medium

### KI-10 — Open Graph and Twitter Metadata Missing on Non-Product Pages

**Severity:** Medium
**Files:** `app/layout.tsx`, `app/shop/page.tsx`, collection pages
**Detail:** Only product pages have OG metadata. The homepage, shop page, collection pages, and all static pages share the root layout fallback which has no OG image, no Twitter card, and no canonical URL.
**Fix:** Add `generateMetadata` to homepage, shop, and collection pages.

### KI-11 — MiniCart Recommendation Scoring May Fail for Products Lacking profile/season Fields

**Severity:** Medium
**File:** `app/components/MiniCart.tsx`
**Detail:** `collectionRecommendations` scores fragrances by `f.collection`, `f.profile`, and `f.season`. If any product in the catalogue lacks these fields, the comparison silently fails (returns undefined, score 0). The recommendation still works but is less accurate.
**Fix:** Validate that all catalogue entries have collection, profile, and season populated.

### KI-12 — instagramUrl Is Incomplete in brand.ts

**Severity:** Medium
**File:** `app/data/brand.ts`
**Detail:** `instagramUrl` is set to `"https://instagram.com/"` — no handle. Any component linking to the Instagram profile will link to the Instagram homepage.
**Fix:** Set the correct Instagram handle in `brand.ts`.

---

## Low

### KI-14 — MiniCart Mobile Close Gesture Not Implemented

**Severity:** Low
**File:** `app/components/MiniCart.tsx`
**Detail:** The mobile drag handle at the top of the MiniCart is a visual affordance only — there is no actual drag-to-close gesture. On mobile there is no close button (it is `hidden md:block`). Customers must use the browser back button or tap outside (if any outside click handler exists).
**Fix:** Implement a swipe-down gesture or an explicit close button on mobile.

### KI-15 — All Products Hardcoded as InStock in JSON-LD

**Severity:** Low
**File:** `app/product/[slug]/page.tsx`
**Detail:** The Product JSON-LD `availability` field is hardcoded to `"https://schema.org/InStock"` for all products. There is no inventory system, so this is always true — but it will be incorrect if any product sells out.
**Fix:** Requires inventory tracking implementation before this is meaningful.

### KI-16 — Sort Options "Best Sellers" and "New Arrivals" Act as Filters

**Severity:** Low
**File:** `app/shop/page.tsx`
**Detail:** In the sort dropdown, selecting "Best Sellers" or "New Arrivals" filters the list (removes non-matching items) rather than sorting it. This is semantically misleading — a sort option should reorder, not filter.
**Fix:** Either move these to the filter tabs (where they belong) or change the label to "Show Best Sellers Only".

---

## Resolved

### KI-01 — PayFast Running on Sandbox URL

**Severity:** Critical (at time of discovery)
**Resolved:** 2026-08-02 — commit 9f9f7f5 (PayFast Production Hardening)
**Resolution:** PayFast URL is now environment-controlled via `PAYFAST_ENV`. Setting `PAYFAST_ENV=live` routes to `https://www.payfast.co.za/eng/process`. Any other value uses the sandbox. All credentials are server-only env vars.

---

### KI-02 — PayFast ITN Webhook Not Implemented

**Severity:** Critical (at time of discovery)
**Resolved:** 2026-08-02 — commit 9f9f7f5 (PayFast Production Hardening)
**Resolution:** `app/api/payfast/itn/route.ts` implemented. Receives PayFast ITN as `application/x-www-form-urlencoded`, verifies MD5 signature using the same algorithm as payment initiation, and updates `payment_status` + `status_history` in Supabase (`COMPLETE → payment_confirmed`, `FAILED → cancelled`).

---

### KI-03 — PayFast MD5 Signature Not Computed

**Severity:** Critical (at time of discovery)
**Resolved:** 2026-08-02 — commit 9f9f7f5 (PayFast Production Hardening)
**Resolution:** `computeSignature()` in `app/api/payfast/route.ts` generates the correct MD5 hash of the payment param string + passphrase using Node.js `crypto`. Signature is appended to the PayFast redirect URL.

---

### KI-05 — PayFast Passphrase Exposed in Client Bundle

**Severity:** High (at time of discovery)
**Resolved:** 2026-08-02 — commit 9f9f7f5 (PayFast Production Hardening)
**Resolution:** `PAYFAST_PASSPHRASE` (no `NEXT_PUBLIC_` prefix) is a server-only env var accessed exclusively inside the Route Handler. The passphrase is never included in the client bundle.

---

### KI-06 — Hardcoded Customer Details in PayFast Payload

**Severity:** High (at time of discovery)
**Resolved:** 2026-08-02 — commit 9f9f7f5 (PayFast Production Hardening)
**Resolution:** `name_first` and `name_last` are derived from the customer's checkout form input and passed via the `/api/payfast` request body. No hardcoded placeholder names remain.

---

### KI-07 — Delivery Pricing Mismatch Between MiniCart and Checkout

**Severity:** High (at time of discovery)
**Resolved:** 2026-08-02 — commit 74c8789 (Delivery Pricing Reconciliation — D10 Option c)
**Resolution:** MiniCart total label switches to "Subtotal" and shows the pre-delivery subtotal when delivery is non-free. WhatsApp checkout message shows "Calculated at checkout" for delivery and "SUBTOTAL" label when delivery is non-free. Checkout province-based `DELIVERY_RATES` unchanged.

---

### KI-08 — No Sitemap

**Severity:** Medium (at time of discovery)
**Resolved:** prior session — `app/sitemap.ts` implemented
**Resolution:** `app/sitemap.ts` returns all product URLs (via mkcCatalogue) and collection/static page URLs using Next.js `MetadataRoute.Sitemap`. Accessible at `/sitemap.xml`.

---

### KI-09 — No robots.txt

**Severity:** Medium (at time of discovery)
**Resolved:** prior session — `app/robots.ts` implemented
**Resolution:** `app/robots.ts` returns explicit allow/disallow rules using Next.js `MetadataRoute.Robots`. Accessible at `/robots.txt`.

---

### KI-13 — Touch Targets Below 44px on MiniCart Quantity Buttons

**Severity:** Low (at time of discovery)
**Resolved:** EP6-P4 — `app/components/MiniCart.tsx` modified as part of Commerce Instrumentation
**Resolution:** Quantity increment/decrement buttons updated to `h-11 w-11` = 44px, meeting the WCAG 2.1 minimum touch target size.

---

### KI-04 — Cart Composite Key Inconsistency Across Add-to-Cart Sources

**Severity:** High (at time of discovery)
**Resolved:** 2026-08-02 — `app/components/QuickAddBundle.tsx` deleted (KI-04 cleanup)
**Resolution:** Repository inspection confirmed that all five active add-to-cart paths (ProductDetail, ProductDetail Buy Now, QuickAddModal, MiniCart quick-add, FragranceQuickView) already used the canonical identifier `title.toLowerCase().replace(/\s+/g, "-")` via `knowledge.id` or direct formula. The only remaining inconsistency was in `QuickAddBundle`, which used `` `${fragrance.title}-5ml` `` (un-lowercased, size suffix appended). `QuickAddBundle` was confirmed to have zero imports in the entire app — a dead component never rendered in production. It was deleted rather than patched. No active cart behaviour changed.

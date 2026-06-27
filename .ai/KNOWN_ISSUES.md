# Known Issues — Maison Skye & Rose

**Update this file when issues are discovered or resolved.**
Severity: Critical (blocks launch) | High (degrades experience) | Medium (notable gap) | Low (cosmetic/minor)

---

## Critical — Blocks Production Launch

### KI-01 — PayFast Running on Sandbox URL

**Severity:** Critical
**File:** `app/api/payfast/route.ts`
**Detail:** The PayFast URL is hardcoded to `https://sandbox.payfast.co.za/eng/process`. All payments go to the test environment, not live PayFast. No real payments are processed.
**Fix:** Change to `https://www.payfast.co.za/eng/process` and replace sandbox credentials with live credentials.

### KI-02 — PayFast ITN Webhook Not Implemented

**Severity:** Critical
**File:** `app/api/payfast/route.ts`
**Detail:** The `/api/payfast` route only handles payment initiation. It does not receive or process PayFast ITN (Instant Transaction Notification) callbacks. `payment_status` in Supabase will always remain `"pending"` — there is no way to know if a payment succeeded server-side.
**Fix:** Implement an ITN receiver that verifies the PayFast signature and updates `payment_status` in Supabase.

### KI-03 — PayFast MD5 Signature Not Computed

**Severity:** Critical
**File:** `app/api/payfast/route.ts`
**Detail:** PayFast requires an MD5 hash of the payment data using the passphrase to authenticate the request. The current implementation does not compute this signature.
**Fix:** Implement MD5 signature generation before switching to production.

---

## High

### KI-04 — Cart Composite Key Inconsistency Across Add-to-Cart Sources

**Severity:** High
**Files:** `app/components/ProductDetail.tsx`, `app/components/QuickAddModal.tsx`, `app/components/MiniCart.tsx`
**Detail:** The cart `id` field is set differently depending on which component adds the product:
- ProductDetail: URL slug (`"black-orchid-noir"`)
- QuickAddModal: `"${title}-${selectedSize}"` (`"Black Orchid Noir-10ml"`)
- MiniCart recommendations: `fragrance.title` (`"Black Orchid Noir"`)

The composite key check is `id + size`. Same product added via different flows will appear as separate line items because the `id` differs.
**Fix:** Standardize on one `id` format across all add-to-cart paths. Recommended: URL slug (consistent with PDP routing).

### KI-05 — PayFast Passphrase Exposed in Client Bundle

**Severity:** High
**File:** `app/api/payfast/route.ts`, `.env.local`
**Detail:** `NEXT_PUBLIC_PAYFAST_PASSPHRASE` is included in the client bundle. The passphrase is sensitive and should not be exposed.
**Fix:** Move PayFast route handler to server-only env vars (drop `NEXT_PUBLIC_` prefix) and ensure the passphrase is never sent to the browser.

### KI-06 — Hardcoded Customer Details in PayFast Payload

**Severity:** High
**File:** `app/api/payfast/route.ts`
**Detail:** `name_first: "Maison"`, `name_last: "Customer"`, `email_address: "customer@email.com"` are hardcoded placeholders. PayFast receives no actual customer identity.
**Fix:** Pass customer name and email from the checkout form through the API request body.

### KI-07 — Delivery Pricing Mismatch Between MiniCart and Checkout

**Severity:** High
**Files:** `app/components/MiniCart.tsx`, `app/checkout/page.tsx`
**Detail:** MiniCart shows delivery as R100 (or free at R2000). Checkout page calculates delivery as R100 (Western Cape) or R180 (other provinces). A customer can see "R100 delivery" in MiniCart but face R180 at checkout — a trust-breaking discrepancy.
**Fix:** Reconcile the two delivery systems. See `DECISIONS.md` D10 for options.

---

## Medium

### KI-08 — No Sitemap

**Severity:** Medium
**Detail:** No `app/sitemap.ts` exists. Search engines cannot discover product pages, collection pages, or static pages automatically.
**Fix:** Add `app/sitemap.ts` returning all product URLs (from `fragrances.ts`) + static page URLs.

### KI-09 — No robots.txt

**Severity:** Medium
**Detail:** No `app/robots.ts` or `public/robots.txt` exists. Next.js serves a default permissive robots response but it is not explicitly configured.
**Fix:** Add `app/robots.ts` with explicit allow/disallow rules.

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

### KI-13 — Touch Targets Below 44px on MiniCart Quantity Buttons

**Severity:** Low
**File:** `app/components/MiniCart.tsx`
**Detail:** Quantity increment/decrement buttons are `h-9 w-9` = 36px. The WCAG accessibility minimum for touch targets is 44px.
**Fix:** Increase to `h-11 w-11` or add sufficient padding to reach 44px hit area.

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

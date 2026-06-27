# Business Rules — Maison Skye & Rose

All rules stated as explicit if/then logic. Sourced directly from the codebase.
When in doubt, the source file is authoritative.

---

## Cart

**Adding to cart:**
- If `id + size` already exists in cart → increase quantity (no duplicate line item)
- If `id + size` is new → create new line item
- `id` is set by the caller — it differs across add-to-cart sources (see KNOWN_ISSUES.md)

**cartCount:**
- `cartCount = sum of all item.quantity across all line items` (not distinct products)
- Source: `app/context/CartContext.tsx`

**localStorage key:** `maison-skye-rose-cart`

---

## Wholesale Pricing

**Eligibility:**
- If `cartCount >= 10` → `wholesaleActive = true`
- If `cartCount < 10` → `wholesaleActive = false`
- Mix-and-match: any combination of fragrances and sizes counts toward 10 units

**Wholesale prices (flat rate by size — do not vary by fragrance or collection):**
- 5ml → R48
- 10ml → R77
- 30ml → R180

**Effects when wholesale is active:**
- `cartTotal` uses wholesale prices
- MiniCart shows crossed-out retail + green wholesale per line item
- MiniCart shows total savings: `originalTotal - wholesaleSubtotal`
- Reward progress bar is replaced by "Wholesale Pricing Active" panel
- Delivery is free regardless of order total
- WhatsApp message includes "WHOLESALE ORDER" header and "(Wholesale)" per line item

**Source:** `app/context/CartContext.tsx` — `getWholesalePrice`, `wholesaleActive`

---

## Reward Tiers

**Tiers (based on `cartTotal`, which uses wholesale prices when active):**

| Subtotal | Reward |
|---|---|
| R0 – R399 | No reward |
| R400+ | 1 Free 5ml Sample |
| R700+ | 2 Free 5ml Samples |
| R1000+ | 3 Free 5ml Samples |
| R1500+ | Discovery Set (5 × 5ml) |
| R2000+ | Discovery Set (5 × 5ml) + Free Delivery |

**If wholesale is active:** reward calculation uses the lower wholesale cartTotal, which means customers may reach fewer reward tiers than expected.

**Reward fulfillment:** Manual. The business owner includes the physical sample(s) when packing the order. No automated fulfillment exists.

**MiniCart progress bar:** Tracks R0 → R1500 in four equal 25% segments. Hidden when wholesale is active.

**QuickAddModal reward preview:** Shows only the R400 threshold (not higher tiers).

**Source:** `app/components/MiniCart.tsx`, `app/components/QuickAddModal.tsx`

---

## Delivery

**MiniCart delivery logic:**
- If cart is empty → R0
- If `wholesaleActive` → R0 (always free)
- If `subtotal >= 2000` → R0 (free delivery reward)
- Otherwise → R100

**Checkout page delivery logic (DIFFERENT — not aligned with MiniCart):**
- Western Cape → R100
- All other provinces → R180

**This is a known inconsistency. Do not "fix" one side without reconciling both.**

**Source:** `app/components/MiniCart.tsx`, `app/checkout/page.tsx`

---

## VAT

- VAT rate: 15%
- VAT is calculated only on the checkout page: `vat = subtotal * 0.15`
- VAT is NOT shown in MiniCart
- Source: `app/checkout/page.tsx`

---

## Checkout Flows

**WhatsApp (primary):**
1. Customer clicks "Checkout via WhatsApp" in MiniCart
2. Pre-populated WhatsApp message opens (includes order lines, reward, totals, empty customer fields)
3. Customer fills Name / Contact Number / Delivery Area in WhatsApp and sends
4. Business owner confirms manually

**PayFast (secondary):**
1. Customer fills checkout form (name, phone, address, province)
2. POST `/api/orders` → Supabase insert (payment_status: "pending")
3. POST `/api/payfast` → builds PayFast query string
4. Redirect to `sandbox.payfast.co.za` (NOT production)
5. Customer completes payment on PayFast
6. Redirects to `/payment-success` or `/payment-cancel`
7. `payment_status` is NEVER updated from "pending" (ITN not implemented)

---

## Favorites

**Identifier:** product `title` (display name). Not id or slug.
- `isFavorite(title)` → `favorites.some(item => item.title === title)`
- Adding a duplicate title is a no-op
- No limit on number of favorites

**localStorage key:** `maison-skye-rose-favorites`

---

## Recently Viewed

- Written to localStorage on every PDP mount
- Key: `recentlyViewed`
- Max stored: 12 items
- Duplicate removed before inserting (same title moved to front)
- Fields stored: title, subtitle, mood, profile, season, notes, prices, images
- Source: `app/components/ProductDetail.tsx`

---

## Cart ID Format (per add-to-cart source)

| Source | id format | Example |
|---|---|---|
| `ProductDetail.tsx` | URL slug (title → lowercase, spaces → hyphens) | `"black-orchid-noir"` |
| `QuickAddModal.tsx` | `${title}-${selectedSize}` | `"Black Orchid Noir-10ml"` |
| `MiniCart.tsx` recommendations | `fragrance.title` | `"Black Orchid Noir"` |

These formats differ. The same fragrance added via different flows can create separate line items.

---

## Product Collections

- **Skye** — one collection
- **Rose** — one collection
- **Elite** — one collection

Filter tabs: All / Skye / Rose / Elite / Best Sellers / New Arrivals

**Flags on product data:**
- `bestSeller: boolean`
- `newArrival: boolean`

---

## WhatsApp Number

`27696863952` — used in MiniCart checkout and ProductDetail Buy Now.
Defined in `app/data/brand.ts` as `brand.social.whatsappNumber`.

---

## Supabase Orders Table Schema

| Column | Type | Value |
|---|---|---|
| customer_name | text | from checkout form |
| phone | text | from checkout form |
| address | text | from checkout form |
| province | text | from checkout form |
| items | jsonb | cart array |
| subtotal | numeric | cart subtotal |
| vat | numeric | subtotal × 0.15 |
| delivery | numeric | R100 or R180 (province-based) |
| total | numeric | subtotal + vat + delivery |
| payment_status | text | always "pending" |

Source: `app/api/orders/route.ts`

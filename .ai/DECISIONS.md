# Architectural Decisions — Maison Skye & Rose

Each decision records: what was chosen, why, and what the trade-off is.
Do not reverse a decision without understanding its rationale first.

---

## D01 — WhatsApp as Primary Checkout

**Decision:** WhatsApp is the primary order flow. PayFast is secondary.

**Why:** WhatsApp allows manual order confirmation, flexible payment, and direct customer communication without needing a fully automated payment pipeline. It removes friction for customers already using WhatsApp daily.

**Trade-off:** Not fully automated. Every order requires manual response from the business owner. Does not scale without staff.

**Source:** `app/components/MiniCart.tsx` — `handleWhatsAppCheckout`

---

## D02 — Product Data Is Static TypeScript

**Decision:** All product data lives in `app/data/fragrances.ts` as a typed array. No CMS, no database fetch at runtime.

**Why:** Simplicity and build-time performance. Product data is stable — it doesn't change per-user or per-request. Static data allows `generateStaticParams` to pre-render all product pages at build time.

**Trade-off:** Adding or editing a product requires a code change and redeployment. Not manageable by non-technical staff.

**Future path:** CMS integration (Sanity, Contentful, or Supabase product table) when the catalogue management overhead becomes painful.

---

## D03 — Composite Cart Key Is `id + size`

**Decision:** Cart line items are uniquely identified by `id + size` composite key (not `id` alone).

**Why:** The same fragrance in different sizes must be separate line items with separate prices. Using `id` alone would prevent a customer from having both a 5ml and a 10ml of the same fragrance.

**Trade-off:** The `id` field is set differently by each add-to-cart source (slug in ProductDetail, title-size in QuickAddModal, title in MiniCart recommendations). This inconsistency can create duplicate line items for the same product across flows.

**Known issue:** Documented in `KNOWN_ISSUES.md` as KI-04.

---

## D04 — No Customer Authentication

**Decision:** Supabase is used with the anon key only. No login, no customer accounts.

**Why:** Reduces complexity at the early stage. Customer identification is handled via the WhatsApp flow — the business owner knows who the customer is from the conversation.

**Trade-off:** No order history, no wishlist sharing, no loyalty points tied to account. Customer favorites and cart are browser-local only.

**Future path:** Supabase Auth when order history or customer portal is needed.

---

## D05 — Two Product Data Shapes (Intentional)

**Decision:** `Fragrance` type in `app/data/types.ts` uses `notes: { top, heart, base }` for the quiz/recommendation engine. Display components use a flat `notes: string[]` array from `fragrances.ts`.

**Why:** The quiz schema needs structured notes for AI recommendation scoring (sweetness, freshness, etc.). The display schema needs a simpler flat array for rendering note chips on PDP and search indexing.

**Trade-off:** Two data models in the same project that cannot be directly mixed. Risk of confusion when working across the quiz and display layers.

**Do not merge:** Merging the types would break either the quiz scoring logic or the display components. Reconcile only with a full plan.

---

## D06 — React Context Over External State Library

**Decision:** All shared state (cart, favorites, cart UI, cart feedback) is managed with React Context. No Zustand, Redux, or Jotai.

**Why:** The state requirements are simple and well-bounded. Each context has a single responsibility. Context avoids adding a dependency and keeps the state model readable.

**Trade-off:** Context re-renders all consumers when any value changes. Mitigated with `useMemo` on context value objects and `useCallback` on all mutations.

---

## D07 — Wholesale Activates Automatically, No Account Required

**Decision:** Wholesale pricing triggers automatically when `cartCount >= 10`. No login, no registration, no approval process.

**Why:** Reduces friction for bulk buyers. Makes the wholesale incentive immediately visible during the shopping flow.

**Trade-off:** Any customer can access wholesale prices by adding 10+ units — even a retail customer just adding many sizes of the same fragrance. This is accepted as a business decision.

---

## D08 — PayFast Passphrase Uses NEXT_PUBLIC_ Prefix

**Decision:** All PayFast credentials including the passphrase use `NEXT_PUBLIC_` — they are client-bundle exposed.

**Why:** The initial implementation was built quickly and the distinction between public/private env vars was not considered for the passphrase specifically.

**Trade-off:** The passphrase is exposed in the client bundle. This is a security concern documented in `docs/PAYFAST.md`. Should be fixed before production launch.

**Required fix:** Move PayFast initialization entirely to server-side route handler with private env vars (no `NEXT_PUBLIC_` prefix for the passphrase).

---

## D09 — No Automated Test Suite

**Decision:** No unit tests, integration tests, or E2E tests.

**Why:** Early-stage project. Manual verification is currently sufficient given the scope.

**Trade-off:** Every change requires manual regression testing. Risk of silent regressions in cart, checkout, and payment flows.

**Future path:** E2E tests with Playwright for the critical path: add to cart → MiniCart → WhatsApp checkout message format.

---

## D10 — MiniCart Uses Total-Based Delivery, Checkout Uses Province-Based Delivery

**Decision:** Two delivery calculation systems exist and were not reconciled.

**Why:** MiniCart delivery logic was built with the reward system (free at R2000). Checkout page was built independently with province-based logistics pricing.

**Trade-off:** The customer sees R100 free delivery in the MiniCart but potentially R180 on the checkout form. This creates a trust problem.

**Required fix:** Reconcile before launch. Options: (a) adopt province-based in both, (b) remove province-based from checkout and use total-based throughout, (c) show a clear "delivery calculated at checkout" message in MiniCart.

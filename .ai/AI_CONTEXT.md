# AI Context — Maison Skye & Rose

**Load this file first at the start of every session.**
**Then load `.ai/CURRENT_TASK.md` to understand what you are working on.**

---

## What This Project Is

Maison Skye & Rose is a luxury-inspired fragrance e-commerce platform for the South African market.
Customers browse 465+ fragrances, add to cart, and checkout via WhatsApp (primary) or PayFast (secondary).

---

## Stack (Exact Versions)

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js App Router | 16.2.6 |
| Language | TypeScript | 5 |
| Runtime | React | 19.2.4 |
| Styling | Tailwind CSS | 3 |
| Animation | Framer Motion | 12 |
| Icons | Lucide React | ^1.16.0 |
| Backend | Supabase | ^2.106.2 |
| Payments | PayFast | sandbox only |
| Deployment | Vercel | — |

---

## What Exists Right Now

| System | Status |
|---|---|
| Product catalogue (fragrances.ts) | Complete — Skye, Rose, Elite collections |
| Cart (localStorage, composite key) | Complete |
| Favorites (localStorage) | Complete |
| MiniCart panel | Complete |
| Quick Add Modal (Framer Motion portal) | Complete |
| Reward tier system | Complete (R400/700/1000/1500/2000) |
| Wholesale pricing | Complete (auto at 10+ units) |
| WhatsApp checkout | Complete — primary flow |
| PayFast checkout | Sandbox only — NOT production ready |
| Static product pages (generateStaticParams) | Complete |
| Per-product SEO (generateMetadata + JSON-LD) | Complete |
| Recently Viewed (localStorage, 12 items) | Complete |
| Shop page (search, filter, sort) | Complete |
| Fragrance quiz | Exists — not audited |
| Order persistence (Supabase) | Complete — schema exists |
| PayFast ITN webhook | NOT implemented |
| Sitemap | NOT implemented |
| robots.txt | NOT implemented |
| OG metadata (homepage, shop, collections) | NOT implemented |
| Customer authentication | NOT implemented |
| Email order confirmation | NOT implemented |
| Inventory tracking | NOT implemented (hardcoded InStock) |

---

## Files to Read First (Ordered by Priority)

For any session, read in this order based on task type:

**Cart / pricing / rewards / wholesale:**
1. `app/context/CartContext.tsx`
2. `app/components/MiniCart.tsx`
3. `.ai/BUSINESS_RULES.md`

**Product / PDP / SEO:**
1. `app/product/[slug]/page.tsx`
2. `app/components/ProductDetail.tsx`
3. `SEO.md`

**Architecture / layout:**
1. `app/layout.tsx`
2. `ARCHITECTURE.md`

**Payments / checkout:**
1. `app/checkout/page.tsx`
2. `app/api/payfast/route.ts`
3. `app/api/orders/route.ts`
4. `docs/PAYFAST.md`

**Any task:**
- Always read `CLAUDE.md` — it is the operating manual and overrides everything
- Always read `.ai/CURRENT_TASK.md` — it defines what you are working on

---

## Critical Architecture Facts

- **Provider tree (outermost first):** FavoritesProvider → CartProvider → CartUIProvider → CartFeedbackProvider → {children} + CartSuccessToast + FloatingWhatsApp
- **Only one Server Component page:** `app/product/[slug]/page.tsx` — all other pages are `"use client"`
- **No external state library** — React Context only (no Zustand, Redux, Jotai)
- **Product data is static TypeScript** — `app/data/fragrances.ts` — re-deploy required to add products
- **Two product data shapes exist** — `Fragrance` type in `types.ts` (quiz schema) vs display shape in `fragrances.ts` (flat notes array). Do not merge them without a plan.
- **Cart composite key is `id + size`** — `id` differs by add-to-cart source (see `.ai/KNOWN_ISSUES.md`)
- **Cart feedback auto-clears after 2600ms** — `CartFeedbackContext.tsx`
- **WhatsApp number:** 27696863952

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_PAYFAST_MERCHANT_ID
NEXT_PUBLIC_PAYFAST_MERCHANT_KEY
NEXT_PUBLIC_PAYFAST_PASSPHRASE
NEXT_PUBLIC_WEBSITE_URL
```

All use `NEXT_PUBLIC_` prefix — they are client-exposed. See `docs/PAYFAST.md` for security implications.

---

## AI Operating Rules

- Read `CLAUDE.md` before doing anything
- Never edit without a written plan
- Never skip approval
- Never modify `app/api/payfast/route.ts`, `app/api/orders/route.ts`, `app/lib/supabase.ts`, or `app/layout.tsx` without explicit instruction
- Run `npm run build` after every implementation
- One commit per logical change

---

## Documentation Map

| File | What It Covers |
|---|---|
| `CLAUDE.md` | AI operating manual — rules, standards, workflow |
| `ARCHITECTURE.md` | App Router structure, data flow, component hierarchy |
| `UI_STANDARDS.md` | Brand design system, colour palette, typography |
| `PERFORMANCE.md` | Image strategy, memoization, rendering |
| `SEO.md` | Metadata, JSON-LD, canonical, known gaps |
| `ROADMAP.md` | Milestones, known issues, backlogs |
| `CHANGELOG.md` | Release history |
| `CONTRIBUTING.md` | Development process, git workflow, coding standards |
| `docs/CART.md` | CartContext API, composite key, calculations |
| `docs/MINICART.md` | MiniCart layout, recommendations, WhatsApp checkout |
| `docs/REWARDS.md` | Reward tiers, progress bar, messaging |
| `docs/WHOLESALE.md` | Wholesale pricing, eligibility, interactions |
| `docs/PAYFAST.md` | Payment flow, security issues, production checklist |
| `docs/SUPABASE.md` | Database client, orders table, RLS |
| `docs/DEPLOYMENT.md` | Vercel setup, env vars |
| `docs/PRODUCT_DETAIL.md` | PDP architecture, SEO, sticky CTA |
| `docs/QUICK_ADD.md` | Modal, portal, animations, cart id format |
| `docs/SEARCH.md` | Search logic, debounce, filtering, sorting |
| `docs/FAVORITES.md` | Favorites context, persistence, UI |
| `.ai/BUSINESS_RULES.md` | All business rules as if/then statements |
| `.ai/KNOWN_ISSUES.md` | All known bugs and gaps with severity |
| `.ai/DECISIONS.md` | Architectural decisions with rationale |
| `.ai/CURRENT_STATE.md` | Build status snapshot |
| `.ai/CURRENT_TASK.md` | Active task definition |

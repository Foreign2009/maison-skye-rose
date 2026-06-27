# Architecture

**Project:** Maison Skye & Rose
**Framework:** Next.js 16.2.6 App Router
**Related:** [README.md](README.md) · [PERFORMANCE.md](PERFORMANCE.md)

---

## Project Structure

```
app/
├── api/                     # Route Handlers (server-side)
│   ├── orders/route.ts      # POST: persist order to Supabase
│   └── payfast/route.ts     # POST: initialize PayFast payment
├── components/              # Shared UI components (mostly client)
├── context/                 # React Context providers
├── data/                    # Static product and brand data (TypeScript modules)
├── lib/                     # Third-party client setup
├── product/[slug]/          # Dynamic route — static at build time
├── shop/                    # Client component page
├── checkout/                # Client component page
├── favorites/               # Client component page
├── layout.tsx               # Root layout — provider tree
└── page.tsx                 # Homepage — client component
```

---

## App Router

This project uses the Next.js 16 App Router exclusively. There is no `pages/` directory.

Key App Router decisions:

- `app/layout.tsx` — Root layout wraps all pages with the full context provider tree
- `app/product/[slug]/page.tsx` — Server component by default; uses `generateStaticParams` for static pre-rendering and `generateMetadata` for per-page SEO
- All other pages (`shop`, `checkout`, `favorites`, `page.tsx`) are `"use client"` components because they require browser state
- Route Handlers (`app/api/*/route.ts`) run server-side — no access to browser APIs

---

## Context Provider Tree

Providers are nested in `app/layout.tsx` in this order (outermost first):

```
FavoritesProvider
  CartProvider
    CartUIProvider
      CartFeedbackProvider
        {children}
        CartSuccessToast
        FloatingWhatsApp
```

**Rationale:**
- `FavoritesProvider` is outermost because the MiniCart reads from both `CartContext` and `FavoritesContext` — nesting order doesn't create circular dependency but establishes a clear ownership hierarchy
- `CartUIProvider` wraps `CartFeedbackProvider` because the toast feedback is logically contained within the cart UI subsystem

### Context Responsibilities

| Context | File | Purpose |
|---|---|---|
| `CartContext` | `context/CartContext.tsx` | Cart items, totals, wholesale logic, localStorage persistence |
| `CartUIContext` | `context/CartUIContext.tsx` | Cart drawer open/close state only |
| `CartFeedbackContext` | `context/CartFeedbackContext.tsx` | Add-to-cart toast (auto-clears after 2600ms) |
| `FavoritesContext` | `context/FavoritesContext.tsx` | Saved favorites, localStorage persistence |

---

## Data Flow

### Product Data

All product data lives in `app/data/fragrances.ts` as a static TypeScript array. There is no runtime API call for product data — it is bundled at build time.

```
fragrances.ts → imported directly into components and pages
              → generateStaticParams reads it at build time
              → MiniCart reads it for recommendation scoring
```

**Type definition:** `app/data/types.ts` — `Fragrance` type defines the AI recommendation schema (scentCharacter, projection, sweetness, freshness, warmth, intensity, versatility, popularity). The product display schema (prices, images, collection, mood, notes array) is defined inline in `fragrances.ts`.

Note: There is a type mismatch between `Fragrance` (in `types.ts`, used by the quiz/recommendation engine) and the product shape used by `ProductCard`, `CartContext`, and `MiniCart`. The display product data uses a flat `notes: string[]` array while `Fragrance` uses `notes: { top, heart, base }`. These are two parallel data models.

### Cart Data Flow

```
User action (Quick Add / Add to Cart)
  → addToCart() in CartContext
  → setCart() updates state
  → useEffect saves to localStorage
  → useMemo recomputes cartTotal, cartCount
  → wholesaleActive derived from cartCount >= 10
  → getWholesalePrice() applies wholesale rates if active
  → MiniCart reads all derived values via useCart()
```

### Checkout Flow (WhatsApp — Primary)

```
User clicks "Checkout via WhatsApp" in MiniCart
  → handleWhatsAppCheckout() builds order message string
  → window.open() to wa.me/27696863952 with encoded message
```

### Checkout Flow (PayFast — Secondary)

```
User fills checkout form → handlePayment()
  → POST /api/orders → Supabase insert (orders table, status: pending)
  → POST /api/payfast → builds PayFast query string
  → Returns sandbox URL
  → window.location.href redirects to PayFast sandbox
  → On return: /payment-success or /payment-cancel
```

---

## Routing

| Route | Type | Rendering |
|---|---|---|
| `/` | Client Component | CSR (homepage) |
| `/shop` | Client Component | CSR (filter/search state) |
| `/product/[slug]` | Server Component | SSG — pre-rendered at build |
| `/checkout` | Client Component | CSR |
| `/favorites` | Client Component | CSR |
| `/recently-viewed` | Client Component | CSR |
| `/best-sellers` | Client Component | CSR |
| `/new-arrivals` | Client Component | CSR |
| `/quiz` | Client Component | CSR |
| `/collections/skye` | Client Component | CSR |
| `/collections/rose` | Client Component | CSR |
| `/collections/elite` | Client Component | CSR |
| `/payment-success` | Client Component | CSR |
| `/payment-cancel` | Client Component | CSR |
| `/about`, `/faq`, `/contact`, `/delivery`, `/privacy`, `/terms`, `/wholesale` | Client Component | CSR — TODO: verify these pages exist and confirm rendering strategy |
| `/api/orders` | Route Handler | Server |
| `/api/payfast` | Route Handler | Server |

---

## State Management

No external state management library (no Zustand, Redux, Jotai). All state is managed with:

- **React Context** — shared app-level state (cart, favorites, UI)
- **useState / useMemo / useCallback** — local component state and derived data
- **localStorage** — cart and favorites persistence across sessions
- **URL / Next.js router** — page navigation state

---

## Component Hierarchy (Homepage)

```
page.tsx (HomePage)
├── Navbar
├── AnnouncementBar
├── [Promo strip section]
├── [KPI strip section]
├── AIHeroSection
├── LuxuryConfidenceBar
├── TrustBar
├── [Featured Fragrance section]
├── BestSellers
│   └── ProductCard × N
├── DiscoverySets
├── [Wholesale promo section]
├── LatestAdditions
│   ├── ProductCard × N
│   └── QuickAddModal
├── ShopByPersonality
├── Testimonials
├── FavoritesHome
│   └── ProductCard × N (favorites only)
├── RecentlyViewedHome
│   └── ProductCard × N (localStorage)
├── QuickAddModal (shared)
└── Footer
```

---

## Server / Client Boundaries

- **Server Components:** `app/product/[slug]/page.tsx` (async, reads params, injects JSON-LD)
- **Route Handlers:** `app/api/orders/route.ts`, `app/api/payfast/route.ts`
- **Client Components:** All other pages and the majority of components — they require `useCart`, `useFavorites`, `useCartUI`, `useCartFeedback`, local state, `localStorage`, `window`, or event handlers

Components that are `"use client"` are marked with the directive at the top of the file.

---

## Rendering Strategy

| Page | Strategy | Why |
|---|---|---|
| Product pages | Static Site Generation | SEO, performance, stable product data |
| Homepage | Client-Side Rendering | Requires context (favorites, recently viewed) |
| Shop | CSR | Search, filter, sort state |
| Checkout | CSR | Cart state, form state |

---

## Known Architectural Decisions

1. **Product data is static TypeScript** — not fetched from a CMS or API. This means re-deploy is required to add products. This was chosen for simplicity and build-time performance.

2. **WhatsApp is the primary checkout** — PayFast is secondary. This is a business decision; WhatsApp allows manual order confirmation and flexibility.

3. **Composite cart key is `id + size`** — the same fragrance in a different size is treated as a separate cart line item. `id` is typically `fragrance.title` (or `title-size` in QuickAddModal).

4. **Two product data shapes exist** — `Fragrance` type (quiz/recommendation) and the display shape used by ProductCard/Cart. These are intentionally separate for different use cases.

5. **No authentication** — the Supabase client uses the anon key. Order submission is unauthenticated. Customer identification is handled via the WhatsApp flow.

---

## Future Expansion Points

- CMS integration for product management without redeployment
- Customer authentication via Supabase Auth
- Order tracking dashboard
- PayFast ITN (Instant Transaction Notification) webhook for automated order status updates
- Inventory management
- Email order confirmation
- Wishlist sharing

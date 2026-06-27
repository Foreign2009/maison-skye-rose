# Changelog

**Project:** Maison Skye & Rose
**Related:** [ROADMAP.md](ROADMAP.md)

All notable changes are documented here, grouped by initiative. Entries are derived from git commit history.

---

## Phase 4 — Performance Optimization

### Image & Asset Cleanup
- Removed all unoptimized native `<img>` tags from `ProductDetail` — replaced with `next/image` using explicit dimensions and `priority` on the main image only
- Removed incorrect `priority` flags from non-above-fold images throughout the codebase
- Eliminated dead code and unused imports identified during the audit

### Context Performance
- Optimized `CartContext`: all mutation functions (`addToCart`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity`, `clearCart`, `getWholesalePrice`) wrapped in `useCallback`; derived values (`cartCount`, `cartTotal`) wrapped in `useMemo`; context value object memoized to prevent downstream re-renders
- `CartUIContext`: `openCart`, `closeCart` wrapped in `useCallback`; value object memoized
- `CartFeedbackContext`: `showFeedback` wrapped in `useCallback`; value object memoized
- `FavoritesContext`: all mutations in `useCallback`; value object memoized

### Component Rendering
- `ProductCard` wrapped in `React.memo()` — prevents re-renders when parent state changes unrelated to the card's props
- All `ProductCard` event handlers (`handleCardClick`, `handleFavorite`, `saveRecentlyViewed`) in `useCallback`
- `BestSellers`: `displayedBestSellers` interleaved sort wrapped in `useMemo`
- `LatestAdditions`: same interleaved sort pattern wrapped in `useMemo`
- `FavoritesHome`: `favoriteProducts` filter wrapped in `useMemo`
- `MiniCart`: all three recommendation arrays (`favoriteRecommendations`, `recentRecommendations`, `collectionRecommendations`) wrapped in `useMemo`

### Shop Page
- Search debounced by 300ms — `filtered` useMemo depends on `debouncedSearch` not raw `search`
- Empty search clears immediately (no debounce delay) for instant UX feedback
- Filter pipeline split into two memoized stages: `filtered` (search + collection filter) and `displayItems` (sort + special filters)

### Static Generation
- `generateStaticParams` added to `app/product/[slug]/page.tsx` — all product pages pre-rendered at build time
- Every product URL served as static HTML from the CDN

---

## Phase 3 — Product SEO & Metadata

### Per-Product SEO
- `generateMetadata` implemented on all product pages — title, description, canonical, robots, Open Graph, Twitter card
- Product JSON-LD structured data (`Product` schema with three `Offer` nodes for 5ml / 10ml / 30ml) injected via `<script type="application/ld+json">`
- OG image uses the product's 10ml bottle image
- Product description formula: mood text + notes list + starting price

### Data Fixes
- `normalizeImagePath()` utility ensures consistent leading slash on image paths used in metadata and JSON-LD
- Canonical URL constructed from `NEXT_PUBLIC_WEBSITE_URL` environment variable

---

## Phase 2 — Conversion Optimization

### Checkout & Orders
- WhatsApp order flow added to MiniCart checkout button — generates a formatted order summary with reward messaging
- WhatsApp Buy Now button added to Product Detail Page — pre-populates fragrance, size, quantity, and price
- Order persistence via Supabase `/api/orders` route — saves customer details, line items, subtotal, VAT, delivery, and total

### MiniCart Improvements
- Reward progress bar added (tracks spend toward R400 / R700 / R1000 / R1500 tiers)
- Smart recommendations section: favorites not in cart, recently viewed not in cart, collection-matched fragrances
- Wholesale pricing display in cart (crossed-out retail price, green wholesale price, savings amount)
- Savings summary row (shows total discount when wholesale active)
- WhatsApp checkout message includes reward tier messaging and wholesale flag

### Product Detail Page
- Mobile sticky CTA bar (appears after 300px scroll, shows size, title, price, Add To Cart)
- Size selector with descriptive labels (Perfect for Trying / Most Popular / Best Value)
- Trust signals block (Nationwide Delivery, 465+ Fragrances, Secure Checkout, Luxury Inspired)
- Fragrance profile card (collection, profile, season, best for)
- Fragrance notes section (Top / Heart / Base)
- Related products grid (same collection, up to 4)
- Recently viewed tracking on PDP mount

### Homepage
- Announcement bar
- KPI strip (465+ Fragrances, Free Sample threshold, WhatsApp Orders, SA Delivery)
- Free sample reward banner (above-fold and in featured section)
- Discovery Set conversion banner
- Recently Viewed section (reads localStorage)
- Favorites section (conditionally shown when favorites exist)
- Featured fragrance editorial block
- Wholesale teaser section with pricing chips

### Shop Page
- Sticky filter bar (mobile) — fixed position below Navbar
- Mobile filter/sort drawer modal
- Filter tabs: All, Skye, Rose, Elite, Best Sellers, New Arrivals
- Sort options: Featured, Price Low → High, Price High → Low, Best Sellers, New Arrivals
- Empty state with reset button

---

## Phase 1 — Foundation

### Core Systems
- Cart system: add, remove, increase, decrease, clear — localStorage persistence with hydration guard
- Favorites system: add, remove, toggle, check — localStorage persistence with hydration guard
- CartUI context: controls MiniCart open/close state
- CartFeedback context: add-to-cart toast (auto-clears after 2600ms)

### Components
- ProductCard with mobile/desktop responsive layouts
- QuickAddModal with Framer Motion animations, size selection, quantity control, reward preview
- MiniCart panel (full-screen on mobile, floating panel on desktop)
- SearchBar (controlled input)
- Navbar with cart icon and count badge
- Footer
- FloatingWhatsApp button
- CartSuccessToast

### Data
- `fragrances.ts` master catalogue with Skye, Rose, Elite collections
- `brand.ts` brand identity config (colors, social links, metadata defaults)
- `types.ts` Fragrance type for quiz/recommendation engine

### Infrastructure
- Supabase client setup (`app/lib/supabase.ts`)
- PayFast payment initialization route (`app/api/payfast/route.ts`) — sandbox mode
- Orders route (`app/api/orders/route.ts`) — inserts to Supabase `orders` table
- Payment success and cancel pages

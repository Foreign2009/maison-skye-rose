# Performance

**Project:** Maison Skye & Rose
**Related:** [ARCHITECTURE.md](ARCHITECTURE.md) · [UI_STANDARDS.md](UI_STANDARDS.md)

---

## Image Optimization

### Rules

- **Never use native `<img>` tags** — all images use `next/image`
- Always include `sizes` prop — describes image width at each breakpoint to enable correct srcset generation
- Use `fill` layout only when the parent has `position: relative` and explicit dimensions
- Use explicit `width` and `height` for images with known dimensions (e.g., QuickAddModal)
- `priority` on above-the-fold images only — homepage featured fragrance image uses `priority`; product grid images do not

### Current Usage Patterns

| Context | Pattern | Sizes |
|---|---|---|
| ProductCard | `fill` + `sizes` | `"(max-width: 768px) 50vw, 240px"` |
| MiniCart cart item | `fill` + `sizes` | `"96px"` |
| MiniCart recommendation | `fill` + `sizes` | `"40px"` |
| ProductDetail gallery | `width={240} height={240} priority` | Explicit dimensions |
| ProductDetail thumbnails | `width={64} height={64}` | Explicit dimensions |
| QuickAddModal | `width={180} height={180} style={{ width: "auto", height: "auto" }}` | Explicit |
| Product page related grid | `fill` + `sizes` | `"(max-width: 768px) 50vw, 25vw"` |
| Homepage featured | `fill` + `sizes` + `priority` | `"(max-width: 768px) 100vw, 480px"` |

### Background Gradients

Product image containers use CSS gradients (`bg-gradient-to-br from-pink-50 to-blue-50`) as background while the image loads. This provides a visually coherent placeholder without a separate loading state.

---

## Memoization Strategy

### Principles

Only memoize when there is a measurable rendering cost. Do not memoize trivially cheap computations.

### Current Memoization

**React.memo:**
- `ProductCard` — wrapped in `memo()` at export; renders in grids of 4–8+ so prevents cascade re-renders when parent state changes

**useMemo:**
- `CartContext.cartCount` — derived from `cart.reduce()`
- `CartContext.cartTotal` — derived from `cart.reduce()` with `getWholesalePrice()`
- `CartContext.value` — the entire context value object, prevents new object reference on each render
- `CartUIContext.value` — same pattern
- `CartFeedbackContext.value` — same pattern
- `FavoritesContext.value` — same pattern
- `BestSellers.displayedBestSellers` — interleaved collection sort; recalculated only once (empty deps array)
- `FavoritesHome.favoriteProducts` — filters `fragrances` array by favorites titles
- `LatestAdditions.latestAdditions` — interleaved collection sort; recalculated only once
- `ShopPage.filtered` — filters by search term and collection filter
- `ShopPage.displayItems` — sorts `filtered` result
- `MiniCart.favoriteRecommendations` — filters by favorites not in cart
- `MiniCart.recentRecommendations` — reads `localStorage` and filters by cart
- `MiniCart.collectionRecommendations` — score-based fragrance matching

**useCallback:**
- All `CartContext` mutation functions: `addToCart`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity`, `clearCart`, `getWholesalePrice`
- All `FavoritesContext` mutation functions: `addToFavorites`, `removeFromFavorites`, `clearFavorites`, `isFavorite`
- All `CartUIContext` functions: `openCart`, `closeCart`
- `CartFeedbackContext.showFeedback`
- `ProductCard.saveRecentlyViewed`, `handleCardClick`, `handleFavorite`

---

## Context Optimization

Each context exposes its value via `useMemo(() => ({ ... }), [deps])`. This prevents components that call `useCart()`, `useFavorites()`, etc. from re-rendering when unrelated parts of the provider re-render.

**Subscription scope:** Components should subscribe only to the context data they need. Currently all context consumers import the entire context hook. If re-render performance becomes a concern, the context could be split further (e.g., separate `useCartItems` from `useCartTotals`).

---

## Static Generation

Product pages use `generateStaticParams` in `app/product/[slug]/page.tsx`:

```ts
export function generateStaticParams() {
  return fragrances.map((f) => ({ slug: toSlug(f.title) }));
}
```

This pre-renders every product page at build time. No server-side computation happens at request time for product pages.

**Impact:** Cold start latency is eliminated for product pages; CDN-cached HTML is served immediately.

---

## Search Debouncing

`app/shop/page.tsx` implements a 300ms debounce on the search input:

```ts
useEffect(() => {
  if (!search) { setDebouncedSearch(""); return; }
  const timer = setTimeout(() => setDebouncedSearch(search), 300);
  return () => clearTimeout(timer);
}, [search]);
```

The `filtered` useMemo depends on `debouncedSearch`, not `search`, so the filtering computation does not run on every keystroke. Empty search clears immediately (no debounce) for instant UX.

---

## Lazy Loading

All images that are not above-the-fold use Next.js default lazy loading (no `priority` prop). This includes:

- All ProductCard images in grids
- All MiniCart images
- All related product images on PDP

---

## Client vs Server Components

Client components (`"use client"`) are necessary when a component uses:
- React hooks (`useState`, `useEffect`, `useContext`)
- Browser APIs (`localStorage`, `window`, `document`)
- Event handlers

The majority of this project's components are client components because they interact with cart, favorites, or browser state. The only server components are:
- `app/product/[slug]/page.tsx` — reads params, generates metadata, injects JSON-LD
- Route Handlers

---

## Bundle Size Considerations

- Framer Motion is imported in `QuickAddModal` only — not globally. If additional animations are added, verify they do not trigger tree-shaking failures
- Lucide React icons are imported individually (`import { Heart } from "lucide-react"`) — only used icons are bundled
- `fragrances.ts` is a large static data file bundled client-side. As the catalogue grows, consider:
  - Splitting into collection-specific modules imported lazily
  - Moving to a Supabase query with ISR (Incremental Static Regeneration)

---

## Performance Checklist

Before shipping any change:

- [ ] `npm run build` — zero errors, zero TypeScript errors
- [ ] No new `<img>` tags introduced — only `next/image`
- [ ] New components that render in lists are wrapped in `memo()`
- [ ] New event handlers use `useCallback()`
- [ ] New derived data uses `useMemo()`
- [ ] `priority` not added to non-above-fold images
- [ ] `sizes` prop provided on all `fill` layout images
- [ ] Search input changes are debounced if they trigger filtering
- [ ] No new `useEffect` dependencies that would cause infinite loops
- [ ] Context value objects are memoized (not created inline)

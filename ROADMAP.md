# Roadmap

**Project:** Maison Skye & Rose
**Related:** [CHANGELOG.md](CHANGELOG.md) · [SEO.md](SEO.md)

---

## Completed Milestones

### Phase 1 — Foundation
- Next.js 16 App Router project setup
- Product catalogue (`fragrances.ts`) with Skye, Rose, Elite collections
- Cart system with localStorage persistence
- Favorites system with localStorage persistence
- MiniCart panel with reward tier display
- Quick Add Modal with size/quantity selection
- ProductCard component with mobile and desktop layouts
- Basic checkout form with PayFast integration (sandbox)
- Supabase order persistence via `/api/orders`
- WhatsApp order flow from MiniCart

### Phase 2 — Conversion Optimization
- Homepage conversion banners and KPI strip
- Free sample reward messaging throughout the funnel
- Discovery Set conversion banner
- Smart fragrance recommendations in MiniCart (favorites, recently viewed, collection matching)
- Recently viewed product tracking (localStorage, 12-item history)
- Wholesale pricing tier (auto-activates at 10+ units)
- MiniCart reward progress bar
- PDP sticky CTA bar on mobile (appears after 300px scroll)
- WhatsApp Buy Now button on PDP
- Mobile shop optimization with sticky filter system

### Phase 3 — Product & SEO
- Per-product `generateMetadata` with Open Graph and Twitter card
- Product JSON-LD structured data (Product schema with Offer nodes)
- `generateStaticParams` for all product pages (static pre-rendering)
- Fragrance notes display on PDP (Top / Heart / Base)
- Related products section on PDP (same collection)
- Breadcrumb on PDP (desktop)

### Phase 4 — Performance
- Removed all unoptimized `<img>` tags from ProductDetail — replaced with `next/image`
- Removed incorrect `priority` flags from non-above-fold images
- CartContext optimization: `useMemo` on derived values, `useCallback` on all mutations
- Shop page filtering: debounced search, memoized filter + sort pipeline
- MiniCart re-render optimization: memoized recommendation arrays
- BestSellers and LatestAdditions: interleaved collection sort memoized
- FavoritesHome: memoized product matching
- ProductCard: wrapped in `memo()`, all handlers in `useCallback`
- FavoritesContext: hydration guard (prevents blank overwrite during initialization)

---

## Current Milestone

### Phase 5 — Documentation
- Comprehensive documentation system (this file and all related docs)
- CLAUDE.md AI operating manual v3.0

---

## Known Issues

- PayFast integration uses sandbox URL — requires switch to production URL before launch
- Checkout page (`/checkout`) calculates VAT inline (15%) — should be verified against business requirements
- Delivery pricing in checkout page differs from MiniCart logic (checkout uses province-based R100/R180; MiniCart uses cart total-based free delivery thresholds)
- `Fragrance` type in `types.ts` uses `notes: { top, heart, base }` but display components use `notes: string[]` — two parallel data models
- No `robots.txt` or `sitemap.xml` confirmed
- Homepage, collection pages, and shop page lack Open Graph metadata
- MiniCart `collectionRecommendations` references `fragrance.collection`, `fragrance.profile`, `fragrance.season` which may not exist on all catalogue entries
- PayFast ITN (webhook) handler not implemented — order payment status is never updated from `pending`
- Touch targets on MiniCart quantity buttons are 36px (h-9 w-9) — below 44px accessibility minimum

---

## High Priority

- [ ] Switch PayFast from sandbox to production (`https://www.payfast.co.za/eng/process`)
- [ ] Implement PayFast ITN webhook to update order `payment_status` from `pending` to `paid`
- [ ] Reconcile delivery pricing: align MiniCart logic with checkout page logic
- [ ] Add `app/sitemap.ts` for search engine indexing
- [ ] Add Open Graph metadata to homepage, collection pages, and shop page
- [ ] Audit and fix touch target sizes (44px minimum)

## Medium Priority

- [ ] Add Organization JSON-LD to root layout
- [ ] Add BreadcrumbList JSON-LD to product pages
- [ ] Add `robots.ts` (or `robots.txt`)
- [ ] Resolve the two `notes` data shapes — standardize to one type
- [ ] Add canonical URLs to shop and collection pages
- [ ] Add email order confirmation after successful payment
- [ ] Add inventory tracking (currently all products are hardcoded `InStock`)

## Low Priority

- [ ] Customer authentication (Supabase Auth)
- [ ] Order history page for returning customers
- [ ] Wishlist sharing via URL
- [ ] CMS integration for product management without code redeployment
- [ ] Product review/rating system
- [ ] Filter by scent profile (Fresh, Woody, Oriental, Floral) on shop page
- [ ] Progressive Web App (PWA) manifest for mobile homescreen install

---

## Launch Checklist

- [ ] PayFast switched to production
- [ ] All environment variables set in Vercel
- [ ] Custom domain configured and SSL active
- [ ] `robots.txt` allows crawling
- [ ] Sitemap submitted to Google Search Console
- [ ] PayFast ITN webhook live and tested
- [ ] Order flow tested end-to-end (add to cart → checkout → payment → success page)
- [ ] WhatsApp checkout tested end-to-end
- [ ] Mobile UX tested on physical device (375px)
- [ ] Build passes with zero TypeScript errors

---

## Future Ideas

- Fragrance subscription box
- Loyalty points system (beyond reward tiers)
- Bundle builder (pre-configured discovery sets)
- AI scent recommendation chatbot
- Wholesale portal with separate pricing and checkout
- Gift wrapping option at checkout
- Affiliate / referral program

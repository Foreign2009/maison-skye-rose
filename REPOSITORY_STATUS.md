# Repository Status — Maison Skye & Rose

**Snapshot date:** 2026-08-14
**Branch:** main
**Last reviewed commit:** c92cbe6 — EP100-P4 — Cache Analytics Queries

> **Note:** This snapshot was refreshed as part of EP100 governance close-out (2026-08-14). The repository structure and component tables below reflect the 2026-07-03 snapshot and have not been fully re-inventoried. The build status, environment variables, and known risks sections reflect the current verified state.

---

## Repository Structure

```
maison-skye-rose/
├── app/                         # Next.js App Router source
│   ├── api/                     # Server-side Route Handlers
│   │   ├── orders/route.ts      # POST: persist order to Supabase
│   │   └── payfast/route.ts     # POST: initialize PayFast payment
│   ├── components/              # Shared UI components (44 files)
│   ├── context/                 # React Context providers (4 files)
│   ├── data/                    # Static data modules (22 files)
│   ├── lib/                     # Library modules
│   │   ├── mkc/                 # Maison Knowledge Catalogue (5 files)
│   │   ├── analytics.ts         # Analytics service module
│   │   ├── explainability.ts    # Recommendation reasons
│   │   ├── intentParser.ts      # Natural language → intent signals
│   │   ├── knowledgeAdapter.ts  # MKC → recommendation candidates
│   │   ├── recommendFragrances.ts # Scoring + slot generation
│   │   └── supabase.ts          # Supabase client
│   ├── product/[slug]/          # Dynamic product route (SSG)
│   ├── shop/                    # Shop page
│   ├── quiz/                    # Scent Finder quiz
│   ├── checkout/                # Checkout page
│   ├── favorites/               # Favorites page
│   ├── best-sellers/            # Best sellers page
│   ├── new-arrivals/            # New arrivals page
│   ├── recently-viewed/         # Recently viewed page
│   ├── collections/             # skye/ rose/ elite/ subdirs
│   ├── about/ contact/ faq/     # Static info pages
│   ├── delivery/ privacy/ terms/ wholesale/
│   ├── payment-success/         # PayFast return
│   ├── payment-cancel/          # PayFast cancel
│   ├── sitemap.ts               # sitemap.xml generator
│   ├── robots.ts                # robots.txt generator
│   ├── layout.tsx               # Root layout + provider tree
│   ├── page.tsx                 # Homepage
│   ├── loading.tsx              # Global loading UI
│   └── globals.css              # Global styles
├── docs/                        # Feature documentation
├── .ai/                         # AI engineering operating system
│   ├── evaluation/              # Recommendation evaluation framework
│   └── *.md                     # Context, decisions, sprint, log files
├── public/                      # Static assets
├── CLAUDE.md                    # Claude Code operating manual
├── CHATGPT.md                   # ChatGPT operating model
├── ARCHITECTURE.md              # System architecture
├── CHANGELOG.md                 # Engineering history
├── CONTRIBUTING.md              # Development workflow
├── DECISIONS.md                 # Architecture Decision Records
├── PROJECT_STATUS.md            # Living engineering status
├── REPOSITORY_STATUS.md         # This file
├── ROADMAP.md                   # Engineering roadmap
├── next.config.ts               # Next.js configuration
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

---

## Current App Structure

### Pages (120 total)

| Route | Type | Rendering |
|---|---|---|
| `/` | Client Component | Static |
| `/shop` | Client Component | Static |
| `/quiz` | Client Component | Static |
| `/product/[slug]` | Server Component | SSG × 93 |
| `/best-sellers` | Client Component | Static |
| `/new-arrivals` | Client Component | Static |
| `/recently-viewed` | Client Component | Static |
| `/favorites` | Client Component | Static |
| `/checkout` | Client Component | Static |
| `/collections/skye` | Client Component | Static |
| `/collections/rose` | Client Component | Static |
| `/collections/elite` | Client Component | Static |
| `/about` | Client Component | Static |
| `/faq` | Client Component | Static |
| `/contact` | Client Component | Static |
| `/delivery` | Client Component | Static |
| `/privacy` | Client Component | Static |
| `/terms` | Client Component | Static |
| `/wholesale` | Client Component | Static |
| `/payment-success` | Client Component | Static |
| `/payment-cancel` | Client Component | Static |
| `/sitemap.xml` | Route | Static |
| `/robots.txt` | Route | Static |
| `/api/orders` | Route Handler | Dynamic |
| `/api/payfast` | Route Handler | Dynamic |

### Components (44 files in app/components/)

| Component | Purpose |
|---|---|
| `Navbar.tsx` | Site navigation — 4 links, utility icons |
| `Footer.tsx` | 5-column footer with links and contact |
| `ProductCard.tsx` | Product display card (Quick Add + Learn More) |
| `ProductDetail.tsx` | MKC-native full fragrance profile (9 sections) |
| `FragranceQuickView.tsx` | MKC-powered learn more modal |
| `QuickAddModal.tsx` | Size/quantity selector overlay |
| `MiniCart.tsx` | Cart drawer with rewards and recommendations |
| `RecommendationCard.tsx` | Recommendation slot card with reasons |
| `SearchBar.tsx` | Controlled search input |
| `AnalyticsInit.tsx` | PostHog session initialization |
| `AnnouncementBar.tsx` | Rotating announcement messages |
| `AIHeroSection.tsx` | Homepage AI intelligence hero |
| `BestSellers.tsx` | Best sellers section |
| `LatestAdditions.tsx` | New arrivals section |
| `ShopByPersonality.tsx` | Personality card discovery |
| `ShopByVibe.tsx` | Vibe tile discovery (decorative — not wired) |
| `Testimonials.tsx` | Customer testimonials |
| `FavoritesHome.tsx` | Saved favorites on homepage |
| `RecentlyViewedHome.tsx` | Recently viewed on homepage |
| `DiscoverySets.tsx` | Discovery set conversion section |
| `CartSuccessToast.tsx` | Add-to-cart feedback toast |
| `FloatingWhatsApp.tsx` | WhatsApp contact button |
| `LuxuryConfidenceBar.tsx` | Trust indicators |
| `TrustBar.tsx` | Secondary trust bar |
| `QuizResults.tsx` | Quiz recommendation results (defined, used in quiz) |

---

## Current Knowledge Flow

```
mkcCatalogue (app/lib/mkc/catalogue.ts)
   │
   ├── toDisplayFragrance()      → DisplayFragrance   → ProductDetail, FragranceQuickView
   │     (displayAdapter.ts)
   │
   ├── toRecommendationFragrance() → Fragrance        → Intelligence Layer
   │     (recommendationAdapter.ts)
   │
   └── generateWhyYoullLikeIt()  → [string, string, string]  → ProductDetail, FragranceQuickView
         (merchandising.ts)
```

---

## Current MKC Consumers

| Consumer | File | MKC Fields Used |
|---|---|---|
| ProductDetail | `app/components/ProductDetail.tsx` | All (canonical prop: `knowledge: FragranceKnowledge`) |
| FragranceQuickView | `app/components/FragranceQuickView.tsx` | All (canonical prop: `knowledge: FragranceKnowledge`) |
| product/[slug] page | `app/product/[slug]/page.tsx` | All — generateMetadata + JSON-LD |
| Shop page | `app/shop/page.tsx` | toDisplayFragrance + toRecommendationFragrance |
| merchandising | `app/lib/mkc/merchandising.ts` | notes.top, scentCharacter, occasions, season |

---

## Current Product Flow

```
User visits /product/[fragrance-slug]
  → app/product/[slug]/page.tsx (Server Component, SSG)
  → findKnowledge(slug) → mkcCatalogue lookup
  → generateMetadata() → title, description, OG, canonical
  → JSON-LD Product schema injected
  → <ProductDetail knowledge={knowledge} />
  → ProductDetail renders 9 sections using MKC fields directly
```

```
User clicks Quick Add on ProductCard
  → QuickAddModal (size/quantity selection)
  → addToCart() → CartContext
  → CartFeedbackContext (toast)
  → trackAddToCart() → analytics.ts → PostHog
```

```
User clicks Learn More on ProductCard (desktop)
  → FragranceQuickView modal opens
  → Renders MKC data (notes, character, bullets, size selector)
  → Add to Cart → same CartContext flow as above
  → "View Full Profile" → navigates to /product/[slug]
```

---

## Current Navigation

**Navbar (desktop):**
- Left: Shop · New Arrivals
- Right: Scent Finder · Wholesale
- Center: SKYE & ROSE (home)
- Icons: Favorites · Recently Viewed · Account · Cart

**Navbar (mobile):**
- Fullscreen overlay: Shop · New Arrivals · Scent Finder · Wholesale

**Footer columns:**
1. Shop — Shop All, Skye Collection, Rose Collection
2. Explore — Fragrance Quiz, About Us, Contact
3. Customer Care — FAQ, Delivery, Privacy, Terms
4. Departments — email contacts
5. Get In Touch — WhatsApp, location

---

## Current Build Status

**Last verified:** 2026-08-12 — commit c92cbe6 (EP100-P4) and commit 7598620 (EP6-P5E-R Phase 4C-1)

```
✓ Build: PASS
✓ Static generation: 189/189
○ TypeScript: 0 errors
○ Warnings: 0
```

The route count has grown substantially since the 2026-07-03 snapshot due to admin dashboard routes (EP100), Maison Identity Platform admin routes (EP5), and relationship review routes (EP6-P5). The 2026-07-03 route table below is no longer current.

---

## Current Static Pages

All product pages are pre-rendered at build time via `generateStaticParams` in `app/product/[slug]/page.tsx` using `mkcCatalogue.map(k => ({ slug: k.slug }))`.

93 product slugs are currently in `mkcCatalogue`.

---

## Current Environment Variables

| Variable | Scope | Used by |
|---|---|---|
| `NEXT_PUBLIC_WEBSITE_URL` | Client | Metadata base URL, canonical URLs |
| `NEXT_PUBLIC_SUPABASE_URL` | Client | Supabase client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Supabase client (anon) |
| `NEXT_PUBLIC_PAYFAST_MERCHANT_ID` | Client | PayFast route |
| `NEXT_PUBLIC_PAYFAST_MERCHANT_KEY` | Client | PayFast route |
| `PAYFAST_PASSPHRASE` | **Server-only** | PayFast route handler — KI-05 resolved (commit 9f9f7f5) |
| `PAYFAST_ENV` | Server-only | PayFast URL control (`live` / any other value = sandbox) |
| `NEXT_PUBLIC_POSTHOG_KEY` | Client | AnalyticsInit |
| `NEXT_PUBLIC_POSTHOG_HOST` | Client | AnalyticsInit |

---

## Current Feature Flags

None. No feature flag system exists in the current implementation.

---

## Current TODOs

TODOs in production code (from code review):

| Location | TODO |
|---|---|
| `app/components/ProductDetail.tsx` | Replace collection matching with MKC similarity scoring (×2) |

---

## Current Known Risks

> **Zero open tracked risks as of 2026-08-02.** All risks from the 2026-07-03 snapshot have been resolved. See `.ai/KNOWN_ISSUES.md` for full resolution records (KI-01 through KI-16).

| Previously tracked risk | Resolved | Commit |
|---|---|---|
| PayFast on sandbox | ✓ | 9f9f7f5 — `PAYFAST_ENV` controls live/sandbox routing |
| PayFast ITN not implemented | ✓ | 9f9f7f5 — `app/api/payfast/itn/route.ts` implemented |
| PayFast MD5 signature missing | ✓ | 9f9f7f5 — `computeSignature()` in route handler |
| PayFast passphrase in client bundle | ✓ | 9f9f7f5 — `PAYFAST_PASSPHRASE` now server-only |
| Hardcoded PayFast customer details | ✓ | 9f9f7f5 — real customer data from checkout form |
| Delivery pricing mismatch | ✓ | 74c8789 — MiniCart switched to "Subtotal" label |
| MiniCart touch targets below 44px | ✓ | EP6-P4 — buttons updated to `h-11 w-11` (44px) |

---

## Last Reviewed Commit

`c92cbe6` — EP100-P4 — Cache Analytics Queries (2026-08-12)

Full git log: `git log --oneline`

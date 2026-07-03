# Repository Status — Maison Skye & Rose

**Snapshot date:** 2026-07-03
**Branch:** main
**Last reviewed commit:** 88c166e (feat(mkc): introduce maison fragrance profile experience)

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

```
npm run build

✓ Compiled successfully
✓ Generating static pages (120/120)
○ TypeScript: 0 errors
○ Warnings: 0
```

| Route type | Count |
|---|---|
| Static (○) | 25 |
| SSG (●) | 93 |
| Dynamic (ƒ) | 2 |
| Total | 120 |

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
| `NEXT_PUBLIC_PAYFAST_PASSPHRASE` | Client | PayFast route (⚠ should be server-only) |
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

| Risk | Severity | Notes |
|---|---|---|
| PayFast on sandbox | Critical | No real payments are processed |
| PayFast ITN not implemented | Critical | payment_status never updates |
| PayFast MD5 signature missing | Critical | Required for production |
| PayFast passphrase in client bundle | High | `NEXT_PUBLIC_PAYFAST_PASSPHRASE` exposed |
| Hardcoded PayFast customer details | High | name/email are placeholder strings |
| Delivery pricing mismatch | High | MiniCart vs Checkout show different amounts |
| ShopByVibe tiles not functional | Low | Decorative only, no search injection |
| MiniCart touch targets below 44px | Low | Quantity buttons are 36px |

---

## Last Reviewed Commit

`88c166e` — feat(mkc): introduce maison fragrance profile experience

Full git log: `git log --oneline`

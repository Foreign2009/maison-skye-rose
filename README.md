# Maison Skye & Rose

**Tagline:** Inspired By Icons. Crafted For You.

A luxury-inspired fragrance e-commerce platform built for the South African market. Customers explore 465+ fragrances across three curated collections, build orders via WhatsApp or PayFast checkout, and unlock progressive reward tiers as their cart grows.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 App Router |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Backend | Supabase (PostgreSQL) |
| Payments | PayFast |
| Deployment | Vercel |
| Runtime | React 19.2.4 |

---

## Features

- **465+ Fragrance Catalogue** — Skye, Rose, Elite collections
- **Quick Add Modal** — Size selection, quantity, real-time reward preview, Framer Motion animations
- **Cart System** — localStorage persistence, composite key (product id + size), wholesale pricing
- **Reward Tiers** — Progressive free sample unlocks at R400 / R700 / R1000 / R1500
- **Wholesale Pricing** — Auto-activates at 10+ units: 5ml R48 · 10ml R77 · 30ml R180
- **MiniCart** — Slide-in panel with rewards display, smart recommendations, WhatsApp checkout
- **WhatsApp Checkout** — Primary order flow
- **PayFast Checkout** — Secondary checkout form (sandbox mode active)
- **Favorites System** — localStorage persistence, cross-session
- **Recently Viewed** — 12-item history on homepage and MiniCart
- **Fragrance Quiz** — Personality-based recommendation engine
- **Static Product Pages** — Pre-rendered via `generateStaticParams`
- **Per-Product SEO** — `generateMetadata` + Product JSON-LD on every product page
- **Mobile-First** — Swipeable carousels, sticky CTAs, 44px touch target standard (MiniCart buttons in progress)

---

## Installation

```bash
git clone <repository-url>
cd maison-skye-rose
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PAYFAST_MERCHANT_ID=your_merchant_id
NEXT_PUBLIC_PAYFAST_MERCHANT_KEY=your_merchant_key
NEXT_PUBLIC_PAYFAST_PASSPHRASE=your_passphrase
NEXT_PUBLIC_WEBSITE_URL=https://your-domain.com
```

---

## Development

```bash
npm run dev
# http://localhost:3000
```

---

## Build

```bash
npm run build
```

All product pages are pre-rendered at build time. Build output reports pages generated, bundle sizes, and TypeScript errors.

---

## Deployment

Deployed on Vercel. Push to `main` triggers production deployment.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## Folder Structure

```
maison-skye-rose/
├── app/
│   ├── api/
│   │   ├── orders/route.ts          # Supabase order persistence
│   │   └── payfast/route.ts         # PayFast payment init
│   ├── components/                  # All UI components
│   ├── context/
│   │   ├── CartContext.tsx           # Cart state, wholesale, totals
│   │   ├── CartUIContext.tsx         # Cart open/close visibility
│   │   ├── CartFeedbackContext.tsx   # Add-to-cart toast
│   │   └── FavoritesContext.tsx      # Favorites state
│   ├── data/
│   │   ├── fragrances.ts             # Master product catalogue
│   │   ├── types.ts                  # TypeScript types
│   │   ├── brand.ts                  # Brand identity config
│   │   └── *.ts                      # Supporting data
│   ├── lib/
│   │   └── supabase.ts               # Supabase client
│   ├── product/[slug]/page.tsx       # Static product pages
│   ├── shop/page.tsx                 # Shop / catalogue
│   ├── checkout/page.tsx             # PayFast checkout
│   ├── favorites/page.tsx            # Favorites page
│   ├── layout.tsx                    # Root layout + context tree
│   └── page.tsx                      # Homepage
├── docs/                             # Feature documentation
├── public/                           # Images and static assets
├── CLAUDE.md                         # AI operating manual
├── ARCHITECTURE.md
├── UI_STANDARDS.md
├── PERFORMANCE.md
├── SEO.md
├── ROADMAP.md
├── CHANGELOG.md
├── CONTRIBUTING.md
└── README.md
```

---

## Coding Standards

- TypeScript throughout — no untyped `any`
- Components: `export default memo(Component)` where it reduces rendering cost
- All event handlers: `useCallback()`
- All derived data: `useMemo()` (only where computation is non-trivial)
- All images: `next/image` with `sizes` prop — no native `<img>`
- Mobile-first: design at 375px, enhance at 768px+

---

## AI Workflow

- **CLAUDE.md** — Permanent AI operating manual, loaded at every Claude Code session
- **Claude Code** — Implementation, refactoring, debugging, builds, commits
- **ChatGPT** — Architecture review, planning, SEO strategy, risk analysis

---

## Documentation

| Document | Purpose |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Project structure and data flow |
| [UI_STANDARDS.md](UI_STANDARDS.md) | Brand design system |
| [PERFORMANCE.md](PERFORMANCE.md) | Performance strategy |
| [SEO.md](SEO.md) | SEO implementation |
| [ROADMAP.md](ROADMAP.md) | Milestones and planned work |
| [CHANGELOG.md](CHANGELOG.md) | Release history |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Development process |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment guide |
| [docs/SUPABASE.md](docs/SUPABASE.md) | Database documentation |
| [docs/PAYFAST.md](docs/PAYFAST.md) | Payment integration |
| [docs/REWARDS.md](docs/REWARDS.md) | Reward tier system |
| [docs/WHOLESALE.md](docs/WHOLESALE.md) | Wholesale pricing |
| [docs/CART.md](docs/CART.md) | Cart system |
| [docs/QUICK_ADD.md](docs/QUICK_ADD.md) | Quick Add Modal |
| [docs/PRODUCT_DETAIL.md](docs/PRODUCT_DETAIL.md) | Product detail page |
| [docs/SEARCH.md](docs/SEARCH.md) | Search and filtering |
| [docs/FAVORITES.md](docs/FAVORITES.md) | Favorites system |
| [docs/MINICART.md](docs/MINICART.md) | MiniCart |

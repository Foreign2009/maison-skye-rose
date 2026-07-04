# Architecture — Maison Skye & Rose

**Project:** Maison Skye & Rose
**Framework:** Next.js 16 App Router
**Last updated:** 2026-07-03
**Related:** [DECISIONS.md](DECISIONS.md) · [REPOSITORY_STATUS.md](REPOSITORY_STATUS.md)

---

## System Overview

Maison Skye & Rose is a luxury fragrance ecommerce platform with an embedded intelligence layer. The architecture has three concerns:

1. **Commerce** — product discovery, cart, checkout
2. **Knowledge** — the Maison Knowledge Catalogue (MKC), the canonical fragrance model
3. **Intelligence** — recommendation engine, intent parsing, explainability

These systems are layered: Commerce surfaces consume Knowledge through Intelligence.

```
┌────────────────────────────────────────────────────────────────┐
│                        Customer Surfaces                       │
│   Homepage   Shop   Quiz   Product Detail   Quick View         │
└─────────────────────┬──────────────────────────────────────────┘
                      │
┌─────────────────────▼──────────────────────────────────────────┐
│                    Intelligence Layer                          │
│   Intent Parser → Knowledge Adapter → Recommendation Engine   │
│                                     → Explainability          │
└─────────────────────┬──────────────────────────────────────────┘
                      │
┌─────────────────────▼──────────────────────────────────────────┐
│               Maison Knowledge Catalogue (MKC)                 │
│      FragranceKnowledge (canonical)                            │
│      mkcCatalogue (93 entries)                                 │
│      displayAdapter · recommendationAdapter · merchandising    │
└─────────────────────┬──────────────────────────────────────────┘
                      │
┌─────────────────────▼──────────────────────────────────────────┐
│                   Support Systems                              │
│   Analytics (PostHog)   SEO (sitemap, robots, JSON-LD)         │
│   Commerce (Cart, Checkout, Supabase)                          │
└────────────────────────────────────────────────────────────────┘
```

---

## App Router

This project uses the Next.js 16 App Router exclusively. There is no `pages/` directory.

| Convention | Usage |
|---|---|
| `app/layout.tsx` | Root layout — wraps all pages with the full Context provider tree |
| `app/product/[slug]/page.tsx` | Server Component — `generateStaticParams` + `generateMetadata` + JSON-LD |
| All other pages | `"use client"` — require localStorage, React Context, or event handlers |
| `app/api/*/route.ts` | Route Handlers — server-only, no browser APIs |
| `app/sitemap.ts` | Static sitemap generator |
| `app/robots.ts` | Static robots.txt generator |

---

## Commerce System

### Context Provider Tree

Providers are nested in `app/layout.tsx` in this order (outermost first):

```
FavoritesProvider
  CartProvider
    CartUIProvider
      CartFeedbackProvider
        {children}
        CartSuccessToast
        FloatingWhatsApp
        AnalyticsInit
```

| Context | File | Responsibility |
|---|---|---|
| `FavoritesContext` | `context/FavoritesContext.tsx` | Saved favorites, localStorage persistence |
| `CartContext` | `context/CartContext.tsx` | Cart items, totals, wholesale logic, localStorage |
| `CartUIContext` | `context/CartUIContext.tsx` | MiniCart open/close state |
| `CartFeedbackContext` | `context/CartFeedbackContext.tsx` | Add-to-cart toast (auto-clears 2600ms) |

### Cart Data Flow

```
User action (Quick Add / Add to Cart / Buy Now)
  → addToCart() in CartContext
  → setCart() updates state
  → useEffect persists to localStorage
  → useMemo recomputes cartTotal, cartCount
  → wholesaleActive derived from cartCount >= 10
  → getWholesalePrice() applies wholesale rates when active
  → MiniCart reads all derived values via useCart()
  → trackAddToCart() → analytics.ts → PostHog
```

### Cart Composite Key

Cart line items are uniquely identified by `id + size`. The `id` field is the URL slug of the fragrance (standardized in EP10). Same fragrance in different sizes = separate line items.

### Checkout Flows

**Primary — WhatsApp:**
```
MiniCart → "Checkout via WhatsApp"
  → handleWhatsAppCheckout()
  → wa.me/ URL with encoded order summary
  → Manual order confirmation via WhatsApp
```

**Secondary — PayFast:**
```
Checkout form → handlePayment()
  → POST /api/orders → Supabase (status: pending)
  → POST /api/payfast → PayFast query string
  → window.location.href → PayFast (sandbox)
  → /payment-success or /payment-cancel
```

Note: PayFast is running on sandbox. No real payments are processed. See DECISIONS.md ADR-006.

### Reward Tiers

| Threshold | Reward |
|---|---|
| R400 | 1 free 5ml sample |
| R700 | 2 free 5ml samples |
| R1000 | 3 free 5ml samples |
| R1500 | Free Discovery Set |

### Wholesale Pricing

Auto-activates at 10+ units in cart. No account required. Wholesale rates are applied by `getWholesalePrice()` in CartContext. MiniCart shows crossed-out retail price, green wholesale price, and savings amount.

---

## Maison Knowledge Catalogue (MKC)

The MKC is the canonical fragrance knowledge system. It is the single source of truth for all fragrance data.

### Canonical Model

```typescript
// app/lib/mkc/types.ts

FragranceKnowledge {
  // Identity
  id, slug, brand, name, collection, catalogVersion, status

  // Classification
  gender, family[], scentCharacter, projection

  // Composition
  profile, season, notes { top[], heart[], base[] }, mood

  // Discovery
  vibe[], occasions[], seasons[], signatureStyle[], recommendedFor[]

  // Merchandising
  prices { "5ml", "10ml", "30ml" }
  images { "5ml", "10ml", "30ml" }
  bestSeller, newArrival, featured

  // Education
  subtitle?, description?

  // Intelligence
  sweetness, freshness, warmth, intensity, versatility, popularity
}
```

### Two-Shape Model

MKC projects into two shapes for different consumers:

```
FragranceKnowledge (canonical)
       │
       ├── toDisplayFragrance()  → DisplayFragrance
       │   (app/lib/mkc/displayAdapter.ts)
       │   Used by: shop page display, component UI
       │
       └── toRecommendationFragrance()  → Fragrance
           (app/lib/mkc/recommendationAdapter.ts)
           Used by: Intelligence Layer (scoring, signals)
```

The two shapes serve different concerns:
- `DisplayFragrance` — optimized for UI rendering (flat notes array, merchandising fields)
- `Fragrance` — optimized for Intelligence scoring (numeric axes, structured notes, collection)

### Shared Merchandising

```typescript
// app/lib/mkc/merchandising.ts

generateWhyYoullLikeIt(k: FragranceKnowledge): [string, string, string]
```

Derives three lifestyle bullets from MKC fields. No invented content. Pure deterministic function. Shared by FragranceQuickView and ProductDetail.

### MKC Consumers

| Consumer | Prop type | MKC entry point |
|---|---|---|
| `ProductDetail` | `knowledge: FragranceKnowledge` | Direct — all fields |
| `FragranceQuickView` | `knowledge: FragranceKnowledge` | Direct — all fields |
| `app/product/[slug]/page.tsx` | Server — `findKnowledge(slug)` | mkcCatalogue lookup |
| `app/shop/page.tsx` | Client — module-level maps | toDisplayFragrance + toRecommendationFragrance |
| `merchandising.ts` | Pure function | notes.top, scentCharacter, occasions, season |

---

## Intelligence Layer

The Intelligence Layer translates customer intent (natural language search) into ranked fragrance recommendations. It is a pure TypeScript library — no React, no API calls, no side effects.

**Architectural rule:** The Intelligence Layer must never import `analytics.ts`. Observability lives at call sites in consumers.

### Modules

```
app/lib/
├── intentParser.ts         — Natural language → IntentSignals
├── knowledgeAdapter.ts     — Fragrance[] → scored candidates
├── recommendFragrances.ts  — Scoring → 4 recommendation slots
└── explainability.ts       — Candidate → [string, string] reasons
```

### Data Flow

```
User types search query (e.g., "fresh floral for summer")
  │
  ▼
intentParser.ts — parseIntent(query)
  → IntentSignals { gender?, occasion?, family?, vibe?, character? }
  │
  ▼
knowledgeAdapter.ts — adaptCatalogue(fragrances) → Fragrance[]
  → Normalised candidates with scoring fields
  │
  ▼
recommendFragrances.ts — recommendFragrances(signals, candidates)
  → RecommendationResult {
       scored: ScoredFragrance[],
       bestMatch: ScoredFragrance,
       hiddenGem: ScoredFragrance | null,
       luxuryUpgrade: ScoredFragrance | null,
       alternative: ScoredFragrance | null,
       matchStrength: "strong" | "moderate" | "partial",
       mode: 0 | 1 | 2
     }
  │
  ▼
explainability.ts — generateReasons(signals, candidate)
  → ExplanationResult { reasons: string[] }
  │
  ▼
RecommendationCard — displays slot with reasons
```

### Recommendation Slots

| Slot | Criterion | Customer label |
|---|---|---|
| bestMatch | Highest overall score | Best Match |
| hiddenGem | Highest-scoring standard non-bestseller, not Elite | Hidden Gem |
| luxuryUpgrade | Highest-scoring Elite collection product | Luxury Upgrade |
| alternative | Second-highest overall score | You Might Also Like |

### Discovery Modes

| Mode | Condition | Shop behaviour |
|---|---|---|
| 0 | No search | Default sort, no signal pills, no confidence label |
| 1 | Search with parsed intent signals | Recommendation ranking, signal pills, confidence label |
| 2 | Search with no parseable signals | Keyword fallback, no pills, no label |

### Shop Integration

```
app/shop/page.tsx
  │
  ├── detectedSignals useMemo — IntentSignals from intentParser
  ├── firstCardStrength useMemo — matchStrength from recommendFragrances
  ├── Signal pills JSX — "Curated for you: Fresh · Floral · Summer"
  └── Confidence label JSX — "Perfect Match" / "Great Match"
```

### Quiz Integration

```
app/quiz/page.tsx
  │
  ├── User answers 5 questions (gender, family, occasion, character, vibe)
  ├── recommendFragrances() called with quiz answers as signals
  └── QuizResults — renders bestMatch, hiddenGem, luxuryUpgrade, alternative
```

---

## Analytics System

### Architecture

```
Call site (component handler or useEffect)
  → track*() function in app/lib/analytics.ts
  → safeCall() — catches errors silently
  → providerCapture() — PostHog capture (active)
  → PostHog servers
```

**Key principle:** Analytics observes behaviour — it never influences it. The Intelligence Layer never imports analytics. Analytics calls always follow state updates, never precede them.

### Session Identity

```typescript
// app/components/AnalyticsInit.tsx

const SESSION_KEY = "msr_session_id";
const existing = localStorage.getItem(SESSION_KEY);
if (!existing) {
  localStorage.setItem(SESSION_KEY, crypto.randomUUID());
}
```

Anonymous UUID persists in `localStorage['msr_session_id']` across page loads.

### Instrumented Events

| Journey | Events |
|---|---|
| Discovery (shop) | `discovery_mode`, `confidence_label_shown`, `filter_applied`, `sort_applied`, `product_clicked` |
| Quiz | `quiz_answer_selected`, `quiz_completed`, `quiz_results_shown`, `quiz_whatsapp_clicked`, `product_clicked` |
| Commerce | `product_detail_viewed`, `add_to_cart`, `cart_opened`, `checkout_started`, `payment_started`, `payment_return_success`, `payment_return_cancelled`, `buy_now_clicked`, `whatsapp_checkout_started` |

### Provider

PostHog JS is the active provider. Environment variables:
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

The provider integration point in `analytics.ts` is clearly marked so a future provider swap requires changes only within that file.

---

## SEO System

### Per-Product SEO

`app/product/[slug]/page.tsx` — Server Component:

```typescript
generateMetadata({ params }) → Metadata {
  title: "${knowledge.name} | Maison Skye & Rose",
  description: "${mood}. Notes: ${notes.slice(0,4)}. From R${startingPrice}.",
  alternates: { canonical: "${baseUrl}/product/${slug}" },
  openGraph: { title, description, url, images: [{ url: ogImage }] },
  twitter: { card: "summary_large_image", ... }
}
```

JSON-LD Product schema:
```json
{
  "@type": "Product",
  "name": "...",
  "sku": "slug",
  "offers": [
    { "@type": "Offer", "name": "5ml", "price": 149 },
    { "@type": "Offer", "name": "10ml", "price": 249 },
    { "@type": "Offer", "name": "30ml", "price": 449 }
  ]
}
```

### Sitemap

`app/sitemap.ts` — generates sitemap.xml from `mkcCatalogue`. All 93 product pages are indexed.

### robots.txt

`app/robots.ts` — configured robots.txt via Next.js App Router metadata route.

---

## Maison Knowledge Catalogue — Growth Principle

The MKC is designed for continuous growth. The catalogue is not fixed.

**Architectural guarantee:** Adding any number of fragrances to `mkcCatalogue` requires changes only to `app/lib/mkc/catalogue.ts`. No routes, adapters, components, or Intelligence Layer code changes. `generateStaticParams` picks up new slugs automatically. The sitemap picks up new products automatically.

**Current scale:** 93 fragrances.
**Design ceiling:** Hundreds or thousands of entries — the architecture is unchanged at any scale. The Intelligence Layer scores in O(n) time; MkC lookups use Map structures for O(1) access.

**Growth pattern:** New supplier releases are added to `mkcCatalogue` as a new `FragranceKnowledge` object. All downstream consumers — product pages, shop, quiz, academy cross-links, analytics, SEO — automatically reflect the new entry on the next build.

**Future consumers of MKC:**

| Consumer | Status |
|---|---|
| Product Detail Pages | Live |
| Shop page | Live |
| Recommendation Engine | Live |
| Analytics | Live |
| SEO (sitemap, metadata, JSON-LD) | Live |
| Fragrance Quick View | Live |
| Academy — related fragrances | In progress (EP13) |
| Search (structured + semantic) | Future |
| AI Assistant (Ask Maison AI) | Future |
| Mobile application | Future |
| Future CMS / editorial layer | Future |

No fragrance knowledge should exist outside MKC. If a new consumer needs fragrance data, the answer is always: add a field to `FragranceKnowledge` and project it through an adapter.

---

## Maison Fragrance Academy

The Academy is a first-class product — the permanent knowledge platform for Maison Skye & Rose. It educates customers, builds trust, reduces purchase uncertainty, and grounds the AI in structured knowledge. It is not a blog and not a supporting page.

### Structure

```
app/
├── academy/
│   ├── page.tsx              — Hub (SSG, articles grouped by category)
│   └── [slug]/
│       └── page.tsx          — Article (SSG, generateStaticParams, generateMetadata, JSON-LD Article)
├── components/academy/
│   ├── AcademyArticleCard.tsx
│   ├── ArticleContentRenderer.tsx
│   └── ArticleRelatedFragrances.tsx
└── lib/academy/
    ├── types.ts              — AcademyArticle, AcademyCategory, AcademyContentBlock
    └── catalogue.ts          — academyCatalogue (static TypeScript, mirrors MKC pattern)
```

### Data Model

```typescript
AcademyArticle {
  slug, title, subtitle, category, excerpt,
  coverImage?, readTime, content, relatedFragranceIds, publishedAt
}

AcademyCategory:
  "Fragrance Families" | "The Note Pyramid" | "Wear & Application" |
  "Scent Science" | "Occasions & Style" | "Fragrance Fundamentals"

AcademyContentBlock:
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "tip"; text: string }
  | { type: "note-list"; notes: string[] }
  | { type: "fragrance-spotlight"; fragranceId: string; caption: string }
```

### Article Topics (by category)

| Category | Topics |
|---|---|
| The Note Pyramid | Top/Heart/Base explained, how notes evolve on skin |
| Fragrance Families | Floral, Woody, Oriental/Amber, Fresh, Chypre, Gourmand |
| Wear & Application | Pulse points, how much to apply, layering, storage |
| Scent Science | Projection, longevity, sillage, skin chemistry |
| Occasions & Style | Seasonal guidance, office, evening, signature scent |
| Fragrance Fundamentals | Beginner's guide, terminology, myths, gift guides |

### MKC Integration

Academy articles link to MKC via `relatedFragranceIds: string[]`. The `ArticleRelatedFragrances` component resolves these IDs against `mkcCatalogue` and renders product cards — the Academy drives discovery and commerce.

### Growth Pattern

Academy articles are static TypeScript objects in `academyCatalogue`. Adding a new article requires:
1. Add a new `AcademyArticle` object to `app/lib/academy/catalogue.ts`
2. The hub page, sitemap, and Article JSON-LD automatically reflect the new article on the next build

---

## Future AI

When Ask Maison AI is implemented (reserved placeholder on ProductDetail), the design constraint is:

**AI must consume structured knowledge from MKC — it must never invent fragrance information.**

The `FragranceKnowledge.description`, `notes`, `mood`, `occasions`, `recommendedFor`, and `signatureStyle` fields provide the grounding data. The AI system will read from these fields and compose responses — not generate content from training data alone. The Academy provides additional structured educational grounding for AI-generated guidance.

---

## State Management

No external state library. All state is managed with:

- **React Context** — shared app-level state (cart, favorites, UI, feedback)
- **useState / useMemo / useCallback** — local and derived component state
- **localStorage** — cart, favorites, recently viewed, analytics session ID
- **URL / Next.js router** — navigation state

---

## Rendering Strategy

| Surface | Strategy | Why |
|---|---|---|
| Product pages | SSG | SEO, performance, stable MKC data |
| Homepage | Client-side | Requires Context (favorites, recently viewed) |
| Shop | Client-side | Search, filter, sort state |
| Quiz | Client-side | Stateful multi-step flow |
| Checkout | Client-side | Cart state, form state |
| Academy hub (planned) | SSG | Pure static content |
| Academy articles (planned) | SSG | Per-article metadata, JSON-LD |

---

## Module Relationships

```
app/lib/mkc/
  types.ts              ← defines FragranceKnowledge
  catalogue.ts          → imports types.ts
  displayAdapter.ts     → imports types.ts
  recommendationAdapter.ts → imports types.ts (+ app/data/types.ts for Fragrance)
  merchandising.ts      → imports types.ts

app/lib/
  intentParser.ts       → pure — no imports
  knowledgeAdapter.ts   → imports app/data/types.ts (Fragrance)
  recommendFragrances.ts → imports intentParser, knowledgeAdapter
  explainability.ts     → imports intentParser, knowledgeAdapter
  analytics.ts          → pure — no imports from intelligence layer

app/components/
  ProductDetail.tsx     → imports mkc/types, mkc/catalogue, mkc/merchandising,
                           context/CartContext, context/FavoritesContext, lib/analytics
  FragranceQuickView.tsx → imports mkc/types, mkc/merchandising,
                           context/CartContext, context/CartFeedbackContext, lib/analytics
  ProductCard.tsx       → imports context/CartContext, context/FavoritesContext, lib/analytics
  MiniCart.tsx          → imports context/CartContext, context/CartUIContext, lib/analytics,
                           data/fragrances, lib/knowledgeAdapter, lib/recommendFragrances

app/shop/page.tsx       → imports mkc/catalogue, mkc/displayAdapter, mkc/recommendationAdapter,
                           lib/intentParser, lib/knowledgeAdapter, lib/recommendFragrances,
                           lib/explainability, lib/analytics
```

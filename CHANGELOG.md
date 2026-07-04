# Changelog — Maison Skye & Rose

**Project:** Maison Skye & Rose
**Related:** [ROADMAP.md](ROADMAP.md)

All notable engineering changes are documented here, grouped by Engineering Program. Entries are derived from git commit history and the `.ai/ENGINEERING_LOG.md` session record.

---

## GOVERNANCE-001 — Governance Consolidation (2026-07-03)

Engineering infrastructure sprint. No application code changes.

- Created `PROJECT_STATUS.md` — living engineering status document
- Created `REPOSITORY_STATUS.md` — repository snapshot
- Rewrote `ROADMAP.md` — updated to EP framework with full program history
- Rewrote `ARCHITECTURE.md` — added MKC, Intelligence Layer, Analytics, Future Academy
- Created `DECISIONS.md` at root — 12 Architecture Decision Records
- Rewrote `CHANGELOG.md` — full engineering history
- Rewrote `CONTRIBUTING.md` — EP workflow, commit conventions, Definition of Done

---

## EP12 — Maison Knowledge Catalogue: Consumer Experience (2026-07-03)

Commits: `f59ec30`, `6f2ea20`, `40c537c`, `88c166e`

### EP12-P1/P2 — MKC Foundation

- Established `FragranceKnowledge` canonical type (`app/lib/mkc/types.ts`)
- Created `mkcCatalogue` with 93 fragrance entries (`app/lib/mkc/catalogue.ts`)
- Implemented `toDisplayFragrance` display adapter (`app/lib/mkc/displayAdapter.ts`)
- Implemented `toRecommendationFragrance` recommendation adapter (`app/lib/mkc/recommendationAdapter.ts`)
- Migrated shop page (`app/shop/page.tsx`) to MKC data source

### EP12-P3 — Fragrance Quick View

- Created `FragranceQuickView` — MKC-powered Learn More modal
  - Portal-based rendering (createPortal to document.body)
  - framer-motion: bottom sheet mobile / centred desktop
  - Full accessibility: role="dialog", aria-modal, aria-labelledby, focus trap, Escape key, body scroll lock, return-focus restore
  - Three-section layout: identity, why you'll like it, key notes, occasions/character, size selector, sticky CTA footer
- Created `app/lib/mkc/merchandising.ts` — `generateWhyYoullLikeIt()` (shared pure function)
- Modified `ProductCard` — added Learn More button (↗ icon, desktop only, `hidden md:flex`)
- Modified `app/shop/page.tsx` — wired `handleLearnMore` callback + `FragranceQuickView` render

### EP12-P4 — Maison Fragrance Profile Experience

- Rewrote `ProductDetail` as MKC-native 9-section fragrance profile:
  1. Hero (gallery, collection badge, price, size selector, trust signals, Add to Cart + Favourite)
  2. Quick Facts (family, character, season, occasions)
  3. Signature Notes (expandable note pyramid: collapsed = flat chips, expanded = Top/Heart/Base grid)
  4. Why You'll Like It (3 MKC-derived lifestyle bullets from `generateWhyYoullLikeIt`)
  5. Fragrance Story (conditional on `knowledge.description`)
  6. Fragrance Personality (recommendedFor, signatureStyle, occasions)
  7. Discover More (4 Academy placeholder cards — Coming Soon)
  8. Related Fragrances (MKC Recommendation Engine)
  9. You May Also Like (mkcCatalogue collection filter) + Customer Reviews placeholder + Ask Maison AI placeholder
- Eliminated `fragrance: any` — ProductDetail prop changed to `knowledge: FragranceKnowledge`
- Migrated `app/product/[slug]/page.tsx` to `mkcCatalogue` — `generateStaticParams`, `generateMetadata`, JSON-LD

---

## EP11 — SEO Foundation (2026-07-01)

Commits: `8deffcc`

- Created `app/sitemap.ts` — generates sitemap.xml from `mkcCatalogue` (all 93 product URLs)
- Created `app/robots.ts` — configures robots.txt
- KI-08 and KI-09 resolved

---

## EP10 — Commerce Hardening (2026-07-01)

Commits: `f5fab0e`, `2586906`, `df499fb`

- Adopted VAT-exclusive checkout pricing
- Standardized cart product `id` to URL slug format across all add-to-cart surfaces (resolves KI-04 partially)
- Connected ShopByPersonality cards on homepage to recommendation engine

---

## EP9 — Analytics Provider Activation (2026-07-01)

Commits: `ea9b7bf`

- PostHog JS integrated with the EP6-P1 analytics abstraction layer
- `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables active
- `AnalyticsInit.tsx` updated — `providerInit` and `providerCapture` stubs replaced with live PostHog calls
- Session identity (msr_session_id) confirmed operational with live provider

---

## EP8-P1 — Recommendation Foundation Cleanup (2026-07-01)

Commits: `af48a22`, `4cbf764`, `afdf97a` (+ `6330276` chore)

- Corrected `hiddenGem` criterion: `item.gender !== "unisex"` → `item.collection !== "Elite"` — aligned with `luxuryUpgrade`; M3 metric confirmed 1.0000 unchanged
- Removed `RecommendationCard` JSX 4-string hardcoded fallback; `reasons` made TypeScript-required
- Deleted 3 dead files: `app/data/fragranceDatabase.ts`, `app/data/fragranceQuizQuestions.ts`, `app/components/RecommendationSection.tsx` (486 lines removed)
- Corrected 8 stale items in `.ai/evaluation/` framework documentation

---

## EP7 — Knowledge Quality (2026-07-01)

Commits: `3f6e99b`, `b5e99e0`, `f55fb6c`, `6bbf6f9`, `ebcd162`, `3623377`

- Recorded EP7-P1 evaluation baseline (20/20 pure-function tests, 46/46 browser checks)
- Removed dead occasions from vocabulary (Gym, Signature Scent, Clubbing removed from adapter layer)
- Corrected marine profile tokens; removed identity alias from catalogue
- Expanded quiz family options: added Vanilla, Oud, Spicy as selectable options
- Added Fruity family to vocabulary; corrected Chypre alias to Amber
- Exposed Fruity as selectable family option in quiz

---

## EP6 — Intelligence Analytics (2026-06-30 to 2026-07-01)

Commits: `abf512e`, `bfbce8d`, `53c4c63`, `7da817e`

### EP6-P1 — Analytics Architecture

- Created `app/lib/analytics.ts` — provider-neutral service module (safeCall, ready flag, 10 payload types, 12 track functions)
- Created `app/components/AnalyticsInit.tsx` — session UUID initialization
- Modified `app/layout.tsx` — AnalyticsInit added outside provider tree
- `if (!ready) return;` guard in all 12 track function bodies (Engineering Lead refinement)

### EP6-P2 — Discovery Instrumentation

- Extracted `AnalyticsSource` type from `ProductPayload` — single source of truth
- Extended `ProductCard` — `source?` and `rank?` props; `handleProductNavigation` callback
- Instrumented `app/shop/page.tsx` — `currentMode` useMemo; discovery mode + confidence useEffects; filter/sort instrumentation; analyticsSource const
- Events: `discovery_mode`, `confidence_label_shown`, `filter_applied`, `sort_applied`, `product_clicked`

### EP6-P3 — Quiz Instrumentation

- Instrumented `app/quiz/page.tsx` — handleAnswer augmentation, completion effect, results effect with useRef guard, ProductCard source/rank, two WhatsApp onClick handlers
- Events: `quiz_answer_selected`, `quiz_completed`, `quiz_results_shown`, `quiz_whatsapp_clicked`, `product_clicked`

### EP6-P4 — Commerce Instrumentation

- Extended `app/lib/analytics.ts` — CartPayload.source extended; 5 new payload types; 6 new track functions
- Instrumented 8 production files: `ProductDetail`, `QuickAddModal`, `MiniCart`, `Navbar`, `checkout/page`, `payment-success/page`, `payment-cancel/page`
- SessionStorage guards on payment return pages (prevent re-fire on refresh)
- Events: `product_detail_viewed`, `add_to_cart`, `cart_opened`, `checkout_started`, `payment_started`, `payment_return_success`, `payment_return_cancelled`, `buy_now_clicked`, `whatsapp_checkout_started`

---

## EP5-P1 — Curated Discovery: Recommendation Slot Semantics (2026-06-30)

Commits: `d830e6f`

- Corrected `luxuryUpgrade`: `popularity >= 9` → `collection === "Elite"` — all 5 Elite products now eligible
- Corrected `hiddenGem`: removed `.reverse()` inversion — now selects highest-scoring standard non-bestseller
- Both slots use `.slice(1)` to exclude `bestMatch` from consideration
- Null fallbacks for both slots (absent over misleading)
- Added `collection?: "Skye" | "Rose" | "Elite"` to `Fragrance` type as direct pass-through

---

## EP4 — Discovery Experience (2026-06-30)

Commits: `93c60af`, `bdabd75`

### EP4-P1A — Signal Awareness

- Instrumented `app/shop/page.tsx` — `detectedSignals` useMemo, `GENDER_LABELS`, `filtered` memo refactored
- Signal pill summary renders above Mode 1 search results: "Curated for you: Fresh · Floral · Office"
- Fixed pre-existing Mode 2 bug: `Object.keys(signals).length` → `Object.values(signals).some((v) => v !== undefined)`

### EP4-P1B — Match Strength

- `firstCardStrength` useMemo in `app/shop/page.tsx`
- Confidence label renders above top recommendation card in Mode 1 with Featured sort
- "Perfect Match" (strong) / "Great Match" (moderate) — suppressed for partial and non-Featured sort

### EP4-P1C — Explainability Investigation

- Per-card reasons assessed as unsuitable: `FALLBACK_REASONS` guarantee produces generic strings for partial-match cards
- No production code changed; EP4-P1A + EP4-P1B confirmed as complete discovery narrative

---

## EP3 — Knowledge Engineering (2026-06-30)

Commits: `225770f`, `65b243d`

### EP3-P1 — Intelligence Layer Integration

- Integrated Intelligence Layer into `app/quiz/page.tsx` — authoritative recommendation engine replaces static sorting
- Created `.ai/evaluation/` framework — 4 documents: recommendation-suite, quality-metrics, evaluation-procedure, baseline-results
- Evaluation baseline: 20/20 pure-function tests pass

### EP3-P2 — Dead Occasion Signal

- Investigated Dead Occasion Signal: 4 dead signals identified (Luxury Events, Gym, Clubbing, Signature Scent)
- Removed "Luxury Events" from quiz options (quiz UI fix only; vocabulary preserved)
- Gym, Clubbing, Signature Scent deferred (not exposed in quiz UI; require authoritative catalogue data)

---

## AIOS-001 — AI Engineering Operating System v1.0 (2026-06-29)

- Created `.ai/SPRINT.md` — Engineering Program Management
- Created `.ai/ENGINEERING_LOG.md` — Session History
- Extended `.ai/CURRENT_TASK.md` — Program field
- Extended `.ai/PROMPT_LIBRARY.md` — lifecycle prompts

---

## Engineering Program 2 — Conversion, Performance & SEO (Pre-SPRINT.md)

### Conversion Optimization
- Homepage: KPI strip, reward banner, featured editorial, Discovery Set banner
- MiniCart: reward progress bar, wholesale display, smart recommendations (3 types)
- PDP: mobile sticky CTA, size selector labels, trust signals, related products
- WhatsApp Buy Now on PDP

### Performance Optimization
- All contexts: `useCallback` on mutations, `useMemo` on derived values, memoized context value objects
- ProductCard: `React.memo`, all handlers in `useCallback`
- Shop: 300ms debounced search, two-stage memoized filter/sort pipeline
- MiniCart: memoized recommendation arrays
- Removed all unoptimized `<img>` tags from ProductDetail

### SEO
- Per-product `generateMetadata` (title, description, OG, Twitter, canonical)
- Product JSON-LD (Product schema + 3 Offer nodes)
- `generateStaticParams` — all product pages SSG

---

## Engineering Program 1 — Foundation (Pre-SPRINT.md)

- Next.js 16 App Router setup
- Product catalogue: `fragrances.ts` (Skye, Rose, Elite collections)
- Cart, Favorites, CartUI, CartFeedback context systems
- MiniCart, QuickAddModal, ProductCard, ProductDetail components
- Navbar, Footer, FloatingWhatsApp, CartSuccessToast
- WhatsApp checkout flow
- PayFast integration (sandbox)
- Supabase order persistence (`/api/orders`)
- Basic checkout form

# Roadmap — Maison Skye & Rose

**Project:** Maison Skye & Rose
**Related:** [CHANGELOG.md](CHANGELOG.md) · [PROJECT_STATUS.md](PROJECT_STATUS.md)

Engineering programs are documented here in order of completion. Only approved work is listed. Speculative ideas do not belong in this file.

---

## Completed

### Engineering Program 1 — Foundation

Core commerce infrastructure.

- Next.js 16 App Router project setup
- Product catalogue (`app/data/fragrances.ts`) — Skye, Rose, Elite collections
- Cart system (add, remove, quantity, clear) with localStorage persistence
- Favorites system (add, remove, toggle) with localStorage persistence
- CartUI context (MiniCart open/close)
- CartFeedback context (add-to-cart toast, 2600ms auto-clear)
- MiniCart panel (full-screen mobile, floating panel desktop)
- QuickAddModal with framer-motion animations and size/quantity control
- ProductCard (mobile/desktop layouts)
- WhatsApp checkout flow from MiniCart
- PayFast payment integration (sandbox)
- Supabase order persistence (`/api/orders`)
- Basic checkout form
- FloatingWhatsApp button, CartSuccessToast, Navbar, Footer

---

### Engineering Program 2 — Conversion, Performance & SEO

Commerce effectiveness and production SEO readiness.

- Homepage conversion sections (KPI strip, reward banner, featured fragrance editorial)
- Free sample reward tier messaging (R400 / R700 / R1000 / R1500)
- Discovery Set conversion banner
- MiniCart reward progress bar
- MiniCart smart recommendations (favorites, recently viewed, collection matching)
- Wholesale pricing tier (auto-activates at 10+ units)
- WhatsApp Buy Now button on PDP
- PDP mobile sticky CTA bar (appears after 300px scroll)
- PDP: size selector, trust signals, fragrance notes (Top/Heart/Base), related products
- Shop page: sticky filter bar, filter/sort drawer, collection tabs, debounced search
- Recently Viewed tracking (localStorage, 12-item history)
- CartContext performance: `useMemo` on derived values, `useCallback` on mutations
- ProductCard: `React.memo`, all handlers in `useCallback`
- MiniCart re-render optimization: memoized recommendation arrays
- Per-product `generateMetadata` (title, description, OG, Twitter, canonical)
- Product JSON-LD structured data (Product schema + Offer nodes)
- `generateStaticParams` for all product pages (SSG)
- `next/image` adoption — removed all unoptimized `<img>` tags

---

### AIOS-001 — AI Engineering Operating System v1.0

Engineering infrastructure only. No application code.

- Created `.ai/SPRINT.md` — Engineering Program Management
- Created `.ai/ENGINEERING_LOG.md` — Session History
- Extended `.ai/CURRENT_TASK.md` — Program field added
- Extended `.ai/PROMPT_LIBRARY.md` — Program lifecycle prompts

---

### Engineering Program 3 — Knowledge Engineering

Intelligence Layer integration and evaluation baseline.

- **EP3-P1:** Integrated Intelligence Layer into quiz page (authoritative recommendation engine)
- **EP3-P1:** Created `.ai/evaluation/` framework — recommendation suite, quality metrics, evaluation procedure, baseline results
- **EP3-P2:** Investigated Dead Occasion Signal — 4 dead signals identified (Luxury Events, Gym, Clubbing, Signature Scent)
- **EP3-P2:** Removed "Luxury Events" from quiz options (dead signal eliminated from customer-facing UI)
- Evaluation baseline: 20/20 pure-function tests pass, 46/46 browser checks pass

---

### Engineering Program 4 — Discovery Experience

Making the Intelligence Layer visible to customers in the shop.

- **EP4-P1A:** Signal pills in shop search — "Curated for you:" with labelled intent signals (gender, occasion, family, vibe, character)
- **EP4-P1A:** Fixed pre-existing Mode 2 bug (`Object.keys` → `Object.values` hasSignals check)
- **EP4-P1B:** Confidence label on top recommendation card — "Perfect Match" / "Great Match" (suppressed for non-Featured sort)
- **EP4-P1C:** Explainability investigation — per-card reasons assessed as unsuitable for shop grid; no implementation approved

---

### Engineering Program 5 — Curated Discovery

Semantic alignment of recommendation slots with their business meaning.

- **EP5-P1:** `luxuryUpgrade` slot corrected from popularity-based (`popularity >= 9`) to `collection === "Elite"` — all 5 Elite products now eligible
- **EP5-P1:** `hiddenGem` slot corrected from worst-matching (`.reverse()` bug) to highest-scoring standard non-bestseller
- **EP5-P1:** `collection` field propagated through adapter as direct pass-through (`Fragrance` type extended)
- Null fallbacks for both slots: slot renders absent rather than semantically wrong

---

### Engineering Program 6 — Intelligence Analytics

Full analytics infrastructure and instrumentation across all customer journeys.

- **EP6-P1:** Analytics infrastructure — `app/lib/analytics.ts` (provider-neutral service module, 12 track functions, session UUID)
- **EP6-P1:** `AnalyticsInit.tsx` component — session identity initialization
- **EP6-P2:** Discovery instrumentation — discovery mode, confidence label, filter, sort, product click events
- **EP6-P2:** `AnalyticsSource` type as single source of truth for source string identity
- **EP6-P3:** Quiz instrumentation — answer selection, completion, results shown, WhatsApp CTAs, product clicks
- **EP6-P4:** Commerce instrumentation — product view, add to cart (all surfaces), cart opened, checkout started, payment started, payment return events, WhatsApp checkout
- sessionStorage guards on payment return pages (prevent re-fire on refresh)
- Intelligence Layer confirmed analytics-free throughout all sprints

---

### Engineering Program 7 — Knowledge Quality

Vocabulary correctness and evaluation framework alignment.

- **EP7-P1:** Recorded evaluation baseline (EP7-P1)
- Fixed dead occasions in vocabulary (removed from adapter layer)
- Corrected marine profile tokens
- Removed identity alias from catalogue
- Expanded quiz family options: Fruity (as selectable), Vanilla, Oud, Spicy
- Added Fruity family to vocabulary; corrected Chypre alias to Amber
- Evaluation framework aligned with live implementation (8 stale items corrected)

---

### Engineering Program 8 — Recommendation Foundation Cleanup

Repository hygiene and architectural consistency.

- **EP8-P1:** `hiddenGem` criterion aligned with `luxuryUpgrade` — both now use `collection` field (`collection !== "Elite"`)
- **EP8-P1:** RecommendationCard JSX 4-string hardcoded fallback removed; `reasons` made TypeScript-required
- **EP8-P1:** Three dead files deleted: `fragranceDatabase.ts`, `fragranceQuizQuestions.ts`, `RecommendationSection.tsx` (486 lines removed)
- M3 (adapter coverage metric) confirmed 1.0000 unchanged after all changes

---

### Engineering Program 9 — Analytics Provider Activation

PostHog activated as the live analytics provider.

- PostHog JS integrated with the EP6-P1 abstraction layer
- `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables
- Session identity (msr_session_id) confirmed operational with live provider

---

### Engineering Program 10 — Commerce Hardening

Commerce correctness and checkout reliability.

- VAT-exclusive checkout pricing adopted
- Cart product ID standardized to URL slug across all add-to-cart surfaces
- Personality cards on homepage connected to recommendation engine

---

### Engineering Program 11 — SEO Foundation

Production SEO infrastructure established.

- `app/sitemap.ts` — sitemap.xml generated from mkcCatalogue
- `app/robots.ts` — robots.txt configured

---

### Engineering Program 12 — Maison Knowledge Catalogue — Consumer Experience

MKC established as the canonical fragrance model and integrated across all consumer surfaces.

- **EP12-P1:** Canonical `FragranceKnowledge` type established (`app/lib/mkc/types.ts`)
- **EP12-P2:** 93 fragrances migrated to `mkcCatalogue` (`app/lib/mkc/catalogue.ts`)
- **EP12-P2:** Display adapter (`toDisplayFragrance`) and Recommendation adapter (`toRecommendationFragrance`)
- **EP12-P2:** Shop page migrated to MKC data source
- **EP12-P3:** FragranceQuickView — MKC-powered learn more modal (portal, framer-motion, full accessibility: role="dialog", aria-modal, focus trap, Escape key, body scroll lock, return focus)
- **EP12-P3:** ProductCard — Learn More button added (desktop, ↗ icon)
- **EP12-P3:** `generateWhyYoullLikeIt` implemented in `app/lib/mkc/merchandising.ts` (shared by QuickView and ProductDetail)
- **EP12-P4:** ProductDetail rewritten as MKC-native 9-section experience — note pyramid, character sections, discovery sections, Academy placeholder cards, Favourite button
- **EP12-P4:** `fragrance: any` eliminated — ProductDetail now strongly typed as `knowledge: FragranceKnowledge`
- **EP12-P4:** `app/product/[slug]/page.tsx` migrated to mkcCatalogue

---

### Engineering Program 4.5 — Governance Consolidation (Current)

Permanent engineering governance documents.

- PROJECT_STATUS.md (created)
- REPOSITORY_STATUS.md (created)
- ROADMAP.md (rewritten)
- ARCHITECTURE.md (rewritten)
- DECISIONS.md (created at root)
- CHANGELOG.md (rewritten)
- CONTRIBUTING.md (rewritten)

---

## Current

### Engineering Program 5.0 — Maison Fragrance Academy

**Sprint:** EP13-P1 — Academy Foundation
**Status:** G1+G2+G3 planning complete. Awaiting G4 Engineering Lead approval.

**Planned scope:**
- `app/lib/academy/types.ts` — AcademyArticle, AcademyCategory, AcademyContentBlock
- `app/lib/academy/catalogue.ts` — academyCatalogue (minimum 6 articles)
- `app/academy/page.tsx` — hub page (SSG, grouped by category)
- `app/academy/[slug]/page.tsx` — article pages (SSG, generateStaticParams, generateMetadata, JSON-LD Article schema)
- `app/components/academy/` — AcademyArticleCard, ArticleContentRenderer, ArticleRelatedFragrances
- Navbar: Academy link added
- Footer: Academy link added to Explore column

---

## Future

### Engineering Program 6.0 — PayFast Production Hardening

**Priority:** Critical — required before any live payment processing.

- Switch PayFast URL from sandbox to production
- Implement PayFast ITN webhook (update order payment_status in Supabase)
- Implement MD5 signature computation
- Move PayFast passphrase to server-only environment variable (remove NEXT_PUBLIC_ prefix)
- Replace hardcoded customer details with checkout form data

---

### Engineering Program 7.0 — Commerce & UX Refinement

- Reconcile delivery pricing (MiniCart vs Checkout)
- Wire ShopByVibe tiles to shop search
- MiniCart touch targets: increase to 44px minimum
- OG metadata on homepage, shop, and collection pages
- Instagram URL populated in brand.ts

---

### Engineering Program 8.0 — Customer Platform

Post-launch customer features.

- Customer authentication (Supabase Auth)
- Order history page
- Email order confirmation (post-payment)
- Wishlist sharing via URL

---

## Launch Checklist

Before directing live traffic to the domain, confirm all of the following:

- [ ] PayFast switched to production URL
- [ ] PayFast ITN webhook implemented and tested
- [ ] PayFast MD5 signature implemented
- [ ] PayFast passphrase moved to server-only env var
- [ ] All Vercel environment variables set
- [ ] Custom domain configured and SSL active
- [ ] Sitemap submitted to Google Search Console
- [ ] WhatsApp checkout end-to-end tested
- [ ] PayFast checkout end-to-end tested
- [ ] Mobile UX tested on physical device (375px)
- [ ] Build passes with zero TypeScript errors
- [ ] NEXT_PUBLIC_WEBSITE_URL set to production domain

# Project Status — Maison Skye & Rose

**Last updated:** 2026-08-04
**Phase:** Launch Execution
**Build status:** PASS — 187 routes, 0 TypeScript errors, 0 warnings

---

## Current Engineering Program

**Program:** EP13-P1 — Maison Fragrance Academy Foundation
**Sprint:** EP13-P1
**Gate:** G4 (Implementation)
**Objective:** Build the Academy hub, article pages, data model, and navigation integration.

---

## Current Sprint

**EP13-P1 — Academy Foundation**
G1+G2+G3 planning approved by Engineering Lead. G4 implementation in progress.

---

## Current Repository Status

The repository is in an active, production-capable state.

All core commerce flows are implemented and operational. The Maison Knowledge Catalogue (MKC) is the canonical fragrance model and drives the product detail page, quick view experience, and shop page. The Intelligence Layer (recommendation engine, intent parser) is integrated across shop and quiz. Analytics is live with PostHog as the active provider. SEO foundation is established with sitemap, robots.txt, and per-product metadata.

The Maison Fragrance Academy (EP13) is in the planning stage.

---

## Current Build Status

| Metric | Value |
|---|---|
| Build result | PASS |
| TypeScript errors | 0 |
| Warnings | 0 |
| Total pages | 120 |
| Product pages (SSG) | 93 |
| Static pages | 25 |
| Dynamic routes | 2 |
| Last verified | 2026-07-03 |

Verify: `npm run build`

---

## Foundation Programme

| Programme | Task | Name | Status |
|---|---|---|---|
| EP0 | EP0-P1 | The Founder's Letter & The Skye & Rose Covenant | Complete — 2026-08-04 |
| EP0 | EP0-P2 | The Constitution of Maison Skye & Rose | Complete — 2026-08-04 |

`FOUNDATIONS/00_FOUNDERS_LETTER.md` — The permanent founder's letter to Skye, Rose, future employees, and future stewards. *Why we began.*
`FOUNDATIONS/01_SKYE_AND_ROSE_COVENANT.md` — The institutional promise: to customers, products, technology, and future generations. *What we promise.*
`FOUNDATIONS/02_CONSTITUTION.md` — Twelve articles of permanent institutional belief, from The Institution to Legacy; closes with The Golden Rule. *What we believe.*

---

## Completed Engineering Programs

| Program | Sprint | Name | Closed |
|---|---|---|---|
| EP1 | — | Foundation | Pre-SPRINT.md |
| EP2 | — | Conversion, Performance & SEO | Pre-SPRINT.md |
| AIOS-001 | — | AI Engineering Operating System v1.0 | 2026-06-29 |
| EP3 | EP3-P1, EP3-P2 | Knowledge Engineering | 2026-06-30 |
| EP4 | EP4-P1A/B/C | Discovery Experience | 2026-06-30 |
| EP5 | EP5-P1 | Curated Discovery | 2026-06-30 |
| EP6 | EP6-P1 through P4 | Intelligence Analytics | 2026-07-01 |
| EP7 | EP7-P1 | Knowledge Quality | 2026-07-01 |
| EP8 | EP8-P1 | Recommendation Foundation Cleanup | 2026-07-01 |
| EP9 | — | Analytics Provider Activation | 2026-07-01 |
| EP10 | — | Commerce Hardening | 2026-07-01 |
| EP11 | — | Homepage & Vocabulary | 2026-07-01 |
| EP12 | EP12-P1 through P4 | Maison Knowledge Catalogue — Consumer Experience | 2026-07-03 |
| GOVERNANCE-001 | — | Governance Consolidation | 2026-07-03 |

---

## Current Architecture

```
Customer
   │
   ├── Navbar / Shop / Quiz / PDP / Quick View
   │
   ├── Intelligence Layer         ← MKC (canonical data source)
   │     Intent Parser
   │     Knowledge Adapter
   │     Recommendation Engine
   │     Explainability
   │
   ├── Commerce                   ← Cart / MiniCart / Checkout
   │     WhatsApp (primary)
   │     PayFast (secondary, sandbox)
   │
   ├── Analytics                  ← PostHog (active)
   │     Session identity
   │     Discovery + Quiz + Commerce events
   │
   └── SEO
         sitemap.xml / robots.txt
         Per-product JSON-LD
```

---

## Current Systems

### Commerce
- Cart (CartContext) — add/remove/quantity/clear, localStorage persistence
- Favorites (FavoritesContext) — toggle/persist, localStorage
- MiniCart — drawer panel with reward progress, wholesale display, smart recommendations
- QuickAddModal — size and quantity selection with framer-motion animations
- ProductCard — display card with Quick Add and Learn More (Quick View) buttons
- FragranceQuickView — MKC-powered learn more modal (portal, full accessibility, framer-motion)
- ProductDetail — MKC-native 9-section fragrance profile experience
- Wholesale auto-pricing (activates at 10+ units)
- WhatsApp checkout (primary flow)
- PayFast checkout (secondary, sandbox — not production)
- Reward tiers: R400 / R700 / R1000 / R1500

### Maison Knowledge Catalogue (MKC)
- Canonical model: `FragranceKnowledge` — `app/lib/mkc/types.ts`
- Source catalogue: `mkcCatalogue` — `app/lib/mkc/catalogue.ts` — 93 entries
- Display projection: `toDisplayFragrance` → `DisplayFragrance` — `app/lib/mkc/displayAdapter.ts`
- Intelligence projection: `toRecommendationFragrance` → `Fragrance` — `app/lib/mkc/recommendationAdapter.ts`
- Shared merchandising: `generateWhyYoullLikeIt` — `app/lib/mkc/merchandising.ts`
- Consumers: ProductDetail, FragranceQuickView, Shop page, product/[slug] page

### Intelligence Layer
- `app/lib/intentParser.ts` — natural language → `IntentSignals`
- `app/lib/knowledgeAdapter.ts` — MKC → scored recommendation candidates
- `app/lib/recommendFragrances.ts` — signal scoring + 4 recommendation slots (bestMatch, hiddenGem, luxuryUpgrade, alternative)
- `app/lib/explainability.ts` — `generateReasons` for RecommendationCard
- Shop: signal pills ("Curated for you:"), confidence label ("Perfect Match" / "Great Match")
- Quiz: 5-question flow → recommendation results

### Analytics
- Infrastructure: `app/lib/analytics.ts` — provider-neutral service module, 12+ track functions
- Session: anonymous UUID in `localStorage['msr_session_id']`
- Provider: PostHog JS (active)
- Initialization: `app/components/AnalyticsInit.tsx`
- Instrumented journeys: Discovery (shop), Quiz, Commerce (PDP / cart / checkout)

### SEO
- Per-product `generateMetadata` (title, description, OG, Twitter, canonical)
- Product JSON-LD (Product schema with Offer nodes for 5ml / 10ml / 30ml)
- `app/sitemap.ts` — sitemap.xml (static, all 93 product pages)
- `app/robots.ts` — robots.txt
- Metadata base: `NEXT_PUBLIC_WEBSITE_URL`

### Education (In Progress)
The Academy is a first-class product — the long-term knowledge platform for Maison Skye & Rose.
- Maison Fragrance Academy: EP13-P1 G4 implementation in progress
- Scope: Academy hub, 6+ articles, Navbar + Footer links, MKC-powered related fragrances
- Topics: fragrance families, note pyramid, wear & application, scent science, occasions & style, beginner guides
- Long-term: fragrance terminology, storage, layering, seasonal guidance, gift guides, AI educational experiences

---

## Current Canonical Model — FragranceKnowledge

`app/lib/mkc/types.ts` — single source of truth for all fragrance data.

| Section | Fields |
|---|---|
| Identity | id, slug, brand, name, collection, catalogVersion, status |
| Classification | gender, family, scentCharacter, projection |
| Composition | profile, season, notes (top/heart/base), mood |
| Discovery | vibe, occasions, seasons, signatureStyle, recommendedFor |
| Merchandising | prices (5ml/10ml/30ml), images (5ml/10ml/30ml), bestSeller, newArrival, featured |
| Education | subtitle, description |
| Intelligence | sweetness, freshness, warmth, intensity, versatility, popularity |

---

## Current Repository Metrics

| Metric | Count |
|---|---|
| Total pages (build) | 120 |
| Product pages (SSG) | 93 |
| UI components | 44 |
| React contexts | 4 |
| MKC catalogue entries | 93 |
| Intelligence Layer modules | 5 |
| MKC modules | 5 |
| Analytics event types | ~20 |

---

## Completed Features

### Commerce
- Cart (add, remove, quantity, clear, localStorage)
- Favorites (add, remove, toggle, localStorage)
- MiniCart (drawer, reward progress, wholesale display, smart recommendations)
- QuickAddModal (size/quantity, framer-motion)
- FragranceQuickView (MKC-powered, accessible, portal)
- ProductCard (Quick Add + Learn More)
- ProductDetail (MKC-native, 9 sections, note pyramid, recommendations)
- Wholesale pricing (auto-activates ≥10 units)
- WhatsApp checkout
- PayFast checkout (sandbox)
- Reward tiers (R400–R1500)
- Cart ID standardized to URL slug

### Discovery & Intelligence
- Shop search (300ms debounce)
- Shop filter and sort (6 tabs, 4 sort options)
- Intelligence Layer Modes 0 / 1 / 2
- Signal pills ("Curated for you:")
- Confidence label ("Perfect Match" / "Great Match")
- Scent Finder (quiz) with recommendation results
- Recently Viewed tracking
- Favorites section on homepage

### Knowledge
- MKC canonical model (FragranceKnowledge)
- 93 fragrances in mkcCatalogue
- Display and Recommendation projection adapters
- generateWhyYoullLikeIt (shared merchandising)

### Analytics
- Analytics infrastructure and session identity
- PostHog provider active
- Discovery instrumentation (shop)
- Quiz instrumentation
- Commerce instrumentation (PDP, cart, checkout)

### SEO
- Per-product generateMetadata (title, description, OG, Twitter, canonical)
- Product JSON-LD
- sitemap.xml
- robots.txt

---

## Open Engineering Work

### EP13-P1 — Maison Fragrance Academy
**Status:** G4 implementation in progress.
**Scope:** `app/lib/academy/` data model, Academy hub page, article pages, Navbar Academy link, Footer Academy link, MKC-powered related fragrances section.

---

## Technical Debt

| Issue | Severity | Reference |
|---|---|---|
| PayFast on sandbox URL | Critical | KI-01 — blocks live payments |
| PayFast ITN webhook not implemented | Critical | KI-02 — payment_status never updates |
| PayFast MD5 signature not computed | Critical | KI-03 — required for production |
| PayFast passphrase in client bundle | High | KI-05 — security risk |
| Hardcoded customer details in PayFast payload | High | KI-06 |
| Delivery pricing mismatch (MiniCart vs Checkout) | High | KI-07 — trust risk |
| OG metadata missing on non-product pages | Medium | KI-10 |
| Instagram URL incomplete in brand.ts | Medium | KI-12 |
| MiniCart quantity buttons below 44px touch target | Low | KI-13 |

---

## Next Approved Sprint

**EP13-P1 G4** — Academy Implementation
Awaiting Engineering Lead approval of G1+G2+G3 planning document.
Estimated scope: 8 new files, 2 file modifications (Navbar, Footer).

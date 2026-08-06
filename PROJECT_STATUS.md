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
| EP0 | EP0-P3 | The Skye & Rose Stewardship & Architecture Charter | Complete — 2026-08-04 |
| EP1 | EP1-P1 | The Skye & Rose Experience Blueprint | Complete — 2026-08-04 |
| EP2 | EP2-P1 | Digital Flagship Experience Audit | Complete — 2026-08-05 |
| EP2 | EP2-P2 | Digital Flagship Maturity Model | Complete — 2026-08-05 |
| EP2 | EP2-P3 | About Page Foundation Alignment | Complete — 2026-08-05 |
| EP2 | EP2-P4 | Engineering Governance Evolution & Homepage Foundation Alignment | Complete — 2026-08-05 |
| EP2 | EP2-P5 | Guest Journey Foundation Alignment (Audit) | Complete — 2026-08-05 |
| EP2 | EP2-P5A | Checkout Foundation Alignment | Complete — 2026-08-05 |
| EP2 | EP2-P5B | Payment Confirmation Foundation Alignment | Complete — 2026-08-05 |
| EP2 | EP2-P5C | Payment Recovery Foundation Alignment | Complete — 2026-08-06 |
| EP2 | EP2-P6A | Institutional Identity Alignment | Complete — 2026-08-06 |
| EP2 | EP2-P6B | Institutional Voice Alignment | Complete — 2026-08-06 |
| EP2 | EP2-P7 | Collection & Sourcing Architecture Audit | Complete — 2026-08-06 |
| EP2 | EP2-P7B | Online Collection Truth Alignment | Complete — 2026-08-06 |

`FOUNDATIONS/00_FOUNDERS_LETTER.md` — The permanent founder's letter to Skye, Rose, future employees, and future stewards. *Why we began.*
`FOUNDATIONS/01_SKYE_AND_ROSE_COVENANT.md` — The institutional promise: to customers, products, technology, and future generations. *What we promise.*
`FOUNDATIONS/02_CONSTITUTION.md` — Twelve articles of permanent institutional belief, from The Institution to Legacy; closes with The Golden Rule. *What we believe.*
`FOUNDATIONS/03_STEWARDSHIP_AND_ARCHITECTURE_CHARTER.md` — The operational expression of the Constitution: Builder's Oath, ten Principles, the Skye & Rose Standard, Engineering Doctrine, AI Stewardship Principles, and the Definition of Done. *How we build everything.*
`FOUNDATIONS/04_EXPERIENCE_BLUEPRINT.md` — The emotional operating system of the institution: who our guest is, the ten-stage emotional journey, every touchpoint, brand personality, voice, language principles, AI experience, luxury and confidence philosophies, and the Closing Promise. *How every guest should feel.*

**EP2-P1 Audit Findings (2026-08-05):** Overall institutional alignment score 7.1/10. Intelligence layer (Fragrance Profile, MaisonCompanion, Concierge, Shop, Quiz) rated Aligned. Critical gaps: About page (3/10 — fails Foundation narrative standard), catalogue count inconsistency (93 vs 465+), "Loyal Customer" terminology, post-purchase experience absent, checkout UX cold. Recommended sequence: EP2-P2 (About page rewrite) → EP2-P3 (checkout + post-purchase) → EP2-P4 (testimonials) → EP2-P5 (concierge voice) → EP2-P6 (language pass).

**EP2-P3 About Page Foundation Alignment (2026-08-05):** `app/about/page.tsx` rewritten from 4 generic paragraphs to 9 Foundation-aligned sections: Opening, A Compliment Changed Everything, Why Skye & Rose, What We Believe, Confidence Is What We Are Here to Deliver, Knowledge Before Recommendation, Accessible Luxury, Growing Together, Our Promise, An Invitation. Count inconsistency removed (465+ → timeless language). OG and Twitter metadata added. Architecture preserved. Build passes: 187 routes, 0 TypeScript errors, 0 warnings.

**EP2-P7B Online Collection Truth Alignment (2026-08-06):** Five misleading 465+ claims removed from institutional and trust surfaces. Navbar announcement "465+ Signature Fragrances Available" → "A Fragrance for Every Confidence Journey." TrustBar "465+ Fragrances Available" → "Carefully Curated Collection." WhyMaison feature title "465+ Fragrances" / "An extensive library" → "Curated With Care" / "A growing fragrance collection chosen to support confident discovery." HomeCTA two-count conflation ("90+ featured fragrances and access over 465") → "Explore our carefully curated online collection, or ask us about a fragrance you cannot find." Fragrance Profile cold-start "Browse 465+ signature fragrances" → "Explore our fragrance collection. Every fragrance you discover helps shape your profile." All sourcing-specific surfaces (RequestFragrance, FAQ sourcing answer, Contact sourcing section, WhyChooseUs sourcing description) left intact — their 465 usage is contextually appropriate. No application behaviour, logic, or architecture changes. Build passes: 187 routes, 0 TypeScript errors, 0 warnings.

**EP2-P7 Collection & Sourcing Architecture Audit (2026-08-06):** Full repository audit of catalogue count architecture. Established that the repository operates two catalogues: the 93-record MKC (browsable, purchasable online) and a manually-maintained sourcing capability claimed at 465 (available on request, not connected to any live supplier system). Identified five surface groups: sourcing-context appropriate (Group S), misleading institutional/trust surfaces (Group I), conflated copy (Group C), and the data origin (Group D — catalogStats.ts). Produced: surface-by-surface classification, trust risk analysis, future product expansion requirements, proposed availability status model (online / on-request / coming-soon / seasonal / limited), product category model, naming options A–E (highlighting Skye and Rose), internal domain terminology, count governance policy, migration risks, and a four-episode programme sequence (EP2-P7A founder verification → EP2-P7B institutional surface corrections → EP2-P7C contact & feature card corrections → EP2-P7D data model foundation).

**EP2-P6B Institutional Voice Alignment (2026-08-06):** Voice consistency findings M-01, M-02, M-03, and M-05 from the EP2-P6 audit implemented. M-01: "get support" replaced with "ask us anything" on contact page; "Simple ordering and support" replaced with "Order and connect" in WhyChooseUs; "Quick and easy support" replaced with "Direct conversation and ordering" in WhyMaison; "WhatsApp Support" trust badge renamed to "WhatsApp Ordering" in TrustBar. M-02: "Why Choose Us" eyebrow replaced with "The Maison Difference" in WhyChooseUs — removes defensive competitive framing. M-03: FAQ H1 "FAQ" replaced with "Your Questions, Answered" — addresses the guest directly; eyebrow "Frequently Asked Questions" preserved as natural hierarchy. M-05: Newsletter button "Join Now" replaced with "Join the Community" — removes urgency, reinforces H2. Seven changes across six files. Zero catalogue, count, or behaviour changes. Build passes: 187 routes, 0 TypeScript errors, 0 warnings.

**EP2-P6A Institutional Identity Alignment (2026-08-06):** Identity vocabulary fixed across five files. "Loyal Customer" → "Loyal Guest" (fragrance-profile/page.tsx + CustomerInsightsPanel.tsx) — resolves ExD-06, the highest-priority vocabulary failure identified in the EP2-P5 audit. "customer favourites" → "Maison favourites" (InstagramCTA.tsx). "CUSTOMER DETAILS" → "YOUR DETAILS" in WhatsApp order template (MiniCart.tsx — guest-visible before sending). Metadata "loved by our customers" → "loved by our guests" (best-sellers/layout.tsx — three occurrences). No copy, logic, count, or architecture changes beyond vocabulary. Build passes: 187 routes, 0 TypeScript errors, 0 warnings.

**EP2-P5C Payment Recovery Foundation Alignment (2026-08-06):** ExD-03 resolved. `app/payment-cancel/page.tsx` transformed from a technical failure state into an expression of institutional hospitality. Rotating ✕ icon (perpetual animation, alarm-producing) removed and replaced with a static `✦` in a warm neutral circle. H1 "CHECKOUT CANCELLED" (uppercase, punitive) replaced with "Take Your Time" (calm, patient, pressure-free). Eyebrow "Payment Cancelled" replaced with "We're Glad You're Here." Body paragraph rewritten to reassure that the cart is intact, with no pressure and no deadline. Calm "What Happened" note added. CTA "Return To Checkout" → "Continue Your Order." CTA "Continue Shopping" → "Explore Our Collection." "Need Help?" note added at card base. Zero payment/commerce logic changes. Commerce confidence journey (EP2-P5A → EP2-P5B → EP2-P5C) complete. Experience Debts ExD-01, ExD-02, ExD-03 resolved. Guest Memory™ target: "They respected my decision and welcomed me back." Build passes: 187 routes, 0 TypeScript errors, 0 warnings.

**EP2-P5B Payment Confirmation Foundation Alignment (2026-08-05):** ExD-02 resolved. `app/payment-success/page.tsx` transformed from instruction-first to gratitude-first. H1 "Complete Your Payment" (uppercase, cold) replaced with "Your Order Is Confirmed" (warm, truthful). Opening paragraph now leads with gratitude and stewardship rather than instructions. New "What Happens Next" section added between header and Order Summary — three numbered steps make the payment process explicit before the banking mechanics are presented. Footer note reframed from deadline anxiety ("reserved for 24 hours") to helpful context ("please complete within 24 hours"). Animation delays updated to accommodate new section. Zero payment/commerce logic changes. Guest Memory™ target: "They made my order feel like the beginning of care, not the end of a transaction." Build passes: 187 routes, 0 TypeScript errors, 0 warnings.

**EP2-P5A Checkout Foundation Alignment (2026-08-05):** ExD-01 resolved. `app/checkout/page.tsx` framing updated — copy only, zero commerce logic changes. H1 "CHECKOUT" (uppercase, cold) replaced with eyebrow "Your Maison Order" + h1 "Complete Your Order" + warm opening paragraph. "Delivery Details" section label added. "Order Summary" card eyebrow added. Below-button reassurance note added: "Your order is confirmed the moment it's placed. We'll be in touch to confirm and arrange delivery with care." Confidence Gradient™ restored at MiniCart → Checkout transition. Guest Memory™ target: "They made checkout feel reassuring." Build passes: 187 routes, 0 TypeScript errors, 0 warnings.

**EP2-P5 Guest Journey Foundation Alignment (2026-08-05):** Complete journey audit across 23 touchpoints. Established five permanent engineering concepts: Experience Touchpoints, Transition Contracts, Confidence Gradient™, Experience Debt™, Guest Memory™. Eight Experience Debts identified (ExD-01 through ExD-08). Priority roadmap produced: EP2-P5A/B/C (commerce flow), EP2-P6A/B (count inconsistency + vocabulary), EP2-P7 (testimonials), EP2-P8 (post-purchase care signal).

**EP2-P4 Engineering Governance Evolution & Homepage Foundation Alignment (2026-08-05):** CLAUDE.md extended with five permanent governance concepts: Institutional Purpose Statements, Programme Objectives, Timeless Content Principle, Experience-First Engineering, and Institutional Impact in the Post Implementation Report. `.ai/INSTITUTIONAL_PURPOSES.md` created — permanent per-page purpose record for 9 significant pages. Homepage hero eyebrow changed from "A Digital Fragrance House" to "Begin your confidence journey." Hero body copy: "93 carefully chosen scents" → "our carefully chosen collection" (Timeless Content Principle); "a collection" → "a fragrance wardrobe" (connects to Maison Method below). LuxuryConfidenceBar: "Thoughtfully curated" → "Each one chosen with care." Build passes: 187 routes, 0 TypeScript errors, 0 warnings.

**EP2-P2 Digital Flagship Maturity Model (2026-08-05):** Permanent institutional framework for measuring how faithfully the digital flagship expresses the institution. `FOUNDATIONS/05_DIGITAL_FLAGSHIP_MATURITY_MODEL.md` established. 20 categories across 3 tiers (Foundation Pillars ×2, Guest-Facing Experience ×1.5, Operational & Future ×1). 5 maturity levels (Functional through Enduring Institution). Weighted scoring (290 points max) with minimum level gates. Quarterly review and annual institutional review processes. Executive Dashboard format. Inaugural assessment record included: Level 3 — Institutional at 63.4% (2026-08-05).

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

# Architecture Decision Records — Maison Skye & Rose

**Project:** Maison Skye & Rose
**Related:** [ARCHITECTURE.md](ARCHITECTURE.md) · [.ai/DECISIONS.md](.ai/DECISIONS.md)

Each ADR records: what was decided, why, the consequences, and the current status. Do not reverse a decision without first understanding its rationale.

---

## ADR-001 — MKC Is the Canonical Fragrance Model

**Decision:** The `FragranceKnowledge` type in `app/lib/mkc/types.ts` is the single source of truth for all fragrance knowledge. All fragrance data must flow from `mkcCatalogue`. Consumer shapes (`DisplayFragrance`, `Fragrance`) are projections of this canonical model — never independent sources.

**Reason:** Prior to MKC, fragrance data was split across multiple files (`fragrances.ts`, `types.ts`) with two incompatible shapes and no shared canonical record. This created risk of data drift, duplicate maintenance, and type errors when crossing system boundaries. A canonical model eliminates these problems and establishes a stable foundation for the Intelligence Layer, analytics, SEO, and the planned Academy.

**Consequences:**
- All new fragrance-consuming features must consume `FragranceKnowledge` directly or through an approved adapter
- Consumer shapes are projections, not data sources — they derive from MKC, never define it
- Adding a new field to a fragrance requires adding it to `FragranceKnowledge` first, then updating adapters
- The legacy `fragrances.ts` data remains for backwards compatibility with components not yet migrated

**Status:** Active — established in EP12, enforced in all MKC-consuming code.

---

## ADR-002 — Repository Is the Source of Truth

**Decision:** The repository (code, types, catalogue, documentation) is the authoritative record of the system. No external system (CMS, database, spreadsheet) overrides what is in the repository.

**Reason:** At this stage, the product catalogue is stable and managed by engineers. Build-time static data provides maximum performance (SSG for all product pages) and zero runtime dependencies on external data services. The cognitive load of a CMS is not justified by the current catalogue size or change frequency.

**Consequences:**
- Adding or editing a fragrance requires a code change and redeployment
- Non-technical staff cannot manage product content without engineering involvement
- Product pages are pre-rendered at build time — no runtime latency, no CMS availability risk
- Future path: CMS integration when catalogue management overhead becomes painful (see ROADMAP)

**Status:** Active.

---

## ADR-003 — Progressive Disclosure Over Information-Dense Cards

**Decision:** ProductCard shows only essential purchase information (image, title, price, Quick Add). Richer fragrance knowledge (notes, character, bullets, occasions) is disclosed progressively: first via FragranceQuickView (Learn More modal), then via the full ProductDetail page.

**Reason:** Presenting all fragrance knowledge on every card creates visual clutter that reduces conversion and dilutes the premium experience. Customers who want depth can access it; customers who know what they want can add to cart immediately. The Quick Add path (one click from card) and the deep knowledge path (modal then PDP) serve different customer intents without forcing one on the other.

**Consequences:**
- ProductCard remains lightweight (Quick Add button + optional Learn More icon on desktop)
- FragranceQuickView carries the MKC knowledge load (notes, character, bullets, size selector, link to PDP)
- ProductDetail is the definitive fragrance profile — all 9 sections, full depth
- The "Learn More" button (↗) is desktop-only to preserve the mobile add-to-cart flow

**Status:** Active — established in EP12-P3.

---

## ADR-004 — Educational Content Belongs in the Academy

**Decision:** Fragrance education (families, note pyramids, how to wear, seasonal guidance) belongs in the Maison Fragrance Academy at `/academy`, not embedded inline across the commerce flow. Product Detail pages reference Academy content via placeholder cards but do not duplicate it.

**Reason:** Embedding educational content in the commerce flow (product cards, MiniCart, checkout) creates clutter that undermines conversion. Education belongs in a dedicated knowledge space where customers who seek it can engage deeply. The PDP Discover More section serves as a bridge between product context and Academy depth.

**Consequences:**
- Academy content is owned and published via `app/lib/academy/catalogue.ts`
- PDP "Discover More" placeholder cards link to Academy article slugs
- Academy articles cross-link to MKC fragrance entries via `relatedFragranceIds`
- No educational copy should be written inline in product UI components

**Status:** Active — Academy in planning (EP13).

---

## ADR-005 — AI Consumes Structured Knowledge, Never Invents It

**Decision:** When AI-powered features are implemented (Ask Maison AI, personalized recommendations), the AI system must ground its responses in structured `FragranceKnowledge` fields. It must not generate fragrance descriptions, note profiles, or character claims from its training data.

**Reason:** AI-generated fragrance information is unreliable (fragrances are highly specific, subjective, and brand-dependent). Customers trust specific claims about notes and character. If the AI invents a claim that contradicts the actual fragrance, the brand loses credibility. Using MKC as the AI's knowledge base ensures responses are accurate and consistent with what customers read on the PDP.

**Consequences:**
- AI features must import and read from `mkcCatalogue` before composing responses
- Fields like `description`, `notes`, `mood`, `occasions`, `recommendedFor`, `signatureStyle` provide the grounding data
- The AI system may compose, summarize, and recommend — but never fabricate fragrance-specific facts
- This constraint is noted in ARCHITECTURE.md (Future AI section)

**Status:** Active — constraint established; AI features not yet implemented.

---

## ADR-006 — Payment Integration Postponed Until Customer Experience Is Mature

**Decision:** PayFast integration is built but intentionally kept in sandbox mode until the core customer experience (discovery, education, trust signals) is mature and validated. Live payments are not enabled until the commerce flow is complete and thoroughly tested.

**Reason:** Enabling live payments before the customer experience is validated risks revenue loss (abandoned carts due to poor UX), refund requests (unclear product expectations), and trust damage (payment errors in an immature system). WhatsApp checkout provides a fully functional primary revenue path that requires no payment infrastructure.

**Consequences:**
- PayFast remains on sandbox URL until the launch checklist is complete
- KI-01, KI-02, KI-03, KI-05, KI-06 remain open until a dedicated PayFast hardening sprint (EP 6.0)
- WhatsApp is the authoritative and only live revenue path
- The launch checklist in ROADMAP.md must be satisfied before switching PayFast to production

**Status:** Active — see ROADMAP EP 6.0 for PayFast production hardening plan.

---

## ADR-007 — WhatsApp Is the Primary Checkout Flow

**Decision:** WhatsApp order submission is the primary checkout path. PayFast is secondary. This is a business decision, not a technical limitation.

**Reason:** WhatsApp allows manual order confirmation, flexible handling of custom requests (fragrances not on the website), and direct customer communication. It removes friction for customers already using WhatsApp daily. At the current scale, manual order handling is manageable and preferred.

**Consequences:**
- Every order requires manual response from the business owner
- Does not scale without dedicated staff to handle order messages
- WhatsApp message format must be maintained as the cart and pricing logic evolve
- Source: `app/components/MiniCart.tsx` → `handleWhatsAppCheckout()`

**Status:** Active.

---

## ADR-008 — Product Data Is Static TypeScript

**Decision:** All product data (`mkcCatalogue`) is a static TypeScript array bundled at build time. There is no runtime API call for product data.

**Reason:** Product data is stable — it doesn't change per-user or per-request. Static data at build time enables `generateStaticParams` to pre-render all 93 product pages as static HTML served from the CDN. Zero runtime latency, zero CMS availability risk.

**Consequences:**
- Adding or editing a product requires a code change and redeployment
- Not manageable by non-technical staff
- Future path: Supabase product table or a headless CMS when catalogue management overhead justifies the infrastructure cost

**Status:** Active.

---

## ADR-009 — Analytics Observes Behaviour, Never Influences It

**Decision:** The analytics system (`app/lib/analytics.ts`) is a passive observer only. It must never be imported into the Intelligence Layer. Analytics calls in application code must always follow state updates, never precede them.

**Reason:** Coupling analytics into the recommendation engine creates a hidden dependency that degrades the engine's testability, predictability, and maintainability. The intelligence layer must remain a pure function — same inputs, same outputs, regardless of whether analytics is running. Additionally, analytics calls preceding state updates can create race conditions where the event fires before the UI has actually changed.

**Consequences:**
- `intentParser.ts`, `knowledgeAdapter.ts`, `recommendFragrances.ts`, `explainability.ts` must never import `analytics.ts`
- Analytics calls go at the end of event handlers (after `setState`, `addToCart`, etc.)
- This constraint is enforced by code review and documented in `.ai/DECISIONS.md`

**Status:** Active — confirmed clean in EP6-P2, EP6-P3, EP6-P4 browser validations.

---

## ADR-010 — React Context Over External State Library

**Decision:** All shared app state (cart, favorites, cart UI, cart feedback) is managed with React Context. No Zustand, Redux, or Jotai.

**Reason:** The state requirements are simple and well-bounded. Each context has a single responsibility. Context avoids adding a dependency, keeps the state model readable, and aligns with Next.js App Router patterns.

**Consequences:**
- Context re-renders all consumers when any value changes
- Mitigated with `useMemo` on context value objects (all four contexts) and `useCallback` on all mutations
- Sufficient for current scale; if cart or recommendations grow significantly more complex, Zustand is the preferred migration path

**Status:** Active.

---

## ADR-011 — Wholesale Activates Automatically, No Account Required

**Decision:** Wholesale pricing activates automatically when `cartCount >= 10`. No login, no registration, no approval process.

**Reason:** Reduces friction for bulk buyers. Makes the wholesale incentive immediately visible and credible during the shopping flow. Aligns with the luxury positioning (exclusivity by threshold, not by gatekeeping).

**Consequences:**
- Any customer can access wholesale pricing by adding 10+ units
- A retail customer adding many sizes of the same fragrance will unintentionally trigger wholesale
- This is an accepted business trade-off

**Status:** Active — source: `CartContext.tsx` `wholesaleActive` derived value.

---

## ADR-012 — Intelligence Layer Is a Pure TypeScript Library

**Decision:** The Intelligence Layer (`intentParser`, `knowledgeAdapter`, `recommendFragrances`, `explainability`) is implemented as pure TypeScript modules with no React, no API calls, and no side effects. All functions are deterministic given the same inputs.

**Reason:** Pure functions are testable, predictable, and portable. They can be called from any context (server, client, test runner) without special setup. The Intelligence Layer's quality is validated by the `.ai/evaluation/` framework, which requires pure-function tests to pass independently of the UI.

**Consequences:**
- Intelligence Layer modules cannot import React hooks, browser APIs, or analytics
- Can be tested with standalone scripts (see `validate-*.mjs` / `.ts` files in root)
- Can be reused in server-side contexts (future API routes, Edge functions)

**Status:** Active.

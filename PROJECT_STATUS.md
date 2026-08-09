# Project Status — Maison Skye & Rose

**Last updated:** 2026-08-09
**Phase:** Launch Execution
**Build status:** PASS — 188 routes, 0 TypeScript errors, 0 warnings

---

## Current Engineering Program

**Program:** EP5-P4B — Governed Identity-to-Product Bridge — COMPLETE
**Sprint:** EP5
**Gate:** EP5-P4C — Wire FactoryIdentityGate + IdentityProductResolver into factory intake pipeline. `IdentityAwareRunInput` type (carrying both `identityId` and `maisonSlug`) may now be introduced — the governed bridge exists.
**Objective:** Cross-domain bridge established between the Maison Identity Platform and the Maison Product / Knowledge Catalogue. `app/lib/identity/data/identity-product-registry.json` created (version 1.0.0, 1 mapping: MIP-000012 → `alien-goddess-inspired`). `app/lib/identity/productMapping.ts` read API: `getMappingsForIdentity()` (1:many — one identity may have multiple products), `getIdentityForMaisonSlug()` (invariant: 1:1 slug→identity). `scripts/factory/identity/IdentityProductResolver.ts`: `resolveIdentityProduct()` returning typed `IdentityProductResolution`. 29-proof deterministic validation suite (`validate-identity-product-mapping.ts`). All 7 suites pass: 29/29 mapping, 28/28 factory, 69/69 foundation, 54/54 admin, 85/85 resolver, 39/39 source, 100/100 editorial (404 total). Registry SHA-256 unchanged: `c75f74b56d4c2064b4f00e422c26e454343defc6a8c61df288e4fe8c2c650a1d`. MKC native files: 94 — unchanged. Build: 188 routes, 0 TypeScript errors, 0 warnings.

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
| Total pages | 188 |
| Product pages (SSG) | 93 |
| Static pages | 25 |
| Dynamic routes | 14 |
| Last verified | 2026-08-09 |

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
| EP2 | EP2-P7C | Commerce and Contact Truth Alignment | Complete — 2026-08-06 |
| EP2 | EP2-P7D | Multi-Category Type Foundation | Complete — 2026-08-06 |
| EP3 | EP3-P1 | Product Creation Pipeline Audit | Complete — 2026-08-06 |
| EP3 | EP3-P2 | Producer Registry Foundation | Complete — 2026-08-06 |
| EP3 | EP3-P3 | Category-Aware Factory Orchestrator | Complete — 2026-08-06 |
| EP3 | EP3-P4 | Multi-Category Factory Intake Architecture Audit | Complete — 2026-08-06 |
| EP3 | EP3-P5A | Category-Bearing Factory Intake | Complete — 2026-08-06 |
| EP3 | EP3-P5B | Scaffold Resolution Foundation | Complete — 2026-08-06 |
| EP3 | EP3-P6 | Registry-Driven Factory Stability Audit | Complete — 2026-08-06 |
| EP3 | EP3-P7 | Factory Integrity Hardening | Complete — 2026-08-06 |
| EP4 | EP4-P1 | First Multi-Category Product Strategy Audit | Complete — 2026-08-06 |
| EP4 | EP4-P2 | Home Fragrance Foundation | Complete — 2026-08-06 |
| EP4 | EP4-P2R | Correct Home Fragrance Foundation | Complete — 2026-08-06 |
| EP4 | EP4-P3 | Home Fragrance Producer Strategy Audit | Complete — 2026-08-07 |
| EP4 | EP4-P3A | Home Fragrance Production Type Foundation | Complete — 2026-08-07 |
| EP4 | EP4-P3B | Home Fragrance Draft & Validation Foundation | Complete — 2026-08-07 |
| EP4 | EP4-P3BR | Correct Home Fragrance Quality Boundary | Complete — 2026-08-07 |
| EP4 | EP4-P3C | Home Fragrance Producer Foundation | Complete — 2026-08-07 |
| EP4 | EP4-P3CR | Home Fragrance Producer Safety Hardening | Complete — 2026-08-07 |
| EP4 | EP4-P3D  | Prepare Controlled Home Fragrance Generation | Complete — 2026-08-07 |
| EP5 | EP5-P1   | Establish Maison Identity Platform Foundation | Complete — 2026-08-07 |
| EP5 | EP5-P2A  | Identity Resolution Architecture Audit | Complete — 2026-08-07 |
| EP5 | EP5-P2B  | Establish Deterministic Identity Resolver | Complete — 2026-08-07 |
| EP5 | EP5-P2CR | Harden Identity Ingestion Source Contracts | Complete — 2026-08-08 |
| EP5 | EP5-P2C-R| Protect Candidate Canonical Identity | Complete — 2026-08-08 |
| EP5 | EP5-P2C  | Ingest Mid-Year 2026 Identity Candidates | Complete — 2026-08-08 |
| EP5 | EP5-P3A  | Identity Editorial Review Architecture Audit | Complete — 2026-08-08 |
| EP5 | EP5-P3B  | Establish Identity Editorial Transaction Service | Complete — 2026-08-08 |
| EP5 | EP5-P3C  | Establish Identity Review Admin Interface | Complete — 2026-08-09 |
| EP5 | EP5-P3D  | First Editorial Identity Verification Campaign | Complete — 2026-08-09 |
| EP5 | EP5-P4A  | Identity-Aware Factory Intake Foundation | Complete — 2026-08-09 |
| EP5 | EP5-P4B  | Governed Identity-to-Product Bridge | Complete — 2026-08-09 |

`FOUNDATIONS/00_FOUNDERS_LETTER.md` — The permanent founder's letter to Skye, Rose, future employees, and future stewards. *Why we began.*
`FOUNDATIONS/01_SKYE_AND_ROSE_COVENANT.md` — The institutional promise: to customers, products, technology, and future generations. *What we promise.*
`FOUNDATIONS/02_CONSTITUTION.md` — Twelve articles of permanent institutional belief, from The Institution to Legacy; closes with The Golden Rule. *What we believe.*
`FOUNDATIONS/03_STEWARDSHIP_AND_ARCHITECTURE_CHARTER.md` — The operational expression of the Constitution: Builder's Oath, ten Principles, the Skye & Rose Standard, Engineering Doctrine, AI Stewardship Principles, and the Definition of Done. *How we build everything.*
`FOUNDATIONS/04_EXPERIENCE_BLUEPRINT.md` — The emotional operating system of the institution: who our guest is, the ten-stage emotional journey, every touchpoint, brand personality, voice, language principles, AI experience, luxury and confidence philosophies, and the Closing Promise. *How every guest should feel.*

**EP2-P1 Audit Findings (2026-08-05):** Overall institutional alignment score 7.1/10. Intelligence layer (Fragrance Profile, MaisonCompanion, Concierge, Shop, Quiz) rated Aligned. Critical gaps: About page (3/10 — fails Foundation narrative standard), catalogue count inconsistency (93 vs 465+), "Loyal Customer" terminology, post-purchase experience absent, checkout UX cold. Recommended sequence: EP2-P2 (About page rewrite) → EP2-P3 (checkout + post-purchase) → EP2-P4 (testimonials) → EP2-P5 (concierge voice) → EP2-P6 (language pass).

**EP2-P3 About Page Foundation Alignment (2026-08-05):** `app/about/page.tsx` rewritten from 4 generic paragraphs to 9 Foundation-aligned sections: Opening, A Compliment Changed Everything, Why Skye & Rose, What We Believe, Confidence Is What We Are Here to Deliver, Knowledge Before Recommendation, Accessible Luxury, Growing Together, Our Promise, An Invitation. Count inconsistency removed (465+ → timeless language). OG and Twitter metadata added. Architecture preserved. Build passes: 187 routes, 0 TypeScript errors, 0 warnings.

**EP5-P4B Governed Identity-to-Product Bridge (2026-08-09):** Cross-domain bridge established between the Maison Identity Platform and the Maison Product / Knowledge Catalogue. Architectural corrections applied per founder approval: (1) Domain ownership — the mapping is explicitly a bridge between two domains, not core MIP identity truth; `identity-product-registry.json` stores references, not duplicated canonical data. (2) Cardinality — one IdentityId may map to zero, one, or multiple Maison products (allowed, e.g. fragrance + body line); one Maison product slug maps to at most one identity (invariant). `app/lib/identity/data/identity-product-registry.json` created (version `"1.0.0"`, 1 approved mapping). `app/lib/identity/productMapping.ts`: exports `MaisonProductMapping`, `IdentityProductRegistry`, `loadIdentityProductRegistry()`, `getMappingsForIdentity(identityId): readonly MaisonProductMapping[]` (returns all mappings for an identity — future-safe for 1:many), `getIdentityForMaisonSlug(slug): IdentityId | null` (singular, enforces 1:1 slug invariant). `scripts/factory/identity/IdentityProductResolver.ts`: exports `IdentityProductResolution` (discriminated union: `resolved: true | false`) and `resolveIdentityProduct(identityId)` — imports ONLY from `app/lib/identity/`. Seven verified identity association audit completed: 6 of 7 correctly remain unmapped (MIP-000024 "Wanted by Night" ≠ "Azzaro Most Wanted Inspired" — different products; MIP-000009 "Capri In a Bottle" ≠ Kayali Vanilla 28 products — different Kayali releases). One approved mapping: MIP-000012 (Alien Goddess / Mugler) → `alien-goddess-inspired` (Rose) — associatedBy: "Awf". `scripts/identity/validate-identity-product-mapping.ts`: 29 proofs across 5 sections. Cardinality proof 303 demonstrates 1:many fixture structurally valid without creating real second mapping. Proof 302 enforces slug uniqueness. All 7 suites pass: 29/29 mapping, 28/28 factory, 69/69 foundation, 54/54 admin, 85/85 resolver, 39/39 source, 100/100 editorial (404 total proofs). `app/lib/identity/types.ts`, `app/lib/mkc/types.ts`, `scripts/factory/types.ts` NOT modified — `IdentityAwareRunInput` deferred to EP5-P4C. Registry SHA-256 confirmed byte-identical: `c75f74b56d4c2064b4f00e422c26e454343defc6a8c61df288e4fe8c2c650a1d`. 93 Maison products unchanged. 94 MKC native files unchanged. Build: 188 routes, 0 TypeScript errors, 0 warnings. 0 AI/API calls. 0 registry writes. 0 guest-facing changes.

**EP5-P4A Identity-Aware Factory Intake Foundation (2026-08-09):** Standalone identity eligibility gate established as the first factory-side integration boundary for the Maison Identity Platform. Architectural finding confirmed: no programmatic link currently exists between a MIP `IdentityId` and a Maison supplier catalogue slug — the bridge is missing and deferred to EP5-P4B. `scripts/factory/identity/FactoryIdentityGate.ts` created: exports `resolveIdentityEligibility(registry, identityId)` (pure, injected registry — testable) and `checkIdentityEligibility(identityId)` (production wrapper, reads registry from disk, never calls `saveIdentityRegistry()`). `IdentityGateResult` is a typed discriminated union. `IdentityGateFailureReason` defines three structurally distinct failure paths: `invalid-identity-id` (format check), `identity-not-found` (not in registry), `identity-not-eligible` (exists but `isIdentityKnowledgeEligible()` returns false). The gate never compares `record.status` directly — all eligibility decisions delegate to `isIdentityKnowledgeEligible()`. No imports from any factory module (`orchestrator`, `scaffold`, `producers`, `GenerationEngine`, `draftBuilder`, `promotionManager`, `CatalogueRegistry`). `scripts/identity/validate-factory-identity-integration.ts`: 28 deterministic proofs across 5 sections — gate contract (2), all 6 eligibility states (9), isolation invariants (7), legacy factory compatibility (3), production registry safety (7). `mip:validate:factory` script added to package.json. `scripts/factory/types.ts` NOT modified — `IdentityAwareRunInput` removed from EP5-P4A scope per founder correction: an input carrying both `identityId` and `slug` would imply a governed association that does not yet exist. `app/lib/mkc/types.ts` NOT modified — no `identityId` on `FragranceKnowledge`. All Maison catalogue entries unchanged. Registry SHA-256 confirmed byte-identical: `c75f74b56d4c2064b4f00e422c26e454343defc6a8c61df288e4fe8c2c650a1d`. MKC native: 94 files — unchanged. All 6 suites pass: 28/28 factory, 69/69 foundation, 54/54 admin, 85/85 resolver, 39/39 source, 100/100 editorial. Build: 188 routes, 0 TypeScript errors, 0 warnings. 0 AI/API calls. 0 registry writes. 0 MKC changes. 0 guest-facing changes.

**EP5-P3D First Editorial Identity Verification Campaign (2026-08-09):** First human editorial review of the Maison Identity Platform. Founder (actor: "Awf") performed all 7 verifications through the `/admin/identity` human-governed interface established in EP5-P3C. Claude's role was read-only preparation only: verified registry gate, produced review checklist, confirmed canonical safety, and provided URLs — zero autonomous editorial decisions, zero registry writes by AI. 7 Category A identities verified: MIP-000001 (24 Faubourg / Hermès), MIP-000006 (À la rose / Maison Francis Kurkdjian), MIP-000008 (Coconut Passion / Victoria's Secret), MIP-000009 (Capri In a Bottle Lemon Sugar | 14 / Kayali), MIP-000012 (Alien Goddess / Mugler), MIP-000013 (Boss Nuit Pour Femme / Hugo Boss), MIP-000024 (Wanted by Night / Azzaro). All 7 verified with high research confidence, clean canonical names, and canonicalBrand present. Registry post-EP5-P3D: 26 total / 7 verified / 3 pending-review / 16 candidate / 0 others. SHA-256: `c75f74b56d4c2064b4f00e422c26e454343defc6a8c61df288e4fe8c2c650a1d`. 3 remaining pending-review (MIP-000005, MIP-000011, MIP-000014) have name issues requiring canonical correction before they can be verified. 8 proof assertions updated across 2 suites to reflect legitimate state change: foundation proof 802, admin proofs 201/203/205/206/207/503/505. All 5 suites pass: 69/69 foundation, 54/54 admin, 85/85 resolver, 39/39 source, 100/100 editorial. Institutional principle upheld: HUMANS APPROVE INSTITUTIONAL TRUTH.

**EP5-P3C Establish Identity Review Admin Interface (2026-08-09):** Human governance admin interface established. Two new Next.js 16 App Router routes: `/admin/identity` (review queue) and `/admin/identity/[id]` (identity detail). Architecture enforces a strict browser→Server Component→Server Action→auth boundary→IdentityEditorialService→repository→persistence chain. Browser never reads or writes `identity-registry.json` directly. All 7 Server Actions in `app/admin/identity/actions.ts` call `await assertAuth()` as the first statement (independent of page-level auth); `computeSessionToken()` not exported (avoids `"use server"` async-only export constraint). Client components: `IdentityReviewList.tsx` (queue with 4 filter dimensions: status, recommendedAction, researchConfidence, possibleNameIssue) and `IdentityReviewDetail.tsx` (full detail with 8 read sections and 7 action panels, using `useTransition` for pending state, `router.refresh()` after success, and stale detection via `isStale` state). Server Components: queue page redirects if unauthenticated; detail page awaits `params` (Next.js 16 Promise pattern), calls `notFound()` for unknown IDs, uses `key={detail.record.updatedAt}` to remount client component after each successful mutation (resets all local state). Canonical correction: three-state field handling for `launchYear`/`marketedGender` (absent=keep, null=clear, number=set) using spread objects — no unsafe type assertions. Alias confirmation explicit — supplierName never auto-converted. Correction does not auto-verify. Rejection and dispute both require reason. Actor is a free-text audit label. AdminNavigation extended to 13 items with `isActive()` helper using `startsWith` for sub-routes without breaking `/admin` root exact match. `scripts/identity/validate-identity-editorial-admin.ts`: 54 deterministic proofs across 5 sections (AUTH/BOUNDARY, QUEUE, DETAIL, ACTIONS, SAFETY). `assert` function uses `asserts condition` return type for TypeScript type narrowing. Validation: 54/54 ✓. Regression: 69/69, 85/85, 39/39, 100/100 ✓. Registry SHA-256: `a955e1303ab53ae194a9af33bd47f9b36aff3e84d59bc574a9eb12ef0394d41f` — unchanged. Registry state: 26/10/16/0 — unchanged. Build: 188 routes, 0 TypeScript errors, 0 warnings. 0 AI calls. 0 real editorial decisions. 0 registry writes.

**EP5-P3B Establish Identity Editorial Transaction Service (2026-08-08):** Human governance domain and transaction service established. `app/lib/identity/editorial/` created as the editorial domain. Architecture: injected clock (`IdentityEditorialClock`) ensures all timestamps are deterministic in tests; repository abstraction (`IdentityEditorialRepository`) isolates tests from real filesystem; `_transact()` private core enforces load → stale check → mutate → validate → collision → save on every mutation; optimistic concurrency via `expectedUpdatedAt` on every input. Seven actions: `verifyIdentity` (pending-review | disputed → verified; requires clean canonical name, canonicalBrand, actor; clean-name gate rejects " / ", "(Note:", "(unverified)"), `correctCanonical` (any status; no-op guard; launchYear/marketedGender settable or clearable via null), `confirmAlias` (any status; cross-record collision detected), `requestMoreResearch` (pending-review → candidate; reason required), `elevate` (candidate → pending-review; reason required), `rejectIdentity` (candidate | pending-review | disputed → rejected; verified blocked — must dispute first), `disputeIdentity` (verified → disputed; reason required). Two read projections: `getReviewQueue()` (filtered, ordered: pending-review → candidate → disputed → id asc; campaign enrichment optional) and `getIdentityReview()` (full detail + verification eligibility gate + canonical collision warning). Three new `IdentityHistoryEventType` values: `rejected`, `candidate-promoted`, `candidate-demoted`. `isIdentityKnowledgeEligible()` pure function: returns true only for `verified` status (not integrated into factory — EP5-P4). `editorial/index.ts` exports `PRODUCTION_CLOCK` and `createProductionRepository()` for future Server Actions. `isCleanCanonicalProposal` inlined in service (not imported from scripts/) — server boundary preserved. Evidence immutability: all spread-reconstruct operations explicitly preserve `evidence: record.evidence`. Confidence independence: no mutation modifies confidence.score/basis/lastEvaluatedAt. `validate-identity-editorial.ts`: 100 proofs across 16 sections. Real registry hash verified before/after — byte-identical. `mip:validate:editorial` script added. Validation: 69/69 (foundation), 85/85 (resolver), 39/39 (source), 100/100 (editorial). Build: 187 routes, 0 TypeScript errors, 0 warnings. 0 AI calls. 0 real registry writes. 0 UI/route changes.

**EP5-P2C Ingest Mid-Year 2026 Identity Candidates (2026-08-08):** First real population of the Maison Identity Platform registry. 31 supplier rows (26 unique + 5 L/M pairs) and 26 Gemini research entries ingested. Registry: 26 IdentityRecords (MIP-000001–MIP-000026); 10 pending-review (Category A/B); 16 candidate (Category C); 0 verified. Canonical safety enforced by `isCleanCanonicalProposal()`: 4 ambiguous multi-option research proposals blocked (DKNY Red Delicious Apple, 212 Carolina Herrera Good Girl Jasmine Absolute, Armani Prive Oud Nacre, Armani Stronger With You Powerfully) — supplier names used as provisional canonicals; original Gemini proposals preserved in evidence and `researchCanonicalProposal` field. All 26 records carry supplier-catalogue + research evidence. 5 L/M duplicate pairs preserved as dual `supplierIdentities` in single IdentityRecord. Campaign report: `app/lib/identity/data/campaigns/mid-year-2026-campaign.json`. Editorial review batch: `app/lib/identity/data/campaigns/mid-year-2026-editorial.json`. Resolver lifecycle invariant confirmed: no candidate or pending-review identity auto-resolves. Idempotency confirmed: second dry run correctly skips all 26 (no new MIP-IDs proposed). Validation suite proofs updated for EP5-P2C state: 69/69, 85/85, 39/39. Build: 187 routes, 0 TypeScript errors, 0 warnings. 0 AI calls. 0 Knowledge Factory operations. 0 UI/route changes.

**EP5-P2C-R Protect Candidate Canonical Identity (2026-08-08):** Canonical safety correction before first registry write. `isCleanCanonicalProposal()` added to `sourceValidation.ts`: rejects `" / "`, `"(Note:"`, and `\([^)]*\bunverified\b[^)]*\)`. Provisional canonical fallback to `supplierName` when proposal absent or rejected. `researchCanonicalProposal` field added to `CandidateIngestionResult` and `EditorialReviewEntry`. Evidence `ambiguousNote` added for rejected proposals. Section 7 (proofs 701–713) added to source validation suite (26 → 39 proofs). Both Mid-Year 2026 source files populated with founder-supplied evidence.

**EP5-P2CR Harden Identity Ingestion Source Contracts (2026-08-08):** Ingestion infrastructure established for the Mid-Year 2026 supplier new arrivals. Source data files confirmed absent from repository; per approval conditional clause, infrastructure was built and execution has stopped. Delivered: `scripts/identity/ingestion/types.ts` — full type contracts for `SupplierSourceFile`, `ResearchSourceFile`, `CampaignReport`, `EditorialReviewBatch`, and all pipeline types. `scripts/identity/ingest-2026-new-arrivals.ts` — deterministic, idempotent ingestion script with `--dry-run` flag, 16-point pre-ingestion validation suite (unique count, L/M collapse, verbatim names, no verified, ID format, uniqueness, fragrance category, confidence range, validateIdentityRecord, canonical collision, evidence ID uniqueness, supplier evidence, research evidence, Category C brand exclusion, non-empty canonical name, idempotency keys), atomic registry write via `saveIdentityRegistry()`, campaign report output, editorial review batch output. `data/identity/source/mid-year-2026-supplier.json` and `mid-year-2026-research.json` — schema placeholder files with embedded `_schema` documentation. `app/lib/identity/data/campaigns/` — campaign output directory for campaign report and editorial review batch. `app/lib/identity/persistence.ts` extended with `saveIdentityRegistry()` — atomic write: validate → temp file → round-trip verify → backup → rename. `mip:ingest:2026:dry` and `mip:ingest:2026` npm scripts added. Build: 187 routes, 0 TypeScript errors, 0 warnings. NO AI called. NO registry populated. ZERO routes added. Next gate: founder populates source files → `npm run mip:ingest:2026:dry` → inspect → `npm run mip:ingest:2026`.

**EP5-P2B Establish Deterministic Identity Resolver (2026-08-07):** Five-stage deterministic resolver established as `app/lib/identity/resolver/`. The resolver reads, scores, and explains — it does NOT create, modify, persist, or call AI. Architectural invariants enforced: (1) Purity — no `resolvedAt`, no timestamps, no randomness; identical input always produces identical `ResolutionResult`. (2) Status eligibility — only `"verified"` identities may produce `status: "resolved"`; candidate/pending-review/disputed/deprecated yield `"candidate"` with explanation. (3) Safe suffix stripping — only `" Inspired"` and `" Inspired By"` stripped; Extrait/Le Parfum/Parfum/EDP/EDT/Elixir/Intense are NEVER stripped (flanker integrity hard invariant). (4) Category hard boundary — `category: ProductCategory` required on `ResolutionInput`; cross-category aliases and canonical names are hard exclusions from the eligible pool, not scoring penalties. Pipeline: Stage 0 (eligible universe: category + rejected exclusion) → Stage 1 (exact alias, O(1)) → Stage 2 (canonical name exact, with brand disambiguation on ties) → Stage 3 (suffix strip + retry Stages 1–2) → Stage 4 (Jaccard token scoring + brand alignment + digit conflict guard). Token scorer: Jaccard name overlap (max 60), brand alignment (max 20), digit conflict penalty (−30), clamped 0–80. Flanker protection: `hasMeaningfulMismatch` flag blocks auto-resolve when any token differs between query and candidate name. Short-name protection: `isShortQuery` (≤1 meaningful token) blocks Stage 4 auto-resolve. Ambiguity margin: top and runner-up within 15 points → `"ambiguous"`. Stable sort: score desc, then identityId asc for deterministic tie-breaking. Score thresholds: CANDIDATE_THRESHOLD=35, TOKEN_RESOLVE_THRESHOLD=55. Confidence values: alias-exact=95, canonical-exact=90, strip-suffix=85 for verified; 85/80/75 for non-verified candidates. `mip:validate:resolver` added to package.json. 85/85 proofs pass. EP5-P1 regression: 69/69. Build: 187 routes, 0 TypeScript errors, 0 warnings.

**EP5-P1 Establish Maison Identity Platform Foundation (2026-08-07):** Maison Identity Platform (MIP) established as the institutional layer that answers "What is this?" before the Knowledge Platform attempts to explain it. Principle: IDENTITY PRECEDES KNOWLEDGE. `app/lib/identity/` created as the application-shared domain library (future consumers: Knowledge Factory, Search, Concierge, Recommendations, Admin). `IDENTITY_PLATFORM_VERSION = "0.1.0"` — separate from `FACTORY_VERSION`. Identity ID format: `MIP-NNNNNN` (validated, opaque, stable across name changes). Domain model: `SupplierIdentity` (exact supplier name, preserved verbatim — not canonical truth); `CanonicalIdentity` (institutional verified understanding — holds `ProductCategory` as the single authoritative location); `IdentityAlias` (6 types; source value never destroyed); `IdentityEvidence` (6 source types; audit-ready); `IdentityConfidence` (0–100 score + basis; independent from status); `IdentityStatus` (6-state lifecycle: candidate → pending-review → verified / disputed / deprecated / rejected); `IdentityHistoryEntry` (append-oriented; 12 event types; no rewrite through normal ops); `IdentityRecord` (composite; no Maison product fields). Three error types: `IdentityDuplicateIdError`, `IdentityDuplicateCanonicalError`, `IdentityAliasCollisionError`. `IdentityRegistry` enforces: duplicate ID rejected; duplicate canonical key rejected when `canonicalBrand` present; alias collision across identities throws dedicated error — never silently resolved. Read APIs: `register`, `getById`, `has`, `list`, `findByCanonicalName`, `findByAlias`. Mutation APIs: `appendHistory`, `addAlias`, `addEvidence` — all deterministically validated. Lifecycle-aware validator: candidate without canonicalBrand → warning; verified without canonicalBrand → error; confidence 101 → error; confidence -1 → error; duplicate alias within record → error; duplicate evidence ID → error. Normalizer: trim + lowercase + collapse whitespace; preserves digits, brand words, accented characters, flanker words. `app/lib/identity/data/identity-registry.json` — empty `{ "version": "0.1.0", "identities": [] }`. Loader-only persistence (no write in EP5-P1). `mip:validate` script added to package.json. 69 deterministic proofs across 9 sections. No AI. No MKC migration. No factory integration. No UI. No routes. Build: 187 routes, 0 TypeScript errors, 0 warnings.

**EP4-P3D Prepare Controlled Home Fragrance Generation (2026-08-07):** Controlled-generation infrastructure established for the first real Home Fragrance AI draft. `scripts/factory/run-home-fragrance-controlled.ts` created — the explicit single-product entry point for EP4-P3D. Safety constraints enforced: exactly one product per invocation; no batch mode; `ANTHROPIC_API_KEY` required; Composition + Editorial only; no promotion; no native write; absolute stop after draft write; human review report printed. `APPROVED_INTAKE` constant is currently `null` — no AI call has been made, no cost incurred. `scripts/factory/drafts/home-fragrance/` directory created as the category-specific draft location. `HomeFragranceDraftBuilder.buildHomeFragranceDraft()` updated with optional `importBase` parameter (backward-compatible default preserves all 123 proofs). `npm run mkc:home-fragrance:controlled` added to package.json. Next gate: founder provides approved `HomeFragranceIntake` to populate `APPROVED_INTAKE`.

**EP4-P3CR Home Fragrance Producer Safety Hardening (2026-08-07):** Four production safety issues resolved before EP4-P3D real AI generation. (1) Cross-tier duplicate notes promoted from warning to error in `HomeFragranceCompositionProducer.validate()` — `HF_COMP_CROSS_TIER_DUPLICATE` now produces `degraded`, not `success`. (2) Max-notes-per-tier boundary enforced: `HF_COMP_NOTES_TOP_MAX`, `HF_COMP_NOTES_HEART_MAX`, `HF_COMP_NOTES_BASE_MAX` errors added. (3) Runtime JSON structural validation added to `parse()` in both Composition and Editorial producers: missing tier, non-array tier, non-string element, or wrong field type all throw, producing `failed` status (not silent `as {...}` coercion). (4) Pipeline stop policy hardened: `degraded` and `failed` results now break the producer chain; only `success` triggers context update and merge. Merger policy updated: both `failed` and `degraded` results are skipped (was `failed` only). `HomeFragranceProducerRegistry` created as a type-safe parallel to `ProducerRegistry`, typed exclusively to `HomeFragranceProducerSet` — never registered in the production `defaultRegistry`. Validate script extended from 109 to 123 proofs. Build: 187 routes, 0 TypeScript errors, 0 warnings.

**EP4-P3BR Correct Home Fragrance Quality Boundary (2026-08-07):** Three integrity corrections to EP4-P3B. (1) Merger type assertion removed: `homeFragranceMerger.ts` now accumulates overrides as `Partial<HomeFragranceKnowledge>` and applies via `Object.assign({ ...scaffold }, accumulated)`, which returns `HomeFragranceKnowledge & Partial<HomeFragranceKnowledge>` — structurally assignable to `HomeFragranceKnowledge` without any `as` cast. (2) Draft builder truthfulness: `renderIdentity` in `HomeFragranceDraftBuilder.ts` no longer fabricates `catalogVersion ?? "1.0"` or `status ?? "active"` — absent fields render as comment lines for author review; present fields render their exact supplied values. (3) Canonical slug restored: `app/lib/mkc/deriveSlug.ts` created as the single authoritative implementation shared by both `app/lib/mkc/` and `scripts/factory/`; `scripts/factory/core/deriveSlug.ts` updated to re-export from it; `homeFragranceValidator.ts` now calls `deriveSlug()` instead of inlining the algorithm. All factory consumers unchanged (they still import from `./core/deriveSlug` or `../intake`). Validation script extended to 61 proofs. Build: 187 routes, 0 TypeScript errors, 0 warnings.

**EP4-P3B Home Fragrance Draft & Validation Foundation (2026-08-07):** Scaffold → validate → draft chain established for Home Fragrance knowledge. `validateHomeFragranceRecord(record: HomeFragranceKnowledge): ValidationResult` created in `app/lib/mkc/homeFragranceValidator.ts` — reuses category-neutral `ValidationResult`/`ValidationIssue` types; applies five groups (identity, composition, editorial, discovery, commerce); classification/intelligence/relationships returned as PASS with empty issues. Foundation vs AI-enriched quality distinction: 0 notes per tier = error, 1 note = warning, 2+ = pass. Discovery arrays empty at scaffold stage = warnings only (populated in EP4-P4). `mergeHomeFragrance(scaffold, ...results): HomeFragranceKnowledge` created in `scripts/factory/homeFragranceMerger.ts` — mirrors fragrance merger pattern, skips failed producers. `buildHomeFragranceDraft(record, validationResult): string` created in `scripts/factory/HomeFragranceDraftBuilder.ts` — pure render function, no file writes; dynamic variant key iteration for prices and images (never hardcodes "5ml"/"10ml"/"30ml"); imports `HomeFragranceKnowledge` not `FragranceKnowledge`. Validation script extended from 27 to 52 proofs covering validator positive and negative cases, merger behaviour, and 16 draft content checks. Fragrance pipeline unchanged. Build passes: 187 routes, 0 TypeScript errors, 0 warnings.

**EP4-P3A Home Fragrance Production Type Foundation (2026-08-07):** Truthful typed production contracts established for Home Fragrance knowledge. `HomeFragranceKnowledge` defined in `app/lib/mkc/homeFragranceTypes.ts` — structurally distinct from `FragranceKnowledge` by design; lacks `collection`, `gender`, `projection`, `scentCharacter`, `occasions`, fragrance intelligence metrics, and fragrance size contracts. `HomeFragranceScaffoldResult`, `HomeFragrancePipelineState` added to `scripts/factory/types.ts`. `HomeFragranceFactoryContext`, `HomeFragranceProducerResult` added to `scripts/factory/core/types.ts`. `HomeFragranceContextBuilder` created in `scripts/factory/core/HomeFragranceContextBuilder.ts`. `scaffoldHomeFragrance()` now returns `HomeFragranceScaffoldResult` (was `HomeFragranceScaffoldOutput`), populating discovery arrays as empty (AI-enriched in EP4-P4). Orchestrator updated: home-fragrance path branches before `ScaffoldRegistry`, calls `scaffoldHomeFragrance()` directly, then returns `"failed"` cleanly (no ProducerSet registered yet). ScaffoldRegistry home-fragrance registration removed (was dead code — the orchestrator never reached it). Validation script updated from 15 to 27 proofs including context, producer result, and structural separation proofs. Fragrance pipeline unchanged. Build passes: 187 routes, 0 TypeScript errors, 0 warnings.

**EP4-P2 Home Fragrance Foundation (2026-08-06):** First real second category introduced to the Knowledge Factory. `HomeFragranceIntake` defined in `scripts/factory/types.ts` with fields: `category: "home-fragrance"`, `productType`, `range`, `subtitle`, `mood`, `profile`, `season`, `notes`, `prices`, `images`, `bestSeller`, `newArrival`. `ProductIntake` expanded from a one-member union (`FragranceIntake`) to a proper two-member discriminated union (`FragranceIntake | HomeFragranceIntake`). Home fragrance catalogue loader registered in `defaultCatalogueRegistry` (returns null — no supplier catalogue yet). Home fragrance scaffolder registered in `defaultScaffoldRegistry` via new `scripts/factory/homeFragranceScaffold.ts`. No producer set registered for home-fragrance — intentional for EP4-P2. Running `npm run mkc:factory -- "<home-fragrance-slug>"` would now: resolve intake → resolve scaffold → throw "No ProducerSet registered for category: home-fragrance" before any AI generation. Fragrance pipeline unchanged. Type casts added in orchestrator, promotionManager for the `displayFrag: DisplayFragrance` contract (safe — registry invariant guarantees fragrance intake at that call site). Build passes: 187 routes, 0 TypeScript errors, 0 warnings.

**EP2-P7D Multi-Category Type Foundation (2026-08-06):** Smallest additive and reversible type foundation for future multi-category product growth. `ProductCategory` type introduced: "fragrance" | "body-care" | "personal-care" | "home-fragrance" | "bottles-packaging" | "accessories" | "lifestyle". `GuestAvailabilityStatus` type introduced: "online" | "on-request" | "coming-soon" | "seasonal" | "limited" — intentionally separate from internal lifecycle (status field). Both added as optional fields to `FragranceKnowledge`. `app/lib/mkc/productDefaults.ts` created with central resolver helpers `getProductCategory()` and `getGuestAvailabilityStatus()` — defaults defined in one place only ("fragrance" and "online"). `app/lib/mkc/validator.ts` updated to validate explicit values against governed vocabularies; absence remains valid (existing records unaffected). `KnowledgeSummary` interface and factory updated to expose resolved `category` and `availabilityStatus` via central helpers. All 93 native records unchanged. mkcCatalogue, all adapters, all URLs, all recommendations, all commerce behaviour unchanged. Selected long-term direction: Option B (Product Base + Category Knowledge Extensions); ProductRecord / FragranceProfile structural separation deferred to EP2-P7F. Build passes: 187 routes, 0 TypeScript errors, 0 warnings.

**EP2-P7C Commerce and Contact Truth Alignment (2026-08-06):** Three remaining misleading 465+ claims removed from trust-sensitive commerce and contact surfaces. Contact Details card "Catalogue: 465+ Luxury-Inspired Fragrances" row removed — the dedicated "Request Any Fragrance" section below already communicates the sourcing capability with full context; a bare count beside a phone number and location had none. WhyChooseUs feature card title "465+ Fragrances Available" → "Available by Request" — the supporting description ("Can't find your fragrance online? We can source it from our extended catalogue.") was preserved; the title now accurately names the access model. ProductDetail trust badge "✓ 465+ Signature Fragrances Available" → "✓ Carefully Curated Collection" — on the highest-trust surface in the commerce flow, guests deserved a signal about what they are actually buying into, not a sourcing count. All sourcing-specific copy on the Contact page, FAQ, and RequestFragrance component left intact. No application behaviour changes. Build passes: 187 routes, 0 TypeScript errors, 0 warnings.

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

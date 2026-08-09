# Current Task — Maison Skye & Rose

**Update this file at the start of every task.**
**Clear it when the task is complete.**

---

## Current Task

**Status:** COMPLETE — STOP
**Program:** EP5-P4B — Governed Identity-to-Product Bridge

**Outcome:**
Cross-domain bridge established between the Maison Identity Platform and
the Maison Product / Knowledge Catalogue. One approved mapping: MIP-000012
(Alien Goddess / Mugler) → `alien-goddess-inspired` (Rose collection).
6 of 7 verified identities correctly remain unmapped.

**Architectural corrections applied:**
1. Domain ownership: mapping is a BRIDGE between two domains, not core MIP
   identity truth. `identity-product-registry.json` stores references only —
   never duplicates canonical data from either domain.
2. Cardinality: one IdentityId → zero, one, or multiple Maison products
   (allowed). One Maison product slug → at most one IdentityId (invariant).
   `getMappingsForIdentity()` returns a readonly array, not a single value.

**Read API:**
- `getMappingsForIdentity(identityId)` — returns all mappings (1:many safe)
- `getIdentityForMaisonSlug(slug)` — returns IdentityId | null (1:1 invariant)

**Factory resolver:**
- `resolveIdentityProduct(identityId)` → `IdentityProductResolution`
- resolved: true → `{ mappings: [{ maisonSlug, collection }] }`
- resolved: false → `{ reason: "invalid-identity-id" | "no-mapping" }`
- Does NOT check eligibility — callers must first pass FactoryIdentityGate

**Seven verified identity association audit:**
- MIP-000001 (24 Faubourg / Hermès): ABSENT — no Hermès 24 Faubourg in catalogue
- MIP-000006 (À la rose / MFK): ABSENT — no MFK product in any collection
- MIP-000008 (Coconut Passion / Victoria's Secret): ABSENT — no VS product
- MIP-000009 (Capri In a Bottle Lemon Sugar | 14 / Kayali): ABSENT — Vanilla 28 is a different Kayali
- MIP-000012 (Alien Goddess / Mugler): MAPPED → alien-goddess-inspired (Rose)
- MIP-000013 (Boss Nuit Pour Femme / Hugo Boss): ABSENT — no Hugo Boss product
- MIP-000024 (Wanted by Night / Azzaro): ABSENT — "Azzaro Most Wanted Inspired" is a different product

**Files created:**
- `app/lib/identity/data/identity-product-registry.json` (NEW)
- `app/lib/identity/productMapping.ts` (NEW)
- `scripts/factory/identity/IdentityProductResolver.ts` (NEW)
- `scripts/identity/validate-identity-product-mapping.ts` (NEW)

**Files modified:**
- `package.json` — added `mip:validate:mapping` script

**Files explicitly unchanged:**
- `app/lib/identity/types.ts` — IdentityRecord stays pure
- `app/lib/identity/data/identity-registry.json` — byte-identical
- `app/lib/mkc/types.ts` — FragranceKnowledge stays pure
- `scripts/factory/types.ts` — IdentityAwareRunInput deferred to EP5-P4C
- `scripts/factory/identity/FactoryIdentityGate.ts` — unchanged
- All 94 native MKC records, all product data files, all admin/UI/route files

**All 7 suites pass (404 total proofs):**
- mip:validate:mapping — 29/29 (NEW)
- mip:validate:factory — 28/28
- mip:validate — 69/69
- mip:validate:admin — 54/54
- mip:validate:resolver — 85/85
- mip:validate:source:2026 — 39/39
- mip:validate:editorial — 100/100

**Registry SHA-256 (unchanged):**
c75f74b56d4c2064b4f00e422c26e454343defc6a8c61df288e4fe8c2c650a1d

**Registry state (unchanged):**
26 total / 7 verified / 3 pending-review / 16 candidate

**Build:** 188 routes, 0 TypeScript errors, 0 warnings

**AI/API calls:** 0 Claude / 0 Gemini / 0 OpenAI / 0 GenerationProvider

**Commit:** 6e68044

---

## Next Human Action

**EP5-P4C — Wire Identity Bridge into Factory Intake Pipeline**

The bridge now exists. EP5-P4C may introduce `IdentityAwareRunInput`
(carrying both `identityId` and `maisonSlug`) and wire it through:
  1. FactoryIdentityGate.checkIdentityEligibility(identityId)
  2. IdentityProductResolver.resolveIdentityProduct(identityId)
  3. intake() → factory pipeline with identity context

Only after EP5-P4C is approved and implemented may a factory run carry
institutional identity context.

---

## Context Notes

**Last completed:** EP5-P4B — Governed Identity-to-Product Bridge (2026-08-09)
**Preceded by:**    EP5-P4A — Identity-Aware Factory Intake Foundation (2026-08-09)

Recent completed programs (newest first):
- EP5-P4B Governed Identity-to-Product Bridge (2026-08-09) — 1 mapping, 6 absent, 29 proofs
- EP5-P4A Identity-Aware Factory Intake Foundation (2026-08-09) — gate only, missing bridge reported
- EP5-P3D First Editorial Identity Verification Campaign (2026-08-09) — 7 verified by founder, 0 AI decisions
- EP5-P3C Establish Identity Review Admin Interface (2026-08-09) — 54 proofs, 0 AI, 0 registry writes
- EP5-P3B Editorial Transaction Service (2026-08-08) — 100 proofs, 0 AI, 0 registry writes
- EP5-P3A Editorial Review Architecture Audit (2026-08-08) — design audit only
- EP5-P2C Registry Write (2026-08-08) — 26 identities, 0 AI, 0 factory operations

---

## Build Result

**Last build:** 2026-08-09 — Pass. Zero TypeScript errors. Zero warnings. 188 routes. (EP5-P4B)

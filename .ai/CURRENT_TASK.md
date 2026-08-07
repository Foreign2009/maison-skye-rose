# Current Task — Maison Skye & Rose

**Update this file at the start of every task.**
**Clear it when the task is complete.**

---

## Current Task

**Status:** COMPLETE — awaiting EP5-P2C specification
**Program:** EP5-P2B — Establish Deterministic Identity Resolver

**Goal:**
Build the deterministic, explainable Identity Resolver — a 5-stage read-only pipeline
that scores supplier names against the Identity Registry and returns a full explanation
of every resolution decision. The Resolver reads, scores, explains, and returns.
It does NOT: create identities, modify identities, write evidence, persist results,
call AI, change MKC, or change factory state.

**Completed:**
- `app/lib/identity/resolver/types.ts` — All type contracts: `ResolutionInput` (required `category`),
  `ResolutionStatus`, `ResolutionStrategy`, `ResolutionSignalType`, `ResolutionSignal`,
  `IdentityProjection` (safe read-only projection), `CandidateMatch`, `ResolutionResult`
  (no `resolvedAt` — purity guarantee), `IdentityResolver` interface
- `app/lib/identity/resolver/tokenizer.ts` — Conservative `STOP_WORDS` set + `tokenize()` function
- `app/lib/identity/resolver/suffixStripper.ts` — `strip()` with only `" Inspired"` and `" Inspired By"`
- `app/lib/identity/resolver/tokenScorer.ts` — `scoreTokens()` with Jaccard + brand + digit guard;
  `buildTokenSet()`; `hasMeaningfulMismatch` + `hasDigitConflict` flags
- `app/lib/identity/resolver/DeterministicIdentityResolver.ts` — Full 5-stage pipeline;
  AMBIGUITY_MARGIN=15, CANDIDATE_THRESHOLD=35, TOKEN_RESOLVE_THRESHOLD=55
- `app/lib/identity/resolver/index.ts` — Barrel export of all resolver public API
- `scripts/identity/validate-identity-resolver.ts` — 85 deterministic proofs across 9 sections
- `package.json` — `mip:validate:resolver` script added

**Validation:**
- EP5-P2B: 85/85 proofs pass
- EP5-P1 regression: 69/69 proofs pass
- Build: 187 routes, 0 TypeScript errors, 0 warnings

---

## Next Human Action

EP5-P2C — Identity Resolver Wiring / Supplier Intake Pipeline.

The resolver is proven and deterministic. The next episode connects real supplier
data (the 26 researched 2026 new arrivals) through the resolver to produce
editoral resolution candidates for human review.

EP5-P2C requires a separate specification and engineering approval before
implementation begins.

---

## Context Notes

**Last completed:** EP5-P2B — Establish Deterministic Identity Resolver (2026-08-07)
**Preceded by:**    EP5-P2A — Identity Resolution Architecture Audit (2026-08-07)

Recent completed programs (newest first):
- EP5-P2B Deterministic Identity Resolver (2026-08-07) — 85 proofs, 0 AI, 0 factory changes, 0 MKC changes
- EP5-P2A Identity Resolution Architecture Audit (2026-08-07) — Text-only design document, 34 deliverables
- EP5-P1 Identity Platform Foundation (2026-08-07) — 69 proofs, 0 factory changes, 0 MKC changes
- EP4-P3D Controlled Home Fragrance Generation (2026-08-07) — infrastructure, APPROVED_INTAKE=null

---

## Build Result

**Last build:** 2026-08-07 — Pass. Zero TypeScript errors. Zero warnings. 187 routes. (EP5-P2B)

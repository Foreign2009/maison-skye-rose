# Current Task — Maison Skye & Rose

**Update this file at the start of every task.**
**Clear it when the task is complete.**

---

## Current Task

**Status:** CANONICAL SAFETY HARDENED — STOP (awaiting real ingestion authorisation)
**Program:** EP5-P2C-R — Protect Candidate Canonical Identity

**Goal:**
Before the first registry write, harden the ingestion engine so that ambiguous/multi-option
research proposals are never written to `CanonicalIdentity.canonicalName`. Instead fall back
to the supplier name as provisional. Preserve original research proposals in evidence and
editorial output.

**Corrections delivered (EP5-P2C-R):**

1. **Source files populated** — Both Mid-Year 2026 source files populated with founder-supplied
   evidence: 31 supplier rows (26 unique + 5 L/M pairs) and 26 Gemini research entries.

2. **isCleanCanonicalProposal()** — New deterministic guard in `sourceValidation.ts`. Rejects
   `" / "` (multi-option separator), `"(Note:"` (research annotation), and parentheticals
   containing `\bunverified\b`. Permits apostrophes, hyphens, pipes, numbers, accented chars.

3. **Provisional canonical name** — When research proposal is absent OR rejected as ambiguous,
   `primaryEntry.supplierName` is used as the provisional `canonicalName`.

4. **researchCanonicalProposal field** — New field on `CandidateIngestionResult` and
   `EditorialReviewEntry`. Carries the original Gemini proposal even when rejected, enabling
   editorial reviewers to see both the registry value and the raw research string.

5. **Evidence preservation** — `observedValue` captures `research.canonicalName` verbatim.
   Rejected proposals add an `ambiguousNote` to the evidence `notes` field.

6. **39-proof validation suite** — `validate-2026-identity-source.ts` extended from 26 to 39
   proofs. Section 7 (proofs 701–713) covers all isCleanCanonicalProposal contract cases.

**Four previously risky records — canonical names after correction:**
- DKNY Red Delicious Apple → `"DKNY Red Delicious Apple"` (provisional, Category B retained)
- 212 Carolina Herrera Good Girl Jasmine Absolute → `"212 Carolina Herrera Good Girl Jasmine Absolute"` (provisional)
- Armani Prive Oud Nacre → `"Armani Prive Oud Nacre"` (provisional)
- Armani Stronger With You Powerfully → `"Armani Stronger With You Powerfully"` (provisional)

**New/modified files:**
- `scripts/identity/ingestion/sourceValidation.ts` — `isCleanCanonicalProposal` added
- `scripts/identity/ingestion/types.ts` — `researchCanonicalProposal` field added
- `scripts/identity/ingest-2026-new-arrivals.ts` — canonical resolution + evidence updated
- `scripts/identity/validate-2026-identity-source.ts` — Section 7 (proofs 701–713) added
- `data/identity/source/mid-year-2026-supplier.json` — POPULATED with 31 rows
- `data/identity/source/mid-year-2026-research.json` — POPULATED with 26 research entries

**Validation:**
- `npm run mip:validate` → 69/69 ✓
- `npm run mip:validate:resolver` → 85/85 ✓
- `npm run mip:validate:source:2026` → 39/39 ✓
- `npm run mip:ingest:2026:dry` → 17/17 validations passed ✓
- `npm run build` → 187 routes, 0 TypeScript errors, 0 warnings ✓
- Registry: 0 identities (dry run confirmed — no writes occurred) ✓
- NO AI called. NO registry populated.

---

## Next Human Action

Authorise the real ingestion:

   npm run mip:ingest:2026

This will write 26 identity candidates to the registry (10 pending-review, 16 candidate).

**Prerequisite:** Review the four provisional canonical records in the editorial batch before
authorising. These require human resolution before they can be verified:
- DKNY Red Delicious Apple (Category B, pending-review)
- 212 Carolina Herrera Good Girl Jasmine Absolute (Category C, candidate)
- Armani Prive Oud Nacre (Category C, candidate)
- Armani Stronger With You Powerfully (Category C, candidate)

---

## Context Notes

**Last completed:** EP5-P2C-R — Protect Candidate Canonical Identity (2026-08-08)
**Preceded by:**    EP5-P2CR — Harden Identity Ingestion Source Contracts (2026-08-08)

Recent completed programs (newest first):
- EP5-P2C-R Canonical Safety Correction (2026-08-08) — 39 proofs, 0 AI, 0 registry writes
- EP5-P2CR Source Contract Hardening (2026-08-08) — 26 proofs, 0 AI, 0 registry writes
- EP5-P2C Ingestion Infrastructure (2026-08-08) — infrastructure only, source data absent, NO write
- EP5-P2B Deterministic Identity Resolver (2026-08-07) — 85 proofs, 0 AI, 0 factory changes
- EP5-P2A Identity Resolution Architecture Audit (2026-08-07) — design document, 34 deliverables
- EP5-P1 Identity Platform Foundation (2026-08-07) — 69 proofs, 0 factory changes, 0 MKC changes

---

## Build Result

**Last build:** 2026-08-08 — Pass. Zero TypeScript errors. Zero warnings. 187 routes. (EP5-P2C-R)

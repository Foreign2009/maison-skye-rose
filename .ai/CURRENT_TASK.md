# Current Task — Maison Skye & Rose

**Update this file at the start of every task.**
**Clear it when the task is complete.**

---

## Current Task

**Status:** STOPPED — awaiting founder product specification
**Program:** EP4-P3D — Controlled Home Fragrance Generation

**Goal:**
Execute the FIRST controlled real Home Fragrance AI generation for exactly one
founder-approved product. One draft. No promotion. Stop for human review.

**Current Status:**
Infrastructure is prepared. No AI call has been made. No product specification
exists in the repository. The controlled runner (`APPROVED_INTAKE = null`)
correctly stops and reports the required fields.

**Next Human Action Required:**
The founder must provide the product specification for the first Home Fragrance
product to be AI-generated. Fill in the `APPROVED_INTAKE` constant in:

  `scripts/factory/run-home-fragrance-controlled.ts`

Then re-run:

  `npm run mkc:home-fragrance:controlled`

**Required Product Fields:**
- category: "home-fragrance" (fixed)
- productType: "candle" | "diffuser" | "room-spray"
- range: string (e.g. "Maison Home")
- title: string (exact product name)
- subtitle: string (2–6 word positioning line)
- mood: string (ambient room atmosphere — no personal-wear language)
- profile: string (olfactory family)
- season: string (seasonal context)
- notes: string[] (2–5 seed scent notes, Title Case, specific names)
- prices: Record<string, number> (home fragrance size keys, e.g. {"150g": 299})
- images: Record<string, string> (image paths per size variant)
- bestSeller: boolean
- newArrival: boolean

---

## Acceptance Criteria (EP4-P3D — when product is approved)

- [ ] Founder-approved HomeFragranceIntake set in APPROVED_INTAKE
- [ ] 123 deterministic proofs pass before generation
- [ ] Build passes before generation
- [ ] ANTHROPIC_API_KEY set in environment
- [ ] Composition producer succeeds (status: "success")
- [ ] Notes pyramid: 2–4 per tier, no cross-tier duplicates
- [ ] Editorial producer succeeds (status: "success")
- [ ] Final validation: 0 errors
- [ ] Exactly one draft written to scripts/factory/drafts/home-fragrance/<slug>.ts
- [ ] No promotion
- [ ] No native write
- [ ] No guest-facing change
- [ ] Human review report produced
- [ ] Deterministic proofs pass after generation
- [ ] Build passes after generation
- [ ] Human review questions answered by founder

---

## Files Involved (EP4-P3D infrastructure — completed)

**Files created (2):**
- `scripts/factory/run-home-fragrance-controlled.ts` — controlled generation entry point
- `scripts/factory/drafts/home-fragrance/.gitkeep` — category-specific draft directory

**Files modified (3):**
- `scripts/factory/HomeFragranceDraftBuilder.ts` — added optional `importBase` param (backward-compatible)
- `package.json` — added `mkc:home-fragrance:controlled` script
- Governance files

---

## Context Notes

**Last completed:** EP4-P3CR — Home Fragrance Producer Safety Hardening (2026-08-07)

Recent completed programs (newest first):
- EP4-P3D Controlled Home Fragrance Generation (2026-08-07) — infrastructure complete, awaiting founder product
- EP4-P3CR Home Fragrance Producer Safety Hardening (2026-08-07) — 4 safety issues + registry; 123 proofs pass
- EP4-P3C Home Fragrance Producer Foundation (2026-08-07) — Composition + Editorial producers; 109 proofs pass

---

## Build Result

**Last build:** 2026-08-07 — Pass. Zero TypeScript errors. Zero warnings. 187 routes. (EP4-P3D infrastructure)

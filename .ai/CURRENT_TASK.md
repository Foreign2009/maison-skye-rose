# Current Task — Maison Skye & Rose

**Update this file at the start of every task.**
**Clear it when the task is complete.**

---

## Current Task

**Status:** COMPLETE — STOP
**Program:** EP6-P3 — Catalogue Performance-Claim Remediation

**Outcome:**
All performance claims and retired vocabulary eliminated from the live catalogue and
infrastructure. "Rich & Long Wearing" scentCharacter retired; "Rich & Full-Bodied"
established as its replacement across all 47 affected records and all infrastructure
files. 23 P0 HIGH policy violations corrected (educationTag removals + free-text
corrections). 3 P2 MEDIUM policy violations corrected. 3 infrastructure files
remediated (merchandising.ts, MaisonCompanion.tsx, wardrobeAnalyser.ts) plus
academy/catalogue.ts. 22 infrastructure/component files updated for the scentCharacter
rename. EP6-P1 and EP6-P2 audit artifacts regenerated. EP6-P1 and EP6-P2 validator
assertions updated. EP6-P3 validation suite (56 proofs) created and passing. Build
clean: 188 routes, 0 TypeScript errors, 0 warnings. All 7 protected SHAs verified
unchanged. 15 validation suites passing.

**What was done:**

1. **Type system migration** — `app/lib/mkc/types.ts` and `app/data/types.ts`:
   union type `"Rich & Long Wearing"` → `"Rich & Full-Bodied"`.
   `tsconfig.json`: `scripts/factory/drafts/**` added to exclude (factory drafts are
   protected historical artifacts — cannot be modified, so excluded from TypeScript
   compilation to prevent spurious errors).

2. **47 native record scentCharacter migration** — PowerShell batch:
   all `.ts` files in `app/lib/mkc/native/` with `scentCharacter: "Rich & Long Wearing"`
   updated to `scentCharacter: "Rich & Full-Bodied"`.

3. **P0 educationTag removal (19 records)** — pattern `    "long-wearing",\r?\n`
   removed from all applicable native files.

4. **P0 + P2 free-text corrections (12 records):**
   - `blanche-bete-inspired.ts`: "long-wearing scents" → "full-bodied scents"
   - `flowerbomb-inspired.ts`: "a long-wearing fragrance" → "a rich fragrance"
   - `la-vie-est-belle-inspired.ts`: "a long-wearing fragrance" → "a rich fragrance"
   - `libre-inspired.ts`: "a rich, long-wearing floral" → "a rich floral"
   - `libre-le-parfum-inspired.ts`: "a long-wearing fragrance" → "a rich fragrance"
   - `rolling-in-love-inspired.ts`: "a long-wearing fragrance" → "a rich fragrance"
   - `valentino-donna-born-in-roma-inspired.ts`: "long-wearing elegance..." → "rich, evolving elegance..."
   - `kayali-vanilla-28-inspired.ts`: "a sensual, long-wearing fragrance" → "a sensual, rich fragrance"
   - `burberry-goddess-inspired.ts`: "with depth that lasts all day" → "with a rich sense of depth"
   - `eros-inspired.ts` (P2 mood): "night-out energy in an all-day package" → "night-out energy with versatile character"
   - `armani-code-parfum-inspired.ts` (P2 recommendedFor): "for all day" → "for versatile daytime wear"
   - `y-edp-inspired.ts` (P2 signatureStyle): "All-Day Signature" → "Day-to-Evening Signature"

5. **Infrastructure files updated (22 files):**
   - `app/lib/mkc/validator.ts` — validCharacters array
   - `app/lib/mkc/merchandising.ts` — key rename + description corrected
   - `app/lib/mkc/wardrobeEngine.ts` — key rename + description
   - `app/lib/concierge/wardrobeAnalyser.ts` — ALL_CHARACTERS + CHARACTER_OPPORTUNITY + logic
   - `app/components/MaisonCompanion.tsx` — CHARACTER_OBSERVATIONS (founder-approved text)
   - `app/lib/academy/catalogue.ts` — caption corrected
   - `app/lib/intentParser.ts` — union + CharacterRule + CHARACTER_RULES (replace_all)
   - `app/lib/concierge/collectionPlanner.ts` — TYPE_CHARACTER_SEQUENCES + ROLE_TEMPLATES + CONTEXT_ROLE_OVERRIDES (replace_all)
   - `app/lib/concierge/consultationTracker.ts` — EXPLORATION_CHARACTER + DISCOVERY_TITLES + CHARACTER_SIGNALS (replace_all)
   - `app/lib/knowledgeAdapter.ts` — comment + return value
   - `app/components/ProductCard.tsx` — replace_all
   - `app/components/CharacterJourneyProfile.tsx` — replace_all
   - `app/components/ComparisonView.tsx` — replace_all
   - `app/components/FragranceWardrobe.tsx` — replace_all
   - `app/components/discover/DiscoveryIntelligenceSection.tsx` — replace_all
   - `app/discover/character-journey/page.tsx` — replace_all
   - `app/discover/page.tsx` — replace_all
   - `app/shop/page.tsx` — replace_all
   - `app/quiz/page.tsx` — replace_all
   - `app/lib/mkc/templates/fragrance-template.ts` — replace_all
   - `app/lib/discovery/collectionEngine.ts` — replace_all
   - `docs/mkc-authoring-guide.md` — vocabulary table + Skye section + Rose section

6. **EP6-P2 remediation queue service updated:**
   - `scripts/identity/catalogueRemediationQueue.ts` — SCENT_CHARACTER_POLICY updated:
     "Rich & Full-Bodied": SAFE (replaces "Rich & Long Wearing": REVIEW)
   - SCENT_CHARACTER_VALUES updated

7. **EP6-P1 audit service updated:**
   - `scripts/identity/catalogueKnowledgeIntegrityAudit.ts` — comment corrected

8. **Audit artifacts regenerated:**
   - `app/lib/identity/data/audits/catalogue-knowledge-integrity-audit.json` (EP6-P1)
   - `app/lib/identity/data/audits/catalogue-remediation-queue.json` (EP6-P2)

9. **EP6-P1 validator updated (5 proofs):**
   - 501: 0 records with policyFindings
   - 503: 0 HIGH-severity policy findings
   - 504: althair has 0 policy findings
   - 509: recordsWithPolicyFindings is 0
   - 602: 0 records with riskLevel HIGH

10. **EP6-P2 validator updated (13 proofs):**
    - P0=0, P2=0, P3=89, P4=3 (side-effect, armani-code-parfum, eros)
    - "Rich & Long Wearing" REVIEW → "Rich & Full-Bodied" SAFE
    - recordsRequiringFounderDecision=0, REVIEW count=0, etc.

11. **EP6-P3 validation suite created:**
    `scripts/identity/validate-catalogue-performance-remediation.ts` — 56 proofs:
    - § 100 — Vocabulary Retirement (proofs 101–110)
    - § 200 — Performance Debt Elimination (proofs 201–210)
    - § 300 — Infrastructure Remediation (proofs 301–308)
    - § 400 — Protected Field Preservation (proofs 401–406)
    - § 500 — Protected SHA Verification (proofs 501–507)
    - § 600 — Relationship Graph Integrity (proofs 601–605)
    - § 700 — Governance Invariants (proofs 701–705)
    - § 800 — Historical Provenance (proofs 801–805)

12. **npm script added:**
    `mip:validate:catalogue-performance-remediation`

**Files Created:**
- `scripts/identity/validate-catalogue-performance-remediation.ts` — 56-proof EP6-P3 suite

**Files Modified (beyond native records):**
- `tsconfig.json` — factory drafts exclusion
- `app/lib/mkc/types.ts` — union type
- `app/data/types.ts` — union type
- `app/lib/mkc/validator.ts` — validCharacters
- `app/lib/mkc/merchandising.ts` — key rename + description
- `app/lib/mkc/wardrobeEngine.ts` — key rename + description
- `app/lib/concierge/wardrobeAnalyser.ts` — ALL_CHARACTERS + logic
- `app/components/MaisonCompanion.tsx` — CHARACTER_OBSERVATIONS
- `app/lib/academy/catalogue.ts` — caption
- `app/lib/intentParser.ts` — all 3 occurrences
- `app/lib/concierge/collectionPlanner.ts` — all 7 occurrences
- `app/lib/concierge/consultationTracker.ts` — all 5 occurrences
- `app/lib/knowledgeAdapter.ts` — comment + return
- `app/components/ProductCard.tsx`
- `app/components/CharacterJourneyProfile.tsx`
- `app/components/ComparisonView.tsx`
- `app/components/FragranceWardrobe.tsx`
- `app/components/discover/DiscoveryIntelligenceSection.tsx`
- `app/discover/character-journey/page.tsx`
- `app/discover/page.tsx`
- `app/shop/page.tsx`
- `app/quiz/page.tsx`
- `app/lib/mkc/templates/fragrance-template.ts`
- `app/lib/discovery/collectionEngine.ts`
- `docs/mkc-authoring-guide.md`
- `scripts/identity/catalogueRemediationQueue.ts`
- `scripts/identity/catalogueKnowledgeIntegrityAudit.ts`
- `app/lib/identity/data/audits/catalogue-knowledge-integrity-audit.json`
- `app/lib/identity/data/audits/catalogue-remediation-queue.json`
- `scripts/identity/validate-catalogue-knowledge-integrity-audit.ts` — 5 proofs updated
- `scripts/identity/validate-catalogue-remediation-queue.ts` — 13 proofs updated
- `package.json` — 1 new script

**Native records modified (47 scentCharacter + 26 additional corrections):**
73 native records in `app/lib/mkc/native/` modified. Factory drafts NOT modified.

**Protected Artifact SHAs (unchanged — verified by § 500 and manual SHA check):**
- `app/lib/mkc/native/alien-goddess-inspired.ts` — 6799eb768a6a5e9166244be866316b802e7009719dd123d27ea8bf73a89be8bd
- `scripts/factory/drafts/alien-goddess-inspired.ts` — 700593b7fd98cf8339491b74a7f2c6732badb2581ac268636a59c471b7e1cee7
- `scripts/factory/factory-log.json` — bd825643a2cafdd1adb4a82bfebd4e48465844315e78d039811950820570e33e
- `app/lib/identity/data/identity-registry.json` — c75f74b56d4c2064b4f00e422c26e454343defc6a8c61df288e4fe8c2c650a1d
- `app/lib/identity/data/identity-product-registry.json` — 6d064d2b471bb0ff8da58e2cb5dd27d69bf70980e19ddd3041298e2eb8a5af0b
- `scripts/factory/identity/identity-qualified-run-audit.json` — bd3e1f227a35f5929e0474516bafd3d5a7e9d460b923659f2fdf27be0a817353
- `data/identity/research-results/MIP-000012-alien-goddess-authoritative-results.json` — 741787b194abb320609ab3fd83ed4c15daead2fe11c8bf760364ae60d033a5e4

**Security Invariants:**
- APPROVED_IDENTITY_ID = null (confirmed by proof 701)
- FORCE = false (confirmed by proof 702)
- 0 knowledge composition fields modified
- 0 AI generation calls
- 0 registry mutations (confirmed by proofs 703–705)
- 0 MIPRUN triggers
- 0 research campaigns
- 0 factory draft modifications (confirmed by proofs 801–805)
- 0 fragrance family/notes/accords/relationships modified

**Validation Results:**
- mip:validate:catalogue-performance-remediation — 56/56 (new)
- mip:validate:catalogue-remediation — 75/75
- mip:validate:catalogue-integrity — 73/73
- mip:validate:r2 — 30/30
- mip:validate:research — 75/75
- mip:validate:reconciliation — 40/40
- mip:validate:qualified-audit — 61/61
- mip:validate:qualified-factory — 51/51
- mip:validate:mapping — 29/29
- mip:validate:factory — 28/28
- mip:validate — 69/69
- mip:validate:admin — 54/54
- mip:validate:resolver — 85/85
- mip:validate:source:2026 — 39/39
- mip:validate:editorial — 100/100
- **Total: 865/865 proofs passing (809 existing + 56 new)**

**Build:** 188 routes, 0 TypeScript errors, 0 warnings

---

## Context Notes

**Last completed:** EP6-P3 — Catalogue Performance-Claim Remediation (2026-08-10)
**Preceded by:**    EP6-P2 — Catalogue Remediation Queue (2026-08-10)
**Preceded by:**    EP6-P1 — Catalogue Knowledge Integrity Audit (2026-08-10)

---

## Build Result

**Last build:** 2026-08-10 — Pass. Zero TypeScript errors. Zero warnings. 188 routes. (EP6-P3)

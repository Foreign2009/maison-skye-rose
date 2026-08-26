/**
 * Wave 4 Research Governance — Validation Script
 *
 * EP-CAT-P18C: verifies Wave 4 research evidence governance state.
 * Validates wave-4-2026-research.json only — NO generated drafts required
 * because factory generation has not occurred yet for Wave 4.
 *
 * Run: npx tsx scripts/factory/data/validate-wave-4.ts
 *
 * Does NOT call any AI provider. Does NOT generate any drafts.
 * Does NOT modify any files. Read-only validation only.
 *
 * Current governance state (P18C_R1_PASS_WAVE4_20_OF_20_EVIDENCE_LOCKED):
 *   - 20 entries total (ROSE=7, SKYE=7, ELITE=6)
 *   - 20 READY entries (all Founder decisions resolved in EP-CAT-P18C-R1)
 *   - 0 FOUNDER_DECISION_REQUIRED
 *   - 0 BRAND_NARRATIVE_ONLY
 *   - 1 UNORDERED_GOVERNED_NOTES entry: Jo Malone Beach Blossom (heartNotes only)
 *   - OUD_GAP_PROVEN_HIGH: Maison Crivelli Oud Cadenza — Agarwood confirmed (Fragrantica + Harrods, HIGH)
 *   - ASSORTMENT_GAP_MISMATCH_INFORMATIONAL: Creed Delphinus Oriental Floral — Founder RETAIN
 *   - Gucci Flora: Founder confirmed Option B — Flora Gorgeous Gardenia EDP 2021
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

// ── Test harness ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (err) {
    const msg = err instanceof assert.AssertionError
      ? err.message
      : String(err);
    console.error(`  ✗  ${name}\n     ${msg}`);
    failed++;
  }
}

// ── Load research manifest ────────────────────────────────────────────────────

interface ResearchEntry {
  _collection: string;
  _sourceKey: string;
  supplierName: string;
  evidenceStatus: string;
  researchRequired: boolean;
  canonicalName: string | null;
  brand: string | null;
  launchYear: number | null;
  concentration: string | null;
  marketedGender: string | null;
  fragranceFamily: string | null;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  perfumer: string | null;
  sourceConfidence: string | null;
  evidenceSources: string[];
  proposedSlug: string;
  possibleNameIssue: boolean;
}

const researchPath = path.resolve(process.cwd(), "data/identity/source/wave-4-2026-research.json");
const raw = JSON.parse(readFileSync(researchPath, "utf-8")) as {
  batchId: string;
  governance: {
    specialGovernanceFlags: Record<string, string>;
    catalogueSubtitleCorrections: string[];
  };
  entries: ResearchEntry[];
};

const entries = raw.entries;

// ── Helper: find entry by sourceKey prefix ────────────────────────────────────

function find(keyPrefix: string): ResearchEntry {
  const entry = entries.find(e => e._sourceKey.startsWith(keyPrefix) || e._sourceKey === keyPrefix);
  if (!entry) throw new Error(`Entry with sourceKey prefix "${keyPrefix}" not found`);
  return entry;
}

// ── Section 1: Structure and counts ──────────────────────────────────────────

console.log("\n  Wave 4 Research Governance Validator\n  EP-CAT-P18C-R1\n");
console.log("  ─── Section 1: Structure and counts ───\n");

test("W4-V1 — batchId is wave-4-2026", () => {
  assert.equal(raw.batchId, "wave-4-2026", "batchId must be 'wave-4-2026'");
});

test("W4-V2 — entries array contains exactly 20 records", () => {
  assert.equal(entries.length, 20, `Expected 20 entries, got ${entries.length}`);
});

test("W4-V3 — ROSE collection has exactly 7 entries", () => {
  const rose = entries.filter(e => e._collection === "ROSE");
  assert.equal(rose.length, 7, `Expected 7 ROSE entries, got ${rose.length}`);
});

test("W4-V4 — SKYE collection has exactly 7 entries", () => {
  const skye = entries.filter(e => e._collection === "SKYE");
  assert.equal(skye.length, 7, `Expected 7 SKYE entries, got ${skye.length}`);
});

test("W4-V5 — ELITE collection has exactly 6 entries", () => {
  const elite = entries.filter(e => e._collection === "ELITE");
  assert.equal(elite.length, 6, `Expected 6 ELITE entries, got ${elite.length}`);
});

// ── Section 2: Evidence status distribution ───────────────────────────────────

console.log("\n  ─── Section 2: Evidence status distribution ───\n");

test("W4-V6 — 20 entries have evidenceStatus READY (all Founder decisions resolved R1)", () => {
  const ready = entries.filter(e => e.evidenceStatus === "READY");
  assert.equal(ready.length, 20, `Expected 20 READY entries, got ${ready.length}`);
});

test("W4-V7 — 0 FOUNDER_DECISION_REQUIRED entries (all resolved in EP-CAT-P18C-R1)", () => {
  const fdr = entries.filter(e => e.evidenceStatus === "FOUNDER_DECISION_REQUIRED");
  assert.equal(fdr.length, 0, `Expected 0 FOUNDER_DECISION_REQUIRED entries (all resolved in R1), got ${fdr.length}`);
});

test("W4-V8 — 0 entries have evidenceStatus BRAND_NARRATIVE_ONLY", () => {
  const bno = entries.filter(e => e.evidenceStatus === "BRAND_NARRATIVE_ONLY");
  assert.equal(bno.length, 0, `Expected 0 BRAND_NARRATIVE_ONLY entries, got ${bno.length}`);
});

test("W4-V9 — 0 entries have evidenceStatus BLOCKED", () => {
  const blocked = entries.filter(e => e.evidenceStatus === "BLOCKED");
  assert.equal(blocked.length, 0, `Expected 0 BLOCKED entries, got ${blocked.length}`);
});

// ── Section 3: Gucci Flora Gorgeous Gardenia resolution (R1) ─────────────────

console.log("\n  ─── Section 3: Gucci Flora Gorgeous Gardenia resolution (R1) ───\n");

test("W4-V10 — Gucci Flora researchRequired is false (Founder Option B applied R1)", () => {
  const entry = find("LADIES-127");
  assert.equal(entry.researchRequired, false,
    "Gucci Flora must have researchRequired: false — Founder confirmed Option B in R1");
});

test("W4-V11 — Gucci Flora canonicalName is 'Flora Gorgeous Gardenia' (Founder Option B R1)", () => {
  const entry = find("LADIES-127");
  assert.equal(entry.canonicalName, "Flora Gorgeous Gardenia",
    `Gucci Flora canonicalName must be 'Flora Gorgeous Gardenia' (Founder Option B), got '${entry.canonicalName}'`);
});

test("W4-V12 — Gucci Flora notes populated — Flora Gorgeous Gardenia composition (R1)", () => {
  const entry = find("LADIES-127");
  assert.ok(entry.topNotes.length > 0,
    "Gucci Flora topNotes must be populated (Founder Option B resolved)");
  assert.ok(entry.heartNotes.includes("Gardenia"),
    "Gucci Flora heartNotes must include 'Gardenia' (canonical Flora Gorgeous Gardenia note)");
  assert.ok(entry.baseNotes.includes("Brown Sugar"),
    "Gucci Flora baseNotes must include 'Brown Sugar' (canonical Flora Gorgeous Gardenia base)");
});

// ── Section 4: Notes population for READY entries ─────────────────────────────

console.log("\n  ─── Section 4: Notes population ───\n");

const UNORDERED_KEYS = new Set([
  "UNISEX-59-Jo Malone Beach Blossom",
]);

test("W4-V13 — all READY ordered-pyramid entries have non-empty topNotes", () => {
  const ordered = entries.filter(e =>
    e.evidenceStatus === "READY" && !UNORDERED_KEYS.has(e._sourceKey),
  );
  const missing = ordered.filter(e => e.topNotes.length === 0);
  assert.equal(missing.length, 0,
    `${missing.length} READY ordered entries have empty topNotes: ${missing.map(e => e._sourceKey).join(", ")}`);
});

test("W4-V14 — all READY entries have non-empty heartNotes", () => {
  const ready = entries.filter(e => e.evidenceStatus === "READY");
  const missing = ready.filter(e => e.heartNotes.length === 0);
  assert.equal(missing.length, 0,
    `${missing.length} READY entries have empty heartNotes: ${missing.map(e => e._sourceKey).join(", ")}`);
});

test("W4-V15 — all READY ordered-pyramid entries have non-empty baseNotes", () => {
  const ordered = entries.filter(e =>
    e.evidenceStatus === "READY" && !UNORDERED_KEYS.has(e._sourceKey),
  );
  const missing = ordered.filter(e => e.baseNotes.length === 0);
  assert.equal(missing.length, 0,
    `${missing.length} READY ordered entries have empty baseNotes: ${missing.map(e => e._sourceKey).join(", ")}`);
});

// ── Section 5: UNORDERED_GOVERNED_NOTES — Jo Malone Beach Blossom ─────────────

console.log("\n  ─── Section 5: UNORDERED_GOVERNED_NOTES governance ───\n");

test("W4-V16 — Beach Blossom has empty top and base (UNORDERED Jo Malone pattern)", () => {
  const entry = find("UNISEX-59");
  assert.deepEqual(entry.topNotes, [], "Beach Blossom topNotes must be empty [] (Jo Malone UNORDERED)");
  assert.deepEqual(entry.baseNotes, [], "Beach Blossom baseNotes must be empty [] (Jo Malone UNORDERED)");
});

test("W4-V17 — Beach Blossom heartNotes has exactly 4 governed notes", () => {
  const entry = find("UNISEX-59");
  assert.equal(entry.heartNotes.length, 4,
    `Beach Blossom heartNotes must have 4 notes, got ${entry.heartNotes.length}: [${entry.heartNotes.join(", ")}]`);
});

test("W4-V18 — Beach Blossom heartNotes contains Coconut Water (canonical Jo Malone note)", () => {
  const entry = find("UNISEX-59");
  assert.ok(entry.heartNotes.includes("Coconut Water"),
    "Beach Blossom must include 'Coconut Water' in heartNotes (key Jo Malone brand note)");
});

// ── Section 6: OUD CADENZA special governance ─────────────────────────────────

console.log("\n  ─── Section 6: Oud Cadenza Oud-gap governance ───\n");

test("W4-V19 — Oud Cadenza evidenceStatus is READY", () => {
  const entry = find("UNISEX-82");
  assert.equal(entry.evidenceStatus, "READY",
    `Oud Cadenza must be READY, got '${entry.evidenceStatus}'`);
});

test("W4-V20 — Oud Cadenza heartNotes contains 'Agarwood (Oud)' (OUD_GAP_PROVEN)", () => {
  const entry = find("UNISEX-82");
  const hasOud = entry.heartNotes.some(n =>
    n.toLowerCase().includes("agarwood") || n.toLowerCase().includes("oud")
  );
  assert.ok(hasOud,
    `Oud Cadenza heartNotes must contain Agarwood/Oud. Got: [${entry.heartNotes.join(", ")}]`);
});

test("W4-V21 — Oud Cadenza fragranceFamily is Oriental Woody (Oud-family classification supported)", () => {
  const entry = find("UNISEX-82");
  assert.ok(
    entry.fragranceFamily !== null && entry.fragranceFamily.toLowerCase().includes("oriental"),
    `Oud Cadenza fragranceFamily must be Oriental-class, got '${entry.fragranceFamily}'`
  );
});

test("W4-V22 — governance.specialGovernanceFlags OUD_GAP_STATUS reads OUD_GAP_PROVEN_HIGH (R1 tier audit)", () => {
  assert.ok(
    "OUD_GAP_STATUS" in raw.governance.specialGovernanceFlags,
    "specialGovernanceFlags must contain OUD_GAP_STATUS key"
  );
  const oudStatus = raw.governance.specialGovernanceFlags["OUD_GAP_STATUS"];
  assert.ok(
    oudStatus.includes("OUD_GAP_PROVEN_HIGH"),
    "OUD_GAP_STATUS must read OUD_GAP_PROVEN_HIGH (R1 tier audit corrected from AUTHORITATIVE)"
  );
});

// ── Section 7: High-risk identity governance ──────────────────────────────────

console.log("\n  ─── Section 7: High-risk identity governance ───\n");

test("W4-V23 — Prada Paradigme evidenceStatus is READY (P18B flag resolved)", () => {
  const entry = find("MEN-172");
  assert.equal(entry.evidenceStatus, "READY",
    `Prada Paradigme must be READY — P18B identity flag resolved. Got '${entry.evidenceStatus}'`);
});

test("W4-V24 — Prada Paradigme canonicalName is 'Paradigme' (not 'Paradoxe')", () => {
  const entry = find("MEN-172");
  assert.equal(entry.canonicalName, "Paradigme",
    `Prada canonical name must be 'Paradigme', got '${entry.canonicalName}'`);
});

test("W4-V25 — Versace Pour Femme Dylan Blue evidenceStatus is READY (LADIES identity confirmed)", () => {
  const entry = find("LADIES-275");
  assert.equal(entry.evidenceStatus, "READY",
    `Dylan Blue Pour Femme must be READY. Got '${entry.evidenceStatus}'`);
});

test("W4-V26 — Dylan Blue Pour Femme launchYear is 2017 (distinct from men's Dylan Blue 2016)", () => {
  const entry = find("LADIES-275");
  assert.equal(entry.launchYear, 2017,
    `Dylan Blue Pour Femme launchYear must be 2017, got ${entry.launchYear}`);
});

test("W4-V27 — Bleu Noir canonical name uses French 'Bleu Noir' (not English 'Blue Noir')", () => {
  const entry = find("MEN-151");
  assert.ok(
    entry.canonicalName !== null && entry.canonicalName.includes("Bleu"),
    `Bleu Noir canonical name must contain 'Bleu' (French), got '${entry.canonicalName}'`
  );
});

test("W4-V28 — Bleu Noir possibleNameIssue is true (spelling correction flagged for catalogue)", () => {
  const entry = find("MEN-151");
  assert.equal(entry.possibleNameIssue, true,
    "Bleu Noir must have possibleNameIssue: true (French vs English spelling flag)");
});

test("W4-V29 — Chloé canonical name is 'Chloé Eau de Parfum' (original 2008)", () => {
  const entry = find("LADIES-70");
  assert.equal(entry.canonicalName, "Chloé Eau de Parfum",
    `Chloé canonical name must be 'Chloé Eau de Parfum', got '${entry.canonicalName}'`);
});

// ── Section 8: Narciso Pure Musc distinctness ─────────────────────────────────

console.log("\n  ─── Section 8: Narciso Pure Musc distinctness ───\n");

test("W4-V30 — Narciso Pure Musc evidenceStatus is READY", () => {
  const entry = find("LADIES-204");
  assert.equal(entry.evidenceStatus, "READY",
    `Narciso Pure Musc must be READY. Got '${entry.evidenceStatus}'`);
});

test("W4-V31 — Narciso Pure Musc heartNotes has at minimum 1 note (non-empty)", () => {
  const entry = find("LADIES-204");
  assert.ok(entry.heartNotes.length >= 1,
    `Narciso Pure Musc heartNotes must be non-empty (got ${entry.heartNotes.length})`);
});

test("W4-V32 — Narciso Pure Musc baseNotes contains Cashmeran (unique vs. native Narciso records)", () => {
  const entry = find("LADIES-204");
  assert.ok(entry.baseNotes.includes("Cashmeran"),
    "Pure Musc baseNotes must include 'Cashmeran' — the distinguishing base that is absent from all other native Narciso records"
  );
});

// ── Section 9: Evidence sources ───────────────────────────────────────────────

console.log("\n  ─── Section 9: Evidence sources ───\n");

test("W4-V33 — all READY entries have at least 1 evidenceSource", () => {
  const ready = entries.filter(e => e.evidenceStatus === "READY");
  const missing = ready.filter(e => !e.evidenceSources || e.evidenceSources.length === 0);
  assert.equal(missing.length, 0,
    `${missing.length} READY entries lack evidenceSources: ${missing.map(e => e._sourceKey).join(", ")}`);
});

test("W4-V34 — Gucci Flora has at least 2 evidenceSources (options A and B documented)", () => {
  const entry = find("LADIES-127");
  assert.ok(entry.evidenceSources.length >= 2,
    `Gucci Flora must have ≥2 evidenceSources (one per option), got ${entry.evidenceSources.length}`);
});

// ── Section 10: Creed Delphinus family mismatch governance ────────────────────

console.log("\n  ─── Section 10: Creed Delphinus gap mismatch governance ───\n");

test("W4-V35 — Creed Delphinus evidenceStatus is READY (identity confirmed despite gap mismatch)", () => {
  const entry = find("UNISEX-21");
  assert.equal(entry.evidenceStatus, "READY",
    `Creed Delphinus must be READY (identity confirmed), got '${entry.evidenceStatus}'`);
});

test("W4-V36 — Creed Delphinus fragranceFamily is Oriental Floral (not Aquatic — mismatch confirmed)", () => {
  const entry = find("UNISEX-21");
  assert.ok(
    entry.fragranceFamily !== null && entry.fragranceFamily.toLowerCase().includes("oriental"),
    `Creed Delphinus fragranceFamily must be Oriental-class per evidence, got '${entry.fragranceFamily}'`
  );
});

test("W4-V37 — Creed Delphinus conflicts array is non-empty (gap mismatch recorded)", () => {
  const entry = find("UNISEX-21");
  assert.ok(
    Array.isArray((entry as any).conflicts) && (entry as any).conflicts.length > 0,
    "Creed Delphinus conflicts array must be non-empty (P18A gap mismatch must be recorded)"
  );
});

test("W4-V38 — governance.specialGovernanceFlags contains FAMILY_GAP_MISMATCH_CREED_DELPHINUS key", () => {
  assert.ok(
    "FAMILY_GAP_MISMATCH_CREED_DELPHINUS" in raw.governance.specialGovernanceFlags,
    "specialGovernanceFlags must contain FAMILY_GAP_MISMATCH_CREED_DELPHINUS key"
  );
});

// ── Section 11: Brand name corrections ────────────────────────────────────────

console.log("\n  ─── Section 11: Brand name corrections ───\n");

test("W4-V39 — Bvlgari Aqva Marine brand field uses canonical 'Bvlgari' (not 'Bulgari')", () => {
  const entry = find("MEN-34");
  assert.equal(entry.brand, "Bvlgari",
    `MEN-34 brand must be 'Bvlgari' (not 'Bulgari'), got '${entry.brand}'`);
});

test("W4-V40 — Narciso Rodriguez entries use canonical brand 'Narciso Rodriguez' (not 'Narciso Rodriquez')", () => {
  const narcisoEntries = entries.filter(e =>
    e._sourceKey.includes("MEN-151") || e._sourceKey.includes("LADIES-204")
  );
  for (const entry of narcisoEntries) {
    assert.equal(entry.brand, "Narciso Rodriguez",
      `${entry._sourceKey}: brand must be 'Narciso Rodriguez', got '${entry.brand}'`);
  }
});

test("W4-V41 — Matière Première brand field preserves accent (è)", () => {
  const entry = find("UNISEX-51");
  assert.equal(entry.brand, "Matière Première",
    `UNISEX-51 brand must be 'Matière Première' (accents preserved), got '${entry.brand}'`);
});

test("W4-V42 — Chloé brand field preserves accent (é)", () => {
  const entry = find("LADIES-70");
  assert.equal(entry.brand, "Chloé",
    `LADIES-70 brand must be 'Chloé' (accent preserved), got '${entry.brand}'`);
});

// ── Section 12: catalogue subtitle corrections documented ─────────────────────

console.log("\n  ─── Section 12: Catalogue subtitle corrections ───\n");

test("W4-V43 — catalogueSubtitleCorrections array is non-empty (Bleu Noir + Gucci Flora)", () => {
  assert.ok(
    Array.isArray(raw.governance.catalogueSubtitleCorrections) &&
    raw.governance.catalogueSubtitleCorrections.length >= 2,
    "catalogueSubtitleCorrections must have at least 2 entries (Bleu Noir, Gucci Flora)"
  );
});

// ── Section 13: Collection distribution unique slugs ──────────────────────────

console.log("\n  ─── Section 13: Slug uniqueness ───\n");

test("W4-V44 — all 20 proposedSlug values are unique", () => {
  const slugs = entries.map(e => e.proposedSlug);
  const unique = new Set(slugs);
  assert.equal(unique.size, slugs.length,
    `Duplicate proposedSlug detected. Expected ${slugs.length} unique, got ${unique.size}`);
});

test("W4-V45 — all proposedSlug values end with '-inspired'", () => {
  const nonCompliant = entries.filter(e => !e.proposedSlug.endsWith("-inspired"));
  assert.equal(nonCompliant.length, 0,
    `${nonCompliant.length} entries have proposedSlug not ending in '-inspired': ${nonCompliant.map(e => e._sourceKey).join(", ")}`);
});

// ── Section 14: R1 Founder decision governance gates ─────────────────────────

console.log("\n  ─── Section 14: R1 Founder decision governance gates ───\n");

test("W4-V46 — Gucci Flora evidenceStatus is READY (Founder Option B applied R1)", () => {
  const entry = find("LADIES-127");
  assert.equal(entry.evidenceStatus, "READY",
    `Gucci Flora must be READY after R1 resolution. Got '${entry.evidenceStatus}'`);
});

test("W4-V47 — Gucci Flora launchYear is 2021 (Flora Gorgeous Gardenia canonical year)", () => {
  const entry = find("LADIES-127");
  assert.equal(entry.launchYear, 2021,
    `Gucci Flora launchYear must be 2021 (Gorgeous Gardenia EDP), got ${entry.launchYear}`);
});

test("W4-V48 — FAMILY_GAP_MISMATCH flag reflects ASSORTMENT_GAP_MISMATCH_INFORMATIONAL Founder RETAIN decision", () => {
  const gapFlag = raw.governance.specialGovernanceFlags["FAMILY_GAP_MISMATCH_CREED_DELPHINUS"];
  assert.ok(
    gapFlag !== undefined && gapFlag.includes("ASSORTMENT_GAP_MISMATCH_INFORMATIONAL"),
    "FAMILY_GAP_MISMATCH_CREED_DELPHINUS must read ASSORTMENT_GAP_MISMATCH_INFORMATIONAL (Founder RETAIN R1)"
  );
});

test("W4-V49 — readySummary FOUNDER_DECISION_REQUIRED is empty array (all resolved R1)", () => {
  const fdr = (raw as unknown as { governance: { readySummary: { FOUNDER_DECISION_REQUIRED: unknown[] } } })
    .governance.readySummary?.FOUNDER_DECISION_REQUIRED;
  assert.ok(Array.isArray(fdr) && fdr.length === 0,
    `readySummary.FOUNDER_DECISION_REQUIRED must be empty array after R1. Got: ${JSON.stringify(fdr)}`);
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(56)}`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error(`\n  FAIL — ${failed} Wave 4 governance validation test(s) did not pass.\n`);
  process.exit(1);
} else {
  console.log(`\n  PASS — all ${passed} Wave 4 governance validation checks passed.\n`);
  console.log("  Wave 4 research governance: VERIFIED (P18C_R1_PASS_WAVE4_20_OF_20_EVIDENCE_LOCKED)");
  console.log("  20 entries READY for factory staging.");
  console.log("  0 entries FOUNDER_DECISION_REQUIRED — all Founder decisions resolved in EP-CAT-P18C-R1.\n");
  console.log("  Catalogue corrections pending before P18D staging:");
  console.log("    1. MEN-151 Bleu Noir: subtitle correction 'Blue Noir' → 'for Him Bleu Noir' in wave-4-catalogue.ts");
  console.log("    2. LADIES-127 Gucci Flora: subtitle correction 'Inspired by Gucci Flora' → 'Inspired by Gucci Flora Gorgeous Gardenia' in wave-4-catalogue.ts\n");
}

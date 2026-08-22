/**
 * Wave 3 Research Governance — Validation Script
 *
 * EP-CAT-P10D/P11: verifies Wave 3 research evidence governance state.
 * Validates wave-3-2026-research.json only — NO generated drafts required
 * because factory generation has not occurred yet for Wave 3.
 *
 * Run: npx tsx scripts/factory/data/validate-wave-3.ts
 *
 * Does NOT call any AI provider. Does NOT generate any drafts.
 * Does NOT modify any files. Read-only validation only.
 *
 * Governance constraints verified:
 *   - All 30 entries present (ROSE=10, SKYE=10, ELITE=10)
 *   - 29 READY entries, 1 BRAND_NARRATIVE_ONLY (UNISEX-49 Torino24 — EP-CAT-P11)
 *   - 0 FOUNDER_DECISION_REQUIRED (all decisions resolved)
 *   - All READY entries have notes populated
 *   - 2 UNORDERED_GOVERNED_NOTES entries: top=[], base=[], heart non-empty
 *   - 1 SPARSE structured entry (Scandal Pour Homme Le Parfum 1-1-1)
 *   - All READY entries have evidenceSources
 *   - Accent characters preserved in canonical names
 *   - Year corrections applied (My Way Nectar 2024, 212 VIP Black 2017, etc.)
 *   - Torino24 evidenceStatus BRAND_NARRATIVE_ONLY; sourceConfidence LOW (community reference only)
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
}

const researchPath = path.resolve(process.cwd(), "data/identity/source/wave-3-2026-research.json");
const raw = JSON.parse(readFileSync(researchPath, "utf-8")) as {
  batchId: string;
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

console.log("\n  Wave 3 Research Governance Validator\n  EP-CAT-P10D\n");
console.log("  ─── Section 1: Structure and counts ───\n");

test("W3-V1 — batchId is wave-3-2026", () => {
  assert.equal(raw.batchId, "wave-3-2026", "batchId must be 'wave-3-2026'");
});

test("W3-V2 — entries array contains exactly 30 records", () => {
  assert.equal(entries.length, 30, `Expected 30 entries, got ${entries.length}`);
});

test("W3-V3 — ROSE collection has exactly 10 entries", () => {
  const rose = entries.filter(e => e._collection === "ROSE");
  assert.equal(rose.length, 10, `Expected 10 ROSE entries, got ${rose.length}`);
});

test("W3-V4 — SKYE collection has exactly 10 entries", () => {
  const skye = entries.filter(e => e._collection === "SKYE");
  assert.equal(skye.length, 10, `Expected 10 SKYE entries, got ${skye.length}`);
});

test("W3-V5 — ELITE collection has exactly 10 entries", () => {
  const elite = entries.filter(e => e._collection === "ELITE");
  assert.equal(elite.length, 10, `Expected 10 ELITE entries, got ${elite.length}`);
});

// ── Section 2: Evidence status distribution ───────────────────────────────────

console.log("\n  ─── Section 2: Evidence status distribution ───\n");

test("W3-V6 — 29 entries have evidenceStatus READY", () => {
  const ready = entries.filter(e => e.evidenceStatus === "READY");
  assert.equal(ready.length, 29, `Expected 29 READY entries, got ${ready.length}`);
});

test("W3-V7 — 1 entry has evidenceStatus BRAND_NARRATIVE_ONLY (UNISEX-49 Torino24 — EP-CAT-P11 Founder decision)", () => {
  const bno = entries.filter(e => e.evidenceStatus === "BRAND_NARRATIVE_ONLY");
  assert.equal(bno.length, 1, `Expected 1 BRAND_NARRATIVE_ONLY entry, got ${bno.length}`);
  assert.ok(bno[0]._sourceKey.includes("UNISEX-49"),
    `BRAND_NARRATIVE_ONLY entry must be UNISEX-49 (Torino24), got ${bno[0]._sourceKey}`);
  // FOUNDER_DECISION_REQUIRED must now be empty — decision has been made
  const fdr = entries.filter(e => e.evidenceStatus === "FOUNDER_DECISION_REQUIRED");
  assert.equal(fdr.length, 0, `FOUNDER_DECISION_REQUIRED must be 0 after EP-CAT-P11 Founder decision, got ${fdr.length}`);
});

test("W3-V8 — 0 entries remain as RESEARCH_REQUIRED (research campaign complete)", () => {
  const pending = entries.filter(e => e.evidenceStatus === "RESEARCH_REQUIRED");
  assert.equal(pending.length, 0,
    `Expected 0 RESEARCH_REQUIRED entries; ${pending.length} still pending: ${pending.map(e => e._sourceKey).join(", ")}`);
});

test("W3-V9 — no entries have researchRequired: true (all research actioned)", () => {
  const stillRequired = entries.filter(e => e.researchRequired === true);
  assert.equal(stillRequired.length, 0,
    `${stillRequired.length} entries still have researchRequired:true: ${stillRequired.map(e => e._sourceKey).join(", ")}`);
});

// ── Section 3: Notes population for READY entries ────────────────────────────

console.log("\n  ─── Section 3: Notes population ───\n");

const UNORDERED_KEYS = new Set([
  "UNISEX-60-Jo Malone / Fig & Lotus Flower",
  "UNISEX-61-Jo Malone / Grapefruit",
]);

test("W3-V10 — all READY ordered-pyramid entries have non-empty topNotes", () => {
  const ordered = entries.filter(e =>
    e.evidenceStatus === "READY" && !UNORDERED_KEYS.has(e._sourceKey),
  );
  const missing = ordered.filter(e => e.topNotes.length === 0);
  assert.equal(missing.length, 0,
    `${missing.length} READY ordered entries have empty topNotes: ${missing.map(e => e._sourceKey).join(", ")}`);
});

test("W3-V11 — all READY entries have non-empty heartNotes", () => {
  const ready = entries.filter(e => e.evidenceStatus === "READY");
  const missing = ready.filter(e => e.heartNotes.length === 0);
  assert.equal(missing.length, 0,
    `${missing.length} READY entries have empty heartNotes: ${missing.map(e => e._sourceKey).join(", ")}`);
});

test("W3-V12 — all READY ordered-pyramid entries have non-empty baseNotes", () => {
  const ordered = entries.filter(e =>
    e.evidenceStatus === "READY" && !UNORDERED_KEYS.has(e._sourceKey),
  );
  const missing = ordered.filter(e => e.baseNotes.length === 0);
  assert.equal(missing.length, 0,
    `${missing.length} READY ordered entries have empty baseNotes: ${missing.map(e => e._sourceKey).join(", ")}`);
});

// ── Section 4: UNORDERED_GOVERNED_NOTES entries ───────────────────────────────

console.log("\n  ─── Section 4: UNORDERED_GOVERNED_NOTES governance ───\n");

test("W3-V13 — Fig & Lotus Flower has empty top and base (UNORDERED pattern)", () => {
  const entry = find("UNISEX-60");
  assert.deepEqual(entry.topNotes,  [], "Fig & Lotus Flower topNotes must be empty []");
  assert.deepEqual(entry.baseNotes, [], "Fig & Lotus Flower baseNotes must be empty []");
});

test("W3-V14 — Fig & Lotus Flower heartNotes has exactly 3 governed notes", () => {
  const entry = find("UNISEX-60");
  assert.equal(entry.heartNotes.length, 3,
    `Fig & Lotus Flower heartNotes must have 3 notes, got ${entry.heartNotes.length}: [${entry.heartNotes.join(", ")}]`);
});

test("W3-V15 — Grapefruit has empty top and base (UNORDERED pattern)", () => {
  const entry = find("UNISEX-61");
  assert.deepEqual(entry.topNotes,  [], "Grapefruit topNotes must be empty []");
  assert.deepEqual(entry.baseNotes, [], "Grapefruit baseNotes must be empty []");
});

test("W3-V16 — Grapefruit heartNotes has exactly 4 governed notes including Pimento", () => {
  const entry = find("UNISEX-61");
  assert.equal(entry.heartNotes.length, 4,
    `Grapefruit heartNotes must have 4 notes, got ${entry.heartNotes.length}`);
  assert.ok(entry.heartNotes.includes("Pimento"),
    "Grapefruit must include 'Pimento' (Jo Malone brand note — not 'Allspice')");
});

// ── Section 5: Sparse pyramid ─────────────────────────────────────────────────

console.log("\n  ─── Section 5: Sparse pyramid ───\n");

test("W3-V17 — Scandal Pour Homme Le Parfum has 1-1-1 pyramid (minimal notes are complete)", () => {
  const entry = find("MEN-88");
  assert.equal(entry.topNotes.length,   1, `Scandal Pour Homme Le Parfum top must have 1 note (got ${entry.topNotes.length})`);
  assert.equal(entry.heartNotes.length, 1, `Scandal Pour Homme Le Parfum heart must have 1 note (got ${entry.heartNotes.length})`);
  assert.equal(entry.baseNotes.length,  1, `Scandal Pour Homme Le Parfum base must have 1 note (got ${entry.baseNotes.length})`);
});

test("W3-V18 — Scandal Pour Homme Le Parfum canonical name resolved (not supplier 'NEW' label)", () => {
  const entry = find("MEN-88");
  assert.equal(entry.canonicalName, "Scandal Pour Homme Le Parfum",
    `Canonical name must be 'Scandal Pour Homme Le Parfum', got '${entry.canonicalName}'`);
});

// ── Section 6: Special characters / accent preservation ───────────────────────

console.log("\n  ─── Section 6: Special characters ───\n");

test("W3-V19 — MFK À la rose canonical name preserves French accent on À", () => {
  const entry = find("mid-year-2026::mfk a la rose");
  assert.equal(entry.canonicalName, "À la rose",
    `MFK canonical name must be 'À la rose' (À with grave accent), got '${entry.canonicalName}'`);
});

test("W3-V20 — Attrape-Rêves canonical name preserves accent on ê", () => {
  const entry = find("LADIES-184");
  assert.equal(entry.canonicalName, "Attrape-Rêves",
    `LV canonical name must be 'Attrape-Rêves' (ê with circumflex), got '${entry.canonicalName}'`);
});

test("W3-V21 — Platinum Égoïste canonical name preserves accents", () => {
  const entry = find("MEN-154");
  assert.equal(entry.canonicalName, "Platinum Égoïste",
    `Chanel canonical name must be 'Platinum Égoïste', got '${entry.canonicalName}'`);
});

test("W3-V22 — Armani Privé Oud Royal canonical name preserves accent on Privé", () => {
  const entry = find("UNISEX-9");
  assert.equal(entry.canonicalName, "Armani Privé Oud Royal",
    `Armani canonical name must be 'Armani Privé Oud Royal' (é on Privé), got '${entry.canonicalName}'`);
});

// ── Section 7: Year corrections ───────────────────────────────────────────────

console.log("\n  ─── Section 7: Year corrections ───\n");

test("W3-V23 — My Way Nectar launchYear is 2024 (not 2022 from disposition record)", () => {
  const entry = find("LADIES-202");
  assert.equal(entry.launchYear, 2024,
    `My Way Nectar launchYear must be 2024 (corrected from 2022), got ${entry.launchYear}`);
});

test("W3-V24 — Eternity for Men launchYear is 1990 (men's, not 1988 women's)", () => {
  const entry = find("MEN-42");
  assert.equal(entry.launchYear, 1990,
    `Eternity for Men launchYear must be 1990, got ${entry.launchYear}`);
});

test("W3-V25 — 212 VIP Black launchYear is 2017 (not 2012 from supplier note)", () => {
  const entry = find("MEN-10");
  assert.equal(entry.launchYear, 2017,
    `212 VIP Black launchYear must be 2017 (corrected from 2012), got ${entry.launchYear}`);
});

test("W3-V26 — Centaurus launchYear is 2024 (not 2023 from initial brief)", () => {
  const entry = find("UNISEX-20");
  assert.equal(entry.launchYear, 2024,
    `Centaurus launchYear must be 2024 (corrected from 2023), got ${entry.launchYear}`);
});

// ── Section 8: Torino24 brand-narrative-only governance (EP-CAT-P11) ─────────

console.log("\n  ─── Section 8: Torino24 brand-narrative-only governance ───\n");

test("W3-V27 — Torino24 sourceConfidence is LOW (community notes preserved as non-canonical reference)", () => {
  const entry = find("UNISEX-49");
  assert.equal(entry.sourceConfidence, "LOW",
    `Torino24 sourceConfidence must be LOW (community-inferred notes), got '${entry.sourceConfidence}'`);
});

test("W3-V28 — Torino24 canonical name is TORINO24 (official Xerjoff spelling)", () => {
  const entry = find("UNISEX-49");
  assert.equal(entry.canonicalName, "TORINO24",
    `Torino24 canonical name must be 'TORINO24' (official Xerjoff no-space form), got '${entry.canonicalName}'`);
});

// ── Section 9: Evidence sources ───────────────────────────────────────────────

console.log("\n  ─── Section 9: Evidence sources ───\n");

test("W3-V29 — all READY entries have at least one evidenceSource", () => {
  const ready = entries.filter(e => e.evidenceStatus === "READY");
  const missing = ready.filter(e => !e.evidenceSources || e.evidenceSources.length === 0);
  assert.equal(missing.length, 0,
    `${missing.length} READY entries lack evidenceSources: ${missing.map(e => e._sourceKey).join(", ")}`);
});

test("W3-V30 — Abu Dhabi evidenceSources includes Memo Paris official (T1 AUTHORITATIVE)", () => {
  const entry = find("UNISEX-1");
  const hasMemoOfficial = entry.evidenceSources.some(s => s.includes("memoparis.com"));
  assert.ok(hasMemoOfficial,
    "Abu Dhabi evidenceSources must include official memoparis.com URL (T1 AUTHORITATIVE)");
});

// ── Section 10: Brand name corrections ───────────────────────────────────────

console.log("\n  ─── Section 10: Brand name corrections ───\n");

test("W3-V31 — Bvlgari entries use canonical brand 'Bvlgari' (not 'Bulgari')", () => {
  const bvlgariEntries = entries.filter(e =>
    e._sourceKey.includes("LADIES-54") ||
    e._sourceKey.includes("MEN-35") ||
    e._sourceKey.includes("MEN-33")
  );
  for (const entry of bvlgariEntries) {
    assert.equal(entry.brand, "Bvlgari",
      `${entry._sourceKey}: brand must be 'Bvlgari' (not 'Bulgari'), got '${entry.brand}'`);
  }
});

test("W3-V32 — Calvin Klein entry uses canonical brand 'Calvin Klein' (not 'CK')", () => {
  const entry = find("MEN-42");
  assert.equal(entry.brand, "Calvin Klein",
    `MEN-42 brand must be 'Calvin Klein', got '${entry.brand}'`);
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(56)}`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error(`\n  FAIL — ${failed} Wave 3 governance validation test(s) did not pass.\n`);
  process.exit(1);
} else {
  console.log(`\n  PASS — all ${passed} Wave 3 governance validation checks passed.\n`);
  console.log("  Wave 3 research governance: VERIFIED");
  console.log("  29 entries READY for factory staging.");
  console.log("  1 entry (UNISEX-49 Torino24) BRAND_NARRATIVE_ONLY — Founder decision received EP-CAT-P11.\n");
}

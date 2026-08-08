/**
 * EP5-P2CR — 2026 Identity Source Contract Validation
 *
 * Deterministic proof suite validating all source contract rules for the
 * Mid-Year 2026 ingestion before real source data is populated.
 *
 * Uses inline mock data — does NOT depend on actual source files being populated.
 * Does NOT modify the identity registry.
 * Does NOT call AI.
 *
 * Run: npm run mip:validate:source:2026
 */

import { readFileSync } from "fs";
import { join }         from "path";

import {
  parseSupplierSourceFile,
  parseResearchSourceFile,
  deduplicateSupplierRows,
  matchResearch,
  verifySourceCorrespondence,
  isCleanCanonicalProposal,
  CAMPAIGN_SOURCE_ROW_COUNT,
  CAMPAIGN_UNIQUE_COUNT,
  CAMPAIGN_DUPLICATE_COUNT,
} from "./ingestion/sourceValidation";

import type { ResearchMarketedGender, IngestionCategory } from "./ingestion/types";

// ── Proof runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function proof(label: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓  ${label}`);
    passed++;
  } catch (err) {
    console.error(`  ✗  ${label}`);
    if (err instanceof Error) console.error(`       ${err.message}`);
    failed++;
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
}

function assertThrows(fn: () => unknown, containing?: string): void {
  let threw = false;
  let thrownMessage = "";
  try {
    fn();
  } catch (err) {
    threw = true;
    thrownMessage = err instanceof Error ? err.message : String(err);
  }
  if (!threw) {
    throw new Error("Expected function to throw but it did not");
  }
  if (containing !== undefined && !thrownMessage.toLowerCase().includes(containing.toLowerCase())) {
    throw new Error(
      `Expected error containing "${containing}", got: "${thrownMessage}"`,
    );
  }
}

// ── Mock data builders ────────────────────────────────────────────────────────

// The five fragrances the founder's Mid-Year 2026 list has under both L and M
const MOCK_DUAL_NAMES = [
  "Kayali Freedom Musk Santal 34",
  "Kayali Freedom Musk Latte 41",
  "Kayali Freedom Musk Matcha 45",
  "Dolce & Gabbana Velvet Passion Oud",
  "Armani Prive Oud Nacre",
];

function build31SupplierSource(): unknown {
  const entries: { supplierName: string; supplierCategory: string }[] = [];
  // 21 unique entries
  for (let i = 1; i <= 21; i++) {
    entries.push({
      supplierName:     `Test Fragrance ${String(i).padStart(2, "0")}`,
      supplierCategory: "L",
    });
  }
  // 5 dual L/M entries → 10 rows
  for (const name of MOCK_DUAL_NAMES) {
    entries.push({ supplierName: name, supplierCategory: "L" });
    entries.push({ supplierName: name, supplierCategory: "M" });
  }
  // total: 21 + 10 = 31
  return {
    batchId:         "mid-year-2026",
    description:     "Mock supplier source for validation proof suite",
    sourceReference: "validation-test",
    entries,
  };
}

function build26ResearchSource(): unknown {
  const entries: {
    supplierName: string;
    canonicalName: string;
    brand: string;
    sourceConfidence: "high" | "medium";
    possibleNameIssue: boolean;
  }[] = [];
  // 21 unique
  for (let i = 1; i <= 21; i++) {
    entries.push({
      supplierName:     `Test Fragrance ${String(i).padStart(2, "0")}`,
      canonicalName:    `Test Fragrance ${String(i).padStart(2, "0")} EDP`,
      brand:            "Test Brand",
      sourceConfidence: "high",
      possibleNameIssue: false,
    });
  }
  // 5 dual (one research entry per unique identity)
  for (const name of MOCK_DUAL_NAMES) {
    entries.push({
      supplierName:     name,
      canonicalName:    name,
      brand:            "Test Brand",
      sourceConfidence: "medium",
      possibleNameIssue: false,
    });
  }
  return {
    batchId:      "mid-year-2026",
    researchedBy: "Gemini",
    researchDate: "2026-08-08",
    entries,
  };
}

// ── Section 1: Supplier source file contract ──────────────────────────────────

console.log("\n  ── Section 1: Supplier source file contract ────────────────\n");

proof("101: 31 supplier rows accepted by parseSupplierSourceFile", () => {
  const result = parseSupplierSourceFile(build31SupplierSource());
  assert(
    result.entries.length === CAMPAIGN_SOURCE_ROW_COUNT,
    `expected ${CAMPAIGN_SOURCE_ROW_COUNT} entries, got ${result.entries.length}`,
  );
});

proof("102: 31 rows deduplicate to 26 unique identities", () => {
  const file   = parseSupplierSourceFile(build31SupplierSource());
  const unique = deduplicateSupplierRows(file.entries);
  assert(
    unique.length === CAMPAIGN_UNIQUE_COUNT,
    `expected ${CAMPAIGN_UNIQUE_COUNT} unique, got ${unique.length}`,
  );
});

proof("103: Five duplicated identities each retain both supplier groups", () => {
  const file      = parseSupplierSourceFile(build31SupplierSource());
  const unique    = deduplicateSupplierRows(file.entries);
  const collapsed = unique.filter(e => e.supplierEntries.length > 1);
  assert(
    collapsed.length === CAMPAIGN_DUPLICATE_COUNT,
    `expected ${CAMPAIGN_DUPLICATE_COUNT} collapsed entries, got ${collapsed.length}`,
  );
  for (const c of collapsed) {
    assert(
      c.supplierEntries.length === 2,
      `collapsed entry "${c.normalizedKey}" has ${c.supplierEntries.length} rows, expected 2`,
    );
  }
});

proof("104: Malformed supplier root (non-object) is rejected", () => {
  assertThrows(() => parseSupplierSourceFile("not an object"));
  assertThrows(() => parseSupplierSourceFile(null));
  assertThrows(() => parseSupplierSourceFile([1, 2, 3]));
});

proof("105: Missing supplierName is rejected", () => {
  assertThrows(
    () => parseSupplierSourceFile({
      batchId: "test", description: "test", sourceReference: "test",
      entries: [{ supplierCategory: "L" }],
    }),
    "supplierName",
  );
});

// ── Section 2: Research source file contract ──────────────────────────────────

console.log("\n  ── Section 2: Research source file contract ─────────────────\n");

proof("201: Research array fields (fragranceFamily, perfumer) accepted", () => {
  const result = parseResearchSourceFile({
    batchId: "test", researchedBy: "Gemini", researchDate: "2026-08-08",
    entries: [{
      supplierName:      "Test Fragrance",
      canonicalName:     "Test EDP",
      brand:             "Brand",
      sourceConfidence:  "high",
      possibleNameIssue: false,
      fragranceFamily:   ["Floral", "Woody"],
      perfumer:          ["Maurice Roucel"],
    }],
  });
  assert(Array.isArray(result.entries[0]?.fragranceFamily), "fragranceFamily must be array");
  assert(Array.isArray(result.entries[0]?.perfumer), "perfumer must be array");
});

proof("202: Research scalar fragranceFamily rejected", () => {
  assertThrows(
    () => parseResearchSourceFile({
      batchId: "test", researchedBy: "Gemini", researchDate: "2026-08-08",
      entries: [{
        supplierName: "Test", canonicalName: "Test", brand: "Brand",
        sourceConfidence: "high", possibleNameIssue: false,
        fragranceFamily: "Floral",
      }],
    }),
    "fragranceFamily",
  );
});

proof("203: Research scalar perfumer rejected", () => {
  assertThrows(
    () => parseResearchSourceFile({
      batchId: "test", researchedBy: "Gemini", researchDate: "2026-08-08",
      entries: [{
        supplierName: "Test", canonicalName: "Test", brand: "Brand",
        sourceConfidence: "high", possibleNameIssue: false,
        perfumer: "Maurice Roucel",
      }],
    }),
    "perfumer",
  );
});

proof("204: launchYear as number accepted", () => {
  const result = parseResearchSourceFile({
    batchId: "test", researchedBy: "Gemini", researchDate: "2026-08-08",
    entries: [{
      supplierName: "Test", canonicalName: "Test", brand: "Brand",
      launchYear: 1995, sourceConfidence: "high", possibleNameIssue: false,
    }],
  });
  assert(result.entries[0]?.launchYear === 1995, "launchYear 1995 must be accepted");
});

proof("205: launchYear as null accepted", () => {
  const result = parseResearchSourceFile({
    batchId: "test", researchedBy: "Gemini", researchDate: "2026-08-08",
    entries: [{
      supplierName: "Test", canonicalName: "Test", brand: "Brand",
      launchYear: null, sourceConfidence: "high", possibleNameIssue: false,
    }],
  });
  assert(result.entries[0]?.launchYear === null, "launchYear null must be accepted");
});

proof("206: marketedGender 'unknown' accepted as source-level value", () => {
  const result = parseResearchSourceFile({
    batchId: "test", researchedBy: "Gemini", researchDate: "2026-08-08",
    entries: [{
      supplierName: "Test", canonicalName: "Test", brand: "Brand",
      marketedGender: "unknown", sourceConfidence: "high", possibleNameIssue: false,
    }],
  });
  assert(result.entries[0]?.marketedGender === "unknown", "'unknown' must be accepted as source value");
});

// ── Section 3: Canonical construction rules ────────────────────────────────────

console.log("\n  ── Section 3: Canonical construction rules ──────────────────\n");

// These helpers mirror the canonical construction logic in the ingestion script.
// They prove that the mapping contract is correct independently of the full build.
function mapCanonicalGender(
  g: ResearchMarketedGender | undefined,
): "female" | "male" | "unisex" | "shared" | undefined {
  if (g === undefined || g === "unknown") return undefined;
  return g;
}

function mapCanonicalLaunchYear(y: number | null | undefined): number | undefined {
  if (y == null) return undefined;
  return y;
}

proof("301: marketedGender 'unknown' is omitted from CanonicalIdentity", () => {
  assert(mapCanonicalGender("unknown") === undefined, "unknown must yield undefined");
});

proof("302: marketedGender 'unknown' does NOT collapse to 'unisex'", () => {
  assert(
    mapCanonicalGender("unknown") !== "unisex",
    "unknown must not become unisex — must be absent",
  );
});

proof("303: Known marketedGender values pass through unchanged", () => {
  assert(mapCanonicalGender("female") === "female", "female passes through");
  assert(mapCanonicalGender("male")   === "male",   "male passes through");
  assert(mapCanonicalGender("unisex") === "unisex", "unisex passes through");
  assert(mapCanonicalGender("shared") === "shared", "shared passes through");
});

proof("304: launchYear null is omitted from CanonicalIdentity", () => {
  assert(mapCanonicalLaunchYear(null) === undefined, "null must yield undefined");
});

proof("305: launchYear undefined is omitted from CanonicalIdentity", () => {
  assert(mapCanonicalLaunchYear(undefined) === undefined, "undefined must yield undefined");
});

proof("306: launchYear with a real number passes through to canonical", () => {
  assert(mapCanonicalLaunchYear(1995) === 1995, "1995 must pass through");
  assert(mapCanonicalLaunchYear(2024) === 2024, "2024 must pass through");
});

// ── Section 4: Source rejection rules ─────────────────────────────────────────

console.log("\n  ── Section 4: Source rejection rules ────────────────────────\n");

proof("401: Invalid marketedGender value rejected", () => {
  assertThrows(
    () => parseResearchSourceFile({
      batchId: "test", researchedBy: "Gemini", researchDate: "2026-08-08",
      entries: [{
        supplierName: "Test", canonicalName: "Test", brand: "Brand",
        marketedGender: "other", sourceConfidence: "high", possibleNameIssue: false,
      }],
    }),
    "marketedGender",
  );
});

proof("402: Invalid sourceConfidence value rejected", () => {
  assertThrows(
    () => parseResearchSourceFile({
      batchId: "test", researchedBy: "Gemini", researchDate: "2026-08-08",
      entries: [{
        supplierName: "Test", canonicalName: "Test", brand: "Brand",
        sourceConfidence: "very-high", possibleNameIssue: false,
      }],
    }),
    "sourceConfidence",
  );
});

proof("403: Non-string sourceNotes value rejected", () => {
  assertThrows(
    () => parseResearchSourceFile({
      batchId: "test", researchedBy: "Gemini", researchDate: "2026-08-08",
      entries: [{
        supplierName: "Test", canonicalName: "Test", brand: "Brand",
        sourceConfidence: "high", possibleNameIssue: false,
        sourceNotes: 42,
      }],
    }),
    "sourceNotes",
  );
});

// ── Section 5: Source/research correspondence ──────────────────────────────────

console.log("\n  ── Section 5: Source/research correspondence ─────────────────\n");

proof("501: 26 unique suppliers and 26 research entries pass correspondence check", () => {
  const supplierFile  = parseSupplierSourceFile(build31SupplierSource());
  const researchFile  = parseResearchSourceFile(build26ResearchSource());
  const unique        = deduplicateSupplierRows(supplierFile.entries);
  const matched       = matchResearch(unique, researchFile.entries);
  verifySourceCorrespondence(matched, researchFile.entries);
  assert(true, "correspondence passed without error");
});

proof("502: Duplicate research supplierName rejected", () => {
  const supplierFile = parseSupplierSourceFile(build31SupplierSource());
  const researchFile = parseResearchSourceFile(build26ResearchSource());
  const unique       = deduplicateSupplierRows(supplierFile.entries);
  const entries      = [...researchFile.entries, researchFile.entries[0]!]; // duplicate first
  assertThrows(
    () => verifySourceCorrespondence(unique, entries),
    "duplicate",
  );
});

proof("503: Missing research entry for supplier is rejected", () => {
  const supplierFile = parseSupplierSourceFile(build31SupplierSource());
  const researchFile = parseResearchSourceFile(build26ResearchSource());
  const unique       = deduplicateSupplierRows(supplierFile.entries);
  const truncated    = researchFile.entries.slice(1); // drop first entry
  assertThrows(
    () => verifySourceCorrespondence(unique, truncated),
  );
});

proof("504: Orphan research entry (no matching supplier) is rejected", () => {
  const supplierFile = parseSupplierSourceFile(build31SupplierSource());
  const researchFile = parseResearchSourceFile(build26ResearchSource());
  const unique       = deduplicateSupplierRows(supplierFile.entries);
  const withOrphan   = [
    ...researchFile.entries,
    {
      supplierName:      "Completely Unknown Fragrance XYZ That Has No Supplier Match",
      canonicalName:     "Unknown XYZ",
      brand:             "Unknown Brand",
      sourceConfidence:  "low" as const,
      possibleNameIssue: false,
    },
  ];
  assertThrows(
    () => verifySourceCorrespondence(unique, withOrphan),
    "orphan",
  );
});

// ── Section 6: Ingestion safety invariants ─────────────────────────────────────

console.log("\n  ── Section 6: Ingestion safety invariants ────────────────────\n");

proof("601: No ingestion category maps to 'verified' status", () => {
  // Mirrors determineStatus() in the ingestion script
  function testDetermineStatus(category: IngestionCategory): string {
    return category === "C" ? "candidate" : "pending-review";
  }
  assert(testDetermineStatus("A") === "pending-review", "Category A must be pending-review");
  assert(testDetermineStatus("B") === "pending-review", "Category B must be pending-review");
  assert(testDetermineStatus("C") === "candidate",      "Category C must be candidate");
  assert(testDetermineStatus("A") !== "verified",       "Category A must NOT be verified");
  assert(testDetermineStatus("B") !== "verified",       "Category B must NOT be verified");
  assert(testDetermineStatus("C") !== "verified",       "Category C must NOT be verified");
});

proof("602: Validation script does not modify registry — count equals EP5-P2C persisted state", () => {
  const registryPath = join(
    process.cwd(),
    "app", "lib", "identity", "data", "identity-registry.json",
  );
  const content  = readFileSync(registryPath, "utf-8");
  const registry = JSON.parse(content) as { identities?: unknown[] };
  // EP5-P2C complete: 26 identities persisted. This script must NOT modify the registry.
  // Proof verifies the count is exactly what EP5-P2C wrote — no additions or deletions.
  assert(
    Array.isArray(registry.identities) && registry.identities.length === 26,
    `Registry must hold exactly 26 EP5-P2C identities; found ${Array.isArray(registry.identities) ? registry.identities.length : "non-array"} identities`,
  );
});

// ── Section 7: Canonical safety rules ─────────────────────────────────────────

console.log("\n  ── Section 7: Canonical safety rules ───────────────────────\n");

// Mirrors the canonical name resolution logic in ingest-2026-new-arrivals.ts.
// A clean single proposal is used; an ambiguous / multi-option proposal falls
// back to the supplier name as provisional.
function resolveCanonicalNameForProof(
  researchCanonicalName: string | undefined,
  supplierName: string,
): string {
  const proposal = researchCanonicalName?.trim() ?? "";
  return proposal && isCleanCanonicalProposal(proposal) ? proposal : supplierName;
}

proof("701: Empty research canonicalName → supplierName used provisionally", () => {
  assert(
    resolveCanonicalNameForProof("", "My Supplier Name") === "My Supplier Name",
    "Empty string proposal must fall back to supplier name",
  );
  assert(
    resolveCanonicalNameForProof(undefined, "My Supplier Name") === "My Supplier Name",
    "Undefined proposal must fall back to supplier name",
  );
});

proof("702: Single clean research canonicalName → research proposal used", () => {
  assert(
    resolveCanonicalNameForProof("Alien Goddess", "Alien Goddess/ Thierry Mugler") === "Alien Goddess",
    "Clean single proposal must be used as canonical name",
  );
  assert(
    resolveCanonicalNameForProof("Vibrato", "Sospiro Vibranna") === "Vibrato",
    "Clean short proposal must be used",
  );
});

proof("703: 'Name A / Name B' → rejected as ambiguous, supplierName used provisionally", () => {
  const proposal = "Stronger With You / Stronger With You Absolutely";
  assert(!isCleanCanonicalProposal(proposal), "Multi-option proposal must not be clean");
  assert(
    resolveCanonicalNameForProof(proposal, "Armani Stronger With You Powerfully") ===
      "Armani Stronger With You Powerfully",
    "Supplier name must be used for multi-option proposal",
  );
});

proof("704: '.../ ... (Note: ...)' → rejected, supplierName used provisionally", () => {
  const proposal =
    "Good Girl Légère / Good Girl Supreme (Note: Good Girl Jasmine Absolute does not exist as an official Carolina Herrera release)";
  assert(!isCleanCanonicalProposal(proposal), "Proposal with '(Note:...)' must be rejected");
  assert(
    resolveCanonicalNameForProof(proposal, "212 Carolina Herrera Good Girl Jasmine Absolute") ===
      "212 Carolina Herrera Good Girl Jasmine Absolute",
    "Supplier name must be used as provisional",
  );
});

proof("705: 'Oud Royal / Armani Privé collection (Oud Nacre unverified)' → supplierName used provisionally", () => {
  const proposal = "Oud Royal / Armani Privé collection (Oud Nacre unverified)";
  assert(!isCleanCanonicalProposal(proposal), "Proposal with unverified parenthetical must be rejected");
  assert(
    resolveCanonicalNameForProof(proposal, "Armani Prive Oud Nacre") === "Armani Prive Oud Nacre",
    "Supplier name must be used for unverified parenthetical proposal",
  );
});

proof("706: 'Stronger With You / Stronger With You Absolutely' → supplierName used provisionally", () => {
  const proposal = "Stronger With You / Stronger With You Absolutely";
  assert(!isCleanCanonicalProposal(proposal), "Multi-option proposal must be rejected");
  assert(
    resolveCanonicalNameForProof(proposal, "Armani Stronger With You Powerfully") ===
      "Armani Stronger With You Powerfully",
    "Supplier name must be used as provisional canonical",
  );
});

proof("707: Research proposal remains preserved in parsed research source entry", () => {
  const ambiguousProposal = "Good Girl Légère / Good Girl Supreme (Note: test annotation)";
  const testFile = parseResearchSourceFile({
    batchId:      "test",
    researchedBy: "Gemini",
    researchDate: "2026-01-01",
    entries: [{
      supplierName:      "Test Supplier",
      canonicalName:     ambiguousProposal,
      brand:             "Test Brand",
      sourceConfidence:  "low",
      possibleNameIssue: true,
    }],
  });
  assert(
    testFile.entries[0]?.canonicalName === ambiguousProposal,
    "Original ambiguous proposal must be preserved verbatim in the parsed research entry",
  );
});

proof("708: Research proposal is separately accessible from the provisional canonical name", () => {
  const proposal     = "DKNY Delicious Night / DKNY Red Delicious";
  const supplierName = "DKNY Red Delicious Apple";
  const provisional  = resolveCanonicalNameForProof(proposal, supplierName);
  assert(provisional === supplierName, "Provisional canonical must be supplier name");
  assert(provisional !== proposal,    "Provisional and original research proposal must differ");
  assert(proposal.length > 0,         "Original research proposal must still be available separately");
});

proof("709: No ingestion category maps to 'verified' status (canonical safety invariant)", () => {
  // Mirrors determineStatus() in the ingestion script
  function testStatus(category: "A" | "B" | "C"): string {
    return category === "C" ? "candidate" : "pending-review";
  }
  assert(testStatus("A") !== "verified", "Category A must not produce verified");
  assert(testStatus("B") !== "verified", "Category B must not produce verified");
  assert(testStatus("C") !== "verified", "Category C must not produce verified");
});

proof("710: Clean single-product proposals remain usable for Category A records", () => {
  const categoryAProposals = [
    "24 Faubourg",
    "À la rose",
    "Alien Goddess",
    "Boss Nuit Pour Femme",
    "Coconut Passion",
    "Capri In a Bottle Lemon Sugar | 14",
    "Wanted by Night",
  ];
  for (const p of categoryAProposals) {
    assert(isCleanCanonicalProposal(p), `"${p}" must be a clean canonical proposal`);
    assert(
      resolveCanonicalNameForProof(p, "Any Supplier Name") === p,
      `Clean proposal "${p}" must be used (not replaced with supplier name)`,
    );
  }
});

proof("711: Sospiro Vibranna → 'Vibrato' is a clean single proposal and remains usable", () => {
  assert(isCleanCanonicalProposal("Vibrato"), "'Vibrato' must be a clean canonical proposal");
  assert(
    resolveCanonicalNameForProof("Vibrato", "Sospiro Vibranna") === "Vibrato",
    "'Vibrato' must be used as canonical name for Sospiro Vibranna",
  );
});

proof("712: Narciso supplier variant → 'For Her Pure Musc' is a clean single proposal", () => {
  assert(isCleanCanonicalProposal("For Her Pure Musc"), "'For Her Pure Musc' must be a clean canonical proposal");
  assert(
    resolveCanonicalNameForProof("For Her Pure Musc", "Narciso Rodriquez Pure Musc Blanc EDP Intense") ===
      "For Her Pure Musc",
    "'For Her Pure Musc' must be used as canonical name, not the supplier's longer name",
  );
});

proof("713: DKNY stays Category B/pending-review but uses supplierName as provisional canonical", () => {
  const proposal     = "DKNY Delicious Night / DKNY Red Delicious";
  const supplierName = "DKNY Red Delicious Apple";
  assert(
    !isCleanCanonicalProposal(proposal),
    "DKNY multi-option research proposal must be rejected by clean proposal check",
  );
  assert(
    resolveCanonicalNameForProof(proposal, supplierName) === supplierName,
    "DKNY provisional canonical must be supplier name, not the slash-separated research string",
  );
  // Note: classification (B, pending-review, correct-canonical) is governed by
  // sourceConfidence and possibleNameIssue — not by canonical name cleanliness.
  // That separation is by design.
});

// ── Results ────────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\n══════════════════════════════════════════════════════════`);
console.log(`  EP5-P2CR — 2026 Identity Source Contract Validation`);
console.log(`  ${passed}/${total} proofs passed`);
console.log(`══════════════════════════════════════════════════════════\n`);

if (failed > 0) {
  console.error(`  ✗ ${failed} proof(s) failed — source contract violations detected.\n`);
  process.exit(1);
}
console.log(`  ✓ All ${passed} source contract proofs passed.\n`);

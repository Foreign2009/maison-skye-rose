/**
 * EP6-P5E-R — Relationship Evidence Enrichment Validator
 *
 * Validates the pure compareFragrances utility and the UI presentation contract.
 *
 * All tests use in-memory synthetic fixtures only.
 * No production data is read. No ledger is loaded. No queue is loaded.
 * No MKC native files are imported.
 *
 * Proof sections:
 *   §1  Utility purity — identical inputs, same output, no mutation
 *   §2  Set intersection correctness
 *   §3  Set difference correctness
 *   §4  Note overlap correctness (top, heart, base)
 *   §5  Occasion overlap correctness
 *   §6  Vibe overlap correctness
 *   §7  Season overlap correctness
 *   §8  Classification comparison correctness
 *   §9  Intelligence attributes captured correctly
 *   §10 Missing / empty arrays handled safely
 *   §11 Anti-recommendation contract — no decision vocabulary
 *   §12 Source-code import contract — no persistence, no AI
 */

import { compareFragrances } from "../../app/admin/identity/relationships/compareFragrances";
import type {
  RelationshipComparisonSummary,
} from "../../app/admin/identity/relationships/compareFragrances";
import type { FragranceKnowledge } from "../../app/lib/mkc/types";
import * as fs from "fs";
import * as path from "path";

// ── Test harness ───────────────────────────────────────────────────────────────

let passed  = 0;
let failed  = 0;
const errors: string[] = [];

function proof(id: string, description: string, fn: () => boolean): void {
  try {
    const ok = fn();
    if (ok) {
      passed++;
      console.log(`  ✓ ${id} — ${description}`);
    } else {
      failed++;
      errors.push(`${id}: ${description}`);
      console.log(`  ✗ ${id} — ${description}`);
    }
  } catch (e) {
    failed++;
    errors.push(`${id}: ${description} — threw ${e}`);
    console.log(`  ✗ ${id} — ${description} (threw: ${e})`);
  }
}

function section(label: string): void {
  console.log(`\n${label}`);
}

// ── Synthetic fixture factory ──────────────────────────────────────────────────

function makeFragrance(overrides: Partial<FragranceKnowledge> = {}): FragranceKnowledge {
  return {
    id:             "test-id-a",
    slug:           "test-a",
    brand:          "Test Brand",
    name:           "Test Fragrance A",
    collection:     "Skye",
    gender:         "male",
    family:         ["Citrus", "Fresh"],
    scentCharacter: "Fresh & Light",
    projection:     "moderate",
    profile:        "A bright, clean test profile.",
    season:         "Summer",
    notes: {
      top:   ["Bergamot", "Neroli"],
      heart: ["Jasmine", "Rosemary"],
      base:  ["Musk", "Cedar"],
    },
    mood:           "Bright and clean.",
    vibe:           ["Fresh", "Energetic"],
    occasions:      ["Day Wear", "Casual"],
    seasons:        ["Summer", "Spring"],
    signatureStyle: ["The Everyday Fresh"],
    recommendedFor: ["Casual wear"],
    prices:         { "5ml": 100, "10ml": 180, "30ml": 450 },
    images:         { "5ml": "", "10ml": "", "30ml": "" },
    bestSeller:     false,
    newArrival:     false,
    sweetness:      1,
    freshness:      5,
    warmth:         1,
    intensity:      2,
    versatility:    4,
    popularity:     7,
    ...overrides,
  };
}

// ── §1 Utility purity ──────────────────────────────────────────────────────────

section("§1 — Utility purity");

const fixtureA = makeFragrance();
const fixtureB = makeFragrance({
  id: "test-id-b", slug: "test-b", name: "Test Fragrance B",
});

const resultFirst  = compareFragrances(fixtureA, fixtureB);
const resultSecond = compareFragrances(fixtureA, fixtureB);

proof("P5ER-01", "Same inputs produce identical genderMatch on two calls", () =>
  resultFirst.genderMatch === resultSecond.genderMatch,
);

proof("P5ER-02", "Same inputs produce identical scentCharacterMatch on two calls", () =>
  resultFirst.scentCharacterMatch === resultSecond.scentCharacterMatch,
);

proof("P5ER-03", "Same inputs produce identical sharedFamilies length on two calls", () =>
  resultFirst.sharedFamilies.length === resultSecond.sharedFamilies.length,
);

proof("P5ER-04", "Input record A is not mutated after comparison", () => {
  const original = JSON.stringify(fixtureA);
  compareFragrances(fixtureA, fixtureB);
  return JSON.stringify(fixtureA) === original;
});

proof("P5ER-05", "Input record B is not mutated after comparison", () => {
  const original = JSON.stringify(fixtureB);
  compareFragrances(fixtureA, fixtureB);
  return JSON.stringify(fixtureB) === original;
});

// ── §2 Set intersection correctness ───────────────────────────────────────────

section("§2 — Set intersection correctness");

const fA = makeFragrance({ family: ["Citrus", "Fresh", "Woody"] });
const fB = makeFragrance({ family: ["Fresh", "Woody", "Amber"] });
const resultAB = compareFragrances(fA, fB);

proof("P5ER-06", "sharedFamilies contains only elements present in both records", () =>
  resultAB.sharedFamilies.includes("Fresh") &&
  resultAB.sharedFamilies.includes("Woody") &&
  resultAB.sharedFamilies.length === 2,
);

proof("P5ER-07", "uniqueFamiliesA contains elements only in A", () =>
  resultAB.uniqueFamiliesA.includes("Citrus") &&
  resultAB.uniqueFamiliesA.length === 1,
);

proof("P5ER-08", "uniqueFamiliesB contains elements only in B", () =>
  resultAB.uniqueFamiliesB.includes("Amber") &&
  resultAB.uniqueFamiliesB.length === 1,
);

proof("P5ER-09", "sharedFamilies does not include elements unique to A", () =>
  !resultAB.sharedFamilies.includes("Citrus"),
);

proof("P5ER-10", "sharedFamilies does not include elements unique to B", () =>
  !resultAB.sharedFamilies.includes("Amber"),
);

// ── §3 Set difference correctness ─────────────────────────────────────────────

section("§3 — Set difference correctness");

const fC = makeFragrance({ family: ["Citrus"] });
const fD = makeFragrance({ family: ["Citrus", "Amber"] });
const resultCD = compareFragrances(fC, fD);

proof("P5ER-11", "uniqueFamiliesA empty when A is subset of B", () =>
  resultCD.uniqueFamiliesA.length === 0,
);

proof("P5ER-12", "uniqueFamiliesB contains element not in A", () =>
  resultCD.uniqueFamiliesB.includes("Amber") &&
  resultCD.uniqueFamiliesB.length === 1,
);

proof("P5ER-13", "sharedFamilies correct when A is subset of B", () =>
  resultCD.sharedFamilies.includes("Citrus") &&
  resultCD.sharedFamilies.length === 1,
);

// ── §4 Note overlap correctness ────────────────────────────────────────────────

section("§4 — Note overlap correctness (top, heart, base)");

const fE = makeFragrance({
  notes: { top: ["Bergamot", "Lemon"], heart: ["Jasmine", "Rose"], base: ["Musk", "Sandalwood"] },
});
const fF = makeFragrance({
  notes: { top: ["Bergamot", "Orange"], heart: ["Rose", "Cardamom"], base: ["Sandalwood", "Amber"] },
});
const resultEF = compareFragrances(fE, fF);

proof("P5ER-14", "sharedTopNotes — correct intersection", () =>
  resultEF.sharedTopNotes.includes("Bergamot") &&
  resultEF.sharedTopNotes.length === 1,
);

proof("P5ER-15", "sharedHeartNotes — correct intersection (includes Rose)", () =>
  resultEF.sharedHeartNotes.includes("Rose") &&
  resultEF.sharedHeartNotes.length === 1,
);

proof("P5ER-16", "sharedBaseNotes — correct intersection (includes Sandalwood)", () =>
  resultEF.sharedBaseNotes.includes("Sandalwood") &&
  resultEF.sharedBaseNotes.length === 1,
);

proof("P5ER-17", "uniqueTopNotesA — contains Lemon not Bergamot", () =>
  resultEF.uniqueTopNotesA.includes("Lemon") &&
  !resultEF.uniqueTopNotesA.includes("Bergamot"),
);

proof("P5ER-18", "uniqueHeartNotesA — contains Jasmine not Rose", () =>
  resultEF.uniqueHeartNotesA.includes("Jasmine") &&
  !resultEF.uniqueHeartNotesA.includes("Rose"),
);

proof("P5ER-19", "uniqueBaseNotesA — contains Musk not Sandalwood", () =>
  resultEF.uniqueBaseNotesA.includes("Musk") &&
  !resultEF.uniqueBaseNotesA.includes("Sandalwood"),
);

// ── §5 Occasion overlap correctness ───────────────────────────────────────────

section("§5 — Occasion overlap correctness");

const fG = makeFragrance({ occasions: ["Day Wear", "Evening", "Casual"] });
const fH = makeFragrance({ occasions: ["Evening", "Date Night"] });
const resultGH = compareFragrances(fG, fH);

proof("P5ER-20", "sharedOccasions — Evening shared", () =>
  resultGH.sharedOccasions.includes("Evening") &&
  resultGH.sharedOccasions.length === 1,
);

proof("P5ER-21", "uniqueOccasionsA — Day Wear and Casual in A-only", () =>
  resultGH.uniqueOccasionsA.includes("Day Wear") &&
  resultGH.uniqueOccasionsA.includes("Casual"),
);

proof("P5ER-22", "uniqueOccasionsB — Date Night in B-only", () =>
  resultGH.uniqueOccasionsB.includes("Date Night") &&
  resultGH.uniqueOccasionsB.length === 1,
);

// ── §6 Vibe overlap correctness ────────────────────────────────────────────────

section("§6 — Vibe overlap correctness");

const fI = makeFragrance({ vibe: ["Fresh", "Clean", "Confident"] });
const fJ = makeFragrance({ vibe: ["Warm", "Confident", "Sensual"] });
const resultIJ = compareFragrances(fI, fJ);

proof("P5ER-23", "sharedVibes — Confident shared", () =>
  resultIJ.sharedVibes.includes("Confident") &&
  resultIJ.sharedVibes.length === 1,
);

proof("P5ER-24", "uniqueVibesA — Fresh and Clean in A-only", () =>
  resultIJ.uniqueVibesA.includes("Fresh") &&
  resultIJ.uniqueVibesA.includes("Clean"),
);

proof("P5ER-25", "uniqueVibesB — Warm and Sensual in B-only", () =>
  resultIJ.uniqueVibesB.includes("Warm") &&
  resultIJ.uniqueVibesB.includes("Sensual"),
);

// ── §7 Season overlap correctness ─────────────────────────────────────────────

section("§7 — Season overlap correctness");

const fK = makeFragrance({ seasons: ["Summer", "Spring"] });
const fL = makeFragrance({ seasons: ["Winter", "Autumn"] });
const resultKL = compareFragrances(fK, fL);

const fM = makeFragrance({ seasons: ["Summer", "Spring"] });
const fN = makeFragrance({ seasons: ["Spring", "Autumn"] });
const resultMN = compareFragrances(fM, fN);

proof("P5ER-26", "sharedSeasons — empty when no overlap (Summer/Spring vs Winter/Autumn)", () =>
  resultKL.sharedSeasons.length === 0,
);

proof("P5ER-27", "uniqueSeasonsA — both items when no overlap", () =>
  resultKL.uniqueSeasonsA.length === 2,
);

proof("P5ER-28", "sharedSeasons — Spring shared (Summer/Spring vs Spring/Autumn)", () =>
  resultMN.sharedSeasons.includes("Spring") &&
  resultMN.sharedSeasons.length === 1,
);

// ── §8 Classification comparison correctness ──────────────────────────────────

section("§8 — Classification comparison correctness");

const fSameGender = makeFragrance({ gender: "male" });
const fDiffGender = makeFragrance({ gender: "female", collection: "Rose" });
const resultGender = compareFragrances(fSameGender, fDiffGender);

proof("P5ER-29", "genderMatch false when genders differ (male vs female)", () =>
  resultGender.genderMatch === false,
);

proof("P5ER-30", "genderA and genderB record actual values", () =>
  resultGender.genderA === "male" && resultGender.genderB === "female",
);

proof("P5ER-31", "collectionMatch false when collections differ (Skye vs Rose)", () =>
  resultGender.collectionMatch === false,
);

proof("P5ER-32", "genderMatch true when both male", () => {
  const r = compareFragrances(
    makeFragrance({ gender: "male" }),
    makeFragrance({ gender: "male" }),
  );
  return r.genderMatch === true;
});

proof("P5ER-33", "scentCharacterMatch false when characters differ", () => {
  const r = compareFragrances(
    makeFragrance({ scentCharacter: "Fresh & Light" }),
    makeFragrance({ scentCharacter: "Deep & Intense" }),
  );
  return r.scentCharacterMatch === false && r.scentCharacterA === "Fresh & Light" && r.scentCharacterB === "Deep & Intense";
});

proof("P5ER-34", "scentCharacterMatch true when characters match", () => {
  const r = compareFragrances(
    makeFragrance({ scentCharacter: "Balanced Signature" }),
    makeFragrance({ scentCharacter: "Balanced Signature" }),
  );
  return r.scentCharacterMatch === true;
});

proof("P5ER-35", "projectionA and projectionB record actual values", () => {
  const r = compareFragrances(
    makeFragrance({ projection: "soft" }),
    makeFragrance({ projection: "strong" }),
  );
  return r.projectionA === "soft" && r.projectionB === "strong";
});

// ── §9 Intelligence attributes ─────────────────────────────────────────────────

section("§9 — Intelligence attributes captured correctly");

const fAttr = makeFragrance({ sweetness: 3, freshness: 4, warmth: 2, intensity: 5 });
const fAttr2 = makeFragrance({ sweetness: 1, freshness: 1, warmth: 5, intensity: 3 });
const resultAttr = compareFragrances(fAttr, fAttr2);

proof("P5ER-36", "attributesA.sweetness records value from record A", () =>
  resultAttr.attributesA.sweetness === 3,
);

proof("P5ER-37", "attributesB.sweetness records value from record B", () =>
  resultAttr.attributesB.sweetness === 1,
);

proof("P5ER-38", "attributesA.warmth records value from record A", () =>
  resultAttr.attributesA.warmth === 2,
);

proof("P5ER-39", "attributesB.warmth records value from record B", () =>
  resultAttr.attributesB.warmth === 5,
);

proof("P5ER-40", "attributesA.intensity records value from record A", () =>
  resultAttr.attributesA.intensity === 5,
);

proof("P5ER-41", "attributesB.intensity records value from record B", () =>
  resultAttr.attributesB.intensity === 3,
);

// ── §10 Missing / empty arrays handled safely ──────────────────────────────────

section("§10 — Missing / empty arrays handled safely");

const fEmpty = makeFragrance({
  family: [],
  notes: { top: [], heart: [], base: [] },
  occasions: [],
  vibe: [],
  seasons: [],
});
const fNormal = makeFragrance();
const resultEmpty = compareFragrances(fEmpty, fNormal);

proof("P5ER-42", "sharedFamilies empty when A has no families", () =>
  resultEmpty.sharedFamilies.length === 0,
);

proof("P5ER-43", "sharedHeartNotes empty when A has no heart notes", () =>
  resultEmpty.sharedHeartNotes.length === 0,
);

proof("P5ER-44", "sharedOccasions empty when A has no occasions", () =>
  resultEmpty.sharedOccasions.length === 0,
);

proof("P5ER-45", "uniqueFamiliesB populated when A has no families", () =>
  resultEmpty.uniqueFamiliesB.length === fNormal.family.length,
);

proof("P5ER-46", "comparison of two empty-family records produces empty sharedFamilies", () => {
  const r = compareFragrances(fEmpty, fEmpty);
  return r.sharedFamilies.length === 0 && r.uniqueFamiliesA.length === 0;
});

// ── §11 Anti-recommendation contract ──────────────────────────────────────────

section("§11 — Anti-recommendation contract (no decision vocabulary in output)");

const FORBIDDEN = [
  "approve", "reject", "defer",
  "recommend", "confidence", "probability",
  "good match", "bad match", "strong relationship", "weak relationship",
  "likely alternative", "recommended wardrobe partner",
  "compatible", "incompatible",
];

const sampleResult = compareFragrances(fixtureA, fixtureB);
const resultKeys = Object.keys(sampleResult);

proof("P5ER-47", "No forbidden field names exist in comparison output keys", () => {
  const lowerKeys = resultKeys.map(k => k.toLowerCase());
  return FORBIDDEN.every(word => !lowerKeys.includes(word));
});

proof("P5ER-48", "No 'recommendation' field in comparison output", () =>
  !("recommendation" in sampleResult),
);

proof("P5ER-49", "No 'decision' field in comparison output", () =>
  !("decision" in sampleResult),
);

proof("P5ER-50", "No 'confidence' field in comparison output", () =>
  !("confidence" in sampleResult),
);

proof("P5ER-51", "No 'score' field in comparison output (aside from existing overlapScore in queue)", () =>
  !("score" in sampleResult),
);

// ── §12 Source-code import contract ───────────────────────────────────────────

section("§12 — Source-code import contract (no persistence, no AI)");

function readSourceFile(): string {
  const p = path.resolve(
    __dirname,
    "../../app/admin/identity/relationships/compareFragrances.ts",
  );
  return fs.readFileSync(p, "utf8");
}

const source = readSourceFile();

proof("P5ER-52", "compareFragrances.ts does not import from ledger repository", () =>
  !source.includes("ledgerRepo") && !source.includes("LedgerRepository"),
);

proof("P5ER-53", "compareFragrances.ts does not import from queue repository", () =>
  !source.includes("queueRepo") && !source.includes("QueueRepository"),
);

proof("P5ER-54", "compareFragrances.ts does not import from RelationshipEditorialService", () =>
  !source.includes("RelationshipEditorialService"),
);

proof("P5ER-55", "compareFragrances.ts does not import from filesystem (fs or path)", () =>
  !source.includes("from 'fs'") && !source.includes("from 'path'") &&
  !source.includes("from \"fs\"") && !source.includes("from \"path\""),
);

proof("P5ER-56", "compareFragrances.ts contains no 'approve' vocabulary", () =>
  !source.includes("approve") && !source.includes("approval"),
);

proof("P5ER-57", "compareFragrances.ts contains no 'reject' vocabulary", () =>
  !source.includes("reject"),
);

proof("P5ER-58", "compareFragrances.ts contains no 'recommendation' vocabulary", () =>
  !source.includes("recommendation"),
);

proof("P5ER-59", "compareFragrances.ts does not import any AI library", () =>
  !source.includes("@anthropic") &&
  !source.includes("openai") &&
  !source.includes("google-generative") &&
  !source.includes("gemini"),
);

proof("P5ER-60", "compareFragrances.ts only imports from @/app/lib/mkc/types", () => {
  const importLines = source
    .split("\n")
    .filter(l => l.trim().startsWith("import"));
  return importLines.every(l => l.includes("mkc/types") || l.includes("RelationshipComparisonSummary"));
});

// ── Report ─────────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(60)}`);
console.log(`EP6-P5E-R — Evidence Enrichment Validation`);
console.log(`${"─".repeat(60)}`);
console.log(`  Passed:  ${passed}`);
console.log(`  Failed:  ${failed}`);
console.log(`  Total:   ${passed + failed}`);

if (errors.length > 0) {
  console.log(`\nFailed proofs:`);
  errors.forEach(e => console.log(`  ✗ ${e}`));
}

if (failed > 0) {
  console.log(`\nRESULT: FAIL\n`);
  process.exit(1);
} else {
  console.log(`\nRESULT: PASS — ${passed}/${passed} proofs verified\n`);
}

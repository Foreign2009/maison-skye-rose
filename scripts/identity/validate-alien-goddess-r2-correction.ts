/**
 * EP5-P4H — Alien Goddess R2 Targeted Deterministic Correction Validation Suite
 *
 * Proves that the R2 correction was applied correctly, that all protected
 * artifacts remain unchanged, and that no forbidden mutations occurred.
 *
 *   § 100 — R2 Correction Integrity (native MKC record)  (15 proofs)
 *   § 200 — Reconciliation Record Lifecycle Update        ( 6 proofs)
 *   § 300 — Protected Artifact Immutability               ( 6 proofs)
 *   § 400 — Governance Constraints                        ( 3 proofs)
 *
 * 30 proofs total.
 * Zero AI/API calls. Zero file writes. Zero factory operations.
 */

import { createHash }   from "crypto";
import { readFileSync } from "fs";
import { join }         from "path";

// ── SHA-256 baselines ──────────────────────────────────────────────────────────

// EP5-P4H corrected native MKC record
const NATIVE_R2_SHA256            =
  "6799eb768a6a5e9166244be866316b802e7009719dd123d27ea8bf73a89be8bd";

// Protected artifacts — must remain byte-identical to prior episode baselines
const DRAFT_ALIEN_GODDESS_SHA256  =
  "700593b7fd98cf8339491b74a7f2c6732badb2581ac268636a59c471b7e1cee7";
const FACTORY_LOG_SHA256          =
  "bd825643a2cafdd1adb4a82bfebd4e48465844315e78d039811950820570e33e";
const IDENTITY_REGISTRY_SHA256    =
  "c75f74b56d4c2064b4f00e422c26e454343defc6a8c61df288e4fe8c2c650a1d";
const PRODUCT_REGISTRY_SHA256     =
  "6d064d2b471bb0ff8da58e2cb5dd27d69bf70980e19ddd3041298e2eb8a5af0b";
const MIPRUN_AUDIT_SHA256         =
  "bd3e1f227a35f5929e0474516bafd3d5a7e9d460b923659f2fdf27be0a817353";
// EP5-P4G-R amended research results — must remain byte-identical (no further mutations)
const RESEARCH_RESULTS_SHA256     =
  "741787b194abb320609ab3fd83ed4c15daead2fe11c8bf760364ae60d033a5e4";

// ── File paths ─────────────────────────────────────────────────────────────────

const ROOT = process.cwd();

const NATIVE_PATH            = join(ROOT, "app", "lib", "mkc", "native", "alien-goddess-inspired.ts");
const DRAFT_PATH             = join(ROOT, "scripts", "factory", "drafts", "alien-goddess-inspired.ts");
const FACTORY_LOG_PATH       = join(ROOT, "scripts", "factory", "factory-log.json");
const REGISTRY_PATH          = join(ROOT, "app", "lib", "identity", "data", "identity-registry.json");
const PRODUCT_REG_PATH       = join(ROOT, "app", "lib", "identity", "data", "identity-product-registry.json");
const MIPRUN_AUDIT_PATH      = join(ROOT, "scripts", "factory", "identity", "identity-qualified-run-audit.json");
const RESEARCH_RESULTS_PATH  = join(ROOT, "data", "identity", "research-results", "MIP-000012-alien-goddess-authoritative-results.json");
const RECONCILIATION_PATH    = join(ROOT, "app", "lib", "identity", "data", "reconciliation", "MIP-000012-alien-goddess-reconciliation.json");
const CONTROLLED_RUNNER_PATH = join(ROOT, "scripts", "factory", "run-identity-qualified-controlled.ts");

// ── Proof harness ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function proof(label: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓  ${label}`);
    passed++;
  } catch (err) {
    console.error(`  ✗  ${label}`);
    console.error(`     ${(err as Error).message}`);
    failed++;
  }
}

function sha256(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

// ── Shared fixtures ────────────────────────────────────────────────────────────

const nativeSource = readFileSync(NATIVE_PATH, "utf-8");

type MaterialIssue = {
  field:            string;
  resolutionStatus: string;
};

type GovernanceObligation = {
  id:     string;
  status: string;
};

type ReconciliationRecord = {
  knowledgeDisposition:      string;
  recommendedClassification: string;
  materialIssues:            MaterialIssue[];
  openGovernanceObligations: GovernanceObligation[];
};

const reconciliation = JSON.parse(
  readFileSync(RECONCILIATION_PATH, "utf-8"),
) as ReconciliationRecord;

// ── § 100 — R2 Correction Integrity ───────────────────────────────────────────

console.log("\n§ 100 — R2 Correction Integrity (native MKC record)");

proof("101: native MKC record file is readable", () => {
  assert(nativeSource.length > 0, "Native MKC source is empty");
});

proof("102: family corrected from [Vanilla, Floral] to [Amber, Floral]", () => {
  assert(
    nativeSource.includes('"Amber"') && nativeSource.includes('"Floral"'),
    'Native source must contain "Amber" and "Floral" in family',
  );
  assert(
    !nativeSource.includes('"Vanilla", "Floral"'),
    'Native source must not contain legacy family ["Vanilla", "Floral"]',
  );
});

proof("103: scentCharacter corrected to Balanced Signature", () => {
  assert(
    nativeSource.includes('scentCharacter: "Balanced Signature"'),
    'scentCharacter must be "Balanced Signature"',
  );
});

proof("104: profile corrected to Amber Floral", () => {
  assert(
    nativeSource.includes('profile       : "Amber Floral"'),
    'profile must be "Amber Floral"',
  );
});

proof("105: notes.top corrected to [Coconut Water, Bergamot]", () => {
  assert(
    nativeSource.includes('"Coconut Water"') && nativeSource.includes('"Bergamot"'),
    'notes.top must contain "Coconut Water" and "Bergamot"',
  );
  assert(
    !nativeSource.includes('"Coconut Milk"'),
    'notes.top must not contain legacy "Coconut Milk"',
  );
  assert(
    !nativeSource.includes('"Yuzu"'),
    'notes.top must not contain legacy "Yuzu"',
  );
});

proof("106: notes.heart corrected to [Jasmine Grandiflorum, Heliotrope]", () => {
  assert(
    nativeSource.includes('"Jasmine Grandiflorum"') && nativeSource.includes('"Heliotrope"'),
    'notes.heart must contain "Jasmine Grandiflorum" and "Heliotrope"',
  );
  assert(
    !nativeSource.includes('"Jasmine Sambac"'),
    'notes.heart must not contain legacy "Jasmine Sambac"',
  );
  assert(
    !nativeSource.includes('"Tuberose"'),
    'notes.heart must not contain legacy "Tuberose"',
  );
});

proof("107: notes.base corrected to [Bourbon Vanilla, Cashmeran]", () => {
  assert(
    nativeSource.includes('"Bourbon Vanilla"') && nativeSource.includes('"Cashmeran"'),
    'notes.base must contain "Bourbon Vanilla" and "Cashmeran"',
  );
  assert(
    !nativeSource.includes('"Vanilla Absolute"'),
    'notes.base must not contain legacy "Vanilla Absolute"',
  );
  assert(
    !nativeSource.includes('"Sandalwood"'),
    'notes.base must not contain legacy "Sandalwood"',
  );
});

proof("108: description does not name any incorrect legacy ingredients", () => {
  const incorrectIngredients = [
    "Coconut milk", "coconut milk",
    "Yuzu", "yuzu",
    "Jasmine sambac", "jasmine sambac",
    "Tuberose", "tuberose",
    "Vanilla absolute", "vanilla absolute",
    "Sandalwood", "sandalwood",
  ];
  for (const ingredient of incorrectIngredients) {
    assert(
      !nativeSource.includes(ingredient),
      `Description must not contain legacy ingredient "${ingredient}"`,
    );
  }
});

proof("109: description names all correct ingredients", () => {
  const descLower = nativeSource.toLowerCase();
  assert(
    descLower.includes("coconut water") && descLower.includes("bergamot"),
    "Description must name coconut water and bergamot (top notes)",
  );
  assert(
    descLower.includes("jasmine grandiflorum") && descLower.includes("heliotrope"),
    "Description must name jasmine grandiflorum and heliotrope (heart notes)",
  );
  assert(
    descLower.includes("bourbon vanilla") && descLower.includes("cashmeran"),
    "Description must name bourbon vanilla and cashmeran (base notes)",
  );
});

proof("110: relationships field removed (unverified AI-inferred entries eliminated)", () => {
  assert(
    !nativeSource.includes("wardrobePartners"),
    'Native source must not contain "wardrobePartners" (removed per EP5-P4H)',
  );
  assert(
    !nativeSource.includes("delina-inspired"),
    'Native source must not contain "delina-inspired" (unverified relationship removed)',
  );
  assert(
    !nativeSource.includes("baccarat-rouge-540-inspired"),
    'Native source must not contain "baccarat-rouge-540-inspired" (unverified relationship removed)',
  );
});

proof("111: educationTags does not contain contradicted terms", () => {
  assert(
    !nativeSource.includes('"tuberose"'),
    'educationTags must not contain "tuberose" (contradicted by research)',
  );
  assert(
    !nativeSource.includes('"sandalwood"'),
    'educationTags must not contain "sandalwood" (contradicted by research)',
  );
  assert(
    !nativeSource.includes('"long-wearing"'),
    'educationTags must not contain "long-wearing" (policy violation)',
  );
});

proof("112: educationTags contains all correct composition terms", () => {
  assert(nativeSource.includes('"amber"'),      'educationTags must contain "amber"');
  assert(nativeSource.includes('"heliotrope"'), 'educationTags must contain "heliotrope"');
  assert(nativeSource.includes('"bergamot"'),   'educationTags must contain "bergamot"');
  assert(nativeSource.includes('"cashmeran"'),  'educationTags must contain "cashmeran"');
});

proof("113: recommendedFor does not contain policy-violating term long-wearing", () => {
  const rfStart = nativeSource.indexOf("recommendedFor");
  const rfEnd   = nativeSource.indexOf("prices");
  const rfSlice = rfStart > -1 && rfEnd > rfStart ? nativeSource.slice(rfStart, rfEnd) : "";
  assert(
    !rfSlice.includes("long-wearing"),
    'recommendedFor must not contain "long-wearing"',
  );
});

proof("114: recommendedFor does not reference vanilla florals (incorrect family)", () => {
  const rfStart = nativeSource.indexOf("recommendedFor");
  const rfEnd   = nativeSource.indexOf("prices");
  const rfSlice = rfStart > -1 && rfEnd > rfStart ? nativeSource.slice(rfStart, rfEnd) : "";
  assert(
    !rfSlice.includes("vanilla florals"),
    'recommendedFor must not contain "vanilla florals" (incorrect family)',
  );
});

proof("115: recommendedFor does not reference contradicted tuberose", () => {
  const rfStart = nativeSource.indexOf("recommendedFor");
  const rfEnd   = nativeSource.indexOf("prices");
  const rfSlice = rfStart > -1 && rfEnd > rfStart ? nativeSource.slice(rfStart, rfEnd) : "";
  assert(
    !rfSlice.toLowerCase().includes("tuberose"),
    'recommendedFor must not contain "tuberose" (contradicted by research)',
  );
});

// ── § 200 — Reconciliation Record Lifecycle Update ────────────────────────────

console.log("\n§ 200 — Reconciliation Record Lifecycle Update");

proof("201: reconciliation record parses as valid JSON", () => {
  assert(typeof reconciliation === "object" && reconciliation !== null,
    "Reconciliation record must parse as a non-null object");
});

proof("202: knowledgeDisposition updated to r2-correction-applied", () => {
  assert(
    reconciliation.knowledgeDisposition === "r2-correction-applied",
    `Expected knowledgeDisposition "r2-correction-applied", got "${reconciliation.knowledgeDisposition}"`,
  );
});

proof("203: recommendedClassification updated to R2", () => {
  assert(
    reconciliation.recommendedClassification === "R2",
    `Expected recommendedClassification "R2", got "${reconciliation.recommendedClassification}"`,
  );
});

proof("204: all 6 material issues have resolutionStatus resolved-r2-ep5-p4h", () => {
  assert(
    reconciliation.materialIssues.length === 6,
    `Expected 6 material issues, found ${reconciliation.materialIssues.length}`,
  );
  for (const issue of reconciliation.materialIssues) {
    assert(
      issue.resolutionStatus === "resolved-r2-ep5-p4h",
      `Issue "${issue.field}" resolutionStatus must be "resolved-r2-ep5-p4h", got "${issue.resolutionStatus}"`,
    );
  }
});

proof("205: OGO-001 (relationships review) is resolved", () => {
  const ogo = reconciliation.openGovernanceObligations.find(o => o.id === "OGO-001");
  if (!ogo) throw new Error("OGO-001 not found in openGovernanceObligations");
  assert(ogo.status === "resolved", `OGO-001 status must be "resolved", got "${ogo.status}"`);
});

proof("206: OGO-002 (education linkage review) is resolved", () => {
  const ogo = reconciliation.openGovernanceObligations.find(o => o.id === "OGO-002");
  if (!ogo) throw new Error("OGO-002 not found in openGovernanceObligations");
  assert(ogo.status === "resolved", `OGO-002 status must be "resolved", got "${ogo.status}"`);
});

// ── § 300 — Protected Artifact Immutability ───────────────────────────────────

console.log("\n§ 300 — Protected Artifact Immutability");

proof("301: legacy draft alien-goddess-inspired.ts is byte-identical to EP5-P4F baseline", () => {
  const actual = sha256(DRAFT_PATH);
  assert(actual === DRAFT_ALIEN_GODDESS_SHA256,
    `Legacy draft SHA changed!\n     expected: ${DRAFT_ALIEN_GODDESS_SHA256}\n       actual: ${actual}`);
});

proof("302: factory-log.json is byte-identical to EP5-P4F baseline", () => {
  const actual = sha256(FACTORY_LOG_PATH);
  assert(actual === FACTORY_LOG_SHA256,
    `Factory log SHA changed!\n     expected: ${FACTORY_LOG_SHA256}\n       actual: ${actual}`);
});

proof("303: identity-registry.json is byte-identical to EP5-P3D baseline", () => {
  const actual = sha256(REGISTRY_PATH);
  assert(actual === IDENTITY_REGISTRY_SHA256,
    `Identity registry SHA changed!\n     expected: ${IDENTITY_REGISTRY_SHA256}\n       actual: ${actual}`);
});

proof("304: identity-product-registry.json is byte-identical to EP5-P4B baseline", () => {
  const actual = sha256(PRODUCT_REG_PATH);
  assert(actual === PRODUCT_REGISTRY_SHA256,
    `Product registry SHA changed!\n     expected: ${PRODUCT_REGISTRY_SHA256}\n       actual: ${actual}`);
});

proof("305: MIPRUN audit is byte-identical to EP5-P4E-A baseline", () => {
  const actual = sha256(MIPRUN_AUDIT_PATH);
  assert(actual === MIPRUN_AUDIT_SHA256,
    `MIPRUN audit SHA changed!\n     expected: ${MIPRUN_AUDIT_SHA256}\n       actual: ${actual}`);
});

proof("306: research results JSON is byte-identical to EP5-P4G-R baseline (no further mutation)", () => {
  const actual = sha256(RESEARCH_RESULTS_PATH);
  assert(actual === RESEARCH_RESULTS_SHA256,
    `Research results SHA changed!\n     expected: ${RESEARCH_RESULTS_SHA256}\n       actual: ${actual}`);
});

// ── § 400 — Governance Constraints ────────────────────────────────────────────

console.log("\n§ 400 — Governance Constraints");

proof("401: controlled runner APPROVED_IDENTITY_ID = null (remains disarmed)", () => {
  const source = readFileSync(CONTROLLED_RUNNER_PATH, "utf-8");
  assert(
    source.includes("const APPROVED_IDENTITY_ID: IdentityId | null = null;"),
    "Controlled runner must remain disarmed: APPROVED_IDENTITY_ID must be null",
  );
});

proof("402: controlled runner FORCE = false", () => {
  const source = readFileSync(CONTROLLED_RUNNER_PATH, "utf-8");
  assert(
    source.includes("const FORCE: boolean = false;"),
    "Controlled runner FORCE must remain false",
  );
});

proof("403: native MKC record SHA matches EP5-P4H R2 correction baseline", () => {
  const actual = sha256(NATIVE_PATH);
  assert(actual === NATIVE_R2_SHA256,
    `Native MKC SHA mismatch!\n     expected: ${NATIVE_R2_SHA256}\n       actual: ${actual}`);
});

// ── Final summary ──────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(60)}`);
console.log(`EP5-P4H R2 Correction Validation: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}

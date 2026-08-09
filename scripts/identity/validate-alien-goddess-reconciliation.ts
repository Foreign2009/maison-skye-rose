/**
 * EP5-P4F — Alien Goddess Knowledge Reconciliation Validation Suite
 *
 * Validates the durable governance artifacts created in EP5-P4F Phase 2:
 *   § 100 — Reconciliation record invariants      (12 proofs)
 *   § 200 — Material issues coverage              ( 7 proofs)
 *   § 300 — Research contract structure           (10 proofs)
 *   § 400 — Historical artifact immutability      (11 proofs)
 *
 * 40 proofs total.
 * Zero AI/API calls. Zero file writes. Zero factory operations.
 */

import { createHash }   from "crypto";
import { readFileSync } from "fs";
import { join }         from "path";

// ── SHA-256 baselines for all protected historical artifacts ───────────────────

const NATIVE_ALIEN_GODDESS_SHA256 =
  "de22896a3c5c0534a4729369a51d435686e14a89ddd081ed88e473bd0d5858e4";
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

// ── File paths ─────────────────────────────────────────────────────────────────

const ROOT = process.cwd();

const RECONCILIATION_PATH = join(
  ROOT, "app", "lib", "identity", "data", "reconciliation",
  "MIP-000012-alien-goddess-reconciliation.json",
);
const RESEARCH_REQUEST_PATH = join(
  ROOT, "data", "identity", "research-requests",
  "alien-goddess-authoritative-research.json",
);
const NATIVE_PATH            = join(ROOT, "app", "lib", "mkc", "native", "alien-goddess-inspired.ts");
const DRAFT_PATH             = join(ROOT, "scripts", "factory", "drafts", "alien-goddess-inspired.ts");
const FACTORY_LOG_PATH       = join(ROOT, "scripts", "factory", "factory-log.json");
const REGISTRY_PATH          = join(ROOT, "app", "lib", "identity", "data", "identity-registry.json");
const PRODUCT_REG_PATH       = join(ROOT, "app", "lib", "identity", "data", "identity-product-registry.json");
const MIPRUN_AUDIT_PATH      = join(ROOT, "scripts", "factory", "identity", "identity-qualified-run-audit.json");
const CONTROLLED_RUNNER_PATH = join(ROOT, "scripts", "factory", "run-identity-qualified-controlled.ts");

// ── Known constants ────────────────────────────────────────────────────────────

const EXPECTED_IDENTITY_ID      = "MIP-000012";
const EXPECTED_CANONICAL_NAME   = "Alien Goddess";
const EXPECTED_CANONICAL_BRAND  = "Mugler";
const EXPECTED_SLUG             = "alien-goddess-inspired";
const EXPECTED_COLLECTION       = "Rose";
const EXPECTED_DISPOSITION      = "hold-pending-authoritative-research";
const EXPECTED_CLASSIFICATION   = "R3";
const EXPECTED_FACTORY_VERSION  = "0.5.0";
const EXPECTED_PROMOTION_STATUS = "unresolved";
const EXPECTED_DRAFT_REVIEW     = "unreviewed";
const EXPECTED_RUN_ID           = "MIPRUN-DZOn_xTBLM5h";
const EXPECTED_PIPELINE_OUTCOME = "skipped";
const EXPECTED_MATERIAL_ISSUES  = 6;
const EXPECTED_MIPRUN_RECORDS   = 2;
const EXPECTED_MAPPING_COUNT    = 1;

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

type MaterialIssue = {
  field:                string;
  legacyValue:          unknown;
  currentResearchValue: unknown;
  classification:       string;
  risk:                 string;
  resolutionStatus:     string;
};

type ReconciliationRecord = {
  version:                   string;
  identityId:                string;
  canonicalName:             string;
  canonicalBrand:            string;
  maisonSlug:                string;
  collection:                string;
  knowledgeDisposition:      string;
  recommendedClassification: string;
  legacyProvenance: {
    factoryVersion:    string;
    promotionStatus:   string;
    draftReviewStatus: string;
  };
  identityQualification: {
    runId:           string;
    pipelineOutcome: string;
  };
  materialIssues: MaterialIssue[];
};

type ConflictPolicy = {
  instruction:   string;
  conflictTypes: string[];
  resolution:    string;
};

type EvidenceCaptureContract = {
  requiredFields:   string[];
  fieldDefinitions: Record<string, string>;
  conflictPolicy:   ConflictPolicy;
};

type ResearchQuestion = {
  id:       string;
  field:    string;
  priority: string;
};

type ResearchRequest = {
  version:                 string;
  identityId:              string;
  canonicalName:           string;
  sourceHierarchy:         { tier1: object; tier2: object; tier3: object };
  researchQuestions:       ResearchQuestion[];
  evidenceCaptureContract: EvidenceCaptureContract;
  exclusions: {
    aiSubstitution: string;
  };
};

const reconciliation  = JSON.parse(readFileSync(RECONCILIATION_PATH,    "utf-8")) as ReconciliationRecord;
const researchRequest = JSON.parse(readFileSync(RESEARCH_REQUEST_PATH,  "utf-8")) as ResearchRequest;

// ── § 100 — Reconciliation Record Invariants ──────────────────────────────────

console.log("\n§ 100 — Reconciliation Record Invariants");

proof("101: reconciliation record parses as valid JSON with version 1.0.0", () => {
  assert(typeof reconciliation === "object" && reconciliation !== null,
    "Reconciliation record must parse as a non-null object");
  assert(reconciliation.version === "1.0.0",
    `Expected version 1.0.0, got "${reconciliation.version}"`);
});

proof("102: identityId = MIP-000012", () => {
  assert(reconciliation.identityId === EXPECTED_IDENTITY_ID,
    `Expected identityId "${EXPECTED_IDENTITY_ID}", got "${reconciliation.identityId}"`);
});

proof("103: maisonSlug = alien-goddess-inspired", () => {
  assert(reconciliation.maisonSlug === EXPECTED_SLUG,
    `Expected maisonSlug "${EXPECTED_SLUG}", got "${reconciliation.maisonSlug}"`);
});

proof("104: canonical identity = Alien Goddess / Mugler", () => {
  assert(reconciliation.canonicalName === EXPECTED_CANONICAL_NAME,
    `Expected canonicalName "${EXPECTED_CANONICAL_NAME}", got "${reconciliation.canonicalName}"`);
  assert(reconciliation.canonicalBrand === EXPECTED_CANONICAL_BRAND,
    `Expected canonicalBrand "${EXPECTED_CANONICAL_BRAND}", got "${reconciliation.canonicalBrand}"`);
});

proof("105: collection = Rose", () => {
  assert(reconciliation.collection === EXPECTED_COLLECTION,
    `Expected collection "${EXPECTED_COLLECTION}", got "${reconciliation.collection}"`);
});

proof("106: knowledgeDisposition = hold-pending-authoritative-research", () => {
  assert(reconciliation.knowledgeDisposition === EXPECTED_DISPOSITION,
    `Expected disposition "${EXPECTED_DISPOSITION}", got "${reconciliation.knowledgeDisposition}"`);
});

proof("107: recommendedClassification = R3", () => {
  assert(reconciliation.recommendedClassification === EXPECTED_CLASSIFICATION,
    `Expected classification "${EXPECTED_CLASSIFICATION}", got "${reconciliation.recommendedClassification}"`);
});

proof("108: legacy factory version = 0.5.0", () => {
  assert(reconciliation.legacyProvenance.factoryVersion === EXPECTED_FACTORY_VERSION,
    `Expected factoryVersion "${EXPECTED_FACTORY_VERSION}", got "${reconciliation.legacyProvenance.factoryVersion}"`);
});

proof("109: legacy promotion provenance = unresolved", () => {
  assert(reconciliation.legacyProvenance.promotionStatus === EXPECTED_PROMOTION_STATUS,
    `Expected promotionStatus "${EXPECTED_PROMOTION_STATUS}", got "${reconciliation.legacyProvenance.promotionStatus}"`);
});

proof("110: legacy draft review = unreviewed", () => {
  assert(reconciliation.legacyProvenance.draftReviewStatus === EXPECTED_DRAFT_REVIEW,
    `Expected draftReviewStatus "${EXPECTED_DRAFT_REVIEW}", got "${reconciliation.legacyProvenance.draftReviewStatus}"`);
});

proof("111: MIPRUN-DZOn_xTBLM5h referenced in reconciliation record", () => {
  assert(reconciliation.identityQualification.runId === EXPECTED_RUN_ID,
    `Expected runId "${EXPECTED_RUN_ID}", got "${reconciliation.identityQualification.runId}"`);
});

proof("112: MIPRUN pipeline outcome = skipped", () => {
  assert(reconciliation.identityQualification.pipelineOutcome === EXPECTED_PIPELINE_OUTCOME,
    `Expected pipelineOutcome "${EXPECTED_PIPELINE_OUTCOME}", got "${reconciliation.identityQualification.pipelineOutcome}"`);
});

// ── § 200 — Material Issues Coverage ─────────────────────────────────────────

console.log("\n§ 200 — Material Issues Coverage");

proof("201: reconciliation record contains 6 material issues", () => {
  const count = reconciliation.materialIssues.length;
  assert(count === EXPECTED_MATERIAL_ISSUES,
    `Expected ${EXPECTED_MATERIAL_ISSUES} material issues, found ${count}`);
});

proof("202: family divergence captured as CONTRADICTED / HIGH risk", () => {
  const issue = reconciliation.materialIssues.find(i => i.field === "family");
  if (!issue) throw new Error('No material issue with field "family" found');
  assert(issue.classification === "CONTRADICTED",
    `Expected family classification CONTRADICTED, got "${issue.classification}"`);
  assert(issue.risk === "HIGH",
    `Expected family risk HIGH, got "${issue.risk}"`);
});

proof("203: profile divergence captured as CONTRADICTED", () => {
  const issue = reconciliation.materialIssues.find(i => i.field === "profile");
  if (!issue) throw new Error('No material issue with field "profile" found');
  assert(issue.classification === "CONTRADICTED",
    `Expected profile classification CONTRADICTED, got "${issue.classification}"`);
});

proof("204: top-note divergence captured as CONTRADICTED / HIGH risk", () => {
  const issue = reconciliation.materialIssues.find(i => i.field === "notes.top");
  if (!issue) throw new Error('No material issue with field "notes.top" found');
  assert(issue.classification === "CONTRADICTED",
    `Expected notes.top classification CONTRADICTED, got "${issue.classification}"`);
  assert(issue.risk === "HIGH",
    `Expected notes.top risk HIGH, got "${issue.risk}"`);
});

proof("205: heart-note divergence captured as CONTRADICTED / HIGH risk", () => {
  const issue = reconciliation.materialIssues.find(i => i.field === "notes.heart");
  if (!issue) throw new Error('No material issue with field "notes.heart" found');
  assert(issue.classification === "CONTRADICTED",
    `Expected notes.heart classification CONTRADICTED, got "${issue.classification}"`);
  assert(issue.risk === "HIGH",
    `Expected notes.heart risk HIGH, got "${issue.risk}"`);
});

proof("206: base-note divergence captured as CONTRADICTED / HIGH risk", () => {
  const issue = reconciliation.materialIssues.find(i => i.field === "notes.base");
  if (!issue) throw new Error('No material issue with field "notes.base" found');
  assert(issue.classification === "CONTRADICTED",
    `Expected notes.base classification CONTRADICTED, got "${issue.classification}"`);
  assert(issue.risk === "HIGH",
    `Expected notes.base risk HIGH, got "${issue.risk}"`);
});

proof("207: description derivative issue captured as CONTRADICTED / HIGH risk", () => {
  const issue = reconciliation.materialIssues.find(i => i.field === "description");
  if (!issue) throw new Error('No material issue with field "description" found');
  assert(issue.classification.includes("CONTRADICTED"),
    `Expected description classification to include CONTRADICTED, got "${issue.classification}"`);
  assert(issue.risk === "HIGH",
    `Expected description risk HIGH, got "${issue.risk}"`);
});

// ── § 300 — Research Contract Structure ───────────────────────────────────────

console.log("\n§ 300 — Research Contract Structure");

proof("301: research request parses as valid JSON with version 1.0.0", () => {
  assert(typeof researchRequest === "object" && researchRequest !== null,
    "Research request must parse as a non-null object");
  assert(researchRequest.version === "1.0.0",
    `Expected version 1.0.0, got "${researchRequest.version}"`);
  assert(researchRequest.identityId === EXPECTED_IDENTITY_ID,
    `Research request identityId must be ${EXPECTED_IDENTITY_ID}`);
});

proof("302: official source tier (tier1) is represented", () => {
  assert(
    typeof researchRequest.sourceHierarchy?.tier1 === "object" &&
    researchRequest.sourceHierarchy.tier1 !== null,
    "Research request must define sourceHierarchy.tier1",
  );
});

proof("303: conflicting source preservation is supported with conflict types", () => {
  const policy = researchRequest.evidenceCaptureContract?.conflictPolicy;
  assert(typeof policy === "object" && policy !== null,
    "Research request must define evidenceCaptureContract.conflictPolicy");
  assert(typeof policy.instruction === "string" && policy.instruction.length > 0,
    "conflictPolicy must have a non-empty instruction");
  assert(Array.isArray(policy.conflictTypes) && policy.conflictTypes.length > 0,
    "conflictPolicy must define at least one conflictType");
});

proof("304: field-level evidence is supported (field defined in schema)", () => {
  const defs = researchRequest.evidenceCaptureContract?.fieldDefinitions;
  assert(typeof defs === "object" && defs !== null,
    "Research request must define evidenceCaptureContract.fieldDefinitions");
  assert("field" in defs,
    '"field" must be defined in evidenceCaptureContract.fieldDefinitions');
});

proof("305: sourceReference is required in evidence capture", () => {
  const required = researchRequest.evidenceCaptureContract?.requiredFields;
  assert(Array.isArray(required), "requiredFields must be an array");
  assert(required.includes("sourceReference"),
    '"sourceReference" must be in evidenceCaptureContract.requiredFields');
});

proof("306: accessedAt is required in evidence capture", () => {
  const required = researchRequest.evidenceCaptureContract?.requiredFields;
  assert(Array.isArray(required), "requiredFields must be an array");
  assert(required.includes("accessedAt"),
    '"accessedAt" must be in evidenceCaptureContract.requiredFields');
});

proof("307: confidence is required in evidence capture", () => {
  const required = researchRequest.evidenceCaptureContract?.requiredFields;
  assert(Array.isArray(required), "requiredFields must be an array");
  assert(required.includes("confidence"),
    '"confidence" must be in evidenceCaptureContract.requiredFields');
});

proof("308: AI substitution is explicitly excluded (no automatic canonical overwrite)", () => {
  const excl = researchRequest.exclusions?.aiSubstitution;
  assert(typeof excl === "string" && excl.length > 0,
    "Research request must explicitly exclude AI substitution in exclusions.aiSubstitution");
});

proof("309: research request targets the correct canonical identity", () => {
  assert(researchRequest.canonicalName === EXPECTED_CANONICAL_NAME,
    `Research request canonicalName must be "${EXPECTED_CANONICAL_NAME}"`);
});

proof("310: primary research questions cover all 4 critical composition fields", () => {
  const critical = researchRequest.researchQuestions.filter(q => q.priority === "critical");
  const fields   = new Set(critical.map(q => q.field));
  assert(fields.has("family"),      'Critical research questions must include field "family"');
  assert(fields.has("notes.top"),   'Critical research questions must include field "notes.top"');
  assert(fields.has("notes.heart"), 'Critical research questions must include field "notes.heart"');
  assert(fields.has("notes.base"),  'Critical research questions must include field "notes.base"');
});

// ── § 400 — Historical Artifact Immutability ──────────────────────────────────

console.log("\n§ 400 — Historical Artifact Immutability");

proof("401: native alien-goddess-inspired.ts is byte-identical to EP5-P4F baseline", () => {
  const actual = sha256(NATIVE_PATH);
  assert(actual === NATIVE_ALIEN_GODDESS_SHA256,
    `Native MKC record SHA changed!\n     expected: ${NATIVE_ALIEN_GODDESS_SHA256}\n       actual: ${actual}`);
});

proof("402: legacy draft alien-goddess-inspired.ts is byte-identical to EP5-P4F baseline", () => {
  const actual = sha256(DRAFT_PATH);
  assert(actual === DRAFT_ALIEN_GODDESS_SHA256,
    `Legacy draft SHA changed!\n     expected: ${DRAFT_ALIEN_GODDESS_SHA256}\n       actual: ${actual}`);
});

proof("403: factory-log.json is byte-identical to EP5-P4F baseline", () => {
  const actual = sha256(FACTORY_LOG_PATH);
  assert(actual === FACTORY_LOG_SHA256,
    `Factory log SHA changed!\n     expected: ${FACTORY_LOG_SHA256}\n       actual: ${actual}`);
});

proof("404: identity-registry.json is byte-identical to EP5-P3D baseline", () => {
  const actual = sha256(REGISTRY_PATH);
  assert(actual === IDENTITY_REGISTRY_SHA256,
    `Identity registry SHA changed!\n     expected: ${IDENTITY_REGISTRY_SHA256}\n       actual: ${actual}`);
});

proof("405: identity-product-registry.json is byte-identical to EP5-P4B baseline", () => {
  const actual = sha256(PRODUCT_REG_PATH);
  assert(actual === PRODUCT_REGISTRY_SHA256,
    `Product registry SHA changed!\n     expected: ${PRODUCT_REGISTRY_SHA256}\n       actual: ${actual}`);
});

proof("406: MIPRUN audit is byte-identical to EP5-P4E-A baseline", () => {
  const actual = sha256(MIPRUN_AUDIT_PATH);
  assert(actual === MIPRUN_AUDIT_SHA256,
    `MIPRUN audit SHA changed!\n     expected: ${MIPRUN_AUDIT_SHA256}\n       actual: ${actual}`);
});

proof("407: MIP-000012 identity status remains verified (no status mutation)", () => {
  type RegistryShape = { identities: { id: string; status: string }[] };
  const reg = JSON.parse(readFileSync(REGISTRY_PATH, "utf-8")) as RegistryShape;
  const mip = reg.identities.find(i => i.id === EXPECTED_IDENTITY_ID);
  if (!mip) throw new Error(`${EXPECTED_IDENTITY_ID} not found in identity registry`);
  assert(mip.status === "verified",
    `${EXPECTED_IDENTITY_ID} status must remain "verified", got "${mip.status}"`);
});

proof("408: identity-product-registry has exactly 1 mapping (no bridge mutation)", () => {
  type BridgeShape = { mappings: { identityId: string }[] };
  const bridge = JSON.parse(readFileSync(PRODUCT_REG_PATH, "utf-8")) as BridgeShape;
  const count  = bridge.mappings.length;
  assert(count === EXPECTED_MAPPING_COUNT,
    `Expected ${EXPECTED_MAPPING_COUNT} mapping(s), found ${count}`);
  assert(bridge.mappings[0].identityId === EXPECTED_IDENTITY_ID,
    `First mapping identityId must be ${EXPECTED_IDENTITY_ID}`);
});

proof("409: MIPRUN audit has exactly 2 records (no new generation, no new audit appends)", () => {
  type AuditShape = { version: string; records: object[] };
  const audit = JSON.parse(readFileSync(MIPRUN_AUDIT_PATH, "utf-8")) as AuditShape;
  const count = audit.records.length;
  assert(count === EXPECTED_MIPRUN_RECORDS,
    `MIPRUN audit must have exactly ${EXPECTED_MIPRUN_RECORDS} records (no new runs); found ${count}`);
});

proof("410: controlled runner has APPROVED_IDENTITY_ID = null (remains disarmed)", () => {
  const source = readFileSync(CONTROLLED_RUNNER_PATH, "utf-8");
  assert(
    source.includes("const APPROVED_IDENTITY_ID: IdentityId | null = null;"),
    "Controlled runner must remain disarmed: APPROVED_IDENTITY_ID must be null",
  );
});

proof("411: controlled runner has FORCE = false", () => {
  const source = readFileSync(CONTROLLED_RUNNER_PATH, "utf-8");
  assert(
    source.includes("const FORCE: boolean = false;"),
    "Controlled runner FORCE must remain false",
  );
});

// ── Final summary ──────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(60)}`);
console.log(`EP5-P4F Reconciliation Validation: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}

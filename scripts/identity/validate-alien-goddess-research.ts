/**
 * EP5-P4G — Alien Goddess Authoritative Research Validation Suite
 *
 * Validates the persisted research-result artifact and proves historical
 * artifact immutability. Does NOT test live web availability.
 */

import { readFileSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

const ROOT = join(__dirname, "../..");

// ── SHA-256 baselines (established in EP5-P4F Phase 2) ────────────────────────
const NATIVE_ALIEN_GODDESS_SHA256 =
  "de22896a3c5c0534a4729369a51d435686e14a89ddd081ed88e473bd0d5858e4";
const DRAFT_ALIEN_GODDESS_SHA256 =
  "700593b7fd98cf8339491b74a7f2c6732badb2581ac268636a59c471b7e1cee7";
const FACTORY_LOG_SHA256 =
  "bd825643a2cafdd1adb4a82bfebd4e48465844315e78d039811950820570e33e";
const IDENTITY_REGISTRY_SHA256 =
  "c75f74b56d4c2064b4f00e422c26e454343defc6a8c61df288e4fe8c2c650a1d";
const PRODUCT_REGISTRY_SHA256 =
  "6d064d2b471bb0ff8da58e2cb5dd27d69bf70980e19ddd3041298e2eb8a5af0b";
const MIPRUN_AUDIT_SHA256 =
  "bd3e1f227a35f5929e0474516bafd3d5a7e9d460b923659f2fdf27be0a817353";

const EXPECTED_MIPRUN_RECORDS  = 2;
const EXPECTED_BRIDGE_MAPPINGS = 1;

// ── File paths ─────────────────────────────────────────────────────────────────
const RESULTS_PATH          = join(ROOT, "data/identity/research-results/MIP-000012-alien-goddess-authoritative-results.json");
const NATIVE_PATH           = join(ROOT, "app/lib/mkc/native/alien-goddess-inspired.ts");
const DRAFT_PATH            = join(ROOT, "scripts/factory/drafts/alien-goddess-inspired.ts");
const FACTORY_LOG_PATH      = join(ROOT, "scripts/factory/factory-log.json");
const IDENTITY_REGISTRY_PATH= join(ROOT, "app/lib/identity/data/identity-registry.json");
const PRODUCT_REGISTRY_PATH = join(ROOT, "app/lib/identity/data/identity-product-registry.json");
const MIPRUN_AUDIT_PATH     = join(ROOT, "scripts/factory/identity/identity-qualified-run-audit.json");
const CONTROLLED_RUNNER_PATH= join(ROOT, "scripts/factory/run-identity-qualified-controlled.ts");

// ── Proof harness ──────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function proof(label: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓ ${label}`);
    passed++;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ ${label}`);
    console.error(`      ${msg}`);
    failed++;
  }
}

function sha256(filePath: string): string {
  const content = readFileSync(filePath);
  return createHash("sha256").update(content).digest("hex");
}

// ── Type shapes ────────────────────────────────────────────────────────────────
interface FindingShape {
  sourceId?: string;
  field: string;
  sourceType: string;
  sourceName: string;
  sourceReference: string;
  accessedAt: string;
  observedValue: unknown;
  confidence: string;
}

interface SourceShape {
  sourceId: string;
  sourceType: string;
  tier: number;
  accessMethod?: string;
  directAccessResult?: string;
}

interface DirectAccessAttempt {
  domain: string;
  result: string;
  note?: string;
}

interface ThreeWayShape {
  field: string;
  verdict: string;
}

interface MatrixEntryShape {
  field: string;
  recommendedNextAction: string;
}

interface ResolutionShape {
  classification: string;
  founderDecisionRequired: boolean;
  fieldsRequiringChange: Array<{ field: string; action: string }>;
  fieldsConfirmedCorrect: string[];
}

interface ResultsShape {
  version: string;
  requestId: string;
  requestStatus: string;
  executedBy: string;
  amendedBy?: string;
  identityId: string;
  canonicalName: string;
  canonicalBrand: string;
  maisonSlug: string;
  researchDisposition: string;
  accessNotes?: string;
  directAccessAttempts?: DirectAccessAttempt[];
  flankerExclusionConfirmed: boolean;
  sourcesConsulted: SourceShape[];
  findings: FindingShape[];
  identifiedConflicts: unknown[];
  threeWayComparison: ThreeWayShape[];
  fieldDecisionMatrix: MatrixEntryShape[];
  resolutionRecommendation: ResolutionShape;
}

interface AuditShape {
  records: unknown[];
}

interface BridgeShape {
  mappings: unknown[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// § 100 — Research Results Invariants
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n§ 100 — Research Results Invariants");

let results: ResultsShape;

proof("101: research results file parses as valid JSON", () => {
  const raw = readFileSync(RESULTS_PATH, "utf-8");
  results = JSON.parse(raw) as ResultsShape;
  assert(typeof results === "object" && results !== null, "Not an object");
});

proof("102: requestId = RR-MIP-000012-001", () => {
  assert(results.requestId === "RR-MIP-000012-001", `Expected RR-MIP-000012-001, got ${results.requestId}`);
});

proof("103: requestStatus = completed", () => {
  assert(results.requestStatus === "completed", `Expected completed, got ${results.requestStatus}`);
});

proof("104: identityId = MIP-000012", () => {
  assert(results.identityId === "MIP-000012", `Expected MIP-000012, got ${results.identityId}`);
});

proof("105: canonicalName = Alien Goddess", () => {
  assert(results.canonicalName === "Alien Goddess", `Expected Alien Goddess, got ${results.canonicalName}`);
});

proof("106: canonicalBrand = Mugler", () => {
  assert(results.canonicalBrand === "Mugler", `Expected Mugler, got ${results.canonicalBrand}`);
});

proof("107: maisonSlug = alien-goddess-inspired", () => {
  assert(results.maisonSlug === "alien-goddess-inspired", `Expected alien-goddess-inspired, got ${results.maisonSlug}`);
});

proof("108: executedBy = EP5-P4G", () => {
  assert(results.executedBy === "EP5-P4G", `Expected EP5-P4G, got ${results.executedBy}`);
});

proof("109: researchDisposition is present and non-empty", () => {
  assert(typeof results.researchDisposition === "string" && results.researchDisposition.length > 0, "researchDisposition missing or empty");
});

proof("110: flankerExclusionConfirmed = true", () => {
  assert(results.flankerExclusionConfirmed === true, "flankerExclusionConfirmed must be true");
});

proof("111: sourcesConsulted array is non-empty", () => {
  assert(Array.isArray(results.sourcesConsulted) && results.sourcesConsulted.length > 0, "sourcesConsulted must be non-empty");
});

proof("112: at least one Tier 1 (official-brand) source is present", () => {
  const tier1 = results.sourcesConsulted.filter(s => s.tier === 1);
  assert(tier1.length > 0, "No Tier 1 source found in sourcesConsulted");
});

proof("113: at least one Tier 2 (strong-secondary) source is present", () => {
  const tier2 = results.sourcesConsulted.filter(s => s.tier === 2);
  assert(tier2.length > 0, "No Tier 2 source found in sourcesConsulted");
});

proof("114: findings array is non-empty (≥ 10 entries)", () => {
  assert(Array.isArray(results.findings) && results.findings.length >= 10, `Expected ≥10 findings, got ${results.findings?.length ?? 0}`);
});

proof("115: every finding has all required schema fields", () => {
  const required = ["sourceType", "sourceName", "sourceReference", "accessedAt", "field", "observedValue", "confidence"] as const;
  results.findings.forEach((f, i) => {
    required.forEach(key => {
      assert(key in f && (f as unknown as Record<string, unknown>)[key] !== undefined, `Finding[${i}] missing required field: ${key}`);
    });
  });
});

proof("116: identifiedConflicts array is present", () => {
  assert(Array.isArray(results.identifiedConflicts), "identifiedConflicts must be an array");
});

proof("117: threeWayComparison array is non-empty (≥ 8 entries)", () => {
  assert(Array.isArray(results.threeWayComparison) && results.threeWayComparison.length >= 8, `Expected ≥8 entries, got ${results.threeWayComparison?.length ?? 0}`);
});

proof("118: fieldDecisionMatrix array is non-empty (≥ 10 entries)", () => {
  assert(Array.isArray(results.fieldDecisionMatrix) && results.fieldDecisionMatrix.length >= 10, `Expected ≥10 entries, got ${results.fieldDecisionMatrix?.length ?? 0}`);
});

proof("119: resolutionRecommendation is present", () => {
  assert(typeof results.resolutionRecommendation === "object" && results.resolutionRecommendation !== null, "resolutionRecommendation missing");
});

proof("120: resolutionRecommendation.founderDecisionRequired = true", () => {
  assert(results.resolutionRecommendation.founderDecisionRequired === true, "founderDecisionRequired must be true");
});

// ═══════════════════════════════════════════════════════════════════════════════
// § 200 — Field Coverage
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n§ 200 — Field Coverage");

function findingsFor(field: string): FindingShape[] {
  return results.findings.filter(f => f.field === field || f.field.startsWith(field));
}

proof("201: family finding present (≥ 1 entry)", () => {
  assert(findingsFor("family").length >= 1, "No finding for field 'family'");
});

proof("202: notes.top finding present (≥ 1 entry)", () => {
  assert(findingsFor("notes.top").length >= 1, "No finding for field 'notes.top'");
});

proof("203: notes.heart finding present (≥ 1 entry)", () => {
  assert(findingsFor("notes.heart").length >= 1, "No finding for field 'notes.heart'");
});

proof("204: notes.base finding present (≥ 1 entry)", () => {
  assert(findingsFor("notes.base").length >= 1, "No finding for field 'notes.base'");
});

proof("205: launchYear finding present", () => {
  assert(findingsFor("launchYear").length >= 1, "No finding for field 'launchYear'");
});

proof("206: marketedGender finding present", () => {
  assert(findingsFor("marketedGender").length >= 1, "No finding for field 'marketedGender'");
});

proof("207: perfumer finding present", () => {
  assert(findingsFor("perfumer").length >= 1, "No finding for field 'perfumer'");
});

proof("208: brand naming finding present", () => {
  assert(findingsFor("brand naming").length >= 1, "No finding for field 'brand naming'");
});

proof("209: at least one finding has a conflictType (conflict preservation active)", () => {
  const withConflict = results.findings.filter(f => "conflictType" in f);
  assert(withConflict.length >= 1, "No findings with conflictType — conflict preservation may be inactive");
});

proof("210: no finding uses empty string as observedValue (verbatim preservation)", () => {
  const empty = results.findings.filter(f => f.observedValue === "");
  assert(empty.length === 0, `${empty.length} finding(s) have empty observedValue — verbatim preservation may have failed`);
});

// ═══════════════════════════════════════════════════════════════════════════════
// § 300 — Authoritative Evidence for Critical Fields
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n§ 300 — Authoritative Evidence for Critical Fields");

proof("301: official-brand source present for notes.top", () => {
  const brandFindings = results.findings.filter(f => f.field === "notes.top" && f.sourceType === "official-brand");
  assert(brandFindings.length >= 1, "No official-brand finding for notes.top");
});

proof("302: official-brand source present for notes.heart", () => {
  const brandFindings = results.findings.filter(f => f.field === "notes.heart" && f.sourceType === "official-brand");
  assert(brandFindings.length >= 1, "No official-brand finding for notes.heart");
});

proof("303: official-brand source present for notes.base", () => {
  const brandFindings = results.findings.filter(f => f.field === "notes.base" && f.sourceType === "official-brand");
  assert(brandFindings.length >= 1, "No official-brand finding for notes.base");
});

proof("304: official-brand source present for family", () => {
  const brandFindings = results.findings.filter(f => f.field === "family" && f.sourceType === "official-brand");
  assert(brandFindings.length >= 1, "No official-brand finding for family");
});

proof("305: authoritative evidence includes bergamot for notes.top", () => {
  const topFindings = results.findings.filter(f => f.field === "notes.top" && f.sourceType === "official-brand");
  const hasBergamot = topFindings.some(f => {
    const v = JSON.stringify(f.observedValue).toLowerCase();
    return v.includes("bergamot");
  });
  assert(hasBergamot, "No official-brand notes.top finding includes bergamot");
});

proof("306: authoritative evidence includes coconut water for notes.top", () => {
  const topFindings = results.findings.filter(f => f.field === "notes.top" && f.sourceType === "official-brand");
  const hasCoconut = topFindings.some(f => {
    const v = JSON.stringify(f.observedValue).toLowerCase();
    return v.includes("coconut water");
  });
  assert(hasCoconut, "No official-brand notes.top finding includes coconut water");
});

proof("307: authoritative evidence includes jasmine for notes.heart", () => {
  const heartFindings = results.findings.filter(f => f.field === "notes.heart" && f.sourceType === "official-brand");
  const hasJasmine = heartFindings.some(f => {
    const v = JSON.stringify(f.observedValue).toLowerCase();
    return v.includes("jasmine");
  });
  assert(hasJasmine, "No official-brand notes.heart finding includes jasmine");
});

proof("308: authoritative evidence includes heliotrope for notes.heart", () => {
  const heartFindings = results.findings.filter(f => f.field === "notes.heart" && f.sourceType === "official-brand");
  const hasHeliotrope = heartFindings.some(f => {
    const v = JSON.stringify(f.observedValue).toLowerCase();
    return v.includes("heliotrope");
  });
  assert(hasHeliotrope, "No official-brand notes.heart finding includes heliotrope");
});

proof("309: authoritative evidence includes bourbon vanilla for notes.base", () => {
  const baseFindings = results.findings.filter(f => f.field === "notes.base" && f.sourceType === "official-brand");
  const hasVanilla = baseFindings.some(f => {
    const v = JSON.stringify(f.observedValue).toLowerCase();
    return v.includes("bourbon vanilla") || v.includes("vanilla bourbon");
  });
  assert(hasVanilla, "No official-brand notes.base finding includes bourbon vanilla");
});

proof("310: authoritative evidence includes cashmeran for notes.base", () => {
  const baseFindings = results.findings.filter(f => f.field === "notes.base" && f.sourceType === "official-brand");
  const hasCashmeran = baseFindings.some(f => {
    const v = JSON.stringify(f.observedValue).toLowerCase();
    return v.includes("cashmeran");
  });
  assert(hasCashmeran, "No official-brand notes.base finding includes cashmeran");
});

proof("311: three-way comparison contains 'MIP_RESEARCH_CONFIRMED' verdict for family", () => {
  const entry = results.threeWayComparison.find(e => e.field === "family");
  if (!entry) throw new Error("No three-way comparison entry for 'family'");
  assert(entry.verdict === "MIP_RESEARCH_CONFIRMED", `Expected MIP_RESEARCH_CONFIRMED, got ${entry.verdict}`);
});

proof("312: three-way comparison contains 'MIP_RESEARCH_CONFIRMED' verdict for notes.top", () => {
  const entry = results.threeWayComparison.find(e => e.field === "notes.top");
  if (!entry) throw new Error("No three-way comparison entry for 'notes.top'");
  assert(entry.verdict === "MIP_RESEARCH_CONFIRMED", `Expected MIP_RESEARCH_CONFIRMED, got ${entry.verdict}`);
});

proof("313: three-way comparison contains 'MIP_RESEARCH_CONFIRMED' verdict for notes.heart", () => {
  const entry = results.threeWayComparison.find(e => e.field === "notes.heart");
  if (!entry) throw new Error("No three-way comparison entry for 'notes.heart'");
  assert(entry.verdict === "MIP_RESEARCH_CONFIRMED", `Expected MIP_RESEARCH_CONFIRMED, got ${entry.verdict}`);
});

proof("314: three-way comparison contains 'MIP_RESEARCH_CONFIRMED' verdict for notes.base", () => {
  const entry = results.threeWayComparison.find(e => e.field === "notes.base");
  if (!entry) throw new Error("No three-way comparison entry for 'notes.base'");
  assert(entry.verdict === "MIP_RESEARCH_CONFIRMED", `Expected MIP_RESEARCH_CONFIRMED, got ${entry.verdict}`);
});

proof("315: resolution recommendation classification = R2", () => {
  assert(results.resolutionRecommendation.classification === "R2", `Expected R2, got ${results.resolutionRecommendation.classification}`);
});

proof("316: fieldsRequiringChange covers the 4 critical composition fields", () => {
  const fields = results.resolutionRecommendation.fieldsRequiringChange.map(f => f.field);
  const critical = ["family", "notes.top", "notes.heart", "notes.base"];
  critical.forEach(c => {
    assert(fields.includes(c), `Critical field '${c}' not in fieldsRequiringChange`);
  });
});

proof("317: fieldsConfirmedCorrect includes gender", () => {
  assert(results.resolutionRecommendation.fieldsConfirmedCorrect.includes("gender"), "gender should be in fieldsConfirmedCorrect");
});

// ═══════════════════════════════════════════════════════════════════════════════
// § 400 — No Knowledge Mutations
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n§ 400 — No Knowledge Mutations");

proof("401: native alien-goddess-inspired.ts is byte-identical to EP5-P4F baseline", () => {
  const actual = sha256(NATIVE_PATH);
  assert(actual === NATIVE_ALIEN_GODDESS_SHA256, `SHA mismatch — native file was modified. Expected ${NATIVE_ALIEN_GODDESS_SHA256}, got ${actual}`);
});

proof("402: draft alien-goddess-inspired.ts is byte-identical to EP5-P4F baseline", () => {
  const actual = sha256(DRAFT_PATH);
  assert(actual === DRAFT_ALIEN_GODDESS_SHA256, `SHA mismatch — draft was modified. Expected ${DRAFT_ALIEN_GODDESS_SHA256}, got ${actual}`);
});

proof("403: factory-log.json is byte-identical to EP5-P4F baseline", () => {
  const actual = sha256(FACTORY_LOG_PATH);
  assert(actual === FACTORY_LOG_SHA256, `SHA mismatch — factory log was modified. Expected ${FACTORY_LOG_SHA256}, got ${actual}`);
});

proof("404: identity-registry.json is byte-identical to EP5-P3D baseline", () => {
  const actual = sha256(IDENTITY_REGISTRY_PATH);
  assert(actual === IDENTITY_REGISTRY_SHA256, `SHA mismatch — identity registry was modified. Expected ${IDENTITY_REGISTRY_SHA256}, got ${actual}`);
});

proof("405: identity-product-registry.json is byte-identical to EP5-P3D baseline", () => {
  const actual = sha256(PRODUCT_REGISTRY_PATH);
  assert(actual === PRODUCT_REGISTRY_SHA256, `SHA mismatch — product registry was modified. Expected ${PRODUCT_REGISTRY_SHA256}, got ${actual}`);
});

proof("406: identity-qualified-run-audit.json is byte-identical to EP5-P4E-A baseline", () => {
  const actual = sha256(MIPRUN_AUDIT_PATH);
  assert(actual === MIPRUN_AUDIT_SHA256, `SHA mismatch — MIPRUN audit was modified. Expected ${MIPRUN_AUDIT_SHA256}, got ${actual}`);
});

proof("407: MIP-000012 identity status remains 'verified'", () => {
  const registry = JSON.parse(readFileSync(IDENTITY_REGISTRY_PATH, "utf-8")) as { identities: Array<{ id: string; status: string }> };
  const mip = registry.identities.find(i => i.id === "MIP-000012");
  if (!mip) throw new Error("MIP-000012 not found in identity registry");
  assert(mip.status === "verified", `Expected status 'verified', got '${mip.status}'`);
});

proof("408: bridge has exactly 1 mapping (no new mappings added)", () => {
  const bridge = JSON.parse(readFileSync(PRODUCT_REGISTRY_PATH, "utf-8")) as BridgeShape;
  assert(bridge.mappings.length === EXPECTED_BRIDGE_MAPPINGS, `Expected ${EXPECTED_BRIDGE_MAPPINGS} mapping(s), got ${bridge.mappings.length}`);
});

proof("409: MIPRUN audit has exactly 2 records (no new runs triggered)", () => {
  const audit = JSON.parse(readFileSync(MIPRUN_AUDIT_PATH, "utf-8")) as AuditShape;
  assert(audit.records.length === EXPECTED_MIPRUN_RECORDS, `Expected ${EXPECTED_MIPRUN_RECORDS} MIPRUN record(s), got ${audit.records.length}`);
});

proof("410: controlled runner has APPROVED_IDENTITY_ID = null (disarmed)", () => {
  const source = readFileSync(CONTROLLED_RUNNER_PATH, "utf-8");
  assert(source.includes("const APPROVED_IDENTITY_ID: IdentityId | null = null;"), "Controlled runner appears armed — APPROVED_IDENTITY_ID is not null");
});

proof("411: controlled runner has FORCE = false", () => {
  const source = readFileSync(CONTROLLED_RUNNER_PATH, "utf-8");
  assert(source.includes("const FORCE: boolean = false;"), "FORCE appears to be true — controlled runner may be armed");
});

// ═══════════════════════════════════════════════════════════════════════════════
// § 500 — Evidence Integrity (EP5-P4G-R hardening)
// ═══════════════════════════════════════════════════════════════════════════════
console.log("\n§ 500 — Evidence Integrity");

proof("501: every source in sourcesConsulted has an accessMethod field", () => {
  results.sourcesConsulted.forEach((s, i) => {
    assert(
      typeof s.accessMethod === "string" && s.accessMethod.length > 0,
      `sourcesConsulted[${i}] (${s.sourceId}) missing accessMethod field`,
    );
  });
});

proof("502: every source in sourcesConsulted has a directAccessResult field", () => {
  results.sourcesConsulted.forEach((s, i) => {
    assert(
      typeof s.directAccessResult === "string" && s.directAccessResult.length > 0,
      `sourcesConsulted[${i}] (${s.sourceId}) missing directAccessResult field`,
    );
  });
});

proof("503: S-001 directAccessResult indicates blocked access", () => {
  const s001 = results.sourcesConsulted.find(s => s.sourceId === "S-001");
  if (!s001) throw new Error("S-001 not found in sourcesConsulted");
  assert(
    s001.directAccessResult === "blocked-403",
    `Expected S-001 directAccessResult=blocked-403, got: ${s001.directAccessResult}`,
  );
});

proof("504: S-002 directAccessResult indicates blocked access", () => {
  const s002 = results.sourcesConsulted.find(s => s.sourceId === "S-002");
  if (!s002) throw new Error("S-002 not found in sourcesConsulted");
  assert(
    s002.directAccessResult === "blocked-403",
    `Expected S-002 directAccessResult=blocked-403, got: ${s002.directAccessResult}`,
  );
});

proof("505: S-003 directAccessResult indicates blocked access", () => {
  const s003 = results.sourcesConsulted.find(s => s.sourceId === "S-003");
  if (!s003) throw new Error("S-003 not found in sourcesConsulted");
  assert(
    s003.directAccessResult === "blocked-403",
    `Expected S-003 directAccessResult=blocked-403, got: ${s003.directAccessResult}`,
  );
});

proof("506: S-006 directAccessResult indicates successful access (only directly-fetched source)", () => {
  const s006 = results.sourcesConsulted.find(s => s.sourceId === "S-006");
  if (!s006) throw new Error("S-006 not found in sourcesConsulted");
  assert(
    s006.directAccessResult === "successful",
    `Expected S-006 directAccessResult=successful, got: ${s006.directAccessResult}`,
  );
});

proof("507: no Tier 1 source has directAccessResult 'successful' (all official Mugler sources blocked)", () => {
  const tier1Direct = results.sourcesConsulted.filter(
    s => s.tier === 1 && s.directAccessResult === "successful",
  );
  assert(
    tier1Direct.length === 0,
    `${tier1Direct.length} Tier 1 source(s) unexpectedly show directAccessResult='successful': ${tier1Direct.map(s => s.sourceId).join(", ")}`,
  );
});

proof("508: no finding from S-001 has confidence 'authoritative'", () => {
  const violations = results.findings.filter(
    f => f.sourceId === "S-001" && f.confidence === "authoritative",
  );
  assert(
    violations.length === 0,
    `${violations.length} finding(s) from S-001 still rated 'authoritative': ${violations.map(f => f.field).join(", ")}`,
  );
});

proof("509: no finding from S-002 has confidence 'authoritative'", () => {
  const violations = results.findings.filter(
    f => f.sourceId === "S-002" && f.confidence === "authoritative",
  );
  assert(
    violations.length === 0,
    `${violations.length} finding(s) from S-002 still rated 'authoritative': ${violations.map(f => f.field).join(", ")}`,
  );
});

proof("510: no finding from a snippet-accessed source has confidence 'authoritative'", () => {
  const snippetSourceIds = results.sourcesConsulted
    .filter(s => s.directAccessResult !== "successful")
    .map(s => s.sourceId);
  const violations = results.findings.filter(
    f => f.sourceId !== undefined && snippetSourceIds.includes(f.sourceId) && f.confidence === "authoritative",
  );
  assert(
    violations.length === 0,
    `${violations.length} finding(s) from snippet-accessed sources still rated 'authoritative': ${violations.map(f => `${f.field}/${f.sourceId}`).join(", ")}`,
  );
});

proof("511: at least one finding from S-001 has confidence 'high' (evidence preserved at correct level)", () => {
  const s001High = results.findings.filter(
    f => f.sourceId === "S-001" && f.confidence === "high",
  );
  assert(
    s001High.length > 0,
    "No S-001 findings rated 'high' — evidence may have been discarded rather than reclassified",
  );
});

proof("512: accessNotes acknowledges that direct access to official Mugler pages was blocked", () => {
  if (!results.accessNotes || results.accessNotes.length === 0) throw new Error("accessNotes field is missing or empty");
  const lc = results.accessNotes.toLowerCase();
  assert(
    lc.includes("403") || lc.includes("blocked") || lc.includes("forbidden"),
    "accessNotes must acknowledge that direct HTTP access was blocked (expected '403', 'blocked', or 'forbidden')",
  );
});

proof("513: research record includes amendedBy = 'EP5-P4G-R' (integrity repair documented)", () => {
  assert(
    results.amendedBy === "EP5-P4G-R",
    `Expected amendedBy='EP5-P4G-R', got: ${results.amendedBy}`,
  );
});

proof("514: directAccessAttempts includes an entry for inter.mugler.com", () => {
  if (!Array.isArray(results.directAccessAttempts) || results.directAccessAttempts.length === 0) throw new Error("directAccessAttempts must be a non-empty array");
  const interMugler = results.directAccessAttempts.find(a => a.domain === "inter.mugler.com");
  if (!interMugler) throw new Error("No entry for inter.mugler.com in directAccessAttempts — EP5-P4G-R access attempt must be documented");
  assert(
    interMugler.result === "blocked-403",
    `Expected inter.mugler.com result='blocked-403', got: ${interMugler.result}`,
  );
});

proof("515: fieldDecisionMatrix entry for 'family' has confidence !== 'authoritative'", () => {
  const entry = results.fieldDecisionMatrix.find(e => e.field === "family");
  if (!entry) throw new Error("No fieldDecisionMatrix entry for 'family'");
  const conf = (entry as unknown as Record<string, unknown>)["confidence"] as string;
  assert(conf !== "authoritative", `fieldDecisionMatrix 'family' confidence must not be 'authoritative' — got: ${conf}`);
});

proof("516: fieldDecisionMatrix entry for 'notes.top' has confidence !== 'authoritative'", () => {
  const entry = results.fieldDecisionMatrix.find(e => e.field === "notes.top");
  if (!entry) throw new Error("No fieldDecisionMatrix entry for 'notes.top'");
  const conf = (entry as unknown as Record<string, unknown>)["confidence"] as string;
  assert(conf !== "authoritative", `fieldDecisionMatrix 'notes.top' confidence must not be 'authoritative' — got: ${conf}`);
});

proof("517: resolutionRecommendation.classification is still 'R2' (evidence reclassification does not alter recommendation)", () => {
  assert(
    results.resolutionRecommendation.classification === "R2",
    `Expected R2, got: ${results.resolutionRecommendation.classification}`,
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// Final report
// ═══════════════════════════════════════════════════════════════════════════════
console.log(`\n${"─".repeat(60)}`);
console.log(`  EP5-P4G-R validation: ${passed} passed, ${failed} failed`);
console.log(`${"─".repeat(60)}\n`);

if (failed > 0) {
  process.exit(1);
}

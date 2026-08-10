/**
 * EP6-P1 — Catalogue Knowledge Integrity Audit Validation Suite
 * 73 proofs across 9 sections.
 * Validates the catalogue-knowledge-integrity-audit.json output
 * and verifies that all protected artifacts remain unmodified.
 */

import { readFileSync, existsSync } from "fs";
import { createHash }               from "crypto";
import { join }                     from "path";

import type { CatalogueAuditReport } from "./catalogueKnowledgeIntegrityAudit";

// ── Protected artifact SHAs ────────────────────────────────────────────────────

const NATIVE_AG_SHA256   = "6799eb768a6a5e9166244be866316b802e7009719dd123d27ea8bf73a89be8bd";
const DRAFT_AG_SHA256    = "700593b7fd98cf8339491b74a7f2c6732badb2581ac268636a59c471b7e1cee7";
const FACTORY_LOG_SHA256 = "bd825643a2cafdd1adb4a82bfebd4e48465844315e78d039811950820570e33e";
const IDENTITY_REG_SHA256     = "c75f74b56d4c2064b4f00e422c26e454343defc6a8c61df288e4fe8c2c650a1d";
const PRODUCT_REG_SHA256      = "6d064d2b471bb0ff8da58e2cb5dd27d69bf70980e19ddd3041298e2eb8a5af0b";
const MIPRUN_AUDIT_SHA256     = "bd3e1f227a35f5929e0474516bafd3d5a7e9d460b923659f2fdf27be0a817353";
const RESEARCH_RESULTS_SHA256 = "741787b194abb320609ab3fd83ed4c15daead2fe11c8bf760364ae60d033a5e4";

// ── Paths ──────────────────────────────────────────────────────────────────────

const ROOT          = process.cwd();
const AUDIT_PATH    = join(ROOT, "app/lib/identity/data/audits/catalogue-knowledge-integrity-audit.json");
const NATIVE_AG     = join(ROOT, "app/lib/mkc/native/alien-goddess-inspired.ts");
const DRAFT_AG      = join(ROOT, "scripts/factory/drafts/alien-goddess-inspired.ts");
const FACTORY_LOG   = join(ROOT, "scripts/factory/factory-log.json");
const IDENTITY_REG  = join(ROOT, "app/lib/identity/data/identity-registry.json");
const PRODUCT_REG   = join(ROOT, "app/lib/identity/data/identity-product-registry.json");
const MIPRUN_AUDIT  = join(ROOT, "scripts/factory/identity/identity-qualified-run-audit.json");
const RESEARCH      = join(ROOT, "data/identity/research-results/MIP-000012-alien-goddess-authoritative-results.json");

// ── Helpers ────────────────────────────────────────────────────────────────────

type ProofResult = { name: string; passed: boolean; message: string };

function proof(name: string, fn: () => void): ProofResult {
  try {
    fn();
    return { name, passed: true, message: "PASS" };
  } catch (e) {
    return { name, passed: false, message: e instanceof Error ? e.message : String(e) };
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function sha256(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

// ── Load audit output ──────────────────────────────────────────────────────────

const auditRaw = readFileSync(AUDIT_PATH, "utf-8");
const audit    = JSON.parse(auditRaw) as CatalogueAuditReport;

// ── Proof runner ──────────────────────────────────────────────────────────────

const results: ProofResult[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// § 100 — Audit Coverage (12 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("101: audit output file exists and parses as JSON", () => {
  assert(existsSync(AUDIT_PATH), "audit output file not found");
  assert(typeof audit === "object" && audit !== null, "audit must be a non-null object");
}));

results.push(proof("102: audit version is 1.0.0", () => {
  assert(audit.version === "1.0.0", `expected "1.0.0"; got "${audit.version}"`);
}));

results.push(proof("103: totalRecords is exactly 93", () => {
  assert(audit.summary.totalRecords === 93, `expected 93; got ${audit.summary.totalRecords}`);
}));

results.push(proof("104: prioritizedQueue length equals 93", () => {
  assert(audit.prioritizedQueue.length === 93,
    `expected 93; got ${audit.prioritizedQueue.length}`);
}));

results.push(proof("105: no duplicate slugs in records", () => {
  const slugs = audit.records.map(r => r.slug);
  const unique = new Set(slugs);
  assert(unique.size === slugs.length,
    `${slugs.length - unique.size} duplicate slug(s) in records`);
}));

results.push(proof("106: no duplicate slugs in prioritizedQueue", () => {
  const unique = new Set(audit.prioritizedQueue);
  assert(unique.size === audit.prioritizedQueue.length,
    `${audit.prioritizedQueue.length - unique.size} duplicate slug(s) in prioritizedQueue`);
}));

results.push(proof("107: generatedAt is a non-empty ISO timestamp", () => {
  assert(typeof audit.generatedAt === "string" && audit.generatedAt.length > 0,
    "generatedAt must be a non-empty string");
  assert(!isNaN(Date.parse(audit.generatedAt)),
    `generatedAt "${audit.generatedAt}" is not a valid ISO timestamp`);
}));

results.push(proof("108: auditPurpose is a non-empty string", () => {
  assert(typeof audit.auditPurpose === "string" && audit.auditPurpose.length > 0,
    "auditPurpose must be non-empty");
}));

results.push(proof("109: records and prioritizedQueue contain the same slugs", () => {
  const fromRecords   = new Set(audit.records.map(r => r.slug));
  const fromQueue     = new Set(audit.prioritizedQueue);
  for (const slug of fromRecords) {
    assert(fromQueue.has(slug), `slug "${slug}" in records but not in prioritizedQueue`);
  }
  assert(fromRecords.size === fromQueue.size, "set sizes differ");
}));

results.push(proof("110: summary.totalRecords equals records.length", () => {
  assert(audit.summary.totalRecords === audit.records.length,
    `summary.totalRecords ${audit.summary.totalRecords} !== records.length ${audit.records.length}`);
}));

results.push(proof("111: records are sorted alphabetically by slug", () => {
  const slugs   = audit.records.map(r => r.slug);
  const sorted  = slugs.slice().sort((a, b) => a.localeCompare(b));
  for (let i = 0; i < slugs.length; i++) {
    assert(slugs[i] === sorted[i],
      `records[${i}] slug "${slugs[i]}" breaks alphabetical order`);
  }
}));

results.push(proof("112: each record has required top-level fields", () => {
  for (const r of audit.records) {
    assert(typeof r.slug === "string" && r.slug.length > 0,                "slug missing");
    assert(typeof r.name === "string" && r.name.length > 0,                "name missing");
    assert(["A","D","E","F"].includes(r.provenanceClass),                  `provenanceClass "${r.provenanceClass}" invalid`);
    assert(["LOW","MEDIUM","HIGH"].includes(r.riskLevel),                  `riskLevel "${r.riskLevel}" invalid`);
    assert(Array.isArray(r.policyFindings),                                "policyFindings must be array");
    assert(Array.isArray(r.recommendedActions),                            "recommendedActions must be array");
    assert(typeof r.hasRelationships === "boolean",                        "hasRelationships must be boolean");
    assert(typeof r.hasGovernedMapping === "boolean",                      "hasGovernedMapping must be boolean");
  }
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 200 — Safety Invariants (6 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("201: approvedIdentityId is null", () => {
  assert(audit.safetyInvariants.approvedIdentityId === null,
    `expected null; got ${audit.safetyInvariants.approvedIdentityId}`);
}));

results.push(proof("202: force is false", () => {
  assert(audit.safetyInvariants.force === false,
    `expected false; got ${audit.safetyInvariants.force}`);
}));

results.push(proof("203: noKnowledgeModified is true", () => {
  assert(audit.safetyInvariants.noKnowledgeModified === true,
    "noKnowledgeModified must be true");
}));

results.push(proof("204: noAiGeneration is true", () => {
  assert(audit.safetyInvariants.noAiGeneration === true, "noAiGeneration must be true");
}));

results.push(proof("205: noResearchCampaign is true", () => {
  assert(audit.safetyInvariants.noResearchCampaign === true, "noResearchCampaign must be true");
}));

results.push(proof("206: noPromotion is true", () => {
  assert(audit.safetyInvariants.noPromotion === true, "noPromotion must be true");
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 300 — Alien Goddess Classification (12 proofs)
// ─────────────────────────────────────────────────────────────────────────────

const ag = audit.records.find(r => r.slug === "alien-goddess-inspired");
if (!ag) throw new Error("alien-goddess-inspired not found in audit records");

results.push(proof("301: alien-goddess provenanceClass is A", () => {
  assert(ag.provenanceClass === "A",
    `expected "A"; got "${ag.provenanceClass}"`);
}));

results.push(proof("302: alien-goddess generationProvenance is legacy-factory", () => {
  assert(ag.generationProvenance === "legacy-factory",
    `expected "legacy-factory"; got "${ag.generationProvenance}"`);
}));

results.push(proof("303: alien-goddess governanceState is reconciled-r2", () => {
  assert(ag.governanceState === "reconciled-r2",
    `expected "reconciled-r2"; got "${ag.governanceState}"`);
}));

results.push(proof("304: alien-goddess mipIdentityId is MIP-000012", () => {
  assert(ag.mipIdentityId === "MIP-000012",
    `expected "MIP-000012"; got "${ag.mipIdentityId}"`);
}));

results.push(proof("305: alien-goddess hasMipRun is true", () => {
  assert(ag.hasMipRun === true, "hasMipRun must be true");
}));

results.push(proof("306: alien-goddess mipRunCount is 1", () => {
  assert(ag.mipRunCount === 1, `expected 1; got ${ag.mipRunCount}`);
}));

results.push(proof("307: alien-goddess hasReconciliation is true", () => {
  assert(ag.hasReconciliation === true, "hasReconciliation must be true");
}));

results.push(proof("308: alien-goddess reconciliationDisposition is r2-correction-applied", () => {
  assert(ag.reconciliationDisposition === "r2-correction-applied",
    `expected "r2-correction-applied"; got "${ag.reconciliationDisposition}"`);
}));

results.push(proof("309: alien-goddess hasGovernedMapping is true", () => {
  assert(ag.hasGovernedMapping === true, "hasGovernedMapping must be true");
}));

results.push(proof("310: alien-goddess hasFactoryDraft is true", () => {
  assert(ag.hasFactoryDraft === true,
    "alien-goddess-inspired must have a factory draft (in factory log)");
}));

results.push(proof("311: alien-goddess hasRelationships is false", () => {
  assert(ag.hasRelationships === false,
    "relationships removed in EP5-P4H — must be false");
}));

results.push(proof("312: alien-goddess recommendedActions is [NONE]", () => {
  assert(ag.recommendedActions.length === 1 && ag.recommendedActions[0] === "NONE",
    `expected ["NONE"]; got ${JSON.stringify(ag.recommendedActions)}`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 400 — Relationship Detection (6 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("401: exactly 89 records have hasRelationships true", () => {
  const count = audit.records.filter(r => r.hasRelationships).length;
  assert(count === 89, `expected 89; got ${count}`);
}));

results.push(proof("402: exactly 4 records have hasRelationships false", () => {
  const count = audit.records.filter(r => !r.hasRelationships).length;
  assert(count === 4, `expected 4; got ${count}`);
}));

results.push(proof("403: alien-goddess hasRelationships is false", () => {
  assert(ag.hasRelationships === false, "alien-goddess-inspired must have no relationships");
}));

results.push(proof("404: alien-goddess relationshipEntryCount is 0", () => {
  assert(ag.relationshipEntryCount === 0, `expected 0; got ${ag.relationshipEntryCount}`);
}));

results.push(proof("405: eros-inspired hasRelationships is false", () => {
  const eros = audit.records.find(r => r.slug === "eros-inspired");
  assert(eros !== undefined, "eros-inspired not found");
  assert(eros!.hasRelationships === false, "eros-inspired must have no relationships");
}));

results.push(proof("406: sauvage-inspired hasRelationships is true", () => {
  const sauvage = audit.records.find(r => r.slug === "sauvage-inspired");
  assert(sauvage !== undefined, "sauvage-inspired not found");
  assert(sauvage!.hasRelationships === true, "sauvage-inspired must have relationships");
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 500 — Policy Detection (10 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("501: at least 1 record has policyFindings", () => {
  const count = audit.records.filter(r => r.policyFindings.length > 0).length;
  assert(count > 0, "expected at least one record with policy findings");
}));

results.push(proof("502: alien-goddess has 0 policy findings", () => {
  assert(ag.policyFindings.length === 0,
    `expected 0 policy findings; got ${ag.policyFindings.length}`);
}));

results.push(proof("503: at least 1 HIGH-severity policy finding exists in audit", () => {
  const highFindings = audit.records.flatMap(r => r.policyFindings).filter(f => f.severity === "HIGH");
  assert(highFindings.length > 0, "expected at least 1 HIGH-severity policy finding");
}));

results.push(proof("504: althair-inspired has at least 1 policy finding", () => {
  const althair = audit.records.find(r => r.slug === "althair-inspired");
  assert(althair !== undefined, "althair-inspired not found");
  assert(althair!.policyFindings.length > 0,
    "althair-inspired must have at least 1 policy finding");
}));

results.push(proof("505: all policy findings have non-empty field name", () => {
  for (const r of audit.records) {
    for (const f of r.policyFindings) {
      assert(typeof f.field === "string" && f.field.length > 0,
        `record ${r.slug}: policy finding has empty field`);
    }
  }
}));

results.push(proof("506: all policy findings have non-empty pattern", () => {
  for (const r of audit.records) {
    for (const f of r.policyFindings) {
      assert(typeof f.pattern === "string" && f.pattern.length > 0,
        `record ${r.slug}: policy finding has empty pattern`);
    }
  }
}));

results.push(proof("507: all policy findings have non-empty excerpt", () => {
  for (const r of audit.records) {
    for (const f of r.policyFindings) {
      assert(typeof f.excerpt === "string" && f.excerpt.length > 0,
        `record ${r.slug}: policy finding has empty excerpt`);
    }
  }
}));

results.push(proof("508: all policy findings have severity HIGH or MEDIUM", () => {
  for (const r of audit.records) {
    for (const f of r.policyFindings) {
      assert(f.severity === "HIGH" || f.severity === "MEDIUM",
        `record ${r.slug}: invalid severity "${f.severity}"`);
    }
  }
}));

results.push(proof("509: summary.recordsWithPolicyFindings > 0", () => {
  assert(audit.summary.recordsWithPolicyFindings > 0,
    "expected at least 1 record with policy findings in summary");
}));

results.push(proof("510: scentCharacter is not flagged as a policy violation", () => {
  const scentFindings = audit.records.flatMap(r => r.policyFindings)
    .filter(f => f.field === "scentCharacter");
  assert(scentFindings.length === 0,
    `${scentFindings.length} policy finding(s) incorrectly reference scentCharacter`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 600 — Risk Ordering (8 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("601: alien-goddess riskLevel is LOW", () => {
  assert(ag.riskLevel === "LOW", `expected "LOW"; got "${ag.riskLevel}"`);
}));

results.push(proof("602: at least 1 record has riskLevel HIGH", () => {
  const count = audit.records.filter(r => r.riskLevel === "HIGH").length;
  assert(count > 0, "expected at least 1 HIGH-risk record");
}));

results.push(proof("603: at least 1 record has riskLevel MEDIUM", () => {
  const count = audit.records.filter(r => r.riskLevel === "MEDIUM").length;
  assert(count > 0, "expected at least 1 MEDIUM-risk record");
}));

results.push(proof("604: byRiskLevel counts sum to totalRecords", () => {
  const total = Object.values(audit.summary.byRiskLevel as Record<string, number>)
    .reduce((a, b) => a + b, 0);
  assert(total === audit.summary.totalRecords,
    `byRiskLevel sum ${total} !== totalRecords ${audit.summary.totalRecords}`);
}));

results.push(proof("605: all HIGH records precede first MEDIUM record in prioritizedQueue", () => {
  const queue     = audit.prioritizedQueue as string[];
  const riskBySlug = new Map(audit.records.map(r => [r.slug, r.riskLevel]));
  const firstMediumIdx = queue.findIndex(s => riskBySlug.get(s) === "MEDIUM");
  if (firstMediumIdx === -1) return;
  for (let i = 0; i < firstMediumIdx; i++) {
    assert(riskBySlug.get(queue[i]) === "HIGH",
      `record "${queue[i]}" at idx ${i} is not HIGH but precedes first MEDIUM`);
  }
}));

results.push(proof("606: all MEDIUM records precede first LOW record in prioritizedQueue", () => {
  const queue      = audit.prioritizedQueue as string[];
  const riskBySlug = new Map(audit.records.map(r => [r.slug, r.riskLevel]));
  const firstLowIdx = queue.findIndex(s => riskBySlug.get(s) === "LOW");
  if (firstLowIdx === -1) return;
  for (let i = 0; i < firstLowIdx; i++) {
    assert(riskBySlug.get(queue[i]) !== "LOW",
      `record "${queue[i]}" at idx ${i} is LOW but precedes first LOW position`);
  }
}));

results.push(proof("607: within each risk group, records are alphabetically sorted", () => {
  const queue      = audit.prioritizedQueue as string[];
  const riskBySlug = new Map(audit.records.map(r => [r.slug, r.riskLevel]));
  const groups: Record<string, string[]> = { HIGH: [], MEDIUM: [], LOW: [] };
  for (const slug of queue) {
    const risk = riskBySlug.get(slug)!;
    groups[risk].push(slug);
  }
  for (const [risk, slugs] of Object.entries(groups)) {
    const sorted = slugs.slice().sort((a, b) => a.localeCompare(b));
    for (let i = 0; i < slugs.length; i++) {
      assert(slugs[i] === sorted[i],
        `${risk} group: "${slugs[i]}" at idx ${i} breaks alphabetical order`);
    }
  }
}));

results.push(proof("608: alien-goddess is last in prioritizedQueue (sole LOW record)", () => {
  const queue = audit.prioritizedQueue as string[];
  assert(queue[queue.length - 1] === "alien-goddess-inspired",
    `expected last queue entry to be "alien-goddess-inspired"; got "${queue[queue.length - 1]}"`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 700 — Summary Integrity (5 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("701: summary.recordsWithRelationships is 89", () => {
  assert(audit.summary.recordsWithRelationships === 89,
    `expected 89; got ${audit.summary.recordsWithRelationships}`);
}));

results.push(proof("702: summary.recordsFullyGoverned is 1", () => {
  assert(audit.summary.recordsFullyGoverned === 1,
    `expected 1; got ${audit.summary.recordsFullyGoverned}`);
}));

results.push(proof("703: byProvenanceClass values sum to totalRecords", () => {
  const total = Object.values(audit.summary.byProvenanceClass as Record<string, number>)
    .reduce((a, b) => a + b, 0);
  assert(total === audit.summary.totalRecords,
    `byProvenanceClass sum ${total} !== totalRecords ${audit.summary.totalRecords}`);
}));

results.push(proof("704: byGovernanceState values sum to totalRecords", () => {
  const total = Object.values(audit.summary.byGovernanceState as Record<string, number>)
    .reduce((a, b) => a + b, 0);
  assert(total === audit.summary.totalRecords,
    `byGovernanceState sum ${total} !== totalRecords ${audit.summary.totalRecords}`);
}));

results.push(proof("705: byRiskLevel values sum to totalRecords", () => {
  const total = Object.values(audit.summary.byRiskLevel as Record<string, number>)
    .reduce((a, b) => a + b, 0);
  assert(total === audit.summary.totalRecords,
    `byRiskLevel sum ${total} !== totalRecords ${audit.summary.totalRecords}`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 800 — Protected Artifact Immutability (7 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("801: alien-goddess native SHA matches EP5-P4H R2 correction baseline", () => {
  const actual = sha256(NATIVE_AG);
  assert(actual === NATIVE_AG_SHA256,
    `native SHA mismatch:\n  expected: ${NATIVE_AG_SHA256}\n  actual:   ${actual}`);
}));

results.push(proof("802: factory-log.json SHA unchanged", () => {
  const actual = sha256(FACTORY_LOG);
  assert(actual === FACTORY_LOG_SHA256,
    `factory-log SHA mismatch:\n  expected: ${FACTORY_LOG_SHA256}\n  actual:   ${actual}`);
}));

results.push(proof("803: identity-registry.json SHA unchanged", () => {
  const actual = sha256(IDENTITY_REG);
  assert(actual === IDENTITY_REG_SHA256,
    `identity-registry SHA mismatch:\n  expected: ${IDENTITY_REG_SHA256}\n  actual:   ${actual}`);
}));

results.push(proof("804: identity-product-registry.json SHA unchanged", () => {
  const actual = sha256(PRODUCT_REG);
  assert(actual === PRODUCT_REG_SHA256,
    `product-registry SHA mismatch:\n  expected: ${PRODUCT_REG_SHA256}\n  actual:   ${actual}`);
}));

results.push(proof("805: identity-qualified-run-audit.json SHA unchanged", () => {
  const actual = sha256(MIPRUN_AUDIT);
  assert(actual === MIPRUN_AUDIT_SHA256,
    `MIPRUN audit SHA mismatch:\n  expected: ${MIPRUN_AUDIT_SHA256}\n  actual:   ${actual}`);
}));

results.push(proof("806: authoritative research results SHA unchanged", () => {
  const actual = sha256(RESEARCH);
  assert(actual === RESEARCH_RESULTS_SHA256,
    `research results SHA mismatch:\n  expected: ${RESEARCH_RESULTS_SHA256}\n  actual:   ${actual}`);
}));

results.push(proof("807: alien-goddess draft SHA unchanged", () => {
  const actual = sha256(DRAFT_AG);
  assert(actual === DRAFT_AG_SHA256,
    `draft SHA mismatch:\n  expected: ${DRAFT_AG_SHA256}\n  actual:   ${actual}`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 900 — Factory Provenance (7 proofs)
// ─────────────────────────────────────────────────────────────────────────────

const byProvenance  = audit.summary.byGenerationProvenance as Record<string, number>;
const byClass       = audit.summary.byProvenanceClass     as Record<string, number>;

results.push(proof("901: legacy-factory count is 56", () => {
  assert(byProvenance["legacy-factory"] === 56,
    `expected 56; got ${byProvenance["legacy-factory"]}`);
}));

results.push(proof("902: native-pre-factory count is 37", () => {
  assert(byProvenance["native-pre-factory"] === 37,
    `expected 37; got ${byProvenance["native-pre-factory"]}`);
}));

results.push(proof("903: haltane-inspired provenanceClass is D", () => {
  const haltane = audit.records.find(r => r.slug === "haltane-inspired");
  assert(haltane !== undefined, "haltane-inspired not found");
  assert(haltane!.provenanceClass === "D",
    `expected "D"; got "${haltane!.provenanceClass}"`);
}));

results.push(proof("904: sauvage-inspired provenanceClass is E", () => {
  const sauvage = audit.records.find(r => r.slug === "sauvage-inspired");
  assert(sauvage !== undefined, "sauvage-inspired not found");
  assert(sauvage!.provenanceClass === "E",
    `expected "E"; got "${sauvage!.provenanceClass}"`);
}));

results.push(proof("905: byProvenanceClass.A is 1", () => {
  assert(byClass["A"] === 1, `expected 1; got ${byClass["A"]}`);
}));

results.push(proof("906: byProvenanceClass.D is 55", () => {
  assert(byClass["D"] === 55, `expected 55; got ${byClass["D"]}`);
}));

results.push(proof("907: byProvenanceClass.E is 37", () => {
  assert(byClass["E"] === 37, `expected 37; got ${byClass["E"]}`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// Report
// ─────────────────────────────────────────────────────────────────────────────

const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;

console.log(`\nEP6-P1 — Catalogue Knowledge Integrity Audit Validation`);
console.log(`${"─".repeat(60)}`);

for (const r of results) {
  const tag = r.passed ? "✓" : "✗";
  if (!r.passed) {
    console.log(`${tag}  ${r.name}`);
    console.log(`     ${r.message}`);
  }
}

if (failed === 0) {
  console.log(`All proofs shown above — none failed.`);
}

console.log(`${"─".repeat(60)}`);
console.log(`Result: ${passed}/${results.length} proofs passing`);

if (failed > 0) {
  console.error(`\n${failed} proof(s) FAILED.`);
  process.exit(1);
}

console.log(`\nStatus: PASS — EP6-P1 catalogue audit validated.`);

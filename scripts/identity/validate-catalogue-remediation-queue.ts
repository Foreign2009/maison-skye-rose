/**
 * EP6-P2 — Catalogue Remediation Queue Validation Suite
 * 75 proofs across 9 sections.
 * Validates the catalogue-remediation-queue.json output
 * and verifies that all protected artifacts remain unmodified.
 */

import { readFileSync, existsSync } from "fs";
import { createHash }               from "crypto";
import { join }                     from "path";

import type { CatalogueRemediationQueue } from "./catalogueRemediationQueue";

// ── Protected artifact SHAs ────────────────────────────────────────────────────

const NATIVE_AG_SHA256        = "6799eb768a6a5e9166244be866316b802e7009719dd123d27ea8bf73a89be8bd";
const DRAFT_AG_SHA256         = "700593b7fd98cf8339491b74a7f2c6732badb2581ac268636a59c471b7e1cee7";
const FACTORY_LOG_SHA256      = "bd825643a2cafdd1adb4a82bfebd4e48465844315e78d039811950820570e33e";
const IDENTITY_REG_SHA256     = "c75f74b56d4c2064b4f00e422c26e454343defc6a8c61df288e4fe8c2c650a1d";
const PRODUCT_REG_SHA256      = "6d064d2b471bb0ff8da58e2cb5dd27d69bf70980e19ddd3041298e2eb8a5af0b";
const MIPRUN_AUDIT_SHA256     = "bd3e1f227a35f5929e0474516bafd3d5a7e9d460b923659f2fdf27be0a817353";
const RESEARCH_RESULTS_SHA256 = "741787b194abb320609ab3fd83ed4c15daead2fe11c8bf760364ae60d033a5e4";

// ── Paths ──────────────────────────────────────────────────────────────────────

const ROOT          = process.cwd();
const QUEUE_PATH    = join(ROOT, "app/lib/identity/data/audits/catalogue-remediation-queue.json");
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

// ── Load remediation queue output ──────────────────────────────────────────────

const queueRaw = readFileSync(QUEUE_PATH, "utf-8");
const queue    = JSON.parse(queueRaw) as CatalogueRemediationQueue;

// ── Convenience references ─────────────────────────────────────────────────────

const ag           = queue.items.find(i => i.slug === "alien-goddess-inspired")!;
const scentCharVocab = queue.summary.vocabularyAssessment.scentCharacter;
const byTier       = queue.summary.byPriorityTier as Record<string, number>;
const byCategory   = queue.summary.byIssueCategory as Record<string, number>;

// ── Proof runner ───────────────────────────────────────────────────────────────

const results: ProofResult[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// § 100 — Queue Coverage (10 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("101: queue output file exists and parses as JSON", () => {
  assert(existsSync(QUEUE_PATH), "remediation queue output file not found");
  assert(typeof queue === "object" && queue !== null, "queue must be a non-null object");
}));

results.push(proof("102: queue version is 1.0.0", () => {
  assert(queue.version === "1.0.0", `expected "1.0.0"; got "${queue.version}"`);
}));

results.push(proof("103: totalRecords is exactly 93", () => {
  assert(queue.summary.totalRecords === 93,
    `expected 93; got ${queue.summary.totalRecords}`);
}));

results.push(proof("104: items array length equals 93", () => {
  assert(queue.items.length === 93,
    `expected 93; got ${queue.items.length}`);
}));

results.push(proof("105: no duplicate slugs in items", () => {
  const slugs  = queue.items.map(i => i.slug);
  const unique = new Set(slugs);
  assert(unique.size === slugs.length,
    `${slugs.length - unique.size} duplicate slug(s) in items`);
}));

results.push(proof("106: all items have a valid priorityTier (P0–P5)", () => {
  const valid = new Set(["P0", "P1", "P2", "P3", "P4", "P5"]);
  for (const item of queue.items) {
    assert(valid.has(item.priorityTier),
      `slug "${item.slug}" has invalid priorityTier "${item.priorityTier}"`);
  }
}));

results.push(proof("107: all items have at least 1 issueCategory", () => {
  for (const item of queue.items) {
    assert(item.issueCategories.length > 0,
      `slug "${item.slug}" has empty issueCategories`);
  }
}));

results.push(proof("108: all items have at least 1 recommendedAction", () => {
  for (const item of queue.items) {
    assert(item.recommendedActions.length > 0,
      `slug "${item.slug}" has empty recommendedActions`);
  }
}));

results.push(proof("109: items are sorted by priorityTier then slug", () => {
  const TIER_ORDER: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3, P4: 4, P5: 5 };
  for (let i = 1; i < queue.items.length; i++) {
    const prev = queue.items[i - 1];
    const curr = queue.items[i];
    const prevOrder = TIER_ORDER[prev.priorityTier];
    const currOrder = TIER_ORDER[curr.priorityTier];
    if (prevOrder < currOrder) continue;
    if (prevOrder > currOrder) {
      throw new Error(`sort violation: "${prev.slug}" (${prev.priorityTier}) before "${curr.slug}" (${curr.priorityTier})`);
    }
    // same tier — slugs must be lexicographically ascending
    assert(prev.slug.localeCompare(curr.slug) <= 0,
      `within tier ${curr.priorityTier}: "${prev.slug}" is not before "${curr.slug}"`);
  }
}));

results.push(proof("110: generatedBy contains EP6-P2", () => {
  assert(queue.generatedBy.includes("EP6-P2"),
    `generatedBy "${queue.generatedBy}" does not contain "EP6-P2"`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 200 — Safety Invariants (6 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("201: approvedIdentityId is null", () => {
  assert(queue.safetyInvariants.approvedIdentityId === null,
    `approvedIdentityId must be null; got ${queue.safetyInvariants.approvedIdentityId}`);
}));

results.push(proof("202: force is false", () => {
  assert(queue.safetyInvariants.force === false,
    `force must be false; got ${queue.safetyInvariants.force}`);
}));

results.push(proof("203: noKnowledgeModified is true", () => {
  assert(queue.safetyInvariants.noKnowledgeModified === true,
    "noKnowledgeModified must be true");
}));

results.push(proof("204: noAiGeneration is true", () => {
  assert(queue.safetyInvariants.noAiGeneration === true,
    "noAiGeneration must be true");
}));

results.push(proof("205: noResearchCampaign is true", () => {
  assert(queue.safetyInvariants.noResearchCampaign === true,
    "noResearchCampaign must be true");
}));

results.push(proof("206: noIdentityMutation is true", () => {
  assert(queue.safetyInvariants.noIdentityMutation === true,
    "noIdentityMutation must be true");
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 300 — Priority Tier Distribution (12 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("301: P0 count is 23", () => {
  assert((byTier["P0"] ?? 0) === 23,
    `expected P0=23; got ${byTier["P0"] ?? 0}`);
}));

results.push(proof("302: P1 count is 0 (no structural relationship defects)", () => {
  assert((byTier["P1"] ?? 0) === 0,
    `expected P1=0; got ${byTier["P1"] ?? 0}`);
}));

results.push(proof("303: P2 count is 3", () => {
  assert((byTier["P2"] ?? 0) === 3,
    `expected P2=3; got ${byTier["P2"] ?? 0}`);
}));

results.push(proof("304: P3 count is 65", () => {
  assert((byTier["P3"] ?? 0) === 65,
    `expected P3=65; got ${byTier["P3"] ?? 0}`);
}));

results.push(proof("305: P4 count is 1", () => {
  assert((byTier["P4"] ?? 0) === 1,
    `expected P4=1; got ${byTier["P4"] ?? 0}`);
}));

results.push(proof("306: P5 count is 1", () => {
  assert((byTier["P5"] ?? 0) === 1,
    `expected P5=1; got ${byTier["P5"] ?? 0}`);
}));

results.push(proof("307: sum of all priority tiers equals 93", () => {
  const total = ["P0","P1","P2","P3","P4","P5"]
    .reduce((n, tier) => n + (byTier[tier] ?? 0), 0);
  assert(total === 93,
    `priority tier sum ${total} !== 93`);
}));

results.push(proof("308: all P0 items have at least 1 HIGH-severity policy finding", () => {
  const p0 = queue.items.filter(i => i.priorityTier === "P0");
  for (const item of p0) {
    const hasHigh = item.policyFindings.some(f => f.severity === "HIGH");
    assert(hasHigh, `P0 item "${item.slug}" has no HIGH-severity policy finding`);
  }
}));

results.push(proof("309: all P0 items have DETERMINISTIC_POLICY_CORRECTION in issueCategories", () => {
  const p0 = queue.items.filter(i => i.priorityTier === "P0");
  for (const item of p0) {
    assert(item.issueCategories.includes("DETERMINISTIC_POLICY_CORRECTION"),
      `P0 item "${item.slug}" missing DETERMINISTIC_POLICY_CORRECTION`);
  }
}));

results.push(proof("310: all P3 items have hasRelationships=true and no policy findings", () => {
  const p3 = queue.items.filter(i => i.priorityTier === "P3");
  for (const item of p3) {
    assert(item.hasRelationships === true,
      `P3 item "${item.slug}" has hasRelationships=false`);
    const hasPolicy = item.policyFindings.length > 0;
    assert(!hasPolicy,
      `P3 item "${item.slug}" has unexpected policy findings`);
  }
}));

results.push(proof("311: P4 item is side-effect-inspired", () => {
  const p4 = queue.items.filter(i => i.priorityTier === "P4");
  assert(p4.length === 1, `expected 1 P4 item; got ${p4.length}`);
  assert(p4[0].slug === "side-effect-inspired",
    `expected P4 slug "side-effect-inspired"; got "${p4[0].slug}"`);
}));

results.push(proof("312: P2 items are armani-code-parfum-inspired, eros-inspired, y-edp-inspired", () => {
  const p2slugs = queue.items
    .filter(i => i.priorityTier === "P2")
    .map(i => i.slug)
    .sort();
  const expected = ["armani-code-parfum-inspired", "eros-inspired", "y-edp-inspired"].sort();
  assert(JSON.stringify(p2slugs) === JSON.stringify(expected),
    `P2 slugs mismatch: ${JSON.stringify(p2slugs)} !== ${JSON.stringify(expected)}`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 400 — P5 Alien Goddess Invariants (8 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("401: exactly 1 P5 item exists", () => {
  const count = queue.items.filter(i => i.priorityTier === "P5").length;
  assert(count === 1, `expected 1 P5 item; got ${count}`);
}));

results.push(proof("402: P5 item is alien-goddess-inspired", () => {
  assert(ag !== undefined, "alien-goddess-inspired not found in queue");
  assert(ag.priorityTier === "P5",
    `alien-goddess-inspired priorityTier expected P5; got "${ag.priorityTier}"`);
}));

results.push(proof("403: alien-goddess issueCategories is exactly [NO_ACTION]", () => {
  assert(ag.issueCategories.length === 1 && ag.issueCategories[0] === "NO_ACTION",
    `alien-goddess issueCategories: ${JSON.stringify(ag.issueCategories)}`);
}));

results.push(proof("404: alien-goddess recommendedActions is exactly [NO_ACTION]", () => {
  assert(ag.recommendedActions.length === 1 && ag.recommendedActions[0] === "NO_ACTION",
    `alien-goddess recommendedActions: ${JSON.stringify(ag.recommendedActions)}`);
}));

results.push(proof("405: alien-goddess provenanceClass is A", () => {
  assert(ag.provenanceClass === "A",
    `expected provenanceClass "A"; got "${ag.provenanceClass}"`);
}));

results.push(proof("406: alien-goddess provenanceDebt.classification is DOCUMENTATION_ONLY", () => {
  assert(ag.provenanceDebt.classification === "DOCUMENTATION_ONLY",
    `expected "DOCUMENTATION_ONLY"; got "${ag.provenanceDebt.classification}"`);
}));

results.push(proof("407: alien-goddess has 0 policyFindings", () => {
  assert(ag.policyFindings.length === 0,
    `alien-goddess expected 0 policyFindings; got ${ag.policyFindings.length}`);
}));

results.push(proof("408: alien-goddess hasRelationships is false", () => {
  assert(ag.hasRelationships === false,
    `alien-goddess expected hasRelationships=false; got ${ag.hasRelationships}`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 500 — P0 Policy Correction (8 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("501: DETERMINISTIC_POLICY_CORRECTION byIssueCategory count is 23", () => {
  assert((byCategory["DETERMINISTIC_POLICY_CORRECTION"] ?? 0) === 23,
    `expected DETERMINISTIC_POLICY_CORRECTION=23; got ${byCategory["DETERMINISTIC_POLICY_CORRECTION"] ?? 0}`);
}));

results.push(proof("502: recordsCanCorrectDeterministically is 23", () => {
  assert(queue.summary.recordsCanCorrectDeterministically === 23,
    `expected 23; got ${queue.summary.recordsCanCorrectDeterministically}`);
}));

results.push(proof("503: all P0 items have canCorrectDeterministically=true", () => {
  const p0 = queue.items.filter(i => i.priorityTier === "P0");
  for (const item of p0) {
    assert(item.canCorrectDeterministically === true,
      `P0 item "${item.slug}" canCorrectDeterministically is false`);
  }
}));

results.push(proof("504: althair-inspired is P0 with DETERMINISTIC_POLICY_CORRECTION", () => {
  const althair = queue.items.find(i => i.slug === "althair-inspired");
  assert(althair !== undefined, "althair-inspired not found");
  assert(althair!.priorityTier === "P0",
    `althair-inspired priorityTier expected P0; got "${althair!.priorityTier}"`);
  assert(althair!.issueCategories.includes("DETERMINISTIC_POLICY_CORRECTION"),
    "althair-inspired missing DETERMINISTIC_POLICY_CORRECTION");
}));

results.push(proof("505: burberry-goddess-inspired is P0 with both HIGH and MEDIUM policy findings", () => {
  const burberry = queue.items.find(i => i.slug === "burberry-goddess-inspired");
  assert(burberry !== undefined, "burberry-goddess-inspired not found");
  assert(burberry!.priorityTier === "P0",
    `burberry-goddess-inspired expected P0; got "${burberry!.priorityTier}"`);
  const hasHigh   = burberry!.policyFindings.some(f => f.severity === "HIGH");
  const hasMedium = burberry!.policyFindings.some(f => f.severity === "MEDIUM");
  assert(hasHigh,   "burberry-goddess-inspired missing HIGH policy finding");
  assert(hasMedium, "burberry-goddess-inspired missing MEDIUM policy finding");
}));

results.push(proof("506: EDITORIAL_REVIEW byIssueCategory count is 4", () => {
  assert((byCategory["EDITORIAL_REVIEW"] ?? 0) === 4,
    `expected EDITORIAL_REVIEW=4; got ${byCategory["EDITORIAL_REVIEW"] ?? 0}`);
}));

results.push(proof("507: all policyFindings have severity HIGH or MEDIUM", () => {
  for (const item of queue.items) {
    for (const f of item.policyFindings) {
      assert(f.severity === "HIGH" || f.severity === "MEDIUM",
        `slug "${item.slug}": invalid policy finding severity "${f.severity}"`);
    }
  }
}));

results.push(proof("508: no policyFinding references scentCharacter field", () => {
  const scentFindings = queue.items
    .flatMap(i => i.policyFindings)
    .filter(f => f.field === "scentCharacter");
  assert(scentFindings.length === 0,
    `${scentFindings.length} policyFinding(s) incorrectly reference scentCharacter`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 600 — Structural Integrity (6 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("601: totalStructuralFindings is 0", () => {
  assert(queue.summary.totalStructuralFindings === 0,
    `expected 0 structural findings; got ${queue.summary.totalStructuralFindings}`);
}));

results.push(proof("602: recordsWithStructuralFindings is 0", () => {
  assert(queue.summary.recordsWithStructuralFindings === 0,
    `expected 0 records with structural findings; got ${queue.summary.recordsWithStructuralFindings}`);
}));

results.push(proof("603: no item has relationshipStructuralFindings", () => {
  for (const item of queue.items) {
    assert(item.relationshipStructuralFindings.length === 0,
      `slug "${item.slug}" has ${item.relationshipStructuralFindings.length} structural finding(s)`);
  }
}));

results.push(proof("604: no item has RELATIONSHIP_STRUCTURAL_CORRECTION in issueCategories", () => {
  for (const item of queue.items) {
    assert(!item.issueCategories.includes("RELATIONSHIP_STRUCTURAL_CORRECTION"),
      `slug "${item.slug}" has unexpected RELATIONSHIP_STRUCTURAL_CORRECTION`);
  }
}));

results.push(proof("605: P1 is absent from byPriorityTier (clean relationship structure)", () => {
  assert((byTier["P1"] ?? 0) === 0,
    `P1 count in byPriorityTier must be 0; got ${byTier["P1"] ?? 0}`);
}));

results.push(proof("606: RELATIONSHIP_EDITORIAL_REVIEW count equals recordsWithRelationships (89)", () => {
  assert((byCategory["RELATIONSHIP_EDITORIAL_REVIEW"] ?? 0) === 89,
    `expected RELATIONSHIP_EDITORIAL_REVIEW=89; got ${byCategory["RELATIONSHIP_EDITORIAL_REVIEW"] ?? 0}`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 700 — Vocabulary Assessment (10 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("701: scentCharacter vocabulary assessment has exactly 4 entries", () => {
  assert(scentCharVocab.length === 4,
    `expected 4 vocabulary entries; got ${scentCharVocab.length}`);
}));

results.push(proof("702: all 4 expected scentCharacter values are present", () => {
  const values = new Set(scentCharVocab.map(v => v.value));
  for (const expected of ["Fresh & Light", "Balanced Signature", "Rich & Long Wearing", "Deep & Intense"]) {
    assert(values.has(expected), `missing vocabulary entry: "${expected}"`);
  }
}));

results.push(proof("703: Rich & Long Wearing policyClassification is REVIEW", () => {
  const rlw = scentCharVocab.find(v => v.value === "Rich & Long Wearing");
  assert(rlw !== undefined, "Rich & Long Wearing entry not found");
  assert(rlw!.policyClassification === "REVIEW",
    `expected REVIEW; got "${rlw!.policyClassification}"`);
}));

results.push(proof("704: Fresh & Light policyClassification is SAFE", () => {
  const fl = scentCharVocab.find(v => v.value === "Fresh & Light");
  assert(fl !== undefined, "Fresh & Light entry not found");
  assert(fl!.policyClassification === "SAFE",
    `expected SAFE; got "${fl!.policyClassification}"`);
}));

results.push(proof("705: Balanced Signature policyClassification is SAFE", () => {
  const bs = scentCharVocab.find(v => v.value === "Balanced Signature");
  assert(bs !== undefined, "Balanced Signature entry not found");
  assert(bs!.policyClassification === "SAFE",
    `expected SAFE; got "${bs!.policyClassification}"`);
}));

results.push(proof("706: Deep & Intense policyClassification is SAFE", () => {
  const di = scentCharVocab.find(v => v.value === "Deep & Intense");
  assert(di !== undefined, "Deep & Intense entry not found");
  assert(di!.policyClassification === "SAFE",
    `expected SAFE; got "${di!.policyClassification}"`);
}));

results.push(proof("707: Rich & Long Wearing usageCount is 47", () => {
  const rlw = scentCharVocab.find(v => v.value === "Rich & Long Wearing");
  assert(rlw!.usageCount === 47,
    `expected 47; got ${rlw!.usageCount}`);
}));

results.push(proof("708: scentCharacter usageCount sum equals 93", () => {
  const total = scentCharVocab.reduce((n, v) => n + v.usageCount, 0);
  assert(total === 93, `usageCount sum ${total} !== 93`);
}));

results.push(proof("709: exactly 1 scentCharacter value has policyClassification REVIEW", () => {
  const reviewCount = scentCharVocab.filter(v => v.policyClassification === "REVIEW").length;
  assert(reviewCount === 1, `expected 1 REVIEW value; got ${reviewCount}`);
}));

results.push(proof("710: recordsRequiringFounderDecision is 49", () => {
  assert(queue.summary.recordsRequiringFounderDecision === 49,
    `expected 49; got ${queue.summary.recordsRequiringFounderDecision}`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 800 — Provenance Debt Classification (8 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("801: class A item (alien-goddess) has provenanceDebt DOCUMENTATION_ONLY", () => {
  assert(ag.provenanceDebt.classification === "DOCUMENTATION_ONLY",
    `alien-goddess provenanceDebt: expected DOCUMENTATION_ONLY; got "${ag.provenanceDebt.classification}"`);
}));

results.push(proof("802: all class D items have provenanceDebt DOCUMENTATION_ONLY", () => {
  const classD = queue.items.filter(i => i.provenanceClass === "D");
  for (const item of classD) {
    assert(item.provenanceDebt.classification === "DOCUMENTATION_ONLY",
      `class D item "${item.slug}" provenanceDebt: expected DOCUMENTATION_ONLY; got "${item.provenanceDebt.classification}"`);
  }
}));

results.push(proof("803: all class E items have provenanceDebt CONTENT_ACTION_REQUIRED", () => {
  const classE = queue.items.filter(i => i.provenanceClass === "E");
  for (const item of classE) {
    assert(item.provenanceDebt.classification === "CONTENT_ACTION_REQUIRED",
      `class E item "${item.slug}" provenanceDebt: expected CONTENT_ACTION_REQUIRED; got "${item.provenanceDebt.classification}"`);
  }
}));

results.push(proof("804: class E count is 37 (native-pre-factory records)", () => {
  const classE = queue.items.filter(i => i.provenanceClass === "E");
  assert(classE.length === 37, `expected 37 class E items; got ${classE.length}`);
}));

results.push(proof("805: class D count is 55 (legacy-factory records)", () => {
  const classD = queue.items.filter(i => i.provenanceClass === "D");
  assert(classD.length === 55, `expected 55 class D items; got ${classD.length}`);
}));

results.push(proof("806: all 37 class E items have requiresExternalResearch=true", () => {
  const classE = queue.items.filter(i => i.provenanceClass === "E");
  for (const item of classE) {
    assert(item.requiresExternalResearch === true,
      `class E item "${item.slug}" requiresExternalResearch should be true`);
  }
}));

results.push(proof("807: all class D items have requiresExternalResearch=false", () => {
  const classD = queue.items.filter(i => i.provenanceClass === "D");
  for (const item of classD) {
    assert(item.requiresExternalResearch === false,
      `class D item "${item.slug}" requiresExternalResearch should be false`);
  }
}));

results.push(proof("808: MIP_IDENTITY_ONBOARDING byIssueCategory count is 92 (all class D and E)", () => {
  assert((byCategory["MIP_IDENTITY_ONBOARDING"] ?? 0) === 92,
    `expected MIP_IDENTITY_ONBOARDING=92; got ${byCategory["MIP_IDENTITY_ONBOARDING"] ?? 0}`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 900 — Protected Artifact Immutability (7 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("901: alien-goddess native SHA matches EP5-P4H R2 correction baseline", () => {
  const actual = sha256(NATIVE_AG);
  assert(actual === NATIVE_AG_SHA256,
    `native SHA mismatch:\n  expected: ${NATIVE_AG_SHA256}\n  actual:   ${actual}`);
}));

results.push(proof("902: factory-log.json SHA unchanged", () => {
  const actual = sha256(FACTORY_LOG);
  assert(actual === FACTORY_LOG_SHA256,
    `factory-log SHA mismatch:\n  expected: ${FACTORY_LOG_SHA256}\n  actual:   ${actual}`);
}));

results.push(proof("903: identity-registry.json SHA unchanged", () => {
  const actual = sha256(IDENTITY_REG);
  assert(actual === IDENTITY_REG_SHA256,
    `identity-registry SHA mismatch:\n  expected: ${IDENTITY_REG_SHA256}\n  actual:   ${actual}`);
}));

results.push(proof("904: identity-product-registry.json SHA unchanged", () => {
  const actual = sha256(PRODUCT_REG);
  assert(actual === PRODUCT_REG_SHA256,
    `product-registry SHA mismatch:\n  expected: ${PRODUCT_REG_SHA256}\n  actual:   ${actual}`);
}));

results.push(proof("905: identity-qualified-run-audit.json SHA unchanged", () => {
  const actual = sha256(MIPRUN_AUDIT);
  assert(actual === MIPRUN_AUDIT_SHA256,
    `MIPRUN audit SHA mismatch:\n  expected: ${MIPRUN_AUDIT_SHA256}\n  actual:   ${actual}`);
}));

results.push(proof("906: authoritative research results SHA unchanged", () => {
  const actual = sha256(RESEARCH);
  assert(actual === RESEARCH_RESULTS_SHA256,
    `research results SHA mismatch:\n  expected: ${RESEARCH_RESULTS_SHA256}\n  actual:   ${actual}`);
}));

results.push(proof("907: alien-goddess factory draft SHA unchanged", () => {
  const actual = sha256(DRAFT_AG);
  assert(actual === DRAFT_AG_SHA256,
    `draft SHA mismatch:\n  expected: ${DRAFT_AG_SHA256}\n  actual:   ${actual}`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// Report
// ─────────────────────────────────────────────────────────────────────────────

const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;

console.log(`\n[EP6-P2 Validation] ${passed}/${results.length} proofs passing\n`);

for (const r of results) {
  const icon = r.passed ? "✓" : "✗";
  console.log(`  ${icon} ${r.name}`);
  if (!r.passed) {
    console.log(`      FAIL: ${r.message}`);
  }
}

if (failed > 0) {
  console.error(`\n[EP6-P2 Validation] FAILED — ${failed} proof(s) failed.`);
  process.exit(1);
} else {
  console.log(`\n[EP6-P2 Validation] All ${passed} proofs passing.`);
}

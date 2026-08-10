/**
 * EP6-P4 — Catalogue Relationship Editorial Audit Runner
 *
 * Reads the live native catalogue and EP6-P1/P2 audit metadata,
 * then generates a deterministic editorial governance audit of all
 * relationship edges. No knowledge records are modified.
 *
 * SAFETY INVARIANTS:
 *   APPROVED_IDENTITY_ID = null  (disarmed)
 *   FORCE                = false (disarmed)
 *   No MKC source files are written.
 *   No identity registry mutations.
 *   No AI provider invoked.
 *   No external research.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

import { mkcCatalogue }                           from "../../app/lib/mkc/catalogue";
import { runCatalogueRelationshipEditorialAudit } from "./catalogueRelationshipEditorialAudit";

// ── Governance constants ───────────────────────────────────────────────────────

const APPROVED_IDENTITY_ID: null  = null;   // DO NOT SET — governance disarm
const FORCE:                false = false;  // DO NOT SET — governance disarm

// ── Paths ──────────────────────────────────────────────────────────────────────

const ROOT                       = process.cwd();
const EP6_P1_AUDIT_PATH          = join(ROOT, "app/lib/identity/data/audits/catalogue-knowledge-integrity-audit.json");
const EP6_P2_QUEUE_PATH          = join(ROOT, "app/lib/identity/data/audits/catalogue-remediation-queue.json");
const AUDIT_OUTPUT_DIR           = join(ROOT, "app/lib/identity/data/audits");
const AUDIT_OUTPUT_PATH          = join(AUDIT_OUTPUT_DIR, "catalogue-relationship-editorial-audit.json");

// ── Load source audit metadata ─────────────────────────────────────────────────

type AuditMeta = { version: string; generatedAt: string };

const ep6p1Meta = JSON.parse(readFileSync(EP6_P1_AUDIT_PATH, "utf-8")) as AuditMeta;
const ep6p2Meta = JSON.parse(readFileSync(EP6_P2_QUEUE_PATH, "utf-8")) as AuditMeta;

// ── Console preamble ───────────────────────────────────────────────────────────

console.log("\n[EP6-P4] Catalogue Relationship Editorial Audit");
console.log("────────────────────────────────────────────────");
console.log(`[EP6-P4] APPROVED_IDENTITY_ID = ${APPROVED_IDENTITY_ID}`);
console.log(`[EP6-P4] FORCE               = ${FORCE}`);
console.log(`[EP6-P4] Native catalogue:   ${mkcCatalogue.length} records`);
console.log(`[EP6-P4] EP6-P1 source:      v${ep6p1Meta.version} (${ep6p1Meta.generatedAt})`);
console.log(`[EP6-P4] EP6-P2 source:      v${ep6p2Meta.version} (${ep6p2Meta.generatedAt})`);
console.log("[EP6-P4] Running audit (read-only — zero mutations, zero AI calls)...");

// ── Run audit ──────────────────────────────────────────────────────────────────

const report = runCatalogueRelationshipEditorialAudit({
  records:                       mkcCatalogue,
  sourceCatalogueAuditVersion:   ep6p1Meta.version,
  sourceRemediationQueueVersion: ep6p2Meta.version,
});

// ── Write output ───────────────────────────────────────────────────────────────

mkdirSync(AUDIT_OUTPUT_DIR, { recursive: true });
writeFileSync(AUDIT_OUTPUT_PATH, JSON.stringify(report, null, 2), "utf-8");

// ── Console report ─────────────────────────────────────────────────────────────

const s = report.summary;

console.log("\n[EP6-P4] ── Summary ───────────────────────────────");
console.log(`[EP6-P4] Total catalogue records:      ${s.totalCatalogueRecords}`);
console.log(`[EP6-P4] Relationship-bearing records: ${s.relationshipBearingRecords}`);
console.log(`[EP6-P4] Records without relations:    ${s.recordsWithoutRelationships} (${s.recordsWithoutRelationshipsList.join(", ")})`);
console.log(`[EP6-P4] Total relationship edges:     ${s.totalRelationshipEdges}`);
console.log("\n[EP6-P4] Edges by type:");
for (const [type, count] of Object.entries(s.edgesByRelationshipType)) {
  console.log(`[EP6-P4]   ${type}: ${count}`);
}
console.log("\n[EP6-P4] Edges by editorial classification:");
for (const [cls, count] of Object.entries(s.edgesByEditorialClassification)) {
  if (count > 0) console.log(`[EP6-P4]   ${cls}: ${count}`);
}
console.log("\n[EP6-P4] Edges by provenance:");
for (const [prov, count] of Object.entries(s.edgesByProvenanceState)) {
  if (count > 0) console.log(`[EP6-P4]   ${prov}: ${count}`);
}
console.log("\n[EP6-P4] Structural defects found:     " + s.structuralDefectCount);
console.log("\n[EP6-P4] Records by editorial state:");
console.log(`[EP6-P4]   Requires external research:    ${s.recordsByEditorialState.requiresExternalResearch}`);
console.log(`[EP6-P4]   Requires founder decision:     ${s.recordsByEditorialState.requiresFounderDecision}`);
console.log(`[EP6-P4]   Has unsupported relationships: ${s.recordsByEditorialState.hasUnsupportedRelationships}`);
console.log(`[EP6-P4]   Has structural defects:        ${s.recordsByEditorialState.hasStructuralDefects}`);
console.log("\n[EP6-P4] ── Safety Invariants ─────────────────────");
console.log(`[EP6-P4]   noKnowledgeModified:   ${report.safetyInvariants.noKnowledgeModified}`);
console.log(`[EP6-P4]   noRelationshipMutated: ${report.safetyInvariants.noRelationshipMutated}`);
console.log(`[EP6-P4]   noAiGeneration:        ${report.safetyInvariants.noAiGeneration}`);
console.log(`[EP6-P4]   noExternalResearch:    ${report.safetyInvariants.noExternalResearch}`);
console.log(`[EP6-P4]   approvedIdentityId:    ${report.safetyInvariants.approvedIdentityId}`);
console.log(`[EP6-P4]   force:                 ${report.safetyInvariants.force}`);
console.log(`\n[EP6-P4] Output: ${AUDIT_OUTPUT_PATH}`);
console.log("[EP6-P4] Audit complete.");

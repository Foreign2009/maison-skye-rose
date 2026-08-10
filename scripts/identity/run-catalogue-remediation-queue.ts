/**
 * EP6-P2 — Catalogue Remediation Queue Runner
 *
 * Reads the EP6-P1 integrity audit snapshot and the live native catalogue,
 * then generates a prioritized remediation worklist. No knowledge records
 * are modified. No AI generation. No research campaign. No promotion.
 *
 * SAFETY INVARIANTS:
 *   APPROVED_IDENTITY_ID = null  (disarmed)
 *   FORCE                = false (disarmed)
 *   No MKC source files are written.
 *   No identity registry mutations.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

import { mkcCatalogue }                   from "../../app/lib/mkc/catalogue";
import { runCatalogueRemediationQueue }   from "./catalogueRemediationQueue";
import type { RecordAuditResult }         from "./catalogueKnowledgeIntegrityAudit";

// ── Governance constants ───────────────────────────────────────────────────────

const APPROVED_IDENTITY_ID: null  = null;   // DO NOT SET — governance disarm
const FORCE:                false = false;  // DO NOT SET — governance disarm

// ── Paths ──────────────────────────────────────────────────────────────────────

const ROOT              = process.cwd();
const AUDIT_INPUT_PATH  = join(ROOT, "app/lib/identity/data/audits/catalogue-knowledge-integrity-audit.json");
const AUDIT_OUTPUT_DIR  = join(ROOT, "app/lib/identity/data/audits");
const AUDIT_OUTPUT_PATH = join(AUDIT_OUTPUT_DIR, "catalogue-remediation-queue.json");

// ── Load EP6-P1 audit snapshot ────────────────────────────────────────────────

type AuditSnapshot = {
  version:     string;
  generatedAt: string;
  records:     RecordAuditResult[];
};

const auditSnapshot = JSON.parse(readFileSync(AUDIT_INPUT_PATH, "utf-8")) as AuditSnapshot;

// ── Run remediation queue ──────────────────────────────────────────────────────

console.log(`[EP6-P2] APPROVED_IDENTITY_ID = ${APPROVED_IDENTITY_ID}`);
console.log(`[EP6-P2] FORCE               = ${FORCE}`);
console.log(`[EP6-P2] Audit snapshot:     ${auditSnapshot.records.length} records (v${auditSnapshot.version})`);
console.log(`[EP6-P2] Native catalogue:   ${mkcCatalogue.length} records`);
console.log(`[EP6-P2] Generating remediation queue...`);

const queue = runCatalogueRemediationQueue({
  auditRecords:     auditSnapshot.records,
  auditVersion:     auditSnapshot.version,
  auditGeneratedAt: auditSnapshot.generatedAt,
  nativeRecords:    mkcCatalogue,
});

// ── Write output ───────────────────────────────────────────────────────────────

mkdirSync(AUDIT_OUTPUT_DIR, { recursive: true });
writeFileSync(AUDIT_OUTPUT_PATH, JSON.stringify(queue, null, 2), "utf-8");

// ── Report ─────────────────────────────────────────────────────────────────────

console.log(`\n[EP6-P2] Remediation queue complete.`);
console.log(`[EP6-P2] Output:                  ${AUDIT_OUTPUT_PATH}`);
console.log(`[EP6-P2] Total records:            ${queue.summary.totalRecords}`);
console.log(`[EP6-P2] By priority tier:         ${JSON.stringify(queue.summary.byPriorityTier)}`);
console.log(`[EP6-P2] Structural findings:      ${queue.summary.totalStructuralFindings} across ${queue.summary.recordsWithStructuralFindings} records`);
console.log(`[EP6-P2] Deterministic fixes:      ${queue.summary.recordsCanCorrectDeterministically}`);
console.log(`[EP6-P2] Requires founder decision: ${queue.summary.recordsRequiringFounderDecision}`);
console.log(`[EP6-P2] scentCharacter vocab:`);
for (const v of queue.summary.vocabularyAssessment.scentCharacter) {
  console.log(`[EP6-P2]   "${v.value}" — ${v.usageCount} records — ${v.policyClassification}`);
}

/**
 * EP6-P1 — Catalogue Knowledge Integrity Audit Runner
 *
 * READ-ONLY audit. This script reads repository state, calls the audit service,
 * and writes the audit output JSON. No knowledge records are modified.
 *
 * SAFETY INVARIANTS:
 *   APPROVED_IDENTITY_ID = null  (disarmed)
 *   FORCE                = false (disarmed)
 *   No MKC source files are written.
 *   No identity registry mutations.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "fs";
import { join }   from "path";

import { mkcCatalogue }                     from "../../app/lib/mkc/catalogue";
import { runCatalogueKnowledgeIntegrityAudit } from "./catalogueKnowledgeIntegrityAudit";
import type { ReconciliationEntry }         from "./catalogueKnowledgeIntegrityAudit";

// ── Governance constants ───────────────────────────────────────────────────────

const APPROVED_IDENTITY_ID: null  = null;   // DO NOT SET — governance disarm
const FORCE:                false = false;  // DO NOT SET — governance disarm

// ── Paths ──────────────────────────────────────────────────────────────────────

const ROOT                  = process.cwd();
const FACTORY_LOG_PATH      = join(ROOT, "scripts/factory/factory-log.json");
const PRODUCT_REGISTRY_PATH = join(ROOT, "app/lib/identity/data/identity-product-registry.json");
const MIPRUN_AUDIT_PATH     = join(ROOT, "scripts/factory/identity/identity-qualified-run-audit.json");
const RECONCILIATION_DIR    = join(ROOT, "app/lib/identity/data/reconciliation");
const AUDIT_OUTPUT_DIR      = join(ROOT, "app/lib/identity/data/audits");
const AUDIT_OUTPUT_PATH     = join(AUDIT_OUTPUT_DIR, "catalogue-knowledge-integrity-audit.json");

// ── Load factory log ───────────────────────────────────────────────────────────

type FactoryLog = {
  version: string;
  runs:    Array<{ slug: string; [k: string]: unknown }>;
};

const factoryLog   = JSON.parse(readFileSync(FACTORY_LOG_PATH, "utf-8")) as FactoryLog;
const factorySlugs = new Set<string>(factoryLog.runs.map(r => r.slug));

// ── Load identity product registry ────────────────────────────────────────────

type ProductRegistryMapping = {
  identityId: string;
  maisonSlug: string;
  [k: string]: unknown;
};
type ProductRegistry = {
  version:  string;
  mappings: ProductRegistryMapping[];
};

const productRegistry = JSON.parse(readFileSync(PRODUCT_REGISTRY_PATH, "utf-8")) as ProductRegistry;
const mappings        = new Map<string, string>(
  productRegistry.mappings.map(m => [m.maisonSlug, m.identityId]),
);

// ── Load identity-qualified run audit ─────────────────────────────────────────

type MiprunAuditRecord = {
  type:        string;
  runId:       string;
  maisonSlug?: string;
  [k: string]: unknown;
};
type MiprunAudit = {
  version: string;
  records: MiprunAuditRecord[];
};

const miprunAudit  = JSON.parse(readFileSync(MIPRUN_AUDIT_PATH, "utf-8")) as MiprunAudit;
const mipRunsBySlug = new Map<string, number>();

for (const record of miprunAudit.records) {
  if (record.type === "governance-attempt" && record.maisonSlug) {
    const slug = record.maisonSlug;
    mipRunsBySlug.set(slug, (mipRunsBySlug.get(slug) ?? 0) + 1);
  }
}

// ── Load reconciliation records ───────────────────────────────────────────────

type ReconciliationFile = {
  identityId:           string;
  maisonSlug:           string;
  knowledgeDisposition: string;
  [k: string]: unknown;
};

const reconciliations = new Map<string, ReconciliationEntry>();

const reconciliationFiles = readdirSync(RECONCILIATION_DIR).filter(f => f.endsWith(".json"));
for (const file of reconciliationFiles) {
  const data = JSON.parse(
    readFileSync(join(RECONCILIATION_DIR, file), "utf-8"),
  ) as ReconciliationFile;
  reconciliations.set(data.maisonSlug, {
    identityId:           data.identityId,
    knowledgeDisposition: data.knowledgeDisposition,
  });
}

// ── Run audit ─────────────────────────────────────────────────────────────────

console.log(`[EP6-P1] Auditing ${mkcCatalogue.length} native knowledge records...`);
console.log(`[EP6-P1] Factory slugs:      ${factorySlugs.size}`);
console.log(`[EP6-P1] Governed mappings:  ${mappings.size}`);
console.log(`[EP6-P1] MIPRUN entries:     ${mipRunsBySlug.size} unique slugs`);
console.log(`[EP6-P1] Reconciliations:    ${reconciliations.size}`);
console.log(`[EP6-P1] APPROVED_IDENTITY_ID = ${APPROVED_IDENTITY_ID}`);
console.log(`[EP6-P1] FORCE               = ${FORCE}`);

const report = runCatalogueKnowledgeIntegrityAudit({
  records:         mkcCatalogue,
  factorySlugs,
  mappings,
  mipRunsBySlug,
  reconciliations,
});

// ── Write output ───────────────────────────────────────────────────────────────

mkdirSync(AUDIT_OUTPUT_DIR, { recursive: true });
writeFileSync(AUDIT_OUTPUT_PATH, JSON.stringify(report, null, 2), "utf-8");

console.log(`\n[EP6-P1] Audit complete.`);
console.log(`[EP6-P1] Output: ${AUDIT_OUTPUT_PATH}`);
console.log(`[EP6-P1] Total records:    ${report.summary.totalRecords}`);
console.log(`[EP6-P1] By provenance:    ${JSON.stringify(report.summary.byGenerationProvenance)}`);
console.log(`[EP6-P1] By class:         ${JSON.stringify(report.summary.byProvenanceClass)}`);
console.log(`[EP6-P1] By governance:    ${JSON.stringify(report.summary.byGovernanceState)}`);
console.log(`[EP6-P1] By risk:          ${JSON.stringify(report.summary.byRiskLevel)}`);
console.log(`[EP6-P1] With relations:   ${report.summary.recordsWithRelationships}`);
console.log(`[EP6-P1] Policy findings:  ${report.summary.totalPolicyFindings} across ${report.summary.recordsWithPolicyFindings} records`);
console.log(`[EP6-P1] Fully governed:   ${report.summary.recordsFullyGoverned}`);

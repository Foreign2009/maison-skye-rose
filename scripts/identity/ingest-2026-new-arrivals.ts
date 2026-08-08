/**
 * EP5-P2C — Controlled 2026 Identity Candidate Ingestion
 * EP5-P2CR — Hardened source contracts, runtime validation, write ordering
 *
 * Deterministic, idempotent ingestion of the Mid-Year 2026 supplier new arrivals
 * into the Maison Identity Platform.
 *
 * Usage:
 *   npx tsx scripts/identity/ingest-2026-new-arrivals.ts --dry-run   # validate only
 *   npx tsx scripts/identity/ingest-2026-new-arrivals.ts              # real write
 *
 * Required source files:
 *   data/identity/source/mid-year-2026-supplier.json  (31 rows — 26 unique + 5 L/M pairs)
 *   data/identity/source/mid-year-2026-research.json  (26 entries — one per unique identity)
 *
 * HARD CONSTRAINTS (verbatim from EP5-P2C and EP5-P2CR approvals):
 *   NO AI — no Gemini, Claude, OpenAI, web search, or external service calls.
 *   NO PERSISTENCE POPULATION until all validations pass.
 *   NONE may be verified — all output records must be "candidate" or "pending-review".
 *   Episode is idempotent — running twice must NOT create 52 identities.
 *   No factory generation. No UI. No routes. No new packages.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join }                                        from "path";

import { IdentityRegistry }              from "../../app/lib/identity/IdentityRegistry";
import { DeterministicIdentityResolver } from "../../app/lib/identity/resolver/index";
import { validateIdentityRecord }        from "../../app/lib/identity/validator";
import { loadIdentityRegistry, saveIdentityRegistry } from "../../app/lib/identity/persistence";
import { IDENTITY_PLATFORM_VERSION }     from "../../app/lib/identity/version";

import {
  parseSupplierSourceFile,
  parseResearchSourceFile,
  deduplicateSupplierRows,
  matchResearch,
  verifySourceCorrespondence,
  isCleanCanonicalProposal,
  CAMPAIGN_SOURCE_ROW_COUNT,
  CAMPAIGN_UNIQUE_COUNT,
} from "./ingestion/sourceValidation";

import type {
  IdentityRecord,
  SupplierIdentity,
  IdentityEvidence,
  IdentityHistoryEntry,
  IdentityConfidence,
  CanonicalIdentity,
  ProductCategory,
} from "../../app/lib/identity/types";

import type {
  SupplierSourceFile,
  ResearchSourceFile,
  ResearchSourceEntry,
  UniqueSupplierEntry,
  IngestionCategory,
  RecommendedAction,
  CandidateIngestionResult,
  CampaignReport,
  EditorialReviewEntry,
  EditorialReviewBatch,
} from "./ingestion/types";

// ── Constants ─────────────────────────────────────────────────────────────────

const BATCH_ID                  = "mid-year-2026";
const CAMPAIGN_TIMESTAMP        = "2026-08-08T00:00:00.000Z";
const PRODUCT_CATEGORY          = "fragrance" as ProductCategory;
const EXPECTED_SOURCE_ROW_COUNT = CAMPAIGN_SOURCE_ROW_COUNT; // 31
const EXPECTED_UNIQUE_COUNT     = CAMPAIGN_UNIQUE_COUNT;      // 26
const VALIDATION_COUNT          = 17;

const SUPPLIER_SOURCE_PATH = join(process.cwd(), "data", "identity", "source", "mid-year-2026-supplier.json");
const RESEARCH_SOURCE_PATH = join(process.cwd(), "data", "identity", "source", "mid-year-2026-research.json");
const CAMPAIGN_REPORT_PATH = join(process.cwd(), "app", "lib", "identity", "data", "campaigns", "mid-year-2026-campaign.json");
const EDITORIAL_PATH       = join(process.cwd(), "app", "lib", "identity", "data", "campaigns", "mid-year-2026-editorial.json");

// ── Source file loaders ───────────────────────────────────────────────────────

function loadSupplierSource(): SupplierSourceFile {
  if (!existsSync(SUPPLIER_SOURCE_PATH)) {
    throw new Error(
      `MISSING SOURCE FILE\n` +
      `  Path: ${SUPPLIER_SOURCE_PATH}\n` +
      `  Populate with the 31 supplier rows from the Mid-Year 2026 list.\n` +
      `  See the _schema field in the file for the required JSON format.`,
    );
  }
  const raw: unknown = JSON.parse(readFileSync(SUPPLIER_SOURCE_PATH, "utf-8"));
  return parseSupplierSourceFile(raw);
}

function loadResearchSource(): ResearchSourceFile {
  if (!existsSync(RESEARCH_SOURCE_PATH)) {
    throw new Error(
      `MISSING SOURCE FILE\n` +
      `  Path: ${RESEARCH_SOURCE_PATH}\n` +
      `  Populate with 26 Gemini research entries — one per unique supplier identity.\n` +
      `  See the _schema field in the file for the required JSON format.`,
    );
  }
  const raw: unknown = JSON.parse(readFileSync(RESEARCH_SOURCE_PATH, "utf-8"));
  return parseResearchSourceFile(raw);
}

// ── Idempotency ───────────────────────────────────────────────────────────────

function buildIdempotencyKey(normalizedKey: string): string {
  return `${BATCH_ID}::${normalizedKey}`;
}

function isAlreadyIngested(registry: IdentityRegistry, idempotencyKey: string): boolean {
  for (const record of registry.list()) {
    if (record.supplierIdentities.some(si => si.sourceReference === idempotencyKey)) {
      return true;
    }
  }
  return false;
}

// ── ID allocation ─────────────────────────────────────────────────────────────

function allocateIds(registry: IdentityRegistry, count: number): string[] {
  const existing = registry.list()
    .map(r => r.id)
    .filter(id => /^MIP-\d{6}$/.test(id))
    .map(id => parseInt(id.slice(4), 10))
    .filter(n => !isNaN(n));

  const maxId = existing.length > 0 ? Math.max(...existing) : 0;

  return Array.from({ length: count }, (_, i) =>
    `MIP-${String(maxId + i + 1).padStart(6, "0")}`,
  );
}

// ── Classification ────────────────────────────────────────────────────────────

function classifyEntry(research: ResearchSourceEntry | null): IngestionCategory {
  if (research === null)                                                    return "C";
  if (!research.canonicalName?.trim())                                      return "C";
  if (research.sourceConfidence === "low")                                  return "C";
  if (research.sourceConfidence === "high" && !research.possibleNameIssue) return "A";
  return "B"; // medium OR high + name issue
}

function determineStatus(category: IngestionCategory): "candidate" | "pending-review" {
  return category === "C" ? "candidate" : "pending-review";
}

function recommendAction(
  category: IngestionCategory,
  research: ResearchSourceEntry | null,
): RecommendedAction {
  if (category === "C")            return "research-more";
  if (category === "A")            return "verify";
  if (research?.possibleNameIssue) return "correct-canonical";
  return "confirm-alias";
}

function buildReasonNote(
  category: IngestionCategory,
  research: ResearchSourceEntry | null,
): string {
  if (research === null) return "No research entry found for this supplier name.";
  const proposal = research.canonicalName?.trim() ?? "";
  if (!proposal) return "Research provided no canonical name — supplier terminology used as provisional.";
  if (!isCleanCanonicalProposal(proposal)) {
    return `Research proposed ambiguous multi-option canonical: "${proposal}" — supplier name used as provisional pending human resolution.`;
  }
  if (category === "A") return `High-confidence proposal: "${research.canonicalName}" by "${research.brand}".`;
  if (research.possibleNameIssue) return `Name issue: ${research.nameIssueExplanation ?? "supplier and canonical names differ."}`;
  return `Medium-confidence proposal: "${research.canonicalName}".`;
}

// ── Confidence builder ────────────────────────────────────────────────────────

function buildConfidence(
  category: IngestionCategory,
  research: ResearchSourceEntry | null,
): IdentityConfidence {
  if (research === null || !research.canonicalName?.trim()) {
    return {
      score: 20,
      basis: `Candidate ingestion (${BATCH_ID}): no canonical research proposal available. Supplier terminology preserved as provisional canonical name. Requires additional research.`,
    };
  }
  if (category === "A") {
    return {
      score: 70,
      basis: `Candidate ingestion (${BATCH_ID}): research confidence high, no name issue. Proposed: "${research.canonicalName}" by "${research.brand}". Ready for editorial verification.`,
    };
  }
  if (research.sourceConfidence === "high" && research.possibleNameIssue) {
    return {
      score: 55,
      basis: `Candidate ingestion (${BATCH_ID}): research confidence high but possible name issue. ${research.nameIssueExplanation ?? "Canonical name may differ from supplier terminology."}`,
    };
  }
  if (research.sourceConfidence === "medium") {
    const nameNote = research.possibleNameIssue
      ? ` Name issue: ${research.nameIssueExplanation ?? "supplier and canonical terminology differ."}`
      : "";
    return {
      score: 45,
      basis: `Candidate ingestion (${BATCH_ID}): research confidence medium.${nameNote}`,
    };
  }
  return {
    score: 25,
    basis: `Candidate ingestion (${BATCH_ID}): research confidence low. ${research.sourceNotes ?? "Additional research required."}`,
  };
}

// ── IdentityRecord builder ────────────────────────────────────────────────────

function buildIdentityRecord(
  id: string,
  entry: UniqueSupplierEntry,
  category: IngestionCategory,
): IdentityRecord {
  const research       = entry.researchEntry;
  const primaryEntry   = entry.supplierEntries[0];
  const idempotencyKey = buildIdempotencyKey(entry.normalizedKey);

  const supplierIdentities: SupplierIdentity[] = entry.supplierEntries.map(se => ({
    supplierName:    se.supplierName,
    ...(se.supplierCategory !== undefined ? { supplierCategory: se.supplierCategory } : {}),
    sourceReference: idempotencyKey,
  }));

  // Canonical name: use research proposal only when it is a clean, single-identity proposal.
  // Ambiguous multi-option proposals (e.g. "A / B", "(Note:...)") are rejected and the
  // supplier name is used as provisional. The original research proposal is preserved in evidence.
  const researchProposal   = research?.canonicalName?.trim() ?? "";
  const usedProvisionalName = !researchProposal || !isCleanCanonicalProposal(researchProposal);
  const canonicalName      = !usedProvisionalName ? researchProposal : primaryEntry.supplierName;

  // Canonical brand: Category C receives no assumed brand
  const canonicalBrand: string | undefined =
    category !== "C" && research?.brand?.trim()
      ? research.brand.trim()
      : undefined;

  // launchYear: null in source means unresolved — omit from canonical (absence ≠ no launch year)
  // marketedGender: "unknown" in source means unresolved — omit from canonical (absence ≠ unisex)
  const canonicalIdentity: CanonicalIdentity = {
    canonicalName,
    ...(canonicalBrand !== undefined ? { canonicalBrand } : {}),
    ...(research?.launchYear != null ? { launchYear: research.launchYear } : {}),
    ...(research?.marketedGender !== undefined && research.marketedGender !== "unknown"
      ? { marketedGender: research.marketedGender }
      : {}),
    category: PRODUCT_CATEGORY,
  };

  const evidence: IdentityEvidence[] = [];

  evidence.push({
    evidenceId:      `${id}-ev-sup`,
    type:            "supplier-catalogue",
    sourceName:      "Mid-Year 2026 Supplier List",
    sourceReference: idempotencyKey,
    observedValue:   entry.supplierEntries.map(se => se.supplierName).join(" / "),
    notes:           `Supplier group(s): ${entry.supplierEntries.map(se => se.supplierCategory ?? "unspecified").join(", ")}.`,
    createdAt:       CAMPAIGN_TIMESTAMP,
  });

  if (research !== null) {
    const noCanonicalNote = !researchProposal
      ? " No canonical name proposed — supplier terminology used as provisional."
      : "";
    const ambiguousNote = researchProposal && !isCleanCanonicalProposal(researchProposal)
      ? " Research proposed ambiguous multi-option canonical — supplier name used as provisional pending human resolution."
      : "";
    const nameIssueNote = !ambiguousNote && !noCanonicalNote && research.possibleNameIssue
      ? ` Possible name issue: ${research.nameIssueExplanation ?? "supplier and canonical names differ."}`
      : "";

    evidence.push({
      evidenceId:      `${id}-ev-res`,
      type:            "research",
      sourceName:      "Gemini Research — Mid-Year 2026",
      sourceReference: `${BATCH_ID}-research`,
      observedValue:   research.canonicalName || "(none proposed)",
      notes:           `Research confidence: ${research.sourceConfidence}.${noCanonicalNote}${ambiguousNote}${nameIssueNote}${research.sourceNotes ? " " + research.sourceNotes : ""}`,
      createdAt:       CAMPAIGN_TIMESTAMP,
    });
  }

  if (category === "C" && usedProvisionalName) {
    const provNote = !researchProposal
      ? "Canonical identity unresolved — supplier terminology temporarily preserved as candidate display identity pending additional research."
      : "Canonical identity ambiguous — research proposed multiple possible identities. Supplier terminology preserved as provisional pending human resolution.";
    evidence.push({
      evidenceId: `${id}-ev-prov`,
      type:       "editorial",
      sourceName: "EP5-P2C Ingestion Engine",
      notes:      provNote,
      createdAt:  CAMPAIGN_TIMESTAMP,
    });
  }

  const history: IdentityHistoryEntry[] = [
    {
      timestamp: CAMPAIGN_TIMESTAMP,
      event:     "created",
      summary:   `Candidate identity created by EP5-P2C controlled ingestion (${BATCH_ID} campaign). Category ${category}: ${determineStatus(category)}.`,
      actor:     `EP5-P2C:${BATCH_ID}`,
    },
  ];

  return {
    id,
    supplierIdentities,
    canonicalIdentity,
    aliases:    [],
    evidence,
    confidence: buildConfidence(category, research),
    status:     determineStatus(category),
    history,
    createdAt:  CAMPAIGN_TIMESTAMP,
    updatedAt:  CAMPAIGN_TIMESTAMP,
  };
}

// ── Validation suite ──────────────────────────────────────────────────────────

type ValidationEntry = { label: string; passed: boolean; detail?: string };

function runValidations(
  records: IdentityRecord[],
  uniqueEntries: UniqueSupplierEntry[],
  supplierFile: SupplierSourceFile,
): { results: ValidationEntry[]; allPassed: boolean } {
  const results: ValidationEntry[] = [];

  function check(label: string, fn: () => void): void {
    try {
      fn();
      results.push({ label, passed: true });
    } catch (err) {
      results.push({ label, passed: false, detail: String(err) });
    }
  }

  // 1. Source file has the expected row count for this campaign
  check(`Source file has ${EXPECTED_SOURCE_ROW_COUNT} supplier rows (campaign invariant)`, () => {
    if (supplierFile.entries.length !== EXPECTED_SOURCE_ROW_COUNT) {
      throw new Error(
        `Expected ${EXPECTED_SOURCE_ROW_COUNT} source rows, got ${supplierFile.entries.length}`,
      );
    }
  });

  // 2. Unique supplier count matches expected
  check(`${EXPECTED_UNIQUE_COUNT} unique supplier identities after deduplication`, () => {
    if (records.length !== EXPECTED_UNIQUE_COUNT) {
      throw new Error(
        `Expected ${EXPECTED_UNIQUE_COUNT} unique identities, got ${records.length}`,
      );
    }
  });

  // 3. L/M rows collapsed correctly
  check("Duplicate L/M rows collapsed correctly into single IdentityRecord per identity", () => {
    const collapsed = uniqueEntries.filter(e => e.supplierEntries.length > 1);
    for (const c of collapsed) {
      const key = buildIdempotencyKey(c.normalizedKey);
      const record = records.find(r =>
        r.supplierIdentities.some(si => si.sourceReference === key),
      );
      if (!record) {
        throw new Error(`No record found for collapsed entry: "${c.normalizedKey}"`);
      }
      if (record.supplierIdentities.length !== c.supplierEntries.length) {
        throw new Error(
          `Collapsed entry "${c.normalizedKey}": ${c.supplierEntries.length} source rows ` +
          `but record has ${record.supplierIdentities.length} SupplierIdentity entries`,
        );
      }
    }
  });

  // 4. Supplier names preserved verbatim
  check("All supplier names preserved verbatim in SupplierIdentity entries", () => {
    const allOriginalNames = new Set(supplierFile.entries.map(e => e.supplierName));
    for (const record of records) {
      for (const si of record.supplierIdentities) {
        if (!allOriginalNames.has(si.supplierName)) {
          throw new Error(
            `SupplierIdentity name "${si.supplierName}" does not match any original source entry`,
          );
        }
      }
    }
  });

  // 5. NONE may be verified
  check("NONE verified — all status values are 'candidate' or 'pending-review'", () => {
    for (const record of records) {
      if (record.status === "verified") {
        throw new Error(`${record.id} has status "verified" — prohibited by EP5-P2C`);
      }
      if (record.status !== "candidate" && record.status !== "pending-review") {
        throw new Error(`${record.id} has unexpected status "${record.status}"`);
      }
    }
  });

  // 6. All identity IDs match MIP-NNNNNN format
  check("All identity IDs match MIP-NNNNNN format", () => {
    for (const record of records) {
      if (!/^MIP-\d{6}$/.test(record.id)) {
        throw new Error(`Invalid ID format: "${record.id}"`);
      }
    }
  });

  // 7. All identity IDs unique within batch
  check("All identity IDs unique within batch", () => {
    const ids = records.map(r => r.id);
    if (new Set(ids).size !== ids.length) {
      throw new Error("Duplicate IDs detected in batch");
    }
  });

  // 8. All records use category = "fragrance"
  check("All records have canonicalIdentity.category = 'fragrance'", () => {
    for (const record of records) {
      if (record.canonicalIdentity.category !== "fragrance") {
        throw new Error(
          `${record.id} has category "${String(record.canonicalIdentity.category)}" instead of "fragrance"`,
        );
      }
    }
  });

  // 9. All confidence scores are valid (0–100)
  check("All confidence scores are numbers in range 0–100", () => {
    for (const record of records) {
      const { score } = record.confidence;
      if (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > 100) {
        throw new Error(`${record.id} has invalid confidence score: ${score}`);
      }
    }
  });

  // 10. All records pass validateIdentityRecord()
  check("All records pass validateIdentityRecord() — zero FAIL status", () => {
    for (const record of records) {
      const result = validateIdentityRecord(record);
      if (result.status === "FAIL") {
        const msgs = result.errors.map(e => `[${e.code}] ${e.message}`).join("; ");
        throw new Error(`${record.id} FAILED: ${msgs}`);
      }
    }
  });

  // 11. No canonical collision
  check("No canonical identity collisions — all records register cleanly together", () => {
    const testReg = new IdentityRegistry();
    for (const record of records) {
      testReg.register(record);
    }
  });

  // 12. All evidence IDs unique within each record
  check("All evidence IDs unique within each record", () => {
    for (const record of records) {
      const ids = record.evidence.map(e => e.evidenceId);
      if (new Set(ids).size !== ids.length) {
        throw new Error(`${record.id} has duplicate evidence IDs: ${ids.join(", ")}`);
      }
    }
  });

  // 13. All records carry at least one supplier-catalogue evidence entry
  check("All records have at least one supplier-catalogue evidence entry", () => {
    for (const record of records) {
      if (!record.evidence.some(e => e.type === "supplier-catalogue")) {
        throw new Error(`${record.id} missing supplier-catalogue evidence`);
      }
    }
  });

  // 14. Records with a research match carry at least one research evidence entry
  check("Records with research match carry at least one research evidence entry", () => {
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const entry  = uniqueEntries[i];
      if (entry !== undefined && entry.researchEntry !== null) {
        if (!record.evidence.some(e => e.type === "research")) {
          throw new Error(`${record.id} has research match but no research evidence entry`);
        }
      }
    }
  });

  // 15. Category C records do not carry canonicalBrand
  check("Category C (candidate) records do not carry an assumed canonicalBrand", () => {
    for (const record of records) {
      if (record.status === "candidate" && record.canonicalIdentity.canonicalBrand !== undefined) {
        throw new Error(
          `${record.id} is "candidate" but has canonicalBrand "${record.canonicalIdentity.canonicalBrand}"`,
        );
      }
    }
  });

  // 16. All records have non-empty canonicalName
  check("All records have a non-empty canonicalName", () => {
    for (const record of records) {
      if (!record.canonicalIdentity.canonicalName?.trim()) {
        throw new Error(`${record.id} has empty or missing canonicalName`);
      }
    }
  });

  // 17. Idempotency keys unique across records
  check("Idempotency keys unique across all records (one per identity)", () => {
    const seen = new Set<string>();
    for (const record of records) {
      const batchKeys = record.supplierIdentities
        .map(si => si.sourceReference ?? "")
        .filter(k => k.startsWith(`${BATCH_ID}::`));
      const uniqueForRecord = new Set(batchKeys);
      if (uniqueForRecord.size !== 1) {
        throw new Error(
          `${record.id} has ${uniqueForRecord.size} distinct idempotency keys — expected exactly 1`,
        );
      }
      const key = [...uniqueForRecord][0]!;
      if (seen.has(key)) {
        throw new Error(`Idempotency key collision: "${key}" used by two records`);
      }
      seen.add(key);
    }
  });

  const allPassed = results.every(r => r.passed);
  return { results, allPassed };
}

// ── Campaign report builder ───────────────────────────────────────────────────

function buildCampaignReport(
  records: IdentityRecord[],
  uniqueEntries: UniqueSupplierEntry[],
  supplierFile: SupplierSourceFile,
  skippedCount: number,
  resolverResults: Map<string, string>,
): CampaignReport {
  const reportRecords: CandidateIngestionResult[] = records.map((record, idx) => {
    const entry    = uniqueEntries[idx];
    const research = entry?.researchEntry ?? null;
    const category = classifyEntry(research);
    const rawProposal = research?.canonicalName?.trim() ?? "";
    return {
      supplierName:               entry?.supplierEntries[0]?.supplierName ?? record.id,
      supplierGroups:             entry?.supplierEntries.map(se => se.supplierCategory ?? "unspecified") ?? [],
      ingestionCategory:          category,
      identityId:                 record.id,
      proposedCanonicalName:      record.canonicalIdentity.canonicalName,
      proposedCanonicalBrand:     record.canonicalIdentity.canonicalBrand,
      researchCanonicalProposal:  rawProposal || undefined,
      researchConfidence:         research ? research.sourceConfidence : "none",
      possibleNameIssue:          research?.possibleNameIssue ?? false,
      resolutionBeforeIngestion:  resolverResults.get(entry?.normalizedKey ?? "") ?? "no-match",
      status:                     record.status,
      recommendedAction:          recommendAction(category, research),
      reason:                     buildReasonNote(category, research),
    };
  });

  const collapsed = uniqueEntries.filter(e => e.supplierEntries.length > 1).length;

  return {
    batchId:                BATCH_ID,
    campaignTimestamp:      CAMPAIGN_TIMESTAMP,
    sourceSupplierRowCount: supplierFile.entries.length,
    uniqueSupplierCount:    uniqueEntries.length,
    duplicateRowsCollapsed: collapsed,
    preResolvedCount:       0,
    candidateCreatedCount:  records.length,
    pendingReviewCount:     records.filter(r => r.status === "pending-review").length,
    candidateCount:         records.filter(r => r.status === "candidate").length,
    unresolvedCount:        0,
    skippedCount,
    records:                reportRecords,
  };
}

// ── Editorial review batch builder ───────────────────────────────────────────

function buildEditorialReviewBatch(
  records: IdentityRecord[],
  uniqueEntries: UniqueSupplierEntry[],
): EditorialReviewBatch {
  const entries: EditorialReviewEntry[] = records.map((record, idx) => {
    const entry    = uniqueEntries[idx];
    const research = entry?.researchEntry ?? null;
    const category = classifyEntry(research);
    const rawProposal = research?.canonicalName?.trim() ?? "";
    return {
      identityId:                record.id,
      supplierName:              entry?.supplierEntries[0]?.supplierName ?? record.id,
      supplierGroups:            entry?.supplierEntries.map(se => se.supplierCategory ?? "unspecified") ?? [],
      proposedCanonicalName:     record.canonicalIdentity.canonicalName,
      proposedCanonicalBrand:    record.canonicalIdentity.canonicalBrand,
      researchCanonicalProposal: rawProposal || undefined,
      status:                    record.status,
      researchConfidence:        research ? research.sourceConfidence : "none",
      possibleNameIssue:         research?.possibleNameIssue ?? false,
      researchNotes:             research?.sourceNotes,
      nameIssueExplanation:      research?.nameIssueExplanation,
      evidenceIds:               record.evidence.map(e => e.evidenceId),
      recommendedAction:         recommendAction(category, research),
    };
  });

  return {
    batchId:      BATCH_ID,
    generatedAt:  CAMPAIGN_TIMESTAMP,
    totalEntries: entries.length,
    entries,
  };
}

// ── Console output ────────────────────────────────────────────────────────────

function printSummary(
  report: CampaignReport,
  validationResults: ValidationEntry[],
  isDryRun: boolean,
): void {
  const passed = validationResults.filter(v => v.passed).length;
  const failed = validationResults.filter(v => !v.passed).length;

  console.log("\n══════════════════════════════════════════════════════════");
  console.log(`  MIP EP5-P2C — ${BATCH_ID} Identity Candidate Ingestion`);
  console.log(`  Mode: ${isDryRun ? "DRY RUN (no writes)" : "REAL RUN"}`);
  console.log("══════════════════════════════════════════════════════════\n");

  console.log("  SOURCE");
  console.log(`    Supplier rows in source:   ${report.sourceSupplierRowCount}`);
  console.log(`    Unique identities:         ${report.uniqueSupplierCount}`);
  console.log(`    L/M rows collapsed:        ${report.duplicateRowsCollapsed}`);
  console.log(`    Skipped (already present): ${report.skippedCount}`);
  console.log();

  console.log("  OUTPUT");
  console.log(`    Records created:           ${report.candidateCreatedCount}`);
  console.log(`      → pending-review:        ${report.pendingReviewCount}`);
  console.log(`      → candidate:             ${report.candidateCount}`);
  console.log();

  console.log(`  VALIDATION  (${passed}/${VALIDATION_COUNT} passed)`);
  for (const v of validationResults) {
    const icon = v.passed ? "✓" : "✗";
    console.log(`    ${icon}  ${v.label}`);
    if (!v.passed && v.detail) {
      console.log(`       Detail: ${v.detail}`);
    }
  }
  console.log();

  if (failed > 0) {
    console.log(
      `  ✗ INGESTION BLOCKED — ${failed} validation(s) failed. Fix before running real ingestion.\n`,
    );
  } else if (isDryRun) {
    console.log("  ✓ DRY RUN COMPLETE — all validations passed.");
    console.log(`  Ready for real run: npm run mip:ingest:2026\n`);
  } else {
    console.log("  ✓ INGESTION COMPLETE");
    console.log(`    Registry:  app/lib/identity/data/identity-registry.json`);
    console.log(`    Campaign:  app/lib/identity/data/campaigns/mid-year-2026-campaign.json`);
    console.log(`    Editorial: app/lib/identity/data/campaigns/mid-year-2026-editorial.json\n`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main(): void {
  const isDryRun = process.argv.includes("--dry-run");

  console.log(`\n  EP5-P2C: Loading source files...`);

  let supplierFile: SupplierSourceFile;
  let researchFile: ResearchSourceFile;
  try {
    supplierFile = loadSupplierSource();
    researchFile = loadResearchSource();
  } catch (err) {
    console.error(`\n  ERROR loading source files:\n  ${String(err)}\n`);
    process.exit(1);
  }

  if (supplierFile.entries.length === 0) {
    console.error(
      `\n  SOURCE FILE EMPTY: ${SUPPLIER_SOURCE_PATH}\n` +
      `  Populate the "entries" array with the 31 fragrance supplier rows.\n` +
      `  See the _schema field in the file for the required format.\n`,
    );
    process.exit(1);
  }

  if (researchFile.entries.length === 0) {
    console.error(
      `\n  SOURCE FILE EMPTY: ${RESEARCH_SOURCE_PATH}\n` +
      `  Populate the "entries" array with Gemini research for each unique supplier identity.\n` +
      `  See the _schema field in the file for the required format.\n`,
    );
    process.exit(1);
  }

  console.log(`  Supplier rows loaded:    ${supplierFile.entries.length}`);
  console.log(`  Research entries loaded: ${researchFile.entries.length}`);

  // Load existing registry
  const registryData = loadIdentityRegistry();
  const registry     = new IdentityRegistry();
  for (const record of registryData.identities) {
    registry.register(record);
  }
  console.log(`  Existing registry size:  ${registry.list().length}`);

  // Deduplicate and match research
  let uniqueEntries = deduplicateSupplierRows(supplierFile.entries);
  uniqueEntries     = matchResearch(uniqueEntries, researchFile.entries);
  console.log(`  Unique identities after deduplication: ${uniqueEntries.length}`);

  // Source/research correspondence — must pass before any further processing
  console.log(`  Verifying source/research correspondence...`);
  try {
    verifySourceCorrespondence(uniqueEntries, researchFile.entries);
  } catch (err) {
    console.error(`\n  CORRESPONDENCE ERROR\n  ${String(err)}\n`);
    process.exit(1);
  }
  console.log(
    `  Correspondence verified: ${uniqueEntries.length} suppliers ↔ ${researchFile.entries.length} research entries.`,
  );

  // Idempotency check
  const toProcess: UniqueSupplierEntry[] = [];
  let skippedCount = 0;

  for (const entry of uniqueEntries) {
    const key = buildIdempotencyKey(entry.normalizedKey);
    if (isAlreadyIngested(registry, key)) {
      console.log(`  SKIP (already ingested): "${entry.supplierEntries[0].supplierName}"`);
      skippedCount++;
    } else {
      toProcess.push(entry);
    }
  }

  if (skippedCount > 0 && toProcess.length === 0) {
    console.log(`\n  All ${skippedCount} entries already ingested — registry is current. Exiting.\n`);
    process.exit(0);
  }

  // Partial-state guard — refuse partial campaign state to avoid misleading errors
  if (skippedCount > 0 && toProcess.length > 0) {
    console.error(
      `\n  PARTIAL CAMPAIGN STATE DETECTED\n` +
      `  ${skippedCount} of ${EXPECTED_UNIQUE_COUNT} identities already present in registry.\n` +
      `  ${toProcess.length} remain unprocessed.\n` +
      `\n` +
      `  This episode does not support incremental resume. To proceed:\n` +
      `    A. If the ${skippedCount} ingested records are correct, contact the platform\n` +
      `       engineer to resolve the partial state manually.\n` +
      `    B. To restart from scratch, restore the registry backup:\n` +
      `         cp app/lib/identity/data/identity-registry.json.bak \\\n` +
      `            app/lib/identity/data/identity-registry.json\n` +
      `       Then re-run: npm run mip:ingest:2026:dry\n`,
    );
    process.exit(1);
  }

  // Pre-ingestion resolver check against existing persisted registry
  const resolver        = new DeterministicIdentityResolver(registry);
  const resolverResults = new Map<string, string>();

  console.log(`\n  Pre-ingestion resolver check (${toProcess.length} entries)...`);
  for (const entry of toProcess) {
    const primary = entry.supplierEntries[0];
    const result  = resolver.resolve({ supplierName: primary.supplierName, category: PRODUCT_CATEGORY });
    resolverResults.set(entry.normalizedKey, result.status);

    if (result.status === "resolved") {
      console.error(
        `\n  RESOLVER CONFLICT\n` +
        `  Supplier: "${primary.supplierName}"\n` +
        `  Matched to existing verified identity — do not ingest as new candidate.\n` +
        `  Review the existing identity and resolve the conflict first.\n`,
      );
      process.exit(1);
    }
  }
  console.log(`  Pre-ingestion resolver check passed.`);

  // Allocate IDs and build records
  const ids = allocateIds(registry, toProcess.length);
  const records: IdentityRecord[] = toProcess.map((entry, idx) => {
    const category = classifyEntry(entry.researchEntry);
    return buildIdentityRecord(ids[idx]!, entry, category);
  });

  // Run 17-point validation suite
  console.log(`\n  Running ${VALIDATION_COUNT} pre-ingestion validation checks...`);
  const { results: validationResults, allPassed } = runValidations(records, toProcess, supplierFile);

  // Build operational output files
  const campaignReport = buildCampaignReport(records, toProcess, supplierFile, skippedCount, resolverResults);
  const editorialBatch = buildEditorialReviewBatch(records, toProcess);

  printSummary(campaignReport, validationResults, isDryRun);

  if (!allPassed) {
    process.exit(1);
  }

  if (isDryRun) {
    console.log("  [DRY RUN] Files that would be written:");
    console.log(`    app/lib/identity/data/identity-registry.json (${records.length} new records — written FIRST)`);
    console.log(`    ${CAMPAIGN_REPORT_PATH}`);
    console.log(`    ${EDITORIAL_PATH}\n`);
    process.exit(0);
  }

  // Real run: registry is written FIRST (source of truth).
  // Campaign and editorial files are written after. If either fails after registry
  // succeeds, the registry remains correct and files can be regenerated.
  console.log("  Writing identity registry (atomic, first)...");
  const updatedIdentities = [...registryData.identities, ...records];
  saveIdentityRegistry({
    version:    IDENTITY_PLATFORM_VERSION,
    identities: updatedIdentities,
  });

  console.log("  Writing campaign report...");
  mkdirSync(dirname(CAMPAIGN_REPORT_PATH), { recursive: true });
  writeFileSync(CAMPAIGN_REPORT_PATH, JSON.stringify(campaignReport, null, 2), "utf-8");

  console.log("  Writing editorial review batch...");
  writeFileSync(EDITORIAL_PATH, JSON.stringify(editorialBatch, null, 2), "utf-8");

  console.log(`\n  ✓ ${records.length} candidate identities written to registry.\n`);
}

main();

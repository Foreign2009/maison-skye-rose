/**
 * Maison Identity Platform — EP5-P2C Ingestion Type Contracts
 *
 * Defines the shape of the two source data files and all intermediate
 * and output types for the Mid-Year 2026 controlled identity ingestion.
 *
 * Source data files (to be placed by the founder):
 *   data/identity/source/mid-year-2026-supplier.json
 *   data/identity/source/mid-year-2026-research.json
 *
 * KNOWLEDGE fields (fragranceFamily, notes, accords, perfumer) appear in
 * ResearchSourceEntry so they can be preserved in the research file for
 * future Knowledge Factory use. They are NOT ingested into IdentityRecord.
 */

import type { IdentityStatus } from "../../../app/lib/identity/types";

// ── Source file types ─────────────────────────────────────────────────────────

/**
 * One row from the supplier catalogue source.
 * Supplier name must be preserved exactly as received from the supplier.
 */
export type SupplierSourceEntry = {
  readonly supplierName:      string;   // Required; verbatim from supplier
  readonly supplierCategory?: string;  // "L" | "M" | "UNISEX" — verbatim
  readonly sourceReference?:  string;  // e.g., "Mid-Year 2026 Supplier List, Row 14"
};

/**
 * Top-level shape of the supplier source JSON file.
 */
export type SupplierSourceFile = {
  readonly batchId:         string;
  readonly description:     string;
  readonly sourceReference: string;
  readonly entries:         readonly SupplierSourceEntry[];
};

/**
 * Source-level marketed gender — extends the canonical MarketedGender with "unknown"
 * for entries where research could not determine the gender.
 *
 * RULE: "unknown" must NEVER be copied to CanonicalIdentity.marketedGender.
 *       Unknown research information is represented as absence of canonical truth.
 *       Do not convert "unknown" to "unisex".
 */
export type ResearchMarketedGender = "female" | "male" | "unisex" | "shared" | "unknown";

/**
 * One row from the Gemini research source.
 *
 * Fields are split into:
 *   - Identity-relevant (consumed by EP5-P2C to build IdentityRecord)
 *   - Knowledge-only (preserved in source file; NOT ingested into IdentityRecord)
 *
 * supplierName links this entry to a SupplierSourceEntry.
 * The link is by normalised string match, not a foreign key.
 */
export type ResearchSourceEntry = {
  readonly supplierName:          string;   // Match key — must correspond to a SupplierSourceEntry

  // ── Identity-relevant fields (consumed by EP5-P2C) ────────────────────────
  readonly canonicalName:         string;   // Research-proposed canonical name; may be empty
  readonly brand:                 string;   // Research-proposed canonical brand; may be empty
  readonly launchYear?:           number | null;
  readonly marketedGender?:       ResearchMarketedGender;
  readonly sourceConfidence:      "high" | "medium" | "low";
  readonly sourceNotes?:          string;
  readonly possibleNameIssue:     boolean;
  readonly nameIssueExplanation?: string;

  // ── Knowledge-only fields (preserved here for future Knowledge Factory use) ──
  // These are NOT moved into IdentityRecord canonical identity or evidence.
  readonly fragranceFamily?: readonly string[];
  readonly topNotes?:        readonly string[];
  readonly heartNotes?:      readonly string[];
  readonly baseNotes?:       readonly string[];
  readonly mainAccords?:     readonly string[];
  readonly perfumer?:        readonly string[];
};

/**
 * Top-level shape of the research source JSON file.
 */
export type ResearchSourceFile = {
  readonly batchId:      string;
  readonly researchedBy: string;
  readonly researchDate: string;
  readonly entries:      readonly ResearchSourceEntry[];
};

// ── Ingestion pipeline types ──────────────────────────────────────────────────

/**
 * Classification of a candidate ingestion entry.
 *
 * A  — Research-Strong: high confidence, no name issue, complete canonical proposal.
 *      Action: pending-review → "verify"
 *
 * B  — Research-Probable / Name Variation: plausible canonical proposal but
 *      medium confidence OR possible name issue exists.
 *      Action: pending-review → "correct-canonical" or "confirm-alias"
 *
 * C  — Unverified / No Canonical Proposal: low confidence, empty canonical name,
 *      or research could not verify the exact fragrance.
 *      Action: candidate → "research-more"
 */
export type IngestionCategory = "A" | "B" | "C";

/**
 * Recommended editorial action for each identity in the review batch.
 */
export type RecommendedAction =
  | "verify"             // High-confidence complete proposal — confirm as institutional truth
  | "confirm-alias"      // Canonical proposal exists but supplier wording differs — confirm alias
  | "correct-canonical"  // Name discrepancy between supplier and research — editorial correction needed
  | "research-more"      // Insufficient evidence — additional research required
  | "reject";            // Does not represent a real or distinguishable identity (not auto-assigned)

/**
 * A deduplicated supplier entry — one logical identity.
 * Multiple supplier rows (e.g., "L" and "M" for the same fragrance) are
 * collapsed into one UniqueSupplierEntry with multiple supplierEntries.
 */
export type UniqueSupplierEntry = {
  readonly normalizedKey:    string;
  readonly supplierEntries:  readonly SupplierSourceEntry[];  // All L/M/UNISEX rows for this identity
  readonly researchEntry:    ResearchSourceEntry | null;       // null = no research match found
};

/**
 * Per-record ingestion outcome for the campaign report.
 */
export type CandidateIngestionResult = {
  readonly supplierName:          string;
  readonly supplierGroups:        readonly string[];  // e.g., ["L", "M"]
  readonly ingestionCategory:     IngestionCategory;
  readonly identityId:            string;
  readonly proposedCanonicalName: string;
  readonly proposedCanonicalBrand?: string;
  readonly researchConfidence:    "high" | "medium" | "low" | "none";
  readonly possibleNameIssue:     boolean;
  readonly resolutionBeforeIngestion: string;  // "no-match" | "candidate" | "resolved" | "ambiguous" | "blocked"
  readonly status:                IdentityStatus;
  readonly recommendedAction:     RecommendedAction;
  readonly reason:                string;
};

/**
 * Full campaign report written to campaigns/mid-year-2026-campaign.json.
 * Operational provenance — separate from the canonical identity registry.
 */
export type CampaignReport = {
  readonly batchId:                string;
  readonly campaignTimestamp:      string;
  readonly sourceSupplierRowCount: number;
  readonly uniqueSupplierCount:    number;
  readonly duplicateRowsCollapsed: number;
  readonly preResolvedCount:       number;
  readonly candidateCreatedCount:  number;
  readonly pendingReviewCount:     number;
  readonly candidateCount:         number;
  readonly unresolvedCount:        number;
  readonly skippedCount:           number;
  readonly records:                readonly CandidateIngestionResult[];
};

/**
 * One entry in the editorial review batch.
 * Written to campaigns/mid-year-2026-editorial.json.
 * Provides everything EP5-P3 needs to build the review UI.
 */
export type EditorialReviewEntry = {
  readonly identityId:              string;
  readonly supplierName:            string;
  readonly supplierGroups:          readonly string[];
  readonly proposedCanonicalName:   string;
  readonly proposedCanonicalBrand?: string;
  readonly status:                  IdentityStatus;
  readonly researchConfidence:      "high" | "medium" | "low" | "none";
  readonly possibleNameIssue:       boolean;
  readonly researchNotes?:          string;
  readonly nameIssueExplanation?:   string;
  readonly evidenceIds:             readonly string[];
  readonly recommendedAction:       RecommendedAction;
};

/**
 * Full editorial review batch.
 */
export type EditorialReviewBatch = {
  readonly batchId:       string;
  readonly generatedAt:   string;
  readonly totalEntries:  number;
  readonly entries:       readonly EditorialReviewEntry[];
};

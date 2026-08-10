/**
 * EP6-P2 — Catalogue Remediation Queue Service
 *
 * Derives a prioritized, categorized remediation worklist from the EP6-P1
 * catalogue integrity audit snapshot. No knowledge records are modified.
 * No AI generation. No research campaign. No promotion. No identity mutation.
 *
 * Priority model:
 *   P0 — DETERMINISTIC_POLICY_CORRECTION (HIGH-severity free-text policy violation)
 *   P1 — RELATIONSHIP_STRUCTURAL_CORRECTION (dangling slug, self-reference, duplicate)
 *   P2 — EDITORIAL_REVIEW (MEDIUM-severity policy violation requiring human judgment)
 *   P3 — RELATIONSHIP_EDITORIAL_REVIEW (AI-generated relationships, no structural defect)
 *   P4 — MIP_IDENTITY_ONBOARDING (ungoverned record, no higher-priority issue)
 *   P5 — NO_ACTION (fully governed, no outstanding issues)
 */

import type { FragranceKnowledge } from "../../app/lib/mkc/types";
import { validateKnowledgeRecord } from "../../app/lib/mkc/validator";
import type {
  RecordAuditResult,
  PolicyFinding,
  ProvenanceClass,
  RiskLevel,
  GenerationProvenance,
  GovernanceState,
} from "./catalogueKnowledgeIntegrityAudit";

// ── Domain types ───────────────────────────────────────────────────────────────

export type PriorityTier = "P0" | "P1" | "P2" | "P3" | "P4" | "P5";

export type IssueCategory =
  | "DETERMINISTIC_POLICY_CORRECTION"
  | "RELATIONSHIP_STRUCTURAL_CORRECTION"
  | "SCHEMA_POLICY_REVIEW"
  | "EDITORIAL_REVIEW"
  | "RELATIONSHIP_EDITORIAL_REVIEW"
  | "MIP_IDENTITY_ONBOARDING"
  | "NO_ACTION";

export type RemediationAction =
  | "DETERMINISTIC_POLICY_CORRECTION"
  | "RELATIONSHIP_STRUCTURAL_CORRECTION"
  | "SCHEMA_POLICY_REVIEW"
  | "EDITORIAL_REVIEW"
  | "RELATIONSHIP_EDITORIAL_REVIEW"
  | "MIP_IDENTITY_ONBOARDING"
  | "NO_ACTION";

export type RelationshipStructuralFinding = {
  readonly code:    string;
  readonly field:   string;
  readonly message: string;
};

export type VocabularyPolicyFinding = {
  readonly field:                "scentCharacter";
  readonly value:                string;
  readonly policyClassification: "SAFE" | "REVIEW" | "POLICY_CONFLICT";
  readonly reason:               string;
};

export type ProvenanceDebt = {
  readonly classification:       "CONTENT_ACTION_REQUIRED" | "DOCUMENTATION_ONLY" | "UNKNOWN";
  readonly generationProvenance: string;
  readonly governanceState:      string;
  readonly note:                 string;
};

export type RemediationItem = {
  readonly slug:                          string;
  readonly name:                          string;
  readonly collection:                    string;
  readonly provenanceClass:               ProvenanceClass;
  readonly generationProvenance:          GenerationProvenance;
  readonly governanceState:               GovernanceState;
  readonly currentRiskLevel:              RiskLevel;
  readonly priorityTier:                  PriorityTier;
  readonly issueCategories:               IssueCategory[];
  readonly policyFindings:                readonly PolicyFinding[];
  readonly vocabularyPolicyFindings:      VocabularyPolicyFinding[];
  readonly relationshipStructuralFindings: RelationshipStructuralFinding[];
  readonly hasRelationships:              boolean;
  readonly relationshipEntryCount:        number;
  readonly provenanceDebt:               ProvenanceDebt;
  readonly recommendedActions:            RemediationAction[];
  readonly canCorrectDeterministically:   boolean;
  readonly requiresExternalResearch:      boolean;
  readonly requiresFounderDecision:       boolean;
  readonly blockingPrerequisite:          string | null;
};

export type ScentCharacterVocabAssessment = {
  readonly value:                   string;
  readonly usageCount:              number;
  readonly policyClassification:    "SAFE" | "REVIEW" | "POLICY_CONFLICT";
  readonly reason:                  string;
  readonly recommendedDisposition:  string;
};

export type RemediationSummary = {
  readonly totalRecords:                       number;
  readonly byPriorityTier:                     Record<string, number>;
  readonly byIssueCategory:                    Record<string, number>;
  readonly totalStructuralFindings:            number;
  readonly recordsWithStructuralFindings:      number;
  readonly recordsRequiringFounderDecision:    number;
  readonly recordsCanCorrectDeterministically: number;
  readonly vocabularyAssessment: {
    readonly scentCharacter: ScentCharacterVocabAssessment[];
  };
};

export type CatalogueRemediationQueue = {
  readonly version:          string;
  readonly generatedAt:      string;
  readonly generatedBy:      string;
  readonly auditVersion:     string;
  readonly auditGeneratedAt: string;
  readonly safetyInvariants: {
    readonly noKnowledgeModified: boolean;
    readonly noAiGeneration:      boolean;
    readonly noResearchCampaign:  boolean;
    readonly noPromotion:         boolean;
    readonly noIdentityMutation:  boolean;
    readonly approvedIdentityId:  null;
    readonly force:               false;
  };
  readonly summary: RemediationSummary;
  readonly items:   RemediationItem[];
};

export type RemediationInput = {
  readonly auditRecords:     RecordAuditResult[];
  readonly auditVersion:     string;
  readonly auditGeneratedAt: string;
  readonly nativeRecords:    FragranceKnowledge[];
};

// ── Structural relationship issue codes ───────────────────────────────────────

const STRUCTURAL_CODES = new Set([
  "RELATIONSHIP_SELF_REFERENCE",
  "RELATIONSHIP_SLUG_NOT_FOUND",
  "RELATIONSHIP_DUPLICATE_SLUG",
]);

// ── scentCharacter vocabulary policy ──────────────────────────────────────────
//
// Source: docs/mkc-authoring-guide.md § scentCharacter vocabulary (lines 78–85)
//         and § Performance Claim Policy.
// "Rich & Long Wearing" contains longevity language. Per the Performance Claim
// Policy this is a schema-governed vocabulary value requiring founder disposition.

const SCENT_CHARACTER_POLICY: Record<string, {
  policyClassification: "SAFE" | "REVIEW" | "POLICY_CONFLICT";
  reason:               string;
  recommendedDisposition: string;
}> = {
  "Fresh & Light": {
    policyClassification: "SAFE",
    reason:               "Describes olfactive character and sillage weight. Contains no longevity or measurable performance language.",
    recommendedDisposition: "RETAIN — no vocabulary action required.",
  },
  "Balanced Signature": {
    policyClassification: "SAFE",
    reason:               "Describes olfactive balance and occasion weight. Contains no longevity or measurable performance language.",
    recommendedDisposition: "RETAIN — no vocabulary action required.",
  },
  "Rich & Long Wearing": {
    policyClassification: "REVIEW",
    reason:
      "Contains 'Long Wearing' — longevity language. Per the Performance Claim Policy " +
      "(docs/mkc-authoring-guide.md § Performance Claim Policy), measurable performance claims " +
      "are prohibited. As a schema-governed vocabulary value this is not free-text editorial copy, " +
      "but a founder disposition is required: either (a) a formal policy exception documenting that " +
      "schema vocabulary values are excluded from the Performance Claim Policy, or (b) replacement " +
      "with a longevity-neutral label that preserves the olfactive weight classification.",
    recommendedDisposition:
      "SCHEMA_GOVERNANCE_REVIEW — Founder decision required before any record-level correction: " +
      "(a) retain with a formal policy exception noting that 'Rich & Long Wearing' describes " +
      "olfactive weight and occasion appropriateness, not a measurable performance guarantee, or " +
      "(b) replace with a longevity-neutral vocabulary value across all affected records.",
  },
  "Deep & Intense": {
    policyClassification: "SAFE",
    reason:               "Describes olfactive depth and intensity character. Contains no longevity or measurable performance language.",
    recommendedDisposition: "RETAIN — no vocabulary action required.",
  },
};

const SCENT_CHARACTER_VALUES = [
  "Fresh & Light",
  "Balanced Signature",
  "Rich & Long Wearing",
  "Deep & Intense",
];

// ── Structural finding extractor ──────────────────────────────────────────────

function computeStructuralFindings(
  record:         FragranceKnowledge,
  allRecordsMap:  ReadonlyMap<string, FragranceKnowledge>,
): RelationshipStructuralFinding[] {
  if (!record.relationships) return [];
  const result   = validateKnowledgeRecord(record, allRecordsMap);
  const relGroup = result.groups.relationships;
  return relGroup.issues
    .filter(i => STRUCTURAL_CODES.has(i.code))
    .map(i => ({ code: i.code, field: i.field, message: i.message }));
}

// ── Vocabulary finding extractor ───────────────────────────────────────────────

function computeVocabularyFindings(record: FragranceKnowledge): VocabularyPolicyFinding[] {
  const policy = SCENT_CHARACTER_POLICY[record.scentCharacter];
  if (!policy || policy.policyClassification === "SAFE") return [];
  return [{
    field:                "scentCharacter",
    value:                record.scentCharacter,
    policyClassification: policy.policyClassification,
    reason:               policy.reason,
  }];
}

// ── Provenance debt classifier ────────────────────────────────────────────────

function computeProvenanceDebt(auditRecord: RecordAuditResult): ProvenanceDebt {
  const { provenanceClass, generationProvenance, governanceState } = auditRecord;

  if (provenanceClass === "A") {
    return {
      classification:       "DOCUMENTATION_ONLY",
      generationProvenance,
      governanceState,
      note:
        "Provenance fully governed — EP5-P4H R2 correction applied to all composition fields " +
        "against authoritative MIP-000012 research. No further provenance action required.",
    };
  }
  if (provenanceClass === "D") {
    return {
      classification:       "DOCUMENTATION_ONLY",
      generationProvenance,
      governanceState,
      note:
        "AI generation origin documented in scripts/factory/factory-log.json " +
        "(factory v0.5.0, 2026-07-13). Content origin is traceable via factory audit trail. " +
        "Formal MIP identity governance and R2 reconciliation absent.",
    };
  }
  if (provenanceClass === "E") {
    return {
      classification:       "CONTENT_ACTION_REQUIRED",
      generationProvenance,
      governanceState,
      note:
        "No factory log entry — knowledge predates the factory process. " +
        "Content origin cannot be established and content reliability cannot be assessed " +
        "without authoritative research. MIP identity governance is required to establish " +
        "provenance before content can be trusted.",
    };
  }
  return {
    classification:       "UNKNOWN",
    generationProvenance,
    governanceState,
    note: "Unknown provenance classification (Class F — should not occur in production catalogue).",
  };
}

// ── Priority tier classifier ───────────────────────────────────────────────────

function computePriorityTier(
  auditRecord:        RecordAuditResult,
  structuralFindings: RelationshipStructuralFinding[],
): PriorityTier {
  if (auditRecord.policyFindings.some(f => f.severity === "HIGH")) return "P0";
  if (structuralFindings.length > 0)                               return "P1";
  if (auditRecord.policyFindings.some(f => f.severity === "MEDIUM")) return "P2";
  if (auditRecord.hasRelationships)                                return "P3";
  if (auditRecord.provenanceClass === "D" || auditRecord.provenanceClass === "E") return "P4";
  return "P5";
}

// ── Issue category builder ─────────────────────────────────────────────────────

function computeIssueCategories(
  auditRecord:        RecordAuditResult,
  structuralFindings: RelationshipStructuralFinding[],
  vocabFindings:      VocabularyPolicyFinding[],
): IssueCategory[] {
  const categories: IssueCategory[] = [];

  if (auditRecord.policyFindings.some(f => f.severity === "HIGH")) {
    categories.push("DETERMINISTIC_POLICY_CORRECTION");
  }
  if (structuralFindings.length > 0) {
    categories.push("RELATIONSHIP_STRUCTURAL_CORRECTION");
  }
  if (auditRecord.policyFindings.some(f => f.severity === "MEDIUM")) {
    categories.push("EDITORIAL_REVIEW");
  }
  if (vocabFindings.length > 0) {
    categories.push("SCHEMA_POLICY_REVIEW");
  }
  if (auditRecord.hasRelationships) {
    categories.push("RELATIONSHIP_EDITORIAL_REVIEW");
  }
  if (auditRecord.provenanceClass === "D" || auditRecord.provenanceClass === "E") {
    categories.push("MIP_IDENTITY_ONBOARDING");
  }
  if (categories.length === 0) {
    categories.push("NO_ACTION");
  }

  return categories;
}

// ── Recommended actions ────────────────────────────────────────────────────────

function computeRecommendedActions(issueCategories: IssueCategory[]): RemediationAction[] {
  if (issueCategories.includes("NO_ACTION")) return ["NO_ACTION"];

  const actions: RemediationAction[] = [];
  if (issueCategories.includes("DETERMINISTIC_POLICY_CORRECTION"))  actions.push("DETERMINISTIC_POLICY_CORRECTION");
  if (issueCategories.includes("RELATIONSHIP_STRUCTURAL_CORRECTION")) actions.push("RELATIONSHIP_STRUCTURAL_CORRECTION");
  if (issueCategories.includes("EDITORIAL_REVIEW"))                 actions.push("EDITORIAL_REVIEW");
  if (issueCategories.includes("SCHEMA_POLICY_REVIEW"))             actions.push("SCHEMA_POLICY_REVIEW");
  if (issueCategories.includes("RELATIONSHIP_EDITORIAL_REVIEW"))    actions.push("RELATIONSHIP_EDITORIAL_REVIEW");
  if (issueCategories.includes("MIP_IDENTITY_ONBOARDING"))          actions.push("MIP_IDENTITY_ONBOARDING");
  return actions;
}

// ── Main service function ──────────────────────────────────────────────────────

const TIER_ORDER: Record<PriorityTier, number> = { P0: 0, P1: 1, P2: 2, P3: 3, P4: 4, P5: 5 };

export function runCatalogueRemediationQueue(
  input: RemediationInput,
): CatalogueRemediationQueue {

  const allRecordsMap = new Map<string, FragranceKnowledge>(
    input.nativeRecords.map(r => [r.slug, r]),
  );

  const nativeBySlug = new Map<string, FragranceKnowledge>(
    input.nativeRecords.map(r => [r.slug, r]),
  );

  // Compute scentCharacter usage counts across all native records
  const scentCharacterCounts = new Map<string, number>();
  for (const r of input.nativeRecords) {
    scentCharacterCounts.set(r.scentCharacter, (scentCharacterCounts.get(r.scentCharacter) ?? 0) + 1);
  }

  const items: RemediationItem[] = [];

  for (const auditRecord of input.auditRecords) {
    const nativeRecord = nativeBySlug.get(auditRecord.slug);
    if (!nativeRecord) {
      throw new Error(`[EP6-P2] Native record not found for slug: ${auditRecord.slug}`);
    }

    const structuralFindings = computeStructuralFindings(nativeRecord, allRecordsMap);
    const vocabFindings      = computeVocabularyFindings(nativeRecord);
    const provenanceDebt     = computeProvenanceDebt(auditRecord);
    const priorityTier       = computePriorityTier(auditRecord, structuralFindings);
    const issueCategories    = computeIssueCategories(auditRecord, structuralFindings, vocabFindings);
    const recommendedActions = computeRecommendedActions(issueCategories);

    const hasHighPolicy = auditRecord.policyFindings.some(f => f.severity === "HIGH");
    const hasMediumPolicy = auditRecord.policyFindings.some(f => f.severity === "MEDIUM");
    const hasStructural = structuralFindings.length > 0;

    items.push({
      slug:                           auditRecord.slug,
      name:                           auditRecord.name,
      collection:                     auditRecord.collection,
      provenanceClass:                auditRecord.provenanceClass,
      generationProvenance:           auditRecord.generationProvenance,
      governanceState:                auditRecord.governanceState,
      currentRiskLevel:               auditRecord.riskLevel,
      priorityTier,
      issueCategories,
      policyFindings:                 auditRecord.policyFindings,
      vocabularyPolicyFindings:       vocabFindings,
      relationshipStructuralFindings: structuralFindings,
      hasRelationships:               auditRecord.hasRelationships,
      relationshipEntryCount:         auditRecord.relationshipEntryCount,
      provenanceDebt,
      recommendedActions,
      canCorrectDeterministically:    hasHighPolicy || hasStructural,
      requiresExternalResearch:       auditRecord.provenanceClass === "E",
      requiresFounderDecision:        hasMediumPolicy || vocabFindings.length > 0,
      blockingPrerequisite:           null,
    });
  }

  // Sort by priorityTier (ascending) then slug (alphabetical)
  items.sort((a, b) => {
    const diff = TIER_ORDER[a.priorityTier] - TIER_ORDER[b.priorityTier];
    if (diff !== 0) return diff;
    return a.slug.localeCompare(b.slug);
  });

  // Build summary counts
  const byPriorityTier:  Record<string, number> = {};
  const byIssueCategory: Record<string, number> = {};

  for (const item of items) {
    byPriorityTier[item.priorityTier] = (byPriorityTier[item.priorityTier] ?? 0) + 1;
    for (const cat of item.issueCategories) {
      byIssueCategory[cat] = (byIssueCategory[cat] ?? 0) + 1;
    }
  }

  const totalStructuralFindings       = items.reduce((n, i) => n + i.relationshipStructuralFindings.length, 0);
  const recordsWithStructuralFindings = items.filter(i => i.relationshipStructuralFindings.length > 0).length;

  // scentCharacter vocabulary assessment
  const scentCharAssessment: ScentCharacterVocabAssessment[] = SCENT_CHARACTER_VALUES.map(value => {
    const policy = SCENT_CHARACTER_POLICY[value];
    return {
      value,
      usageCount:              scentCharacterCounts.get(value) ?? 0,
      policyClassification:    policy.policyClassification,
      reason:                  policy.reason,
      recommendedDisposition:  policy.recommendedDisposition,
    };
  });

  const summary: RemediationSummary = {
    totalRecords:                       items.length,
    byPriorityTier,
    byIssueCategory,
    totalStructuralFindings,
    recordsWithStructuralFindings,
    recordsRequiringFounderDecision:    items.filter(i => i.requiresFounderDecision).length,
    recordsCanCorrectDeterministically: items.filter(i => i.canCorrectDeterministically).length,
    vocabularyAssessment:               { scentCharacter: scentCharAssessment },
  };

  return {
    version:          "1.0.0",
    generatedAt:      new Date().toISOString(),
    generatedBy:      "EP6-P2 — Catalogue Remediation Queue",
    auditVersion:     input.auditVersion,
    auditGeneratedAt: input.auditGeneratedAt,
    safetyInvariants: {
      noKnowledgeModified: true,
      noAiGeneration:      true,
      noResearchCampaign:  true,
      noPromotion:         true,
      noIdentityMutation:  true,
      approvedIdentityId:  null,
      force:               false,
    },
    summary,
    items,
  };
}

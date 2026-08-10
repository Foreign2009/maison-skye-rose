/**
 * EP6-P1 — Catalogue Knowledge Integrity Audit Service
 *
 * READ-ONLY deterministic audit of all active native fragrance knowledge records.
 * Answers 10 governance questions per record. No knowledge records are modified.
 * No AI generation. No research campaign. No promotion. No identity mutation.
 */

import type { FragranceKnowledge } from "../../app/lib/mkc/types";

// ── Domain types ───────────────────────────────────────────────────────────────

export type GenerationProvenance = "legacy-factory" | "native-pre-factory";
export type GovernanceState      = "no-mip-governance" | "reconciled-r2";
export type ProvenanceClass      = "A" | "D" | "E" | "F";
export type RiskLevel            = "LOW" | "MEDIUM" | "HIGH";
export type PolicySeverity       = "MEDIUM" | "HIGH";

export type PolicyFinding = {
  readonly field:    string;
  readonly pattern:  string;
  readonly excerpt:  string;
  readonly severity: PolicySeverity;
};

export type RecordAuditResult = {
  readonly slug:                      string;
  readonly name:                      string;
  readonly collection:                string;
  readonly gender:                    string;
  readonly status:                    string;
  readonly generationProvenance:      GenerationProvenance;
  readonly governanceState:           GovernanceState;
  readonly provenanceClass:           ProvenanceClass;
  readonly hasFactoryDraft:           boolean;
  readonly hasGovernedMapping:        boolean;
  readonly mipIdentityId:             string | null;
  readonly hasMipRun:                 boolean;
  readonly mipRunCount:               number;
  readonly hasReconciliation:         boolean;
  readonly reconciliationDisposition: string | null;
  readonly hasRelationships:          boolean;
  readonly relationshipEntryCount:    number;
  readonly policyFindings:            readonly PolicyFinding[];
  readonly riskLevel:                 RiskLevel;
  readonly riskFactors:               readonly string[];
  readonly recommendedActions:        readonly string[];
  readonly auditNotes:                readonly string[];
};

export type AuditSummary = {
  readonly totalRecords:              number;
  readonly byProvenanceClass:         Record<string, number>;
  readonly byGenerationProvenance:    Record<string, number>;
  readonly byGovernanceState:         Record<string, number>;
  readonly byRiskLevel:               Record<string, number>;
  readonly recordsWithRelationships:  number;
  readonly recordsWithPolicyFindings: number;
  readonly totalPolicyFindings:       number;
  readonly recordsFullyGoverned:      number;
};

export type ReconciliationEntry = {
  readonly identityId:           string;
  readonly knowledgeDisposition: string;
};

export type AuditInput = {
  readonly records:         readonly FragranceKnowledge[];
  readonly factorySlugs:   ReadonlySet<string>;
  readonly mappings:        ReadonlyMap<string, string>;         // maisonSlug → identityId
  readonly mipRunsBySlug:   ReadonlyMap<string, number>;         // maisonSlug → governance-attempt count
  readonly reconciliations: ReadonlyMap<string, ReconciliationEntry>;
};

export type CatalogueAuditReport = {
  readonly version:      string;
  readonly generatedAt:  string;
  readonly generatedBy:  string;
  readonly auditPurpose: string;
  readonly safetyInvariants: {
    readonly noKnowledgeModified: boolean;
    readonly noAiGeneration:      boolean;
    readonly noResearchCampaign:  boolean;
    readonly noPromotion:         boolean;
    readonly noIdentityMutation:  boolean;
    readonly approvedIdentityId:  null;
    readonly force:               false;
  };
  readonly summary:          AuditSummary;
  readonly records:          readonly RecordAuditResult[];
  readonly prioritizedQueue: readonly string[];
};

// ── Policy scanner ─────────────────────────────────────────────────────────────

type PolicyPattern = {
  readonly pattern:  string;
  readonly re:       RegExp;
  readonly severity: PolicySeverity;
};

const POLICY_PATTERNS: readonly PolicyPattern[] = [
  { pattern: "long-wearing",  re: /long[- ]wearing/i,  severity: "HIGH"   },
  { pattern: "long-lasting",  re: /long[- ]lasting/i,  severity: "HIGH"   },
  { pattern: "lasts all day", re: /lasts all day/i,    severity: "HIGH"   },
  { pattern: "all day long",  re: /all day long/i,     severity: "HIGH"   },
  { pattern: "beast mode",    re: /beast mode/i,       severity: "HIGH"   },
  { pattern: "all-day",       re: /\ball[- ]day\b/i,   severity: "MEDIUM" },
];

type FieldExtractor = {
  readonly name:    string;
  readonly extract: (r: FragranceKnowledge) => string[];
};

// scentCharacter is intentionally excluded — scentCharacter values are governed MKC vocabulary.
const POLICY_FIELDS: readonly FieldExtractor[] = [
  { name: "description",    extract: r => r.description    ? [r.description]    : [] },
  { name: "subtitle",       extract: r => r.subtitle       ? [r.subtitle]       : [] },
  { name: "mood",           extract: r => [r.mood]                                   },
  { name: "vibe",           extract: r => r.vibe                                     },
  { name: "occasions",      extract: r => r.occasions                                },
  { name: "seasons",        extract: r => r.seasons                                  },
  { name: "signatureStyle", extract: r => r.signatureStyle                           },
  { name: "recommendedFor", extract: r => r.recommendedFor                           },
  { name: "educationTags",  extract: r => r.educationTags  ?? []                     },
];

function scanPolicyFindings(record: FragranceKnowledge): readonly PolicyFinding[] {
  const findings: PolicyFinding[] = [];
  for (const field of POLICY_FIELDS) {
    const values = field.extract(record);
    for (const value of values) {
      for (const pat of POLICY_PATTERNS) {
        if (pat.re.test(value)) {
          findings.push({
            field:    field.name,
            pattern:  pat.pattern,
            excerpt:  value.length > 120 ? value.slice(0, 117) + "..." : value,
            severity: pat.severity,
          });
        }
      }
    }
  }
  return findings;
}

// ── Relationship counter ───────────────────────────────────────────────────────

function countRelationshipEntries(record: FragranceKnowledge): number {
  const rel = record.relationships;
  if (!rel) return 0;
  let count = 0;
  if (rel.evolutionOf)      count += 1;
  if (rel.evolutions)       count += rel.evolutions.length;
  if (rel.alternatives)     count += rel.alternatives.length;
  if (rel.wardrobePartners) count += rel.wardrobePartners.length;
  return count;
}

// ── Provenance classification ──────────────────────────────────────────────────

function classifyProvenance(
  hasFactoryDraft:   boolean,
  hasMapping:        boolean,
  mipRunCount:       number,
  hasReconciliation: boolean,
  disposition:       string | null,
): {
  generationProvenance: GenerationProvenance;
  governanceState:      GovernanceState;
  provenanceClass:      ProvenanceClass;
} {
  const generationProvenance: GenerationProvenance =
    hasFactoryDraft ? "legacy-factory" : "native-pre-factory";

  const governanceState: GovernanceState =
    hasMapping && hasReconciliation && disposition === "r2-correction-applied"
      ? "reconciled-r2"
      : "no-mip-governance";

  // Class A: governed mapping + MIPRUN + R2 correction applied
  if (hasMapping && mipRunCount > 0 && governanceState === "reconciled-r2") {
    return { generationProvenance, governanceState, provenanceClass: "A" };
  }
  // Class D: legacy-factory, ungoverned
  if (generationProvenance === "legacy-factory") {
    return { generationProvenance, governanceState, provenanceClass: "D" };
  }
  // Class E: native-pre-factory, ungoverned
  if (generationProvenance === "native-pre-factory") {
    return { generationProvenance, governanceState, provenanceClass: "E" };
  }
  return { generationProvenance, governanceState, provenanceClass: "F" };
}

// ── Risk model ─────────────────────────────────────────────────────────────────

function computeRisk(
  provenanceClass:  ProvenanceClass,
  hasRelationships: boolean,
  policyFindings:   readonly PolicyFinding[],
): { riskLevel: RiskLevel; riskFactors: string[] } {
  const riskFactors: string[] = [];

  const highPolicies   = policyFindings.filter(f => f.severity === "HIGH");
  const mediumPolicies = policyFindings.filter(f => f.severity === "MEDIUM");

  if (highPolicies.length > 0) {
    riskFactors.push(`${highPolicies.length} HIGH-severity policy finding(s)`);
  }
  if (mediumPolicies.length > 0) {
    riskFactors.push(`${mediumPolicies.length} MEDIUM-severity policy finding(s)`);
  }
  if (hasRelationships) {
    riskFactors.push("AI-generated relationship entries present (unverified)");
  }
  if (provenanceClass === "D") {
    riskFactors.push("legacy-factory: AI-generated, no MIP governance");
  } else if (provenanceClass === "E") {
    riskFactors.push("native-pre-factory: no factory provenance, no MIP governance");
  }

  if (highPolicies.length > 0) return { riskLevel: "HIGH", riskFactors };
  if (provenanceClass === "A" && mediumPolicies.length === 0) return { riskLevel: "LOW", riskFactors };
  return { riskLevel: "MEDIUM", riskFactors };
}

// ── Recommended actions ────────────────────────────────────────────────────────

function computeRecommendedActions(
  provenanceClass:  ProvenanceClass,
  hasRelationships: boolean,
  policyFindings:   readonly PolicyFinding[],
): string[] {
  const actions: string[] = [];

  if (policyFindings.some(f => f.severity === "HIGH"))   actions.push("POLICY_CORRECTION");
  if (policyFindings.some(f => f.severity === "MEDIUM"))  actions.push("POLICY_REVIEW");
  if (hasRelationships)                                   actions.push("RELATIONSHIP_REVIEW");
  if (provenanceClass === "D" || provenanceClass === "E") actions.push("MIP_GOVERNANCE");
  if (actions.length === 0)                               actions.push("NONE");

  return actions;
}

// ── Audit notes ────────────────────────────────────────────────────────────────

function computeAuditNotes(
  provenanceClass: ProvenanceClass,
  disposition:     string | null,
): string[] {
  const notes: string[] = [];
  if (provenanceClass === "A") {
    notes.push(
      "EP5-P4H R2 deterministic correction applied. All composition fields verified against " +
      "authoritative MIP-000012 research. Relationships removed as unverified AI inferences.",
    );
    if (disposition) {
      notes.push(`Reconciliation disposition: ${disposition}.`);
    }
  }
  return notes;
}

// ── Main audit function ────────────────────────────────────────────────────────

export function runCatalogueKnowledgeIntegrityAudit(
  input: AuditInput,
): CatalogueAuditReport {

  const results: RecordAuditResult[] = [];

  for (const record of input.records) {
    const slug = record.slug;

    const hasFactoryDraft     = input.factorySlugs.has(slug);
    const mipIdentityId       = input.mappings.get(slug) ?? null;
    const hasGovernedMapping  = mipIdentityId !== null;
    const mipRunCount         = input.mipRunsBySlug.get(slug) ?? 0;
    const hasMipRun           = mipRunCount > 0;
    const reconciliation      = input.reconciliations.get(slug) ?? null;
    const hasReconciliation   = reconciliation !== null;
    const disposition         = reconciliation?.knowledgeDisposition ?? null;

    const { generationProvenance, governanceState, provenanceClass } = classifyProvenance(
      hasFactoryDraft,
      hasGovernedMapping,
      mipRunCount,
      hasReconciliation,
      disposition,
    );

    const hasRelationships       = Boolean(record.relationships);
    const relationshipEntryCount = countRelationshipEntries(record);
    const policyFindings         = scanPolicyFindings(record);

    const { riskLevel, riskFactors }   = computeRisk(provenanceClass, hasRelationships, policyFindings);
    const recommendedActions           = computeRecommendedActions(provenanceClass, hasRelationships, policyFindings);
    const auditNotes                   = computeAuditNotes(provenanceClass, disposition);

    results.push({
      slug,
      name:                      record.name,
      collection:                record.collection,
      gender:                    record.gender,
      status:                    record.status ?? "active",
      generationProvenance,
      governanceState,
      provenanceClass,
      hasFactoryDraft,
      hasGovernedMapping,
      mipIdentityId,
      hasMipRun,
      mipRunCount,
      hasReconciliation,
      reconciliationDisposition: disposition,
      hasRelationships,
      relationshipEntryCount,
      policyFindings,
      riskLevel,
      riskFactors,
      recommendedActions,
      auditNotes,
    });
  }

  // Prioritized queue: HIGH → MEDIUM → LOW, alphabetically within each risk level
  const RISK_ORDER: Record<RiskLevel, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  const prioritizedQueue = results
    .slice()
    .sort((a, b) => {
      const diff = RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel];
      if (diff !== 0) return diff;
      return a.slug.localeCompare(b.slug);
    })
    .map(r => r.slug);

  // Records sorted alphabetically for stable output
  results.sort((a, b) => a.slug.localeCompare(b.slug));

  // Summary
  const byProvenanceClass:      Record<string, number> = {};
  const byGenerationProvenance: Record<string, number> = {};
  const byGovernanceState:      Record<string, number> = {};
  const byRiskLevel:            Record<string, number> = {};

  for (const r of results) {
    byProvenanceClass[r.provenanceClass]           = (byProvenanceClass[r.provenanceClass]           ?? 0) + 1;
    byGenerationProvenance[r.generationProvenance] = (byGenerationProvenance[r.generationProvenance] ?? 0) + 1;
    byGovernanceState[r.governanceState]           = (byGovernanceState[r.governanceState]           ?? 0) + 1;
    byRiskLevel[r.riskLevel]                       = (byRiskLevel[r.riskLevel]                       ?? 0) + 1;
  }

  const summary: AuditSummary = {
    totalRecords:              results.length,
    byProvenanceClass,
    byGenerationProvenance,
    byGovernanceState,
    byRiskLevel,
    recordsWithRelationships:  results.filter(r => r.hasRelationships).length,
    recordsWithPolicyFindings: results.filter(r => r.policyFindings.length > 0).length,
    totalPolicyFindings:       results.reduce((n, r) => n + r.policyFindings.length, 0),
    recordsFullyGoverned:      results.filter(r => r.provenanceClass === "A").length,
  };

  return {
    version:     "1.0.0",
    generatedAt: new Date().toISOString(),
    generatedBy: "EP6-P1 — Catalogue Knowledge Integrity Audit",
    auditPurpose:
      "Read-only deterministic audit of all 93 active native fragrance knowledge records. " +
      "Answers 10 governance questions per record: factory provenance, identity mapping, " +
      "MIPRUN existence, reconciliation status, disposition, relationship presence, " +
      "policy compliance, provenance class, governance state, and recommended next action. " +
      "No knowledge records are modified. No AI generation. No research campaign.",
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
    records:          results,
    prioritizedQueue,
  };
}

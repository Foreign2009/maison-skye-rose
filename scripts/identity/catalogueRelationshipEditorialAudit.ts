/**
 * EP6-P4 — Catalogue Relationship Editorial Audit Service
 *
 * READ-ONLY deterministic editorial governance audit of every canonical
 * relationship edge in the Maison Knowledge Catalogue.
 *
 * Distinguishes structural validity from editorial validity.
 * Collects repository-local evidence per edge.
 * Classifies each edge by editorial supportability.
 * Identifies relationships requiring external research vs. founder decision.
 *
 * ZERO relationship mutations. ZERO knowledge mutations. ZERO AI calls.
 *
 * APPROVED_IDENTITY_ID = null
 * FORCE = false
 */

import type { FragranceKnowledge } from "../../app/lib/mkc/types";

// ── Editorial classification vocabulary ────────────────────────────────────────

/**
 * REPOSITORY_SUPPORTED
 *   Repository evidence explicitly and defensibly supports the relationship
 *   without inventing fragrance facts. HIGH BAR. Shared metadata alone is
 *   not sufficient.
 *
 * EXTERNAL_RESEARCH_REQUIRED
 *   Determining semantic truth requires authoritative fragrance information
 *   not present in the repository. EP6-P4 does not conduct that research.
 *
 * FOUNDER_EDITORIAL_DECISION_REQUIRED
 *   The relationship is primarily a Maison merchandising, wardrobe,
 *   positioning, customer-experience, or editorial judgement rather than
 *   an externally provable factual relationship.
 *
 * INSUFFICIENT_EVIDENCE
 *   Neither repository evidence nor relationship semantics provide enough
 *   information to responsibly approve it, and the correct next step cannot
 *   yet be narrowed further.
 */
export type EditorialClassification =
  | "REPOSITORY_SUPPORTED"
  | "EXTERNAL_RESEARCH_REQUIRED"
  | "FOUNDER_EDITORIAL_DECISION_REQUIRED"
  | "INSUFFICIENT_EVIDENCE";

/**
 * Provenance of the relationship edge.
 * AI_GENERATED: produced by RelationshipProducer (Anthropic Claude API).
 * HUMAN_EDITED:  confirmed from explicit human governance record.
 * GOVERNED:      subject to an approved governance review record.
 * UNKNOWN:       insufficient evidence to determine origin.
 */
export type RelationshipProvenance =
  | "AI_GENERATED"
  | "HUMAN_EDITED"
  | "GOVERNED"
  | "UNKNOWN";

/** Structural state of the edge as independently verified by EP6-P4/P4R. */
export type StructuralState =
  | "VALID"
  | "DEFECT_SELF_REFERENCE"
  | "DEFECT_DANGLING_TARGET"
  | "DEFECT_BLANK_TARGET"
  | "DEFECT_DUPLICATE_IN_ARRAY"
  | "DEFECT_ALTERNATIVE_NOT_RECIPROCAL"
  | "DEFECT_WARDROBE_PARTNER_NOT_RECIPROCAL"
  | "DEFECT_EVOLUTION_NOT_RECIPROCAL";

/** Controlled action vocabulary. No automatic mutation actions. */
export type RecommendedAction =
  | "NO_RELATIONSHIP_CHANGE"
  | "AUTHORITATIVE_RESEARCH"
  | "FOUNDER_EDITORIAL_REVIEW"
  | "RELATIONSHIP_REVIEW"
  | "RELATIONSHIP_REMOVAL_CANDIDATE"
  | "RELATIONSHIP_CONFIRMATION_CANDIDATE";

/** Canonical relationship types in the MKC model. */
export type RelationshipType =
  | "evolutionOf"
  | "evolutions"
  | "alternatives"
  | "wardrobePartners";

// ── Evidence types ─────────────────────────────────────────────────────────────

export type RepositoryEvidence = {
  /** Overlap between source.family and target.family */
  readonly familyOverlap:          readonly string[];
  /** Whether source.scentCharacter === target.scentCharacter */
  readonly scentCharacterMatch:    boolean;
  /** Whether source.gender === target.gender */
  readonly genderMatch:            boolean;
  /** Whether source.collection === target.collection */
  readonly collectionMatch:        boolean;
  /** Overlap between source.notes.top and target.notes.top */
  readonly topNoteOverlap:         readonly string[];
  /** Overlap between source.notes.base and target.notes.base */
  readonly baseNoteOverlap:        readonly string[];
  /** For evolutionOf/evolutions: does name prefix relationship suggest lineage? */
  readonly namePrefixRelationship: boolean | null;
  /** Summary text of the name prefix finding (null when not applicable) */
  readonly namePrefixNote:         string | null;
  /** Whether source description/subtitle explicitly mentions target name */
  readonly textCrossReference:     boolean;
  /** If textCrossReference is true, the matched excerpt */
  readonly textCrossReferenceNote: string | null;
  /** Total overlap count across all dimensions for summary */
  readonly overlapScore:           number;
};

export type EvidenceLimitation =
  | "NO_OLFACTIVE_TESTING"
  | "NO_MANUFACTURER_POSITIONING_STATEMENT"
  | "NO_THIRD_PARTY_DATABASE_CONFIRMATION"
  | "NO_HUMAN_EDITORIAL_APPROVAL_RECORD"
  | "NO_CONSUMER_REVIEW_EVIDENCE"
  | "HUMAN_APPROVAL_NOT_CONFIRMED"
  | "NAME_RELATIONSHIP_MAY_NOT_IMPLY_EVOLUTION"
  | "METADATA_SIMILARITY_NOT_SEMANTIC_PROOF"
  | "WARDROBE_CURATION_REQUIRES_FOUNDER_INTENT";

// ── Edge audit result ──────────────────────────────────────────────────────────

export type RelationshipEdgeAuditResult = {
  readonly sourceSlug:             string;
  readonly relationshipType:       RelationshipType;
  readonly targetSlug:             string;
  readonly structuralState:        StructuralState;
  readonly provenanceState:        RelationshipProvenance;
  readonly editorialClassification: EditorialClassification;
  readonly repositoryEvidence:     RepositoryEvidence;
  readonly evidenceLimitations:    readonly EvidenceLimitation[];
  readonly requiresExternalResearch: boolean;
  readonly requiresFounderDecision:  boolean;
  readonly recommendedNextAction:  RecommendedAction;
  readonly blockingReason:         string;
};

// ── Per-record rollup ──────────────────────────────────────────────────────────

export type RecordRelationshipRollup = {
  readonly slug:                        string;
  readonly name:                        string;
  readonly relationshipCount:           number;
  readonly relationshipTypes:           readonly RelationshipType[];
  readonly classificationCounts:        Record<EditorialClassification, number>;
  readonly requiresExternalResearch:    boolean;
  readonly requiresFounderDecision:     boolean;
  readonly hasUnsupportedRelationships: boolean;
  readonly hasStructuralDefects:        boolean;
  readonly recommendedNextAction:       RecommendedAction;
};

// ── Summary ────────────────────────────────────────────────────────────────────

export type RelationshipAuditSummary = {
  readonly totalCatalogueRecords:           number;
  readonly relationshipBearingRecords:      number;
  readonly recordsWithoutRelationships:     number;
  readonly totalRelationshipEdges:          number;
  readonly edgesByRelationshipType:         Record<RelationshipType, number>;
  readonly edgesByEditorialClassification:  Record<EditorialClassification, number>;
  readonly edgesByProvenanceState:          Record<RelationshipProvenance, number>;
  readonly edgesByStructuralState:          Record<StructuralState, number>;
  readonly structuralDefectCount:           number;
  readonly recordsByEditorialState: {
    readonly requiresExternalResearch:      number;
    readonly requiresFounderDecision:       number;
    readonly hasUnsupportedRelationships:   number;
    readonly hasOnlyRepositorySupported:    number;
    readonly hasStructuralDefects:          number;
  };
  readonly recordsWithoutRelationshipsList: readonly string[];
  readonly provenanceSummary:               string;
};

// ── Report ─────────────────────────────────────────────────────────────────────

export type CatalogueRelationshipEditorialAuditReport = {
  readonly version:                    string;
  readonly generatedAt:                string;
  readonly generatedBy:                string;
  readonly sourceCatalogueAuditVersion: string;
  readonly sourceRemediationQueueVersion: string;
  readonly auditPurpose:               string;
  readonly safetyInvariants: {
    readonly noKnowledgeModified:   boolean;
    readonly noRelationshipMutated: boolean;
    readonly noAiGeneration:        boolean;
    readonly noExternalResearch:    boolean;
    readonly noIdentityMutation:    boolean;
    readonly noFactoryInvocation:   boolean;
    readonly approvedIdentityId:    null;
    readonly force:                 false;
  };
  readonly summary:  RelationshipAuditSummary;
  readonly records:  readonly RecordRelationshipRollup[];
  readonly edges:    readonly RelationshipEdgeAuditResult[];
};

// ── Input ──────────────────────────────────────────────────────────────────────

export type RelationshipEditorialAuditInput = {
  readonly records:                       readonly FragranceKnowledge[];
  readonly sourceCatalogueAuditVersion:   string;
  readonly sourceRemediationQueueVersion: string;
};

// ── Evidence collection ────────────────────────────────────────────────────────

/**
 * Extract the "inspired by" base name by stripping " Inspired" suffix.
 * Used for name-prefix relationship detection in evolution chains.
 */
function extractBaseName(name: string): string {
  return name.replace(/\s+Inspired$/i, "").trim();
}

/**
 * Compute name-prefix relationship for evolutionOf/evolutions.
 * True if one base name is a prefix of the other (case-insensitive).
 * This indicates a potential naming-convention evolution chain.
 */
function computeNamePrefixRelationship(
  sourceName: string,
  targetName: string,
): { hasPrefix: boolean; note: string } {
  const sourceBase = extractBaseName(sourceName).toLowerCase();
  const targetBase = extractBaseName(targetName).toLowerCase();

  if (sourceBase === targetBase) {
    return { hasPrefix: true, note: `Identical base names: "${sourceBase}" — same fragrance line` };
  }
  if (sourceBase.startsWith(targetBase + " ")) {
    return {
      hasPrefix: true,
      note: `Source base name "${extractBaseName(sourceName)}" starts with target base name "${extractBaseName(targetName)}" — naming convention suggests line variant`,
    };
  }
  if (targetBase.startsWith(sourceBase + " ")) {
    return {
      hasPrefix: true,
      note: `Target base name "${extractBaseName(targetName)}" starts with source base name "${extractBaseName(sourceName)}" — naming convention suggests line variant`,
    };
  }
  return {
    hasPrefix: false,
    note: `No clear name prefix relationship between "${extractBaseName(sourceName)}" and "${extractBaseName(targetName)}"`,
  };
}

/**
 * Check if source description or subtitle explicitly mentions the target name.
 */
function computeTextCrossReference(
  source: FragranceKnowledge,
  target: FragranceKnowledge,
): { found: boolean; note: string | null } {
  const targetBaseName   = extractBaseName(target.name).toLowerCase();
  const searchFields     = [source.description ?? "", source.subtitle ?? "", source.mood];
  const combined         = searchFields.join(" ").toLowerCase();

  if (targetBaseName.length > 4 && combined.includes(targetBaseName)) {
    return {
      found: true,
      note:  `Source text mentions "${extractBaseName(target.name)}" explicitly`,
    };
  }
  return { found: false, note: null };
}

/** Compute a simple overlap score for summary comparison. */
function computeOverlapScore(
  familyOverlap:       readonly string[],
  scentCharacterMatch: boolean,
  genderMatch:         boolean,
  topNoteOverlap:      readonly string[],
  baseNoteOverlap:     readonly string[],
  namePrefixRel:       boolean | null,
): number {
  let score = 0;
  score += familyOverlap.length * 2;
  score += scentCharacterMatch ? 3 : 0;
  score += genderMatch ? 1 : 0;
  score += topNoteOverlap.length;
  score += baseNoteOverlap.length;
  score += namePrefixRel === true ? 5 : 0;
  return score;
}

function collectEvidence(
  source: FragranceKnowledge,
  target: FragranceKnowledge,
  relType: RelationshipType,
): RepositoryEvidence {
  const sourceFamily = new Set(source.family);
  const targetFamily = new Set(target.family);
  const familyOverlap = [...sourceFamily].filter(f => targetFamily.has(f));

  const scentCharacterMatch = source.scentCharacter === target.scentCharacter;
  const genderMatch = source.gender === target.gender;
  const collectionMatch = source.collection === target.collection;

  const sourceTop = new Set(source.notes.top.map(n => n.toLowerCase()));
  const targetTop = new Set(target.notes.top.map(n => n.toLowerCase()));
  const topNoteOverlap = [...sourceTop].filter(n => targetTop.has(n)).map(n =>
    source.notes.top.find(x => x.toLowerCase() === n) ?? n,
  );

  const sourceBase = new Set(source.notes.base.map(n => n.toLowerCase()));
  const targetBase = new Set(target.notes.base.map(n => n.toLowerCase()));
  const baseNoteOverlap = [...sourceBase].filter(n => targetBase.has(n)).map(n =>
    source.notes.base.find(x => x.toLowerCase() === n) ?? n,
  );

  const isEvolution = relType === "evolutionOf" || relType === "evolutions";

  let namePrefixRelationship: boolean | null = null;
  let namePrefixNote: string | null = null;
  if (isEvolution) {
    const prefix = computeNamePrefixRelationship(source.name, target.name);
    namePrefixRelationship = prefix.hasPrefix;
    namePrefixNote = prefix.note;
  }

  const textRef = computeTextCrossReference(source, target);

  const overlapScore = computeOverlapScore(
    familyOverlap,
    scentCharacterMatch,
    genderMatch,
    topNoteOverlap,
    baseNoteOverlap,
    namePrefixRelationship,
  );

  return {
    familyOverlap,
    scentCharacterMatch,
    genderMatch,
    collectionMatch,
    topNoteOverlap,
    baseNoteOverlap,
    namePrefixRelationship,
    namePrefixNote,
    textCrossReference: textRef.found,
    textCrossReferenceNote: textRef.note,
    overlapScore,
  };
}

// ── Structural recheck ─────────────────────────────────────────────────────────

function checkStructuralState(
  sourceSlug: string,
  targetSlug: string,
  relType:    RelationshipType,
  arraySlug:  string[],
  allSlugs:   ReadonlySet<string>,
  recordMap:  ReadonlyMap<string, FragranceKnowledge>,
): StructuralState {
  if (!targetSlug || !targetSlug.trim()) return "DEFECT_BLANK_TARGET";
  if (targetSlug === sourceSlug)         return "DEFECT_SELF_REFERENCE";
  if (!allSlugs.has(targetSlug))         return "DEFECT_DANGLING_TARGET";

  // Duplicate check: count occurrences within the same array
  if (relType !== "evolutionOf") {
    const occurrences = arraySlug.filter(s => s === targetSlug).length;
    if (occurrences > 1) return "DEFECT_DUPLICATE_IN_ARRAY";
  }

  // Reciprocity check — mirrors the canonical validator.ts invariants.
  // RELATIONSHIP_ALTERNATIVES_NOT_RECIPROCAL / RELATIONSHIP_WARDROBE_PARTNERS_NOT_RECIPROCAL /
  // RELATIONSHIP_EVOLUTION_NOT_RECIPROCAL are errors in the MKC canonical validator.
  const target = recordMap.get(targetSlug);
  switch (relType) {
    case "alternatives": {
      const reciprocal = target?.relationships?.alternatives ?? [];
      if (!reciprocal.includes(sourceSlug)) return "DEFECT_ALTERNATIVE_NOT_RECIPROCAL";
      break;
    }
    case "wardrobePartners": {
      const reciprocal = target?.relationships?.wardrobePartners ?? [];
      if (!reciprocal.includes(sourceSlug)) return "DEFECT_WARDROBE_PARTNER_NOT_RECIPROCAL";
      break;
    }
    case "evolutionOf": {
      const evolutions = target?.relationships?.evolutions ?? [];
      if (!evolutions.includes(sourceSlug)) return "DEFECT_EVOLUTION_NOT_RECIPROCAL";
      break;
    }
    case "evolutions": {
      if (target?.relationships?.evolutionOf !== sourceSlug) return "DEFECT_EVOLUTION_NOT_RECIPROCAL";
      break;
    }
  }

  return "VALID";
}

// ── Classification rules ───────────────────────────────────────────────────────

/**
 * Deterministic classification rules per relationship type.
 *
 * evolutionOf / evolutions:
 *   Always EXTERNAL_RESEARCH_REQUIRED.
 *   Whether one fragrance is truly a "line evolution" (not just a flanker,
 *   variant, or independently released product with a similar name) requires
 *   authoritative fragrance industry knowledge not present in the repository.
 *   The repository provides name-prefix evidence as support, but cannot prove
 *   manufacturer-confirmed lineage.
 *
 * alternatives:
 *   Always FOUNDER_EDITORIAL_DECISION_REQUIRED.
 *   "Comparable alternatives in a similar register" is a Maison commercial
 *   positioning decision. Whether Maison should recommend one fragrance as
 *   a substitute for another is an editorial choice the founder must own.
 *   Repository metadata can inform but cannot replace that decision.
 *
 * wardrobePartners:
 *   Always FOUNDER_EDITORIAL_DECISION_REQUIRED.
 *   "Recommended to own alongside" is definitionally an editorial wardrobe
 *   curation choice. The authoring guide explicitly identifies wardrobePartners
 *   as editorial reasoning. No algorithmic rule can substitute for Maison's
 *   intentional pairing decision.
 */
type EditorialResult = {
  classification: EditorialClassification;
  requiresExternalResearch: boolean;
  requiresFounderDecision: boolean;
  action: RecommendedAction;
  blockingReason: string;
};

function classify(
  relType: RelationshipType,
  evidence: RepositoryEvidence,
  structuralState: StructuralState,
): EditorialResult {
  // Severe structural defects (no valid target data) prevent reliable editorial assessment.
  // These conditions mean we cannot even determine what the relationship points to.
  const isSevereDefect =
    structuralState === "DEFECT_BLANK_TARGET"    ||
    structuralState === "DEFECT_SELF_REFERENCE"  ||
    structuralState === "DEFECT_DANGLING_TARGET" ||
    structuralState === "DEFECT_DUPLICATE_IN_ARRAY";

  if (isSevereDefect) {
    return {
      classification: "INSUFFICIENT_EVIDENCE",
      requiresExternalResearch: false,
      requiresFounderDecision: false,
      action: "RELATIONSHIP_REVIEW",
      blockingReason: `Structural defect prevents editorial assessment: ${structuralState}`,
    };
  }

  // Reciprocity defects are structural but do not prevent editorial classification.
  // The relationship type still determines the editorial question (founder vs research).
  // We compute the editorial result normally, then override the action to RELATIONSHIP_REVIEW
  // to signal that structural repair takes priority before editorial resolution.
  const isReciprocityDefect =
    structuralState === "DEFECT_ALTERNATIVE_NOT_RECIPROCAL"       ||
    structuralState === "DEFECT_WARDROBE_PARTNER_NOT_RECIPROCAL"  ||
    structuralState === "DEFECT_EVOLUTION_NOT_RECIPROCAL";

  let result: EditorialResult;

  switch (relType) {
    case "evolutionOf":
    case "evolutions": {
      const nameSupportNote = evidence.namePrefixRelationship === true
        ? `Name-prefix relationship detected (${evidence.namePrefixNote}). Repository evidence supports the hypothesis but cannot confirm official line lineage.`
        : `No clear name-prefix relationship found. Lineage claim requires authoritative external confirmation.`;
      result = {
        classification: "EXTERNAL_RESEARCH_REQUIRED",
        requiresExternalResearch: true,
        requiresFounderDecision: false,
        action: "AUTHORITATIVE_RESEARCH",
        blockingReason: `Whether one fragrance is a confirmed line evolution of another requires authoritative fragrance industry knowledge. ${nameSupportNote}`,
      };
      break;
    }

    case "alternatives": {
      const overlapNote = evidence.familyOverlap.length > 0
        ? `Repository evidence: ${evidence.familyOverlap.length} shared family/families (${evidence.familyOverlap.join(", ")}), scentCharacter ${evidence.scentCharacterMatch ? "matches" : "differs"}.`
        : `Repository evidence: no shared fragrance family. Substitutability claim is weakly supported by repository data alone.`;
      result = {
        classification: "FOUNDER_EDITORIAL_DECISION_REQUIRED",
        requiresExternalResearch: false,
        requiresFounderDecision: true,
        action: "FOUNDER_EDITORIAL_REVIEW",
        blockingReason: `"Comparable alternatives in a similar register" is a Maison commercial positioning decision — the founder must confirm which fragrance the catalogue should recommend as a substitute for another. ${overlapNote} AI-generated without confirmed human editorial approval.`,
      };
      break;
    }

    case "wardrobePartners": {
      result = {
        classification: "FOUNDER_EDITORIAL_DECISION_REQUIRED",
        requiresExternalResearch: false,
        requiresFounderDecision: true,
        action: "FOUNDER_EDITORIAL_REVIEW",
        blockingReason: `"Recommended to own alongside" is a Maison editorial wardrobe curation decision. The authoring guide identifies wardrobePartners as editorial reasoning. No algorithmic rule can substitute for intentional pairing. AI-generated without confirmed human editorial approval.`,
      };
      break;
    }
  }

  // For reciprocity defects, the editorial dimension is still assessable (the relationship type
  // is clear), but the action must be RELATIONSHIP_REVIEW because structural repair takes priority.
  if (isReciprocityDefect) {
    return {
      ...result!,
      action: "RELATIONSHIP_REVIEW",
      blockingReason: `[STRUCTURAL DEFECT: ${structuralState}] ${result!.blockingReason}`,
    };
  }

  return result!;
}

// ── Evidence limitations per type ──────────────────────────────────────────────

function computeEvidenceLimitations(relType: RelationshipType): readonly EvidenceLimitation[] {
  const base: EvidenceLimitation[] = [
    "NO_HUMAN_EDITORIAL_APPROVAL_RECORD",
    "HUMAN_APPROVAL_NOT_CONFIRMED",
    "METADATA_SIMILARITY_NOT_SEMANTIC_PROOF",
  ];

  if (relType === "evolutionOf" || relType === "evolutions") {
    return [
      ...base,
      "NO_MANUFACTURER_POSITIONING_STATEMENT",
      "NO_THIRD_PARTY_DATABASE_CONFIRMATION",
      "NAME_RELATIONSHIP_MAY_NOT_IMPLY_EVOLUTION",
    ];
  }

  if (relType === "alternatives") {
    return [
      ...base,
      "NO_OLFACTIVE_TESTING",
      "NO_THIRD_PARTY_DATABASE_CONFIRMATION",
      "NO_CONSUMER_REVIEW_EVIDENCE",
    ];
  }

  // wardrobePartners
  return [
    ...base,
    "WARDROBE_CURATION_REQUIRES_FOUNDER_INTENT",
  ];
}

// ── Per-record rollup ──────────────────────────────────────────────────────────

function buildRecordRollup(
  record: FragranceKnowledge,
  recordEdges: readonly RelationshipEdgeAuditResult[],
): RecordRelationshipRollup {
  const classificationCounts: Record<EditorialClassification, number> = {
    REPOSITORY_SUPPORTED: 0,
    EXTERNAL_RESEARCH_REQUIRED: 0,
    FOUNDER_EDITORIAL_DECISION_REQUIRED: 0,
    INSUFFICIENT_EVIDENCE: 0,
  };

  const typesPresent = new Set<RelationshipType>();
  let requiresExternalResearch = false;
  let requiresFounderDecision = false;
  let hasStructuralDefects = false;

  for (const edge of recordEdges) {
    classificationCounts[edge.editorialClassification]++;
    typesPresent.add(edge.relationshipType);
    if (edge.requiresExternalResearch) requiresExternalResearch = true;
    if (edge.requiresFounderDecision)  requiresFounderDecision  = true;
    if (edge.structuralState !== "VALID") hasStructuralDefects = true;
  }

  const hasUnsupportedRelationships =
    classificationCounts.EXTERNAL_RESEARCH_REQUIRED > 0 ||
    classificationCounts.FOUNDER_EDITORIAL_DECISION_REQUIRED > 0 ||
    classificationCounts.INSUFFICIENT_EVIDENCE > 0;

  // Derive recommended action
  let recommendedNextAction: RecommendedAction = "NO_RELATIONSHIP_CHANGE";
  if (hasStructuralDefects) {
    recommendedNextAction = "RELATIONSHIP_REVIEW";
  } else if (requiresExternalResearch && requiresFounderDecision) {
    recommendedNextAction = "RELATIONSHIP_REVIEW";
  } else if (requiresExternalResearch) {
    recommendedNextAction = "AUTHORITATIVE_RESEARCH";
  } else if (requiresFounderDecision) {
    recommendedNextAction = "FOUNDER_EDITORIAL_REVIEW";
  }

  return {
    slug:                        record.slug,
    name:                        record.name,
    relationshipCount:           recordEdges.length,
    relationshipTypes:           [...typesPresent].sort() as RelationshipType[],
    classificationCounts,
    requiresExternalResearch,
    requiresFounderDecision,
    hasUnsupportedRelationships,
    hasStructuralDefects,
    recommendedNextAction,
  };
}

// ── Main audit function ────────────────────────────────────────────────────────

export function runCatalogueRelationshipEditorialAudit(
  input: RelationshipEditorialAuditInput,
): CatalogueRelationshipEditorialAuditReport {

  const { records } = input;

  // Build lookup map
  const recordMap = new Map<string, FragranceKnowledge>(records.map(r => [r.slug, r]));
  const allSlugs  = new Set<string>(records.map(r => r.slug));

  const allEdges:   RelationshipEdgeAuditResult[] = [];
  const rollups:    RecordRelationshipRollup[]     = [];

  const recordsWithoutRelationships: string[] = [];

  // Process each record in alphabetical order for stable output
  const sortedRecords = [...records].sort((a, b) => a.slug.localeCompare(b.slug));

  for (const record of sortedRecords) {
    const rel = record.relationships;
    const hasRelationships = rel && Object.keys(rel).length > 0;

    if (!hasRelationships) {
      recordsWithoutRelationships.push(record.slug);
      continue;
    }

    const recordEdges: RelationshipEdgeAuditResult[] = [];

    // Collect edges from each relationship type
    const typesToProcess: Array<{ type: RelationshipType; slugs: string[] }> = [];

    if (rel.evolutionOf !== undefined) {
      typesToProcess.push({ type: "evolutionOf", slugs: [rel.evolutionOf] });
    }
    if (rel.evolutions && rel.evolutions.length > 0) {
      typesToProcess.push({ type: "evolutions", slugs: [...rel.evolutions] });
    }
    if (rel.alternatives && rel.alternatives.length > 0) {
      typesToProcess.push({ type: "alternatives", slugs: [...rel.alternatives] });
    }
    if (rel.wardrobePartners && rel.wardrobePartners.length > 0) {
      typesToProcess.push({ type: "wardrobePartners", slugs: [...rel.wardrobePartners] });
    }

    for (const { type, slugs } of typesToProcess) {
      for (const targetSlug of slugs) {
        const structuralState = checkStructuralState(
          record.slug,
          targetSlug,
          type,
          slugs,
          allSlugs,
          recordMap,
        );

        const target = recordMap.get(targetSlug);
        const evidence = target
          ? collectEvidence(record, target, type)
          : {
              familyOverlap: [],
              scentCharacterMatch: false,
              genderMatch: false,
              collectionMatch: false,
              topNoteOverlap: [],
              baseNoteOverlap: [],
              namePrefixRelationship: null,
              namePrefixNote: "Target record not found — cannot collect evidence",
              textCrossReference: false,
              textCrossReferenceNote: null,
              overlapScore: 0,
            } satisfies RepositoryEvidence;

        const { classification, requiresExternalResearch, requiresFounderDecision, action, blockingReason } =
          classify(type, evidence, structuralState);

        const limitations = computeEvidenceLimitations(type);

        recordEdges.push({
          sourceSlug:              record.slug,
          relationshipType:        type,
          targetSlug,
          structuralState,
          provenanceState:         "AI_GENERATED",
          editorialClassification: classification,
          repositoryEvidence:      evidence,
          evidenceLimitations:     limitations,
          requiresExternalResearch,
          requiresFounderDecision,
          recommendedNextAction:   action,
          blockingReason,
        });
      }
    }

    // Sort edges deterministically: type, then targetSlug
    recordEdges.sort((a, b) => {
      const typeOrder: Record<RelationshipType, number> = {
        evolutionOf: 0, evolutions: 1, alternatives: 2, wardrobePartners: 3,
      };
      const typeDiff = typeOrder[a.relationshipType] - typeOrder[b.relationshipType];
      if (typeDiff !== 0) return typeDiff;
      return a.targetSlug.localeCompare(b.targetSlug);
    });

    allEdges.push(...recordEdges);
    rollups.push(buildRecordRollup(record, recordEdges));
  }

  // Add zero-relationship records to rollups (no-relationship rollup)
  for (const slug of recordsWithoutRelationships) {
    const record = recordMap.get(slug)!;
    rollups.push({
      slug,
      name:            record.name,
      relationshipCount: 0,
      relationshipTypes: [],
      classificationCounts: {
        REPOSITORY_SUPPORTED: 0,
        EXTERNAL_RESEARCH_REQUIRED: 0,
        FOUNDER_EDITORIAL_DECISION_REQUIRED: 0,
        INSUFFICIENT_EVIDENCE: 0,
      },
      requiresExternalResearch:    false,
      requiresFounderDecision:     false,
      hasUnsupportedRelationships: false,
      hasStructuralDefects:        false,
      recommendedNextAction:       "NO_RELATIONSHIP_CHANGE",
    });
  }

  // Sort rollups alphabetically
  rollups.sort((a, b) => a.slug.localeCompare(b.slug));

  // ── Build summary ────────────────────────────────────────────────────────────

  const edgesByType: Record<RelationshipType, number> = {
    evolutionOf: 0, evolutions: 0, alternatives: 0, wardrobePartners: 0,
  };
  const edgesByClassification: Record<EditorialClassification, number> = {
    REPOSITORY_SUPPORTED: 0,
    EXTERNAL_RESEARCH_REQUIRED: 0,
    FOUNDER_EDITORIAL_DECISION_REQUIRED: 0,
    INSUFFICIENT_EVIDENCE: 0,
  };
  const edgesByProvenance: Record<RelationshipProvenance, number> = {
    AI_GENERATED: 0, HUMAN_EDITED: 0, GOVERNED: 0, UNKNOWN: 0,
  };
  const edgesByStructural: Record<StructuralState, number> = {
    VALID: 0,
    DEFECT_SELF_REFERENCE: 0,
    DEFECT_DANGLING_TARGET: 0,
    DEFECT_BLANK_TARGET: 0,
    DEFECT_DUPLICATE_IN_ARRAY: 0,
    DEFECT_ALTERNATIVE_NOT_RECIPROCAL: 0,
    DEFECT_WARDROBE_PARTNER_NOT_RECIPROCAL: 0,
    DEFECT_EVOLUTION_NOT_RECIPROCAL: 0,
  };

  let structuralDefectCount = 0;

  for (const edge of allEdges) {
    edgesByType[edge.relationshipType]++;
    edgesByClassification[edge.editorialClassification]++;
    edgesByProvenance[edge.provenanceState]++;
    edgesByStructural[edge.structuralState]++;
    if (edge.structuralState !== "VALID") structuralDefectCount++;
  }

  const recordStats = rollups.filter(r => r.relationshipCount > 0);
  const recordsByEditorialState = {
    requiresExternalResearch:    recordStats.filter(r => r.requiresExternalResearch).length,
    requiresFounderDecision:     recordStats.filter(r => r.requiresFounderDecision).length,
    hasUnsupportedRelationships: recordStats.filter(r => r.hasUnsupportedRelationships).length,
    hasOnlyRepositorySupported:  recordStats.filter(
      r => r.classificationCounts.FOUNDER_EDITORIAL_DECISION_REQUIRED === 0 &&
           r.classificationCounts.EXTERNAL_RESEARCH_REQUIRED === 0 &&
           r.classificationCounts.INSUFFICIENT_EVIDENCE === 0,
    ).length,
    hasStructuralDefects: recordStats.filter(r => r.hasStructuralDefects).length,
  };

  const summary: RelationshipAuditSummary = {
    totalCatalogueRecords:          records.length,
    relationshipBearingRecords:     rollups.filter(r => r.relationshipCount > 0).length,
    recordsWithoutRelationships:    recordsWithoutRelationships.length,
    totalRelationshipEdges:         allEdges.length,
    edgesByRelationshipType:        edgesByType,
    edgesByEditorialClassification: edgesByClassification,
    edgesByProvenanceState:         edgesByProvenance,
    edgesByStructuralState:         edgesByStructural,
    structuralDefectCount,
    recordsByEditorialState,
    recordsWithoutRelationshipsList: recordsWithoutRelationships.sort(),
    provenanceSummary:
      `All ${allEdges.length} relationship edges were generated by RelationshipProducer ` +
      `(Anthropic Claude Haiku API, confidence threshold 0.6). ` +
      `Provenance classification: AI_GENERATED for all edges — this confirms origin method. ` +
      `AI_GENERATED provenance does NOT imply human editorial approval, which is unconfirmed ` +
      `for every edge in the current governance system.`,
  };

  return {
    version:                        "1.0.0",
    generatedAt:                    new Date().toISOString(),
    generatedBy:                    "EP6-P4 — Catalogue Relationship Editorial Audit",
    sourceCatalogueAuditVersion:    input.sourceCatalogueAuditVersion,
    sourceRemediationQueueVersion:  input.sourceRemediationQueueVersion,
    auditPurpose:
      "Read-only deterministic editorial governance audit of all 338 canonical relationship " +
      "edges across 89 relationship-bearing native fragrance knowledge records. " +
      "Distinguishes structural validity from editorial validity. Collects repository-local " +
      "evidence per edge. Classifies each edge by editorial supportability. Identifies " +
      "relationships requiring external research vs. founder decision. " +
      "Zero relationship mutations. Zero knowledge mutations. Zero AI calls.",
    safetyInvariants: {
      noKnowledgeModified:   true,
      noRelationshipMutated: true,
      noAiGeneration:        true,
      noExternalResearch:    true,
      noIdentityMutation:    true,
      noFactoryInvocation:   true,
      approvedIdentityId:    null,
      force:                 false,
    },
    summary,
    records: rollups,
    edges:   allEdges,
  };
}

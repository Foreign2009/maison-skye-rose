/**
 * EP6-P5B — Relationship Editorial Review Foundation
 *
 * Builds the initial relationship review queue from the post-P5A audit artifact.
 * Collapses 336 directional edges into 168 pair-level governance units.
 *
 * Safety invariants:
 *   - Reads ONLY from the audit artifact (no catalogue mutation)
 *   - Writes ONLY to the reviews/ output path
 *   - Zero AI calls. Zero external research. Zero relationship mutations.
 *   - All units begin as pending-review / REPOSITORY_SUPPORTED / AI_GENERATED.
 *
 * Usage: npx tsx scripts/identity/build-relationship-review-queue.ts
 */

import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";

// ── Paths ──────────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..", "..");

const AUDIT_PATH = join(ROOT, "app/lib/identity/data/audits/catalogue-relationship-editorial-audit.json");
const OUTPUT_PATH = join(ROOT, "app/lib/identity/data/reviews/catalogue-relationship-review-queue.json");

// ── Known fingerprints ─────────────────────────────────────────────────────────

const POST_P5A_FINGERPRINT = "478fd478d930137fe21d058470797c324649156d615b60d3b9d3a9108f73b8e2";

// ── Audit edge type (local) ────────────────────────────────────────────────────

interface AuditEdge {
  readonly sourceSlug: string;
  readonly relationshipType: "alternatives" | "wardrobePartners" | "evolutionOf" | "evolutions";
  readonly targetSlug: string;
  readonly repositoryEvidence: {
    readonly familyOverlap: readonly string[];
    readonly scentCharacterMatch: boolean;
    readonly genderMatch: boolean;
    readonly collectionMatch: boolean;
    readonly topNoteOverlap: readonly string[];
    readonly baseNoteOverlap: readonly string[];
    readonly overlapScore: number;
  };
  readonly evidenceLimitations: readonly string[];
  readonly requiresExternalResearch: boolean;
  readonly blockingReason: string | null;
}

interface AuditArtifact {
  readonly generatedAt: string;
  readonly edges: readonly AuditEdge[];
}

// ── Review unit types (local mirrors) ─────────────────────────────────────────

type RelationshipPairType = "alternatives" | "wardrobePartners" | "evolution";
type RelationshipReviewStatus = "pending-review";
type RelationshipGovernanceState = "REPOSITORY_SUPPORTED";
type RelationshipProposalProvenance = "AI_GENERATED";

interface RelationshipPairEvidence {
  readonly familyOverlap: readonly string[];
  readonly scentCharacterMatch: boolean;
  readonly genderMatch: boolean;
  readonly collectionMatch: boolean;
  readonly topNoteOverlap: readonly string[];
  readonly baseNoteOverlap: readonly string[];
  readonly overlapScore: number;
}

interface RelationshipReviewUnit {
  readonly reviewId: string;
  readonly pairType: RelationshipPairType;
  readonly slugA: string;
  readonly slugB: string;
  readonly proposalProvenance: RelationshipProposalProvenance;
  readonly governanceState: RelationshipGovernanceState;
  readonly status: RelationshipReviewStatus;
  readonly auditEvidence: RelationshipPairEvidence;
  readonly evidenceLimitations: readonly string[];
  readonly requiresExternalResearch: boolean;
  readonly blockingReason: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly founderNotes: null;
}

// ── Fingerprint ────────────────────────────────────────────────────────────────

function buildGraphFingerprint(edges: readonly AuditEdge[]): string {
  const sorted = [...edges]
    .sort((a, b) =>
      a.sourceSlug.localeCompare(b.sourceSlug) ||
      a.relationshipType.localeCompare(b.relationshipType) ||
      a.targetSlug.localeCompare(b.targetSlug),
    )
    .map(e => `${e.sourceSlug}|${e.relationshipType}|${e.targetSlug}`)
    .join("\n");
  return createHash("sha256").update(sorted).digest("hex");
}

// ── Deterministic review ID ────────────────────────────────────────────────────

function makeReviewId(pairType: RelationshipPairType, slugA: string, slugB: string): string {
  switch (pairType) {
    case "alternatives":
      return `REL-alternatives-${slugA}--${slugB}`;
    case "wardrobePartners":
      return `REL-wardrobe-partners-${slugA}--${slugB}`;
    case "evolution":
      return `REL-evolution-${slugA}--${slugB}`;
  }
}

// ── Pair collapse ──────────────────────────────────────────────────────────────

function collapseEdgesToPairs(
  edges: readonly AuditEdge[],
  now: string,
): RelationshipReviewUnit[] {
  const units: RelationshipReviewUnit[] = [];

  // ── Symmetric pairs: alternatives ────────────────────────────────────────────
  // Keep only the edge where sourceSlug < targetSlug (lexically) to deduplicate.
  const altEdges = edges.filter(e => e.relationshipType === "alternatives");
  for (const e of altEdges) {
    if (e.sourceSlug >= e.targetSlug) continue; // skip reciprocal; keep slugA < slugB
    const slugA = e.sourceSlug;
    const slugB = e.targetSlug;
    units.push({
      reviewId: makeReviewId("alternatives", slugA, slugB),
      pairType: "alternatives",
      slugA,
      slugB,
      proposalProvenance: "AI_GENERATED",
      governanceState: "REPOSITORY_SUPPORTED",
      status: "pending-review",
      auditEvidence: {
        familyOverlap: e.repositoryEvidence.familyOverlap,
        scentCharacterMatch: e.repositoryEvidence.scentCharacterMatch,
        genderMatch: e.repositoryEvidence.genderMatch,
        collectionMatch: e.repositoryEvidence.collectionMatch,
        topNoteOverlap: e.repositoryEvidence.topNoteOverlap,
        baseNoteOverlap: e.repositoryEvidence.baseNoteOverlap,
        overlapScore: e.repositoryEvidence.overlapScore,
      },
      evidenceLimitations: e.evidenceLimitations,
      requiresExternalResearch: e.requiresExternalResearch,
      blockingReason: e.blockingReason,
      createdAt: now,
      updatedAt: now,
      founderNotes: null,
    });
  }

  // ── Symmetric pairs: wardrobePartners ────────────────────────────────────────
  const wpEdges = edges.filter(e => e.relationshipType === "wardrobePartners");
  for (const e of wpEdges) {
    if (e.sourceSlug >= e.targetSlug) continue; // skip reciprocal; keep slugA < slugB
    const slugA = e.sourceSlug;
    const slugB = e.targetSlug;
    units.push({
      reviewId: makeReviewId("wardrobePartners", slugA, slugB),
      pairType: "wardrobePartners",
      slugA,
      slugB,
      proposalProvenance: "AI_GENERATED",
      governanceState: "REPOSITORY_SUPPORTED",
      status: "pending-review",
      auditEvidence: {
        familyOverlap: e.repositoryEvidence.familyOverlap,
        scentCharacterMatch: e.repositoryEvidence.scentCharacterMatch,
        genderMatch: e.repositoryEvidence.genderMatch,
        collectionMatch: e.repositoryEvidence.collectionMatch,
        topNoteOverlap: e.repositoryEvidence.topNoteOverlap,
        baseNoteOverlap: e.repositoryEvidence.baseNoteOverlap,
        overlapScore: e.repositoryEvidence.overlapScore,
      },
      evidenceLimitations: e.evidenceLimitations,
      requiresExternalResearch: e.requiresExternalResearch,
      blockingReason: e.blockingReason,
      createdAt: now,
      updatedAt: now,
      founderNotes: null,
    });
  }

  // ── Directional pairs: evolution ──────────────────────────────────────────────
  // Source of truth: evolutionOf edges (child→parent).
  // slugA = parent, slugB = child.
  // Evidence from the evolutionOf edge (child perspective).
  const eoEdges = edges.filter(e => e.relationshipType === "evolutionOf");
  for (const e of eoEdges) {
    const slugA = e.targetSlug; // parent
    const slugB = e.sourceSlug; // child
    units.push({
      reviewId: makeReviewId("evolution", slugA, slugB),
      pairType: "evolution",
      slugA,
      slugB,
      proposalProvenance: "AI_GENERATED",
      governanceState: "REPOSITORY_SUPPORTED",
      status: "pending-review",
      auditEvidence: {
        familyOverlap: e.repositoryEvidence.familyOverlap,
        scentCharacterMatch: e.repositoryEvidence.scentCharacterMatch,
        genderMatch: e.repositoryEvidence.genderMatch,
        collectionMatch: e.repositoryEvidence.collectionMatch,
        topNoteOverlap: e.repositoryEvidence.topNoteOverlap,
        baseNoteOverlap: e.repositoryEvidence.baseNoteOverlap,
        overlapScore: e.repositoryEvidence.overlapScore,
      },
      evidenceLimitations: e.evidenceLimitations,
      requiresExternalResearch: e.requiresExternalResearch,
      blockingReason: e.blockingReason,
      createdAt: now,
      updatedAt: now,
      founderNotes: null,
    });
  }

  // Sort: alternatives first, then wardrobePartners, then evolution;
  // within each type sort by reviewId for stable output.
  const typeOrder: Record<RelationshipPairType, number> = {
    alternatives: 0,
    wardrobePartners: 1,
    evolution: 2,
  };
  units.sort((a, b) => {
    const to = typeOrder[a.pairType] - typeOrder[b.pairType];
    if (to !== 0) return to;
    return a.reviewId.localeCompare(b.reviewId);
  });

  return units;
}

// ── Main ───────────────────────────────────────────────────────────────────────

function main(): void {
  const now = new Date().toISOString();

  // 1. Load audit artifact
  const audit: AuditArtifact = JSON.parse(readFileSync(AUDIT_PATH, "utf-8"));
  const edges = audit.edges as AuditEdge[];

  // 2. Verify graph fingerprint matches post-P5A baseline
  const fingerprint = buildGraphFingerprint(edges);
  if (fingerprint !== POST_P5A_FINGERPRINT) {
    console.error(`ABORT: graph fingerprint does not match post-P5A baseline.`);
    console.error(`  Expected: ${POST_P5A_FINGERPRINT}`);
    console.error(`  Got:      ${fingerprint}`);
    process.exit(1);
  }

  // 3. Collapse edges to pairs
  const units = collapseEdgesToPairs(edges, now);

  // 4. Compute summary
  const altCount = units.filter(u => u.pairType === "alternatives").length;
  const wpCount  = units.filter(u => u.pairType === "wardrobePartners").length;
  const evoCount = units.filter(u => u.pairType === "evolution").length;
  const researchCount = units.filter(u => u.requiresExternalResearch).length;

  const summary = {
    totalUnits: units.length,
    alternativePairs: altCount,
    wardrobePartnerPairs: wpCount,
    evolutionPairs: evoCount,
    byStatus: { "pending-review": units.length, "in-review": 0, approved: 0, rejected: 0, "needs-research": 0, deferred: 0 },
    byGovernanceState: { REPOSITORY_SUPPORTED: units.length, FOUNDER_APPROVED: 0, FOUNDER_REJECTED: 0 },
    requiresExternalResearch: researchCount,
  };

  // 5. Build output
  const output = {
    schemaVersion: "EP6-P5B-v1",
    generatedAt: now,
    generatedBy: "EP6-P5B — Relationship Editorial Review Foundation",
    graphFingerprint: fingerprint,
    summary,
    units,
  };

  // 6. Write artifact
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), "utf-8");

  console.log(`EP6-P5B — Relationship Editorial Review Foundation`);
  console.log(`=================================================`);
  console.log(`Graph fingerprint: ${fingerprint}`);
  console.log(`Total review units: ${units.length}`);
  console.log(`  Alternative pairs:      ${altCount}`);
  console.log(`  Wardrobe partner pairs: ${wpCount}`);
  console.log(`  Evolution pairs:        ${evoCount}`);
  console.log(`Requires external research: ${researchCount}`);
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log(`\nQueue built successfully.`);
}

main();

/**
 * Maison Intelligence Layer — Discovery Progression
 *
 * Owns educational sequencing for connected discovery collections.
 * Third layer in the Discovery architecture:
 *
 *   Discovery Intelligence (discoveryIntelligence.ts)
 *     ↓  CollectionProfile — collection character understanding
 *   Discovery Graph (discoveryGraph.ts)
 *     ↓  collection-to-collection connections (similarity)
 *   This module
 *     ↓  educational direction and sequencing
 *
 * Responsibilities:
 *   - Derive a progression depth level from CollectionProfile
 *   - Assign an educational direction to each graph-connected collection
 *   - Expose enriched ProgressionConnection[] for the discovery page
 *
 * This module does NOT rebuild collection intelligence or graph relationships.
 * It adds a sequencing layer on top of what Discovery Graph already computes.
 *
 * Depth model — editorial learning stages (NOT customer skill levels):
 *   Depth 1 — Accessible:  approachable, familiar-family, beginner-tagged collections
 *   Depth 2 — Versatile:   balanced daily-wear and season-specific collections
 *   Depth 3 — Specialised: occasion-specific or deep-family compositions
 *
 * Depth is derived from existing CollectionProfile signals:
 *   tags.includes("beginner")                       → Depth 1 (authoritative override)
 *   dimensions.topFamilies ∩ {Oud, Amber, Oriental} → Depth 3 signal
 *   dimensions.topOccasions ∩ {Date Night, Wedding,
 *                               Evening, Winter Evenings} → Depth 3 signal
 *   Otherwise                                       → Depth 2
 *
 * Why Woody and Spicy are excluded from the Depth 3 family set:
 *   Both appear in versatile daily-wear compositions. Including them would
 *   incorrectly elevate everyday-wear collections to Depth 3.
 *
 * Editorial heuristic. Depth signals (Refinement 7):
 *   - Relationship graph richness: majority of representatives with
 *     relationshipRichness ≥ 0.4 → Depth 3 signal  (EP26-P2)
 *   - Academy coverage: majority of representatives with
 *     educationalRichness ≥ 0.4 → Depth 3 signal    (EP26-P2)
 *   - Native knowledge density: future evolution
 *   - Wardrobe pathway density: future evolution
 */

import type { CollectionSpec }     from "./types";
import type { FragranceKnowledge } from "../mkc/types";
import { COLLECTION_SPECS }        from "./collectionEngine";
import { getCollectionProfile }    from "./discoveryIntelligence";
import { getConnectedCollections } from "./discoveryGraph";
import { getKnowledgeQuality }     from "../mkc/knowledgeQuality";

// ── Progression depth ─────────────────────────────────────────────────────────
// Three editorial learning stages. Not customer skill levels (Refinement 3).

export type ProgressionDepth = 1 | 2 | 3;

// Specialist families are reliable Depth 3 markers: their compositions demand
// patience to appreciate and are not universally accessible entry points.
// Oud, Amber, and Oriental appear only in occasion-specific or evening collections.
// Woody and Spicy are intentionally excluded — they are present in many
// versatile and daily-wear compositions and do not reliably signal Depth 3.
const SPECIALIST_FAMILIES = new Set(["Oud", "Amber", "Oriental"]);

// Formal occasions reliably signal Depth 3: they represent a distinct,
// occasion-specific layer of a wardrobe rather than a daily-wear anchor.
const FORMAL_OCCASIONS = new Set(["Date Night", "Wedding", "Evening", "Winter Evenings"]);

// KQ threshold for depth signals (EP26-P2).
// Aligned with the Knowledge Quality standard-tier lower bound (overallScore ≥ 0.40).
// A representative at or above this value on either dimension signals that the
// collection has substantive editorial depth beyond what tags or families alone capture.
const KQ_DEPTH_THRESHOLD = 0.4;

// Returns true when a strict majority of representatives have relationshipRichness
// or educationalRichness at or above KQ_DEPTH_THRESHOLD.
// Implements the Knowledge Quality portion of Refinement 7 (EP26-P2).
function representativesHaveKqDepth(reps: FragranceKnowledge[]): boolean {
  if (reps.length === 0) return false;
  const passing = reps.filter((r) => {
    const kq = getKnowledgeQuality(r.slug);
    return kq !== undefined && (
      kq.relationshipRichness >= KQ_DEPTH_THRESHOLD ||
      kq.educationalRichness  >= KQ_DEPTH_THRESHOLD
    );
  });
  // Strict majority: passing must exceed half of the representative count.
  return passing.length * 2 > reps.length;
}

function computeDepthLevel(id: string): ProgressionDepth {
  const spec = COLLECTION_SPECS.find((s) => s.id === id);
  // Editorial collections manage their own navigation structure — skip.
  if (!spec || spec.editorial) return 2;

  // Explicit "beginner" tag is the most authoritative Depth 1 signal.
  // It is an authored editorial intent, not a computed heuristic.
  if (spec.tags.some((t) => t === "beginner")) return 1;

  const profile = getCollectionProfile(id);
  if (!profile) return 2;

  const { topFamilies, topOccasions } = profile.dimensions;

  const hasSpecialistFamily = topFamilies.some((f) => SPECIALIST_FAMILIES.has(f));
  const hasFormalOccasion   = topOccasions.some((o) => FORMAL_OCCASIONS.has(o));
  const hasKqDepth          = representativesHaveKqDepth(profile.representatives);

  if (hasSpecialistFamily || hasFormalOccasion || hasKqDepth) return 3;
  return 2;
}

// ── Progression direction ─────────────────────────────────────────────────────

export type ProgressionDirection = "deepen" | "explore" | "lighten";

// Approved editorial labels (Refinement 4). Non-promotional — no recommendation
// language, no comparatives that imply ranking.
const DIRECTION_LABELS: Record<ProgressionDirection, string> = {
  deepen:  "Deepen Your Journey",
  explore: "Explore Further",
  lighten: "Explore Something Lighter",
};

function progressionDirection(
  fromDepth: ProgressionDepth,
  toDepth:   ProgressionDepth
): ProgressionDirection {
  if (toDepth > fromDepth) return "deepen";
  if (toDepth < fromDepth) return "lighten";
  return "explore";
}

// ── Public type ───────────────────────────────────────────────────────────────

export interface ProgressionConnection {
  /** The adjacent collection to navigate to. */
  spec:      CollectionSpec;
  /** Educational direction: deepening, lateral, or lightening. */
  direction: ProgressionDirection;
  /** Editorial label rendered above the CollectionCard (Refinement 4). */
  label:     string;
}

// ── Precomputed maps ──────────────────────────────────────────────────────────
// DEPTH_MAP and PROGRESSION_MAP built once at module initialisation (Refinement 6).
//
// Module evaluation order guarantee:
//   discoveryIntelligence.ts is a transitive import of discoveryGraph.ts,
//   which is a direct import of this module. Node resolves both before running
//   this module body, so PROFILE_MAP and CONNECTED_MAP are already populated.

const DEPTH_MAP = new Map<string, ProgressionDepth>(
  COLLECTION_SPECS.map((spec) => [spec.id, computeDepthLevel(spec.id)])
);

function buildProgressionConnections(id: string): ProgressionConnection[] {
  const fromDepth   = DEPTH_MAP.get(id) ?? 2;
  const connections = getConnectedCollections(id); // O(1) via CONNECTED_MAP

  return connections.map((connSpec) => {
    const toDepth   = DEPTH_MAP.get(connSpec.id) ?? 2;
    const direction = progressionDirection(fromDepth, toDepth);
    return {
      spec:      connSpec,
      direction,
      label:     DIRECTION_LABELS[direction],
    };
  });
}

const PROGRESSION_MAP = new Map<string, ProgressionConnection[]>(
  COLLECTION_SPECS.map((spec) => [spec.id, buildProgressionConnections(spec.id)])
);

export function getProgressionConnections(id: string): ProgressionConnection[] {
  return PROGRESSION_MAP.get(id) ?? [];
}

/**
 * Knowledge Intelligence Engine — Knowledge Metrics
 *
 * Repository-wide intelligence metrics derived from the full MKC catalogue.
 * Provides a single aggregated view for admin dashboards and operational
 * reporting. Never used by customer-facing surfaces.
 *
 * All metrics are precomputed at module initialisation (O(n)).
 * getKnowledgeMetrics() is O(1).
 *
 * Integration points:
 *   getAllQualityProfiles() — source of all per-record scores
 *   buildIndex() + getRelationshipSummary() — relationship density
 *   mkcCatalogue — total record count and native flag
 */

import type { KnowledgeQualityTier } from "../mkc/knowledgeQuality";
import { getAllQualityProfiles }      from "../mkc/knowledgeQuality";
import { mkcCatalogue }              from "../mkc/catalogue";
import { buildIndex, getRelationshipSummary } from "../mkc/graph";

// ── Public types ──────────────────────────────────────────────────────────────

export interface DiscoveryReadinessDistribution {
  /** Records with discoveryReadiness ≥ 0.80 */
  readonly high:   number;
  /** Records with discoveryReadiness ≥ 0.40 and < 0.80 */
  readonly medium: number;
  /** Records with discoveryReadiness < 0.40 */
  readonly low:    number;
}

export interface KnowledgeMetrics {
  /** Total records in the MKC catalogue (native + adapter-derived). */
  readonly totalRecords:            number;
  /** Records with catalogVersion set — authored native records. */
  readonly nativeRecords:           number;
  /** Ratio of native to total records (0.0–1.0). */
  readonly nativeCoverage:          number;
  /** Average overallScore across all records with a quality profile. */
  readonly averageQualityScore:     number;
  /** Count of records at each quality tier. */
  readonly tierDistribution:        Readonly<Record<KnowledgeQualityTier, number>>;
  /** Distribution of discoveryReadiness scores across three bands. */
  readonly discoveryReadiness:      DiscoveryReadinessDistribution;
  /** Ratio of records with at least one relationship connection (0.0–1.0). */
  readonly relationshipDensity:     number;
  /** Average number of connected records per fragrance (all relationship types). */
  readonly averageConnections:      number;
  /** Ratio of records with academyArticleIds (0.0–1.0). */
  readonly educationCoverage:       number;
  /** Ratio of records with recommendedFor populated (0.0–1.0). */
  readonly recommendationCoverage:  number;
}

// ── Precomputation ────────────────────────────────────────────────────────────

function computeMetrics(): KnowledgeMetrics {
  const total    = mkcCatalogue.length;
  const profiles = getAllQualityProfiles();
  const index    = buildIndex(mkcCatalogue);

  let nativeCount     = 0;
  let qualitySum      = 0;
  let profileCount    = 0;
  let withRelationships = 0;
  let totalConnections  = 0;
  let withAcademy       = 0;
  let withRecommendedFor = 0;

  // Use plain mutable objects during accumulation; readonly only on the return value.
  const tierDist = { rich: 0, standard: 0, minimal: 0 };
  const drDist   = { high: 0, medium: 0, low: 0 };

  for (const record of mkcCatalogue) {
    if (record.catalogVersion !== undefined) nativeCount++;
    if ((record.academyArticleIds?.length ?? 0) > 0) withAcademy++;
    if ((record.recommendedFor?.length    ?? 0) > 0) withRecommendedFor++;

    const relSummary = getRelationshipSummary(record, index);
    if (relSummary.hasRelationships) withRelationships++;
    totalConnections += relSummary.totalConnections;

    const profile = profiles.get(record.slug);
    if (profile) {
      tierDist[profile.tier]++;
      qualitySum += profile.overallScore;
      profileCount++;

      if      (profile.discoveryReadiness >= 0.80) drDist.high++;
      else if (profile.discoveryReadiness >= 0.40) drDist.medium++;
      else                                         drDist.low++;
    }
  }

  const round = (n: number, p = 3) => Math.round(n * 10 ** p) / 10 ** p;

  return {
    totalRecords:           total,
    nativeRecords:          nativeCount,
    nativeCoverage:         total > 0 ? round(nativeCount / total) : 0,
    averageQualityScore:    profileCount > 0 ? round(qualitySum / profileCount) : 0,
    tierDistribution:       tierDist,
    discoveryReadiness:     drDist,
    relationshipDensity:    total > 0 ? round(withRelationships / total) : 0,
    averageConnections:     total > 0 ? round(totalConnections / total) : 0,
    educationCoverage:      total > 0 ? round(withAcademy / total) : 0,
    recommendationCoverage: total > 0 ? round(withRecommendedFor / total) : 0,
  };
}

const METRICS: KnowledgeMetrics = computeMetrics();

// ── Public API ────────────────────────────────────────────────────────────────

export function getKnowledgeMetrics(): KnowledgeMetrics {
  return METRICS;
}

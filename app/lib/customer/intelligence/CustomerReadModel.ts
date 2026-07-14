/**
 * Customer Intelligence — Customer Read Model (base)
 *
 * Shared foundation for all CIE read models.
 * Every read model carries a stable customerId and the timestamp at which
 * it was generated so callers can reason about freshness.
 *
 * Integration points:
 *   CustomerSummary / CustomerStatistics / CustomerAffinity
 *   CustomerJourney / CustomerConfidence / CustomerInsights — all extend this
 */

export interface CustomerReadModel {
  readonly customerId:  string;
  readonly generatedAt: number;
}

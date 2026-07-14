/**
 * Customer Intelligence — Public Surface
 *
 * Single import point for all Customer Intelligence Engine consumers.
 *
 * Read model types:
 *   CustomerReadModel         — base interface (customerId, generatedAt)
 *   CustomerSummary           — lightweight profile projection
 *   CustomerStatistics        — raw counted signal metrics
 *   CustomerAffinity          — dominant source / type derivation
 *   CustomerJourneyStage      — "new" | "exploring" | "engaged" | "converting"
 *   CustomerJourney           — stage + profile flags + slug arrays
 *   CustomerConfidence        — confidence distribution + reliable ratio
 *   CustomerInsightType       — insight classification enum
 *   CustomerInsight           — single synthesised observation
 *   CustomerPreferenceSummary — learned preference projection (empty until EP10.0-P5+)
 *   CustomerIntelligence      — medium-weight: summary + journey + affinity
 *   CustomerInsights          — full aggregate with all sub-components + insights[]
 *
 * Utility types:
 *   CustomerIndexEntry        — contract for indexable CIE read models
 *   CustomerIndex<T>          — O(1) lookup index interface
 *
 * Utility functions:
 *   createCustomerIndex       — build an in-memory index from read model arrays
 *   deriveCustomerId          — resolve stable ID from profile identity
 *   lookupSignalsBySource     — filter profile signals by source
 *   lookupSignalsByType       — filter profile signals by type
 *   lookupRecentSignals       — profile signals sorted newest-first, sliced
 *   lookupHighConfidenceSignals — filter to HIGH confidence signals only
 *
 * Engine (public API):
 *   getCustomerSummary          — lightweight projection
 *   getCustomerStatistics       — raw counted metrics
 *   getCustomerAffinity         — dominant source / type
 *   getCustomerJourney          — journey stage + profile flags
 *   getCustomerConfidence       — confidence distribution
 *   getCustomerPreferenceSummary — learned preferences (empty until P5+)
 *   getCustomerIntelligence     — medium-weight composite
 *   getCustomerInsights         — full aggregate
 */

// ── Read model types ──────────────────────────────────────────────────────────

export type { CustomerReadModel }         from "./CustomerReadModel";
export type { CustomerSummary }           from "./CustomerSummary";
export type { CustomerStatistics }        from "./CustomerStatistics";
export type { CustomerAffinity }          from "./CustomerAffinity";
export type { CustomerJourneyStage, CustomerJourney } from "./CustomerJourney";
export type { CustomerConfidence }        from "./CustomerConfidence";
export type { CustomerInsightType, CustomerInsight }  from "./CustomerInsight";
export type { CustomerPreferenceSummary } from "./CustomerPreferenceSummary";
export type { CustomerIntelligence }      from "./CustomerIntelligence";
export type { CustomerInsights }          from "./CustomerInsights";

// ── Utility types ─────────────────────────────────────────────────────────────

export type { CustomerIndexEntry, CustomerIndex } from "./CustomerIndex";

// ── Utility functions ─────────────────────────────────────────────────────────

export { createCustomerIndex }            from "./CustomerIndex";
export {
  deriveCustomerId,
  lookupSignalsBySource,
  lookupSignalsByType,
  lookupRecentSignals,
  lookupHighConfidenceSignals,
}                                         from "./CustomerLookup";

// ── Engine ────────────────────────────────────────────────────────────────────

export {
  getCustomerSummary,
  getCustomerStatistics,
  getCustomerAffinity,
  getCustomerJourney,
  getCustomerConfidence,
  getCustomerPreferenceSummary,
  getCustomerIntelligence,
  getCustomerInsights,
}                                         from "./CustomerIntelligenceEngine";

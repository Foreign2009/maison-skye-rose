/**
 * Customer Intelligence — Customer Insights (full aggregate read model)
 *
 * The most complete CIE read model. Produced by getCustomerInsights() and
 * includes every sub-component: summary, preferences, affinity, journey,
 * confidence, and synthesised insights[].
 *
 * Callers that need a single sub-component should use the dedicated getter
 * (e.g. getCustomerJourney) to avoid computing the full aggregate.
 *
 * Integration points:
 *   CustomerIntelligenceEngine — produced by getCustomerInsights()
 *   CustomerSummary / CustomerPreferenceSummary / CustomerAffinity
 *   CustomerJourney / CustomerConfidence / CustomerInsight[]
 */

import type { CustomerReadModel }         from "./CustomerReadModel";
import type { CustomerSummary }           from "./CustomerSummary";
import type { CustomerPreferenceSummary } from "./CustomerPreferenceSummary";
import type { CustomerAffinity }          from "./CustomerAffinity";
import type { CustomerJourney }           from "./CustomerJourney";
import type { CustomerConfidence }        from "./CustomerConfidence";
import type { CustomerInsight }           from "./CustomerInsight";

export interface CustomerInsights extends CustomerReadModel {
  readonly summary:     CustomerSummary;
  readonly preferences: CustomerPreferenceSummary;
  readonly affinity:    CustomerAffinity;
  readonly journey:     CustomerJourney;
  readonly confidence:  CustomerConfidence;
  readonly insights:    readonly CustomerInsight[];
}

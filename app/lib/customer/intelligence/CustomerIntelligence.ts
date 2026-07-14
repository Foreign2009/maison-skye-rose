/**
 * Customer Intelligence — Customer Intelligence (medium-weight read model)
 *
 * Composite read model combining the three most commonly needed sub-components.
 * Lighter than CustomerInsights — omits preferences, confidence details, and
 * synthesised insights. Suitable for personalisation surfaces that need journey
 * stage, affinity signals, and a quick summary without the full computation cost.
 *
 * Integration points:
 *   CustomerIntelligenceEngine — produced by getCustomerIntelligence()
 *   CustomerSummary            — embedded tier / count / flags
 *   CustomerJourney            — embedded stage + profile slugs
 *   CustomerAffinity           — embedded dominant dimensions
 */

import type { CustomerReadModel } from "./CustomerReadModel";
import type { CustomerSummary }   from "./CustomerSummary";
import type { CustomerJourney }   from "./CustomerJourney";
import type { CustomerAffinity }  from "./CustomerAffinity";

export interface CustomerIntelligence extends CustomerReadModel {
  readonly summary:  CustomerSummary;
  readonly journey:  CustomerJourney;
  readonly affinity: CustomerAffinity;
}

/**
 * Customer Intelligence — Unified Customer Profile
 *
 * Merged read model composed from all available profile tiers.
 * Produced by ProfileMerge and consumed by the Customer Intelligence Engine
 * (EP10.0-P4) and experience surfaces.
 *
 * lastActiveAt is null when only session-tier data is available
 * (no device profile has been loaded or merged).
 */

import type { CustomerProfile } from "./CustomerProfile";
import type { CustomerSignal }  from "../signals/CustomerSignal";

export interface UnifiedCustomerProfile extends CustomerProfile {
  readonly tier:           "unified";
  readonly signals:        readonly CustomerSignal[];
  readonly recentlyViewed: readonly string[];
  readonly savedSlugs:     readonly string[];
  readonly lastQuizSlugs:  readonly string[];
  readonly lastActiveAt:   number | null;
}

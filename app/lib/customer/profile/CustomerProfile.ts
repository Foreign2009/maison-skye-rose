/**
 * Customer Intelligence — Customer Profile (base)
 *
 * Shared foundation for all three profile tiers.
 * Tier subtypes extend this with tier-specific fields and a discriminant.
 *
 * Integration points:
 *   SessionProfile        — session tier
 *   DeviceProfile         — device tier
 *   UnifiedCustomerProfile — merged read model
 */

import type { ProfileIdentity } from "./ProfileIdentity";
import type { ProfileMetadata } from "./ProfileMetadata";

export interface CustomerProfile {
  readonly identity: ProfileIdentity;
  readonly metadata: ProfileMetadata;
}

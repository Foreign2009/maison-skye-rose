/**
 * Identity ↔ Product Bridge — Factory-Side Resolver
 *
 * Resolves Maison product associations for a given MIP identity.
 *
 * IMPORTANT: This resolver does NOT check identity eligibility.
 * Callers MUST first pass FactoryIdentityGate before invoking this resolver.
 * Mapping existence does not imply eligibility — identity status can change
 * independently of the bridge. The gate and the bridge are separate concerns:
 *   FactoryIdentityGate  → "Is this identity currently eligible?"
 *   IdentityProductResolver → "Does this identity have Maison products?"
 *
 * Returns resolved: false with reason "no-mapping" when the identity is valid
 * but has no associated Maison products. This is a correct institutional state,
 * not an error — most verified identities have no Maison product yet.
 *
 * Imports ONLY from:
 *   app/lib/identity/productMapping
 *   app/lib/identity/types
 */

import type { IdentityId }        from "../../../app/lib/identity/types";
import { isValidIdentityId }       from "../../../app/lib/identity/types";
import { getMappingsForIdentity }  from "../../../app/lib/identity/productMapping";

// ── Types ──────────────────────────────────────────────────────────────────────

export type IdentityProductResolution =
  | {
      readonly resolved: true;
      readonly mappings: readonly {
        readonly maisonSlug: string;
        readonly collection: "Skye" | "Rose" | "Elite";
      }[];
    }
  | {
      readonly resolved: false;
      readonly reason: "invalid-identity-id" | "no-mapping";
    };

// ── Resolver ───────────────────────────────────────────────────────────────────

export function resolveIdentityProduct(identityId: IdentityId): IdentityProductResolution {
  if (!isValidIdentityId(identityId)) {
    return { resolved: false, reason: "invalid-identity-id" };
  }
  const mappings = getMappingsForIdentity(identityId);
  if (mappings.length === 0) {
    return { resolved: false, reason: "no-mapping" };
  }
  return {
    resolved: true,
    mappings: mappings.map(m => ({ maisonSlug: m.maisonSlug, collection: m.collection })),
  };
}

/**
 * Customer Intelligence — Profile Identity
 *
 * All identity fields are optional so the interface is shared across
 * all three tiers. Each tier subtype narrows the mandatory field:
 *   SessionProfile  — sessionId is always present
 *   DeviceProfile   — deviceId is always present
 *   Unified         — carries whichever identifiers are available
 *
 * Validation enforces that at least one field is populated.
 */

export interface ProfileIdentity {
  readonly sessionId?:  string;
  readonly deviceId?:   string;
  /** Reserved for Phase 4 — authenticated Supabase customers. */
  readonly accountId?:  string;
}

export function generateId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

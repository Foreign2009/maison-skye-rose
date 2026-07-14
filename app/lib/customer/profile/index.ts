/**
 * Customer Intelligence — Profile Public Surface
 *
 * Single import point for all Customer Profile consumers.
 *
 * Types:
 *   CustomerProfile          — base interface (identity + metadata)
 *   SessionProfile           — session tier; in-memory, tab-scoped
 *   DeviceProfile            — device tier; cross-session, storage-backed
 *   UnifiedCustomerProfile   — merged read model
 *   ProfileIdentity          — shared identity (sessionId / deviceId / accountId)
 *   ProfileMetadata          — version + timestamps
 *   ProfileVersion           — numeric literal version type
 *   ProfileValidationResult  — validator output
 *   ProfileValidationError   — single validation failure
 *   ProfileStorage           — storage contract interface
 *   CustomerProfileManager   — manager interface
 *
 * Constants:
 *   CURRENT_PROFILE_VERSION
 *
 * Functions:
 *   generateId               — UUID v4 with fallback
 *   createProfileMetadata    — metadata factory
 *   touchMetadata            — update updatedAt timestamp
 *   createSessionProfile     — session factory
 *   addSignalToSession       — immutable signal append
 *   createDeviceProfile      — device factory
 *   addSignalToDevice        — immutable signal append
 *   addRecentlyViewed        — newest-first slug list, capped at 50
 *   toggleSavedSlug          — add or remove from saved slugs
 *   setLastQuizSlugs         — record latest quiz result slugs
 *   mergeSessionToDevice     — merge session signals into device
 *   mergeDeviceToUnified     — compose unified read model from device
 *   validateProfile          — structured validation, no exceptions
 *   serializeDeviceProfile   — JSON serialization
 *   deserializeDeviceProfile — JSON deserialization + validation
 *   createNullStorage        — no-op ProfileStorage safe default
 *   createProfileManager     — manager factory
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type { CustomerProfile }          from "./CustomerProfile";
export type { SessionProfile }           from "./SessionProfile";
export type { DeviceProfile }            from "./DeviceProfile";
export type { UnifiedCustomerProfile }   from "./UnifiedCustomerProfile";
export type { ProfileIdentity }          from "./ProfileIdentity";
export type { ProfileMetadata }          from "./ProfileMetadata";
export type { ProfileVersion }           from "./ProfileVersion";
export type { ProfileValidationResult, ProfileValidationError } from "./ProfileValidator";
export type { ProfileStorage, CustomerProfileManager }          from "./CustomerProfileManager";

// ── Constants ─────────────────────────────────────────────────────────────────

export { CURRENT_PROFILE_VERSION }       from "./ProfileVersion";

// ── Functions ─────────────────────────────────────────────────────────────────

export { generateId }                    from "./ProfileIdentity";
export { createProfileMetadata, touchMetadata } from "./ProfileMetadata";
export { createSessionProfile, addSignalToSession } from "./SessionProfile";
export {
  createDeviceProfile,
  addSignalToDevice,
  addRecentlyViewed,
  toggleSavedSlug,
  setLastQuizSlugs,
}                                        from "./DeviceProfile";
export { mergeSessionToDevice, mergeDeviceToUnified } from "./ProfileMerge";
export { validateProfile }               from "./ProfileValidator";
export { serializeDeviceProfile, deserializeDeviceProfile } from "./ProfileSerializer";
export { createNullStorage, createProfileManager }          from "./CustomerProfileManager";

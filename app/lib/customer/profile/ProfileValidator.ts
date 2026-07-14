/**
 * Customer Intelligence — Profile Validator
 *
 * Validates any profile object against the canonical schema.
 * Returns structured results — never throws for normal validation failures.
 *
 * Use at deserialization boundaries (localStorage reads, postMessage, API).
 * Profiles created by factory functions are structurally valid by construction.
 */

import { CURRENT_PROFILE_VERSION } from "./ProfileVersion";

export interface ProfileValidationResult {
  readonly valid:  boolean;
  readonly errors: readonly ProfileValidationError[];
}

export interface ProfileValidationError {
  readonly field:   string;
  readonly message: string;
}

const VALID_TIERS = ["session", "device", "unified"] as const;

export function validateProfile(profile: unknown): ProfileValidationResult {
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
    return {
      valid:  false,
      errors: [{ field: "profile", message: "Profile must be a non-null, non-array object" }],
    };
  }

  const errors: ProfileValidationError[] = [];
  const p = profile as Record<string, unknown>;

  // tier
  if (!VALID_TIERS.includes(p.tier as never)) {
    errors.push({
      field:   "tier",
      message: `tier must be one of: ${VALID_TIERS.join(", ")}; found ${String(p.tier)}`,
    });
  }

  // identity
  if (!p.identity || typeof p.identity !== "object" || Array.isArray(p.identity)) {
    errors.push({ field: "identity", message: "identity must be a non-null, non-array object" });
  } else {
    const id = p.identity as Record<string, unknown>;
    const hasAnyId =
      typeof id.sessionId === "string" ||
      typeof id.deviceId  === "string" ||
      typeof id.accountId === "string";

    if (!hasAnyId) {
      errors.push({
        field:   "identity",
        message: "identity must have at least one of: sessionId, deviceId, accountId",
      });
    }

    for (const field of ["sessionId", "deviceId", "accountId"] as const) {
      if (id[field] !== undefined && typeof id[field] !== "string") {
        errors.push({
          field:   `identity.${field}`,
          message: `${field} must be a string when present`,
        });
      }
    }
  }

  // metadata
  if (!p.metadata || typeof p.metadata !== "object" || Array.isArray(p.metadata)) {
    errors.push({ field: "metadata", message: "metadata must be a non-null, non-array object" });
  } else {
    const m = p.metadata as Record<string, unknown>;

    if (m.version !== CURRENT_PROFILE_VERSION) {
      errors.push({
        field:   "metadata.version",
        message: `version must be ${CURRENT_PROFILE_VERSION}; found ${String(m.version)}`,
      });
    }

    for (const field of ["createdAt", "updatedAt"] as const) {
      const v = m[field];
      if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) {
        errors.push({
          field:   `metadata.${field}`,
          message: `${field} must be a positive finite Unix millisecond value`,
        });
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

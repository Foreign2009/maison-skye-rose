/**
 * Maison Identity Platform — Identity Record Validator
 *
 * Lifecycle-aware validation for IdentityRecord values.
 *
 * Validation is severity-based and lifecycle-sensitive:
 *   - Some rules produce errors for any status (e.g., invalid ID format).
 *   - Some rules produce errors only for specific statuses
 *     (e.g., missing canonicalBrand → error for "verified", warning for "candidate").
 *   - Confidence is validated on its own numeric contract (0–100),
 *     independently of lifecycle status.
 *
 * Confidence and status are intentionally independent:
 *   confidence 95 + status "disputed"  → valid
 *   confidence 60 + status "verified"  → valid
 *   confidence 101                     → always invalid
 */

import type { IdentityRecord } from "./types";
import { isValidIdentityId }   from "./types";

// ── Public types ──────────────────────────────────────────────────────────────

export type IdentityValidationStatus = "PASS" | "PASS_WITH_WARNINGS" | "FAIL";

export type IdentityValidationIssue = {
  readonly code:     string;
  readonly field:    string;
  readonly message:  string;
  readonly severity: "error" | "warning";
};

export type IdentityValidationResult = {
  readonly id:       string;
  readonly status:   IdentityValidationStatus;
  readonly errors:   readonly IdentityValidationIssue[];
  readonly warnings: readonly IdentityValidationIssue[];
};

// ── Issue builders ────────────────────────────────────────────────────────────

function e(code: string, field: string, message: string): IdentityValidationIssue {
  return { code, field, message, severity: "error" };
}

function w(code: string, field: string, message: string): IdentityValidationIssue {
  return { code, field, message, severity: "warning" };
}

// ── Validators ────────────────────────────────────────────────────────────────

function checkId(record: IdentityRecord): IdentityValidationIssue[] {
  const issues: IdentityValidationIssue[] = [];
  if (!record.id || !record.id.trim()) {
    issues.push(e("MIP_ID_EMPTY", "id", "identity id is required"));
  } else if (!isValidIdentityId(record.id)) {
    issues.push(e("MIP_ID_FORMAT", "id",
      `identity id "${record.id}" does not match required format MIP-NNNNNN`));
  }
  return issues;
}

function checkCanonicalIdentity(record: IdentityRecord): IdentityValidationIssue[] {
  const issues: IdentityValidationIssue[] = [];
  const ci = record.canonicalIdentity;

  if (!ci.canonicalName?.trim()) {
    issues.push(e("CANONICAL_NAME_EMPTY", "canonicalIdentity.canonicalName",
      "canonicalName is required on all identity records"));
  }

  // Lifecycle-sensitive: canonicalBrand is required for verified records.
  // For candidates and pending-review it produces a warning (may be incomplete).
  if (!ci.canonicalBrand?.trim()) {
    if (record.status === "verified") {
      issues.push(e("CANONICAL_BRAND_REQUIRED_FOR_VERIFIED",
        "canonicalIdentity.canonicalBrand",
        `canonicalBrand is required when status is "verified"`));
    } else if (record.status === "candidate" || record.status === "pending-review") {
      issues.push(w("CANONICAL_BRAND_MISSING",
        "canonicalIdentity.canonicalBrand",
        `canonicalBrand is not set — acceptable for "${record.status}" but required before verification`));
    }
    // disputed / deprecated / rejected: no brand warning (record is past active use)
  }

  if (ci.launchYear !== undefined) {
    const year = ci.launchYear;
    if (!Number.isInteger(year) || year < 1900 || year > new Date().getFullYear() + 2) {
      issues.push(e("LAUNCH_YEAR_INVALID", "canonicalIdentity.launchYear",
        `launchYear ${year} is not a plausible value`));
    }
  }

  return issues;
}

function checkConfidence(record: IdentityRecord): IdentityValidationIssue[] {
  const issues: IdentityValidationIssue[] = [];
  const { score, basis } = record.confidence;

  if (typeof score !== "number" || !Number.isFinite(score)) {
    issues.push(e("CONFIDENCE_NOT_NUMBER", "confidence.score",
      "confidence.score must be a finite number"));
  } else if (score < 0) {
    issues.push(e("CONFIDENCE_BELOW_ZERO", "confidence.score",
      `confidence.score ${score} is below the minimum of 0`));
  } else if (score > 100) {
    issues.push(e("CONFIDENCE_ABOVE_HUNDRED", "confidence.score",
      `confidence.score ${score} exceeds the maximum of 100`));
  }

  if (!basis?.trim()) {
    issues.push(e("CONFIDENCE_BASIS_EMPTY", "confidence.basis",
      "confidence.basis is required — explain the score"));
  }

  return issues;
}

function checkSupplierIdentities(record: IdentityRecord): IdentityValidationIssue[] {
  const issues: IdentityValidationIssue[] = [];

  for (let i = 0; i < record.supplierIdentities.length; i++) {
    const si = record.supplierIdentities[i];
    if (!si.supplierName?.trim()) {
      issues.push(e("SUPPLIER_NAME_EMPTY", `supplierIdentities[${i}].supplierName`,
        `supplier identity at index ${i} has an empty supplierName — must be preserved exactly`));
    }
  }

  return issues;
}

function checkAliases(record: IdentityRecord): IdentityValidationIssue[] {
  const issues: IdentityValidationIssue[] = [];
  const seenValues = new Set<string>();

  for (let i = 0; i < record.aliases.length; i++) {
    const alias = record.aliases[i];

    if (!alias.value?.trim()) {
      issues.push(e("ALIAS_VALUE_EMPTY", `aliases[${i}].value`,
        `alias at index ${i} has an empty value`));
      continue;
    }

    // Detect duplicate alias values within the same record (exact match, case-insensitive)
    const lower = alias.value.trim().toLowerCase();
    if (seenValues.has(lower)) {
      issues.push(e("ALIAS_DUPLICATE_WITHIN_RECORD", `aliases[${i}].value`,
        `alias value "${alias.value}" appears more than once in this record`));
    }
    seenValues.add(lower);
  }

  return issues;
}

function checkEvidence(record: IdentityRecord): IdentityValidationIssue[] {
  const issues: IdentityValidationIssue[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < record.evidence.length; i++) {
    const ev = record.evidence[i];

    if (!ev.evidenceId?.trim()) {
      issues.push(e("EVIDENCE_ID_EMPTY", `evidence[${i}].evidenceId`,
        `evidence at index ${i} has an empty evidenceId`));
    } else if (seenIds.has(ev.evidenceId)) {
      issues.push(e("EVIDENCE_ID_DUPLICATE", `evidence[${i}].evidenceId`,
        `evidenceId "${ev.evidenceId}" appears more than once in this record`));
    } else {
      seenIds.add(ev.evidenceId);
    }

    if (!ev.sourceName?.trim()) {
      issues.push(e("EVIDENCE_SOURCE_NAME_EMPTY", `evidence[${i}].sourceName`,
        `evidence "${ev.evidenceId || i}" has an empty sourceName`));
    }

    if (ev.confidenceContribution !== undefined) {
      const cc = ev.confidenceContribution;
      if (typeof cc !== "number" || cc < 0 || cc > 100) {
        issues.push(e("EVIDENCE_CONFIDENCE_CONTRIBUTION_INVALID",
          `evidence[${i}].confidenceContribution`,
          `confidenceContribution ${cc} must be a number between 0 and 100`));
      }
    }
  }

  return issues;
}

function checkHistory(record: IdentityRecord): IdentityValidationIssue[] {
  const issues: IdentityValidationIssue[] = [];

  for (let i = 0; i < record.history.length; i++) {
    const entry = record.history[i];

    if (!entry.timestamp?.trim()) {
      issues.push(e("HISTORY_TIMESTAMP_EMPTY", `history[${i}].timestamp`,
        `history entry at index ${i} has an empty timestamp`));
    } else {
      // Validate that the timestamp string can be parsed as a date
      const parsed = new Date(entry.timestamp);
      if (isNaN(parsed.getTime())) {
        issues.push(e("HISTORY_TIMESTAMP_INVALID", `history[${i}].timestamp`,
          `history entry at index ${i} has an unparseable timestamp: "${entry.timestamp}"`));
      }
    }

    if (!entry.summary?.trim()) {
      issues.push(e("HISTORY_SUMMARY_EMPTY", `history[${i}].summary`,
        `history entry at index ${i} has an empty summary`));
    }
  }

  return issues;
}

function checkTimestamps(record: IdentityRecord): IdentityValidationIssue[] {
  const issues: IdentityValidationIssue[] = [];

  if (!record.createdAt?.trim()) {
    issues.push(e("CREATED_AT_EMPTY", "createdAt", "createdAt is required"));
  } else if (isNaN(new Date(record.createdAt).getTime())) {
    issues.push(e("CREATED_AT_INVALID", "createdAt",
      `createdAt "${record.createdAt}" is not a valid ISO 8601 timestamp`));
  }

  if (!record.updatedAt?.trim()) {
    issues.push(e("UPDATED_AT_EMPTY", "updatedAt", "updatedAt is required"));
  } else if (isNaN(new Date(record.updatedAt).getTime())) {
    issues.push(e("UPDATED_AT_INVALID", "updatedAt",
      `updatedAt "${record.updatedAt}" is not a valid ISO 8601 timestamp`));
  }

  return issues;
}

// ── Status helpers ────────────────────────────────────────────────────────────

function computeStatus(
  errors: readonly IdentityValidationIssue[],
  warnings: readonly IdentityValidationIssue[],
): IdentityValidationStatus {
  if (errors.length > 0)   return "FAIL";
  if (warnings.length > 0) return "PASS_WITH_WARNINGS";
  return "PASS";
}

// ── Public API ────────────────────────────────────────────────────────────────

export function validateIdentityRecord(record: IdentityRecord): IdentityValidationResult {
  const allIssues: IdentityValidationIssue[] = [
    ...checkId(record),
    ...checkCanonicalIdentity(record),
    ...checkConfidence(record),
    ...checkSupplierIdentities(record),
    ...checkAliases(record),
    ...checkEvidence(record),
    ...checkHistory(record),
    ...checkTimestamps(record),
  ];

  const errors   = allIssues.filter(i => i.severity === "error");
  const warnings = allIssues.filter(i => i.severity === "warning");

  return {
    id:     record.id,
    status: computeStatus(errors, warnings),
    errors,
    warnings,
  };
}

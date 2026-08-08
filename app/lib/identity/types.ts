/**
 * Maison Identity Platform — Domain Types
 *
 * The Identity Platform answers: "What is this?" before the Knowledge Platform
 * attempts to answer: "What should Maison Skye & Rose know and teach about it?"
 *
 * Domain boundaries:
 *   SupplierIdentity   — what a source supplier calls a product (evidence, not truth)
 *   CanonicalIdentity  — the institution's verified understanding of the external identity
 *   IdentityRecord     — the composite institutional record
 *   Maison product     — downstream: how Maison Skye & Rose represents the product (NOT here)
 *
 * These three levels must never be collapsed. A supplier name, a canonical name, and a
 * Maison product name may all differ and are each valid at their own level.
 *
 * Constitutional foundation:
 *   Article VII  — Knowledge precedes intelligence. Truth precedes automation.
 *   Article VIII — Technology serves people, not the other way around.
 *   Article IX   — Auditable, traceable, durable.
 */

import type { ProductCategory } from "../mkc/types";

// ── Re-export ProductCategory so identity consumers need only one import ────────
export type { ProductCategory };

// ── Identity ID ───────────────────────────────────────────────────────────────

/**
 * Stable identity identifier. Format: MIP-NNNNNN (e.g., MIP-000001).
 *
 * The ID is intentionally opaque — it does not encode the canonical name.
 * Names, brands, and aliases can all change. The ID must not.
 *
 * Validate with: isValidIdentityId(id)
 */
export type IdentityId = string;

/** Validates the MIP-NNNNNN format. Exactly 6 decimal digits after the prefix. */
export function isValidIdentityId(id: string): boolean {
  return /^MIP-\d{6}$/.test(id);
}

// ── Identity lifecycle status ─────────────────────────────────────────────────

/**
 * Six-state lifecycle for an identity record.
 *
 * State machine:
 *   candidate     → pending-review → verified
 *   verified      → disputed       → verified (re-verified after resolution)
 *   verified      → deprecated
 *   disputed      → deprecated
 *   disputed      → rejected
 *   any           → rejected       (if found to be a non-entity)
 *
 * Confidence score and status are INDEPENDENT. A verified record may have
 * confidence 70; a candidate may have confidence 90 based on strong supplier
 * evidence. Status reflects editorial lifecycle; confidence reflects
 * information completeness.
 */
export type IdentityStatus =
  | "candidate"       // incomplete; canonicalBrand may be absent; not yet reviewed
  | "pending-review"  // submitted for editorial review; awaiting decision
  | "verified"        // editorial confirmed; canonicalBrand required
  | "disputed"        // contested (supplier conflict, research inconsistency)
  | "deprecated"      // superseded by another identity (merger, correction)
  | "rejected";       // does not represent a real or distinguishable external identity

// ── Supplier identity ─────────────────────────────────────────────────────────

/**
 * What a source supplier calls a product.
 *
 * This is evidence, not canonical truth. The supplier name must be preserved
 * exactly as received. Do not correct spelling, normalise case, or apply
 * editorial interpretation here — that belongs to CanonicalIdentity.
 *
 * supplierCategory preserves supplier group labels (e.g., "L", "M", "UNISEX")
 * exactly. These are NOT automatically mapped to canonical gender or category;
 * that mapping belongs to future resolution/editorial logic.
 */
export type SupplierIdentity = {
  readonly supplierName:     string;   // Exact supplier name — never modified
  readonly supplierCategory?: string;  // Supplier group label, preserved verbatim
  readonly supplierCode?:    string;   // Supplier product code if provided
  readonly supplierBrand?:   string;   // Explicit brand name from supplier, if present
  readonly supplierId?:      string;   // Supplier system ID (future multi-supplier)
  readonly sourceReference?: string;  // e.g., "supplier-catalogue-2026.pdf p.12"
};

// ── Canonical identity ────────────────────────────────────────────────────────

/**
 * Marketed gender as understood by the original brand/house.
 * Not derived from supplier category automatically.
 */
export type MarketedGender = "female" | "male" | "unisex" | "shared";

/**
 * The institution's current verified understanding of the external identity.
 *
 * canonicalBrand is optional because candidates may be incomplete. However,
 * a record with status "verified" requires canonicalBrand — this is enforced
 * by validateIdentityRecord(), not the type system, to allow gradual discovery.
 *
 * category is the authoritative location for ProductCategory on an identity.
 * IdentityRecord does not duplicate this field.
 */
export type CanonicalIdentity = {
  readonly canonicalName:    string;           // Required always
  readonly canonicalBrand?:  string;           // Required when status = "verified"
  readonly launchYear?:      number;           // Optional; do not require
  readonly marketedGender?:  MarketedGender;  // Optional; not derived from supplier
  readonly category:         ProductCategory; // Single authoritative location
};

// ── Alias model ───────────────────────────────────────────────────────────────

/**
 * What kind of alias this is. Governs how the alias was created and how
 * it should be interpreted during search/resolution.
 */
export type AliasType =
  | "supplier"    // name used in a supplier catalogue or invoice
  | "common"      // commonly used shorthand (e.g., "Baccarat Rouge" for "Baccarat Rouge 540")
  | "historical"  // former official name before a rebrand or reformulation
  | "regional"    // name used in a specific market or language region
  | "editorial"   // name used in Maison editorial or marketing copy
  | "search";     // search-optimised variant for discovery

/**
 * A known alternative name for an identity.
 *
 * The original value is NEVER destroyed. If a normalised lookup form is needed
 * for registry indexing, it is computed at register time and held only in memory.
 * Do not persist a separate normalizedValue field — compute it from value.
 */
export type IdentityAlias = {
  readonly value:     string;     // Display/source form — never modified
  readonly type:      AliasType;
  readonly source?:   string;     // Who/what contributed this alias
  readonly createdAt?: string;    // ISO 8601
  readonly verified?: boolean;    // Editorially confirmed?
};

// ── Evidence model ────────────────────────────────────────────────────────────

/**
 * Source type for identity evidence. Named for durability — "research" is
 * more durable than "gemini"; the specific system can be recorded in
 * sourceName or notes without coupling the type to a vendor.
 */
export type EvidenceSourceType =
  | "supplier-catalogue"  // from a supplier price list, catalogue, or invoice
  | "official-brand"      // from brand's own website, press kit, or official record
  | "research"            // from research activity (AI, web, publication)
  | "editorial"           // from Maison editorial or curation decision
  | "founder"             // from founder knowledge or directive
  | "historical-record"   // from historical publication, archive, or discontinued source
  | "other";              // any other source; describe in notes

/**
 * An auditable record of why an identity claim is believed.
 *
 * Every important identity decision must eventually be explainable.
 * Evidence does not require external URLs — a supplier PDF, a local
 * document, or a founder decision are all valid source references.
 *
 * evidenceId must be unique within a single IdentityRecord's evidence list.
 */
export type IdentityEvidence = {
  readonly evidenceId:               string;              // Unique within record
  readonly type:                     EvidenceSourceType;
  readonly sourceName:               string;              // e.g., "Supplier Catalogue 2026"
  readonly sourceReference?:         string;              // e.g., "page 12", file path
  readonly observedValue?:           string;              // What was directly observed
  readonly notes?:                   string;
  readonly createdAt?:               string;              // ISO 8601
  readonly confidenceContribution?:  number;              // Hint for EP5-P2 scorer (0–100)
};

// ── Confidence model ──────────────────────────────────────────────────────────

/**
 * How confident the institution is in this identity record.
 *
 * Score range: 0–100 inclusive. Validated by validateIdentityRecord().
 * Confidence is NOT the same as verification status:
 *   - A record can have score 95 and status "disputed".
 *   - A record can have score 60 and status "verified" after editorial review.
 *   - score 100 does NOT automatically grant status "verified".
 *   - status "verified" does NOT require score 100.
 *
 * No automatic confidence scoring engine in EP5-P1.
 * The basis field documents the human or system reasoning for the current score.
 */
export type IdentityConfidence = {
  readonly score:            number;   // 0–100 inclusive
  readonly basis:            string;   // Human-readable explanation
  readonly lastEvaluatedAt?: string;   // ISO 8601
};

// ── Identity history ──────────────────────────────────────────────────────────

/**
 * Types of events that can appear in an identity's history.
 * "merged" and "split" are included as placeholders for type completeness —
 * their behaviour is NOT implemented in EP5-P1.
 */
export type IdentityHistoryEventType =
  | "created"
  | "canonical-name-changed"
  | "brand-changed"
  | "alias-added"
  | "alias-removed"
  | "evidence-added"
  | "confidence-updated"
  | "verified"
  | "disputed"
  | "deprecated"
  | "rejected"            // EP5-P3B: identity rejected as non-entity or unresolvable
  | "candidate-promoted"  // EP5-P3B: candidate elevated to pending-review
  | "candidate-demoted"   // EP5-P3B: pending-review returned to candidate
  | "merged"   // placeholder — behaviour deferred to future episode
  | "split";   // placeholder — behaviour deferred to future episode

/**
 * A single auditable entry in an identity's history.
 *
 * History is append-oriented. Entries are never rewritten through normal
 * registry operations. previousValue / nextValue are JSON-serialised strings
 * to avoid any / unknown payloads while retaining flexibility for EP5-P2.
 */
export type IdentityHistoryEntry = {
  readonly timestamp:      string;                     // ISO 8601
  readonly event:          IdentityHistoryEventType;
  readonly summary:        string;                     // Human-readable description
  readonly actor?:         string;                     // Who/what made the change
  readonly previousValue?: string;                     // JSON-serialised previous state
  readonly nextValue?:     string;                     // JSON-serialised next state
};

// ── Identity record ───────────────────────────────────────────────────────────

/**
 * The composite institutional identity record.
 *
 * An identity can hold multiple supplier identities (the same canonical
 * fragrance may appear in several supplier catalogues under different names).
 *
 * ProductCategory lives exclusively in canonicalIdentity.category — it is NOT
 * duplicated as a top-level field on IdentityRecord. Access via:
 *   record.canonicalIdentity.category
 *
 * Maison product identity (MKC knowledge records, slugs, editorial copy) is
 * intentionally NOT part of this type. A future integration will reference
 * identityId from MKC records; the inverse is not part of EP5-P1.
 */
export type IdentityRecord = {
  readonly id:                  IdentityId;
  readonly supplierIdentities:  readonly SupplierIdentity[];
  readonly canonicalIdentity:   CanonicalIdentity;
  readonly aliases:             readonly IdentityAlias[];
  readonly evidence:            readonly IdentityEvidence[];
  readonly confidence:          IdentityConfidence;
  readonly status:              IdentityStatus;
  readonly history:             readonly IdentityHistoryEntry[];
  readonly createdAt:           string;    // ISO 8601
  readonly updatedAt:           string;    // ISO 8601
};

// ── Error types ───────────────────────────────────────────────────────────────

/**
 * Thrown when the same normalized alias value already maps to a different
 * identity in the registry. Silent resolution to the first match is
 * explicitly forbidden — every alias collision must surface.
 */
export class IdentityAliasCollisionError extends Error {
  constructor(
    public readonly normalizedAlias: string,
    public readonly existingId: IdentityId,
    public readonly incomingId: IdentityId,
  ) {
    super(
      `Alias collision: normalized alias "${normalizedAlias}" already maps to identity ` +
      `"${existingId}" — cannot also map to "${incomingId}". ` +
      `Resolve the ambiguity before registering.`,
    );
    this.name = "IdentityAliasCollisionError";
  }
}

/**
 * Thrown when a duplicate identity ID is registered.
 */
export class IdentityDuplicateIdError extends Error {
  constructor(public readonly id: IdentityId) {
    super(`Identity ID "${id}" is already registered.`);
    this.name = "IdentityDuplicateIdError";
  }
}

/**
 * Thrown when a duplicate canonical identity is registered.
 * Invariant: normalized(brand) + "::" + normalized(name) + "::" + category.
 * Only enforced when canonicalBrand is present.
 */
export class IdentityDuplicateCanonicalError extends Error {
  constructor(
    public readonly canonicalKey: string,
    public readonly existingId: IdentityId,
    public readonly incomingId: IdentityId,
  ) {
    super(
      `Canonical identity duplicate: key "${canonicalKey}" already registered as ` +
      `"${existingId}" — cannot also register as "${incomingId}".`,
    );
    this.name = "IdentityDuplicateCanonicalError";
  }
}

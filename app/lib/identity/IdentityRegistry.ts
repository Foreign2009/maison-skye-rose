/**
 * Maison Identity Platform — Identity Registry
 *
 * In-memory registry for IdentityRecord values.
 *
 * Duplicate protection:
 *   1. Duplicate identity ID → IdentityDuplicateIdError (always)
 *   2. Duplicate canonical identity → IdentityDuplicateCanonicalError
 *      Invariant: normalized(canonicalBrand) + "::" + normalized(canonicalName) + "::" + category
 *      Only enforced when canonicalBrand is present. Incomplete candidates
 *      (no brand) may share name/category without being confirmed duplicates.
 *   3. Alias collision across identities → IdentityAliasCollisionError
 *      Never resolved silently. A normalized alias can map to exactly one identity.
 *
 * Alias lookup semantics:
 *   findByAlias() returns the matching IdentityRecord or null.
 *   If a collision was introduced at registration, it was already rejected —
 *   so findByAlias() always has an unambiguous answer.
 *
 * EP5-P1 mutation surface:
 *   register()       — required
 *   appendHistory()  — deterministic, append-only, validates entry
 *   addAlias()       — deterministic, validates alias before adding
 *   addEvidence()    — deterministic, validates evidence before adding
 *
 * NOT implemented:
 *   resolve(), fuzzy matching, merge, split, candidate scoring,
 *   automatic alias learning, supplier synchronization.
 */

import type {
  IdentityId,
  IdentityRecord,
  IdentityAlias,
  IdentityEvidence,
  IdentityHistoryEntry,
} from "./types";

import {
  IdentityAliasCollisionError,
  IdentityDuplicateIdError,
  IdentityDuplicateCanonicalError,
} from "./types";

import { normalizeIdentityString, buildCanonicalKey } from "./normalizer";

// ── Registry ───────────────────────────────────────────────────────────────────

export class IdentityRegistry {

  // Primary index: id → record
  private readonly byId = new Map<IdentityId, IdentityRecord>();

  // Canonical duplicate guard: "brand::name::category" → id
  // Only populated when canonicalBrand is present.
  private readonly byCanonicalKey = new Map<string, IdentityId>();

  // Alias index: normalized alias value → id
  private readonly byAlias = new Map<string, IdentityId>();

  // ── Registration ────────────────────────────────────────────────────────────

  /**
   * Registers an IdentityRecord.
   *
   * Throws on:
   *   - Duplicate identity ID (IdentityDuplicateIdError)
   *   - Duplicate canonical identity when brand is present (IdentityDuplicateCanonicalError)
   *   - Alias collision with a different identity (IdentityAliasCollisionError)
   */
  register(record: IdentityRecord): this {
    this._guardDuplicateId(record.id);
    this._guardDuplicateCanonical(record);
    this._guardAliasCollisions(record);

    // All guards passed — commit to all indexes
    this.byId.set(record.id, record);
    this._indexCanonical(record);
    this._indexAliases(record);

    return this;
  }

  // ── Read APIs ───────────────────────────────────────────────────────────────

  getById(id: IdentityId): IdentityRecord | null {
    return this.byId.get(id) ?? null;
  }

  has(id: IdentityId): boolean {
    return this.byId.has(id);
  }

  list(): readonly IdentityRecord[] {
    return Array.from(this.byId.values());
  }

  /**
   * Finds an identity by canonical name (and optionally brand).
   * Uses normalized comparison — case and surrounding whitespace are ignored.
   * Returns null if not found.
   */
  findByCanonicalName(
    canonicalName: string,
    canonicalBrand?: string,
  ): IdentityRecord | null {
    const normalizedName = normalizeIdentityString(canonicalName);

    for (const record of this.byId.values()) {
      const ci = record.canonicalIdentity;
      const nameMatch = normalizeIdentityString(ci.canonicalName) === normalizedName;

      if (!nameMatch) continue;

      if (canonicalBrand !== undefined) {
        const brandMatch = ci.canonicalBrand !== undefined &&
          normalizeIdentityString(ci.canonicalBrand) === normalizeIdentityString(canonicalBrand);
        if (brandMatch) return record;
      } else {
        return record;
      }
    }

    return null;
  }

  /**
   * Finds an identity by alias value.
   * Uses normalized comparison. Returns null if no match.
   * Alias collisions are rejected at registration, so this never returns ambiguous results.
   */
  findByAlias(aliasValue: string): IdentityRecord | null {
    const normalized = normalizeIdentityString(aliasValue);
    const id = this.byAlias.get(normalized);
    if (id === undefined) return null;
    return this.byId.get(id) ?? null;
  }

  // ── Mutation APIs ────────────────────────────────────────────────────────────

  /**
   * Appends a history entry to an existing identity.
   * History is append-oriented; existing entries are never rewritten.
   * Throws if the identity does not exist.
   */
  appendHistory(id: IdentityId, entry: IdentityHistoryEntry): this {
    const record = this._requireById(id);

    if (!entry.timestamp?.trim()) {
      throw new Error(`appendHistory: timestamp is required`);
    }
    if (isNaN(new Date(entry.timestamp).getTime())) {
      throw new Error(`appendHistory: invalid timestamp "${entry.timestamp}"`);
    }
    if (!entry.summary?.trim()) {
      throw new Error(`appendHistory: summary is required`);
    }

    const updated: IdentityRecord = {
      ...record,
      history:   [...record.history, entry],
      updatedAt: new Date().toISOString(),
    };

    this.byId.set(id, updated);
    return this;
  }

  /**
   * Adds an alias to an existing identity.
   * Validates the alias and checks for collisions before indexing.
   * Throws if the identity does not exist or the alias collides with another identity.
   */
  addAlias(id: IdentityId, alias: IdentityAlias): this {
    const record = this._requireById(id);

    if (!alias.value?.trim()) {
      throw new Error(`addAlias: alias value is required`);
    }

    const normalized = normalizeIdentityString(alias.value);
    const existingId = this.byAlias.get(normalized);

    if (existingId !== undefined && existingId !== id) {
      throw new IdentityAliasCollisionError(normalized, existingId, id);
    }

    // Check for duplicate within the same record
    const alreadyOnRecord = record.aliases.some(
      a => normalizeIdentityString(a.value) === normalized,
    );
    if (alreadyOnRecord) {
      throw new Error(
        `addAlias: normalized alias "${normalized}" already exists on identity "${id}"`,
      );
    }

    const updated: IdentityRecord = {
      ...record,
      aliases:   [...record.aliases, alias],
      updatedAt: new Date().toISOString(),
    };

    this.byId.set(id, updated);
    this.byAlias.set(normalized, id);

    return this;
  }

  /**
   * Adds an evidence entry to an existing identity.
   * Validates evidenceId uniqueness within the record.
   * Throws if the identity does not exist or the evidenceId is a duplicate.
   */
  addEvidence(id: IdentityId, evidence: IdentityEvidence): this {
    const record = this._requireById(id);

    if (!evidence.evidenceId?.trim()) {
      throw new Error(`addEvidence: evidenceId is required`);
    }

    const duplicate = record.evidence.some(e => e.evidenceId === evidence.evidenceId);
    if (duplicate) {
      throw new Error(
        `addEvidence: evidenceId "${evidence.evidenceId}" already exists on identity "${id}"`,
      );
    }

    if (!evidence.sourceName?.trim()) {
      throw new Error(`addEvidence: sourceName is required`);
    }

    const updated: IdentityRecord = {
      ...record,
      evidence:  [...record.evidence, evidence],
      updatedAt: new Date().toISOString(),
    };

    this.byId.set(id, updated);
    return this;
  }

  // ── Private guards ───────────────────────────────────────────────────────────

  private _guardDuplicateId(id: IdentityId): void {
    if (this.byId.has(id)) {
      throw new IdentityDuplicateIdError(id);
    }
  }

  private _guardDuplicateCanonical(record: IdentityRecord): void {
    const { canonicalBrand, canonicalName, category } = record.canonicalIdentity;

    // Only enforce when canonicalBrand is present.
    // Incomplete candidates (no brand) are not treated as canonical duplicates.
    if (!canonicalBrand?.trim()) return;

    const key = buildCanonicalKey(canonicalBrand, canonicalName, category);
    const existingId = this.byCanonicalKey.get(key);

    if (existingId !== undefined) {
      throw new IdentityDuplicateCanonicalError(key, existingId, record.id);
    }
  }

  private _guardAliasCollisions(record: IdentityRecord): void {
    for (const alias of record.aliases) {
      if (!alias.value?.trim()) continue; // empty aliases caught by validator

      const normalized = normalizeIdentityString(alias.value);
      const existingId = this.byAlias.get(normalized);

      if (existingId !== undefined && existingId !== record.id) {
        throw new IdentityAliasCollisionError(normalized, existingId, record.id);
      }
    }
  }

  // ── Private indexers ─────────────────────────────────────────────────────────

  private _indexCanonical(record: IdentityRecord): void {
    const { canonicalBrand, canonicalName, category } = record.canonicalIdentity;
    if (!canonicalBrand?.trim()) return;

    const key = buildCanonicalKey(canonicalBrand, canonicalName, category);
    this.byCanonicalKey.set(key, record.id);
  }

  private _indexAliases(record: IdentityRecord): void {
    for (const alias of record.aliases) {
      if (!alias.value?.trim()) continue;
      const normalized = normalizeIdentityString(alias.value);
      this.byAlias.set(normalized, record.id);
    }
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private _requireById(id: IdentityId): IdentityRecord {
    const record = this.byId.get(id);
    if (!record) {
      throw new Error(`IdentityRegistry: identity "${id}" not found`);
    }
    return record;
  }
}

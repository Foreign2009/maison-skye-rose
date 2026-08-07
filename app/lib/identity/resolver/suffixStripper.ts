/**
 * Maison Identity Platform — Attribution Suffix Stripper
 *
 * Strips non-identity-bearing attribution wording from supplier product names
 * so that the stripped form can be matched against canonical identity names.
 *
 * HARD CONSTRAINT: Only genuine attribution noise may be stripped.
 * The following are identity-defining and must NEVER be stripped:
 *
 *   Extrait, Le Parfum, Parfum, EDP, EDT, Elixir, Intense, Intensely,
 *   Extreme, Absolue, Blush, Gold, Noir, Victory, Carbon, Profondo,
 *   Exclusif, and any other product qualifier.
 *
 * "Baccarat Rouge 540 Extrait Inspired"
 *   → strip " Inspired" → "Baccarat Rouge 540 Extrait"
 *   → NOT strip " Extrait" (that would collapse a distinct flanker identity)
 *
 * FLANKER INTEGRITY IS A HARD INVARIANT.
 * Stripping a flanker qualifier collapses distinct identities — a data integrity failure.
 */

export type KnownSuffix = {
  readonly suffix:      string;    // Lowercase — matched case-insensitively
  readonly description: string;
};

/**
 * Registered attribution suffixes in priority order (longer first to prevent partial stripping).
 * Only supplier attribution phrasing — never concentration or flanker markers.
 */
const KNOWN_SUFFIXES: readonly KnownSuffix[] = [
  {
    suffix:      " inspired by",
    description: "Alternative attribution phrasing 'Inspired By'",
  },
  {
    suffix:      " inspired",
    description: "Standard Maison attribution suffix 'Inspired'",
  },
];

export type StripResult = {
  readonly stripped:      string;           // The name after stripping (or original if no suffix)
  readonly appliedSuffix: string | null;    // Which suffix was stripped; null if none matched
};

/**
 * Strips the first matching known suffix from a supplier name.
 * Matching is case-insensitive. Only one suffix is stripped per call.
 * The result is trimmed of trailing whitespace.
 *
 * Returns the original name with appliedSuffix === null if no suffix matches.
 */
export function strip(supplierName: string): StripResult {
  const lower = supplierName.toLowerCase();

  for (const ks of KNOWN_SUFFIXES) {
    if (lower.endsWith(ks.suffix)) {
      const stripped = supplierName.slice(0, supplierName.length - ks.suffix.length).trim();
      return { stripped, appliedSuffix: ks.suffix };
    }
  }

  return { stripped: supplierName, appliedSuffix: null };
}

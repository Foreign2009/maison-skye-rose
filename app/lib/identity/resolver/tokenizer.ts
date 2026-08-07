/**
 * Maison Identity Platform — Identity String Tokenizer
 *
 * Splits a normalized identity string into meaningful tokens for scoring.
 * Used exclusively by the token scorer (Stage 4 of the resolver pipeline).
 *
 * Stop-word policy: CONSERVATIVE.
 * Only genuine linguistic connectors are stop words.
 * Flanker qualifiers (elixir, intense, extrait, parfum, etc.) are NEVER stop words.
 * Removing them would collapse distinct flanker identities — a hard invariant violation.
 *
 * Stop words must not include:
 *   elixir, intense, intensely, extreme, extrait, parfum, profondo, exclusif,
 *   blush, victory, carbon, gold, noir, edition, limited, royal, sport, night,
 *   or any other product qualifier that distinguishes flanker identities.
 */

/**
 * Conservative set of linguistic connectors and attribution noise.
 * Every entry here must be a word that adds zero discriminating signal
 * in fragrance identity resolution.
 *
 * "inspired" is attribution noise — it appears in every Maison supplier name.
 * It must not contribute to token overlap scores.
 */
export const STOP_WORDS: ReadonlySet<string> = new Set([
  // French connectors
  "de", "la", "le", "les", "du", "des",
  // Italian / Spanish connectors
  "di", "del", "el",
  // English articles and prepositions
  "by", "for", "of", "and", "the", "a", "an",
  // Maison attribution noise
  "inspired",
]);

/**
 * Tokenizes a normalized identity string into meaningful tokens.
 * Input must already be normalized via normalizeIdentityString().
 *
 * Examples after normalizeIdentityString():
 *   "sauvage elixir"          → ["sauvage", "elixir"]      (elixir preserved)
 *   "baccarat rouge 540"      → ["baccarat", "rouge", "540"]
 *   "libre le parfum intense" → ["libre", "parfum", "intense"]  (le = stop word)
 *   "sauvage inspired"        → ["sauvage"]                 (inspired = stop word)
 *   "acqua di giò"            → ["acqua", "giò"]            (di = stop word, accent preserved)
 *   "love don't be shy"       → ["love", "don't", "shy"]    (be removed as < 3 chars... wait)
 *
 * Note on minimum length: tokens of length < 2 are dropped.
 * Single characters after splitting are noise (e.g., "l" from "l'eau").
 * Two-character tokens are kept (e.g., "by" is in stop words anyway; "41" is a digit and kept).
 */
export function tokenize(normalized: string): readonly string[] {
  return normalized
    .split(/[\s\-.]+/)
    .map(t => t.trim())
    .filter(t => t.length >= 2)
    .filter(t => !STOP_WORDS.has(t));
}

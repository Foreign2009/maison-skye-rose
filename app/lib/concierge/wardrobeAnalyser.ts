/**
 * Maison Concierge — Wardrobe Analyser (EP17-P3)
 *
 * Resolves customer-named fragrances to catalogue records and produces a
 * structured wardrobe analysis used by the context builder to guide the LLM.
 *
 * Design principles:
 * - Pure function — no I/O, no side effects, no stored state.
 * - Analysis is computed per-request and never persisted.
 * - Gap detection uses opportunity framing: strengths first, additions second.
 * - Customer intent always overrides wardrobe analysis (Refinement 1).
 * - Collections are classified with editorial language, not scores (Refinement 4).
 */

import { mkcCatalogue } from "../mkc/catalogue";
import type { FragranceKnowledge } from "../mkc/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WardrobeAnalysis {
  resolvedCount:     number;
  totalCount:        number;
  style:             string;            // Editorial classification (Refinement 4)
  characterCounts:   Record<string, number>;
  missingCharacters: string[];
  coveredOccasions:  string[];
  familyCoverage:    string[];
  strengths:         string;            // What the collection already does well
  opportunity:       string | null;     // What another fragrance would contribute
}

// ── Vocabulary ────────────────────────────────────────────────────────────────

const ALL_CHARACTERS = [
  "Fresh & Light",
  "Balanced Signature",
  "Rich & Long Wearing",
  "Deep & Intense",
] as const;

// Opportunity descriptions — positive framing only (Refinements 2 & 3)
const CHARACTER_OPPORTUNITY: Record<string, string> = {
  "Fresh & Light":
    "A fresh, light fragrance would add an effortless daytime dimension to the collection",
  "Balanced Signature":
    "A versatile everyday signature would anchor the collection for any occasion",
  "Rich & Long Wearing":
    "A richer, longer-wearing fragrance would open up the collection for evenings and occasions",
  "Deep & Intense":
    "A deep, intense fragrance would add a statement piece for the moments that call for it",
};

// Occasion groups — keywords matched against fragrance.occasions values
const OCCASION_GROUPS: Array<{ label: string; keywords: string[] }> = [
  { label: "Daily wear", keywords: ["daily", "everyday", "casual", "weekend"] },
  { label: "Office",     keywords: ["office", "work", "professional", "business"] },
  { label: "Evening",    keywords: ["evening", "date night", "night out", "dinner"] },
  { label: "Formal",     keywords: ["wedding", "formal", "gala", "black tie"] },
  { label: "Outdoor",    keywords: ["outdoor", "beach", "vacation", "holiday", "travel"] },
];

// ── Name resolution ───────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}

function resolveNames(names: string[]): FragranceKnowledge[] {
  const resolved: FragranceKnowledge[] = [];

  for (const name of names) {
    const lower = name.toLowerCase().trim();
    const slug  = slugify(name);

    // Level 1: exact case-insensitive name match
    let match: FragranceKnowledge | undefined =
      mkcCatalogue.find((k) => k.name.toLowerCase() === lower);

    // Level 2: slug match
    if (!match) match = mkcCatalogue.find((k) => k.slug === slug);

    // Level 3: partial containment — handles shortened names and variations
    if (!match) {
      match = mkcCatalogue.find(
        (k) =>
          k.name.toLowerCase().includes(lower) ||
          lower.includes(k.name.toLowerCase())
      );
    }

    // Deduplicate — same fragrance matched by multiple customer names
    if (match && !resolved.find((r) => r.slug === match!.slug)) {
      resolved.push(match);
    }
  }

  return resolved;
}

// ── Editorial classification (Refinement 4) ───────────────────────────────────

function classifyStyle(characterCounts: Record<string, number>): string {
  const present = new Set(
    Object.entries(characterCounts)
      .filter(([, n]) => n > 0)
      .map(([c]) => c)
  );
  const count = present.size;

  if (count === 0) return "Undiscovered";
  if (count >= 4)  return "Balanced";

  const hasFresh    = present.has("Fresh & Light");
  const hasBalanced = present.has("Balanced Signature");
  const hasRich     = present.has("Rich & Long Wearing");
  const hasDeep     = present.has("Deep & Intense");

  if (hasFresh && hasBalanced && !hasRich && !hasDeep)  return "Modern Classic";
  if (hasFresh && !hasBalanced && !hasRich && !hasDeep) return "Fresh-focused";
  if (!hasFresh && !hasBalanced && hasRich && hasDeep)  return "Warm & Rich";
  if (!hasFresh && !hasBalanced && (hasRich || hasDeep)) return "Evening-oriented";
  if (hasFresh && (hasRich || hasDeep))                 return "Well-rounded";
  if (hasBalanced && count === 1)                        return "Versatile";
  return "Diverse";
}

// ── Strength description (Refinement 2 — positive framing) ───────────────────

function describeStrengths(
  style:            string,
  coveredOccasions: string[]
): string {
  if (style === "Balanced") {
    return "A complete, well-rounded wardrobe — fresh, everyday, rich, and deep occasions are all covered.";
  }
  if (style === "Fresh-focused") {
    return "This collection excels at fresh, effortless everyday wear — clean, approachable, and endlessly versatile.";
  }
  if (style === "Evening-oriented" || style === "Warm & Rich") {
    return "This collection is built for presence and impact — rich, occasion-worthy fragrances that leave an impression.";
  }
  if (style === "Modern Classic") {
    return "This collection balances freshness with everyday versatility — a strong daytime and office foundation.";
  }
  if (style === "Versatile") {
    return "This collection anchors around a balanced everyday signature — adaptable and confident for any occasion.";
  }
  if (coveredOccasions.length > 0) {
    return `This collection is especially strong for ${coveredOccasions.join(", ").toLowerCase()}.`;
  }
  return "This collection has a clear, cohesive character.";
}

// ── Opportunity description (Refinement 3 — never deficiency language) ────────

function describeOpportunity(
  style:            string,
  missingChars:     string[],
  coveredOccasions: string[]
): string | null {
  if (style === "Balanced") return null;

  // Determine the highest-value missing character given the collection's style
  const priorityOrder: string[] = [];

  if (style === "Fresh-focused" || style === "Modern Classic") {
    // Fresh/daytime collections grow toward evening depth
    priorityOrder.push("Rich & Long Wearing", "Deep & Intense", "Balanced Signature");
  } else if (style === "Evening-oriented" || style === "Warm & Rich") {
    // Evening collections grow toward daytime versatility
    priorityOrder.push("Fresh & Light", "Balanced Signature");
  } else {
    // General case — follow the character progression order
    priorityOrder.push(...ALL_CHARACTERS.filter((c) => missingChars.includes(c)));
  }

  const topMissing = priorityOrder.find((c) => missingChars.includes(c));
  if (topMissing) return CHARACTER_OPPORTUNITY[topMissing];

  // Occasion fallback — if evening is uncovered
  if (!coveredOccasions.includes("Evening")) {
    return CHARACTER_OPPORTUNITY["Rich & Long Wearing"];
  }

  return null;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Resolves customer-named fragrances to catalogue records and returns a
 * structured wardrobe analysis, or null when no names resolve.
 *
 * Returns null (not an error) when:
 * - names array is empty
 * - no names match any catalogue record
 *
 * Partial resolution (some names match, some do not) is handled gracefully:
 * the analysis is computed from whatever resolved, and resolvedCount < totalCount
 * signals that some names were unrecognised.
 */
export function analyseWardrobe(names: string[]): WardrobeAnalysis | null {
  if (names.length === 0) return null;

  const resolved = resolveNames(names);
  if (resolved.length === 0) return null;

  // ── Character distribution ────────────────────────────────────────────────
  const characterCounts: Record<string, number> = Object.fromEntries(
    ALL_CHARACTERS.map((c) => [c, 0])
  );
  for (const k of resolved) {
    characterCounts[k.scentCharacter] = (characterCounts[k.scentCharacter] ?? 0) + 1;
  }

  const missingCharacters = ALL_CHARACTERS.filter((c) => (characterCounts[c] ?? 0) === 0);

  // ── Occasion coverage ─────────────────────────────────────────────────────
  const allOccasionTerms = resolved.flatMap((k) =>
    k.occasions.map((o) => o.toLowerCase())
  );
  const coveredOccasions = OCCASION_GROUPS
    .filter((g) => g.keywords.some((kw) => allOccasionTerms.some((o) => o.includes(kw))))
    .map((g) => g.label);

  // ── Family coverage ───────────────────────────────────────────────────────
  const familyCoverage = [...new Set(resolved.flatMap((k) => k.family))];

  // ── Editorial classification ──────────────────────────────────────────────
  const style = classifyStyle(characterCounts);

  // ── Strengths and opportunity ─────────────────────────────────────────────
  const strengths   = describeStrengths(style, coveredOccasions);
  const opportunity = describeOpportunity(style, missingCharacters, coveredOccasions);

  return {
    resolvedCount: resolved.length,
    totalCount:    names.length,
    style,
    characterCounts,
    missingCharacters,
    coveredOccasions,
    familyCoverage,
    strengths,
    opportunity,
  };
}

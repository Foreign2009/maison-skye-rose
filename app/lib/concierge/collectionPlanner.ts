/**
 * Maison Concierge — Collection Planner (EP17-P4)
 *
 * Converts a ConversationProfile into a CollectionBrief — a structured plan
 * describing collection type, fragrance roles, budget guidance, and wardrobe
 * context. Pure function — no I/O, no side effects, no stored state.
 *
 * Design:
 * - Each collection type maps to a priority-ordered scentCharacter sequence.
 * - When an existingCollection is present, covered characters are skipped so
 *   the plan only recommends genuine additions (Refinement 5).
 * - Editorial labels follow Maison Skye & Rose voice (Refinement 6).
 * - Budget is guidance only — collection balance takes priority (Refinement 4).
 */

import type { ConversationProfile, CollectionType } from "./types";
import { analyseWardrobe }                           from "./wardrobeAnalyser";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CollectionRole {
  position:  number;
  character: string;   // scentCharacter — used by retrievalPlanner for targeted retrieval
  title:     string;   // e.g. "Everyday Signature"
  purpose:   string;   // editorial description of what this role contributes
}

export interface CollectionBrief {
  type:          CollectionType;
  label:         string;         // Maison editorial collection name
  targetSize:    number;         // Total fragrances requested (including existing)
  newCount:      number;         // Fragrances still to be added
  roles:         CollectionRole[]; // Roles to fill with new recommendations
  budgetNote:    string | null;
  wardrobeAware: boolean;        // true when existingCollection present
}

// ── Vocabulary ────────────────────────────────────────────────────────────────

// Maison editorial collection labels (Refinement 6)
const COLLECTION_LABELS: Record<CollectionType, string> = {
  Starter:   "Starter Collection",
  Signature: "Signature Collection",
  Business:  "Business Wardrobe",
  Travel:    "Travel Collection",
  Seasonal:  "Seasonal Rotation",
  Minimal:   "Minimal Collection",
  Luxury:    "Luxury Collection",
  Custom:    "Personal Collection",
};

// Default collection sizes when not explicitly stated
const DEFAULT_SIZE: Record<CollectionType, number> = {
  Starter:   3,
  Signature: 1,
  Business:  3,
  Travel:    2,
  Seasonal:  3,
  Minimal:   2,
  Luxury:    4,
  Custom:    3,
};

// Priority-ordered scentCharacter sequences per collection type.
// The planner takes the first N uncovered characters from this list.
const TYPE_CHARACTER_SEQUENCES: Record<CollectionType, string[]> = {
  Starter:   ["Fresh & Light", "Balanced Signature", "Rich & Full-Bodied", "Deep & Intense"],
  Signature: ["Balanced Signature", "Fresh & Light", "Rich & Full-Bodied", "Deep & Intense"],
  Business:  ["Fresh & Light", "Balanced Signature", "Rich & Full-Bodied", "Deep & Intense"],
  Travel:    ["Balanced Signature", "Fresh & Light", "Rich & Full-Bodied", "Deep & Intense"],
  Seasonal:  ["Fresh & Light", "Balanced Signature", "Rich & Full-Bodied", "Deep & Intense"],
  Minimal:   ["Fresh & Light", "Rich & Full-Bodied", "Balanced Signature", "Deep & Intense"],
  Luxury:    ["Fresh & Light", "Balanced Signature", "Rich & Full-Bodied", "Deep & Intense"],
  Custom:    ["Fresh & Light", "Balanced Signature", "Rich & Full-Bodied", "Deep & Intense"],
};

// Role templates per scentCharacter — two per character for variety
// across different collection contexts (Refinement 2)
const ROLE_TEMPLATES: Record<string, Array<{ title: string; purpose: string }>> = {
  "Fresh & Light": [
    {
      title:   "Fresh Daily",
      purpose: "An effortless, clean fragrance for everyday wear — the opening note of the collection and the one you reach for without thinking.",
    },
    {
      title:   "Daytime Companion",
      purpose: "Light and approachable — built for mornings, travel, and any occasion that calls for effortless freshness.",
    },
  ],
  "Balanced Signature": [
    {
      title:   "Everyday Signature",
      purpose: "The anchor of the collection. Refined enough for any occasion — office, evenings, weekends, and everything between.",
    },
    {
      title:   "Daily Anchor",
      purpose: "The fragrance you reach for without deliberation. Confident and adaptable, it works across the full range of your week.",
    },
  ],
  "Rich & Full-Bodied": [
    {
      title:   "Evening Character",
      purpose: "A richer, more present fragrance reserved for the occasions that call for warmth, depth, and lasting presence.",
    },
    {
      title:   "Occasion Statement",
      purpose: "The fragrance for dinners, evenings, and the moments worth remembering. It brings range and gravitas to the collection.",
    },
  ],
  "Deep & Intense": [
    {
      title:   "Statement Fragrance",
      purpose: "The defining piece — worn when presence and permanence matter most. The most distinctive chapter of the collection.",
    },
    {
      title:   "Signature Depth",
      purpose: "The deepest, most characterful end of the collection. Worn for the moments that deserve a lasting impression.",
    },
  ],
};

// Context-specific role title overrides
const CONTEXT_ROLE_OVERRIDES: Partial<Record<CollectionType, Partial<Record<string, { title: string; purpose: string }>>>> = {
  Business: {
    "Fresh & Light": {
      title:   "Office Companion",
      purpose: "A clean, professional fragrance for the working day — focused, approachable, and never intrusive in a close environment.",
    },
    "Balanced Signature": {
      title:   "Smart-Casual All-Rounder",
      purpose: "The versatile piece that carries naturally from office afternoons through to early evening client meetings.",
    },
    "Rich & Full-Bodied": {
      title:   "Evening Client",
      purpose: "A richer presence for dinners, client events, and occasions that extend beyond the working day.",
    },
  },
  Travel: {
    "Balanced Signature": {
      title:   "Travel Companion",
      purpose: "A versatile, all-occasion fragrance — confident in any context, from airport lounges to evening arrivals.",
    },
    "Fresh & Light": {
      title:   "Transit Fresh",
      purpose: "A light, effortless companion for long journeys and unfamiliar climates. Approachable and endlessly adaptable.",
    },
  },
  Minimal: {
    "Fresh & Light": {
      title:   "Morning Clarity",
      purpose: "The lighter, daytime end of a minimal collection — clean, versatile, and effortlessly wearable every day.",
    },
    "Rich & Full-Bodied": {
      title:   "Evening Counterpart",
      purpose: "The richer piece that completes a minimal collection — giving you depth and occasion-readiness without excess.",
    },
  },
};

// ── Role generation ───────────────────────────────────────────────────────────

function buildRole(
  position:       number,
  character:      string,
  type:           CollectionType,
  positionIndex:  number
): CollectionRole {
  // Check for context-specific override first
  const override = CONTEXT_ROLE_OVERRIDES[type]?.[character];
  if (override) {
    return { position, character, title: override.title, purpose: override.purpose };
  }

  // Fall back to the generic template pool (alternate between templates)
  const templates = ROLE_TEMPLATES[character] ?? [];
  const template  = templates[positionIndex % templates.length] ?? {
    title:   character,
    purpose: `A ${character.toLowerCase()} fragrance for your collection.`,
  };

  return { position, character, title: template.title, purpose: template.purpose };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Converts a ConversationProfile into a CollectionBrief.
 *
 * Returns null when no collection intent has been detected (collectionType
 * not set in profile). When null, contextBuilder suppresses the section and
 * retrievalPlanner falls back to standard discovery.
 */
export function planCollection(profile: ConversationProfile): CollectionBrief | null {
  if (!profile.collectionType) return null;

  const type          = profile.collectionType.value;
  const requestedSize = profile.collectionSize?.value ?? DEFAULT_SIZE[type];

  // ── Wardrobe-aware role planning (Refinement 5) ───────────────────────────
  // Resolve the existingCollection and identify which characters are already
  // filled — those roles will be skipped.
  const existingNames    = profile.existingCollection?.value ?? [];
  const wardrobeAnalysis = existingNames.length > 0 ? analyseWardrobe(existingNames) : null;
  const coveredChars     = new Set<string>(
    Object.entries(wardrobeAnalysis?.characterCounts ?? {})
      .filter(([, n]) => n > 0)
      .map(([c]) => c)
  );
  const resolvedExisting = wardrobeAnalysis?.resolvedCount ?? 0;

  // How many NEW fragrances are needed
  const newCount = Math.max(1, requestedSize - resolvedExisting);

  // ── Build role character list ─────────────────────────────────────────────
  const sequence           = TYPE_CHARACTER_SEQUENCES[type];
  const uncoveredSequence  = sequence.filter((c) => !coveredChars.has(c));
  const roleCharacters: string[] = [];

  // Fill with uncovered characters first (complementary additions)
  for (const char of uncoveredSequence) {
    if (roleCharacters.length >= newCount) break;
    roleCharacters.push(char);
  }

  // If more roles needed than uncovered characters, cycle back through sequence
  // (customer wants more fragrances than gaps to fill — honor the request)
  if (roleCharacters.length < newCount) {
    for (const char of sequence) {
      if (roleCharacters.length >= newCount) break;
      if (!roleCharacters.includes(char)) roleCharacters.push(char);
    }
  }

  // ── Build role objects ────────────────────────────────────────────────────
  const roles = roleCharacters.map((char, i) => buildRole(i + 1, char, type, i));

  // ── Budget note (Refinement 4 — guidance only, balance first) ─────────────
  let budgetNote: string | null = null;
  if (profile.budget?.value && newCount > 0) {
    const total          = profile.budget.value;
    const perFragrance   = Math.floor(total / newCount);
    const countLabel     = `${newCount} fragrance${newCount !== 1 ? "s" : ""}`;
    const additionLabel  = resolvedExisting > 0 ? "addition" : "fragrance";
    const additionsLabel = newCount !== 1 ? `${additionLabel}s` : additionLabel;
    budgetNote = `R${total} total — around R${perFragrance} per ${additionsLabel} (${countLabel}). Prioritise collection balance and versatility within this guidance.`;
  }

  return {
    type,
    label:         COLLECTION_LABELS[type],
    targetSize:    requestedSize,
    newCount,
    roles,
    budgetNote,
    wardrobeAware: resolvedExisting > 0,
  };
}

/**
 * Maison Concierge — Profile Extractor (EP17-P2)
 *
 * Extracts structured preference signals from a customer message and merges
 * them into the accumulated ConversationProfile. Pure function — no I/O,
 * no catalogue dependency. Session-scoped: the profile is never persisted
 * beyond the current consultation.
 *
 * Design rules:
 * - List fields are additive unless a genuine contradiction is detected (Refinement 1).
 * - Scalar fields (shoppingIntent, budget) always reflect the newest statement.
 * - Confidence is set per field: HIGH for explicit statements, MEDIUM for inferred context.
 * - Contradiction resolution: newest signal wins and is removed from the opposite list.
 */

import type { ConversationProfile, ProfileField, ProfileConfidence, CollectionType } from "./types";

// ── Vocabulary ────────────────────────────────────────────────────────────────

const FAMILIES = [
  "white floral", "fresh", "aquatic", "citrus", "woody", "aromatic",
  "amber", "sweet", "gourmand", "floral", "rose", "vanilla", "leather",
  "tobacco", "oud", "musk", "powdery", "spicy", "fruity",
];

const NOTES = [
  "pink pepper", "black pepper", "guaiac wood", "tonka bean",
  "bergamot", "sandalwood", "patchouli", "vetiver", "lavender", "jasmine",
  "ambroxan", "cardamom", "saffron", "neroli", "frankincense", "geranium",
  "benzoin", "labdanum", "grapefruit", "cinnamon", "tonka",
  "cedar", "iris", "violet", "lemon", "orange", "pepper",
];

// Unified vocabulary sorted longest-first to prevent substring collisions
// (e.g. "pink pepper" matched before "pepper", "white floral" before "floral")
type VocabEntry = { term: string; kind: "family" | "note" };

const VOCAB: VocabEntry[] = [
  ...FAMILIES.map((f) => ({ term: f, kind: "family" as const })),
  ...NOTES.map((n)   => ({ term: n, kind: "note"   as const })),
].sort((a, b) => b.term.length - a.term.length);

// ── Polarity detection ────────────────────────────────────────────────────────

const NEGATION_TRIGGERS = [
  "don't like", "dont like", "do not like",
  "doesn't like", "doesnt like", "does not like",
  "don't enjoy", "dont enjoy", "do not enjoy",
  "doesn't enjoy", "doesnt enjoy", "does not enjoy",
  "don't want", "dont want", "doesn't want", "doesnt want",
  "don't wear", "dont wear",
  "hate ", "dislike", "avoid ", "not into",
  "not a fan", "can't stand", "cant stand",
  "not fond of", "never wear",
  "she hates", "he hates", "they hate",
  "she avoids", "he avoids", "she doesn't", "he doesn't",
  "nothing ", "without ",
];

const POSITIVE_TRIGGERS = [
  "love ", "enjoy ", "adore ", "like ", "prefer ",
  "i wear ", "i always wear", "i tend to wear",
  "drawn to", "fan of", "i'm into", "im into", "i am into",
  "i like", "i enjoy", "i love", "i adore", "i prefer",
];

function polarityBefore(ctx: string): "positive" | "negative" | "none" {
  if (NEGATION_TRIGGERS.some((t) => ctx.includes(t))) return "negative";
  if (POSITIVE_TRIGGERS.some((t) => ctx.includes(t)))  return "positive";
  return "none";
}

// ── Merge helpers ─────────────────────────────────────────────────────────────

function capitalize(s: string): string {
  return s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function mergeList(
  current:    ProfileField<string[]> | undefined,
  incoming:   string[],
  confidence: ProfileConfidence
): ProfileField<string[]> {
  const existing  = current?.value ?? [];
  const merged    = [...new Set([...existing, ...incoming])];
  // Take the higher confidence of existing and incoming
  const prevConf  = current?.confidence;
  const finalConf: ProfileConfidence =
    prevConf === "HIGH" || confidence === "HIGH" ? "HIGH" :
    prevConf === "MEDIUM" || confidence === "MEDIUM" ? "MEDIUM" : "LOW";
  return { value: merged, confidence: finalConf };
}

function removeFromList(
  field:    ProfileField<string[]> | undefined,
  toRemove: string[]
): ProfileField<string[]> | undefined {
  if (!field) return undefined;
  const filtered = field.value.filter((v) => !toRemove.includes(v));
  return filtered.length > 0 ? { ...field, value: filtered } : undefined;
}

// ── Scent preference extraction ───────────────────────────────────────────────

function extractScentSignals(q: string): {
  prefFamilies:  string[];
  avoidFamilies: string[];
  prefNotes:     string[];
  avoidNotes:    string[];
} {
  const prefFamilies:  string[] = [];
  const avoidFamilies: string[] = [];
  const prefNotes:     string[] = [];
  const avoidNotes:    string[] = [];

  // Tracks character ranges already claimed by a longer match
  const usedRanges: Array<[number, number]> = [];

  for (const { term, kind } of VOCAB) {
    let offset = 0;

    while (true) {
      const idx = q.indexOf(term, offset);
      if (idx === -1) break;
      offset = idx + 1;

      // Skip if this position is already covered by a longer term
      if (usedRanges.some(([s, e]) => idx < e && idx + term.length > s)) continue;

      // Word boundary: character before and after must not be [a-z]
      const charBefore = idx > 0                          ? q[idx - 1]              : " ";
      const charAfter  = idx + term.length < q.length     ? q[idx + term.length]    : " ";
      if (/[a-z]/.test(charBefore) || /[a-z]/.test(charAfter)) continue;

      usedRanges.push([idx, idx + term.length]);

      // Look up to 60 characters before the term for polarity context
      const context  = q.slice(Math.max(0, idx - 60), idx);
      const polarity = polarityBefore(context);
      const label    = capitalize(term);

      if (polarity === "positive") {
        kind === "family" ? prefFamilies.push(label) : prefNotes.push(label);
      } else if (polarity === "negative") {
        kind === "family" ? avoidFamilies.push(label) : avoidNotes.push(label);
      }
    }
  }

  return { prefFamilies, avoidFamilies, prefNotes, avoidNotes };
}

// ── Occasion extraction ───────────────────────────────────────────────────────

const OCCASION_PATTERNS: Array<[RegExp, string]> = [
  [/\b(for|at|to) (the )?office\b/,             "Office"],
  [/\bfor ?work\b|\bto work\b/,                 "Office"],
  [/\bdate night\b|\bfor a date\b/,             "Date Night"],
  [/\bfor (a )?wedding\b/,                      "Wedding"],
  [/\b(in the |for (the )?)?evening(s)?\b/,     "Evening"],
  [/\beveryday\b|\bevery day\b|\bdaily wear\b/,  "Daily Wear"],
  [/\bfor (the )?weekend\b/,                    "Weekend"],
  [/\bfor (a )?(vacation|holiday)\b/,           "Vacation"],
];

// ── Season extraction ─────────────────────────────────────────────────────────

const SEASON_PATTERNS: Array<[RegExp, string]> = [
  [/\b(for|in) summer\b/,          "Summer"],
  [/\b(for|in) winter\b/,          "Winter"],
  [/\b(for|in) spring\b/,          "Spring"],
  [/\b(for|in) (autumn|fall)\b/,   "Autumn"],
];

// ── Shopping context extraction ───────────────────────────────────────────────

function extractShoppingContext(q: string): Partial<ConversationProfile> {
  const out: Partial<ConversationProfile> = {};

  // Self — explicit statements only
  if (/\bfor (my)?self\b/.test(q) || /\bfor me\b/.test(q) || /\bi'?ll? (be )?wear/.test(q)) {
    out.shoppingIntent = { value: "self", confidence: "HIGH" };
    return out;
  }

  // Female recipient
  const femaleRel = q.match(/\bfor (my )?(wife|girlfriend|mother|mom|sister|daughter)\b/);
  if (femaleRel || /\bfor her\b/.test(q)) {
    const who = femaleRel?.[2] ?? "her";
    out.shoppingIntent  = { value: "gift", confidence: "HIGH" };
    out.shoppingFor     = { value: who, confidence: "HIGH" };
    out.recipientGender = { value: "female", confidence: "HIGH" };
    return out;
  }

  // Male recipient
  const maleRel = q.match(/\bfor (my )?(husband|boyfriend|father|dad|brother|son)\b/);
  if (maleRel || /\bfor him\b/.test(q)) {
    const who = maleRel?.[2] ?? "him";
    out.shoppingIntent  = { value: "gift", confidence: "HIGH" };
    out.shoppingFor     = { value: who, confidence: "HIGH" };
    out.recipientGender = { value: "male", confidence: "HIGH" };
    return out;
  }

  // Partner (gender ambiguous — do not set recipientGender)
  if (/\bfor (my )?partner\b/.test(q)) {
    out.shoppingIntent = { value: "gift", confidence: "HIGH" };
    out.shoppingFor    = { value: "partner", confidence: "HIGH" };
    return out;
  }

  // Generic gift — confidence MEDIUM until recipient details are known
  if (/\b(as a |a )?gift\b/.test(q) || /\bbuy(ing)? .{0,20} for\b/.test(q)) {
    out.shoppingIntent = { value: "gift", confidence: "MEDIUM" };
    return out;
  }

  return out;
}

// ── Budget extraction ─────────────────────────────────────────────────────────

function extractBudget(q: string): number | undefined {
  const m =
    q.match(/(?:budget(?:\s+is)?|around|about|under|up to|roughly|spend)\s*r?\s*(\d+)/i) ??
    q.match(/\br\s*(\d+)\b/i);
  return m?.[1] ? parseInt(m[1], 10) : undefined;
}

// ── Existing collection extraction ────────────────────────────────────────────

function extractExistingCollection(message: string): string[] {
  // Use original-case message so names are preserved as the customer wrote them
  const patterns: RegExp[] = [
    /\bi(?: already)? (?:own|have|bought|purchased|got)\s+(.+?)(?:[.,]|\band\b|$)/i,
    /\bmy (?:collection|wardrobe) includes?\s+(.+?)(?:[.,]|\band\b|$)/i,
    /\bi(?:'ve| have) been wearing\s+(.+?)(?:[.,]|\band\b|$)/i,
  ];

  const found: string[] = [];
  for (const p of patterns) {
    const m = message.match(p);
    if (m?.[1]) {
      const raw = m[1].trim().replace(/[.,]$/, "").trim();
      if (raw.length > 2 && raw.length < 80) {
        // Title-case the extracted name
        const titled = raw.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        if (!found.includes(titled)) found.push(titled);
      }
    }
  }
  return found;
}

// ── Collection intent extraction (EP17-P4) ────────────────────────────────────

const COLLECTION_TYPE_PATTERNS: Array<[RegExp, CollectionType]> = [
  // Luxury — check before Starter/Custom to prevent "best starter" mis-classifying
  [/\b(luxury|premium|best of|finest|spare no expense|no budget)\b.{0,30}\b(collection|wardrobe|fragrances?)\b/i, "Luxury"],

  // Signature — single fragrance for everything
  [/\bsignature (scent|fragrance|collection|wardrobe)\b/i, "Signature"],
  [/\b(just|only) one (fragrance|scent)\b/i,              "Signature"],
  [/\bone fragrance for (everything|all occasions?|everyday)\b/i, "Signature"],

  // Business / Office
  [/\b(business|office|work|professional|corporate)\b.{0,30}\b(collection|wardrobe|fragrances?|set)\b/i, "Business"],
  [/\b(collection|wardrobe|fragrances?|set)\b.{0,30}\b(for|at)\b.{0,20}\b(office|work|business)\b/i,    "Business"],

  // Travel
  [/\btravel (collection|wardrobe|fragrances?|scents?)\b/i,       "Travel"],
  [/\bfor (travelling|traveling|travel)\b/i,                       "Travel"],
  [/\btravel.{0,25}\b(every|frequently|a lot|often|weekly|week)\b/i, "Travel"],
  [/\bi travel\b/i,                                                 "Travel"],

  // Seasonal
  [/\b(summer|winter|spring|autumn|fall)\b.{0,30}\b(collection|wardrobe|rotation|set)\b/i, "Seasonal"],
  [/\bseasonal (collection|wardrobe|rotation)\b/i,                                         "Seasonal"],

  // Minimal
  [/\b(minimal|minimalist|simple|streamlined)\b.{0,30}\b(collection|wardrobe|fragrances?)\b/i, "Minimal"],

  // Starter — generic "build a wardrobe", beginner language
  [/\b(starter|beginner|starting|first|new to|getting into|just starting)\b.{0,30}\b(collection|wardrobe|fragrances?)\b/i, "Starter"],
  [/\b(build|start|create|put together|assemble)\b.{0,25}\b(a |my )?(wardrobe|collection|fragrance wardrobe)\b/i,          "Starter"],
  [/\bhelp me build\b.{0,30}\b(wardrobe|collection)\b/i,                                                                   "Starter"],
];

function extractCollectionType(q: string): CollectionType | undefined {
  for (const [pattern, type] of COLLECTION_TYPE_PATTERNS) {
    if (pattern.test(q)) return type;
  }
  return undefined;
}

const WORD_TO_NUM: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
};

function extractCollectionSize(q: string): number | undefined {
  // "three fragrances", "4 scents", "a collection of three", etc.
  const m =
    q.match(/\b(one|two|three|four|five|\d)\b.{0,25}\b(fragrances?|scents?|pieces?|bottles?)\b/i) ??
    q.match(/\ba (collection|wardrobe) of (one|two|three|four|five|\d)\b/i);

  if (m) {
    const raw = m[m.length - 1].toLowerCase();  // last captured group = number token
    return (WORD_TO_NUM[raw] ?? parseInt(raw, 10)) || undefined;
  }

  // "a complete / full wardrobe" → default 4
  if (/\b(complete|full|whole)\b.{0,20}\b(wardrobe|collection)\b/.test(q)) return 4;

  return undefined;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Extracts preference signals from `message` and merges them into `current`.
 *
 * Rules:
 * - Scent preference lists are additive (coexisting preferences are kept).
 * - A genuine contradiction (same term appearing in both preferred and avoided)
 *   resolves newest-wins: the term is removed from the opposite list.
 * - Scalar fields (shoppingIntent, budget, recipientGender) always reflect
 *   the newest statement.
 */
export function extractProfile(
  message:  string,
  current?: ConversationProfile
): ConversationProfile {
  const profile: ConversationProfile = { ...current };
  const q = message.toLowerCase();

  // ── 1. Scent preferences and avoidances ──────────────────────────────────
  const { prefFamilies, avoidFamilies, prefNotes, avoidNotes } = extractScentSignals(q);

  if (prefFamilies.length > 0) {
    // Contradiction: remove from avoided, then add to preferred
    profile.avoidedFamilies   = removeFromList(profile.avoidedFamilies, prefFamilies);
    profile.preferredFamilies = mergeList(profile.preferredFamilies, prefFamilies, "HIGH");
  }
  if (avoidFamilies.length > 0) {
    // Contradiction: remove from preferred, then add to avoided
    profile.preferredFamilies = removeFromList(profile.preferredFamilies, avoidFamilies);
    profile.avoidedFamilies   = mergeList(profile.avoidedFamilies, avoidFamilies, "HIGH");
  }
  if (prefNotes.length > 0) {
    profile.avoidedNotes  = removeFromList(profile.avoidedNotes, prefNotes);
    profile.preferredNotes = mergeList(profile.preferredNotes, prefNotes, "HIGH");
  }
  if (avoidNotes.length > 0) {
    profile.preferredNotes = removeFromList(profile.preferredNotes, avoidNotes);
    profile.avoidedNotes   = mergeList(profile.avoidedNotes, avoidNotes, "HIGH");
  }

  // ── 2. Occasions (additive) ───────────────────────────────────────────────
  const newOccasions = OCCASION_PATTERNS
    .filter(([p]) => p.test(q))
    .map(([, label]) => label);
  if (newOccasions.length > 0) {
    profile.preferredOccasions = mergeList(profile.preferredOccasions, newOccasions, "HIGH");
  }

  // ── 3. Seasons (additive) ─────────────────────────────────────────────────
  const newSeasons = SEASON_PATTERNS
    .filter(([p]) => p.test(q))
    .map(([, label]) => label);
  if (newSeasons.length > 0) {
    profile.preferredSeasons = mergeList(profile.preferredSeasons, newSeasons, "HIGH");
  }

  // ── 4. Shopping context (scalar — newest wins) ────────────────────────────
  const shopping = extractShoppingContext(q);
  if (shopping.shoppingIntent) profile.shoppingIntent  = shopping.shoppingIntent;
  if (shopping.shoppingFor)    profile.shoppingFor     = shopping.shoppingFor;
  if (shopping.recipientGender) profile.recipientGender = shopping.recipientGender;

  // ── 5. Budget (scalar — newest wins) ─────────────────────────────────────
  const budget = extractBudget(q);
  if (budget !== undefined) {
    profile.budget = { value: budget, confidence: "MEDIUM" };
  }

  // ── 6. Existing collection (additive — Refinement 3) ─────────────────────
  const newItems = extractExistingCollection(message);
  if (newItems.length > 0) {
    profile.existingCollection = mergeList(profile.existingCollection, newItems, "HIGH");
  }

  // ── 7. Preferred gender (only when shopping for self or unspecified) ──────
  if (!shopping.shoppingIntent || shopping.shoppingIntent.value === "self") {
    // EP-AI-C6-P1: expanded to cover natural product-type vocabulary
    // (men's/women's scent|perfume|cologne) in addition to "fragrance".
    // "cologne for myself" is also captured as a self-referential masculine signal.
    const MALE_PATTERN   = /\bfor men\b|\bmasculine fragrances?\b|\bmen'?s (?:fragrances?|scents?|perfumes?|colognes?|aftershave)\b|\bi'?m (?:a )?(?:man|male|guy)\b|\bi am (?:a )?(?:man|male|guy)\b|\bas a (?:man|male|guy)\b|\bcologne for (?:my)?self\b/;
    const FEMALE_PATTERN = /\bfor women\b|\bfeminine fragrances?\b|\bwomen'?s (?:fragrances?|scents?|perfumes?|colognes?)\b|\bi'?m (?:a )?(?:woman|female|girl|lady)\b|\bi am (?:a )?(?:woman|female|girl|lady)\b|\bas a (?:woman|female|girl|lady)\b/;
    const UNISEX_PATTERN = /\bgender doesn'?t matter\b|\bunisex fragrances?\b|\bshow me unisex\b|\bi don'?t (?:mind|care)(?: (?:about|the))? gender\b|\bfor anyone\b/;
    if (MALE_PATTERN.test(q)) {
      profile.preferredGender = { value: "male", confidence: "HIGH" };
    } else if (FEMALE_PATTERN.test(q)) {
      profile.preferredGender = { value: "female", confidence: "HIGH" };
    } else if (UNISEX_PATTERN.test(q)) {
      profile.preferredGender = { value: "unisex", confidence: "HIGH" };
    }
  }

  // ── 8. Collection intent (scalar — newest wins) (EP17-P4) ────────────────
  const collectionType = extractCollectionType(q);
  if (collectionType) {
    profile.collectionType = { value: collectionType, confidence: "HIGH" };
  }

  const collectionSize = extractCollectionSize(q);
  if (collectionSize !== undefined) {
    profile.collectionSize = { value: collectionSize, confidence: "HIGH" };
  }

  return profile;
}

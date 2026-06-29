import { fragranceFamilies } from "../data/fragranceFamilies";
import { fragranceVibes } from "../data/fragranceVibes";
import { Fragrance } from "../data/types";

// ── Public types ──────────────────────────────────────────────────────────────

/**
 * Formal type for the production catalogue's display-shape objects.
 * These are untyped in fragrances.ts — this type is the adapter's input contract.
 */
export type DisplayFragrance = {
  title: string;
  collection: "Skye" | "Rose" | "Elite";
  subtitle: string;
  mood: string;
  profile: string;
  season: string;
  notes: string[];
  bestSeller: boolean;
  newArrival: boolean;
  prices: { "5ml": number; "10ml": number; "30ml": number };
  images: { "5ml": string; "10ml": string; "30ml": string };
};

// ── Module constants ──────────────────────────────────────────────────────────

// Sorted longest-first so multi-word entries ("White Floral") match before substrings ("Floral").
const SORTED_FAMILIES = [...fragranceFamilies].sort((a, b) => b.length - a.length);
const SORTED_VIBES = [...fragranceVibes].sort((a, b) => b.length - a.length);

// ── Profile token alias table ─────────────────────────────────────────────────
// Tokens that appear in catalogue profiles but have no direct fragranceFamilies equivalent.
// All values are approximations — inferred, not authoritative.
// "Chypre" and "Fruity" are aliased to prevent products yielding an empty family array,
// since some profiles (e.g. "Chypre Fruity") contain only unmapped tokens.
const PROFILE_ALIASES: Record<string, string> = {
  marine: "Aquatic",      // Marine and Aquatic are the same family
  tea: "Aromatic",        // Tea (herbal/green) is aromatic family
  coffee: "Gourmand",     // Coffee is a gourmand accord
  chypre: "Fresh",        // Classical chypre (bergamot top) approximated as Fresh
  fruity: "Sweet",        // Fruity approximated as Sweet (imprecise — fruity ≠ sweet)
  green: "Fresh",         // Green (herb, grass) belongs to the fresh family
  honey: "Sweet",         // Honey is a sweet note
  rum: "Gourmand",        // Rum is a warm gourmand note
  almond: "Gourmand",     // Almond is a gourmand note
  marshmallow: "Gourmand", // Marshmallow is a sweet gourmand note
  milky: "Gourmand",      // Milky/creamy notes are gourmand-adjacent
};

// ── Season lookup tables ──────────────────────────────────────────────────────

const SEASON_OCCASIONS: Record<string, string[]> = {
  "All Season": ["Daily Wear", "Office"],
  "Summer":     ["Daily Wear", "Vacation", "Summer Days"],
  "Winter":     ["Date Night", "Winter Evenings"],
  "Spring":     ["Daily Wear", "Wedding"],
  "Autumn":     ["Office", "Date Night"],
};

const SEASON_LIST: Record<string, string[]> = {
  "All Season": ["Spring", "Summer", "Autumn", "Winter"],
  "Summer":     ["Summer"],
  "Winter":     ["Winter"],
  "Spring":     ["Spring"],
  "Autumn":     ["Autumn"],
};

// Intensity: heavy seasons project more (scale 1–5)
const SEASON_INTENSITY: Record<string, number> = {
  "Winter":     4,
  "Autumn":     3,
  "All Season": 3,
  "Spring":     2,
  "Summer":     2,
};

// Versatility: year-round suitability (scale 1–5)
const SEASON_VERSATILITY: Record<string, number> = {
  "All Season": 5,
  "Spring":     3,
  "Summer":     3,
  "Autumn":     3,
  "Winter":     2,
};

// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Substitute catalogue-specific profile tokens that have no vocabulary equivalent.
 * Uses word boundaries to avoid partial replacements.
 * Input and output are lowercase.
 */
function normaliseProfile(profile: string): string {
  let p = profile.toLowerCase();
  for (const [token, replacement] of Object.entries(PROFILE_ALIASES)) {
    p = p.replace(new RegExp(`\\b${token}\\b`, "g"), replacement.toLowerCase());
  }
  return p;
}

/**
 * Collect all fragranceFamilies entries present in a normalised profile string.
 * Entries that are substrings of a longer already-matched entry are removed,
 * preventing "White Floral" from also returning "Floral".
 */
function extractFamilies(normalised: string): string[] {
  const matches: string[] = [];

  for (const family of SORTED_FAMILIES) {
    if (normalised.includes(family.toLowerCase())) {
      matches.push(family);
    }
  }

  return matches.filter(
    (f) =>
      !matches.some(
        (other) =>
          other !== f &&
          other.length > f.length &&
          other.toLowerCase().includes(f.toLowerCase())
      )
  );
}

/**
 * Collect all fragranceVibes entries that appear in the mood string.
 */
function extractVibes(mood: string): string[] {
  const m = mood.toLowerCase();
  const vibes: string[] = [];
  for (const vibe of SORTED_VIBES) {
    if (m.includes(vibe.toLowerCase())) {
      vibes.push(vibe);
    }
  }
  return vibes;
}

/**
 * Derive scentCharacter from a normalised profile.
 * Priority order: Deep & Intense > Fresh & Light > Rich & Long Wearing > Balanced Signature.
 * Heavy note categories take precedence to avoid misclassifying dark orientals as fresh.
 */
function deriveScentCharacter(normalised: string): Fragrance["scentCharacter"] {
  const has = (kw: string) => normalised.includes(kw);

  if (has("oud") || has("leather") || has("tobacco")) return "Deep & Intense";
  if (has("fresh") || has("citrus") || has("aquatic")) return "Fresh & Light";
  if (has("sweet") || has("vanilla") || has("gourmand") || has("amber") || has("spicy"))
    return "Rich & Long Wearing";
  return "Balanced Signature";
}

/**
 * Derive style metrics from a normalised profile and season.
 * All values are inferred approximations on a 1–5 scale (matches RecommendationCard display).
 * When multiple conditions fire, the ternary chain evaluates top-to-bottom — earlier rules win.
 */
function deriveMetrics(
  normalised: string,
  season: string
): Pick<Fragrance, "sweetness" | "freshness" | "warmth" | "intensity" | "versatility"> {
  const has = (kw: string) => normalised.includes(kw);

  const sweetness =
    has("sweet") || has("vanilla") || has("gourmand") ? 4
    : has("amber") ? 3
    : has("fresh") || has("citrus") || has("aquatic") ? 1
    : 2;

  const freshness =
    has("fresh") || has("citrus") || has("aquatic") ? 5
    : has("floral") ? 3
    : has("oud") || has("leather") || has("tobacco") || has("vanilla") || has("sweet") ? 1
    : 2;

  const warmth =
    has("oud") || has("amber") || has("vanilla") || has("tobacco") || has("spicy") ? 4
    : has("woody") ? 3
    : has("fresh") || has("citrus") || has("aquatic") ? 1
    : 2;

  return {
    sweetness,
    freshness,
    warmth,
    intensity:   SEASON_INTENSITY[season]    ?? 3,
    versatility: SEASON_VERSATILITY[season]  ?? 3,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Adapt a single display-shape catalogue product into a recommendation-compatible Fragrance object.
 *
 * Authoritative values (copied directly):   name, brand, notes, bestSeller, newArrival, image
 * Strongly inferred values (high accuracy): gender (from collection), family (from profile vocabulary),
 *                                           vibe (from mood vocabulary), seasons
 * Approximated values (lower accuracy):     occasions, scentCharacter, sweetness, freshness,
 *                                           warmth, intensity, versatility, popularity
 */
export function adaptFragrance(f: DisplayFragrance): Fragrance {
  const normalised = normaliseProfile(f.profile);

  return {
    id:     f.title.toLowerCase().replace(/\s+/g, "-"),
    name:   f.title,
    brand:  "Maison Skye & Rose",

    // Inferred from collection. Highest scorer weight (+25). Known approximation risk: Elite → unisex
    // means all Elite products score 0 on gender dimension regardless of query.
    gender:
      f.collection === "Skye"  ? "male"   :
      f.collection === "Rose"  ? "female" :
      "unisex",

    family:  extractFamilies(normalised),

    notes: {
      top:   f.notes.length > 0 ? [f.notes[0]] : [],
      heart: f.notes.length > 1 ? [f.notes[1]] : [],
      base:  f.notes.length > 2 ? [f.notes[2]] : [],
    },

    vibe:     extractVibes(f.mood),
    occasions: SEASON_OCCASIONS[f.season] ?? ["Daily Wear"],
    seasons:   SEASON_LIST[f.season]      ?? [f.season],

    scentCharacter: deriveScentCharacter(normalised),
    projection:     "moderate",
    signatureStyle: [f.subtitle],
    recommendedFor: [],

    ...deriveMetrics(normalised, f.season),

    // 1–10 scale to match scorer thresholds (>= 9 for luxuryUpgrade, <= 6 for hiddenGem).
    popularity: f.bestSeller ? 10 : 5,

    image:      f.images["10ml"],
    bestSeller: f.bestSeller,
    newArrival: f.newArrival,
  };
}

/**
 * Adapt the full production catalogue. Call once at module level in consumers
 * to avoid repeating the mapping on every render.
 */
export function adaptCatalogue(fragrances: DisplayFragrance[]): Fragrance[] {
  return fragrances.map(adaptFragrance);
}

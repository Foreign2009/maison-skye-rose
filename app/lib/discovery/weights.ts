// ── Similarity weights ────────────────────────────────────────────────────────
// Characteristic dimensions collectively represent ~95% of the total score.
// Popularity is a tie-break only (~5%).

export const FAMILY_WEIGHT     = 20;  // per overlapping fragrance family
export const NOTE_WEIGHT       =  8;  // per shared note (top / heart / base); capped at 3
export const SEASON_WEIGHT     = 18;  // exact season match
export const ADJACENT_SEASON_W =  9;  // Spring↔Summer or Autumn↔Winter proximity
export const OCCASION_WEIGHT   = 14;  // per overlapping occasion
export const CHARACTER_WEIGHT  = 20;  // scentCharacter exact match
export const PROJECTION_WEIGHT = 12;  // projection exact match
export const COLLECTION_WEIGHT =  6;  // same Skye / Rose / Elite collection (mild)
export const POPULARITY_WEIGHT =  1;  // multiplied by popularity (1–10); tie-break only

// ── Collection boost defaults ─────────────────────────────────────────────────
// Individual CollectionSpecs supply their own points; these are reference values.

export const DEFAULT_BOOST_BESTSELLER = 15;
export const DEFAULT_BOOST_NEWARRIVAL = 12;
export const DEFAULT_BOOST_POPULARITY =  3;  // per popularity point × 0.3

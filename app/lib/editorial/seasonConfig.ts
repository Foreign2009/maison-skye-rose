/**
 * Maison Seasonal Editorial Framework
 *
 * Single source of truth for the current season's editorial configuration.
 * To update the seasonal experience, edit SEASON_CONFIGS below.
 *
 * South Africa seasonal calendar (Southern Hemisphere):
 *   Spring  — September to November
 *   Summer  — December to February
 *   Autumn  — March to May
 *   Winter  — June to August
 */

import { getCurrentSeason } from "../discovery";
import type { ConversationContext } from "../concierge/types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Season = "Spring" | "Summer" | "Autumn" | "Winter";

export interface AcademyTeaser {
  slug:     string;
  title:    string;
  excerpt:  string;
  readTime: number;
}

export interface SeasonConfig {
  season: Season;

  // ── Editorial voice ──────────────────────────────────────────────────────
  editorialHeadline: string;   // Section heading on the homepage
  editorialTagline:  string;   // Subheading / eyebrow
  editorialNote:     string;   // Short editorial paragraph for the seasonal section

  // ── Wardrobe guidance ────────────────────────────────────────────────────
  wardrobeHeadline:  string;   // Seasonal subheading inside the Maison Method section
  wardrobeGuidance:  string;   // Advisory paragraph for the current season

  // ── Featured collection ──────────────────────────────────────────────────
  collectionId:      string;   // Must match a CollectionSpec.id in collectionEngine.ts

  // ── Academy recommendations ──────────────────────────────────────────────
  featuredArticleSlugs: string[];  // Ordered: seasonal first, then curated universals

  // ── Concierge enrichment ─────────────────────────────────────────────────
  conciergeContext: Partial<ConversationContext>;
}

// ── Academy teaser lookup ─────────────────────────────────────────────────────
// Inline data for the 6 articles — avoids importing full academyCatalogue
// (which carries complete body content) into client-side module.

const ACADEMY_TEASERS: Record<string, AcademyTeaser> = {
  "choosing-your-season-scent": {
    slug:     "choosing-your-season-scent",
    title:    "Choosing Your Season Scent",
    excerpt:  "Heat amplifies projection. Cold mutes it. Learn how to choose fragrances that perform beautifully in each season rather than fighting the weather.",
    readTime: 4,
  },
  "guide-to-fragrance-families": {
    slug:     "guide-to-fragrance-families",
    title:    "Your Guide to Fragrance Families",
    excerpt:  "Fragrance families are the language of perfumery. Understanding them helps you discover new fragrances with confidence.",
    readTime: 5,
  },
  "how-to-wear-fragrance": {
    slug:     "how-to-wear-fragrance",
    title:    "How to Wear Fragrance",
    excerpt:  "Most people apply fragrance incorrectly. Learn the techniques that maximise longevity and character.",
    readTime: 4,
  },
  "the-note-pyramid-explained": {
    slug:     "the-note-pyramid-explained",
    title:    "The Note Pyramid Explained",
    excerpt:  "Every fragrance tells a story in three acts. Learn how top, heart, and base notes create the scent you experience.",
    readTime: 4,
  },
  "what-makes-a-signature-scent": {
    slug:     "what-makes-a-signature-scent",
    title:    "What Makes a Signature Scent",
    excerpt:  "A signature scent is a fragrance so aligned with your personality that people associate the smell with you.",
    readTime: 5,
  },
  "how-to-layer-fragrances": {
    slug:     "how-to-layer-fragrances",
    title:    "How to Layer Fragrances",
    excerpt:  "Fragrance layering combines two scents to create something that does not exist in a single bottle.",
    readTime: 4,
  },
};

// ── Season configurations ─────────────────────────────────────────────────────

const SEASON_CONFIGS: Record<Season, SeasonConfig> = {

  Spring: {
    season: "Spring",
    editorialHeadline: "Spring in Bloom",
    editorialTagline:  "The season for florals, freshness, and new beginnings.",
    editorialNote:
      "Spring is the fragrance season for renewal. As temperatures warm and the air lightens, floral and fresh compositions return to full expression. This is the perfect moment to introduce a lighter signature — or to rediscover florals that were overshadowed in winter.",
    wardrobeHeadline: "Building Your Spring Wardrobe",
    wardrobeGuidance:
      "Spring is the most natural season to discover a new fragrance. Florals bloom here, fresh compositions breathe, and the moderate warmth allows fragrances to evolve without distortion. Consider adding a light floral or fresh-fruity to complement a heavier year-round signature.",
    collectionId:      "spring-essentials",
    featuredArticleSlugs: [
      "choosing-your-season-scent",
      "guide-to-fragrance-families",
      "what-makes-a-signature-scent",
    ],
    conciergeContext: { season: "Spring" },
  },

  Summer: {
    season: "Summer",
    editorialHeadline: "Summer, Defined",
    editorialTagline:  "The season for freshness, lightness, and warmth.",
    editorialNote:
      "Heat transforms fragrance. In summer, projection amplifies and heavy compositions can overwhelm. The fragrances that thrive now are built for exactly this — fresh, clean, and effortlessly present without demanding attention.",
    wardrobeHeadline: "Your Summer Wardrobe",
    wardrobeGuidance:
      "In summer, wardrobe thinking shifts to performance in heat. Reach for fresh, aquatic, or light citrus fragrances that project cleanly in warm weather. Save your richer, more intense pieces for evenings or air-conditioned environments where they can express their full character.",
    collectionId:      "summer-essentials",
    featuredArticleSlugs: [
      "choosing-your-season-scent",
      "how-to-wear-fragrance",
      "guide-to-fragrance-families",
    ],
    conciergeContext: { season: "Summer" },
  },

  Autumn: {
    season: "Autumn",
    editorialHeadline: "The Autumn Edit",
    editorialTagline:  "The season for warmth, depth, and transition.",
    editorialNote:
      "Autumn is the richest fragrance season. As temperatures cool and air dries, warmer compositions come alive. Woody, amber, and spice-forward fragrances reveal nuances that summer heat kept hidden. This is the season to revisit your richer pieces — and to discover new depth.",
    wardrobeHeadline: "Your Autumn Wardrobe",
    wardrobeGuidance:
      "Autumn invites you to transition your wardrobe. Reach for the woody, amber, and spice-forward fragrances you set aside in summer — they perform at their peak now. This is also the ideal season to add a richer signature: something deeper than your everyday fragrance, warmer than your summer picks.",
    collectionId:      "autumn-essentials",
    featuredArticleSlugs: [
      "choosing-your-season-scent",
      "how-to-layer-fragrances",
      "the-note-pyramid-explained",
    ],
    conciergeContext: { season: "Autumn" },
  },

  Winter: {
    season: "Winter",
    editorialHeadline: "Winter in Full",
    editorialTagline:  "The season for depth, warmth, and lasting presence.",
    editorialNote:
      "Cold air slows evaporation and deepens every fragrance. The compositions that feel overwhelming in summer now find their moment — rich orientals, deep oud-based fragrances, and warm ambers come alive in the cool. This is the season to wear your most characterful pieces.",
    wardrobeHeadline: "Your Winter Wardrobe",
    wardrobeGuidance:
      "Winter is the season to wear the statement pieces of your wardrobe. Rich, deep, and long-lasting fragrances perform at their best in the cold. If you have been saving a Deep Intensity fragrance for the right moment, this is it. Layer over a lighter base for all-day presence that evolves beautifully as the day progresses.",
    collectionId:      "winter-warmth",
    featuredArticleSlugs: [
      "choosing-your-season-scent",
      "the-note-pyramid-explained",
      "how-to-layer-fragrances",
    ],
    conciergeContext: { season: "Winter" },
  },
};

// ── Public API ────────────────────────────────────────────────────────────────

export function getSeasonConfig(): SeasonConfig {
  return SEASON_CONFIGS[getCurrentSeason()];
}

export function getSeasonalAcademyTeasers(config: SeasonConfig): AcademyTeaser[] {
  return config.featuredArticleSlugs
    .map((slug) => ACADEMY_TEASERS[slug])
    .filter((t): t is AcademyTeaser => !!t);
}

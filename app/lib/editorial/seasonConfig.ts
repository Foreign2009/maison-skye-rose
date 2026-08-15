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

// ── Editorial campaign ─────────────────────────────────────────────────────────
// A campaign config overrides the seasonal editorial during a specific date window.
// After the window expires the campaign has no effect — no manual cleanup required.
// Campaigns recur annually when startMonth/endMonth stay within the same year.

interface CampaignConfig {
  startMonth: number;
  startDay:   number;
  endMonth:   number;
  endDay:     number;
  config:     SeasonConfig;
}

function isInCampaignWindow(campaign: CampaignConfig, now: Date): boolean {
  const month = now.getMonth() + 1; // 1–12
  const day   = now.getDate();      // 1–31
  if (campaign.startMonth === campaign.endMonth) {
    return month === campaign.startMonth && day >= campaign.startDay && day < campaign.endDay;
  }
  if (month === campaign.startMonth) return day >= campaign.startDay;
  if (month === campaign.endMonth)   return day <  campaign.endDay;
  return month > campaign.startMonth && month < campaign.endMonth;
}

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
      "Autumn invites you to transition your wardrobe. Reach for the woody, amber, and spice-forward fragrances you set aside in summer — they feel most natural now. This is also the ideal season to add a richer signature: something deeper than your everyday fragrance, warmer than your summer picks.",
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
      "Winter is a natural moment to turn to richer, warmer compositions. The fragrances that can feel heavy in summer — deep orientals, oud-based pieces, warm ambers — often feel most at home in the cooler months. This is the season to wear your most characterful pieces.",
    wardrobeHeadline: "Your Winter Wardrobe",
    wardrobeGuidance:
      "Winter invites the deeper, richer pieces in your wardrobe. If you have been saving a Deep & Intense fragrance for the right moment, this is a natural one. Consider layering over a lighter base — the combination evolves beautifully as the day progresses.",
    collectionId:      "winter-warmth",
    featuredArticleSlugs: [
      "choosing-your-season-scent",
      "the-note-pyramid-explained",
      "how-to-layer-fragrances",
    ],
    conciergeContext: { season: "Winter" },
  },
};

// ── Editorial campaigns ───────────────────────────────────────────────────────
// Cape Town Late Winter → Spring transition: August 15–31.
// On September 1 getCurrentSeason() returns "Spring" and the standard Spring
// config takes over automatically — no manual cleanup required.
//
// The campaign uses season: "Spring" (valid Season type) to signal that the
// homepage is transitioning toward spring. Discovery and recommendation layers
// are unaffected; they continue using getCurrentSeason() which returns "Winter"
// for all of August.

const EDITORIAL_CAMPAIGNS: CampaignConfig[] = [
  {
    startMonth: 8, startDay: 15,
    endMonth:   9, endDay:   1,
    config: {
      season:            "Spring",
      editorialHeadline: "The First Warmth",
      editorialTagline:  "The season is beginning to turn.",
      editorialNote:
        "Cape Town's last winter weeks are changing. The air is softening, the light is shifting, and the first warmth is arriving. This is the natural moment to begin exploring fresher, lighter compositions — alongside the deeper pieces that still carry through the cool evenings.",
      wardrobeHeadline: "Your Transitional Wardrobe",
      wardrobeGuidance:
        "As the season turns, the wardrobe begins to shift. Reach for fresh, floral, and clean-edged fragrances on the warmer days — they feel right in the softening air. Your deeper, richer pieces still belong on the cool evenings and will return to prominence next winter. This is the moment to discover what spring will feel like on your skin.",
      collectionId:         "spring-essentials",
      featuredArticleSlugs: [
        "choosing-your-season-scent",
        "guide-to-fragrance-families",
        "how-to-wear-fragrance",
      ],
      conciergeContext: { season: "Spring" },
    },
  },
];

// ── Public API ────────────────────────────────────────────────────────────────

export function getSeasonConfig(): SeasonConfig {
  const now    = new Date();
  const active = EDITORIAL_CAMPAIGNS.find((c) => isInCampaignWindow(c, now));
  if (active) return active.config;
  return SEASON_CONFIGS[getCurrentSeason()];
}

export function getSeasonalAcademyTeasers(config: SeasonConfig): AcademyTeaser[] {
  return config.featuredArticleSlugs
    .map((slug) => ACADEMY_TEASERS[slug])
    .filter((t): t is AcademyTeaser => !!t);
}

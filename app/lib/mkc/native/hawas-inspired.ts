// Maison Knowledge Catalogue — Hawas Inspired
import type { FragranceKnowledge } from "../types";

export const hawasInspired: FragranceKnowledge = {

  // ── Identity ─────────────────────────────────────────────────────────────────
  id:             "hawas-inspired",
  slug:           "hawas-inspired",
  brand:          "Maison Skye & Rose",
  name:           "Hawas Inspired",
  collection:     "Skye",
  catalogVersion: "1.0",
  status:         "active",

  // ── Classification ───────────────────────────────────────────────────────────
  gender:         "male",
  family:         ["Fresh", "Aquatic", "Fruity"],
  scentCharacter: "Balanced Signature",
  projection:     "strong",

  // ── Composition ──────────────────────────────────────────────────────────────
  profile: "Aquatic Fruity",
  season:  "Summer",
  notes: {
    top:   ["Apple", "Bergamot", "Mint"],
    heart: ["Jasmine", "Aquatic Accord", "Vetiver"],
    base:  ["Ambergris", "Sandalwood", "Musk"],
  },
  mood: "Apple, mint and an aquatic heart that carries warmth into the depths of summer.",

  // ── Discovery ────────────────────────────────────────────────────────────────
  vibe:           ["Bold", "Fresh", "Energetic", "Confident", "Adventurous", "Playful"],
  occasions:      ["Summer Days", "Vacation", "Weekend", "Date Night", "Evening"],
  seasons:        ["Spring", "Summer"],
  signatureStyle: ["Sweet Aquatic Boldness", "Summer Projection Authority", "Rasasi Discovery"],
  recommendedFor: [
    "Those who want a fresh summer masculine with genuine presence — Hawas pairs apple-bergamot freshness with a projection that rises above most mainstream summer fragrances",
    "Beach, vacation, and outdoor settings where the aquatic-fruity character has room to expand — warmth and movement bring the best out of this composition",
    "Customers who explored Invictus and want more sweetness and a bolder summer statement — Hawas is the next step outward from that territory",
    "Fragrance enthusiasts discovering Middle Eastern niche houses — an accessible entry to Rasasi that delivers summer performance well above its price tier",
  ],

  // ── Merchandising ────────────────────────────────────────────────────────────
  prices: { "5ml": 60, "10ml": 100, "30ml": 250 },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller: false,
  newArrival: false,

  // ── Education ────────────────────────────────────────────────────────────────
  subtitle: "Summer Beast",
  description:
    "Hawas Inspired opens with a bright, crisp accord of Apple and Bergamot — immediately refreshing and distinctly fruity — before a clean aquatic heart develops, with Jasmine adding a softness that keeps the composition from reading as purely sporty. " +
    "Vetiver introduces a grounding earthiness that the Ambergris and Sandalwood base develops further into a warm, distinctive dry-down with real character. " +
    "A summer masculine that wears its freshness with confidence rather than restraint.",

  // ── Academy integration ───────────────────────────────────────────────────────
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "weekend-and-casual-fragrances",
    "choosing-your-season-scent",
    "how-to-wear-fragrance",
  ],
  academyCategories: [
    "fragrance-families",
    "seasonal-guide",
    "occasion-guide",
  ],
  educationTags: [
    "apple", "aquatic", "bergamot", "fresh", "ambergris", "mint", "jasmine",
    "masculine", "summer", "spring", "bold", "niche",
  ],
  learningPath: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Relationships ─────────────────────────────────────────────────────────────
  relationships: {
    wardrobePartners: ["le-beau-paradise-garden-inspired"],
    alternatives: ["pacific-chill-inspired", "bvlgari-aqua-inspired", "leau-dissey-pour-homme-inspired"],
  },

  // ── Intelligence ─────────────────────────────────────────────────────────────
  // Fresh aquatic with projection reference for Wave 2. intensity:4 in the fresh
  // register is unusual — Hawas is specifically noted for above-average summer
  // projection. Invictus (intensity:3) is the comparison: same freshness tier,
  // Hawas pushes harder. sweetness:3 from apple accord, above Invictus (2).
  sweetness:   3,
  freshness:   4,
  warmth:      2,
  intensity:   4,
  versatility: 4,
  popularity:  6,
};

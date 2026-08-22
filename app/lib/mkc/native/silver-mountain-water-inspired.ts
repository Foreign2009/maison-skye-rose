import type { FragranceKnowledge } from "../types";

export const silverMountainWaterInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "silver-mountain-water-inspired",
  slug          : "silver-mountain-water-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Silver Mountain Water Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Citrus", "Fresh"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fresh Citrus",
  season        : "Summer",
  notes: {
    top:   ["Bergamot", "Lemon Zest", "Grapefruit"],
    heart: ["Green Tea", "Cucumber Accord", "White Peony"],
    base:  ["Musk", "Cedarwood", "Ambroxan"],
  },
  mood          : "Clean and uplifting.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Clean",
    "Fresh",
    "Luminous",
    "Grounded",
    "Uplifting",
  ],
  occasions     : ["Daily Wear", "Office", "Vacation", "Weekend"],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Mountain Freshness", "Luminous Clarity", "Clean Citrus Heritage"],
  recommendedFor: [
    "Men seeking a clean, luminous everyday fragrance that refreshes without demanding attention",
    "Those who want crystalline freshness with green tea and cucumber—not just citrus and air",
    "Anyone looking for a summer signature that works equally well at the office or on vacation",
    "Men who prefer grounded freshness with cedarwood depth over pure aquatic or ozonic registers",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Luminous Clarity",
  description   : "Bergamot and lemon zest open into a crystalline landscape where green tea and cucumber accord meet white peony—a composition that feels both luminous and grounded. Musk and cedarwood anchor the freshness without weight, leaving skin cool and radiant.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
    "how-to-wear-fragrance",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "citrus",
    "bergamot",
    "lemon",
    "fresh",
    "green-tea",
    "cucumber",
    "summer",
    "daily-wear",
    "clean",
    "light",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "fresh-citrus-and-aquatic-fragrances",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 1,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["aqua-di-gio-inspired", "imagination-inspired", "invictus-inspired", "grapefruit-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired"],
  },
};

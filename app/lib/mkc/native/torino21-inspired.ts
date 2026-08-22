import type { FragranceKnowledge } from "../types";

export const torino21Inspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "torino21-inspired",
  slug          : "torino21-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Torino21 Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Fresh"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Green Aromatic",
  season        : "Summer",
  notes: {
    top:   ["Spearmint", "Grapefruit", "Petitgrain"],
    heart: ["Lemon Verbena", "Geranium Leaf", "Cardamom"],
    base:  ["Ambroxan", "Cedarwood", "Musk"],
  },
  mood          : "Fresh and vibrant.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Bright",
    "Crisp",
    "Clean",
    "Modern",
    "Energetic",
  ],
  occasions     : ["Daily Wear", "Casual", "Weekend", "Vacation"],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Green Aromatic Freshness", "Sport Luxury", "Crystalline Citrus"],
  recommendedFor: [
    "Men seeking a crisp, energizing everyday fragrance that feels natural and unpretentious",
    "Those who love green and citrus over sweet or woody — crisp mint and grapefruit with real clarity",
    "Active men who want fresh projection for gym, travel, or warm-weather outdoor activities",
    "Anyone looking for a summer staple that feels bright but grounded, never cloying",
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
  subtitle      : "Bright Clarity",
  description   : "Spearmint and grapefruit collide in a burst of crystalline brightness, then unfold into the green whisper of lemon verbena and geranium leaf. A spine of cedarwood and ambroxan keeps the composition grounded—luminous, not fleeting.",
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
    "fresh",
    "aromatic",
    "citrus",
    "green",
    "spearmint",
    "grapefruit",
    "cedarwood",
    "summer",
    "daily-wear",
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
    alternatives:     ["aqua-di-gio-inspired", "imagination-inspired", "y-inspired", "grapefruit-inspired"],
    wardrobePartners: ["sauvage-elixir-inspired"],
  },
};

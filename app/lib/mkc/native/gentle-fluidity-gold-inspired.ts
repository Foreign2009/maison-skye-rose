import type { FragranceKnowledge } from "../types";

export const gentleFluidityGoldInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "gentle-fluidity-gold-inspired",
  slug          : "gentle-fluidity-gold-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Gentle Fluidity Gold Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Vanilla", "Musk"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Vanilla Musk",
  season        : "All Season",
  notes: {
    top:   ["Bergamot", "Vanilla", "Pink Pepper"],
    heart: ["Amber", "Rose Absolute", "Sandalwood"],
    base:  ["White Musk", "Vanilla Planifolia", "Cashmeran"],
  },
  mood          : "Refined and elegant.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Warm",
    "Sophisticated",
    "Luminous",
    "Soft",
  ],
  occasions     : ["Daily Wear", "Office", "Evening", "Weekend"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Golden Luxury", "Refined Warmth", "Elegant Signature"],
  recommendedFor: [
    "Women seeking a refined daily signature that bridges professional elegance and intimate sophistication.",
    "Those who love warm vanilla and musk but want the grace of rose and amber to elevate the sweetness.",
    "Anyone building a luxury fragrance wardrobe who needs one versatile scent that feels like a second skin across all seasons.",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "/images/pink-5ml.png",
    "10ml": "/images/pink-10ml.png",
    "30ml": "/images/glass-pink-30ml.png",
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Luminous Refinement",
  description   : "Bergamot and pink pepper open onto a luminous heart of rose absolute and amber, grounded in the soft warmth of white musk and vanilla. The fragrance settles into a refined second skin—neither floral nor gourmand, but a precise balance of both. Sandalwood and cashmeran deepen the composition into something quietly luxurious that persists without demanding attention.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "vanilla-and-amber-the-warm-base",
    "musks-the-hidden-foundation",
    "office-and-professional-fragrances",
    "how-to-layer-fragrances",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "vanilla",
    "musk",
    "rose",
    "amber",
    "sandalwood",
    "white-musk",
    "elegant",
    "long-wearing",
    "daily-wear",
    "office",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "vanilla-and-amber-the-warm-base",
    "office-and-professional-fragrances",
    "how-to-layer-fragrances",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 1,
  warmth        : 4,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};

import type { FragranceKnowledge } from "../types";

export const armaniSiInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "armani-si-inspired",
  slug          : "armani-si-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Armani Si Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Fruity", "Amber"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Chypre Fruity",
  season        : "All Season",
  notes: {
    top:   ["Blackcurrant", "Bergamot", "Pink Pepper"],
    heart: ["Rose Absolute", "Freesia", "Ambroxan"],
    base:  ["Vanilla", "Patchouli", "Musk"],
  },
  mood          : "Graceful and sophisticated.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Graceful",
    "Elegant",
    "Warm",
    "Confident",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Weekend"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Italian Elegance", "Fruity Sophistication", "Modern Rose Icon"],
  recommendedFor: [
    "Women seeking a sophisticated daily signature that transitions seamlessly from office to evening without reapplication.",
    "Those who love rose-centered fragrances but prefer fruity brightness and amber warmth over traditional florals.",
    "Anyone building a refined fragrance wardrobe who wants one versatile piece that pairs beautifully with both fresh and spiced complementary scents.",
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
  subtitle      : "Radiant Restraint",
  description   : "Blackcurrant and bergamot open with a whisper of pink pepper, giving way to a heart of rose absolute and freesia that unfolds with measured grace. Vanilla and patchouli anchor the composition, creating a chypre that feels both luminous and grounded—a fragrance that moves through the day without announcement.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "weekend-and-casual-fragrances",
    "oriental-and-amber-fragrances",
    "office-and-professional-fragrances",
    "how-to-layer-fragrances",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "fruity",
    "amber",
    "rose",
    "blackcurrant",
    "chypre",
    "sophisticated",
    "long-wearing",
    "layering",
    "office",
    "daily-wear",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "weekend-and-casual-fragrances",
    "office-and-professional-fragrances",
    "how-to-layer-fragrances",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 2,
  warmth        : 4,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["aventus-inspired", "spicebomb-extreme-inspired"],
  },
};

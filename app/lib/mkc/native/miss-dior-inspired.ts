import type { FragranceKnowledge } from "../types";

export const missDiorInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "miss-dior-inspired",
  slug          : "miss-dior-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Miss Dior Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral",
  season        : "Spring",
  notes: {
    top:   ["Bergamot", "Rose", "Grapefruit"],
    heart: ["Peony", "Jasmine Sambac", "Pink Peppercorn"],
    base:  ["Vanilla", "Musk", "Sandalwood"],
  },
  mood          : "Elegant feminine florals with playful luxury.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Playful",
    "Feminine",
    "Luxury",
    "Refined",
    "Bright",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Wedding",
    "Weekend",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Soft Luxury", "Refined Florals", "Luminous Elegance"],
  recommendedFor: [
    "Women seeking an elegant rose fragrance that transitions seamlessly from daily wear to special occasions.",
    "Those who appreciate balanced florals with playful sophistication—neither too sweet nor too austere.",
    "Anyone building a signature scent wardrobe who wants luminous refinement that complements both casual and formal settings.",
    "Fragrance lovers drawn to peony and jasmine as the emotional heart of their scent story.",
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
  bestSeller    : true,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Luminous Refinement",
  description   : "A luminous rose opens with citrus brightness, unfolding into peony and jasmine that feels both refined and gently playful. The composition settles into warm vanilla and musk, creating an elegant second skin that carries the intimacy of luxury without pretense.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
    "how-to-layer-fragrances",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "rose",
    "peony",
    "jasmine",
    "feminine",
    "elegant",
    "signature-scent",
    "spring",
    "everyday-wear",
    "luxury",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "office-and-professional-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 10,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "rose-n'-roses-inspired", "chanel-no-5-inspired", "a-la-rose-inspired", "chloe-original-inspired"],
    wardrobePartners: ["sauvage-inspired", "bleu-de-chanel-inspired"],
  },
};

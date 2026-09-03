import type { FragranceKnowledge } from "../types";

export const myWayInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "my-way-inspired",
  slug          : "my-way-inspired",
  brand         : "Maison Skye & Rose",
  name          : "My Way Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["White Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "White Floral",
  season        : "Spring",
  notes: {
    top:   ["Bergamot", "Grapefruit", "Tuberose"],
    heart: ["Jasmine Sambac", "Orange Blossom", "Gardenia"],
    base:  ["Vanilla Bourbon", "Sandalwood", "Musk"],
  },
  mood          : "Elegant and modern.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Modern",
    "Luminous",
    "Soft",
    "Sophisticated",
    "Warm",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Weekend",
    "Evening",
    "Wedding",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Bright Femininity", "Modern White Floral", "Luminous Signature"],
  recommendedFor: [
    "Women seeking a luminous white floral signature that balances brightness with warmth for everyday elegance",
    "Those who love jasmine and gardenia but want modern softness over heavy florality",
    "Anyone looking for a versatile fragrance that transitions seamlessly from office to evening without feeling formal",
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
  subtitle      : "Luminous Grace",
  description   : "Bergamot and grapefruit open into a luminous heart of jasmine sambac and orange blossom, where gardenia adds a whispered softness. Vanilla bourbon and sandalwood anchor the composition with warmth, creating a fragrance that feels both radiant and intimately familiar.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
    "how-to-layer-fragrances",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "white-floral",
    "jasmine",
    "tuberose",
    "gardenia",
    "vanilla",
    "signature-scent",
    "balanced",
    "elegant",
    "spring",
    "layering",
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
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    wardrobePartners: ["baccarat-rouge-540-inspired", "delina-inspired", "my-way-nectar-inspired"],
    alternatives: ["my-way-ylang-inspired", "bloom-inspired", "dolce-inspired"],
  },
};

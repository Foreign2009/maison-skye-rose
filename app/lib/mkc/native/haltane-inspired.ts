import type { FragranceKnowledge } from "../types";

export const haltaneInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "haltane-inspired",
  slug          : "haltane-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Haltane Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Woody", "Oud"],
  scentCharacter: "Deep & Intense",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Oud",
  season        : "Winter",
  notes: {
    top:   ["Saffron", "Galbanum", "Pink Pepper"],
    heart: ["Praline", "Tonka Bean", "Rose Absolute"],
    base:  ["Oud", "Sandalwood", "Amber Gris"],
  },
  mood          : "Sweet woody sophistication.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Luxurious",
    "Sophisticated",
    "Sensual",
    "Warm",
    "Mysterious",
    "Elegant",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter"],
  signatureStyle: ["Royal Luxury", "Gilded Restraint", "Sweet Woody Sophistication"],
  recommendedFor: [
    "Anyone seeking a luxurious oud fragrance that balances deep woody intensity with creamy, approachable sweetness.",
    "Those who want to make a sophisticated evening or formal impression without resorting to overwhelming projection.",
    "Fragrance collectors drawn to gilded, precious materials—saffron, rose, and oud—layered for sensory depth.",
    "Women and men who wear their fragrances like jewellery, favouring restrained opulence over loud statements.",
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
  newArrival    : true,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Gilded Restraint",
  description   : "Saffron and pink pepper ignite a spiced opening before dissolving into creamy praline and rose, grounding into a deep, resinous oud that lingers with amber warmth. This is woody sweetness rendered in shadow—sophisticated, never cloying, with the austere elegance of aged wood and precious incense. A fragrance that moves between restraint and richness, each layer revealing itself with deliberate grace.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "woody-fragrances-explained",
    "oud-the-worlds-most-complex-ingredient",
    "evening-and-date-night-fragrances",
    "how-to-layer-fragrances",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oud",
    "woody",
    "saffron",
    "sandalwood",
    "amber",
    "tonka",
    "rose",
    "deep",
    "intense",
    "winter",
    "unisex",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "woody-fragrances-explained",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 1,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["oud-wood-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};

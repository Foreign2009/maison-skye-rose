import type { FragranceKnowledge } from "../types";

export const aniInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "ani-inspired",
  slug          : "ani-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Ani Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Vanilla", "Woody"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Vanilla Woody",
  season        : "Winter",
  notes: {
    top:   ["Bergamot", "Vanilla", "Black Pepper"],
    heart: ["Ginger", "Cinnamon", "Rose Absolute"],
    base:  ["Sandalwood", "Amber", "Vanilla Tonka"],
  },
  mood          : "Elegant and smooth.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Warm",
    "Sophisticated",
    "Sensual",
    "Mature",
    "Magnetic",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Vanilla Excellence", "Warm Sophistication", "Spiced Elegance"],
  recommendedFor: [
    "Men seeking a sophisticated vanilla fragrance that feels luxurious without sweetness, perfect for evening occasions and cooler months",
    "Those who appreciate warmth and spice layered with creamy amber and sandalwood for an intimate, refined presence",
    "Anyone looking for a signature winter fragrance that transitions seamlessly from date night to formal evening wear",
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
  subtitle      : "Warmth Refined",
  description   : "Bergamot and black pepper ignite a crystalline opening, softening into warming spice and rose absolute that curves toward intimate depth. Sandalwood and tonka vanilla emerge as a creamy, amber-tinged base that lingers like cashmere against skin.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "vanilla-and-amber-the-warm-base",
    "woody-fragrances-explained",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "vanilla",
    "woody",
    "sandalwood",
    "amber",
    "spice",
    "ginger",
    "cinnamon",
    "warm",
    "winter",
    "elegant",
    "date-night",
    "layering",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "vanilla-and-amber-the-warm-base",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 1,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "layton-inspired"],
    wardrobePartners: ["sauvage-inspired", "aventus-inspired"],
  },
};

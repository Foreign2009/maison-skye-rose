import type { FragranceKnowledge } from "../types";

export const libreLeParfumInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "libre-le-parfum-inspired",
  slug          : "libre-le-parfum-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Libre Le Parfum Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Floral",
  season        : "Winter",
  notes: {
    top:   ["Lavender", "Grapefruit", "Pink Pepper"],
    heart: ["Honey", "Rose Absolute", "Amber"],
    base:  ["Vanilla", "Sandalwood", "Musk"],
  },
  mood          : "Powerful and elegant.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Powerful",
    "Elegant",
    "Warm",
    "Confident",
    "Sophisticated",
    "Intense",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Amber Floral Authority", "Elegant Power", "Rich Sophistication"],
  recommendedFor: [
    "Women seeking a bold signature fragrance that commands attention without apology, perfect for evening wear and special occasions.",
    "Those who love rose but want it grounded in warmth and amber rather than presented fresh or romantic.",
    "Anyone looking for a rich fragrance with moderate projection that feels both luxurious and effortlessly powerful.",
    "Women who dress for impact and choose fragrances that match their confident, authoritative presence.",
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
  subtitle      : "Radiant Authority",
  description   : "A bold rose anchored in warm honey and amber, opening with the sharp clarity of pink pepper and grapefruit before settling into a base of creamy vanilla and sandalwood. This is a fragrance that demands attention—radiant without softness, confident without apology. Lavender and musk create an austere elegance that lingers long after the first spray.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "oriental-and-amber-fragrances",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "amber-floral",
    "rose",
    "honey",
    "vanilla",
    "sandalwood",
    "winter",
    "elegant",
    "date-night",
    "powerful",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "evening-and-date-night-fragrances",
    "choosing-your-season-scent",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 3,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["baccarat-rouge-540-inspired"],
  },
};

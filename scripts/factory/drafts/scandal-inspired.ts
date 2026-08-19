// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — scandal-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:34:58.637Z
// Factory version:   0.5.0
// Prompt versions:   EditorialProducer@1.1.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
// Validation status: FAIL  [3 error(s), 0 warning(s)]
// Projected KQ tier: (not available — requires Intelligence Producer)
// ─────────────────────────────────────────────────────────────────
// REVIEW CHECKLIST
//   □ Notes pyramid verified (≥ 2 per tier, no cross-tier duplicates)
//   □ Description reviewed in Maison editorial voice
//   □ Vibe tags meet minimum of 3 (from approved vocabulary)
//   □ recommendedFor has minimum of 2 persona statements
//   □ All FACTORY_ERROR markers resolved
//   □ All FACTORY_WARN markers reviewed
//   □ Relationship suggestions reviewed (see footer)
//   □ npm run mkc:validate passes before promotion
// ═════════════════════════════════════════════════════════════════

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const scandalInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "scandal-inspired",
  slug          : "scandal-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Scandal Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Gourmand", "Floral", "Fruity"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Fruity Gourmand",
  season        : "Autumn",
  notes: {
    top:   ["Blood Orange", "Mandarin Orange"],
    heart: [
      "Honey",
      "Gardenia",
      "Orange Blossom",
      "Jasmine",
      "Peach",
    ],
    base:  ["Beeswax", "Caramel", "Patchouli", "Licorice"],
  },
  notesEvidenceLocked: true,
  mood          : "Floral Gourmand Sweet",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Warm",
    "Sophisticated",
    "Romantic",
    "Magnetic",
    "Luxurious",
  ],
  occasions     : ["Date Night", "Evening", "Office", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Honeyed Floral Gourmand", "Sophisticated Sweet", "Warm Elegance"],
  recommendedFor: [
    "Women seeking a signature scent that balances honeyed sweetness with sophisticated floral depth for evening and date occasions.",
    "Those who love gourmand fragrances but want elegance over pure dessert—a sensual fragrance that feels luxurious rather than juvenile.",
    "Anyone drawn to warm, full-bodied florals with caramel and honey undertones that linger beautifully in professional and social settings.",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 5ml is required
    "10ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 10ml is required
    "30ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 30ml is required
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Honeyed Scandal",
  description   : "Blood orange and mandarin open with crystalline brightness, immediately softened by honeyed gardenia and jasmine. The heart deepens into caramel and beeswax—a warm, almost edible sweetness—while patchouli adds subtle earthiness beneath layers of peach and orange blossom.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "gourmand",
    "floral",
    "fruity",
    "honey",
    "caramel",
    "jasmine",
    "gardenia",
    "blood-orange",
    "peach",
    "autumn",
    "date-night",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 3,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["oriana-inspired", "burberry-her-inspired", "love-don't-be-shy-inspired"],
    wardrobePartners: ["delina-inspired", "chance-eau-fraiche-inspired"],
  },
};

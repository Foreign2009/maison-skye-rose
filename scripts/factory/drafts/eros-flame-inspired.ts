// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — eros-flame-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T16:54:02.876Z
// Factory version:   0.5.0
// Prompt versions:   EditorialProducer@1.1.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
// Validation status: PASS  [0 error(s), 0 warning(s)]
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

export const erosFlameInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "eros-flame-inspired",
  slug          : "eros-flame-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Eros Flame Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Citrus", "Woody"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Citrus",
  season        : "Autumn",
  notes: {
    top:   [
      "Mandarin Orange",
      "Lemon",
      "Chinotto",
      "Black Pepper",
      "Rosemary",
    ],
    heart: ["Geranium", "Rose", "Pepperwood"],
    base:  [
      "Vanilla",
      "Tonka Bean",
      "Sandalwood",
      "Texas Cedar",
      "Patchouli",
      "Oakmoss",
    ],
  },
  mood          : "Fresh Spicy Masculine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Spicy",
    "Confident",
    "Warm",
    "Sophisticated",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Weekend"],
  seasons       : ["Autumn", "Spring"],
  signatureStyle: ["Spiced Citrus Warmth", "Modern Masculine Versatility", "Fresh Woody Refinement"],
  recommendedFor: [
    "Men seeking a versatile citrus-woody signature that transitions seamlessly from office to evening",
    "Those who want fresh intensity with spiced depth — bright enough for daytime, warm enough for date night",
    "Anyone drawn to mandarin and black pepper as opening statements, balanced by sandalwood sophistication in the base",
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
  subtitle      : "Spiced Citrus Warmth",
  description   : "Mandarin and black pepper ignite with a sharp rosemary bite, cutting through the warmth of geranium and rose. Vanilla and sandalwood settle into a woody base that feels both refined and grounded, with oakmoss adding a subtle earthiness to the finish.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "citrus",
    "woody",
    "mandarin",
    "sandalwood",
    "fresh",
    "versatile",
    "office",
    "date-night",
    "layering",
    "autumn",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["sauvage-inspired", "bleu-de-chanel-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "sauvage-elixir-inspired"],
  },
};

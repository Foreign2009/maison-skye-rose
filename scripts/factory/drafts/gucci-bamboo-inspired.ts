// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — gucci-bamboo-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:38:41.731Z
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

export const gucciBambooInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "gucci-bamboo-inspired",
  slug          : "gucci-bamboo-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Gucci Bamboo Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Oriental",
  season        : "Year-Round",
  notes: {
    top:   ["Bergamot"],
    heart: ["Casablanca Lily", "Ylang-Ylang", "Orange Blossom"],
    base:  ["Sandalwood", "Tahitian Vanilla", "Amber"],
  },
  notesEvidenceLocked: true,
  mood          : "Floral Creamy Warm",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sensual",
    "Elegant",
    "Sophisticated",
    "Feminine",
    "Creamy",
  ],
  occasions     : ["Daily Wear", "Date Night", "Evening", "Weekend"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Creamy Floral Warmth", "Modern Luxe Oriental", "Soft Sensual Signature"],
  recommendedFor: [
    "Women seeking a creamy, sensual floral that feels both approachable and luxurious for everyday wear",
    "Those who love warm vanilla and sandalwood bases but want them softened by lush, rounded florals",
    "Anyone building a signature scent wardrobe who values balance between brightness and enveloping warmth",
    "Women transitioning from fresh fragrances to deeper florals without feeling heavy or mature",
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
  subtitle      : "Warm Ivory Florals",
  description   : "Creamy florals—casablanca lily, ylang-ylang, orange blossom—unfold over warm sandalwood and tahitian vanilla, creating a soft, enveloping sensuality. Bergamot opens the composition with bright clarity before yielding to amber's honeyed embrace. A fragrance that feels like skin, not perfume.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "oriental",
    "lily",
    "ylang-ylang",
    "sandalwood",
    "vanilla",
    "amber",
    "signature-scent",
    "balanced",
    "year-round",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["j'adore-inspired", "mon-guerlain-inspired"],
    wardrobePartners: ["alien-inspired", "hypnotic-poison-inspired"],
  },
};

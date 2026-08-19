// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — la-belle-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:35:20.404Z
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

export const laBelleInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "la-belle-inspired",
  slug          : "la-belle-inspired",
  brand         : "Maison Skye & Rose",
  name          : "La Belle Inspired",
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
  season        : "Autumn",
  notes: {
    top:   ["Pear", "Bergamot"],
    heart: ["Floral Notes", "Leather"],
    base:  ["Vanilla", "Vetiver", "Amber", "Musk"],
  },
  notesEvidenceLocked: true,
  mood          : "Sweet Floral Sensual",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Warm",
    "Sophisticated",
    "Elegant",
    "Refined",
    "Magnetic",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Evening"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Creamy Floral Warmth", "Balanced Sensuality", "Signature Sophistication"],
  recommendedFor: [
    "Women seeking a balanced floral signature that transitions seamlessly from office to evening without requiring a fragrance change",
    "Those drawn to creamy, warm florals with leather accents who prefer sensuality over sweetness",
    "Anyone building a signature collection who wants a sophisticated autumn fragrance that carries with understated presence through professional and romantic settings",
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
  subtitle      : "Creamy Floral Warmth",
  description   : "Pear and bergamot open with bright, almost candied clarity before the composition settles into a creamy floral heart where leather adds shadow and restraint. Vanilla and amber emerge gradually, grounded by vetiver and musk, creating a sensual warmth that feels both soft and substantial.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-oriental",
    "pear",
    "bergamot",
    "leather",
    "vanilla",
    "amber",
    "sensual",
    "signature",
    "autumn",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

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
    alternatives:     ["delina-inspired", "la-vie-est-belle-inspired", "prada-paradoxe-inspired"],
    wardrobePartners: ["bleu-de-chanel-inspired"],
  },
};

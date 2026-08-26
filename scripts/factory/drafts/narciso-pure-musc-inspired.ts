// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — narciso-pure-musc-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:06:49.235Z
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

export const narcisoPureMuscInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "narciso-pure-musc-inspired",
  slug          : "narciso-pure-musc-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Narciso Pure Musc Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Woody", "Musk"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Woody Musk",
  season        : "Spring",
  notes: {
    top:   ["Musk"],
    heart: ["Jasmine", "Ylang-Ylang", "Orange Blossom"],
    base:  ["Cashmeran"],
  },
  notesEvidenceLocked: true,
  mood          : "Clean Musky Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Clean",
    "Sensual",
    "Soft",
    "Sophisticated",
    "Warm",
    "Delicate",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Wedding"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Intimate Floral Musk", "Modern Skin Scent", "Balanced Elegance"],
  recommendedFor: [
    "Women seeking a signature fragrance that feels like a second skin—clean, warm, and intimately personal rather than bold.",
    "Those who love white florals but want them softened by musk and wood, avoiding anything sharp or overly perfumed.",
    "Anyone building a refined everyday collection who values balance between sensuality and restraint.",
    "Women drawn to the tactile warmth of cashmere and skin-like musks paired with luminous jasmine and orange blossom.",
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
  subtitle      : "Skin and Silk",
  description   : "A whisper of white florals—jasmine and orange blossom—softened by warm cashmeran and a veil of musk that feels like skin itself. Clean without severity, sensual without excess. The floral heart dissolves into something almost abstract: presence without perfume.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "musk",
    "floral",
    "jasmine",
    "ylang-ylang",
    "orange-blossom",
    "woody",
    "cashmeran",
    "signature",
    "balanced",
    "clean",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 3,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["narciso-rodriguez-for-her-inspired", "si-passione-red-musk-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};

// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — burberry-body-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-13T20:19:38.493Z
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

import type { FragranceKnowledge } from "../types";

export const burberryBodyInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "burberry-body-inspired",
  slug          : "burberry-body-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Burberry Body Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Woody",
  season        : "Autumn",
  notes: {
    top:   ["Green Absinthe", "Peach", "Freesia"],
    heart: ["Rose Absolute", "Iris", "Sandalwood"],
    base:  ["Cashmeran", "Vanilla", "Amber", "Musk"],
    // Evidence-locked to nordstrom.com (Burberry Body EDP, women): Top "fresh green absinthe, illuminating elegant peach
    // and refined freesia"; Heart "natural rose absolute, iris, and sandalwood"; Base "cashmeran, creamy vanilla, sensual
    // amber, and musk"; style "floral-woody". Listing shown as no longer available (reference retail availability only;
    // founder approved preparing this draft). PYRAMID_SECONDARY_SUPPORTED. See wave-9-source-evidence.json (revision 10).
  },
  notesEvidenceLocked: true,
  mood          : "Sensual Elegant Soft",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Sensual",
    "Soft",
    "Sophisticated",
    "Warm",
    "Mysterious",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Elegant Restraint", "Sensual Rose", "Refined Woody Floral"],
  recommendedFor: [
    "Women seeking a rose and iris fragrance with a fresh green opening and a soft woody base",
    "Those who enjoy peach and freesia warmed by vanilla, amber and musk",
    "Anyone looking for an elegant floral-woody signature for cooler months",
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
  subtitle      : "Elegant Restraint",
  description   : "Green absinthe brightens soft peach and freesia in the opening, before rose absolute, iris and sandalwood form a sensual floral-woody heart. Cashmeran, vanilla, amber and musk settle into a warm, intimate base—elegance that whispers rather than declares.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-woody",
    "rose",
    "iris",
    "sandalwood",
    "peach",
    "freesia",
    "elegant",
    "sensual",
    "signature",
    "autumn",
    "office",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Floral Woody", season="Autumn").
  // Heuristic approximations; no calibration producer in pipeline.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // All pairings cleared pending promotion-time verification (Wave 9 policy).
  // Factory RelationshipProducer suggestions are recorded unverified in
  // catalogue-expansion-ledger.json → pending_relationship_proposals (batch4). Reciprocity
  // would require edits to native counterpart records; none are activated here.
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};

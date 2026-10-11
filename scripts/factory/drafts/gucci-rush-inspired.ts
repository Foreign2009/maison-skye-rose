// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — gucci-rush-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-10T17:56:44.035Z
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

export const gucciRushInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "gucci-rush-inspired",
  slug          : "gucci-rush-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Gucci Rush Inspired",
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
  season        : "All Season",
  notes: {
    // Pyramid attributed to Fragrantica (Gucci-Rush-686) — that page was NOT inspected (HTTP 403);
    // earlier corrections were made from search results. Inspected secondary evidence:
    // thescentbase.com — all 9 notes match in the same tiers. See wave-9-source-evidence.json.
    top:   ["Peach", "Californian Gardenia", "African Freesia Petals"],
    heart: ["Coriander", "Damask Rose", "Jasmine"],
    base:  ["Patchouli", "Natural Vanilla", "Vetiver"],
  },
  notesEvidenceLocked: true,
  mood          : "Bold Vivid Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bold",
    "Vivid",
    "Confident",
    "Feminine",
    "Warm",
    "Magnetic",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Weekend",
    "Evening",
  ],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Bold Floral Statement", "Modern Vivid Rose", "Signature Character"],
  recommendedFor: [
    "Women seeking a bold, characterful floral signature",
    "Those who love vivid rose and jasmine balanced with earthy warmth for everyday confidence",
    "Anyone ready to transition from safe florals to a more daring, personality-driven scent",
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
  subtitle      : "Vivid Floral Energy",
  description   : "Peach and sun-warm gardenia open with vivid, solar immediacy, freesia petals adding brightness to the accord. Coriander and damask rose settle into the skin with unexpected confidence—neither sweet nor sharp, but bold in their own way. Patchouli and vetiver ground the composition with earthen depth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "woody",
    "rose",
    "jasmine",
    "patchouli",
    "vanilla",
    "signature-scent",
    "balanced",
    "daily-wear",
    "office",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Floral Woody", season="All Season").
  // sweetness:2 (else), freshness:3 (floral), warmth:3 (woody), intensity:3 (All Season), versatility:5 (All Season).
  // Scores are heuristic-derived approximations (knowledgeAdapter.ts line 208). No calibration producer in pipeline.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 3,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // All pairings cleared pending promotion-time verification.
  // Validator (validator.ts): BOTH alternatives AND wardrobePartners require reciprocity
  // when allRecords is provided — RELATIONSHIP_ALTERNATIVES_NOT_RECIPROCAL and
  // RELATIONSHIP_WARDROBE_PARTNERS_NOT_RECIPROCAL both fire. Empty arrays pass without error.
  // Proposed pairings retained in catalogue-expansion-ledger.json → pending_relationship_proposals.
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};

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
  // REVISED 2026-10-12 (W9-B3-P1) from adapter output for profile "Fruity Chypre" (Chypre aliases to Amber).
  // Previous: family ["Floral", "Woody"], scentCharacter "Balanced Signature".
  family        : ["Fruity", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fruity Chypre",  // previous: "Floral Woody"; Edgars scent type "Chypre Fruity"
  season        : "All Season",
  notes: {
    // REVISED 2026-10-12 (W9-B3-P1): edgars.co.za Gucci Rush EDT listing (inspected): Top "Bergamot, Peony, Gardenia";
    // Heart "Violet, Vanilla, Jasmine"; Base "Patchouli"; Scent Type "Chypre Fruity". Edgars authorised status not
    // verified -> AI_INFERENCE_UNSOURCED (EVIDENCE HOLD continues). See wave-9-source-evidence.json (revision 9).
    // PREVIOUS (preserved): pyramid attributed to Fragrantica (Gucci-Rush-686), page NOT inspected (HTTP 403);
    //   thescentbase.com matched all 9 notes: Peach, Californian Gardenia, African Freesia Petals /
    //   Coriander, Damask Rose, Jasmine / Patchouli, Natural Vanilla, Vetiver.
    top:   ["Bergamot", "Peony", "Gardenia"],
    heart: ["Violet", "Vanilla", "Jasmine"],
    base:  ["Patchouli"],
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
  signatureStyle: ["Bold Floral Statement", "Modern Vivid Chypre", "Signature Character"],  // previous: "Modern Vivid Rose"
  recommendedFor: [
    "Women seeking a bold, characterful floral signature",
    "Those who love gardenia and jasmine balanced with patchouli's earthy warmth for everyday confidence",
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
  // Description REVISED 2026-10-12 to the Edgars notes. Previous description named peach, freesia, coriander, damask rose
  // and vetiver (preserved in the W9-B3-P1 pre-edit backup and the review bundle).
  description   : "Bergamot, peony and gardenia open with vivid, luminous immediacy. Violet and jasmine soften the heart while vanilla lends a creamy warmth, before patchouli grounds the composition with earthen chypre depth.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "chypre",
    "gardenia",
    "jasmine",
    "patchouli",
    "vanilla",
    "signature-scent",
    "violet",
    "daily-wear",
    "office",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Fruity Chypre", season="All Season") — REVISED 2026-10-12.
  // Previous (profile "Floral Woody"): sweetness 2, freshness 3, warmth 3, intensity 3, versatility 5.
  // Scores are heuristic-derived approximations. No calibration producer in pipeline.
  sweetness     : 3,
  freshness     : 2,
  warmth        : 4,
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

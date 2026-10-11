// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — poison-by-dior-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-10T17:58:47.129Z
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

export const poisonByDiorInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "poison-by-dior-inspired",
  slug          : "poison-by-dior-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Poison by Dior Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  // NOTE: "Oriental" is not in the fragranceFamilies vocabulary; using "Amber" (modern equivalent).
  family        : ["Amber", "Floral"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  // Profile "Amber Floral" replaces "Oriental Floral" because "Oriental" is not in the vocabulary.
  // Composition basis: amber/vanilla/opoponax/incense/cinnamon alongside tuberose, jasmine, rose, orange flower.
  profile       : "Amber Floral",
  season        : "Autumn",
  notes: {
    // Pyramid attributed to Fragrantica (Poison-218) — that page was NOT inspected (HTTP 403);
    // earlier corrections were made from search results. Inspected secondary evidence:
    // thescentbase.com — all 21 notes match in the same tiers; scentverdict.com lists the same
    // composition for a 1985 EDT. See wave-9-source-evidence.json.
    // IDENTITY CONFIRMED (founder-reported 2026-10-11; no direct supplier response inspected): original Dior Poison, EDP.
    // CONCENTRATION/REFERENCE HOLD: the evidence above describes the EDT (or does not state a
    //   concentration). It is NOT relabelled as EDP; this pyramid is held until an exact EDP reference exists.
    top:   ["Plum", "Wild Berries", "Coriander", "Anise", "Brazilian Rosewood"],
    heart: [
      "Tuberose",
      "Incense",
      "White Honey",
      "Cinnamon",
      "Opoponax",
      "Carnation",
      "Jasmine",
      "African Orange Flower",
      "Rose",
    ],
    base:  ["Vanilla", "Amber", "Sandalwood", "Heliotrope", "Musk", "Vetiver", "Virginia Cedar"],
  },
  notesEvidenceLocked: true,
  mood          : "Dark Mysterious Bold",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Mysterious",
    "Bold",
    "Sensual",
    "Sophisticated",
    "Warm",
    "Magnetic",
  ],
  occasions     : ["Date Night", "Evening", "Office", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Dark Floral Seduction", "Sensual Oriental Rose", "Mysterious Sophistication"],
  recommendedFor: [
    "Women who want a signature fragrance of dark florals and spiced warmth for evening and intimate occasions.",
    "Those seeking a bold, sensual rose that balances floral beauty with mysterious depth and a honeyed, spiced sweetness.",
    "Anyone drawn to oriental florals with personality: cinnamon, amber, and cedar create sophistication beyond typical rose fragrances.",
    "Women building a fragrance wardrobe who need a confident date night and evening statement piece.",
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
  subtitle      : "Dark Floral Seduction",
  description   : "Dark plum and wild berries open with a spiced accord of coriander and anise—a dramatic, singular entrance. The heart erupts with tuberose, cinnamon, and incense: dense, intoxicating, unapologetically bold. Vanilla and sandalwood warm the base, while vetiver and heliotrope add shadowed complexity that transforms sweetness into something altogether more dangerous.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oriental-floral",
    "rose",
    "jasmine",
    "tuberose",
    "cinnamon",
    "amber",
    "warm",
    "sensual",
    "bold",
    "signature",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Amber Floral", season="Autumn").
  // Method: keyword rules on normalised profile + SEASON_INTENSITY / SEASON_VERSATILITY tables.
  // sweetness: has("amber") → 3
  // freshness: has("floral") → 3
  // warmth:    has("amber") → 4
  // intensity: Autumn → 3  (SEASON_INTENSITY)
  // versatility: Autumn → 3  (SEASON_VERSATILITY)
  // popularity: !bestSeller → 5
  // Scores are heuristic-derived approximations (knowledgeAdapter.ts line 208). No calibration producer in pipeline.
  sweetness     : 3,
  freshness     : 3,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
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

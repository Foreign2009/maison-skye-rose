// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — dolce-and-gabbana-the-one-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-10T17:56:24.042Z
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

export const dolceAndGabbanaTheOneInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "dolce-and-gabbana-the-one-inspired",
  slug          : "dolce-and-gabbana-the-one-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Dolce and Gabbana The One Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Amber",
  season        : "Autumn",
  notes: {
    // Source: johnlewis.com and ulta.com The One EDP listings (inspected; authorised retailers):
    //   Bergamot, Mandarin, Lychee, Peach / Madonna Lily, Lily of the Valley, Jasmine /
    //   Vanilla, Amber, Musk, Plum, Vetiver. Plum moved heart → base to match (2026-10-11).
    //   "Lily" kept (no repository precedent for "Madonna Lily"). Fragrantica not inspected (403).
    // IDENTITY CONFIRMED (founder-reported 2026-10-11; no direct supplier response inspected): original women's The One, EDP —
    //   matches this 2006 EDP pyramid (the 2017 EDT has a different pyramid).
    top:   ["Mandarin Orange", "Lychee", "Bergamot", "Peach"],
    heart: ["Lily", "Jasmine", "Lily of the Valley"],
    base:  ["Vanilla", "Amber", "Musk", "Plum", "Vetiver"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Sensual Feminine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Warm",
    "Feminine",
    "Sophisticated",
    "Luxurious",
    "Magnetic",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Sensual Floral Amber", "Warm Feminine Icon", "Evening-Ready Elegance"],
  recommendedFor: [
    "Women seeking a sensual floral that suits both the office and the evening.",
    "Those drawn to amber and vanilla warmth who want sophisticated florals with a gentle, rounded sweetness.",
    "Anyone looking for a signature autumn fragrance that feels both polished and intimately feminine.",
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
  subtitle      : "Amber Bloom",
  description   : "Mandarin and peach open with sunlit clarity, lychee adding a note of delicate sweetness. A heart of lily, jasmine, and lily of the valley unfolds with feminine softness, settling into amber and vanilla warmth. Plum, musk, and vetiver deepen the base with a soft, polished finish.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "amber",
    "jasmine",
    "vanilla",
    "sensual",
    "warm",
    "rich",
    "date-night",
    "office",
    "feminine",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Floral Amber", season="Autumn").
  // sweetness:3 (amber), freshness:3 (floral), warmth:4 (amber), intensity:3 (Autumn), versatility:3 (Autumn).
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

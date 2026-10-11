// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — euphoria-by-calvin-klein-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-11T19:36:10.397Z
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

export const euphoriaByCalvinKleinInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "euphoria-by-calvin-klein-inspired",
  slug          : "euphoria-by-calvin-klein-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Euphoria by Calvin Klein Inspired",
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
    top:   ["Pomegranate", "Persimmon", "Green Accord"],
    heart: ["Black Orchid", "Lotus Blossom"],
    base:  ["Cream Accord", "Mahogany Wood", "Violet"],
  },
  notesEvidenceLocked: true,
  mood          : "Sensual Mysterious Luxurious",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Mysterious",
    "Luxurious",
    "Sensual",
    "Sophisticated",
    "Magnetic",
    "Warm",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Dark Floral Luxury", "Sensual Sophistication", "Mysterious Elegance"],
  recommendedFor: [
    "Women seeking a sophisticated dark floral with fruit-bright contrast.",
    "Those who love sensual, mysterious florals built on orchid and creamy woods.",
    "Anyone wanting an autumn signature that transitions seamlessly from professional settings to intimate evenings.",
    "Fragrance collectors drawn to a black orchid heart grounded by mahogany wood.",
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
  subtitle      : "Dark Bloom",
  description   : "Dark florals—black orchid and lotus—bloom against pomegranate's tart opening, creating an immediate sense of intrigue. Cream and mahogany wood settle into the skin, anchoring the fragrance in warmth and shadow. Violet emerges as a whispered afterthought, tender against the deeper woods.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-amber",
    "black-orchid",
    "lotus-blossom",
    "pomegranate",
    "sensual",
    "mysterious",
    "luxurious",
    "mahogany-wood",
    "violet",
    "rich",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 3,
  warmth        : 4,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // All pairings cleared pending promotion-time verification (Wave 9 policy).
  // Factory RelationshipProducer suggestions are recorded unverified in
  // catalogue-expansion-ledger.json → pending_relationship_proposals (batch2). Reciprocity
  // would require edits to native counterpart records; none are activated here.
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};

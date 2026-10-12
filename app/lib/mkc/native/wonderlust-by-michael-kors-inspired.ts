// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — wonderlust-by-michael-kors-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-11T19:36:27.189Z
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

export const wonderlustByMichaelKorsInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "wonderlust-by-michael-kors-inspired",
  slug          : "wonderlust-by-michael-kors-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Wonderlust by Michael Kors Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  // REVISED 2026-10-12 (W9-B3-P1) from adapter output for profile "Floral Amber Gourmand".
  // Previous: family ["Floral", "Woody", "Spicy"] (scentCharacter unchanged).
  family        : ["Gourmand", "Floral", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Amber Gourmand",  // previous: "Floral Spicy Woody"; Debenhams "Amber, Gourmand", Lookfantastic "Floral Amber"
  season        : "Autumn",
  notes: {
    // REVISED 2026-10-12 (W9-B3-P1): full pyramid per debenhams.com ("Sold & Delivered by Debenhams") and
    // lookfantastic.com (identical lists). PYRAMID_SECONDARY_SUPPORTED. Nordstrom key notes and Macy's reported notes
    // are subsets. PREVIOUS (preserved): Nordstrom key notes only — Italian Bergamot / Jasmine Grandiflorum /
    // Sri Lankan Sandalwood. See wave-9-source-evidence.json (revision 9).
    top:   ["Italian Bergamot", "Sicilian Mandarin", "Almond Milk", "Pink Pepper"],
    heart: ["Jasmine Grandiflorum Absolute", "Dianthus", "Jasmine Sambac Absolute", "Heliotrope"],
    base:  ["Cashmeran Wood", "Siam Benzoin", "Sri Lankan Sandalwood"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Sensual Sophisticated",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Sensual",
    "Warm",
    "Elegant",
    "Confident",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Sophisticated Floral Amber", "Warm Sensual Clarity", "Modern Feminine Luxury"],  // previous: "Sophisticated Floral Spice"
  recommendedFor: [
    "Women seeking a sophisticated floral wrapped in creamy amber warmth.",
    "Those who love jasmine's creamy sensuality grounded by warm sandalwood.",
    "Anyone building a signature autumn fragrance around soft almond, jasmine and creamy amber warmth.",
    "Women drawn to creamy amber florals who appreciate clarity and refinement in their scent wardrobe.",
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
  subtitle      : "Warm Sensual Clarity",
  // Description REVISED 2026-10-12 to the full pyramid. Previous description covered bergamot, jasmine grandiflorum
  // and sandalwood only (preserved in the W9-B3-P1 pre-edit backup and the review bundle).
  description   : "Italian bergamot and Sicilian mandarin open brightly, softened by almond milk and a touch of pink pepper. Jasmine, dianthus and heliotrope form a creamy floral heart, before cashmeran, benzoin and Sri Lankan sandalwood settle into a warm, ambered base.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "jasmine",
    "sandalwood",
    "bergamot",
    "gourmand",
    "amber",
    "sophisticated",
    "sensual",
    "warm",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Floral Amber Gourmand", season="Autumn") — REVISED 2026-10-12.
  // Previous (profile "Floral Spicy Woody"): sweetness 2, freshness 3, warmth 4, intensity 3, versatility 3.
  sweetness     : 4,
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

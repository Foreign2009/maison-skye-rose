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

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

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
  family        : ["Floral", "Woody", "Spicy"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Spicy Woody",
  season        : "Autumn",
  notes: {
    top:   ["Italian Bergamot"],
    heart: ["Jasmine Grandiflorum"],
    base:  ["Sri Lankan Sandalwood"],
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
  signatureStyle: ["Sophisticated Floral Spice", "Warm Sensual Clarity", "Modern Feminine Luxury"],
  recommendedFor: [
    "Women seeking a sophisticated floral that transitions seamlessly from professional settings to intimate evenings.",
    "Those who love jasmine's creamy sensuality grounded by warm sandalwood.",
    "Anyone building a signature autumn fragrance that feels luxurious without being heavy or cloying.",
    "Women drawn to spiced florals who appreciate clarity and refinement in their scent wardrobe.",
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
  description   : "Italian bergamot opens with bright clarity before yielding to a heart of jasmine grandiflorum, creamy and warmly spiced in character. Sri Lankan sandalwood settles beneath it, creating a fragrance that feels both sensual and restrained.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "jasmine",
    "sandalwood",
    "bergamot",
    "spicy",
    "woody",
    "sophisticated",
    "sensual",
    "warm",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
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

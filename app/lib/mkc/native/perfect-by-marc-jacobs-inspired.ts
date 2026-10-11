// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — perfect-by-marc-jacobs-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-11T19:35:55.387Z
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

export const perfectByMarcJacobsInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "perfect-by-marc-jacobs-inspired",
  slug          : "perfect-by-marc-jacobs-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Perfect by Marc Jacobs Inspired",
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
  season        : "Spring",
  notes: {
    top:   ["Rhubarb", "Daffodil"],
    heart: ["Almond Milk"],
    base:  ["Cashmeran"],
  },
  notesEvidenceLocked: true,
  mood          : "Playful Bright Modern",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Playful",
    "Bright",
    "Modern",
    "Warm",
    "Soft",
  ],
  occasions     : ["Daily Wear", "Office", "Weekend", "Wedding"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Modern Floral Softness", "Bright Creamy Signature"],
  recommendedFor: [
    "Women seeking a modern floral signature that feels fresh and approachable for everyday wear",
    "Those who love creamy almond and warm wood but want bright, playful opening moments",
    "Anyone looking for a balanced fragrance that transitions effortlessly from office to weekend occasions",
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
  subtitle      : "Bright Softness",
  description   : "Tart rhubarb and green daffodil open with spring's first bright energy. Almond milk softens the heart into something creamy and intimate, while cashmeran anchors the whole composition in warm, modern skin-like comfort. Playful without pretense—a fragrance that feels like smiling.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "woody",
    "almond-milk",
    "cashmeran",
    "rhubarb",
    "daffodil",
    "balanced",
    "signature",
    "spring",
    "playful",
    "modern",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 3,
  intensity     : 2,
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

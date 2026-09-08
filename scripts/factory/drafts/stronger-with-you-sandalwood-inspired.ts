// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — stronger-with-you-sandalwood-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-07T18:26:45.305Z
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

export const strongerWithYouSandalwoodInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "stronger-with-you-sandalwood-inspired",
  slug          : "stronger-with-you-sandalwood-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Stronger With You Sandalwood Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Woody",
  season        : "Autumn",
  notes: {
    top:   ["Saffron"],
    heart: ["Lavender", "Chestnut"],
    base:  ["Sandalwood", "Vanilla", "Cedarwood"],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Spiced Woody",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Confident",
    "Sophisticated",
    "Sensual",
    "Grounded",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Evening"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Woody Signature", "Balanced Oriental", "Spiced Elegance"],
  recommendedFor: [
    "Men who want a warm, spiced signature that evolves throughout the day and deepens with wear",
    "Those seeking an approachable woody fragrance that bridges office professionalism and intimate evenings",
    "Anyone drawn to saffron and sandalwood but preferring balanced warmth over heavy oriental intensity",
    "Men building a refined collection who need a versatile autumn anchor that pairs with fresher daytime fragrances",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "/images/blue-5ml.png",
    "10ml": "/images/blue-10ml.png",
    "30ml": "/images/glass-blue-30ml.png",
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Warm Spiced Woody",
  description   : "Saffron unfolds into a spiced heart of lavender and chestnut, grounding into creamy sandalwood and cedarwood. Warm, woody, and quietly confident—a fragrance that deepens as the day ages.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "woody",
    "oriental",
    "sandalwood",
    "saffron",
    "lavender",
    "vanilla",
    "cedarwood",
    "warm",
    "signature",
    "versatile",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["stronger-with-you-inspired", "spicebomb-extreme-inspired"],
    wardrobePartners: ["sauvage-inspired", "bleu-de-chanel-inspired"],
  },
};

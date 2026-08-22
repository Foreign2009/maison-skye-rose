// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — oud-sapparot-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-22T18:53:06.804Z
// Factory version:   0.5.0
// Prompt versions:   EditorialProducer@1.1.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
// Validation status: FAIL  [3 error(s), 0 warning(s)]
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

export const oudSapparotInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "oud-sapparot-inspired",
  slug          : "oud-sapparot-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Oud Sapparot Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Woody",
  season        : "Autumn",
  notes: {
    top:   ["Thai Pineapple", "Cambodian Oud", "Indian Saffron"],
    heart: ["Dark Leather", "Smoky Silver Birch", "Ceylon Cinnamon"],
    base:  ["Sweet Vanilla", "Mexican Coconut", "White Musk"],
  },
  notesEvidenceLocked: true,
  mood          : "Rich Oud Tropical",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Mysterious",
    "Warm",
    "Powerful",
    "Sensual",
    "Artistic",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Formal"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Tropical Oud Luxury", "Dark Spiced Oriental", "Balanced Intensity"],
  recommendedFor: [
    "Those seeking a sophisticated oud fragrance that bridges tropical brightness with dark, resinous depth for evening and special occasions",
    "Unisex fragrance enthusiasts who want bold spice and leather without sacrifice of warmth or approachability",
    "Confident wearers looking for a signature that commands attention in professional settings while remaining elegant and composed",
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
  subtitle      : "Tropical Oud Intensity",
  description   : "Thai pineapple and oud open together—bright fruit meeting resinous depth—then give way to dark leather, smoky birch, and spiced cinnamon. Vanilla and coconut settle beneath, creating a fragrance that moves between tropical warmth and woody depth—neither fully sweet nor austere, but tensioned between both.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oud",
    "woody",
    "oriental",
    "leather",
    "saffron",
    "cinnamon",
    "vanilla",
    "unisex",
    "signature-scent",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],

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
    alternatives:     ["oud-mood-inspired", "oud-for-greatness-inspired"],
    wardrobePartners: ["aventus-inspired", "spicebomb-extreme-inspired"],
  },
};

// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — versace-rose-flamboyante-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-07T18:25:28.183Z
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

export const versaceRoseFlamboyanteInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "versace-rose-flamboyante-inspired",
  slug          : "versace-rose-flamboyante-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Versace Rose Flamboyante Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Floral", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Woody",
  season        : "Autumn",
  notes: {
    top:   ["Cardamom", "Mandarin Orange"],
    heart: ["Rose", "Patchouli", "Geranium"],
    base:  ["Musk", "Cedar", "Vetiver"],
  },
  notesEvidenceLocked: true,
  mood          : "Bold Floral Woody",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bold",
    "Elegant",
    "Sophisticated",
    "Warm",
    "Magnetic",
    "Artistic",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Casual"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Balanced Floral Woody", "Ardent Elegance", "Modern Rose Icon"],
  recommendedFor: [
    "Women seeking a confident floral that balances softness with earthy depth for professional and evening wear",
    "Anyone drawn to rose fragrances that prioritize structure and green woody grounding over sweetness",
    "Those who want a unisex signature that reads warm and sophisticated without gender conventions",
    "Men exploring bold florals with patchouli and cedar as a refined alternative to fresh masculines",
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
  subtitle      : "Ardent Floral Woods",
  description   : "Cardamom and mandarin ignite a bold floral heart where rose meets patchouli with green, earthy precision. Cedar and vetiver anchor the composition, grounding the florals in warm woods and musk that deepen as the fragrance settles on skin.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral-woody",
    "rose",
    "patchouli",
    "cardamom",
    "musk",
    "cedar",
    "vetiver",
    "balanced",
    "signature",
    "unisex",
    "autumn",
    "bold",
    "office",
    "date-night",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 3,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "baccarat-rouge-540-inspired"],
    wardrobePartners: ["sauvage-inspired", "ombre-nomade-inspired"],
  },
};

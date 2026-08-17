// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — bloom-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T16:08:06.811Z
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

export const bloomInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "bloom-inspired",
  slug          : "bloom-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Bloom Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["White Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "White Floral",
  season        : "Spring",
  notes: {
    top:   [],
    heart: [
      "Tuberose",
      "Jasmine Sambac",
      "Jasmine Bud",
      "Rangoon Creeper",
      "Orris Root",
    ],
    base:  [],
  },
  notesEvidenceLocked: true,
  mood          : "Romantic Feminine White Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Romantic",
    "Feminine",
    "Soft",
    "Sensual",
    "Elegant",
    "Delicate",
  ],
  occasions     : ["Daily Wear", "Wedding", "Evening", "Date Night"],
  seasons       : ["Spring"],
  signatureStyle: ["Creamy White Floral", "Romantic Signature", "Intimate Elegance"],
  recommendedFor: [
    "Women seeking a romantic white floral signature that feels creamy and intimate rather than sheer or austere",
    "Those who love tuberose and jasmine but want a softer, powdered sensuality with orris root grounding",
    "Brides and wedding guests looking for an elegant floral that transitions beautifully from ceremony to celebration",
    "Anyone drawn to balanced, moderately-projected florals that feel like a signature rather than a statement",
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
  subtitle      : "Creamy White Florals",
  description   : "Tuberose and jasmine sambac unfold with a creamy, almost indolic richness that feels more intimate than sheer. Orris root anchors the white florals in a soft, powdered sensuality—a fragrance that breathes rather than shouts.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "white-floral",
    "tuberose",
    "jasmine",
    "romantic",
    "feminine",
    "signature-scent",
    "spring",
    "wedding",
    "daily-wear",
    "orris",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["alien-inspired", "my-way-inspired"],
    wardrobePartners: ["delina-inspired"],
  },
};

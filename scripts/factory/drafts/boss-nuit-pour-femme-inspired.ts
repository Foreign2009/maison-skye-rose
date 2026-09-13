// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — boss-nuit-pour-femme-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-09-13T12:44:52.179Z
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

export const bossNuitPourFemmeInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "boss-nuit-pour-femme-inspired",
  slug          : "boss-nuit-pour-femme-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Boss Nuit Pour Femme Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral",
  season        : "Spring",
  notes: {
    top:   ["Aldehydes", "Peach"],
    heart: ["White Flowers", "Jasmine", "Violet"],
    base:  ["Sandalwood", "Moss"],
  },
  notesEvidenceLocked: true,
  mood          : "Soft Feminine Elegant",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Feminine",
    "Elegant",
    "Soft",
    "Luminous",
    "Sophisticated",
    "Refined",
  ],
  occasions     : ["Daily Wear", "Office", "Wedding", "Evening"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Luminous Floral", "Balanced Femininity", "Soft Signature"],
  recommendedFor: [
    "Women seeking a refined floral signature that transitions seamlessly from office to evening without heaviness",
    "Those who love violet and white florals but want measured elegance over dramatic intensity",
    "Anyone drawn to luminous, aldehydic openings that feel fresh yet distinctly feminine",
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
  subtitle      : "Luminous Violet",
  description   : "Aldehydes and peach open into a luminous heart of jasmine and violet, where white florals bloom with measured elegance. Sandalwood and moss ground the composition in soft warmth, creating a fragrance that whispers rather than declares.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "floral",
    "white-flowers",
    "jasmine",
    "violet",
    "aldehydes",
    "peach",
    "sandalwood",
    "feminine",
    "elegant",
    "signature-scent",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

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
    alternatives:     ["coco-mademoiselle-inspired", "chance-inspired", "miss-dior-inspired"],
    wardrobePartners: ["sauvage-inspired", "bleu-de-chanel-inspired"],
  },
};

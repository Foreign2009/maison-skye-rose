// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — eladaria-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:39:05.723Z
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

export const eladariaInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "eladaria-inspired",
  slug          : "eladaria-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Eladaria Inspired",
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
    top:   ["Pink Pepper", "Mandarin Orange", "Bergamot"],
    heart: ["Rose", "Powdery Notes", "Peony", "Lily of the Valley"],
    base:  ["Musk", "Ambroxan", "Cashmere Wood", "Vanilla"],
  },
  notesEvidenceLocked: true,
  mood          : "Powdery Floral",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Soft",
    "Bright",
    "Romantic",
    "Sophisticated",
    "Feminine",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Wedding",
    "Date Night",
    "Casual",
  ],
  seasons       : ["Spring"],
  signatureStyle: ["Powdered Rose Elegance", "Luminous Floral Signature", "Refined Spring Garden"],
  recommendedFor: [
    "Women seeking a refined rose fragrance that feels sophisticated yet approachable for everyday wear",
    "Those who love powdery florals with luminous citrus brightness rather than heavy sweetness",
    "Anyone looking for a signature spring scent that transitions seamlessly from office to special occasions",
    "Fragrance lovers who appreciate balanced compositions where rose shares the spotlight with complementary florals",
  ],

  // ── Merchandising ───────────────────────────────────────────────────────────
  prices: {
    "5ml":  60,
    "10ml": 100,
    "30ml": 250,
  },
  images: {
    "5ml":  "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 5ml is required
    "10ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 10ml is required
    "30ml": "",  // FACTORY_ERROR: IMAGE_MISSING — image path for 30ml is required
  },
  bestSeller    : false,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Powdered Rose Garden",
  description   : "Pink pepper and mandarin ignite a luminous opening that dissolves into a powdered rose garden—peony and lily of the valley create an airy, almost whispered floral heart. Musk and cashmere wood anchor the composition with soft warmth, allowing the fragrance to settle into a gentle second skin.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "rose",
    "peony",
    "feminine",
    "spring",
    "signature-scent",
    "powdery",
    "wedding",
    "daily-wear",
    "balanced",
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
    alternatives:     ["delina-inspired", "chance-eau-tendre-inspired", "mon-paris-inspired"],
    wardrobePartners: ["bleu-de-chanel-inspired"],
  },
};

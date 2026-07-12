// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — miss-dior-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-12T21:04:22.104Z
// Factory version:   0.4.0
// Prompt versions:   CompositionProducer@1.0.0  EditorialProducer@1.0.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0
// Validation status: FAIL  [1 error(s), 0 warning(s)]
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

export const missDiorInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "miss-dior-inspired",
  slug          : "miss-dior-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Miss Dior Inspired",
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
    top:   ["Bergamot", "Rose", "Pink Pepper"],
    heart: ["Peony", "Jasmine Sambac", "Iris Root"],
    base:  ["Vanilla Bourbon", "Cedarwood", "Musk Ambroxan"],
  },
  mood          : "Elegant feminine florals with playful luxury.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : ["Feminine", "Elegant", "Playful", "Luxury"],
  occasions     : ["Daily Wear", "Wedding"],
  seasons       : ["Spring"],
  signatureStyle: ["Soft Luxury"],
  recommendedFor: [],  // FACTORY_ERROR: RECOMMENDED_FOR_MIN — minimum 2 recommendedFor values required (found 0)

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
  bestSeller    : true,
  newArrival    : false,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Radiant Elegance",
  description   : "A burst of bergamot and pink pepper frames a luminous rose, immediately elegant and alive. The heart deepens into peony and jasmine sambac—a creamy, full-bodied florality that hovers between whisper and declaration. Vanilla bourbon and cedarwood anchor the composition with warmth, never saccharine, revealing a fragrance as refined as it is radiant.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-fundamentals", "fragrance-families", "the-note-pyramid"],
  educationTags : [
    "floral",
    "rose",
    "peony",
    "jasmine",
    "bergamot",
    "feminine",
    "elegant",
    "signature-scent",
    "spring",
    "luxury",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 2,
  versatility   : 3,
  popularity    : 10,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["sauvage-inspired", "bleu-de-chanel-inspired"],
  },
};

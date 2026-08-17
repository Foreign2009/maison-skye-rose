// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — bright-crystal-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:07:48.173Z
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

export const brightCrystalInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "bright-crystal-inspired",
  slug          : "bright-crystal-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Bright Crystal Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fruity"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Fruity",
  season        : "Spring",
  notes: {
    top:   ["Yuzu", "Pomegranate", "Caramelized Red Fruits", "Ice Accord"],
    heart: ["Lotus Flower", "Magnolia", "Peony"],
    base:  ["Amber Woods", "Acajou", "Ambrox Super", "Musk"],
  },
  mood          : "Fresh Feminine Elegant",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Feminine",
    "Elegant",
    "Fresh",
    "Radiant",
    "Bright",
    "Sophisticated",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Weekend",
    "Date Night",
    "Wedding",
  ],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Luminous Floral Fruity", "Modern Feminine Elegance", "Radiant Everyday Signature"],
  recommendedFor: [
    "Women seeking a luminous everyday fragrance that feels both fresh and refined without heaviness",
    "Those who love fruity-floral fragrances that balance brightness with elegance and warmth",
    "Anyone looking for a signature scent that transitions effortlessly from daily wear to special occasions",
    "Women drawn to crystalline, juicy florals with subtle sophistication and moderate projection",
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
  subtitle      : "Radiant Clarity",
  description   : "Yuzu and pomegranate burst open against a crystalline ice accord, catching light like morning dew on petals. Lotus and peony unfold at the heart, their subtle sweetness balanced by warm amber woods and precious musks that ground the composition without weight.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "floral",
    "fruity",
    "yuzu",
    "peony",
    "magnolia",
    "feminine",
    "elegant",
    "signature-scent",
    "spring",
    "daily-wear",
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
    alternatives:     ["delina-inspired", "mon-paris-inspired", "chance-eau-tendre-inspired"],
    wardrobePartners: ["crystal-noir-inspired", "baccarat-rouge-540-inspired"],
  },
};

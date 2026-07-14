// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — armani-si-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:30:18.398Z
// Factory version:   0.5.0
// Prompt versions:   CompositionProducer@1.0.0  EditorialProducer@1.0.0  RelationshipProducer@1.0.0  EducationProducer@1.0.0  DiscoveryProducer@1.0.0
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

export const armaniSiInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "armani-si-inspired",
  slug          : "armani-si-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Armani Si Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Fruity", "Amber"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Chypre Fruity",
  season        : "All Season",
  notes: {
    top:   ["Blackcurrant", "Bergamot", "Pink Pepper"],
    heart: ["Rose Absolute", "Freesia", "Ambroxan"],
    base:  ["Vanilla", "Patchouli", "Musk"],
  },
  mood          : "Graceful and sophisticated.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Graceful",
    "Elegant",
    "Warm",
    "Confident",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Weekend"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Italian Elegance", "Fruity Sophistication", "Modern Rose Icon"],
  recommendedFor: [
    "Women seeking a sophisticated daily signature that transitions seamlessly from office to evening without reapplication.",
    "Those who love rose-centered fragrances but prefer fruity brightness and amber warmth over traditional florals.",
    "Anyone building a refined fragrance wardrobe who wants one versatile piece that pairs beautifully with both fresh and spiced complementary scents.",
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
  subtitle      : "Radiant Restraint",
  description   : "Blackcurrant and bergamot open with a whisper of pink pepper, giving way to a heart of rose absolute and freesia that unfolds with measured grace. Vanilla and patchouli anchor the composition, creating a chypre that feels both luminous and grounded—a fragrance that moves through the day without announcement.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "fruity",
    "amber",
    "rose",
    "blackcurrant",
    "chypre",
    "sophisticated",
    "long-wearing",
    "layering",
    "office",
    "daily-wear",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 2,
  warmth        : 4,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired"],
    wardrobePartners: ["aventus-inspired", "spicebomb-extreme-inspired"],
  },
};

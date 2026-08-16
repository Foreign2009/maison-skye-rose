// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — voyage-d'hermes-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:10:07.427Z
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

export const voyageDhermesInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "voyage-d'hermes-inspired",
  slug          : "voyage-d'hermes-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Voyage d'Hermes Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Fresh", "Woody"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Fresh",
  season        : "Summer",
  notes: {
    top:   ["Cardamom", "Amalfi Lemon", "Spices", "Juniper Berries"],
    heart: ["Tea", "Green Notes", "Floral Notes"],
    base:  ["Woodsy Notes", "Musk", "Cedar"],
  },
  mood          : "Fresh Woody Clean",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Fresh",
    "Clean",
    "Sophisticated",
    "Bright",
    "Artistic",
    "Elegant",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Weekend",
    "Vacation",
    "Travel",
  ],
  seasons       : ["Summer", "Spring"],
  signatureStyle: ["Fresh Woody Clarity", "Summer Sophistication", "Modern Traveler"],
  recommendedFor: [
    "Men seeking a fresh woody signature that feels sophisticated without heaviness, perfect for summer travel and daily wear.",
    "Those who appreciate mineral clarity and green tea undertones over sweetness or spice-forward compositions.",
    "Anyone looking for a moderate projection fragrance that works equally well in office settings and weekend getaways.",
    "Fragrance explorers who want to experience the Hermès aesthetic of clarity and motion in a wearable, accessible form.",
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
  subtitle      : "Clarity in Motion",
  description   : "Cardamom and Amalfi lemon open with a bright, almost mineral clarity, grounded immediately by juniper and spice. A current of green tea and cedar unfolds beneath, creating a fragrance that feels like stepping into a sun-drenched wood—clean, slightly austere, utterly composed. Warm musk settles the composition into skin, neither floral nor heavy, just essential.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "occasions-and-style", "the-note-pyramid"],
  educationTags : [
    "fresh",
    "woody",
    "cardamom",
    "cedar",
    "lemon",
    "citrus",
    "tea",
    "green",
    "musk",
    "summer",
    "daily-wear",
    "clean",
    "light",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 3,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["sauvage-inspired", "terre-d'hermes-inspired", "imagination-inspired"],
    wardrobePartners: ["sauvage-elixir-inspired", "ombre-nomade-inspired"],
  },
};

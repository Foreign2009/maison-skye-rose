// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — godolphin-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T17:12:23.363Z
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

export const godolphinInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "godolphin-inspired",
  slug          : "godolphin-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Godolphin Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Floral", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Woody Floral",
  season        : "Autumn",
  notes: {
    top:   [
      "Thyme",
      "Saffron",
      "Cypress",
      "Green Notes",
      "Fruity Notes",
      "Mate",
    ],
    heart: ["Rose", "Iris", "Jasmine"],
    base:  [
      "Leather",
      "Vetiver",
      "Cedar",
      "Musk",
      "Amber",
      "Vanilla",
    ],
  },
  mood          : "Woody Oriental Masculine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Warm",
    "Sophisticated",
    "Earthy",
    "Masculine",
    "Mature",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Woody Oriental Masculine", "Leather & Iris Elegance", "Refined Earthiness"],
  recommendedFor: [
    "Men seeking a refined woody oriental that balances floral elegance with leather and earth—perfect for transitional seasons and refined evenings.",
    "Those who appreciate rose and iris in a masculine context and want depth without sweetness or excessive projection.",
    "Anyone building a signature collection who needs a sophisticated autumn fragrance that works in both professional and intimate settings.",
    "Confident men drawn to orientals with character—warm, slightly spiced, and grounded in leather and vetiver rather than vanilla or musk.",
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
  subtitle      : "Leather & Iris",
  description   : "Opens with thyme and saffron—herbaceous, slightly green—before rose and iris settle into a warm, leathered base of cedar and vetiver. This is a fragrance that moves between elegance and earthiness, masculine without apology, unfolding with the quiet confidence of autumn itself.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "oriental-woody",
    "floral",
    "rose",
    "jasmine",
    "iris",
    "leather",
    "vetiver",
    "cedar",
    "signature-scent",
    "autumn",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["prada-l'homme-inspired", "valentino-uomo-born-in-roma-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "oud-cadenza-inspired"],
  },
};

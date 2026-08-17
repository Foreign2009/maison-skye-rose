// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — alien-man-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-16T18:51:22.706Z
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

export const alienManInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "alien-man-inspired",
  slug          : "alien-man-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Alien Man Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Woody",
  season        : "Autumn",
  notes: {
    top:   [
      "Anise",
      "Dill",
      "Mint",
      "Lavender",
      "Beech",
      "Thyme",
      "Lemon",
    ],
    heart: [
      "Leather",
      "Cashmere Wood",
      "Osmanthus",
      "Pepper",
      "Geranium",
    ],
    base:  ["White Amber", "Cashmeran", "Vanilla"],
  },
  mood          : "Aromatic Spicy Masculine",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Confident",
    "Warm",
    "Magnetic",
    "Mature",
    "Intense",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Aromatic Spice", "Warm Leather Signature", "Sophisticated Oriental Woody"],
  recommendedFor: [
    "Men seeking a sophisticated aromatic signature that balances green freshness with warm spice for professional and social settings",
    "Those who appreciate leather and amber depth without sweetness—a mature, grounded masculine with personality",
    "Anyone drawn to anise and herbal top notes followed by sensual base warmth for layered, memorable presence",
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
  subtitle      : "Anise & Leather",
  description   : "Opens with anise and mint that cut sharp and clean, a green aromatic pulse that gives way to leather and pepper in the heart. White amber and cashmeran create a warm, almost tactile base—soft enough to breathe, structured enough to hold its ground.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "woody",
    "oriental",
    "leather",
    "amber",
    "anise",
    "lavender",
    "signature-scent",
    "office-wear",
    "date-night",
    "autumn",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],

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
    alternatives:     ["sauvage-elixir-inspired", "oud-wood-inspired"],
    wardrobePartners: ["sauvage-inspired"],
  },
};

// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — libre-le-parfum-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:30:00.795Z
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

import type { FragranceKnowledge } from "../../../app/lib/mkc/types";

export const libreLeParfumInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "libre-le-parfum-inspired",
  slug          : "libre-le-parfum-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Libre Le Parfum Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Amber"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Floral",
  season        : "Winter",
  notes: {
    top:   ["Lavender", "Grapefruit", "Pink Pepper"],
    heart: ["Honey", "Rose Absolute", "Amber"],
    base:  ["Vanilla", "Sandalwood", "Musk"],
  },
  mood          : "Powerful and elegant.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Powerful",
    "Elegant",
    "Warm",
    "Confident",
    "Sophisticated",
    "Intense",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Amber Floral Authority", "Elegant Power", "Rich Sophistication"],
  recommendedFor: [
    "Women seeking a bold signature fragrance that commands attention without apology, perfect for evening wear and special occasions.",
    "Those who love rose but want it grounded in warmth and amber rather than presented fresh or romantic.",
    "Anyone looking for a long-wearing fragrance with moderate projection that feels both luxurious and effortlessly powerful.",
    "Women who dress for impact and choose fragrances that match their confident, authoritative presence.",
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
  subtitle      : "Radiant Authority",
  description   : "A bold rose anchored in warm honey and amber, opening with the sharp clarity of pink pepper and grapefruit before settling into a base of creamy vanilla and sandalwood. This is a fragrance that demands attention—radiant without softness, confident without apology. Lavender and musk create an austere elegance that lingers long after the first spray.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "amber-floral",
    "rose",
    "honey",
    "vanilla",
    "sandalwood",
    "winter",
    "elegant",
    "long-wearing",
    "date-night",
    "powerful",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 3,
  freshness     : 3,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["baccarat-rouge-540-inspired"],
  },
};

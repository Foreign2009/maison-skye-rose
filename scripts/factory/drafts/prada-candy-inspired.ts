// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — prada-candy-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-10-11T19:36:42.220Z
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

export const pradaCandyInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "prada-candy-inspired",
  slug          : "prada-candy-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Prada Candy Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  // REVISED 2026-10-12 (W9-B3-P2) from adapter output for profile "Amber Gourmand". Previous: ["Gourmand", "Spicy"].
  family        : ["Gourmand", "Amber"],
  scentCharacter: "Rich & Full-Bodied",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Amber Gourmand",  // previous: "Gourmand Spicy"; Lookfantastic "Amber Gourmand", Debenhams "Floral, Amber, Gourmand"
  season        : "Winter",
  notes: {
    top:   ["White Musk"],
    heart: ["Benzoin"],
    base:  ["Caramel Accord"],
    // UPDATE 2026-10-12 (W9-B3-P1): debenhams.com ("Sold & Delivered by Debenhams", major-retailer first-party)
    // lists Top "White Musk" / Heart "Benzoin" / Base "Caramel Accord" — matches -> PYRAMID_SECONDARY_SUPPORTED.
    // Debenhams family "Floral, Amber, Gourmand" recorded as an alternative; profile unchanged. See revision 9.
  },
  notesEvidenceLocked: true,
  mood          : "Playful Sensual Warm",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sensual",
    "Warm",
    "Playful",
    "Sophisticated",
    "Magnetic",
  ],
  occasions     : ["Date Night", "Evening", "Winter Evenings", "Casual"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Creamy Gourmand", "Sensual Warmth", "Playful Luxury"],
  recommendedFor: [
    "Women seeking a sensual winter signature that feels luxurious without pretension",
    "Anyone drawn to gourmand fragrances built around caramel and creamy benzoin",
    "Those planning intimate evenings who prefer playful confidence to heavy florals",
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
  subtitle      : "Creamy Warmth",
  // Description REVISED 2026-10-12 (W9-B3-P2): removed figurative wear wording ("settles into skin like a luxe second layer")
  // and the unsupported spice reference ("spiced with an undercurrent of subtle warmth"); no listed note is a spice.
  description   : "A gourmand embrace of warm caramel and creamy benzoin, softened by whispers of white musk. Playful and sensual, it pairs caramel sweetness with a soft, ambered warmth.",
  academyArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-layer-fragrances", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "occasions-and-style"],
  educationTags : [
    "gourmand",
    "amber",
    "caramel",
    "benzoin",
    "musk",
    "warm",
    "sensual",
    "winter",
    "date-night",
    "playful",
  ],
  learningPath  : ["guide-to-fragrance-families", "choosing-your-season-scent", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Scores derived by knowledgeAdapter.deriveMetrics(profile="Amber Gourmand", season="Winter") — unchanged from "Gourmand Spicy":
  // sweetness 4 (gourmand), freshness 2, warmth 4 (amber; previously spicy), intensity 4, versatility 2 (Winter).
  sweetness     : 4,
  freshness     : 2,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // All pairings cleared pending promotion-time verification (Wave 9 policy).
  // Factory RelationshipProducer suggestions are recorded unverified in
  // catalogue-expansion-ledger.json → pending_relationship_proposals (batch2). Reciprocity
  // would require edits to native counterpart records; none are activated here.
  relationships: {
    alternatives:     [],
    wardrobePartners: [],
  },
};

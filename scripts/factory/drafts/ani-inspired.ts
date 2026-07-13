// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — ani-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-07-13T18:28:28.383Z
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

export const aniInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "ani-inspired",
  slug          : "ani-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Ani Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Vanilla", "Woody"],
  scentCharacter: "Rich & Long Wearing",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Vanilla Woody",
  season        : "Winter",
  notes: {
    top:   ["Bergamot", "Vanilla", "Black Pepper"],
    heart: ["Ginger", "Cinnamon", "Rose Absolute"],
    base:  ["Sandalwood", "Amber", "Vanilla Tonka"],
  },
  mood          : "Elegant and smooth.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Elegant",
    "Warm",
    "Sophisticated",
    "Sensual",
    "Mature",
    "Magnetic",
  ],
  occasions     : ["Date Night", "Evening", "Formal", "Weekend"],
  seasons       : ["Winter", "Autumn"],
  signatureStyle: ["Vanilla Excellence", "Warm Sophistication", "Spiced Elegance"],
  recommendedFor: [
    "Men seeking a sophisticated vanilla fragrance that feels luxurious without sweetness, perfect for evening occasions and cooler months",
    "Those who appreciate warmth and spice layered with creamy amber and sandalwood for an intimate, refined presence",
    "Anyone looking for a signature winter fragrance that transitions seamlessly from date night to formal evening wear",
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
  subtitle      : "Warmth Refined",
  description   : "Bergamot and black pepper ignite a crystalline opening, softening into warming spice and rose absolute that curves toward intimate depth. Sandalwood and tonka vanilla emerge as a creamy, amber-tinged base that lingers like cashmere against skin.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "vanilla",
    "woody",
    "sandalwood",
    "amber",
    "spice",
    "ginger",
    "cinnamon",
    "warm",
    "winter",
    "elegant",
    "date-night",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 4,
  freshness     : 1,
  warmth        : 4,
  intensity     : 4,
  versatility   : 2,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["spicebomb-extreme-inspired", "layton-inspired"],
    wardrobePartners: ["sauvage-inspired", "aventus-inspired"],
  },
};

// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — blue-noir-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:06:02.265Z
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

export const blueNoirInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "blue-noir-inspired",
  slug          : "blue-noir-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Blue Noir Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Woody", "Musk"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Aromatic Woody Musk",
  season        : "Autumn",
  notes: {
    top:   ["Cypress", "Cardamom", "Bergamot", "Mandarin Orange"],
    heart: ["Iris", "Suede", "Musk"],
    base:  [
      "Sandalwood",
      "Tonka Bean",
      "Leather",
      "Vetiver",
      "Atlas Cedar",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Woody Musky",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Sophisticated",
    "Fresh",
    "Warm",
    "Elegant",
    "Contemplative",
    "Confident",
  ],
  occasions     : ["Daily Wear", "Office", "Date Night", "Weekend"],
  seasons       : ["Autumn", "Spring"],
  signatureStyle: ["Quiet Sophistication", "Aromatic Woody Elegance", "Modern Refined Masculinity"],
  recommendedFor: [
    "Men seeking a sophisticated everyday fragrance that balances fresh citrus with warm woody depth without being overtly sweet or heavy",
    "Those who appreciate quiet elegance—someone whose style speaks through restraint rather than projection",
    "Professionals and refined dressers who want a signature that works seamlessly from office to evening without adjustment",
    "Anyone drawn to aromatic woods and leather who prefers contemplative, skin-close wear over bold statements",
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
  subtitle      : "Quiet Sophistication",
  description   : "Cypress and cardamom open with crystalline precision, giving way to a heart of iris and suede that settles into skin like worn leather. Sandalwood and vetiver anchor the composition in cool, contemplative woods, while tonka bean adds a whisper of warmth beneath.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent", "how-to-layer-fragrances"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "aromatic",
    "woody",
    "musk",
    "cypress",
    "cardamom",
    "sandalwood",
    "leather",
    "signature",
    "autumn",
    "masculine",
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
    alternatives:     ["sauvage-elixir-inspired", "bleu-de-chanel-l'exclusif-inspired"],
    wardrobePartners: ["spicebomb-dark-leather-inspired", "ombre-nomade-inspired"],
  },
};

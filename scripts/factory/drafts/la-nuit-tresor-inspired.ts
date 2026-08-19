// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — la-nuit-tresor-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T18:35:44.589Z
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

export const laNuitTresorInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "la-nuit-tresor-inspired",
  slug          : "la-nuit-tresor-inspired",
  brand         : "Maison Skye & Rose",
  name          : "La Nuit Tresor Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Fruity"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Oriental Fruity",
  season        : "Autumn",
  notes: {
    top:   ["Pear", "Tangerine", "Bergamot"],
    heart: ["Strawberry", "Black Rose", "Vanilla Orchid", "Passionfruit"],
    base:  [
      "Praline",
      "Caramel",
      "Vanilla",
      "Litchi",
      "Patchouli",
      "Incense",
      "Coffee",
      "Licorice",
      "Coumarin",
      "Papyrus",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Sweet Dark Romantic",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Romantic",
    "Sensual",
    "Sophisticated",
    "Warm",
    "Mysterious",
    "Luxurious",
  ],
  occasions     : ["Date Night", "Evening", "Office", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Dark Fruit Luxury", "Romantic Gourmand", "Sensual Signature"],
  recommendedFor: [
    "Women seeking a signature fragrance that balances fruit sweetness with dark sensual depth for evening and intimate occasions.",
    "Those who love gourmand orientals with character — praline and caramel with an edge of black rose and patchouli.",
    "Anyone drawn to dark fruit luxury who wants presence without aggression, perfect for autumn nights and date scenarios.",
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
  subtitle      : "Dark Fruit Luxury",
  description   : "Pear and tangerine open into a voluptuous heart of black rose and strawberry, where vanilla orchid meets dark fruit warmth. Praline, caramel, and patchouli anchor the composition in gourmand depth, while incense and coffee add nocturnal mystery to skin.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "fruity",
    "oriental",
    "pear",
    "strawberry",
    "rose",
    "vanilla",
    "praline",
    "caramel",
    "romantic",
    "signature",
    "autumn",
    "layering",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 2,
  warmth        : 2,
  intensity     : 3,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["mon-paris-inspired", "delina-inspired", "oriana-inspired"],
    wardrobePartners: ["black-opium-inspired", "alien-inspired"],
  },
};

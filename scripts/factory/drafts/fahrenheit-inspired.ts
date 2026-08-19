// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — fahrenheit-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-19T19:03:06.630Z
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

export const fahrenheitInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "fahrenheit-inspired",
  slug          : "fahrenheit-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Fahrenheit Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Aromatic", "Woody"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Woody Aromatic",
  season        : "Autumn",
  notes: {
    top:   [
      "Nutmeg Flower",
      "Lavender",
      "Cedar",
      "Mandarin Orange",
      "Chamomile",
      "Bergamot",
      "Hawthorn",
      "Lemon",
    ],
    heart: [
      "Violet Leaf",
      "Nutmeg",
      "Cedar",
      "Sandalwood",
      "Carnation",
      "Honeysuckle",
      "Jasmine",
      "Lily of the Valley",
    ],
    base:  [
      "Leather",
      "Vetiver",
      "Musk",
      "Amber",
      "Patchouli",
      "Tonka Bean",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Warm Leather Woody",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Warm",
    "Sophisticated",
    "Magnetic",
    "Mature",
    "Elegant",
    "Confident",
  ],
  occasions     : ["Office", "Date Night", "Evening", "Weekend"],
  seasons       : ["Autumn", "Winter"],
  signatureStyle: ["Warm Leather Woody", "Balanced Signature", "Sophisticated Spice"],
  recommendedFor: [
    "Men seeking a sophisticated woody signature that bridges professional polish and intimate warmth",
    "Those who appreciate leather and spice as anchors for complexity rather than bombast",
    "Anyone building a curated collection who wants depth beyond fresh or sweet registers",
    "Men drawn to autumn evenings and the sensory language of suede, tobacco, and earth",
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
  subtitle      : "Warm Leather Woody",
  description   : "Nutmeg flower and bergamot open with mandarin brightness, then the composition deepens into a rich heart of violet leaf, sandalwood, and jasmine. Leather, vetiver, and amber anchor the base in warm, woody depth—a fragrance that feels like worn suede under autumn light.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-layer-fragrances", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "aromatic",
    "woody",
    "cedar",
    "vetiver",
    "leather",
    "lavender",
    "nutmeg",
    "masculine",
    "signature",
    "office",
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
    alternatives:     ["sauvage-elixir-inspired", "valentino-uomo-born-in-roma-inspired", "armani-code-parfum-inspired"],
    wardrobePartners: ["spicebomb-extreme-inspired", "sauvage-inspired"],
  },
};

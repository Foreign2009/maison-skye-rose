// ═════════════════════════════════════════════════════════════════
// FACTORY DRAFT — ck-one-inspired
// ─────────────────────────────────────────────────────────────────
// Generated:         2026-08-26T18:04:37.038Z
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

export const ckOneInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "ck-one-inspired",
  slug          : "ck-one-inspired",
  brand         : "Maison Skye & Rose",
  name          : "CK One Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Aromatic", "Citrus"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Citrus Aromatic",
  season        : "Spring",
  notes: {
    top:   [
      "Lemon",
      "Green Notes",
      "Bergamot",
      "Mandarin Orange",
      "Pineapple",
      "Cardamom",
      "Papaya",
    ],
    heart: [
      "Lily-of-the-Valley",
      "Jasmine",
      "Violet",
      "Rose",
      "Nutmeg",
      "Orris Root",
      "Freesia",
    ],
    base:  [
      "Green Accord",
      "Musk",
      "Cedar",
      "Green Tea",
      "Sandalwood",
      "Oakmoss",
      "Amber",
    ],
  },
  notesEvidenceLocked: true,
  mood          : "Fresh Clean Unisex",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Clean",
    "Fresh",
    "Bright",
    "Modern",
    "Soft",
    "Elegant",
  ],
  occasions     : ["Daily Wear", "Office", "Wedding", "Casual"],
  seasons       : ["Spring", "Summer"],
  signatureStyle: ["Unisex Citrus Clarity", "Fresh Luminous Aromatic", "Modern Clean Elegance"],
  recommendedFor: [
    "Anyone seeking a bright, unisex fragrance that works equally well for spring days and formal occasions without overwhelming presence",
    "Men and women who want a clean citrus that feels modern and minimalist rather than traditionally gendered",
    "Those transitioning into fragrances who appreciate clarity, lightness, and the comfort of fresh green tea and soft florals",
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
  subtitle      : "Bright Clarity",
  description   : "A radiant citrus aromatic that opens with bright lemon, bergamot, and a whisper of cardamom before softening into a luminous heart of lily-of-the-valley and jasmine. Green tea and cedarwood anchor the composition, creating a clean, unisex fragrance that feels both immediate and quietly refined.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "choosing-your-season-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "occasions-and-style"],
  educationTags : [
    "citrus",
    "aromatic",
    "unisex",
    "fresh",
    "light",
    "lemon",
    "bergamot",
    "spring",
    "daily-wear",
    "clean",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "choosing-your-season-scent", "how-to-wear-fragrance"],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 1,
  freshness     : 5,
  warmth        : 1,
  intensity     : 2,
  versatility   : 3,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["aqua-di-gio-inspired", "light-blue-inspired"],
    wardrobePartners: ["baccarat-rouge-540-inspired"],
  },
};

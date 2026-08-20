import type { FragranceKnowledge } from "../types";

export const monParisInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "mon-paris-inspired",
  slug          : "mon-paris-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Mon Paris Inspired",
  collection    : "Rose",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "female",
  family        : ["Floral", "Fruity"],
  scentCharacter: "Balanced Signature",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fruity Floral",
  season        : "All Season",
  notes: {
    top:   ["Strawberry", "Bergamot", "Pink Pepper"],
    heart: ["Jasmine Absolute", "Red Rose Absolute", "Peony"],
    base:  ["Patchouli", "Vanilla Bourbon", "Musk Ambrette"],
  },
  mood          : "Sweet and passionate.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Romantic",
    "Confident",
    "Warm",
    "Sensual",
    "Elegant",
    "Modern",
  ],
  occasions     : [
    "Daily Wear",
    "Office",
    "Date Night",
    "Weekend",
    "Evening",
  ],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Fruity Floral Sophistication", "Radiant Signature", "Balanced Feminine"],
  recommendedFor: [
    "Women seeking a balanced fruity-floral signature that transitions seamlessly from office to evening",
    "Those who love strawberry and rose but want sophistication over sweetness",
    "Anyone building a signature collection who values warmth, sensuality, and everyday wearability",
    "Women drawn to Parisian elegance who want radiant confidence without intensity",
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
  subtitle      : "Radiant Desire",
  description   : "Strawberry and bergamot ignite with a whisper of pink pepper, then dissolve into a heart of jasmine and red rose—sensual, not cloying. Vanilla bourbon and patchouli anchor the composition with warmth, creating a fragrance that feels both luminous and grounded, equally at home in daylight or after dark.",
  academyArticleIds: [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "weekend-and-casual-fragrances",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
  ],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "fruity-floral",
    "strawberry",
    "rose",
    "jasmine",
    "peony",
    "vanilla",
    "signature-scent",
    "balanced",
    "everyday-wear",
    "office",
  ],
  learningPath  : [
    "the-note-pyramid-explained",
    "guide-to-fragrance-families",
    "the-world-of-floral-fragrances",
    "office-and-professional-fragrances",
    "what-makes-a-signature-scent",
  ],

  // ── Intelligence ────────────────────────────────────────────────────────────
  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.
  sweetness     : 2,
  freshness     : 3,
  warmth        : 2,
  intensity     : 3,
  versatility   : 5,
  popularity    : 5,

  // ── Relationships ────────────────────────────────────────────────────────────
  // REVIEW: Verify each suggestion and update the counterpart record symmetrically.
  relationships: {
    alternatives:     ["delina-inspired", "bright-crystal-inspired", "coach-floral-inspired", "fresh-blossom-inspired", "my-way-ylang-inspired", "oriana-inspired", "si-passione-red-musk-inspired", "twilly-d'hermes-inspired", "rose-n'-roses-inspired", "english-pear-freesia-inspired"],
    wardrobePartners: ["sauvage-inspired", "rose-of-no-man's-land-inspired"],
  },
};

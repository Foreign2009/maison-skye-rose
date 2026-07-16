import type { FragranceKnowledge } from "../types";

export const afternoonSwimInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "afternoon-swim-inspired",
  slug          : "afternoon-swim-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Afternoon Swim Inspired",
  collection    : "Skye",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "male",
  family        : ["Citrus", "Fresh"],
  scentCharacter: "Fresh & Light",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Fresh Citrus",
  season        : "Summer",
  notes: {
    top:   ["Blood Orange", "Neroli", "Galbanum"],
    heart: ["Bergamot", "Petrichor Accord", "White Tea"],
    base:  ["Ambroxan", "Sandalwood", "Musk"],
  },
  mood          : "Bright and energetic.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bright",
    "Fresh",
    "Grounded",
    "Modern",
    "Energetic",
    "Clean",
  ],
  occasions     : ["Daily Wear", "Casual", "Weekend", "Vacation"],
  seasons       : ["Summer"],
  signatureStyle: ["Summer Arrival", "Grounded Citrus", "Bright & Earthy"],
  recommendedFor: [
    "Men seeking a bright, grounded citrus for summer days that feels present rather than escapist.",
    "Those who want a fresh fragrance with real depth—bergamot and petrichor that ground the brightness.",
    "Anyone looking for a moderately projecting everyday summer fragrance that works from casual to smart-casual.",
    "Men who pair citrus with clean minimalism and appreciate white tea's subtle sophistication.",
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
  subtitle      : "Bright Arrival",
  description   : "Blood orange and neroli open with a bright, almost salt-tinged clarity, while petrichor and white tea anchor the heart in something more grounded—less escape, more arrival. Ambroxan and sandalwood dry down to skin-warm amber, creating a fragrance that feels both energized and intimate.",
  academyArticleIds: ["guide-to-fragrance-families", "choosing-your-season-scent", "the-note-pyramid-explained", "how-to-wear-fragrance"],
  academyCategories: ["fragrance-families", "occasions-and-style", "the-note-pyramid"],
  educationTags : [
    "citrus",
    "fresh",
    "blood-orange",
    "neroli",
    "bergamot",
    "summer",
    "daily-wear",
    "light",
    "clean",
    "aquatic",
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
    alternatives:     ["aqua-di-gio-inspired", "imagination-inspired", "invictus-inspired"],
    wardrobePartners: ["sauvage-inspired", "prada-l'homme-inspired"],
  },
};

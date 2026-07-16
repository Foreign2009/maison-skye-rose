import type { FragranceKnowledge } from "../types";

export const hibiscusMahajadInspired: FragranceKnowledge = {
  // ── Identity ──────────────────────────────────────────────────────────────────
  id            : "hibiscus-mahajad-inspired",
  slug          : "hibiscus-mahajad-inspired",
  brand         : "Maison Skye & Rose",
  name          : "Hibiscus Mahajad Inspired",
  collection    : "Elite",
  catalogVersion: "1.0",
  status        : "active",

  // ── Classification ────────────────────────────────────────────────────────────
  gender        : "unisex",
  family        : ["Leather", "Floral"],
  scentCharacter: "Deep & Intense",
  projection    : "moderate",

  // ── Composition ─────────────────────────────────────────────────────────────
  profile       : "Floral Leather",
  season        : "All Season",
  notes: {
    top:   ["Hibiscus Absolute", "Pink Pepper", "Bergamot"],
    heart: ["Rose Absolute", "Iris Root", "Opoponax"],
    base:  ["Leather Accord", "Vetiver", "Amber Gris"],
  },
  mood          : "Bold artistic elegance.",

  // ── Discovery ───────────────────────────────────────────────────────────────
  vibe          : [
    "Bold",
    "Artistic",
    "Elegant",
    "Magnetic",
    "Sophisticated",
    "Intense",
  ],
  occasions     : ["Daily Wear", "Office", "Evening", "Date Night"],
  seasons       : ["Spring", "Summer", "Autumn", "Winter"],
  signatureStyle: ["Floral Leather Defiance", "Niche Artistic Elegance", "Unisex Statement"],
  recommendedFor: [
    "Those who seek a bold artistic statement that defies conventional fragrance boundaries—combining floral beauty with unexpected leather depth",
    "Women and men drawn to niche luxury who want a signature that sparks conversation and reflects their sophisticated taste",
    "Anyone looking for an all-season fragrance that transitions effortlessly from creative workspaces to evening occasions without softening its edge",
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
  newArrival    : true,

  // ── Education ───────────────────────────────────────────────────────────────
  subtitle      : "Floral Defiance",
  description   : "Hibiscus absolute opens with a sharp floral declaration, cut through pink pepper and bergamot into an iris-centered heart of rose and resinous opoponax. Leather grounds the composition—not aggressive, but present—while vetiver and ambroxan create a warm, textured finish that feels both intimate and artistic.",
  academyArticleIds: ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "what-makes-a-signature-scent"],
  academyCategories: ["fragrance-families", "the-note-pyramid", "wear-and-application"],
  educationTags : [
    "leather",
    "floral",
    "rose",
    "iris",
    "unisex",
    "bold",
    "vetiver",
    "amber",
    "office-wear",
    "signature-scent",
  ],
  learningPath  : ["guide-to-fragrance-families", "the-note-pyramid-explained", "how-to-wear-fragrance", "what-makes-a-signature-scent"],

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
    alternatives:     ["baccarat-rouge-540-inspired"],
  },
};

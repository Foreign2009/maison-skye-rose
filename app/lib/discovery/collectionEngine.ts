import type { FragranceKnowledge } from "../mkc/types";
import type { CollectionSpec, CollectionFilter, CollectionBoost } from "./types";
import { mkcCatalogue } from "../mkc/catalogue";

// ── Filter matching ───────────────────────────────────────────────────────────

function matchesFilter(
  k: FragranceKnowledge,
  f: CollectionFilter
): boolean {
  switch (f.type) {
    case "family":         return k.family.includes(f.value);
    case "occasion":       return k.occasions.includes(f.value);
    case "season":         return k.season === f.value;
    case "scentCharacter": return k.scentCharacter === f.value;
    case "collection":     return k.collection === f.value;
    case "bestSeller":     return k.bestSeller;
    case "newArrival":     return k.newArrival;
    case "popularityMin":  return k.popularity >= f.min;
    case "notBestSeller":  return !k.bestSeller;
    case "notFeatured":    return !(k.featured ?? false);
    case "anyOf":          return f.anyOf.some((inner) => matchesFilter(k, inner));
  }
}

// ── Boost scoring ─────────────────────────────────────────────────────────────

function applyBoost(k: FragranceKnowledge, boost: CollectionBoost): number {
  switch (boost.type) {
    case "family":         return k.family.includes(boost.value) ? boost.points : 0;
    case "occasion":       return k.occasions.includes(boost.value) ? boost.points : 0;
    case "season":         return k.season === boost.value ? boost.points : 0;
    case "scentCharacter": return k.scentCharacter === boost.value ? boost.points : 0;
    case "projection":     return k.projection === boost.value ? boost.points : 0;
    case "collection":     return k.collection === boost.value ? boost.points : 0;
    case "bestSeller":     return k.bestSeller ? boost.points : 0;
    case "newArrival":     return k.newArrival ? boost.points : 0;
    case "popularity":     return (k.popularity * boost.points) / 10;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function generateCollection(
  spec: CollectionSpec,
  catalogue: FragranceKnowledge[] = mkcCatalogue
): FragranceKnowledge[] {
  return catalogue
    .filter((k) => spec.filters.every((f) => matchesFilter(k, f)))
    .map((k) => ({
      knowledge: k,
      score: spec.boosts.reduce((acc, boost) => acc + applyBoost(k, boost), 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, spec.maxItems)
    .map(({ knowledge }) => knowledge);
}

export function getCollection(
  id: string,
  catalogue: FragranceKnowledge[] = mkcCatalogue
): FragranceKnowledge[] {
  const spec = COLLECTION_SPECS.find((s) => s.id === id);
  if (!spec) return [];
  return generateCollection(spec, catalogue);
}

// ── Built-in collection specifications ───────────────────────────────────────

export const COLLECTION_SPECS: CollectionSpec[] = [
  {
    id:          "fresh-office",
    name:        "Fresh Office Essentials",
    description: "Clean, confident fragrances for the modern workplace. Sophisticated sillage without overwhelming.",
    tags:        ["office", "fresh", "professional", "daily wear"],
    icon:        "🏙️",
    accentColor: "#7a8fa3",
    featured:    true,
    filters:     [{ type: "occasion", value: "Office" }],
    boosts:      [
      { type: "family",    value: "Fresh",    points: 15 },
      { type: "family",    value: "Citrus",   points: 15 },
      { type: "family",    value: "Aromatic", points: 10 },
      { type: "bestSeller",                   points: 12 },
    ],
    maxItems: 8,
  },

  {
    id:          "summer-essentials",
    name:        "Summer Essentials",
    description: "Fresh, vibrant fragrances that perform beautifully in the heat.",
    tags:        ["summer", "fresh", "aquatic", "seasonal", "warm weather"],
    icon:        "☀️",
    accentColor: "#e8a94f",
    featured:    true,
    filters:     [{ type: "season", value: "Summer" }],
    boosts:      [
      { type: "family",    value: "Fresh",   points: 12 },
      { type: "family",    value: "Aquatic", points: 12 },
      { type: "family",    value: "Citrus",  points: 10 },
      { type: "newArrival",                  points: 15 },
      { type: "bestSeller",                  points: 10 },
    ],
    maxItems: 8,
  },

  {
    id:          "vanilla-lovers",
    name:        "Vanilla Lovers",
    description: "Warm, sweet, and deeply comforting. For those who love a cosy, gourmand signature.",
    tags:        ["vanilla", "gourmand", "sweet", "warm", "cosy"],
    icon:        "🍦",
    accentColor: "#c4935a",
    featured:    false,
    filters: [
      {
        type:  "anyOf",
        anyOf: [
          { type: "family", value: "Vanilla" },
          { type: "family", value: "Gourmand" },
        ],
      },
    ],
    boosts: [
      { type: "popularity", points: 10 },
      { type: "bestSeller", points: 15 },
    ],
    maxItems: 8,
  },

  {
    id:          "date-night",
    name:        "Date Night",
    description: "Seductive, memorable fragrances that leave a lasting impression.",
    tags:        ["date night", "evening", "romantic", "intense", "sillage"],
    icon:        "🌙",
    accentColor: "#9b7ce0",
    featured:    true,
    filters:     [{ type: "occasion", value: "Date Night" }],
    boosts:      [
      { type: "family",        value: "Oud",              points: 15 },
      { type: "family",        value: "Amber",            points: 15 },
      { type: "projection",    value: "strong",           points: 20 },
      { type: "scentCharacter", value: "Deep & Intense",  points: 12 },
      { type: "scentCharacter", value: "Rich & Long Wearing", points: 10 },
    ],
    maxItems: 8,
  },

  {
    id:          "everyday-wear",
    name:        "Everyday Wear",
    description: "Effortlessly versatile fragrances that work beautifully from morning to evening.",
    tags:        ["everyday", "daily wear", "versatile", "all season"],
    icon:        "🌿",
    accentColor: "#6aaa8a",
    featured:    true,
    filters:     [{ type: "occasion", value: "Daily Wear" }],
    boosts:      [
      { type: "season",     value: "All Season", points: 18 },
      { type: "bestSeller",                      points: 15 },
      { type: "popularity",                      points:  8 },
    ],
    maxItems: 8,
  },

  {
    id:          "signature-scents",
    name:        "Signature Scents",
    description: "Distinctive fragrances that become unmistakably yours over time.",
    tags:        ["signature", "iconic", "everyday", "office", "all season"],
    icon:        "✦",
    accentColor: "#d89ca4",
    featured:    true,
    filters: [
      {
        type:  "anyOf",
        anyOf: [
          { type: "occasion", value: "Daily Wear" },
          { type: "occasion", value: "Office" },
        ],
      },
    ],
    boosts: [
      { type: "season",     value: "All Season", points: 20 },
      { type: "bestSeller",                      points: 20 },
      { type: "popularity",                      points: 10 },
    ],
    maxItems: 8,
  },

  {
    id:          "beginner-friendly",
    name:        "Beginner Friendly",
    description: "Approachable, versatile fragrances. Perfect for discovering your first signature scent.",
    tags:        ["beginner", "easy wear", "fresh", "versatile", "recommended"],
    icon:        "🌸",
    accentColor: "#d89ca4",
    featured:    false,
    filters: [
      {
        type:  "anyOf",
        anyOf: [
          { type: "scentCharacter", value: "Fresh & Light" },
          { type: "scentCharacter", value: "Balanced Signature" },
        ],
      },
    ],
    boosts: [
      { type: "bestSeller",                      points: 20 },
      { type: "season",     value: "All Season", points: 15 },
      { type: "popularity",                      points:  8 },
    ],
    maxItems: 8,
  },

  {
    id:          "luxury-picks",
    name:        "Luxury Picks",
    description: "The Elite Collection — premium fragrances for discerning tastes.",
    tags:        ["elite", "luxury", "premium", "exclusive"],
    icon:        "👑",
    accentColor: "#9b7ce0",
    featured:    true,
    filters:     [{ type: "collection", value: "Elite" }],
    boosts:      [
      { type: "popularity", points: 10 },
      { type: "bestSeller", points: 15 },
    ],
    maxItems: 8,
  },

  {
    id:          "trending",
    name:        "Trending Now",
    description: "Our most loved and newest arrivals — the fragrances everyone is talking about.",
    tags:        ["trending", "best sellers", "new arrivals", "popular"],
    icon:        "🔥",
    accentColor: "#d89ca4",
    featured:    true,
    filters:     [],
    boosts:      [
      { type: "bestSeller", points: 25 },
      { type: "newArrival", points: 25 },
      { type: "popularity", points: 10 },
    ],
    maxItems: 8,
  },

  {
    id:          "hidden-gems",
    name:        "Hidden Gems",
    description: "Extraordinary fragrances waiting to be discovered. Beyond the obvious choices.",
    tags:        ["discovery", "unique", "underrated", "explore"],
    icon:        "💎",
    accentColor: "#9b7ce0",
    featured:    false,
    filters: [
      { type: "notBestSeller" },
      { type: "notFeatured" },
    ],
    boosts: [
      // Negative points: lower popularity → higher score → surfaces the truly hidden
      { type: "popularity", points: -100 },
    ],
    maxItems: 8,
  },
];

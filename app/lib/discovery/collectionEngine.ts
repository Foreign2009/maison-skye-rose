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

/**
 * Returns which COLLECTION_SPECS a given fragrance qualifies for.
 *
 * A fragrance qualifies when it passes every filter in a spec.
 * Collections with no filters are excluded (they match everything — no signal).
 *
 * Ordering:
 *   1. featured === true first
 *   2. Higher filter count (more specific collection) before lower
 *   3. Repository order within ties (stable)
 *
 * Returns at most 3 results.
 */
export function getCollectionsForFragrance(
  fragrance: FragranceKnowledge,
): CollectionSpec[] {
  return COLLECTION_SPECS
    .filter((spec) =>
      spec.filters.length > 0 &&
      spec.filters.every((f) => matchesFilter(fragrance, f))
    )
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (b.filters.length !== a.filters.length) return b.filters.length - a.filters.length;
      return 0;
    })
    .slice(0, 3);
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
    editorial: {
      introduction:
        "Vanilla in fragrance is widely misunderstood. Far from simple or sweet, it unfolds in layers across the drydown — warm, resinous, and deeply personal. These compositions settle into the skin differently on everyone who wears them, growing richer and more intimate as the day progresses.",
      purpose:
        "Vanilla and gourmand fragrances are the comfort layer of a considered wardrobe. Warm enough to be distinctive, familiar enough to feel effortless — they reward those willing to wear them through the full drydown rather than judge them at the first spray.",
      wardrobePurpose:
        "Gourmand fragrances sit naturally between evening signature and weekend piece. Richer than a standard daily fragrance but approachable enough for relaxed occasions. Layer over a lighter morning base for an evolved, all-day rotation.",
      academyCopy:      "Understand the structure behind warmth and why base notes define these compositions",
      articleSlugs:     ["the-note-pyramid-explained", "how-to-layer-fragrances", "guide-to-fragrance-families"],
      conciergeCopy:    "Your Concierge can help you find the vanilla or gourmand fragrance that feels personal rather than sweet — and show you how to wear it for maximum effect.",
      conciergeContext: { occasion: "Evening" },
    },
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
      { type: "scentCharacter", value: "Rich & Full-Bodied", points: 10 },
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
    editorial: {
      introduction:
        "A signature scent is not chosen — it is found. The fragrance that begins to feel like yours rather than something you are wearing. Distinctive enough to be noticed, versatile enough for daily use, and consistent enough to become unmistakably associated with you over time.",
      purpose:
        "Signature fragrances earn their place not through intensity but through fit — a fragrance so aligned with your natural character that wearing it feels effortless and, over time, unmistakable.",
      wardrobePurpose:
        "A signature is the anchor of a fragrance wardrobe. Once found, it becomes the fixed point from which seasonal pieces, evening fragrances, and special occasion scents orbit — each enhancing the presence of the other.",
      academyCopy:      "Learn what separates a fragrance you wear from one that becomes truly yours",
      articleSlugs:     ["what-makes-a-signature-scent", "guide-to-fragrance-families", "how-to-wear-fragrance"],
      conciergeCopy:    "Finding a signature scent is a personal process. Share your instincts and preferences with your Concierge — they will guide you to the one that feels unmistakably yours.",
      conciergeContext: { occasion: "Daily Wear" },
    },
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
    editorial: {
      introduction:
        "The Elite Collection represents Maison's most ambitious compositions — built without compromise on complexity, longevity, and character. These are not simply more expensive; they are built differently. Rarer materials, deeper accords, and longer development create an experience that evolves across hours of wear.",
      purpose:
        "Luxury fragrance is defined not by price but by complexity and the way a composition develops from opening to drydown. The Elite Collection holds the fragrances that reward the most patient, considered wearing.",
      wardrobePurpose:
        "An Elite fragrance elevates every wardrobe it joins. Whether worn as a statement piece for specific occasions or as a primary daily signature, it raises the standard of a collection and becomes a benchmark for every future addition.",
      academyCopy:      "Explore what separates true complexity from surface-level impact — and how to wear it to full effect",
      articleSlugs:     ["what-makes-a-signature-scent", "the-note-pyramid-explained", "how-to-wear-fragrance"],
      conciergeCopy:    "Your Concierge knows the Elite Collection intimately. Share the occasion, the impression you want to leave, and let them guide you to the right composition.",
      conciergeContext: { occasion: "Evening" },
    },
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
    editorial: {
      introduction:
        "Maison's most loved and newest arrivals — the fragrances that have found their moment. Best sellers earn that distinction through consistent performance across wearers, occasions, and seasons. The newest arrivals bring fresh perspective and character to an established collection.",
      purpose:
        "Trending fragrances balance broad accessibility with genuine depth. They connect quickly precisely because they are built to perform across the widest range of people and occasions — without sacrificing what makes them interesting.",
      wardrobePurpose:
        "Best sellers make reliable starting points for new wardrobes and strong additions to existing collections. Their broad performance means they sit comfortably alongside more specific seasonal or occasion-focused pieces.",
      academyCopy:      "Build the knowledge to choose confidently — whether you're discovering your first fragrance or expanding your collection",
      articleSlugs:     ["what-makes-a-signature-scent", "guide-to-fragrance-families", "how-to-wear-fragrance"],
      conciergeCopy:    "Your Concierge can help you navigate what's trending and find the fragrance that connects with your specific character — not just the crowd.",
      conciergeContext: { occasion: "Daily Wear" },
    },
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
    editorial: {
      introduction:
        "Some of Maison's most interesting compositions sit quietly beyond the bestseller lists. Not because they are lesser — but because the wearer who recognises them has not yet arrived. These are fragrances waiting for their person: considered, characterful, and rarely discovered by accident.",
      purpose:
        "Discovery fragrances reward curiosity. The fragrance you found rather than were shown carries a different kind of satisfaction — it becomes yours more completely because you chose it before the crowd did.",
      wardrobePurpose:
        "A hidden gem often becomes the most interesting piece in a wardrobe. The one people ask about. The one with a story. The one that holds its character across years and trends because it was never built to follow them.",
      academyCopy:      "Develop the language to describe what you're looking for — and the confidence to choose something unexpected",
      articleSlugs:     ["guide-to-fragrance-families", "the-note-pyramid-explained", "what-makes-a-signature-scent"],
      conciergeCopy:    "Discovering something unexpected is best done with guidance. Your Concierge knows this collection well — share your instincts and let the search begin.",
      conciergeContext: { occasion: "Daily Wear" },
    },
  },

  {
    id:          "spring-essentials",
    name:        "Spring Essentials",
    description: "Fresh, floral, and balanced — fragrances that bloom in the warmth of spring.",
    tags:        ["spring", "floral", "fresh", "light", "seasonal"],
    icon:        "🌸",
    accentColor: "#c8a4c0",
    featured:    true,
    filters: [
      {
        type:  "anyOf",
        anyOf: [
          { type: "season",   value: "Spring"       },
          { type: "family",   value: "Floral"       },
          { type: "family",   value: "White Floral" },
          { type: "family",   value: "Fresh"        },
        ],
      },
    ],
    boosts: [
      { type: "season",     value: "Spring",       points: 20 },
      { type: "family",     value: "Floral",       points: 18 },
      { type: "family",     value: "White Floral", points: 15 },
      { type: "family",     value: "Fresh",        points: 12 },
      { type: "family",     value: "Fruity",       points:  8 },
      { type: "bestSeller",                        points: 12 },
    ],
    maxItems: 8,
    editorial: {
      introduction:
        "Spring is the fragrance season for renewal. As temperatures warm and the air lightens, floral and fresh compositions return to full expression. These are fragrances built for exactly this moment — lighter in character, more expressive in the warmth, and naturally suited to the change in season.",
      purpose:
        "Spring fragrances thrive in moderate warmth — the temperature range that allows florals to bloom without distortion and fresh compositions to project cleanly. This is the most natural season to introduce a lighter signature or rediscover a floral that was overshadowed in winter.",
      wardrobePurpose:
        "A spring fragrance is the seasonal rotation piece — worn to complement a heavier year-round signature. Light floral or fresh-fruity compositions introduce texture and variety to any wardrobe through the warmer months.",
      academyCopy:      "Learn how temperature and season shape which fragrances perform at their best",
      articleSlugs:     ["choosing-your-season-scent", "guide-to-fragrance-families", "how-to-wear-fragrance"],
      conciergeCopy:    "Your Concierge can help you identify which spring fragrances complement your existing wardrobe and guide you through the seasonal transition.",
      conciergeContext: { season: "Spring" },
    },
  },

  {
    id:          "autumn-essentials",
    name:        "Autumn Essentials",
    description: "Woody, amber, and spice-forward fragrances that come alive as temperatures cool.",
    tags:        ["autumn", "woody", "amber", "spicy", "warm", "seasonal"],
    icon:        "🍂",
    accentColor: "#b87a4a",
    featured:    true,
    filters: [
      {
        type:  "anyOf",
        anyOf: [
          { type: "season",   value: "Autumn" },
          { type: "family",   value: "Woody"  },
          { type: "family",   value: "Amber"  },
          { type: "family",   value: "Spicy"  },
        ],
      },
    ],
    boosts: [
      { type: "season",         value: "Autumn",             points: 20 },
      { type: "family",         value: "Woody",              points: 20 },
      { type: "family",         value: "Amber",              points: 18 },
      { type: "family",         value: "Spicy",              points: 15 },
      { type: "scentCharacter", value: "Rich & Full-Bodied", points: 12 },
      { type: "bestSeller",                                   points: 10 },
    ],
    maxItems: 8,
    editorial: {
      introduction:
        "Autumn is the richest fragrance season. As temperatures cool and air dries, warmer compositions come alive — revealing nuances that summer heat kept hidden. Woody, amber, and spice-forward fragrances find their fullest expression as the season turns.",
      purpose:
        "Cool, dry air is autumn's gift to fragrance. Base notes deepen, projection settles to skin-close warmth, and the body's natural heat layers perfectly with richer compositions. This is the season to rediscover what summer set aside.",
      wardrobePurpose:
        "Autumn invites a deliberate wardrobe transition. The woody and amber fragrances set aside in summer feel most natural now — and this is the ideal season to add a richer signature that can carry through into winter.",
      academyCopy:      "Understand how season shapes fragrance character and why autumn is the ideal time to explore depth",
      articleSlugs:     ["choosing-your-season-scent", "how-to-layer-fragrances", "the-note-pyramid-explained"],
      conciergeCopy:    "Your Concierge can guide your autumn transition — from selecting your first seasonal fragrance to understanding how to layer across the cooler months.",
      conciergeContext: { season: "Autumn" },
    },
  },

  {
    id:          "winter-warmth",
    name:        "Winter Warmth",
    description: "Rich, warm fragrances built for the colder months. Base-heavy, enveloping, and made to endure.",
    tags:        ["winter", "warm", "rich", "oud", "amber"],
    icon:        "🕯️",
    accentColor: "#9b7ce0",
    featured:    false,
    filters: [
      {
        type:  "anyOf",
        anyOf: [
          { type: "season",   value: "Winter" },
          { type: "occasion", value: "Winter Evenings" },
        ],
      },
    ],
    boosts: [
      { type: "scentCharacter", value: "Rich & Full-Bodied", points: 20 },
      { type: "scentCharacter", value: "Deep & Intense",      points: 15 },
      { type: "family",         value: "Oud",                 points: 15 },
      { type: "family",         value: "Amber",               points: 12 },
      { type: "bestSeller",                                    points: 10 },
    ],
    maxItems: 8,
  },

  {
    id:          "special-occasion",
    name:        "Special Occasion",
    description: "Exceptional fragrances for extraordinary moments. Chosen to mark and be remembered.",
    tags:        ["special", "wedding", "occasion", "celebration", "memorable"],
    icon:        "✨",
    accentColor: "#d89ca4",
    featured:    false,
    filters: [
      {
        type:  "anyOf",
        anyOf: [
          { type: "occasion", value: "Wedding" },
          { type: "occasion", value: "Date Night" },
        ],
      },
    ],
    boosts: [
      { type: "bestSeller",                                   points: 20 },
      { type: "projection",     value: "strong",              points: 15 },
      { type: "scentCharacter", value: "Rich & Full-Bodied", points: 12 },
      { type: "family",         value: "Floral",              points: 10 },
    ],
    maxItems: 8,
  },
];

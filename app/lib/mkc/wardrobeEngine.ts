import type { FragranceKnowledge } from "./types";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WardrobeData {
  bestFor:         string[];
  wardrobeRole:    string;
  roleDescription: string;
  personality:     string[];
  journey: {
    editorial: string;
    nextStep:  string | null;
    nextLabel: string | null;
  };
}

type ScentCharacter = FragranceKnowledge["scentCharacter"];

// ── Wardrobe role map ─────────────────────────────────────────────────────────

const WARDROBE_ROLES: Record<ScentCharacter, { role: string; description: string }> = {
  "Fresh & Light": {
    role:        "The Opening Chapter",
    description: "Light, approachable, and effortlessly versatile. An excellent starting point for any fragrance wardrobe, and a natural daytime companion to richer evening fragrances.",
  },
  "Balanced Signature": {
    role:        "The Daily Anchor",
    description: "The cornerstone of a fragrance wardrobe. Refined enough for any occasion and distinct enough to be remembered — it works every day without ever feeling ordinary.",
  },
  "Rich & Long Wearing": {
    role:        "The Statement Piece",
    description: "The fragrance you reach for when the occasion deserves attention. Rich sillage and lasting presence make it the defining piece in a considered wardrobe.",
  },
  "Deep & Intense": {
    role:        "The Signature Depth",
    description: "The most characterful end of the spectrum. Worn alongside a lighter daily signature, it gives every occasion its own fragrance — and leaves a lasting impression.",
  },
};

// ── Character progression ─────────────────────────────────────────────────────

const CHARACTER_PROGRESSION: Record<
  ScentCharacter,
  { editorial: string; nextStep: ScentCharacter | null; nextLabel: string | null }
> = {
  "Fresh & Light": {
    editorial:
      "Fresh fragrances are an excellent starting point. Approachable and versatile, they build confidence for deeper exploration. As your wardrobe develops, a Balanced Signature becomes the natural next chapter — equally wearable, with more character.",
    nextStep:  "Balanced Signature",
    nextLabel: "Explore Balanced Signatures",
  },
  "Balanced Signature": {
    editorial:
      "Balanced Signatures are the cornerstone of any wardrobe. Versatile enough for daily wear, distinctive enough to be remembered. Pairing this with something lighter for daytime and something richer for evenings creates a complete rotation suited to any occasion.",
    nextStep:  "Rich & Long Wearing",
    nextLabel: "Explore Richer Fragrances",
  },
  "Rich & Long Wearing": {
    editorial:
      "Rich fragrances are the statement pieces of a wardrobe. At their best worn alongside a lighter daily signature — together they form a rotation suited to any occasion. If you want to go deeper, an intense evening fragrance completes the collection.",
    nextStep:  "Deep & Intense",
    nextLabel: "Explore Deep & Intense",
  },
  "Deep & Intense": {
    editorial:
      "The deepest end of the fragrance spectrum. These fragrances reward a considered wardrobe — worn alongside a fresher daily signature, they bring depth, occasion, and lasting memory to your collection.",
    nextStep:  null,
    nextLabel: null,
  },
};

// ── Public API ────────────────────────────────────────────────────────────────

export function computeWardrobe(k: FragranceKnowledge): WardrobeData {
  const roleData    = WARDROBE_ROLES[k.scentCharacter];
  const journeyData = CHARACTER_PROGRESSION[k.scentCharacter];

  return {
    bestFor:         k.occasions,
    wardrobeRole:    roleData.role,
    roleDescription: roleData.description,
    personality:     k.vibe,
    journey: {
      editorial: journeyData.editorial,
      nextStep:  journeyData.nextStep,
      nextLabel: journeyData.nextLabel,
    },
  };
}

import { fragranceFamilies } from "../data/fragranceFamilies";
import { fragranceVibes } from "../data/fragranceVibes";
import { fragranceOccasions } from "../data/fragranceOccasions";

export type IntentSignals = {
  gender?: "male" | "female" | "unisex";
  occasion?: string;
  vibe?: string;
  family?: string;
  character?: "Fresh & Light" | "Balanced Signature" | "Rich & Long Wearing" | "Deep & Intense";
};

// Sorted by length descending so multi-word entries ("White Floral", "Old Money") match
// before their single-word substrings ("Floral", "Modern").
const sortedFamilies = [...fragranceFamilies].sort((a, b) => b.length - a.length);
const sortedVibes = [...fragranceVibes].sort((a, b) => b.length - a.length);
const sortedOccasions = [...fragranceOccasions].sort((a, b) => b.length - a.length);

type GenderGroup = { gender: "male" | "female" | "unisex"; patterns: RegExp[] };

// Checked in priority order: unisex → female → male.
// Female is tested before male to prevent "men" from matching inside "women".
const GENDER_GROUPS: GenderGroup[] = [
  { gender: "unisex", patterns: [/\bunisex\b/, /gender[- ]?neutral/] },
  {
    gender: "female",
    patterns: [/for her\b/, /\bwomen\b/, /\bwoman\b/, /\bfemale\b/, /\bfeminine\b/, /\bhers\b/],
  },
  {
    gender: "male",
    patterns: [/for him\b/, /\bmen\b/, /\bman\b/, /\bmale\b/, /\bmasculine\b/, /\bhis\b/],
  },
];

type CharacterRule = {
  keywords: string[];
  character: "Fresh & Light" | "Deep & Intense" | "Rich & Long Wearing";
};

const CHARACTER_RULES: CharacterRule[] = [
  { keywords: ["light", "fresh", "airy", "clean"], character: "Fresh & Light" },
  { keywords: ["deep", "intense", "dark", "heavy", "bold"], character: "Deep & Intense" },
  { keywords: ["rich", "long lasting", "long-lasting", "lasting", "strong"], character: "Rich & Long Wearing" },
];

function matchFirst(query: string, vocabulary: string[]): string | undefined {
  for (const term of vocabulary) {
    if (query.includes(term.toLowerCase())) {
      return term;
    }
  }
  return undefined;
}

export function parseIntent(query: string): IntentSignals {
  if (!query || !query.trim()) {
    return {};
  }

  const q = query.toLowerCase();
  const signals: IntentSignals = {};

  for (const group of GENDER_GROUPS) {
    if (group.patterns.some((pattern) => pattern.test(q))) {
      signals.gender = group.gender;
      break;
    }
  }

  signals.family = matchFirst(q, sortedFamilies);
  signals.vibe = matchFirst(q, sortedVibes);
  signals.occasion = matchFirst(q, sortedOccasions);

  for (const { keywords, character } of CHARACTER_RULES) {
    if (keywords.some((kw) => q.includes(kw))) {
      signals.character = character;
      break;
    }
  }

  return signals;
}

/**
 * Entity Resolution — Focused Verification Script
 *
 * Exercises resolveIntent() to confirm compound-name recognition behaviour
 * before and after the normalizeInputForEntityMatch fix.
 *
 * Run: npx tsx scripts/test-entity-resolution.ts
 */

import { resolveIntent } from "../app/lib/concierge/intentResolver";

// ── Test harness ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(
  label: string,
  actual: unknown,
  expected: unknown,
): void {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  const tag = ok ? "PASS" : "FAIL";
  if (ok) {
    passed++;
  } else {
    failed++;
  }
  console.log(`[${tag}] ${label}`);
  if (!ok) {
    console.log(`       expected: ${JSON.stringify(expected)}`);
    console.log(`       actual:   ${JSON.stringify(actual)}`);
  }
}

function ei(message: string) {
  return resolveIntent(message, {});
}

// ── §100  Compound names with "and" ──────────────────────────────────────────

console.log("\n§100  Compound names with 'and'");

const q1 = ei("Something like Jo Malone Wood Sage and Sea Salt");
assert(
  "§101  'wood sage and sea salt' → entitySlug = wood-sage-sea-salt-inspired",
  q1.entitySlug,
  "wood-sage-sea-salt-inspired",
);
assert(
  "§102  'wood sage and sea salt' → intent = similar_to",
  q1.intent,
  "similar_to",
);

const q2 = ei("English Pear and Freesia please, something similar");
assert(
  "§103  'english pear and freesia' → entitySlug = english-pear-freesia-inspired",
  q2.entitySlug,
  "english-pear-freesia-inspired",
);
assert(
  "§104  'english pear and freesia' → intent = similar_to",
  q2.intent,
  "similar_to",
);

const q3 = ei("wood sage & sea salt inspired");
assert(
  "§105  '&' variant → entitySlug = wood-sage-sea-salt-inspired",
  q3.entitySlug,
  "wood-sage-sea-salt-inspired",
);

const q3b = ei("WOOD SAGE AND SEA SALT inspired");
assert(
  "§106  uppercase AND → entitySlug = wood-sage-sea-salt-inspired",
  q3b.entitySlug,
  "wood-sage-sea-salt-inspired",
);

const q3c = ei("wood  sage  and  sea  salt");
assert(
  "§107  repeated whitespace + and → entitySlug = wood-sage-sea-salt-inspired",
  q3c.entitySlug,
  "wood-sage-sea-salt-inspired",
);

const q3d = ei("Wood Sage&Sea Salt inspired");
assert(
  "§108  unspaced & → entitySlug = wood-sage-sea-salt-inspired",
  q3d.entitySlug,
  "wood-sage-sea-salt-inspired",
);

const q3e = ei("English Pear&Freesia please");
assert(
  "§109  unspaced & (English Pear) → entitySlug = english-pear-freesia-inspired",
  q3e.entitySlug,
  "english-pear-freesia-inspired",
);

// ── §200  Names without "and" — no regression ────────────────────────────────

console.log("\n§200  Names without 'and' — no regression");

const q4 = ei("I like Bvlgari Black, what else suits me");
assert(
  "§201  'bvlgari black' → entitySlug = bvlgari-black-inspired",
  q4.entitySlug,
  "bvlgari-black-inspired",
);
assert(
  "§202  'bvlgari black' → intent = similar_to",
  q4.intent,
  "similar_to",
);

const q5 = ei("I love Sauvage, something similar please");
assert(
  "§203  'sauvage' → entitySlug = sauvage-inspired",
  q5.entitySlug,
  "sauvage-inspired",
);

const q5b = ei("wood sage sea salt inspired");
assert(
  "§204  compound name without conjunction → entitySlug = wood-sage-sea-salt-inspired",
  q5b.entitySlug,
  "wood-sage-sea-salt-inspired",
);

const q5c = ei("english pear freesia inspired");
assert(
  "§205  compound name without conjunction → entitySlug = english-pear-freesia-inspired",
  q5c.entitySlug,
  "english-pear-freesia-inspired",
);

// ── §300  Multi-fragrance comparison with "and" ──────────────────────────────

console.log("\n§300  Multi-fragrance comparison with 'and'");

const q6 = ei("compare Sauvage and Aventus for me");
assert(
  "§301  'sauvage and aventus' → compareSlug includes both",
  q6.compareSlug.includes("sauvage-inspired") && q6.compareSlug.includes("aventus-inspired"),
  true,
);
assert(
  "§302  'sauvage and aventus' → intent = comparison",
  q6.intent,
  "comparison",
);

const q7 = ei("Sauvage and Aventus — which is better");
assert(
  "§303  'sauvage and aventus — which is better' → intent = comparison",
  q7.intent,
  "comparison",
);

const q7b = ei("compare Sauvage Elixir and Aventus please");
assert(
  "§304  flanker comparison → compareSlug includes sauvage-elixir-inspired",
  q7b.compareSlug.includes("sauvage-elixir-inspired"),
  true,
);
assert(
  "§305  flanker comparison → compareSlug includes aventus-inspired",
  q7b.compareSlug.includes("aventus-inspired"),
  true,
);

// ── §400  "and" in non-name context — no accidental match ────────────────────

console.log("\n§400  'and' in non-name context");

const q8 = ei("I want something woody and fresh for work");
assert(
  "§401  'woody and fresh' (no entity name) → entitySlug = undefined",
  q8.entitySlug,
  undefined,
);

const q9 = ei("fresh and light for summer please");
assert(
  "§402  'fresh and light' → entitySlug = undefined",
  q9.entitySlug,
  undefined,
);

const q9b = ei("fresh & woody notes for a casual day");
assert(
  "§403  unrelated words with unspaced & → entitySlug = undefined",
  q9b.entitySlug,
  undefined,
);

// ── §500  Flanker safety with "and" adjacent ─────────────────────────────────

console.log("\n§500  Flanker safety");

// "Sauvage Elixir" must win over "Sauvage" when the query names the flanker.
const q10 = ei("something like Sauvage Elixir and Aventus please");
const firstSlug = q10.compareSlug[0] ?? q10.entitySlug;
assert(
  "§501  'sauvage elixir' wins over 'sauvage' prefix in flanker query",
  firstSlug,
  "sauvage-elixir-inspired",
);

// ── §600  Unknown / absent names ─────────────────────────────────────────────

console.log("\n§600  Unknown names");

const q11 = ei("something like Xyzara No.5 by Fictitious House");
assert(
  "§601  unknown fragrance name → entitySlug = undefined",
  q11.entitySlug,
  undefined,
);

const q12 = ei("I like bvalgari black");
assert(
  "§602  misspelled 'bvalgari' → entitySlug = undefined (no fuzzy matching)",
  q12.entitySlug,
  undefined,
);

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n─────────────────────────────────────`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log("SUITE FAILED");
  process.exit(1);
} else {
  console.log("SUITE PASSED");
}

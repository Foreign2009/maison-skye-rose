/**
 * Concierge entity boundaries — fragrance names are recognised only as whole names.
 *
 * A plain substring check let short catalogue names match inside ordinary words
 * ("ani" in "vanilla", "Armani"; "y inspired" in "Intensely Inspired") and let a
 * shorter name inside a longer one ("opium" in "Black Opium") become a second,
 * phantom entity. This exercises the real resolveIntent (and planRetrieval for the
 * vanilla preference query), plus a catalogue-wide self-recognition sweep.
 *
 * Run: npx tsx scripts/factory/__tests__/entity-boundaries.test.ts
 */
import assert from "node:assert/strict";
import { resolveIntent } from "../../../app/lib/concierge/intentResolver";
import { planRetrieval } from "../../../app/lib/concierge/retrievalPlanner";
import { mkcCatalogue } from "../../../app/lib/mkc/catalogue";
import type { ConversationContext } from "../../../app/lib/concierge/types";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓  ${name}`); passed++; }
  catch (e: any) { console.log(`  ✗  ${name}\n     ${e.message}`); failed++; }
}

const CTX = {} as ConversationContext;
const ANI = "ani-inspired";
const resolve = (q: string) => resolveIntent(q, CTX);
const sorted = (xs: string[]) => [...xs].sort();

function expectEntity(q: string, slug: string | undefined) {
  const r = resolve(q);
  assert.equal(r.entitySlug, slug, `"${q}" → entity ${r.entitySlug ?? "-"}, expected ${slug ?? "-"}`);
  assert.deepEqual(r.compareSlug, [], `"${q}" → unexpected comparison ${JSON.stringify(r.compareSlug)}`);
}

function expectCompare(q: string, slugs: string[]) {
  const r = resolve(q);
  assert.equal(r.intent, "comparison", `"${q}" → intent ${r.intent}`);
  assert.deepEqual(sorted(r.compareSlug), sorted(slugs), `"${q}" → compare ${JSON.stringify(r.compareSlug)}`);
}

for (const slug of [ANI, "vetiver-golden-vanilla-inspired", "wonderlust-by-michael-kors-inspired", "212-sexy-inspired", "prada-candy-inspired"]) {
  if (!mkcCatalogue.some((f) => f.slug === slug)) { console.error(`${slug} not in catalogue — aborting`); process.exit(1); }
}

console.log("\n── False-positive prevention ─────────────────────────────────────");

test("EB-01 — 'I love vanilla scents.' does not resolve Ani", () => expectEntity("I love vanilla scents.", undefined));
test("EB-02 — 'Something with vanilla please.' does not resolve Ani", () => expectEntity("Something with vanilla please.", undefined));
test("EB-03 — 'Tell me about Golden Vanilla.' does not resolve Ani", () => expectEntity("Tell me about Golden Vanilla.", undefined));
test("EB-04 — 'Tell me about Vetiver & Golden Vanilla.' resolves only Vetiver & Golden Vanilla", () =>
  expectEntity("Tell me about Vetiver & Golden Vanilla.", "vetiver-golden-vanilla-inspired"));
test("EB-05 — 'Tell me about Vetiver Golden Vanilla Inspired.' resolves only Vetiver & Golden Vanilla", () =>
  expectEntity("Tell me about Vetiver Golden Vanilla Inspired.", "vetiver-golden-vanilla-inspired"));
test("EB-06 — 'eros' is not found inside 'heroes' (212 Heroes resolves alone)", () =>
  expectEntity("Tell me about 212 Heroes.", "212-heroes-inspired"));
test("EB-07 — 'Armani' does not resolve Ani", () => expectEntity("Tell me about Armani Code Parfum.", "armani-code-parfum-inspired"));
test("EB-08 — '… Intensely Inspired' does not resolve Y Inspired", () =>
  expectEntity("Tell me about Stronger With You Intensely Inspired.", "stronger-with-you-intensely-inspired"));
test("EB-09 — vanilla preference stays discovery; retrieval is not anchored to Ani", () => {
  const r = resolve("I love vanilla scents.");
  assert.equal(r.intent, "general_discovery", `intent ${r.intent}`);
  const ret = planRetrieval(r, CTX, {}) as { fragrances: { slug: string }[] };
  assert.notEqual(ret.fragrances[0]?.slug, ANI, "Ani pinned as first retrieval result");
});
test("EB-10 — everyday words are not product aliases (perfect, beautiful, romance)", () => {
  for (const q of ["I want something perfect for summer.", "Something beautiful for a wedding.", "A scent for romance."]) expectEntity(q, undefined);
});
test("EB-11 — 'Euphoria' alone stays unresolved (would be ambiguous with Euphoria Men)", () =>
  expectEntity("Tell me about Euphoria.", undefined));

console.log("\n── Named-product recognition ─────────────────────────────────────");

test("EB-20 — 'Tell me about Ani.'", () => expectEntity("Tell me about Ani.", ANI));
test("EB-21 — 'Tell me about 212 Sexy.'", () => expectEntity("Tell me about 212 Sexy.", "212-sexy-inspired"));
test("EB-22 — 'Tell me about Vetiver & Golden Vanilla.'", () =>
  expectEntity("Tell me about Vetiver & Golden Vanilla.", "vetiver-golden-vanilla-inspired"));
test("EB-23 — 'Tell me about Prada Candy.'", () => expectEntity("Tell me about Prada Candy.", "prada-candy-inspired"));
test("EB-24 — 'Tell me about Wonderlust.' (short-name alias)", () =>
  expectEntity("Tell me about Wonderlust.", "wonderlust-by-michael-kors-inspired"));
test("EB-25 — 'Tell me about Wonderlust by Michael Kors.'", () =>
  expectEntity("Tell me about Wonderlust by Michael Kors.", "wonderlust-by-michael-kors-inspired"));
test("EB-26 — 'Tell me about Perfect by Marc Jacobs.'", () =>
  expectEntity("Tell me about Perfect by Marc Jacobs.", "perfect-by-marc-jacobs-inspired"));
test("EB-27 — short names Y, 9PM and Eros still resolve as standalone words", () => {
  expectEntity("Tell me about Y.", "y-inspired");
  expectEntity("Tell me about 9PM.", "9pm-inspired");
  expectEntity("Tell me about Eros.", "eros-inspired");
});
test("EB-28 — accents, smart apostrophes and 'and' compounds still normalise", () => {
  expectEntity("Tell me about Terre d’Hermès.", "terre-d'hermes-inspired");
  expectEntity("Tell me about Wood Sage and Sea Salt.", "wood-sage-sea-salt-inspired");
});
test("EB-29 — a shorter name inside a longer one is not a second entity", () => {
  expectEntity("Tell me about Black Opium.", "black-opium-inspired");
  expectEntity("Tell me about Very Good Girl.", "very-good-girl-inspired");
  expectEntity("Tell me about Velvet Rose Oud.", "velvet-rose-oud-inspired");
});

console.log("\n── Comparison recognition ────────────────────────────────────────");

test("EB-40 — 'Compare Prada Candy and 212 Sexy.'", () =>
  expectCompare("Compare Prada Candy and 212 Sexy.", ["prada-candy-inspired", "212-sexy-inspired"]));
test("EB-41 — 'Compare Prada Candy and Wonderlust.'", () =>
  expectCompare("Compare Prada Candy and Wonderlust.", ["prada-candy-inspired", "wonderlust-by-michael-kors-inspired"]));
test("EB-42 — 'Compare Prada Candy and Wonderlust by Michael Kors.'", () =>
  expectCompare("Compare Prada Candy and Wonderlust by Michael Kors.", ["prada-candy-inspired", "wonderlust-by-michael-kors-inspired"]));
test("EB-43 — 'Is 212 Sexy similar to 212 VIP Rose?'", () =>
  expectCompare("Is 212 Sexy similar to 212 VIP Rose?", ["212-sexy-inspired", "212-vip-rose-inspired"]));
test("EB-44 — explicitly naming both a flanker and its base still compares both", () => {
  expectCompare("Compare Black Opium and Opium.", ["black-opium-inspired", "opium-inspired"]);
  expectCompare("Compare Sauvage Elixir and Sauvage.", ["sauvage-elixir-inspired", "sauvage-inspired"]);
  expectCompare("Compare Ani and Vanilla 28.", [ANI, "vanilla-28-inspired"]);
});

console.log("\n── Catalogue-wide self-recognition ───────────────────────────────");

test(`EB-60 — every native fragrance (${mkcCatalogue.length}) resolves to itself alone by bare and full name`, () => {
  const problems: string[] = [];
  for (const k of mkcCatalogue) {
    const bare = k.name.replace(/ Inspired$/, "");
    for (const q of [`Tell me about ${bare}`, `Tell me about ${k.name}`]) {
      const r = resolve(q);
      if (r.entitySlug !== k.slug || r.compareSlug.length) problems.push(`${q} → ${r.entitySlug ?? "-"} ${JSON.stringify(r.compareSlug)}`);
    }
  }
  assert.equal(problems.length, 0, `${problems.length} misresolved:\n     ${problems.slice(0, 10).join("\n     ")}`);
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
process.exit(failed ? 1 : 0);

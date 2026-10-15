/**
 * Wave 9 Batch 5 name-collision checks (W9-B5-P1B; promoted-state checks W9-B5-P6, 2026-10-15).
 *
 * Both drafts are promoted to local native MKC (283). These checks confirm that each name resolves
 * to its own record in the Concierge and shop search, that neither name overlaps another native
 * name as whole words, and that everyday phrases ("this is her first perfume", "for her") are not
 * captured. Card-path checks: batch5-name-ambiguity.test.ts.
 *
 * Run: npx tsx scripts/factory/__tests__/batch5-name-collisions.test.ts
 */
import assert from "node:assert/strict";
import { resolveIntent } from "../../../app/lib/concierge/intentResolver";
import { findNamedFragrances, resolveShopQuery } from "../../../app/lib/shopSearch";
import { mkcCatalogue } from "../../../app/lib/mkc/catalogue";
import { thisIsHimInspired } from "../drafts/this-is-him-inspired";
import { thisIsHerInspired } from "../drafts/this-is-her-inspired";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓  ${name}`); passed++; }
  catch (e: any) { console.log(`  ✗  ${name}\n     ${e.message}`); failed++; }
}

const DRAFTS = [thisIsHimInspired, thisIsHerInspired];
const words = (s: string) => s.toLowerCase().replace(/ inspired$/, "").split(/[^a-z0-9']+/).filter(Boolean);
const containsRun = (hay: string[], needle: string[]) => hay.some((_, i) => needle.every((t, j) => hay[i + j] === t));

test("B5-01 — catalogue is 283 and includes both promoted Batch 5 records, identical to the drafts", () => {
  assert.equal(mkcCatalogue.length, 283);
  for (const d of DRAFTS) {
    const live = mkcCatalogue.filter((k) => k.slug === d.slug);
    assert.equal(live.length, 1, `${d.slug} registered ${live.length} times`);
    assert.equal(JSON.stringify(live[0]), JSON.stringify(d), `${d.slug} differs from its draft`);
  }
});

test("B5-02 — no native name overlaps a draft name as whole words (either direction)", () => {
  const hits: string[] = [];
  for (const d of DRAFTS) {
    const dw = words(d.name);
    for (const k of mkcCatalogue) {
      if (k.slug === d.slug) continue;
      const kw = words(k.name);
      if (containsRun(kw, dw) || containsRun(dw, kw)) hits.push(`${d.name} ~ ${k.name}`);
    }
  }
  assert.deepEqual(hits, []);
});

test("B5-03 — the Concierge resolves each name to its own record", () => {
  const cases: Array<[string, string]> = [
    ["Tell me about This Is Him.", thisIsHimInspired.slug], ["Tell me about This Is Her.", thisIsHerInspired.slug],
    ["Tell me about This is Him!", thisIsHimInspired.slug], ["Tell me about This is Her!", thisIsHerInspired.slug],
    ["Do you have This Is Her?", thisIsHerInspired.slug], ["Can I buy This Is Him?", thisIsHimInspired.slug],
    ["This Is Her Inspired.", thisIsHerInspired.slug], ["Do you stock This Is Him?", thisIsHimInspired.slug],
  ];
  for (const [q, slug] of cases) assert.equal(resolveIntent(q, {}).entitySlug, slug, q);
  for (const q of ["Compare This Is Him and This Is Her.", "This Is Him vs This Is Her."]) {
    assert.deepEqual([...resolveIntent(q, {}).compareSlug].sort(), [thisIsHerInspired.slug, thisIsHimInspired.slug], q);
  }
});

test("B5-04 — shop search names each product exactly", () => {
  assert.deepEqual(findNamedFragrances("This Is Him").map((d) => d.title), [thisIsHimInspired.name]);
  assert.deepEqual(findNamedFragrances("This Is Her").map((d) => d.title), [thisIsHerInspired.name]);
  for (const q of ["This Is Him", "This Is Her"]) assert.equal(resolveShopQuery(q).mode, 2, q);
});

test("B5-06 — everyday 'this is her / this is him' sentences resolve to no product", () => {
  for (const q of ["This is her first perfume.", "This is her birthday gift.", "This is him all over.",
    "Do you have this is her size?", "This is her first order.", "I want something for her.", "A gift for him.",
    "I want to buy this for her."]) {
    const r = resolveIntent(q, {});
    assert.equal(r.entitySlug, undefined, `"${q}" → ${r.entitySlug}`);
    assert.deepEqual(r.compareSlug, [], q);
  }
});

test("B5-05 — gender-preference phrases stay preferences (no name capture by 'her' / 'him')", () => {
  for (const q of ["something for her", "something for him", "a gift for her"]) assert.deepEqual(findNamedFragrances(q), [], q);
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
process.exit(failed ? 1 : 0);

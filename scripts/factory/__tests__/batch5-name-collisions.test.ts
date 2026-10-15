/**
 * Wave 9 Batch 5 name-collision checks at draft stage (W9-B5-P1B).
 *
 * The drafts are not promoted, so they are absent from the live name maps. These checks confirm
 * that their names do not overlap any native name as whole words, and that today's Concierge
 * resolver and shop search do not mis-resolve them to an existing product. After an authorised
 * promotion, extend this file with positive resolution and card-path checks (as Batch 4 did).
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

test("B5-01 — catalogue is still 281 and contains neither draft", () => {
  assert.equal(mkcCatalogue.length, 281);
  for (const d of DRAFTS) assert.ok(!mkcCatalogue.some((k) => k.slug === d.slug || k.name === d.name), `${d.slug} already live`);
});

test("B5-02 — no native name overlaps a draft name as whole words (either direction)", () => {
  const hits: string[] = [];
  for (const d of DRAFTS) {
    const dw = words(d.name);
    for (const k of mkcCatalogue) {
      const kw = words(k.name);
      if (containsRun(kw, dw) || containsRun(dw, kw)) hits.push(`${d.name} ~ ${k.name}`);
    }
  }
  assert.deepEqual(hits, []);
});

test("B5-03 — the Concierge resolves no live product for the draft names today", () => {
  for (const q of ["Tell me about This Is Him.", "Tell me about This Is Her.", "Tell me about This is Him!", "Tell me about This is Her!"]) {
    const r = resolveIntent(q, {});
    assert.equal(r.entitySlug, undefined, `"${q}" → ${r.entitySlug}`);
    assert.deepEqual(r.compareSlug, [], `"${q}" → compare ${JSON.stringify(r.compareSlug)}`);
  }
});

test("B5-04 — shop search names no live product for the draft names today", () => {
  for (const q of ["This Is Him", "This Is Her"]) {
    assert.deepEqual(findNamedFragrances(q).map((d) => d.title), [], q);
    assert.notEqual(resolveShopQuery(q).mode, 0, q);
  }
});

test("B5-05 — gender-preference phrases stay preferences (no name capture by 'her' / 'him')", () => {
  for (const q of ["something for her", "something for him", "a gift for her"]) assert.deepEqual(findNamedFragrances(q), [], q);
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
process.exit(failed ? 1 : 0);

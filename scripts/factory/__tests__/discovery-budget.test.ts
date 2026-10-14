/**
 * Product discovery and budget guard (W9-UX-P1).
 *
 * Shop search: a query that names catalogue fragrances finds them, even when its words are
 * also scent vocabulary ("212 Sexy Men", "Euphoria Men"); preference queries ("vanilla
 * fragrances for men", "something sexy for an evening") still go to the recommendation
 * engine; every non-name query returns exactly what the previous shop logic returned.
 * Exercises the shop page's own selection path: resolveShopQuery → shopSearchResults.
 *
 * Concierge budget: a number that opens a fragrance name ("Tell me about 212 Sexy") is not a
 * budget; genuine budgets ("My budget is R250", "Under R500 please") still are.
 *
 * Run: npx tsx scripts/factory/__tests__/discovery-budget.test.ts
 */
import assert from "node:assert/strict";
import { resolveShopQuery, shopSearchResults, findNamedFragrances } from "../../../app/lib/shopSearch";
import { parseIntent, type IntentSignals } from "../../../app/lib/intentParser";
import { recommendFragrances } from "../../../app/lib/recommendFragrances";
import { catalogueMaps } from "../../../app/lib/discovery";
import type { DisplayFragrance } from "../../../app/lib/knowledgeAdapter";
import { extractProfile } from "../../../app/lib/concierge/profileExtractor";
import { resolveIntent } from "../../../app/lib/concierge/intentResolver";
import { planConversation } from "../../../app/lib/concierge/conversationPlanner";
import { planRetrieval } from "../../../app/lib/concierge/retrievalPlanner";
import { buildContext } from "../../../app/lib/concierge/contextBuilder";
import type { ConversationProfile, ConversationState } from "../../../app/lib/concierge/types";

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓  ${name}`); passed++; }
  catch (e: any) { console.log(`  ✗  ${name}\n     ${e.message}`); failed++; }
}

const slugOf = new Map([...catalogueMaps.byName].map(([name, k]) => [name, k.slug] as const));
assert.equal(slugOf.size, catalogueMaps.display.length);
assert.ok(catalogueMaps.display.every((d) => slugOf.has(d.title)), "display title without catalogue slug");
const shop = (q: string, tab = "All") => {
  const r = resolveShopQuery(q);
  return { mode: r.mode, signals: r.signals, slugs: shopSearchResults(q, r, tab).map((d) => slugOf.get(d.title)!) };
};

// The shop's selection logic before W9-UX-P1, kept verbatim as the reference for every
// query that does not name a fragrance.
function legacy(query: string, tab: string): DisplayFragrance[] {
  const trimmed = query.trim();
  const raw = trimmed ? parseIntent(query.toLowerCase()) : null;
  const detectedSignals: IntentSignals | null = raw && Object.values(raw).some((v) => v !== undefined) ? raw : null;
  const searchTerm = query.toLowerCase();
  const matchesTab = (item: DisplayFragrance): boolean => {
    if (tab === "All") return true;
    if (tab === "Skye" || tab === "Rose" || tab === "Elite") return item.collection === tab;
    if (tab === "Best Sellers") return item.bestSeller;
    if (tab === "New Arrivals") return item.newArrival;
    return true;
  };
  if (!searchTerm) return catalogueMaps.display.filter((item) => matchesTab(item));
  if (detectedSignals) {
    const results = recommendFragrances(catalogueMaps.adapted, detectedSignals);
    const seen = new Set<string>();
    const ranked: DisplayFragrance[] = [];
    for (const f of [results.bestMatch, ...results.similarMatches, results.luxuryUpgrade, results.hiddenGem]) {
      if (!f || seen.has(f.name)) continue;
      const display = catalogueMaps.displayByName.get(f.name);
      if (!display) continue;
      if (!matchesTab(display)) continue;
      seen.add(f.name);
      ranked.push(display);
    }
    return ranked;
  }
  return catalogueMaps.display.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm) ||
      item.subtitle?.toLowerCase().includes(searchTerm) ||
      item.mood?.toLowerCase().includes(searchTerm) ||
      item.profile?.toLowerCase().includes(searchTerm) ||
      item.notes?.some((note: string) => note.toLowerCase().includes(searchTerm));
    return matchesSearch && matchesTab(item);
  });
}
const TABS = ["All", "Skye", "Rose", "Elite", "Best Sellers", "New Arrivals"];

console.log("\n── Shop: named fragrances ────────────────────────────────────────");

test("SS-01 — '212 Sexy Men' finds 212 Sexy Men Inspired only (keyword mode, no intent chips)", () => {
  const r = shop("212 Sexy Men");
  assert.deepEqual(r.slugs, ["212-sexy-men-inspired"]);
  assert.equal(r.mode, 2); assert.equal(r.signals, null);
});
test("SS-02 — '212 Sexy' finds the women's 212 Sexy first, then 212 Sexy Men", () =>
  assert.deepEqual(shop("212 Sexy").slugs, ["212-sexy-inspired", "212-sexy-men-inspired"]));
test("SS-03 — '212 VIP Men' finds 212 VIP Men Inspired only", () =>
  assert.deepEqual(shop("212 VIP Men").slugs, ["212-vip-men-inspired"]));
test("SS-04 — '212 VIP' finds the three 212 VIP products and nothing else", () =>
  assert.deepEqual(new Set(shop("212 VIP").slugs), new Set(["212-vip-black-inspired", "212-vip-rose-inspired", "212-vip-men-inspired"])));
test("SS-05 — '212' finds all six 212 products", () => {
  const s = shop("212").slugs;
  assert.equal(s.length, 6, JSON.stringify(s));
  assert.ok(s.every((x) => x.startsWith("212-")), JSON.stringify(s));
});
test("SS-06 — 'Euphoria Men' finds the men's Euphoria first; 'Euphoria' finds both", () => {
  assert.deepEqual(shop("Euphoria Men").slugs, [slugOf.get("Euphoria Men Inspired")]);
  assert.equal(shop("Euphoria").slugs.filter((s) => /euphoria/.test(s)).length, 2);
});
test("SS-07 — 'Burberry Body' and 'Armani Diamonds' find their products first", () => {
  assert.equal(shop("Burberry Body").slugs[0], "burberry-body-inspired");
  assert.equal(shop("Armani Diamonds").slugs[0], "armani-diamonds-inspired");
});
test("SS-08 — names made of scent vocabulary find the product: Cloud, Dark Vanilla, Oud Wood, Le Male, Light Blue", () => {
  for (const [q, title] of [["Cloud", "Cloud Inspired"], ["Dark Vanilla", "Dark Vanilla Inspired"], ["Oud Wood", "Oud Wood Inspired"],
                            ["Le Male", "Le Male Inspired"], ["Light Blue", "Light Blue Inspired"], ["Ultra Male", "Ultra Male Inspired"]]) {
    const r = shop(q);
    assert.equal(r.mode, 2, `${q} mode ${r.mode}`);
    assert.equal(r.slugs[0], slugOf.get(title), `${q} → ${r.slugs.slice(0, 3)}`);
  }
});
test("SS-09 — typed 'Inspired', accents and curly apostrophes still match", () => {
  assert.deepEqual(shop("212 Sexy Men Inspired").slugs, ["212-sexy-men-inspired"]);
  assert.equal(shop("212 VIP Rosé").slugs[0], "212-vip-rose-inspired");
  assert.equal(shop("Rose of No Man’s Land").slugs[0], slugOf.get("Rose of No Man's Land Inspired"));
});
test(`SS-10 — every catalogue name (bare and full) finds itself first (${catalogueMaps.display.length})`, () => {
  const problems: string[] = [];
  for (const d of catalogueMaps.display) {
    for (const q of [d.title.replace(/ Inspired$/, ""), d.title]) {
      const s = shop(q).slugs;
      if (s[0] !== slugOf.get(d.title)) problems.push(`${q} → ${s.slice(0, 3).join(", ") || "(none)"}`);
    }
  }
  assert.equal(problems.length, 0, `${problems.length}:\n     ${problems.slice(0, 10).join("\n     ")}`);
});

console.log("\n── Shop: names inside natural requests ───────────────────────────");

test("SS-30 — named requests put the intended fragrance first", () => {
  for (const [q, slug] of [["212 Sexy for men", "212-sexy-men-inspired"], ["212 Sexy for women", "212-sexy-inspired"], ["212 Men Sexy", "212-sexy-men-inspired"],
                           ["Find 212 VIP Men", "212-vip-men-inspired"], ["Tell me about 212 Sexy", "212-sexy-inspired"], ["the men's 212 Sexy", "212-sexy-men-inspired"],
                           ["Find Burberry Body", "burberry-body-inspired"], ["Show me Armani Diamonds", "armani-diamonds-inspired"],
                           ["Tell me about Euphoria Men", slugOf.get("Euphoria Men Inspired")!]] as const) {
    const r = shop(q);
    assert.equal(r.mode, 2, `${q} mode ${r.mode}`);
    assert.deepEqual(r.slugs, [slug], `${q} → ${r.slugs.slice(0, 4)}`);
  }
});
test("SS-31 — '212 Sexy for men' never shows the women's 212 Sexy; '212 Sexy for women' never shows the men's", () => {
  assert.ok(!shop("212 Sexy for men").slugs.includes("212-sexy-inspired"));
  assert.ok(!shop("212 Sexy for women").slugs.includes("212-sexy-men-inspired"));
});
test("SS-32 — '212 VIP Carolina Herrera' lists every 212 VIP variant and guesses no single identity", () => {
  assert.deepEqual(new Set(shop("212 VIP Carolina Herrera").slugs), new Set(["212-vip-black-inspired", "212-vip-rose-inspired", "212-vip-men-inspired"]));
  assert.equal(shop("Good Girl Carolina Herrera").slugs[0], slugOf.get("Good Girl Inspired"));
});
test("SS-33 — preference requests stay discovery, including ones that contain vocabulary-only names", () => {
  for (const q of ["Vanilla fragrances for men", "Something sexy for an evening", "Recommend a warm fragrance for men",
                   "a dark vanilla scent for men", "a cloud-like scent for women", "something fresh for him"])
    assert.equal(shop(q).mode, 1, `${q} mode ${shop(q).mode} → ${shop(q).slugs.slice(0, 3)}`);
});
test("SS-34 — named requests use the Concierge's flanker and boundary rules", () => {
  assert.deepEqual(shop("Show me Black Opium").slugs, ["black-opium-inspired"]);
  assert.ok(!shop("I love vanilla scents").slugs.includes("ani-inspired"));
  assert.deepEqual(new Set(shop("Compare 212 Sexy and 212 Sexy Men").slugs), new Set(["212-sexy-inspired", "212-sexy-men-inspired"]));
});
test("SS-35 — 'Tell me about <name>' finds every catalogue name that carries an identifying word", () => {
  const problems: string[] = [];
  let checked = 0;
  for (const d of catalogueMaps.display) {
    const q = `Tell me about ${d.title.replace(/ Inspired$/, "")}`;
    if (resolveShopQuery(q).mode === 1) continue; // vocabulary-only names inside a request are preferences (SS-33)
    checked++;
    const s = shop(q).slugs;
    if (s[0] !== slugOf.get(d.title)) problems.push(`${q} → ${s.slice(0, 3).join(", ") || "(none)"}`);
  }
  assert.ok(checked > 250, `only ${checked} names checked`);
  assert.equal(problems.length, 0, `${problems.length}:\n     ${problems.slice(0, 10).join("\n     ")}`);
});

console.log("\n── Shop: whole-word safety and preserved discovery ───────────────");

test("SS-20 — whole words only: 'Ani' never matches Vanilla or Armani names; 'vanilla' never names Ani", () => {
  const ani = findNamedFragrances("Ani").map((d) => d.title);
  assert.deepEqual(ani, ["Ani Inspired"]);
  assert.ok(!findNamedFragrances("vanilla").some((d) => d.title === "Ani Inspired"));
});
test("SS-21 — preference queries keep recommendation mode", () => {
  for (const [q, key, value] of [["Vanilla fragrances for men", "gender", "male"], ["Something sexy for an evening", "vibe", "Sexy"]] as const) {
    const r = shop(q);
    assert.equal(r.mode, 1, `${q} mode ${r.mode}`);
    assert.equal((r.signals as any)?.[key], value, `${q} signals ${JSON.stringify(r.signals)}`);
    assert.ok(r.slugs.length > 0, `${q} returned nothing`);
  }
});
test("SS-22 — vocabulary-only fragments stay preferences: 'sexy men', 'men', 'vanilla', 'rose', 'oud', 'fresh', 'for him'", () => {
  for (const q of ["sexy men", "men", "vanilla", "rose", "oud", "fresh", "for him", "Sexy"]) assert.equal(shop(q).mode, 1, q);
});
const NON_NAME_QUERIES = ["", "Vanilla fragrances for men", "Something sexy for an evening", "sexy men", "men", "vanilla", "rose", "oud", "fresh", "something fresh for him", "a rose for her", "light and fresh", "oud for men",
  "for him", "for her", "Recommend a warm fragrance for men", "a dark vanilla scent for men", "date night", "office", "summer", "woody", "dark and intense", "lavender", "jasmine", "21", "xyz-no-match", "  "];
test(`SS-23 — every query that names no fragrance returns exactly the previous results on every tab (${NON_NAME_QUERIES.length} × ${TABS.length})`, () => {
  const diffs: string[] = [];
  for (const q of NON_NAME_QUERIES) for (const t of TABS) {
    assert.deepEqual(findNamedFragrances(q), [], `${JSON.stringify(q)} names a fragrance`);
    const now = shopSearchResults(q, resolveShopQuery(q), t).map((d) => d.title);
    const before = (q.trim() ? legacy(q, t) : legacy("", t)).map((d) => d.title);
    if (JSON.stringify(now) !== JSON.stringify(before)) diffs.push(`${JSON.stringify(q)} [${t}]: ${before.length} → ${now.length}`);
  }
  assert.equal(diffs.length, 0, diffs.join("; "));
});
test("SS-23b — keyword searches that name a fragrance keep every previous result, with the named fragrance first", () => {
  for (const [q, title] of [["Ani", "Ani Inspired"], ["Sauvage", "Sauvage Inspired"], ["Y", "Y Inspired"], ["Opium", "Opium Inspired"], ["Alien", "Alien Inspired"], ["bergamot", "Oud Bergamot Inspired"]] as const) {
    for (const t of TABS) {
      const now = shopSearchResults(q, resolveShopQuery(q), t).map((d) => d.title);
      const before = legacy(q, t).map((d) => d.title);
      assert.deepEqual([...now].sort(), [...before].sort(), `${q} [${t}] membership changed`);
      if (now.includes(title)) assert.equal(now[0], title, `${q} [${t}] first ${now[0]}`);
    }
  }
});
test("SS-24 — name results respect collection tabs; a name outside the tab gives the normal empty result", () => {
  assert.deepEqual(shop("212 Sexy Men", "Skye").slugs, ["212-sexy-men-inspired"]);
  assert.deepEqual(shop("212 Sexy Men", "Rose").slugs, []);
  assert.deepEqual(shop("212 Sexy", "Rose").slugs, ["212-sexy-inspired"]);
  assert.deepEqual(shop("Burberry Body", "Skye").slugs, []);
});
test("SS-25 — the page's price sorts keep every name result (stable over equal prices)", () => {
  const items = shopSearchResults("212 VIP", resolveShopQuery("212 VIP"), "All");
  const low = [...items].sort((a, b) => a.prices["5ml"] - b.prices["5ml"]).map((d) => d.title);
  const high = [...items].sort((a, b) => b.prices["5ml"] - a.prices["5ml"]).map((d) => d.title);
  assert.equal(new Set(low).size, 3); assert.equal(new Set(high).size, 3);
});

console.log("\n── Concierge budget ──────────────────────────────────────────────");

const budget = (msg: string, current?: ConversationProfile) => extractProfile(msg, current).budget?.value;
test("BG-01 — fragrance-name numbers are not budgets", () => {
  for (const m of ["Tell me about 212 Sexy.", "Tell me about 212 VIP for men.", "Tell me about 212 VIP Men.", "Compare 212 Sexy and 212 Sexy Men.",
                   "Tell me about 212.", "Tell me about 24 Faubourg.", "Tell me about 1 Million.", "What is 212 VIP Black like?"])
    assert.equal(budget(m), undefined, `"${m}" → budget ${budget(m)}`);
});
test("BG-02 — genuine budgets still extracted", () => {
  for (const [m, v] of [["My budget is R250.", 250], ["I can spend around R300.", 300], ["Under R500 please.", 500],
                        ["My budget is about R212.", 212], ["My budget is about 212.", 212], ["Something around 300", 300],
                        ["about R212 please", 212], ["up to R1000", 1000], ["I want to spend 400", 400]] as const)
    assert.equal(budget(m), v, `"${m}" → ${budget(m)}`);
});
test("BG-03 — 'Show me 212 Sexy under R300' resolves the fragrance and the budget independently", () => {
  const m = "Show me 212 Sexy under R300.";
  assert.equal(budget(m), 300);
  assert.equal(resolveIntent(m, {}).entitySlug, "212-sexy-inspired");
});
test("BG-04 — follow-up turns: a named 212 question keeps the earlier budget; a new budget replaces it", () => {
  let p = extractProfile("My budget is R250.");
  p = extractProfile("Tell me about 212 Sexy.", p);
  assert.equal(p.budget?.value, 250);
  p = extractProfile("Actually my budget is R400.", p);
  assert.equal(p.budget?.value, 400);
});
test("BG-05 — the Concierge prompt for 'Tell me about 212 Sexy.' carries no budget section", () => {
  const message = "Tell me about 212 Sexy.";
  const state = { turns: [], profile: extractProfile(message), context: {}, lastRecommendationSlugs: [], comparisonSlugs: [], clarificationTurnCount: 0 } as unknown as ConversationState;
  const plan = planConversation(message, state);
  const resolved = resolveIntent(message, {});
  const retrieval = planRetrieval(resolved, {}, state.profile, undefined, undefined, null, undefined, message, undefined);
  const text = buildContext(retrieval, state, plan, resolved.intent, null, null, null, message).sections.map((s) => s.content).join("\n");
  assert.ok(!/Budget\n• Around R/.test(text), "budget section present");
  assert.ok(!/R212/.test(text), "R212 present in context");
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
process.exit(failed ? 1 : 0);

/**
 * Product Name Text Presence — Focused Verification Script
 *
 * Exercises planResponse() to confirm that [PRODUCT:slug] markers are replaced
 * by canonical product names in the content text, not stripped to "".
 *
 * Run: npx tsx scripts/test-product-name-text.ts
 */

import { planResponse } from "../app/lib/concierge/responsePlanner";
import type { RetrievalContext } from "../app/lib/concierge/contextBuilder";
import type { ConversationPlan } from "../app/lib/concierge/conversationPlanner";
import type { FragranceKnowledge } from "../app/lib/mkc/types";
import type { AcademyArticle } from "../app/lib/academy/types";

// ── Minimal stubs ─────────────────────────────────────────────────────────────

function makeFragrance(slug: string, name: string): FragranceKnowledge {
  return {
    id: slug, slug, brand: "Maison Skye & Rose", name,
    collection: "Elite", catalogVersion: "1.0", status: "active",
    gender: "unisex", family: ["Fresh"], scentCharacter: "Fresh & Light",
    projection: "moderate", profile: "Fresh", season: "Summer",
    notes: { top: [], heart: [], base: [] }, notesEvidenceLocked: true,
    mood: "Fresh", vibe: ["Fresh"], occasions: ["Daily Wear"], seasons: ["Summer"],
    signatureStyle: [], recommendedFor: [], prices: { "5ml": 60, "10ml": 100, "30ml": 250 },
    images: { "5ml": "/images/blue-5ml.png", "10ml": "/images/blue-10ml.png", "30ml": "/images/glass-blue-30ml.png" },
    bestSeller: false, newArrival: false, subtitle: "Test",
    description: "Test.", academyArticleIds: [], academyCategories: [], educationTags: [],
    learningPath: [], sweetness: 1, freshness: 5, warmth: 2, intensity: 2,
    versatility: 3, popularity: 5, relationships: {},
  } as FragranceKnowledge;
}

function makeRetrieval(frags: ReturnType<typeof makeFragrance>[]): RetrievalContext {
  return {
    fragrances: frags,
    articles: [],
    collectionName: "Elite",
    cardTarget: frags.length,
  } as unknown as RetrievalContext;
}

const PLAN: ConversationPlan = {
  action: "new_search",
  requiresRetrieval: true,
  requiresClarification: false,
  requiresComparison: false,
  reuseRecommendations: false,
  nextIntent: "similar_to",
} as ConversationPlan;

// ── Harness ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(label: string, actual: unknown, expected: unknown): void {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) { passed++; } else { failed++; }
  console.log(`[${ok ? "PASS" : "FAIL"}] ${label}`);
  if (!ok) {
    console.log(`       expected: ${JSON.stringify(expected)}`);
    console.log(`       actual:   ${JSON.stringify(actual)}`);
  }
}

function assertContains(label: string, haystack: string, needle: string): void {
  const ok = haystack.includes(needle);
  if (ok) { passed++; } else { failed++; }
  console.log(`[${ok ? "PASS" : "FAIL"}] ${label}`);
  if (!ok) {
    console.log(`       needle not found: ${JSON.stringify(needle)}`);
    console.log(`       in: ${JSON.stringify(haystack)}`);
  }
}

function assertNotContains(label: string, haystack: string, needle: string): void {
  const ok = !haystack.includes(needle);
  if (ok) { passed++; } else { failed++; }
  console.log(`[${ok ? "PASS" : "FAIL"}] ${label}`);
  if (!ok) {
    console.log(`       needle should be absent: ${JSON.stringify(needle)}`);
    console.log(`       in: ${JSON.stringify(haystack)}`);
  }
}

// ── §100  Bold-wrapped valid marker ──────────────────────────────────────────

console.log("\n§100  Bold-wrapped valid marker");

const wss = makeFragrance("wood-sage-sea-salt-inspired", "Wood Sage Sea Salt Inspired");
const r1 = makeRetrieval([wss]);

const p1 = planResponse(
  "Something like **[PRODUCT:wood-sage-sea-salt-inspired]** — it has a coastal feel.",
  "similar_to", r1, PLAN,
);

assertContains(
  "§101  canonical name present in content",
  p1.content,
  "Wood Sage Sea Salt Inspired",
);
assertNotContains(
  "§102  no orphaned ** asterisks",
  p1.content,
  "****",
);
assertNotContains(
  "§103  marker syntax not leaked to UI",
  p1.content,
  "[PRODUCT:",
);
assert(
  "§104  slug still in recommendedSlugs (card data correct)",
  p1.recommendedSlugs.includes("wood-sage-sea-salt-inspired"),
  true,
);

// ── §200  Non-bold valid marker ───────────────────────────────────────────────

console.log("\n§200  Non-bold valid marker");

const p2 = planResponse(
  "I recommend [PRODUCT:wood-sage-sea-salt-inspired] for a coastal feel.",
  "similar_to", r1, PLAN,
);

assertContains(
  "§201  canonical name present in content",
  p2.content,
  "Wood Sage Sea Salt Inspired",
);
assertNotContains(
  "§202  marker syntax not leaked",
  p2.content,
  "[PRODUCT:",
);
assert(
  "§203  slug in recommendedSlugs",
  p2.recommendedSlugs.includes("wood-sage-sea-salt-inspired"),
  true,
);

// ── §300  Invalid / unknown marker ───────────────────────────────────────────

console.log("\n§300  Invalid / unknown marker (not in retrieval)");

const p3 = planResponse(
  "I recommend **[PRODUCT:hallucinated-fragrance-inspired]** for you.",
  "similar_to", r1, PLAN,
);

assertNotContains(
  "§301  invalid bold-wrapped marker removed — no orphaned ****",
  p3.content,
  "****",
);
assertNotContains(
  "§302  marker syntax not leaked",
  p3.content,
  "[PRODUCT:",
);
assertNotContains(
  "§303  hallucinated slug not in recommendedSlugs",
  JSON.stringify(p3.recommendedSlugs),
  "hallucinated-fragrance-inspired",
);

const p3b = planResponse(
  "Try [PRODUCT:unknown-slug] instead.",
  "similar_to", r1, PLAN,
);

assertNotContains(
  "§304  non-bold unknown marker removed",
  p3b.content,
  "[PRODUCT:",
);

// ── §400  Multiple products ───────────────────────────────────────────────────

console.log("\n§400  Multiple products in one response");

const sauv = makeFragrance("sauvage-inspired", "Sauvage Inspired");
const r2 = makeRetrieval([wss, sauv]);

const p4 = planResponse(
  "Two options: **[PRODUCT:wood-sage-sea-salt-inspired]** for freshness and **[PRODUCT:sauvage-inspired]** for presence.",
  "comparison", r2, PLAN,
);

assertContains(
  "§401  first product name in content",
  p4.content,
  "Wood Sage Sea Salt Inspired",
);
assertContains(
  "§402  second product name in content",
  p4.content,
  "Sauvage Inspired",
);
assertNotContains(
  "§403  no orphaned asterisks",
  p4.content,
  "****",
);
assert(
  "§404  both slugs in recommendedSlugs",
  p4.recommendedSlugs.includes("wood-sage-sea-salt-inspired") &&
  p4.recommendedSlugs.includes("sauvage-inspired"),
  true,
);

// ── §410  Mixed-marker order — non-bold before bold, cardTarget=1 ────────────
// Regression for the two-pass ordering bug.
//
// LLM output has a plain [PRODUCT:a] marker before a bold **[PRODUCT:b]** marker.
// Step 1 (bold pass) would encounter b first; Step 2 (non-bold) would encounter a.
// Without the pre-scan, rawSlugs would be ["b", "a"], so cardTarget=1 selects b.
// With the pre-scan, rawSlugs is ["a", "b"] (text order), so cardTarget=1 selects a.

console.log("\n§410  Mixed-marker order — non-bold precedes bold, cardTarget=1 selects first-mentioned");

const frag_a = makeFragrance("fragrance-a-slug", "Fragrance A");
const frag_b = makeFragrance("fragrance-b-slug", "Fragrance B");
const r_order = makeRetrievalWithTarget([frag_a, frag_b], 1);

const p_order = planResponse(
  "I'd suggest [PRODUCT:fragrance-a-slug] for everyday and **[PRODUCT:fragrance-b-slug]** for special occasions.",
  "similar_to", r_order, PLAN,
);

assertContains("§411  non-bold product name in content",  p_order.content, "Fragrance A");
assertContains("§412  bold product name in content",      p_order.content, "Fragrance B");
assert(
  "§413  first-mentioned slug selected when cardTarget=1 (non-bold appears first in text)",
  p_order.recommendedSlugs,
  ["fragrance-a-slug"],
);
assertNotContains("§414  no marker syntax leaked", p_order.content, "[PRODUCT:");
assertNotContains("§415  no orphaned asterisks",   p_order.content, "****");

// ── §500  Mixed valid and invalid markers ────────────────────────────────────

console.log("\n§500  Mixed valid and invalid markers");

const p5 = planResponse(
  "I'd pick **[PRODUCT:wood-sage-sea-salt-inspired]** over **[PRODUCT:invalid-slug]**.",
  "comparison", r1, PLAN,
);

assertContains(
  "§501  valid name present",
  p5.content,
  "Wood Sage Sea Salt Inspired",
);
assertNotContains(
  "§502  invalid construct fully removed (no ****)",
  p5.content,
  "****",
);
assertNotContains(
  "§503  invalid slug not in recommendedSlugs",
  JSON.stringify(p5.recommendedSlugs),
  "invalid-slug",
);

// ── §600  Prose readability ───────────────────────────────────────────────────

console.log("\n§600  Prose readability — sentence coherence");

const p6 = planResponse(
  "I'd recommend **[PRODUCT:wood-sage-sea-salt-inspired]** — it captures that coastal, mineral freshness you're after.",
  "similar_to", r1, PLAN,
);

// The sentence should parse as: "I'd recommend Wood Sage Sea Salt Inspired — it captures..."
assertContains(
  "§601  sentence prefix intact",
  p6.content,
  "I'd recommend",
);
assertContains(
  "§602  name follows recommendation verb",
  p6.content,
  "I'd recommend Wood Sage Sea Salt Inspired",
);
assertContains(
  "§603  sentence continuation intact",
  p6.content,
  "it captures that coastal",
);

// ── §700  ARTICLE markers — behavior with empty retrieval.articles ───────────

console.log("\n§700  ARTICLE markers — r1 has empty retrieval.articles");

const p7 = planResponse(
  "See [ARTICLE:guide-to-fragrance-families] for context.",
  "education", r1, { ...PLAN, nextIntent: "education" },
);

assertNotContains(
  "§701  ARTICLE marker syntax not leaked",
  p7.content,
  "[ARTICLE:",
);
assertNotContains(
  "§702  no **** artifact from article (not bold-wrapped by model)",
  p7.content,
  "****",
);
// With the retrieval boundary fix, a slug not in retrieval.articles is NOT added
// to articleSlugs — so formatResponse cannot render a card for it.
assert(
  "§703  out-of-retrieval article slug NOT in articleSlugs (retrieval boundary enforced)",
  p7.articleSlugs.includes("guide-to-fragrance-families"),
  false,
);

// ── §800  ARTICLE marker — title in prose ─────────────────────────────────────
// System prompt emits [ARTICLE:slug] without bold-wrapping. Verify that the
// article title appears in the content text (not an empty gap).

console.log("\n§800  ARTICLE marker — canonical title in prose");

function makeArticle(slug: string, title: string): AcademyArticle {
  return {
    slug, title,
    subtitle: "Test article",
    category: "Fragrance Fundamentals",
    excerpt: "Test excerpt.",
    readTime: 3,
    publishedAt: "2026-01-01",
    relatedFragranceIds: [],
    content: [],
  } as AcademyArticle;
}

function makeRetrievalWithArticles(
  frags: ReturnType<typeof makeFragrance>[],
  arts: AcademyArticle[],
): RetrievalContext {
  return {
    fragrances: frags,
    articles: arts,
    collectionName: "Elite",
    cardTarget: frags.length,
  } as unknown as RetrievalContext;
}

const notePyramid = makeArticle("the-note-pyramid-explained", "The Note Pyramid Explained");
const r8 = makeRetrievalWithArticles([wss], [notePyramid]);

const p8 = planResponse(
  "You might find [ARTICLE:the-note-pyramid-explained] helpful for understanding how notes evolve.",
  "education", r8, { ...PLAN, nextIntent: "education" },
);

assertContains(
  "§801  article title present in content",
  p8.content,
  "The Note Pyramid Explained",
);
assertNotContains(
  "§802  article marker syntax not leaked",
  p8.content,
  "[ARTICLE:",
);
assertNotContains(
  "§803  no orphaned **** from bold-wrapped article (if model wraps)",
  p8.content,
  "****",
);
assert(
  "§804  article slug captured for card rendering",
  p8.articleSlugs.includes("the-note-pyramid-explained"),
  true,
);

// Sentence coherence — "You might find The Note Pyramid Explained helpful"
assertContains(
  "§805  sentence remains coherent around article title",
  p8.content,
  "The Note Pyramid Explained helpful",
);

// ── §810  Bold-wrapped ARTICLE marker ────────────────────────────────────────

console.log("\n§810  Bold-wrapped ARTICLE marker (safety: handled as unit)");

const p81 = planResponse(
  "Read **[ARTICLE:the-note-pyramid-explained]** before choosing.",
  "education", r8, { ...PLAN, nextIntent: "education" },
);

assertContains(
  "§811  bold-wrapped article title present in content",
  p81.content,
  "The Note Pyramid Explained",
);
assertNotContains(
  "§812  no orphaned **** from bold-wrapped article marker",
  p81.content,
  "****",
);
assert(
  "§813  article slug captured from bold-wrapped form",
  p81.articleSlugs.includes("the-note-pyramid-explained"),
  true,
);

// ── §820  Unknown / disallowed ARTICLE marker ─────────────────────────────────

console.log("\n§820  Unknown ARTICLE marker — safe removal");

const p82 = planResponse(
  "See [ARTICLE:nonexistent-article] for more.",
  "education", r8, { ...PLAN, nextIntent: "education" },
);

assertNotContains(
  "§821  unknown article marker not leaked",
  p82.content,
  "[ARTICLE:",
);
assertNotContains(
  "§822  no orphaned ** from unknown bold-wrapped article",
  p82.content,
  "****",
);

// ── §830  Out-of-retrieval article — exists in full catalogue, absent from retrieval ──
// "guide-to-fragrance-families" is in academyCatalogue but NOT in retrieval.articles.
// Before the fix: slug pushed to articleSlugs → formatResponse would render a card.
// After the fix: slug NOT pushed → no card, no title in content.

console.log("\n§830  Out-of-retrieval article — in full catalogue but absent from retrieval");

// r8 has only "the-note-pyramid-explained" in retrieval.articles
const p83 = planResponse(
  "Check out [ARTICLE:guide-to-fragrance-families] for an overview.",
  "education", r8, { ...PLAN, nextIntent: "education" },
);

assertNotContains(
  "§831  out-of-retrieval article title not in content",
  p83.content,
  "Guide to Fragrance Families",
);
assertNotContains(
  "§832  out-of-retrieval article marker not leaked",
  p83.content,
  "[ARTICLE:",
);
assert(
  "§833  out-of-retrieval slug NOT in articleSlugs (no card rendered)",
  p83.articleSlugs.includes("guide-to-fragrance-families"),
  false,
);

// ── §900  Out-of-retrieval product ───────────────────────────────────────────
// A product exists in the catalogue but was NOT included in retrieval context.
// The model emits its slug as a PRODUCT marker. Expected behaviour:
//   - frag lookup returns undefined → "" (name not in content)
//   - slug is NOT in recommendedSlugs (Precedence 1 gives nothing)
//   - if content has no name, Precedence 2 also finds nothing → no card

console.log("\n§900  Out-of-retrieval product");

// retrieval contains only wss; aventus is out of retrieval
const p9 = planResponse(
  "**[PRODUCT:aventus-inspired]** is popular but I have to recommend **[PRODUCT:wood-sage-sea-salt-inspired]**.",
  "similar_to", r1, PLAN,
);

assertNotContains(
  "§901  out-of-retrieval product name not added to content",
  p9.content,
  "Aventus Inspired",
);
assertNotContains(
  "§902  out-of-retrieval slug not in recommendedSlugs",
  JSON.stringify(p9.recommendedSlugs),
  "aventus-inspired",
);
assertContains(
  "§903  in-retrieval product name still present",
  p9.content,
  "Wood Sage Sea Salt Inspired",
);
assert(
  "§904  in-retrieval slug still in recommendedSlugs",
  p9.recommendedSlugs.includes("wood-sage-sea-salt-inspired"),
  true,
);

// ── §1000  Card-target limiting ───────────────────────────────────────────────
// When cardTarget=1 but two product markers are emitted, both canonical names
// appear in the content text, but finalSlugs is capped to 1 card.
// This is a known cosmetic inconsistency: the guest sees two names in prose
// but only one product card below the bubble.

console.log("\n§1000  Card-target limiting (text mentions 2, cardTarget=1)");

function makeRetrievalWithTarget(
  frags: ReturnType<typeof makeFragrance>[],
  target: number,
): RetrievalContext {
  return {
    fragrances: frags,
    articles: [],
    collectionName: "Elite",
    cardTarget: target,
  } as unknown as RetrievalContext;
}

const sauv2 = makeFragrance("sauvage-inspired", "Sauvage Inspired");
const r10 = makeRetrievalWithTarget([wss, sauv2], 1);

const p10 = planResponse(
  "Try **[PRODUCT:wood-sage-sea-salt-inspired]** or **[PRODUCT:sauvage-inspired]**.",
  "similar_to", r10, PLAN,
);

// Both names should appear in content text
assertContains("§1001  first product name in content", p10.content, "Wood Sage Sea Salt Inspired");
assertContains("§1002  second product name in content", p10.content, "Sauvage Inspired");
// Only one card rendered (cardTarget=1 caps finalSlugs)
assert(
  "§1003  recommendedSlugs capped to 1 by cardTarget",
  p10.recommendedSlugs.length,
  1,
);
// Known cosmetic inconsistency: content has 2 names, cards show 1
// This is accepted behaviour — documented here, not fixed in this patch.

// ── §1010  Text replacement cannot introduce a Precedence-2 name ─────────────
// After PRODUCT markers are resolved to names, Precedence 2 runs only when
// finalSlugs is empty (no valid markers). When valid markers populate finalSlugs
// (Precedence 1), Precedence 2 is skipped entirely.
// Edge case: what if an invalid marker's replacement ("") causes Precedence 2
// to activate, and the content already had a valid name from another marker?
// Verify: valid marker → finalSlugs populated via Precedence 1 → P2 skipped.

console.log("\n§1010  Precedence-2 cannot be injected via text replacement");

// Only invalid markers are emitted; valid name appears in surrounding prose
const p11 = planResponse(
  "Wood Sage Sea Salt Inspired is what I'd suggest, not **[PRODUCT:invalid-slug]**.",
  "similar_to", r1, PLAN,
);

// invalid marker resolved to "" → Precedence 1 has no valid slugs
// Precedence 2 matches "Wood Sage Sea Salt Inspired" in content → adds slug
// This is EXPECTED behaviour (P2 exists for this case), not a vulnerability.
// Verify the slug ends up in recommendedSlugs (P2 did its job correctly).
assert(
  "§1011  P2 correctly matches canonical name in prose",
  p11.recommendedSlugs.includes("wood-sage-sea-salt-inspired"),
  true,
);
assertNotContains(
  "§1012  invalid slug not added",
  JSON.stringify(p11.recommendedSlugs),
  "invalid-slug",
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

/**
 * L-RESUME-P3D - Product-link integrity
 *
 * ProductCard links must use authoritative MKC catalogue slugs. Its previous
 * fallback derived a slug from the display title (identical to deriveSlug),
 * which is wrong for governed slug exceptions: the Capri record's title-derived
 * URL is not a catalogue slug, so /product/<derived> returned 404.
 *
 * Sections F and X are functional checks against the real catalogue and the
 * canonicalSlugForName resolver that ProductCard now uses. Section S is a
 * supplementary STATIC source check of ProductCard and selected callers; it is
 * not a runtime component test and does not prove browser behaviour. Browser
 * acceptance at mobile and desktop widths is a separate, later step.
 *
 * Deterministic data; no network, no database, no storage access.
 *
 * Run: npx tsx scripts/factory/__tests__/p3d-product-link-integrity.test.ts
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { mkcCatalogue } from "../../../app/lib/mkc/catalogue";
import { deriveSlug } from "../../../app/lib/mkc/deriveSlug";
import { canonicalSlugForName, LEGACY_CART_ID_MAP, migrateCartItems } from "../../../app/lib/commerce/cartIdentity";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (err) {
    const msg = err instanceof assert.AssertionError ? err.message : String(err);
    console.error(`  FAIL  ${name}\n        ${msg}`);
    failed++;
  }
}

// -- Fixtures ------------------------------------------------------------------

const CAPRI_NAME = "Capri In a Bottle Lemon Sugar | 14 Inspired";
const CAPRI_SLUG = "capri-lemon-sugar-inspired";
const CAPRI_DERIVED = deriveSlug(CAPRI_NAME);

const SLUGS = new Set(mkcCatalogue.map((k) => k.slug));
const NAMES = new Set(mkcCatalogue.map((k) => k.name));
const EXCEPTIONS = mkcCatalogue.filter((k) => k.slug !== deriveSlug(k.name));
const NORMAL = mkcCatalogue.find((k) => k.slug === deriveSlug(k.name) && k.slug !== CAPRI_SLUG);
assert.ok(NORMAL, "fixture: at least one record without a slug exception");

// The URL ProductCard builds for a title and optional supplied slug.
const hrefFor = (title: string, slug?: string): string | undefined => {
  const s = canonicalSlugForName(title, slug);
  return s ? `/product/${s}` : undefined;
};

// -- F: functional resolution --------------------------------------------------

console.log("\nF - canonical product identity");

test("F1 Capri's exact title resolves to the protected slug", () => {
  assert.equal(canonicalSlugForName(CAPRI_NAME), CAPRI_SLUG);
  assert.equal(hrefFor(CAPRI_NAME), `/product/${CAPRI_SLUG}`);
});

test("F2 the historical title-derived Capri slug is not a catalogue slug", () => {
  assert.notEqual(CAPRI_DERIVED, CAPRI_SLUG);
  assert.ok(!SLUGS.has(CAPRI_DERIVED), CAPRI_DERIVED);
});

test("F3 every catalogue record resolves to its authoritative slug", () => {
  for (const k of mkcCatalogue) assert.equal(canonicalSlugForName(k.name), k.slug, k.name);
});

test("F4 every record without a slug exception keeps its previous URL", () => {
  for (const k of mkcCatalogue) {
    if (k.slug !== deriveSlug(k.name)) continue;
    assert.equal(hrefFor(k.name), `/product/${deriveSlug(k.name)}`, k.name);
  }
});

test("F5 the governed slug-exception set is exactly { Capri }", () => {
  assert.deepEqual(EXCEPTIONS.map((k) => [k.name, k.slug]), [[CAPRI_NAME, CAPRI_SLUG]]);
});

test("F6 a valid supplied slug is accepted", () => {
  assert.equal(canonicalSlugForName(CAPRI_NAME, CAPRI_SLUG), CAPRI_SLUG);
  assert.equal(canonicalSlugForName(NORMAL!.name, NORMAL!.slug), NORMAL!.slug);
});

test("F7 an incorrect supplied slug is rejected", () => {
  assert.equal(canonicalSlugForName(CAPRI_NAME, CAPRI_DERIVED), undefined);
  assert.equal(canonicalSlugForName(CAPRI_NAME, NORMAL!.slug), undefined);
  assert.equal(canonicalSlugForName(NORMAL!.name, CAPRI_SLUG), undefined);
  assert.equal(canonicalSlugForName(NORMAL!.name, ""), undefined);
  assert.equal(hrefFor(CAPRI_NAME, CAPRI_DERIVED), undefined);
});

test("F8 an unknown product title is rejected", () => {
  for (const t of ["", "Unknown Fragrance Inspired", CAPRI_DERIVED, CAPRI_SLUG]) {
    assert.equal(canonicalSlugForName(t), undefined, JSON.stringify(t));
    assert.equal(hrefFor(t), undefined, JSON.stringify(t));
  }
});

test("F9 altered casing or whitespace never identifies a different product", () => {
  for (const name of [CAPRI_NAME, NORMAL!.name]) {
    const variants = [
      name.toUpperCase(), name.toLowerCase(), ` ${name}`, `${name} `, name.replace(/ /g, "  "),
    ].filter((v) => v !== name);
    for (const v of variants) {
      const resolved = canonicalSlugForName(v);
      // Exact-name semantics: a variant resolves only if it is itself a catalogue name.
      if (NAMES.has(v)) assert.equal(resolved, mkcCatalogue.find((k) => k.name === v)!.slug);
      else assert.equal(resolved, undefined, JSON.stringify(v));
    }
  }
});

test("F10 catalogue names are unambiguous, so no record fails closed", () => {
  assert.equal(NAMES.size, mkcCatalogue.length);
  assert.equal(SLUGS.size, mkcCatalogue.length);
});

// -- X: unrelated identities unchanged -----------------------------------------

console.log("\nX - unrelated identities");

test("X1 legacy cart-ID repair still maps only the Capri derived ID", () => {
  assert.deepEqual([...LEGACY_CART_ID_MAP.entries()], [[CAPRI_DERIVED, CAPRI_SLUG]]);
});

test("X2 canonical cart lines are left unchanged by migration", () => {
  const lines = [
    { id: CAPRI_SLUG, title: CAPRI_NAME, price: 60, image: "", quantity: 1, size: "5ml" },
    { id: NORMAL!.slug, title: NORMAL!.name, price: 60, image: "", quantity: 2, size: "10ml" },
  ];
  assert.deepEqual(migrateCartItems(lines), lines);
});

// -- S: supplementary static source checks -------------------------------------

console.log("\nS - ProductCard wiring [STATIC]");

const read = (rel: string) => fs.readFileSync(path.resolve(rel), "utf-8").replace(/\r\n/g, "\n");
const CARD = read("app/components/ProductCard.tsx");
const count = (haystack: string, needle: string) => haystack.split(needle).length - 1;

test("S1 [STATIC] ProductCard no longer derives a slug or URL from the title", () => {
  assert.ok(!CARD.includes(".replace(/\\s+/g"), "title-derived slug formula present");
  assert.ok(!CARD.includes("toLowerCase()"), "title lower-casing present");
  assert.ok(!CARD.includes("deriveSlug"), "deriveSlug used");
  assert.ok(!CARD.includes("slug ?? "), "unvalidated supplied-slug fallback present");
});

test("S2 [STATIC] the slug is resolved by canonicalSlugForName(title, slug)", () => {
  assert.ok(CARD.includes('import { canonicalSlugForName } from "../lib/commerce/cartIdentity";'));
  assert.match(CARD, /const productSlug = useMemo\(\(\) => canonicalSlugForName\(title, slug\), \[title, slug\]\);/);
});

test("S3 [STATIC] one canonical URL, used by both navigation links", () => {
  assert.ok(CARD.includes("const productHref = productSlug ? `/product/${productSlug}` : undefined;"));
  assert.equal(count(CARD, "/product/"), 1, "only the productHref definition may build a product URL");
  assert.equal(count(CARD, "<Link"), 2);
  assert.equal(count(CARD, "href={productHref}"), 2);
  assert.equal(count(CARD, "href="), 2, "no other href in the card");
});

test("S4 [STATIC] an unresolved identity renders no product link", () => {
  assert.equal(count(CARD, "{productHref ? ("), 2, "both links gated on productHref");
  assert.ok(CARD.includes("<div className={IMAGE_FRAME_CLASS}>{cardImage}</div>"), "unlinked image frame");
  assert.match(CARD, /\) : \(\n\s+cardHeading\n\s+\)\}/, "unlinked heading");
  assert.ok(!CARD.includes("/product/undefined"));
});

test("S5 [STATIC] unlinked content does not advertise navigation", () => {
  const frame = CARD.match(/const IMAGE_FRAME_CLASS =\n\s+"([^"]+)";/);
  assert.ok(frame, "IMAGE_FRAME_CLASS literal");
  assert.ok(!frame![1].includes("cursor-pointer"), "base frame must not show a pointer");
  assert.ok(CARD.includes("className={`${IMAGE_FRAME_CLASS} cursor-pointer`}"), "linked frame keeps the pointer");
  assert.ok(CARD.includes('${productHref ? " hover:text-[#d89ca4]" : ""}'), "heading hover only when linked");
});

test("S6 [STATIC] product-click analytics use the resolved slug", () => {
  assert.ok(CARD.includes("trackProductClick({ title, slug: productSlug, source, rank });"));
});

test("S7 [STATIC] favourite analytics use the resolved slug", () => {
  assert.ok(CARD.includes("trackFavouriteToggled({ title, slug: productSlug, source, action });"));
});

test("S8 [STATIC] Quick Add, favourites, Learn More and Recently Viewed remain wired", () => {
  for (const s of [
    "onClick={handleCardClick}", "onClick={handleFavorite}", "onClick={handleLearnMoreClick}",
    "onClick={handleProductNavigation}", 'localStorage.setItem("recentlyViewed"',
    "removeFromFavorites(title);", "toggleSavedProduct(title);", "isFavorite(title)",
  ]) assert.ok(CARD.includes(s), s);
  assert.equal(count(CARD, "onClick={handleProductNavigation}"), 2);
});

test("S9 [STATIC] ProductCard public props are unchanged", () => {
  const props = CARD.match(/type ProductCardProps = \{\n([\s\S]*?)\n\};/);
  assert.ok(props, "ProductCardProps block");
  const keys = props![1].split("\n").map((l) => l.trim().split(/\??:/)[0]);
  assert.deepEqual(keys, [
    "title", "subtitle", "mood", "profile", "season", "notes", "prices", "images", "bestSeller",
    "newArrival", "scentCharacter", "onQuickAdd", "onLearnMore", "priority", "source", "rank",
    "recReason", "slug",
  ]);
});

test("S10 [STATIC] callers need no change: slugs reach the card only from catalogue records", () => {
  const grid = read("app/components/DiscoverCollectionGrid.tsx");
  assert.ok(grid.includes("slug={fragrance.slug}"));
  const discovery = read("app/components/discover/DiscoveryIntelligenceSection.tsx");
  assert.ok(discovery.includes("const knowledge = catalogueMaps.bySlug.get(rec.slug);"));
  assert.match(discovery, /\.\.\.toDisplayFragrance\(knowledge\),\n\s+slug:\s+rec\.slug,/);
  const display = read("app/lib/mkc/displayAdapter.ts");
  assert.ok(display.includes("title:      knowledge.name,"), "titles are exact catalogue names");
});

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
process.exit(failed ? 1 : 0);

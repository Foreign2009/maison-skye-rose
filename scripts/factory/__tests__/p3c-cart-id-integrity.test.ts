/**
 * L-RESUME-P3C - Cart-ID integrity
 *
 * Cart item IDs must be authoritative MKC catalogue slugs. The governed Capri
 * exception ("... | 14 Inspired" -> capri-lemon-sugar-inspired) shows why a
 * slug must not be re-derived from a display name.
 *
 * Covers: exact slug resolution, Capri, every catalogue record, supplied-slug
 * verification, legacy-cart migration (rewrite, merge, metadata, idempotency,
 * unknown IDs) and server acceptance/rejection. Section W is a supplementary
 * STATIC source check of MiniCart, QuickAddModal and CartContext wiring; it is
 * not a runtime component test. Browser acceptance is a separate, later step.
 *
 * Deterministic data; no network, no database, no storage access.
 *
 * Run: npx tsx scripts/factory/__tests__/p3c-cart-id-integrity.test.ts
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { mkcCatalogue } from "../../../app/lib/mkc/catalogue";
import { deriveSlug } from "../../../app/lib/mkc/deriveSlug";
import { canonicalSlugForName, LEGACY_CART_ID_MAP, migrateCartItems } from "../../../app/lib/commerce/cartIdentity";
import { validateOrderBody } from "../../../app/lib/commerce/orderValidation";

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

const CAPRI_SLUG = "capri-lemon-sugar-inspired";
const CAPRI = mkcCatalogue.find((k) => k.slug === CAPRI_SLUG);
if (!CAPRI) throw new Error("fixture: Capri record missing from catalogue");
const CAPRI_LEGACY_ID = deriveSlug(CAPRI.name);

const NORMAL = mkcCatalogue.find((k) => k.slug === "aventus-inspired");
if (!NORMAL) throw new Error("fixture: aventus-inspired missing from catalogue");

type Line = { id: string; title: string; price: number; image: string; quantity: number; size: string };
const line = (id: string, size: string, quantity: number, extra: Partial<Line> = {}): Line =>
  ({ id, title: "t", price: 60, image: "/i.png", quantity, size, ...extra });

function orderBody(id: string, title: string) {
  return {
    customer_name: "Test Customer", phone: "0821234567", address: "123 Main Street",
    province: "Cape Town Metro",
    items: [{ id, title, price: 60, quantity: 1, size: "5ml" }],
    subtotal: 60, delivery: 100, total: 160,
  };
}

// -- U: exact slug resolution ---------------------------------------------------

test("U1 Capri: exact catalogue name resolves to the governed slug", () => {
  assert.equal(canonicalSlugForName(CAPRI.name), CAPRI_SLUG);
  assert.notEqual(CAPRI_LEGACY_ID, CAPRI_SLUG);
});

test("U2 every catalogue record: exact name resolves to its own slug; names unique", () => {
  const names = new Set<string>();
  for (const k of mkcCatalogue) {
    assert.equal(canonicalSlugForName(k.name), k.slug, k.slug);
    assert.ok(!names.has(k.name), `duplicate name for ${k.slug}`);
    names.add(k.name);
  }
});

test("U3 unknown, case-changed and padded names fail closed", () => {
  assert.equal(canonicalSlugForName("No Such Fragrance Inspired"), undefined);
  assert.equal(canonicalSlugForName(CAPRI.name.toLowerCase()), undefined);
  assert.equal(canonicalSlugForName(CAPRI.name + " "), undefined);
});

test("U4 supplied slug must match the named record", () => {
  assert.equal(canonicalSlugForName(CAPRI.name, CAPRI_SLUG), CAPRI_SLUG);
  assert.equal(canonicalSlugForName(CAPRI.name, CAPRI_LEGACY_ID), undefined);
  assert.equal(canonicalSlugForName(CAPRI.name, NORMAL.slug), undefined);
  assert.equal(canonicalSlugForName(NORMAL.name, NORMAL.slug), NORMAL.slug);
});

test("U5 legacy map: exactly the catalogue's derived-slug mismatches; no key is a real slug", () => {
  const slugs = new Set(mkcCatalogue.map((k) => k.slug));
  const mismatches = mkcCatalogue.filter((k) => deriveSlug(k.name) !== k.slug);
  assert.equal(LEGACY_CART_ID_MAP.size, mismatches.length);
  assert.equal(LEGACY_CART_ID_MAP.get(CAPRI_LEGACY_ID), CAPRI_SLUG);
  for (const key of LEGACY_CART_ID_MAP.keys()) assert.ok(!slugs.has(key), key);
});

// -- M: legacy-cart migration ---------------------------------------------------

test("M1 legacy Capri line is repaired; size, quantity and metadata preserved", () => {
  const out = migrateCartItems([line(CAPRI_LEGACY_ID, "10ml", 2, { title: CAPRI.name, price: 100, image: "/c.png" })]);
  assert.deepEqual(out, [line(CAPRI_SLUG, "10ml", 2, { title: CAPRI.name, price: 100, image: "/c.png" })]);
});

test("M2 legacy and canonical lines of the same size merge into the first line", () => {
  const out = migrateCartItems([
    line(CAPRI_SLUG, "5ml", 1, { image: "/first.png" }),
    line(NORMAL.slug, "5ml", 1),
    line(CAPRI_LEGACY_ID, "5ml", 3, { image: "/second.png" }),
  ]);
  assert.deepEqual(out, [line(CAPRI_SLUG, "5ml", 4, { image: "/first.png" }), line(NORMAL.slug, "5ml", 1)]);
});

test("M3 different sizes do not merge", () => {
  const out = migrateCartItems([line(CAPRI_SLUG, "5ml", 1), line(CAPRI_LEGACY_ID, "30ml", 1)]);
  assert.deepEqual(out, [line(CAPRI_SLUG, "5ml", 1), line(CAPRI_SLUG, "30ml", 1)]);
});

test("M4 idempotent: a second run changes nothing", () => {
  const once = migrateCartItems([line(CAPRI_LEGACY_ID, "5ml", 1), line(CAPRI_SLUG, "5ml", 2), line(NORMAL.slug, "10ml", 1)]);
  assert.deepEqual(migrateCartItems(once), once);
});

test("M5 unknown IDs, forged IDs and valid slugs are never rewritten", () => {
  const input = [line("no-such-product-inspired", "5ml", 1), line("capri-lemon-sugar", "5ml", 1), line(NORMAL.slug, "5ml", 1)];
  assert.deepEqual(migrateCartItems(input), input);
});

test("M6 duplicate lines involving no repaired line are left as they are", () => {
  const input = [line(NORMAL.slug, "5ml", 1), line(NORMAL.slug, "5ml", 2)];
  assert.deepEqual(migrateCartItems(input), input);
});

test("M7 empty cart and malformed lines pass through", () => {
  assert.deepEqual(migrateCartItems([]), []);
  const odd = [{ id: 7, size: "5ml", quantity: 1 }] as unknown as Line[];
  assert.deepEqual(migrateCartItems(odd), odd);
});

// -- S: server acceptance / rejection ------------------------------------------

test("S1 server accepts the canonical Capri slug", () => {
  assert.equal(validateOrderBody(orderBody(CAPRI_SLUG, CAPRI.name)).ok, true);
});

test("S2 server rejects the legacy Capri ID (validation stays strict)", () => {
  const v = validateOrderBody(orderBody(CAPRI_LEGACY_ID, CAPRI.name));
  assert.equal(v.ok, false);
  if (!v.ok) assert.match(v.error, /^Product not found/);
});

test("S3 server rejects a forged slug", () => {
  const v = validateOrderBody(orderBody("forged-slug-inspired", "Forged"));
  assert.equal(v.ok, false);
  if (!v.ok) assert.match(v.error, /^Product not found/);
});

// -- W: SUPPLEMENTARY static wiring checks (not runtime component tests) -------

const DERIVED_ID = '.toLowerCase().replace(/\\s+/g, "-")';
const read = (rel: string) => fs.readFileSync(path.resolve(rel), "utf-8");

test("W1 [STATIC] MiniCart: no title-derived IDs; uses canonicalSlugForName", () => {
  const src = read("app/components/MiniCart.tsx");
  assert.ok(!src.includes(DERIVED_ID), "title-derived ID pattern still present");
  assert.ok(src.includes('from "../lib/commerce/cartIdentity"'), "helper not imported");
  assert.ok(/id:\s+cartId,/.test(src), "addToCart does not use cartId");
});

test("W2 [STATIC] QuickAddModal: no title-derived IDs; verifies supplied slug", () => {
  const src = read("app/components/QuickAddModal.tsx");
  assert.ok(!src.includes(DERIVED_ID), "title-derived ID pattern still present");
  assert.ok(src.includes("canonicalSlugForName(title, slug)"), "supplied slug not verified");
  assert.ok(/id:\s+cartId,/.test(src), "addToCart does not use cartId");
});

test("W3 [STATIC] CartContext: restore passes through migrateCartItems", () => {
  const src = read("app/context/CartContext.tsx");
  assert.ok(src.includes("migrateCartItems(parsed as CartProduct[])"), "restore not migrated");
});

// -- N: G1b complete-merge and precedence scenarios ----------------------------

const validQty = (items: Array<{ quantity: unknown }>) =>
  items.reduce((s, l) => s + (typeof l.quantity === "number" && Number.isSafeInteger(l.quantity) && l.quantity >= 1 ? l.quantity : 0), 0);

test("N1 canonical-first then legacy: quantities merge into the canonical line", () => {
  const out = migrateCartItems([line(CAPRI_SLUG, "5ml", 1, { image: "/canon.png" }), line(CAPRI_LEGACY_ID, "5ml", 2, { image: "/legacy.png" })]);
  assert.deepEqual(out, [line(CAPRI_SLUG, "5ml", 3, { image: "/canon.png" })]);
});

test("N2 legacy-first then canonical: one line, first position, canonical metadata wins", () => {
  const out = migrateCartItems([
    line(CAPRI_LEGACY_ID, "5ml", 1, { title: "Old Name", price: 99, image: "/legacy.png" }),
    line(NORMAL.slug, "10ml", 1),
    line(CAPRI_SLUG, "5ml", 2, { title: CAPRI.name, price: 60, image: "/canon.png" }),
  ]);
  assert.deepEqual(out, [line(CAPRI_SLUG, "5ml", 3, { title: CAPRI.name, price: 60, image: "/canon.png" }), line(NORMAL.slug, "10ml", 1)]);
});

test("N3 two canonical lines then one legacy: all three merge; first canonical metadata wins", () => {
  const out = migrateCartItems([
    line(CAPRI_SLUG, "5ml", 1, { image: "/a.png" }),
    line(CAPRI_SLUG, "5ml", 2, { image: "/b.png" }),
    line(CAPRI_LEGACY_ID, "5ml", 3, { image: "/legacy.png" }),
  ]);
  assert.deepEqual(out, [line(CAPRI_SLUG, "5ml", 6, { image: "/a.png" })]);
});

test("N4 legacy then two canonical lines: all three merge at the first position", () => {
  const out = migrateCartItems([
    line(CAPRI_LEGACY_ID, "5ml", 1, { image: "/legacy.png" }),
    line(CAPRI_SLUG, "5ml", 2, { image: "/a.png" }),
    line(CAPRI_SLUG, "5ml", 3, { image: "/b.png" }),
  ]);
  assert.deepEqual(out, [line(CAPRI_SLUG, "5ml", 6, { image: "/a.png" })]);
});

test("N5 several sizes: each size merges separately; never across sizes", () => {
  const out = migrateCartItems([
    line(CAPRI_LEGACY_ID, "5ml", 1, { image: "/l5.png" }),
    line(CAPRI_SLUG, "10ml", 2, { image: "/c10.png" }),
    line(CAPRI_LEGACY_ID, "10ml", 3, { image: "/l10.png" }),
    line(CAPRI_SLUG, "5ml", 4, { image: "/c5.png" }),
    line(CAPRI_SLUG, "30ml", 5, { image: "/c30.png" }),
  ]);
  assert.deepEqual(out, [
    line(CAPRI_SLUG, "5ml", 5, { image: "/c5.png" }),
    line(CAPRI_SLUG, "10ml", 5, { image: "/c10.png" }),
    line(CAPRI_SLUG, "30ml", 5, { image: "/c30.png" }),
  ]);
});

test("N6 unrelated duplicate lines stay unchanged even when a migration happens", () => {
  const out = migrateCartItems([line(NORMAL.slug, "5ml", 1), line(NORMAL.slug, "5ml", 2), line(CAPRI_LEGACY_ID, "5ml", 1)]);
  assert.deepEqual(out, [line(NORMAL.slug, "5ml", 1), line(NORMAL.slug, "5ml", 2), line(CAPRI_SLUG, "5ml", 1)]);
});

test("N7 unknown and forged IDs stay unchanged alongside a migration", () => {
  const out = migrateCartItems([line("no-such-product-inspired", "5ml", 1), line("capri-lemon-sugar", "5ml", 2), line(CAPRI_LEGACY_ID, "5ml", 1)]);
  assert.deepEqual(out, [line("no-such-product-inspired", "5ml", 1), line("capri-lemon-sugar", "5ml", 2), line(CAPRI_SLUG, "5ml", 1)]);
});

test("N8 malformed quantities: kept as stored, never merged; unsafe totals leave the group untouched", () => {
  const bad = [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 0];
  const input = [
    line(CAPRI_LEGACY_ID, "5ml", 1),
    ...bad.map((q) => line(CAPRI_SLUG, "5ml", q)),
    line(CAPRI_LEGACY_ID, "5ml", -3),
    line(CAPRI_SLUG, "5ml", 2),
  ];
  const out = migrateCartItems(input);
  assert.deepEqual(out, [line(CAPRI_SLUG, "5ml", 3), ...bad.map((q) => line(CAPRI_SLUG, "5ml", q)), line(CAPRI_LEGACY_ID, "5ml", -3)]);
  for (const l of out) if (l.quantity === 3) assert.ok(Number.isSafeInteger(l.quantity));

  const unsafe = [line(CAPRI_LEGACY_ID, "5ml", Number.MAX_SAFE_INTEGER), line(CAPRI_SLUG, "5ml", 1)];
  assert.deepEqual(migrateCartItems(unsafe), unsafe);

  const stringQty = [{ ...line(CAPRI_LEGACY_ID, "5ml", 1), quantity: "2" }] as unknown as Line[];
  assert.deepEqual(migrateCartItems(stringQty), stringQty);
});

const SCENARIOS: Line[][] = [
  [line(CAPRI_SLUG, "5ml", 1), line(CAPRI_LEGACY_ID, "5ml", 2)],
  [line(CAPRI_LEGACY_ID, "5ml", 1), line(CAPRI_SLUG, "5ml", 2), line(CAPRI_SLUG, "5ml", 3), line(NORMAL.slug, "5ml", 4)],
  [line(CAPRI_LEGACY_ID, "5ml", 1), line(CAPRI_SLUG, "10ml", 2), line(CAPRI_LEGACY_ID, "10ml", 3), line(CAPRI_SLUG, "5ml", 4)],
  [line(CAPRI_LEGACY_ID, "5ml", 1), line(CAPRI_SLUG, "5ml", -1), line(CAPRI_SLUG, "5ml", 2), line(NORMAL.slug, "5ml", 1), line(NORMAL.slug, "5ml", 1)],
];

test("N9 re-running the migration gives an identical result", () => {
  for (const s of SCENARIOS) {
    const once = migrateCartItems(s);
    assert.deepEqual(migrateCartItems(once), once);
  }
});

test("N10 total valid quantity is preserved", () => {
  for (const s of SCENARIOS) assert.equal(validQty(migrateCartItems(s)), validQty(s));
});
console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
process.exit(failed ? 1 : 0);

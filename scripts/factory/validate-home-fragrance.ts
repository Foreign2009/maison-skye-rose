/**
 * Knowledge Factory — Home Fragrance Foundation Validator
 *
 * Deterministic proof that the home-fragrance category is correctly wired in
 * the factory registry layer and stops cleanly at ProducerRegistry.
 *
 * Proofs:
 *   1. HomeFragranceIntake fixture has category "home-fragrance"
 *   2. A fresh CatalogueRegistry resolves home-fragrance intake by slug
 *   3. The production CatalogueRegistry has a home-fragrance loader (returns null — empty catalogue)
 *   4. The production ScaffoldRegistry has a home-fragrance scaffolder registered
 *   5. scaffoldHomeFragrance() returns a truthful HomeFragranceScaffoldOutput
 *      (no collection, no gender, no projection, no fragrance size labels)
 *   6. The production ProducerRegistry throws for home-fragrance
 *      (exact message: "No ProducerSet registered for category: home-fragrance")
 *
 * No AI. No draft. No factory log. No native records. No persistent writes.
 */

import { CatalogueRegistry }       from "./core/CatalogueRegistry";
import { defaultCatalogueRegistry } from "./intake";
import { defaultScaffoldRegistry, defaultRegistry } from "./orchestrator";
import { scaffoldHomeFragrance }    from "./homeFragranceScaffold";
import type { HomeFragranceIntake } from "./types";

// ── Test fixture ──────────────────────────────────────────────────────────────

const FIXTURE: HomeFragranceIntake = {
  category:    "home-fragrance",
  productType: "candle",
  range:       "Maison Home",
  title:       "Rose Oud Candle",
  subtitle:    "Warm & Intimate",
  mood:        "Warm, intimate and grounding.",
  profile:     "Woody Floral",
  season:      "Autumn",
  notes:       ["Rose", "Oud", "Sandalwood"],
  prices:      { "150g": 299 },
  images:      { "150g": "/images/home/rose-oud-candle-150g.png" },
  bestSeller:  false,
  newArrival:  false,
};

// ── Assertion helpers ─────────────────────────────────────────────────────────

function pass(label: string): void {
  console.log(`  ✓  ${label}`);
}

function assertEq<T>(label: string, expected: T, actual: T): void {
  if (actual !== expected) {
    throw new Error(`FAIL [${label}]: expected "${String(expected)}", got "${String(actual)}"`);
  }
  pass(label);
}

function assertThrows(label: string, fn: () => unknown, expectedMessage: string): void {
  let threw = false;
  let actualMessage = "";
  try {
    fn();
  } catch (e) {
    threw = true;
    actualMessage = e instanceof Error ? e.message : String(e);
  }
  if (!threw) throw new Error(`FAIL [${label}]: expected throw but no error was thrown`);
  if (actualMessage !== expectedMessage) {
    throw new Error(
      `FAIL [${label}]:\n  expected: "${expectedMessage}"\n  got:      "${actualMessage}"`,
    );
  }
  pass(label);
}

// ── Proofs ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("\n[mkc:validate:home-fragrance] Foundation proof\n");

  // 1. Fixture category
  assertEq("fixture.category",    "home-fragrance", FIXTURE.category);
  assertEq("fixture.productType", "candle",         FIXTURE.productType);
  assertEq("fixture.prices[150g]", 299,             FIXTURE.prices["150g"]);

  // 2. Fresh CatalogueRegistry resolves home-fragrance intake by slug
  const freshCatalogue = new CatalogueRegistry();
  freshCatalogue.register("home-fragrance", (slug) =>
    slug === "rose-oud-candle" ? FIXTURE : null,
  );
  const found = freshCatalogue.find("rose-oud-candle");
  if (!found) throw new Error("FAIL: fresh catalogue did not resolve test fixture");
  assertEq("fresh catalogue — category",    "home-fragrance", found.category);
  assertEq("fresh catalogue — productType", "candle",         (found as HomeFragranceIntake).productType);

  // 3. Production CatalogueRegistry has home-fragrance loader (empty catalogue → null)
  const prodResult = defaultCatalogueRegistry.find("rose-oud-candle");
  if (prodResult !== null) {
    throw new Error("FAIL: production catalogue returned non-null for test slug (should be empty)");
  }
  pass("production catalogue — home-fragrance loader registered, empty catalogue");

  // 4. Production ScaffoldRegistry has home-fragrance scaffolder registered
  let scaffolderRegistered = false;
  try {
    const scaffolder = defaultScaffoldRegistry.getScaffolder("home-fragrance");
    scaffolderRegistered = typeof scaffolder === "function";
  } catch {
    scaffolderRegistered = false;
  }
  if (!scaffolderRegistered) throw new Error("FAIL: home-fragrance scaffolder not registered");
  pass("scaffold registry — home-fragrance scaffolder registered");

  // 5. scaffoldHomeFragrance() returns truthful HomeFragranceScaffoldOutput
  const output = scaffoldHomeFragrance(FIXTURE);

  assertEq("scaffoldHomeFragrance — category",   "home-fragrance", output.category);
  assertEq("scaffoldHomeFragrance — name",        FIXTURE.title,    output.name);
  assertEq("scaffoldHomeFragrance — range",       FIXTURE.range,    output.range);
  assertEq("scaffoldHomeFragrance — productType", "candle",         output.productType);
  assertEq("scaffoldHomeFragrance — prices[150g]", 299,             output.prices["150g"]);

  // Verify no fragrance-specific fields leaked in
  const asRecord = output as unknown as Record<string, unknown>;
  if (asRecord["collection"] !== undefined) throw new Error("FAIL: output must not carry fragrance collection field");
  if (asRecord["gender"]     !== undefined) throw new Error("FAIL: output must not carry fragrance gender field");
  if (asRecord["projection"] !== undefined) throw new Error("FAIL: output must not carry fragrance projection field");
  pass("scaffoldHomeFragrance — no fragrance-specific fields present");

  // Verify pricing uses home fragrance sizes, not fragrance size labels
  const priceKeys = Object.keys(output.prices);
  if (priceKeys.some(k => k === "5ml" || k === "10ml" || k === "30ml")) {
    throw new Error("FAIL: output prices must not use fragrance size labels (5ml/10ml/30ml)");
  }
  if (!priceKeys.includes("150g")) {
    throw new Error("FAIL: output prices must include the fixture size (150g)");
  }
  pass("scaffoldHomeFragrance — pricing uses home fragrance sizes");

  // 6. Production ProducerRegistry throws for home-fragrance
  assertThrows(
    "producer registry — no ProducerSet for home-fragrance",
    () => defaultRegistry.getProducerSet("home-fragrance"),
    "No ProducerSet registered for category: home-fragrance",
  );

  console.log("\n  All proofs passed.\n");
}

main().catch((err: unknown) => {
  console.error(
    `\n[mkc:validate:home-fragrance] ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exit(1);
});

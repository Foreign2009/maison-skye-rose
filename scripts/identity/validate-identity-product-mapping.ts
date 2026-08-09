/**
 * Identity ↔ Product Bridge — Deterministic Validation Suite
 * EP5-P4B
 *
 * Validates the governed cross-domain bridge between the Maison Identity
 * Platform and the Maison Product / Knowledge Catalogue.
 *
 * 29 proofs across 5 sections.
 * Zero AI/API calls. Zero registry writes. Zero factory operations.
 */

import { createHash }        from "crypto";
import { readFileSync, readdirSync } from "fs";
import { join }              from "path";
import type { IdentityId }   from "../../app/lib/identity/types";
import { isValidIdentityId } from "../../app/lib/identity/types";
import { loadIdentityRegistry } from "../../app/lib/identity/persistence";
import {
  loadIdentityProductRegistry,
  getMappingsForIdentity,
  getIdentityForMaisonSlug,
} from "../../app/lib/identity/productMapping";
import { resolveIdentityProduct } from "../factory/identity/IdentityProductResolver";
import { fragrances }        from "../../app/data/fragrances";
import { deriveSlug }        from "../factory/core/deriveSlug";
import {
  resolveIdentityEligibility,
  checkIdentityEligibility,
} from "../factory/identity/FactoryIdentityGate";

// ── Baseline constants ─────────────────────────────────────────────────────────

const REGISTRY_SHA256_BASELINE =
  "c75f74b56d4c2064b4f00e422c26e454343defc6a8c61df288e4fe8c2c650a1d";

const EXPECTED_MAPPING_COUNT = 1;
const EXPECTED_PRODUCT_COUNT = 93;

const ROOT          = process.cwd();
const NATIVE_DIR    = join(ROOT, "app", "lib", "mkc", "native");
const DATA_DIR      = join(ROOT, "app", "data");
const MIP_REG_PATH  = join(ROOT, "app", "lib", "identity", "data", "identity-registry.json");

// ── Proof harness ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function proof(label: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓  ${label}`);
    passed++;
  } catch (err) {
    console.error(`  ✗  ${label}`);
    console.error(`     ${(err as Error).message}`);
    failed++;
  }
}

// ── Shared fixtures ────────────────────────────────────────────────────────────

type CatalogueProduct = { readonly title: string; readonly collection: string };
const allProducts    = fragrances as unknown as CatalogueProduct[];
const maisonSlugs    = new Set(allProducts.map(f => deriveSlug(f.title)));
const mipData        = loadIdentityRegistry();
const mipById        = new Map(mipData.identities.map(i => [i.id, i]));
const bridgeRegistry = loadIdentityProductRegistry();

// ── Section 100 — Registry structure ──────────────────────────────────────────

console.log("\n§ 100 — Bridge Registry Structure");

proof("101: Bridge registry file parses as valid JSON", () => {
  const raw = readFileSync(
    join(ROOT, "app", "lib", "identity", "data", "identity-product-registry.json"),
    "utf-8",
  );
  JSON.parse(raw);
});

proof("102: Registry has a version field of type string", () => {
  assert(
    typeof bridgeRegistry.version === "string" && bridgeRegistry.version.length > 0,
    "version must be a non-empty string",
  );
});

proof("103: Registry has a mappings field that is an array", () => {
  assert(Array.isArray(bridgeRegistry.mappings), "mappings must be an array");
});

proof("104: Registry version is \"1.0.0\"", () => {
  assert(
    bridgeRegistry.version === "1.0.0",
    `Expected version "1.0.0", got "${bridgeRegistry.version}"`,
  );
});

proof("105: loadIdentityProductRegistry() returns a typed object without throwing", () => {
  const r = loadIdentityProductRegistry();
  assert(
    typeof r.version === "string" && Array.isArray(r.mappings),
    "loadIdentityProductRegistry must return { version: string, mappings: array }",
  );
});

// ── Section 200 — Per-mapping field invariants ─────────────────────────────────

console.log("\n§ 200 — Per-Mapping Field Invariants");

proof("201: Every mapping.identityId passes isValidIdentityId()", () => {
  for (const m of bridgeRegistry.mappings) {
    assert(
      isValidIdentityId(m.identityId),
      `"${m.identityId}" is not a valid MIP identity ID (expected MIP-NNNNNN)`,
    );
  }
});

proof("202: Every mapping.identityId exists in the MIP identity registry", () => {
  for (const m of bridgeRegistry.mappings) {
    assert(
      mipById.has(m.identityId),
      `"${m.identityId}" not found in identity-registry.json`,
    );
  }
});

proof("203: Every mapped identity has status \"verified\"", () => {
  for (const m of bridgeRegistry.mappings) {
    const record = mipById.get(m.identityId);
    assert(
      record?.status === "verified",
      `Identity "${m.identityId}" has status "${record?.status}" — expected "verified"`,
    );
  }
});

proof("204: Every mapping.maisonSlug resolves to a known Maison product", () => {
  for (const m of bridgeRegistry.mappings) {
    assert(
      maisonSlugs.has(m.maisonSlug),
      `Slug "${m.maisonSlug}" not found in Maison catalogue (${EXPECTED_PRODUCT_COUNT} products scanned)`,
    );
  }
});

proof("205: Every mapping.collection matches the resolved product's actual collection", () => {
  for (const m of bridgeRegistry.mappings) {
    const product = allProducts.find(f => deriveSlug(f.title) === m.maisonSlug);
    if (!product) throw new Error(`Product for slug "${m.maisonSlug}" not found`);
    assert(
      product.collection === m.collection,
      `Collection mismatch for "${m.maisonSlug}": bridge says "${m.collection}", product says "${product.collection}"`,
    );
  }
});

proof("206: Every mapping.associatedAt is a valid ISO 8601 date string", () => {
  for (const m of bridgeRegistry.mappings) {
    const d = new Date(m.associatedAt);
    assert(!isNaN(d.getTime()), `associatedAt "${m.associatedAt}" is not a valid date`);
    assert(
      d.toISOString() === m.associatedAt,
      `associatedAt "${m.associatedAt}" is not a canonical ISO 8601 string (expected "${d.toISOString()}")`,
    );
  }
});

proof("207: Every mapping.associatedBy is a non-empty string", () => {
  for (const m of bridgeRegistry.mappings) {
    assert(
      typeof m.associatedBy === "string" && m.associatedBy.length > 0,
      `associatedBy must be a non-empty string, got "${String(m.associatedBy)}"`,
    );
  }
});

// ── Section 300 — Cardinality invariants ──────────────────────────────────────

console.log("\n§ 300 — Cardinality Invariants");

proof("301: No exact duplicate row (same identityId + maisonSlug combination)", () => {
  const rowKeys = bridgeRegistry.mappings.map(m => `${m.identityId}::${m.maisonSlug}`);
  const uniqueKeys = new Set(rowKeys);
  assert(
    rowKeys.length === uniqueKeys.size,
    `Duplicate identityId+maisonSlug rows found — ${rowKeys.length} rows, ${uniqueKeys.size} unique`,
  );
});

proof("302: No maisonSlug maps to more than one IdentityId", () => {
  const slugToIds = new Map<string, Set<string>>();
  for (const m of bridgeRegistry.mappings) {
    if (!slugToIds.has(m.maisonSlug)) slugToIds.set(m.maisonSlug, new Set());
    slugToIds.get(m.maisonSlug)!.add(m.identityId);
  }
  for (const [slug, ids] of slugToIds) {
    assert(
      ids.size === 1,
      `maisonSlug "${slug}" maps to ${ids.size} identities — invariant violated (max 1 allowed)`,
    );
  }
});

proof("303: One IdentityId mapping to multiple different slugs is structurally valid (in-memory fixture)", () => {
  // Architecture proof: the cardinality model allows 1 identity → N product slugs.
  // No real second mapping is created — this validates the model only.
  const fixtureA = {
    identityId: "MIP-000012" as IdentityId,
    maisonSlug: "alien-goddess-inspired",
    collection: "Rose" as const,
    associatedAt: "2026-08-09T00:00:00.000Z",
    associatedBy: "fixture",
  };
  const fixtureB = {
    identityId: "MIP-000012" as IdentityId,
    maisonSlug: "hypothetical-body-mist-inspired",
    collection: "Rose" as const,
    associatedAt: "2026-08-09T00:00:00.000Z",
    associatedBy: "fixture",
  };
  const fixtureRegistry = { version: "1.0.0", mappings: [fixtureA, fixtureB] };
  const mip000012Rows = fixtureRegistry.mappings.filter(m => m.identityId === "MIP-000012");
  assert(
    mip000012Rows.length === 2,
    `Expected 2 rows for MIP-000012 in fixture, got ${mip000012Rows.length}`,
  );
  // Slug uniqueness still holds — each slug maps to only one identity in the fixture
  const slugToIds = new Map<string, Set<string>>();
  for (const m of fixtureRegistry.mappings) {
    if (!slugToIds.has(m.maisonSlug)) slugToIds.set(m.maisonSlug, new Set());
    slugToIds.get(m.maisonSlug)!.add(m.identityId);
  }
  for (const [slug, ids] of slugToIds) {
    assert(ids.size === 1, `Fixture slug "${slug}" maps to ${ids.size} identities (should be 1)`);
  }
});

proof("304: Total mapping count equals expected count (1)", () => {
  assert(
    bridgeRegistry.mappings.length === EXPECTED_MAPPING_COUNT,
    `Expected ${EXPECTED_MAPPING_COUNT} mapping(s), found ${bridgeRegistry.mappings.length}`,
  );
});

// ── Section 400 — Read API contract ───────────────────────────────────────────

console.log("\n§ 400 — Read API Contract");

proof("401: getMappingsForIdentity(\"MIP-000012\") returns one mapping to alien-goddess-inspired", () => {
  const maps = getMappingsForIdentity("MIP-000012");
  assert(maps.length === 1, `Expected 1 mapping for MIP-000012, got ${maps.length}`);
  assert(
    maps[0].maisonSlug === "alien-goddess-inspired",
    `Expected slug "alien-goddess-inspired", got "${maps[0].maisonSlug}"`,
  );
  assert(maps[0].collection === "Rose", `Expected collection "Rose", got "${maps[0].collection}"`);
});

proof("402: getMappingsForIdentity(\"MIP-000001\") returns an empty array (24 Faubourg — unmapped)", () => {
  const maps = getMappingsForIdentity("MIP-000001");
  assert(
    Array.isArray(maps) && maps.length === 0,
    `Expected empty array for MIP-000001 (24 Faubourg), got ${maps.length} mapping(s)`,
  );
});

proof("403: getMappingsForIdentity with an invalid IdentityId returns an empty array", () => {
  const maps = getMappingsForIdentity("INVALID-ID" as IdentityId);
  assert(
    Array.isArray(maps) && maps.length === 0,
    `Expected empty array for invalid ID, got ${maps.length}`,
  );
});

proof("404: getIdentityForMaisonSlug(\"alien-goddess-inspired\") returns \"MIP-000012\"", () => {
  const id = getIdentityForMaisonSlug("alien-goddess-inspired");
  assert(id === "MIP-000012", `Expected "MIP-000012", got "${id}"`);
});

proof("405: getIdentityForMaisonSlug(\"sauvage-inspired\") returns null (no mapping)", () => {
  const id = getIdentityForMaisonSlug("sauvage-inspired");
  assert(id === null, `Expected null for sauvage-inspired, got "${id}"`);
});

proof("406: resolveIdentityProduct(\"MIP-000012\") returns resolved: true with one mapping", () => {
  const result = resolveIdentityProduct("MIP-000012");
  assert(result.resolved === true, `Expected resolved: true for MIP-000012`);
  if (result.resolved) {
    assert(result.mappings.length === 1, `Expected 1 mapping, got ${result.mappings.length}`);
    assert(
      result.mappings[0].maisonSlug === "alien-goddess-inspired",
      `Expected slug "alien-goddess-inspired", got "${result.mappings[0].maisonSlug}"`,
    );
    assert(
      result.mappings[0].collection === "Rose",
      `Expected collection "Rose", got "${result.mappings[0].collection}"`,
    );
  }
});

proof("407: resolveIdentityProduct(\"MIP-000001\") returns resolved: false, reason: no-mapping", () => {
  const result = resolveIdentityProduct("MIP-000001");
  assert(result.resolved === false, `Expected resolved: false for MIP-000001 (24 Faubourg)`);
  if (!result.resolved) {
    assert(
      result.reason === "no-mapping",
      `Expected reason "no-mapping", got "${result.reason}"`,
    );
  }
});

proof("408: resolveIdentityProduct with invalid ID returns resolved: false, reason: invalid-identity-id", () => {
  const result = resolveIdentityProduct("INVALID-ID" as IdentityId);
  assert(result.resolved === false, `Expected resolved: false for invalid ID`);
  if (!result.resolved) {
    assert(
      result.reason === "invalid-identity-id",
      `Expected reason "invalid-identity-id", got "${result.reason}"`,
    );
  }
});

// ── Section 500 — Immutability guards ─────────────────────────────────────────

console.log("\n§ 500 — Immutability Guards");

proof("501: identity-registry.json SHA-256 matches established baseline", () => {
  const actual = createHash("sha256").update(readFileSync(MIP_REG_PATH)).digest("hex");
  assert(
    actual === REGISTRY_SHA256_BASELINE,
    `SHA-256 mismatch.\n     Expected: ${REGISTRY_SHA256_BASELINE}\n     Got:      ${actual}`,
  );
});

proof("502: Maison catalogue product count remains 93", () => {
  assert(
    allProducts.length === EXPECTED_PRODUCT_COUNT,
    `Expected ${EXPECTED_PRODUCT_COUNT} products, found ${allProducts.length}`,
  );
});

proof("503: FactoryIdentityGate exports are unchanged (resolveIdentityEligibility, checkIdentityEligibility)", () => {
  assert(
    typeof resolveIdentityEligibility === "function",
    "resolveIdentityEligibility must be a function",
  );
  assert(
    typeof checkIdentityEligibility === "function",
    "checkIdentityEligibility must be a function",
  );
});

proof("504: No native MKC record carries an identityId field", () => {
  const nativeFiles = readdirSync(NATIVE_DIR).filter(
    f => f.endsWith(".ts") && f !== "index.ts",
  );
  for (const file of nativeFiles) {
    const content = readFileSync(join(NATIVE_DIR, file), "utf-8");
    assert(
      !content.includes("identityId"),
      `Native record "${file}" contains "identityId" — invariant violated`,
    );
  }
});

proof("505: No product data file (skye.ts, rose.ts, elite.ts) contains identityId", () => {
  for (const dataFile of ["skye.ts", "rose.ts", "elite.ts"]) {
    const content = readFileSync(join(DATA_DIR, dataFile), "utf-8");
    assert(
      !content.includes("identityId"),
      `"${dataFile}" contains "identityId" — invariant violated`,
    );
  }
});

// ── Summary ────────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log("\n──────────────────────────────────────────────────────────────────");
console.log("  Identity ↔ Product Bridge Validation Suite — EP5-P4B");
console.log(`  ${passed}/${total} proofs passed`);
if (failed > 0) {
  console.log(`  ${failed} FAILED`);
  process.exit(1);
}
console.log("  All proofs passed.");

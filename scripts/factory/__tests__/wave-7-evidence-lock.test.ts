/**
 * Wave 7 Evidence-Lock Registration Tests
 *
 * CATALOGUE-WAVE7-P1: validates that all 8 Wave 7 registrations satisfy governance
 * locks, evidence requirements, and factory intake resolution.
 *
 * Run: npx tsx scripts/factory/__tests__/wave-7-evidence-lock.test.ts
 */

import assert from "node:assert/strict";
import { wave7Catalogue }     from "../data/wave-7-catalogue";
import { intake, deriveSlug, toFragranceIntake } from "../intake";
import { adaptFragrance }     from "../../../app/lib/knowledgeAdapter";
import { nativeFragrances }   from "../../../app/lib/mkc/native/index";
import { scaffold }           from "../scaffold";

// ── Test harness ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (err) {
    const msg = err instanceof assert.AssertionError
      ? `${err.message}`
      : String(err);
    console.error(`  ✗  ${name}\n     ${msg}`);
    failed++;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const EXPECTED_SLUGS = [
  "polo-sport-inspired",
  "leather-malaki-inspired",
  "leau-dissey-pour-homme-sport-inspired",
  "ultraviolet-woman-inspired",
  "roses-de-chloe-inspired",
  "212-vip-rose-inspired",
  "cool-water-woman-inspired",
  "la-nuit-tresor-nude-inspired",
] as const;

const HELD_SLUGS = [
  "rose-radiant-gold-inspired",
  "lacoste-l1212-rose-inspired",
  "lacoste-rose-inspired",
] as const;

// ── A: Registration count ─────────────────────────────────────────────────────

console.log("\n── A: Registration count ──────────────────────────────────────");

test("Wave 7 catalogue contains exactly 8 records", () => {
  assert.equal(wave7Catalogue.length, 8);
});

// ── B: Slug resolution via intake ─────────────────────────────────────────────

console.log("\n── B: Intake resolution ───────────────────────────────────────");

for (const slug of EXPECTED_SLUGS) {
  test(`intake resolves ${slug}`, () => {
    const result = intake({ slug, force: true });
    assert.equal(result.status, "found", `Expected status "found" but got "${result.status}"`);
    assert.notEqual(result.intake, null, "Expected intake record to be non-null");
  });
}

test("All 8 Wave 7 slugs derive correctly from titles", () => {
  const derivedSlugs = wave7Catalogue.map(f => deriveSlug(f.title));
  for (const expected of EXPECTED_SLUGS) {
    assert.ok(
      derivedSlugs.includes(expected),
      `Expected slug "${expected}" not found in derived slugs: [${derivedSlugs.join(", ")}]`,
    );
  }
});

// ── C: Held candidates do NOT resolve through wave7Catalogue ─────────────────

console.log("\n── C: Held candidate isolation ────────────────────────────────");

for (const slug of HELD_SLUGS) {
  test(`wave7Catalogue does NOT contain held slug ${slug}`, () => {
    const found = wave7Catalogue.find(f => deriveSlug(f.title) === slug);
    assert.equal(found, undefined, `Held slug "${slug}" unexpectedly found in wave7Catalogue`);
  });
}

// ── D: Polo Sport — LOCK E ────────────────────────────────────────────────────

console.log("\n── D: Polo Sport (LOCK E — Aromatic Aquatic) ─────────────────");

test("Polo Sport: collection = Skye", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "polo-sport-inspired");
  assert.ok(record, "polo-sport-inspired not found");
  assert.equal(record!.collection, "Skye");
});

test("Polo Sport: gender derived = male (Skye collection default)", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "polo-sport-inspired");
  assert.ok(record, "polo-sport-inspired not found");
  const adapted = adaptFragrance(record!);
  assert.equal(adapted.gender, "male");
});

test("Polo Sport: profile = 'Aromatic Aquatic'", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "polo-sport-inspired");
  assert.ok(record, "polo-sport-inspired not found");
  assert.equal(record!.profile, "Aromatic Aquatic");
});

test("Polo Sport: derived family = ['Aromatic', 'Aquatic']", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "polo-sport-inspired");
  assert.ok(record, "polo-sport-inspired not found");
  const adapted = adaptFragrance(record!);
  const family = [...adapted.family].sort();
  assert.deepEqual(family, ["Aquatic", "Aromatic"]);
});

test("Polo Sport: notesEvidenceLocked = true", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "polo-sport-inspired");
  assert.ok(record, "polo-sport-inspired not found");
  assert.equal(record!.notesEvidenceLocked, true);
});

test("Polo Sport: notesStructured has top/heart/base tiers", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "polo-sport-inspired");
  assert.ok(record, "polo-sport-inspired not found");
  assert.ok(record!.notesStructured, "notesStructured is missing");
  assert.ok(record!.notesStructured!.top.length > 0, "top tier is empty");
  assert.ok(record!.notesStructured!.heart.length > 0, "heart tier is empty");
  assert.ok(record!.notesStructured!.base.length > 0, "base tier is empty");
});

test("Polo Sport: Seagrass present in heart tier (aquatic evidence)", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "polo-sport-inspired");
  assert.ok(record, "polo-sport-inspired not found");
  assert.ok(record!.notesStructured!.heart.includes("Seagrass"), "Seagrass missing from heart tier");
});

// ── E: Leather Malaki — LOCK A + P2R ─────────────────────────────────────────

console.log("\n── E: Leather Malaki (LOCK A — Oud prohibition + P2R gender) ─");

test("Leather Malaki: gender explicitly = 'male' in registration", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "leather-malaki-inspired");
  assert.ok(record, "leather-malaki-inspired not found");
  assert.equal(record!.gender, "male", "Explicit gender override must be 'male'");
});

test("Leather Malaki: collection = Skye", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "leather-malaki-inspired");
  assert.ok(record, "leather-malaki-inspired not found");
  assert.equal(record!.collection, "Skye");
});

test("Leather Malaki: gender derived = male", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "leather-malaki-inspired");
  assert.ok(record, "leather-malaki-inspired not found");
  const adapted = adaptFragrance(record!);
  assert.equal(adapted.gender, "male");
});

test("Leather Malaki: notesEvidenceLocked = true (MUST)", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "leather-malaki-inspired");
  assert.ok(record, "leather-malaki-inspired not found");
  assert.equal(record!.notesEvidenceLocked, true);
});

test("Leather Malaki: exact top tier [Bergamot, Black Pepper]", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "leather-malaki-inspired");
  assert.ok(record, "leather-malaki-inspired not found");
  assert.deepEqual(record!.notesStructured!.top, ["Bergamot", "Black Pepper"]);
});

test("Leather Malaki: exact heart tier [Alaskan Cedar, Cypress, Spicy Notes]", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "leather-malaki-inspired");
  assert.ok(record, "leather-malaki-inspired not found");
  assert.deepEqual(record!.notesStructured!.heart, ["Alaskan Cedar", "Cypress", "Spicy Notes"]);
});

test("Leather Malaki: exact base tier [Leather, Labdanum, Mineral Notes, Amber]", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "leather-malaki-inspired");
  assert.ok(record, "leather-malaki-inspired not found");
  assert.deepEqual(record!.notesStructured!.base, ["Leather", "Labdanum", "Mineral Notes", "Amber"]);
});

test("Leather Malaki: LOCK A — no note contains /oud/i in any tier", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "leather-malaki-inspired");
  assert.ok(record, "leather-malaki-inspired not found");
  const allNotes = [
    ...record!.notesStructured!.top,
    ...record!.notesStructured!.heart,
    ...record!.notesStructured!.base,
  ];
  const oudNotes = allNotes.filter(n => /oud/i.test(n));
  assert.deepEqual(oudNotes, [], `Oud notes found in pyramid: [${oudNotes.join(", ")}]`);
});

test("Leather Malaki: LOCK A — flat notes array contains no /oud/i", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "leather-malaki-inspired");
  assert.ok(record, "leather-malaki-inspired not found");
  const oudNotes = record!.notes.filter(n => /oud/i.test(n));
  assert.deepEqual(oudNotes, [], `Oud notes found in flat notes: [${oudNotes.join(", ")}]`);
});

test("Leather Malaki: LOCK A — profile contains no 'oud' token", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "leather-malaki-inspired");
  assert.ok(record, "leather-malaki-inspired not found");
  assert.ok(!/oud/i.test(record!.profile), `Profile contains oud: "${record!.profile}"`);
});

test("Leather Malaki: derived family = ['Leather', 'Woody']", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "leather-malaki-inspired");
  assert.ok(record, "leather-malaki-inspired not found");
  const adapted = adaptFragrance(record!);
  const family = [...adapted.family].sort();
  assert.deepEqual(family, ["Leather", "Woody"]);
});

test("Leather Malaki: derived family does NOT contain Oud", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "leather-malaki-inspired");
  assert.ok(record, "leather-malaki-inspired not found");
  const adapted = adaptFragrance(record!);
  assert.ok(!adapted.family.includes("Oud"), `Family contains Oud: [${adapted.family.join(", ")}]`);
});

test("Leather Malaki: scaffold preserves notesEvidenceLocked", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "leather-malaki-inspired");
  assert.ok(record, "leather-malaki-inspired not found");
  const { record: scaffolded } = scaffold(toFragranceIntake(record!));
  assert.equal(scaffolded.notesEvidenceLocked, true);
});

test("Leather Malaki: scaffold preserves exact structured notes", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "leather-malaki-inspired");
  assert.ok(record, "leather-malaki-inspired not found");
  const { record: scaffolded } = scaffold(toFragranceIntake(record!));
  assert.deepEqual(scaffolded.notes.top, ["Bergamot", "Black Pepper"]);
  assert.deepEqual(scaffolded.notes.heart, ["Alaskan Cedar", "Cypress", "Spicy Notes"]);
  assert.deepEqual(scaffolded.notes.base, ["Leather", "Labdanum", "Mineral Notes", "Amber"]);
});

// ── F: La Nuit Trésor Nude — LOCK B ──────────────────────────────────────────

console.log("\n── F: La Nuit Trésor Nude (LOCK B — sparse 1/1/2 pyramid) ────");

test("La Nuit Trésor Nude: notesEvidenceLocked = true (MUST)", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "la-nuit-tresor-nude-inspired");
  assert.ok(record, "la-nuit-tresor-nude-inspired not found");
  assert.equal(record!.notesEvidenceLocked, true);
});

test("La Nuit Trésor Nude: top tier = exactly [Bergamot]", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "la-nuit-tresor-nude-inspired");
  assert.ok(record, "la-nuit-tresor-nude-inspired not found");
  assert.deepEqual(record!.notesStructured!.top, ["Bergamot"]);
});

test("La Nuit Trésor Nude: heart tier = exactly [Rose]", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "la-nuit-tresor-nude-inspired");
  assert.ok(record, "la-nuit-tresor-nude-inspired not found");
  assert.deepEqual(record!.notesStructured!.heart, ["Rose"]);
});

test("La Nuit Trésor Nude: base tier = exactly [Vanilla, Coconut]", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "la-nuit-tresor-nude-inspired");
  assert.ok(record, "la-nuit-tresor-nude-inspired not found");
  assert.deepEqual(record!.notesStructured!.base, ["Vanilla", "Coconut"]);
});

test("La Nuit Trésor Nude: pyramid is exactly 1/1/2 (no enrichment)", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "la-nuit-tresor-nude-inspired");
  assert.ok(record, "la-nuit-tresor-nude-inspired not found");
  assert.equal(record!.notesStructured!.top.length, 1, "Top tier must have exactly 1 note");
  assert.equal(record!.notesStructured!.heart.length, 1, "Heart tier must have exactly 1 note");
  assert.equal(record!.notesStructured!.base.length, 2, "Base tier must have exactly 2 notes");
});

test("La Nuit Trésor Nude: scaffold preserves 1/1/2 sparse pyramid", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "la-nuit-tresor-nude-inspired");
  assert.ok(record, "la-nuit-tresor-nude-inspired not found");
  const { record: scaffolded } = scaffold(toFragranceIntake(record!));
  assert.equal(scaffolded.notes.top.length, 1, "Scaffold must preserve 1 top note");
  assert.equal(scaffolded.notes.heart.length, 1, "Scaffold must preserve 1 heart note");
  assert.equal(scaffolded.notes.base.length, 2, "Scaffold must preserve 2 base notes");
  assert.equal(scaffolded.notesEvidenceLocked, true, "Scaffold must carry notesEvidenceLocked");
});

// ── G: Ultraviolet Woman — LOCK D ────────────────────────────────────────────

console.log("\n── G: Ultraviolet Woman (LOCK D — Rabanne brand) ─────────────");

test("Ultraviolet Woman: subtitle = 'Inspired by Rabanne Ultraviolet Woman'", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "ultraviolet-woman-inspired");
  assert.ok(record, "ultraviolet-woman-inspired not found");
  assert.equal(record!.subtitle, "Inspired by Rabanne Ultraviolet Woman");
});

test("Ultraviolet Woman: subtitle does NOT contain 'Paco Rabanne'", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "ultraviolet-woman-inspired");
  assert.ok(record, "ultraviolet-woman-inspired not found");
  assert.ok(
    !record!.subtitle.includes("Paco Rabanne"),
    `Subtitle contains 'Paco Rabanne': "${record!.subtitle}"`,
  );
});

test("Ultraviolet Woman: collection = Rose (female)", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "ultraviolet-woman-inspired");
  assert.ok(record, "ultraviolet-woman-inspired not found");
  assert.equal(record!.collection, "Rose");
});

// ── H: Cool Water Woman — LOCK C ─────────────────────────────────────────────

console.log("\n── H: Cool Water Woman (LOCK C — Travel not assigned) ─────────");

test("Cool Water Woman: season = Summer (SEASON_OCCASIONS excludes Travel)", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "cool-water-woman-inspired");
  assert.ok(record, "cool-water-woman-inspired not found");
  assert.equal(record!.season, "Summer");
});

test("Cool Water Woman: scaffold occasions do NOT include Travel", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "cool-water-woman-inspired");
  assert.ok(record, "cool-water-woman-inspired not found");
  const { record: scaffolded } = scaffold(toFragranceIntake(record!));
  assert.ok(
    !scaffolded.occasions.includes("Travel"),
    `Scaffold occasions include Travel: [${scaffolded.occasions.join(", ")}]`,
  );
});

// ── I: 212 VIP Rosé — Rose family exclusion ───────────────────────────────────

console.log("\n── I: 212 VIP Rosé (Rose family not from name) ───────────────");

test("212 VIP Rosé: profile = 'Floral Fruity Woody' (not Rose-based)", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "212-vip-rose-inspired");
  assert.ok(record, "212-vip-rose-inspired not found");
  assert.equal(record!.profile, "Floral Fruity Woody");
});

test("212 VIP Rosé: derived family does NOT contain 'Rose' as family", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "212-vip-rose-inspired");
  assert.ok(record, "212-vip-rose-inspired not found");
  const adapted = adaptFragrance(record!);
  assert.ok(
    !adapted.family.includes("Rose"),
    `Family contains 'Rose' merely from product name: [${adapted.family.join(", ")}]`,
  );
});

test("212 VIP Rosé: derived family contains Floral, Fruity, Woody", () => {
  const record = wave7Catalogue.find(f => deriveSlug(f.title) === "212-vip-rose-inspired");
  assert.ok(record, "212-vip-rose-inspired not found");
  const adapted = adaptFragrance(record!);
  assert.ok(adapted.family.includes("Floral"), "Family must include Floral");
  assert.ok(adapted.family.includes("Fruity"), "Family must include Fruity");
  assert.ok(adapted.family.includes("Woody"), "Family must include Woody");
});

// ── J: No duplicate Wave 7 slugs ──────────────────────────────────────────────

console.log("\n── J: No duplicate slugs ──────────────────────────────────────");

test("No duplicate slugs within wave7Catalogue", () => {
  const slugs = wave7Catalogue.map(f => deriveSlug(f.title));
  const unique = new Set(slugs);
  assert.equal(unique.size, slugs.length, `Duplicate slugs detected: [${slugs.join(", ")}]`);
});

// ── K: No Wave 7 slug already native ─────────────────────────────────────────

console.log("\n── K: No Wave 7 slug in native MKC ───────────────────────────");

test("No Wave 7 slug already exists in native MKC registry", () => {
  const conflicts: string[] = [];
  for (const record of wave7Catalogue) {
    const slug = deriveSlug(record.title);
    if (nativeFragrances.has(slug)) {
      conflicts.push(slug);
    }
  }
  assert.deepEqual(conflicts, [], `Wave 7 slugs already native: [${conflicts.join(", ")}]`);
});

// ── L: All records pass intake/scaffold without generation ────────────────────

console.log("\n── L: Intake + scaffold compatibility ─────────────────────────");

for (const record of wave7Catalogue) {
  const slug = deriveSlug(record.title);
  test(`${slug}: scaffold runs without error`, () => {
    const intake = { ...record, category: "fragrance" as const };
    const { record: scaffolded, degraded } = scaffold(intake);
    assert.ok(scaffolded, "scaffold returned undefined record");
    assert.ok(typeof scaffolded.slug === "string", "scaffold record has no slug");
    assert.equal(scaffolded.slug, slug, `Scaffold slug "${scaffolded.slug}" !== expected "${slug}"`);
    // Evidence-locked records should have notesEvidenceLocked preserved
    if (record.notesEvidenceLocked) {
      assert.equal(scaffolded.notesEvidenceLocked, true, `notesEvidenceLocked not preserved for ${slug}`);
    }
  });
}

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n── Results ────────────────────────────────────────────────────`);
console.log(`  passed: ${passed}`);
console.log(`  failed: ${failed}`);
console.log(`  total:  ${passed + failed}`);

if (failed > 0) {
  process.exit(1);
}

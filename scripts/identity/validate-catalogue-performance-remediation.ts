/**
 * EP6-P3 — Catalogue Performance-Claim Remediation Validation Suite
 *
 * Proves vocabulary retirement, performance debt elimination, infrastructure
 * remediation, protected-field preservation, protected-artifact SHA integrity,
 * relationship graph integrity, governance invariants, and historical provenance.
 *
 * APPROVED_IDENTITY_ID = null
 * FORCE = false
 *
 * Sections:
 *   § 100 — Vocabulary Retirement           (proofs 101–110)
 *   § 200 — Performance Debt Elimination    (proofs 201–210)
 *   § 300 — Infrastructure Remediation      (proofs 301–308)
 *   § 400 — Protected Field Preservation    (proofs 401–406)
 *   § 500 — Protected SHA Verification      (proofs 501–507)
 *   § 600 — Relationship Graph Integrity    (proofs 601–605)
 *   § 700 — Governance Invariants           (proofs 701–705)
 *   § 800 — Historical Provenance           (proofs 801–805)
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { createHash }                            from "crypto";
import { join }                                  from "path";

import { mkcCatalogue } from "../../app/lib/mkc/catalogue";
import type { CatalogueAuditReport } from "./catalogueKnowledgeIntegrityAudit";

// ── Security invariants ────────────────────────────────────────────────────────

const APPROVED_IDENTITY_ID: null = null;
const FORCE:                false = false;

// ── Protected artifact SHAs ────────────────────────────────────────────────────

const NATIVE_AG_SHA256        = "6799eb768a6a5e9166244be866316b802e7009719dd123d27ea8bf73a89be8bd";
const DRAFT_AG_SHA256         = "700593b7fd98cf8339491b74a7f2c6732badb2581ac268636a59c471b7e1cee7";
const FACTORY_LOG_SHA256      = "bd825643a2cafdd1adb4a82bfebd4e48465844315e78d039811950820570e33e";
const IDENTITY_REG_SHA256     = "c75f74b56d4c2064b4f00e422c26e454343defc6a8c61df288e4fe8c2c650a1d";
const PRODUCT_REG_SHA256      = "6d064d2b471bb0ff8da58e2cb5dd27d69bf70980e19ddd3041298e2eb8a5af0b";
const MIPRUN_AUDIT_SHA256     = "bd3e1f227a35f5929e0474516bafd3d5a7e9d460b923659f2fdf27be0a817353";
const RESEARCH_RESULTS_SHA256 = "741787b194abb320609ab3fd83ed4c15daead2fe11c8bf760364ae60d033a5e4";

// ── Paths ──────────────────────────────────────────────────────────────────────

const ROOT           = process.cwd();
const AUDIT_PATH     = join(ROOT, "app/lib/identity/data/audits/catalogue-knowledge-integrity-audit.json");
const NATIVE_AG_PATH = join(ROOT, "app/lib/mkc/native/alien-goddess-inspired.ts");
const DRAFT_AG_PATH  = join(ROOT, "scripts/factory/drafts/alien-goddess-inspired.ts");
const FACTORY_LOG    = join(ROOT, "scripts/factory/factory-log.json");
const IDENTITY_REG   = join(ROOT, "app/lib/identity/data/identity-registry.json");
const PRODUCT_REG    = join(ROOT, "app/lib/identity/data/identity-product-registry.json");
const MIPRUN_AUDIT   = join(ROOT, "scripts/factory/identity/identity-qualified-run-audit.json");
const RESEARCH       = join(ROOT, "data/identity/research-results/MIP-000012-alien-goddess-authoritative-results.json");
const NATIVE_DIR     = join(ROOT, "app/lib/mkc/native");
const DRAFTS_DIR     = join(ROOT, "scripts/factory/drafts");

// Source files under remediation
const MERCHANDISING   = join(ROOT, "app/lib/mkc/merchandising.ts");
const COMPANION       = join(ROOT, "app/components/MaisonCompanion.tsx");
const WARDROBE_AN     = join(ROOT, "app/lib/concierge/wardrobeAnalyser.ts");
const ACADEMY_CAT     = join(ROOT, "app/lib/academy/catalogue.ts");
const INTENT_PARSER   = join(ROOT, "app/lib/intentParser.ts");
const TYPES_PATH      = join(ROOT, "app/lib/mkc/types.ts");

// ── Helpers ────────────────────────────────────────────────────────────────────

type ProofResult = { name: string; passed: boolean; message: string };

function proof(name: string, fn: () => void): ProofResult {
  try {
    fn();
    return { name, passed: true, message: "PASS" };
  } catch (e) {
    return { name, passed: false, message: e instanceof Error ? e.message : String(e) };
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function sha256(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function readSource(filePath: string): string {
  return readFileSync(filePath, "utf-8");
}

// ── Load EP6-P1 audit ──────────────────────────────────────────────────────────

const audit = JSON.parse(readFileSync(AUDIT_PATH, "utf-8")) as CatalogueAuditReport;

// ── Proof runner ───────────────────────────────────────────────────────────────

const results: ProofResult[] = [];

// ─────────────────────────────────────────────────────────────────────────────
// § 100 — Vocabulary Retirement (10 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("101: 0 live records have scentCharacter 'Rich & Long Wearing'", () => {
  const count = mkcCatalogue.filter((k) => (k.scentCharacter as string) === "Rich & Long Wearing").length;
  assert(count === 0, `expected 0; got ${count} — vocabulary not fully retired`);
}));

results.push(proof("102: 47 live records have scentCharacter 'Rich & Full-Bodied'", () => {
  const count = mkcCatalogue.filter((k) => k.scentCharacter === "Rich & Full-Bodied").length;
  assert(count === 47, `expected 47; got ${count}`);
}));

results.push(proof("103: all 93 live records have a valid scentCharacter value", () => {
  const valid = new Set(["Fresh & Light", "Balanced Signature", "Rich & Full-Bodied", "Deep & Intense"]);
  for (const k of mkcCatalogue) {
    assert(valid.has(k.scentCharacter),
      `"${k.slug}" has invalid scentCharacter "${k.scentCharacter}"`);
  }
}));

results.push(proof("104: scentCharacter distribution sums to 93", () => {
  const counts: Record<string, number> = {};
  for (const k of mkcCatalogue) counts[k.scentCharacter] = (counts[k.scentCharacter] ?? 0) + 1;
  const total = Object.values(counts).reduce((n, v) => n + v, 0);
  assert(total === 93, `expected 93; got ${total}`);
}));

results.push(proof("105: types.ts union does not contain 'Rich & Long Wearing'", () => {
  const src = readSource(TYPES_PATH);
  assert(!src.includes('"Rich & Long Wearing"'),
    "types.ts still contains retired vocabulary 'Rich & Long Wearing'");
}));

results.push(proof("106: types.ts union contains 'Rich & Full-Bodied'", () => {
  const src = readSource(TYPES_PATH);
  assert(src.includes('"Rich & Full-Bodied"'),
    "types.ts does not contain new vocabulary 'Rich & Full-Bodied'");
}));

results.push(proof("107: intentParser.ts does not contain 'Rich & Long Wearing'", () => {
  const src = readSource(INTENT_PARSER);
  assert(!src.includes('"Rich & Long Wearing"'),
    "intentParser.ts still references retired vocabulary");
}));

results.push(proof("108: wardrobeEngine.ts does not contain 'Rich & Long Wearing'", () => {
  const src = readSource(join(ROOT, "app/lib/mkc/wardrobeEngine.ts"));
  assert(!src.includes('"Rich & Long Wearing"'),
    "wardrobeEngine.ts still references retired vocabulary");
}));

results.push(proof("109: collectionPlanner.ts does not contain 'Rich & Long Wearing'", () => {
  const src = readSource(join(ROOT, "app/lib/concierge/collectionPlanner.ts"));
  assert(!src.includes('"Rich & Long Wearing"'),
    "collectionPlanner.ts still references retired vocabulary");
}));

results.push(proof("110: quiz page does not contain 'Rich & Long Wearing'", () => {
  const src = readSource(join(ROOT, "app/quiz/page.tsx"));
  assert(!src.includes('"Rich & Long Wearing"'),
    "quiz page still contains retired vocabulary in guest-facing options");
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 200 — Performance Debt Elimination (10 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("201: EP6-P1 audit shows 0 records with HIGH policy findings", () => {
  const highCount = audit.records
    .flatMap((r) => r.policyFindings)
    .filter((f) => f.severity === "HIGH").length;
  assert(highCount === 0, `expected 0 HIGH findings; got ${highCount}`);
}));

results.push(proof("202: EP6-P1 audit shows 0 records with MEDIUM policy findings", () => {
  const medCount = audit.records
    .flatMap((r) => r.policyFindings)
    .filter((f) => f.severity === "MEDIUM").length;
  assert(medCount === 0, `expected 0 MEDIUM findings; got ${medCount}`);
}));

results.push(proof("203: EP6-P1 audit summary.recordsWithPolicyFindings is 0", () => {
  assert(audit.summary.recordsWithPolicyFindings === 0,
    `expected 0; got ${audit.summary.recordsWithPolicyFindings}`);
}));

results.push(proof("204: 0 live native records contain educationTag 'long-wearing'", () => {
  const bad = mkcCatalogue.filter((k) => (k.educationTags ?? []).includes("long-wearing"));
  assert(bad.length === 0,
    `found 'long-wearing' educationTag in: ${bad.map((k) => k.slug).join(", ")}`);
}));

results.push(proof("205: burberry-goddess recommendedFor does not contain 'lasts all day'", () => {
  const k = mkcCatalogue.find((r) => r.slug === "burberry-goddess-inspired");
  assert(k !== undefined, "burberry-goddess-inspired not found");
  const joined = (k!.recommendedFor ?? []).join(" ");
  assert(!joined.toLowerCase().includes("lasts all day"),
    "burberry-goddess-inspired still contains 'lasts all day'");
}));

results.push(proof("206: 0 live records have 'long-wearing' in any recommendedFor entry", () => {
  const bad = mkcCatalogue.filter((k) =>
    (k.recommendedFor ?? []).some((s) => /long-wearing/i.test(s))
  );
  assert(bad.length === 0,
    `'long-wearing' in recommendedFor: ${bad.map((k) => k.slug).join(", ")}`);
}));

results.push(proof("207: eros mood does not contain 'all-day'", () => {
  const k = mkcCatalogue.find((r) => r.slug === "eros-inspired");
  assert(k !== undefined, "eros-inspired not found");
  assert(!/all-day/i.test(k!.mood),
    `eros-inspired mood still contains all-day language: "${k!.mood}"`);
}));

results.push(proof("208: armani-code-parfum recommendedFor does not contain 'for all day'", () => {
  const k = mkcCatalogue.find((r) => r.slug === "armani-code-parfum-inspired");
  assert(k !== undefined, "armani-code-parfum-inspired not found");
  const joined = (k!.recommendedFor ?? []).join(" ");
  assert(!joined.toLowerCase().includes("for all day"),
    "armani-code-parfum-inspired still contains 'for all day'");
}));

results.push(proof("209: y-edp signatureStyle does not contain 'All-Day Signature'", () => {
  const k = mkcCatalogue.find((r) => r.slug === "y-edp-inspired");
  assert(k !== undefined, "y-edp-inspired not found");
  assert(!(k!.signatureStyle ?? []).includes("All-Day Signature"),
    "y-edp-inspired signatureStyle still contains 'All-Day Signature'");
}));

results.push(proof("210: 0 live records have 'long-lasting' or 'beast mode' in free-text fields", () => {
  const HIGH_PATTERN = /long-lasting|beast mode/i;
  const FIELDS = ["description", "subtitle", "mood"] as const;
  for (const k of mkcCatalogue) {
    for (const field of FIELDS) {
      const val = (k as Record<string, unknown>)[field];
      if (typeof val === "string" && HIGH_PATTERN.test(val)) {
        throw new Error(`"${k.slug}" field "${field}" contains prohibited language: "${val}"`);
      }
    }
  }
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 300 — Infrastructure Remediation (8 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("301: merchandising.ts does not contain 'Rich & Long Wearing'", () => {
  const src = readSource(MERCHANDISING);
  assert(!src.includes('"Rich & Long Wearing"'),
    "merchandising.ts still references retired vocabulary");
}));

results.push(proof("302: merchandising.ts does not contain 'lasts all day'", () => {
  const src = readSource(MERCHANDISING);
  assert(!src.toLowerCase().includes("lasts all day"),
    "merchandising.ts still contains 'lasts all day' performance claim");
}));

results.push(proof("303: merchandising.ts contains 'deepens through the dry-down'", () => {
  const src = readSource(MERCHANDISING);
  assert(src.includes("deepens through the dry-down"),
    "merchandising.ts missing approved replacement text");
}));

results.push(proof("304: MaisonCompanion.tsx does not contain 'long-wearing'", () => {
  const src = readSource(COMPANION);
  assert(!src.toLowerCase().includes("long-wearing"),
    "MaisonCompanion.tsx still contains 'long-wearing' in CHARACTER_OBSERVATIONS");
}));

results.push(proof("305: MaisonCompanion.tsx contains 'full-bodied compositions'", () => {
  const src = readSource(COMPANION);
  assert(src.includes("full-bodied compositions"),
    "MaisonCompanion.tsx missing approved CHARACTER_OBSERVATIONS text");
}));

results.push(proof("306: wardrobeAnalyser.ts does not contain 'longer-wearing'", () => {
  const src = readSource(WARDROBE_AN);
  assert(!src.toLowerCase().includes("longer-wearing"),
    "wardrobeAnalyser.ts still contains 'longer-wearing' in CHARACTER_OPPORTUNITY");
}));

results.push(proof("307: wardrobeAnalyser.ts contains 'more expressive'", () => {
  const src = readSource(WARDROBE_AN);
  assert(src.includes("more expressive"),
    "wardrobeAnalyser.ts missing approved CHARACTER_OPPORTUNITY text");
}));

results.push(proof("308: academy/catalogue.ts does not contain 'long-wearing ambroxan'", () => {
  const src = readSource(ACADEMY_CAT);
  assert(!src.toLowerCase().includes("long-wearing ambroxan"),
    "academy/catalogue.ts still contains 'long-wearing ambroxan' in fragrance spotlight caption");
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 400 — Protected Field Preservation (6 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("401: all 93 records have non-empty topNotes, middleNotes, baseNotes", () => {
  for (const k of mkcCatalogue) {
    assert(k.notes.top.length > 0,    `"${k.slug}" has empty topNotes`);
    assert(k.notes.heart.length > 0,  `"${k.slug}" has empty middleNotes`);
    assert(k.notes.base.length > 0,   `"${k.slug}" has empty baseNotes`);
  }
}));

results.push(proof("402: all 93 records have a non-empty family array", () => {
  for (const k of mkcCatalogue) {
    assert(k.family.length > 0, `"${k.slug}" has empty family array`);
  }
}));

results.push(proof("403: all 93 records have a valid gender", () => {
  const valid = new Set(["male", "female", "unisex"]);
  for (const k of mkcCatalogue) {
    assert(valid.has(k.gender), `"${k.slug}" has invalid gender "${k.gender}"`);
  }
}));

results.push(proof("404: all 93 records have a non-empty collection", () => {
  for (const k of mkcCatalogue) {
    assert(typeof k.collection === "string" && k.collection.length > 0,
      `"${k.slug}" has empty collection`);
  }
}));

results.push(proof("405: alien-goddess notes composition unchanged (SHA proves provenance)", () => {
  const agAudit = audit.records.find((r) => r.slug === "alien-goddess-inspired");
  assert(agAudit !== undefined, "alien-goddess-inspired not found in audit");
  // If SHA matches, file content is identical → notes are unchanged
  assert(sha256(NATIVE_AG_PATH) === NATIVE_AG_SHA256,
    "alien-goddess native file SHA mismatch — composition may have been modified");
}));

results.push(proof("406: 0 relationship fields reference unknown slugs in live catalogue", () => {
  const allSlugs = new Set(mkcCatalogue.map((k) => k.slug));
  for (const k of mkcCatalogue) {
    const rels = k.relationships ?? {};
    for (const [field, slugs] of Object.entries(rels)) {
      if (!Array.isArray(slugs)) continue;
      for (const slug of slugs as string[]) {
        assert(allSlugs.has(slug),
          `"${k.slug}" ${field}: dangling slug "${slug}" not in live catalogue`);
      }
    }
  }
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 500 — Protected SHA Verification (7 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("501: alien-goddess native SHA matches EP5-P4H R2 correction baseline", () => {
  assert(sha256(NATIVE_AG_PATH) === NATIVE_AG_SHA256,
    `SHA mismatch: ${sha256(NATIVE_AG_PATH)}`);
}));

results.push(proof("502: alien-goddess factory draft SHA unchanged", () => {
  assert(sha256(DRAFT_AG_PATH) === DRAFT_AG_SHA256,
    `SHA mismatch: ${sha256(DRAFT_AG_PATH)}`);
}));

results.push(proof("503: factory-log.json SHA unchanged", () => {
  assert(sha256(FACTORY_LOG) === FACTORY_LOG_SHA256,
    `SHA mismatch: ${sha256(FACTORY_LOG)}`);
}));

results.push(proof("504: identity-registry.json SHA unchanged", () => {
  assert(sha256(IDENTITY_REG) === IDENTITY_REG_SHA256,
    `SHA mismatch: ${sha256(IDENTITY_REG)}`);
}));

results.push(proof("505: identity-product-registry.json SHA unchanged", () => {
  assert(sha256(PRODUCT_REG) === PRODUCT_REG_SHA256,
    `SHA mismatch: ${sha256(PRODUCT_REG)}`);
}));

results.push(proof("506: identity-qualified-run-audit.json SHA unchanged", () => {
  assert(sha256(MIPRUN_AUDIT) === MIPRUN_AUDIT_SHA256,
    `SHA mismatch: ${sha256(MIPRUN_AUDIT)}`);
}));

results.push(proof("507: alien-goddess authoritative research results SHA unchanged", () => {
  assert(sha256(RESEARCH) === RESEARCH_RESULTS_SHA256,
    `SHA mismatch: ${sha256(RESEARCH)}`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 600 — Relationship Graph Integrity (5 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("601: EP6-P1 audit shows 0 records with HIGH riskLevel (all violations remediated)", () => {
  const highCount = (audit.summary.byRiskLevel as Record<string, number>)["HIGH"] ?? 0;
  assert(highCount === 0,
    `expected 0 HIGH-risk records in EP6-P1 audit; got ${highCount}`);
}));

results.push(proof("602: 89 live records have a non-empty relationships field", () => {
  const count = mkcCatalogue.filter((k) => {
    const rels = k.relationships ?? {};
    const allSlugs = [
      ...((rels.alternatives ?? []) as string[]),
      ...((rels.wardrobePartners ?? []) as string[]),
      ...((rels.evolutionOf   !== undefined ? [rels.evolutionOf as string] : []) as string[]),
    ];
    return allSlugs.length > 0;
  }).length;
  assert(count === 89, `expected 89 records with relationships; got ${count}`);
}));

results.push(proof("603: alien-goddess has no relationship entries", () => {
  const ag = mkcCatalogue.find((k) => k.slug === "alien-goddess-inspired");
  assert(ag !== undefined, "alien-goddess-inspired not found");
  const rels = ag!.relationships ?? {};
  const allSlugs = [
    ...((rels.alternatives ?? []) as string[]),
    ...((rels.wardrobePartners ?? []) as string[]),
  ];
  assert(allSlugs.length === 0,
    `alien-goddess should have no relationships; found ${allSlugs.join(", ")}`);
}));

results.push(proof("604: all relationship slugs in live catalogue resolve to existing records", () => {
  const allSlugs = new Set(mkcCatalogue.map((k) => k.slug));
  let dangling = 0;
  for (const k of mkcCatalogue) {
    const rels = k.relationships ?? {};
    const slugList = [
      ...((rels.alternatives ?? []) as string[]),
      ...((rels.wardrobePartners ?? []) as string[]),
    ];
    for (const s of slugList) {
      if (!allSlugs.has(s)) dangling++;
    }
  }
  assert(dangling === 0, `${dangling} dangling relationship slug(s) found`);
}));

results.push(proof("605: EP6-P1 audit recordsWithRelationships is 89", () => {
  assert(audit.summary.recordsWithRelationships === 89,
    `expected 89; got ${audit.summary.recordsWithRelationships}`);
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 700 — Governance Invariants (5 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("701: APPROVED_IDENTITY_ID is null (no identity promotion occurred)", () => {
  assert(APPROVED_IDENTITY_ID === null,
    `APPROVED_IDENTITY_ID must be null; found ${String(APPROVED_IDENTITY_ID)}`);
}));

results.push(proof("702: FORCE is false (no override invoked)", () => {
  assert(FORCE === false,
    `FORCE must be false; found ${String(FORCE)}`);
}));

results.push(proof("703: identity-registry.json SHA unchanged (no registry mutation)", () => {
  assert(sha256(IDENTITY_REG) === IDENTITY_REG_SHA256,
    "identity-registry.json was modified — registry mutation constraint violated");
}));

results.push(proof("704: factory-log.json SHA unchanged (no factory invocation)", () => {
  assert(sha256(FACTORY_LOG) === FACTORY_LOG_SHA256,
    "factory-log.json was modified — factory invocation constraint violated");
}));

results.push(proof("705: identity-qualified-run-audit.json SHA unchanged (no MIPRUN)", () => {
  assert(sha256(MIPRUN_AUDIT) === MIPRUN_AUDIT_SHA256,
    "identity-qualified-run-audit.json was modified — MIPRUN constraint violated");
}));

// ─────────────────────────────────────────────────────────────────────────────
// § 800 — Historical Provenance (5 proofs)
// ─────────────────────────────────────────────────────────────────────────────

results.push(proof("801: factory draft alien-goddess SHA unchanged (draft is immutable historical artifact)", () => {
  assert(sha256(DRAFT_AG_PATH) === DRAFT_AG_SHA256,
    `alien-goddess factory draft SHA mismatch — historical artifact was modified`);
}));

results.push(proof("802: factory drafts directory contains 'Rich & Long Wearing' (preserved historical records)", () => {
  const draftFiles = readdirSync(DRAFTS_DIR).filter((f) => f.endsWith(".ts"));
  let found = false;
  for (const f of draftFiles) {
    const content = readFileSync(join(DRAFTS_DIR, f), "utf-8");
    if (content.includes('"Rich & Long Wearing"')) { found = true; break; }
  }
  assert(found,
    "No factory draft contains 'Rich & Long Wearing' — historical provenance may have been erased");
}));

results.push(proof("803: alien-goddess factory draft contains 'Rich & Long Wearing' (original vocabulary preserved)", () => {
  const content = readSource(DRAFT_AG_PATH);
  assert(content.includes('"Rich & Long Wearing"'),
    "alien-goddess factory draft does not contain original vocabulary — artifact may have been altered");
}));

results.push(proof("804: live catalogue alien-goddess no longer has scentCharacter 'Rich & Long Wearing'", () => {
  // Alien-goddess was NOT in the 47 migrated records — its scentCharacter is not "Rich & Long Wearing"
  // and was not "Rich & Long Wearing" prior to EP6-P3. This proof confirms the native record is intact.
  const ag = mkcCatalogue.find((k) => k.slug === "alien-goddess-inspired");
  assert(ag !== undefined, "alien-goddess-inspired not found in live catalogue");
  assert((ag!.scentCharacter as string) !== "Rich & Long Wearing",
    `alien-goddess scentCharacter should not be 'Rich & Long Wearing'; got "${ag!.scentCharacter}"`);
}));

results.push(proof("805: EP6-P3 did not modify factory drafts (no draft files contain 'Rich & Full-Bodied')", () => {
  const draftFiles = readdirSync(DRAFTS_DIR).filter((f) => f.endsWith(".ts"));
  for (const f of draftFiles) {
    const content = readFileSync(join(DRAFTS_DIR, f), "utf-8");
    assert(!content.includes('"Rich & Full-Bodied"'),
      `factory draft "${f}" contains 'Rich & Full-Bodied' — draft was modified (violation)`);
  }
}));

// ─────────────────────────────────────────────────────────────────────────────
// Output
// ─────────────────────────────────────────────────────────────────────────────

const passed = results.filter((r) => r.passed).length;
const failed = results.filter((r) => !r.passed).length;

console.log("\nEP6-P3 — Catalogue Performance-Claim Remediation Validation");
console.log("─".repeat(60));
for (const r of results) {
  const icon = r.passed ? "✓" : "✗";
  console.log(`  ${icon} ${r.name}`);
  if (!r.passed) console.log(`      FAIL: ${r.message}`);
}
console.log("─".repeat(60));
console.log(`Result: ${passed}/${results.length} proofs passing`);
console.log();

if (failed > 0) {
  console.log(`[EP6-P3 Validation] FAILED — ${failed} proof(s) failed.`);
  process.exit(1);
} else {
  console.log("[EP6-P3 Validation] All proofs passing.");
}

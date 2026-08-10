/**
 * EP6-P5B — Relationship Editorial Review Foundation Validator
 *
 * Validates the catalogue-relationship-review-queue.json artifact produced by
 * build-relationship-review-queue.ts.
 *
 * Governance constants:
 *   APPROVED_IDENTITY_ID = null   (no founder editorial decisions authorized)
 *   FORCE                = false  (no forced mutations authorized)
 *   EP6-P5C              = NOT AUTHORIZED
 *
 * Protected SHAs (post-P5A):
 *   alien-goddess-inspired.ts        6799eb768a6a5e9166244be866316b802e7009719dd123d27ea8bf73a89be8bd
 *   delina-inspired.ts               bdf4c5f7b01b65c50fabc6659bc4a5778d0e714c0d8d86d2a4d980be0e02a2a0
 *   baccarat-rouge-540-inspired.ts   2c7307ce2c046f1a8aaeb4c0635b19730ae632a025538fa7966ebaa189eb9c8a
 *
 * Post-P5A relationship graph fingerprint (336 edges, 0 structural defects):
 *   478fd478d930137fe21d058470797c324649156d615b60d3b9d3a9108f73b8e2
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { createHash } from "crypto";
import { fileURLToPath } from "url";

// ── Paths ──────────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..", "..");

const QUEUE_PATH    = join(ROOT, "app/lib/identity/data/reviews/catalogue-relationship-review-queue.json");
const AUDIT_PATH    = join(ROOT, "app/lib/identity/data/audits/catalogue-relationship-editorial-audit.json");
const BUILDER_PATH  = join(ROOT, "scripts/identity/build-relationship-review-queue.ts");
const NATIVE_DIR    = join(ROOT, "app/lib/mkc/native");

// ── Governance sentinels ───────────────────────────────────────────────────────

const APPROVED_IDENTITY_ID = null;  // no founder editorial decisions authorized
const FORCE = false;                // no forced mutations authorized

// ── Protected constants ────────────────────────────────────────────────────────

const POST_P5A_FINGERPRINT = "478fd478d930137fe21d058470797c324649156d615b60d3b9d3a9108f73b8e2";

const PROTECTED_SHAS: Record<string, string> = {
  "alien-goddess-inspired.ts":      "6799eb768a6a5e9166244be866316b802e7009719dd123d27ea8bf73a89be8bd",
  "delina-inspired.ts":             "bdf4c5f7b01b65c50fabc6659bc4a5778d0e714c0d8d86d2a4d980be0e02a2a0",
  "baccarat-rouge-540-inspired.ts": "2c7307ce2c046f1a8aaeb4c0635b19730ae632a025538fa7966ebaa189eb9c8a",
};

// ── Proof runner ───────────────────────────────────────────────────────────────

type ProofResult = { label: string; ok: boolean; error?: string };

function proof(label: string, fn: () => void): ProofResult {
  try {
    fn();
    return { label, ok: true };
  } catch (e: unknown) {
    return { label, ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

// ── Fingerprint ────────────────────────────────────────────────────────────────

interface AuditEdge {
  sourceSlug: string;
  relationshipType: string;
  targetSlug: string;
}

function buildRelationshipFingerprint(edges: AuditEdge[]): string {
  const sorted = [...edges]
    .sort((a, b) =>
      a.sourceSlug.localeCompare(b.sourceSlug) ||
      a.relationshipType.localeCompare(b.relationshipType) ||
      a.targetSlug.localeCompare(b.targetSlug),
    )
    .map(e => `${e.sourceSlug}|${e.relationshipType}|${e.targetSlug}`)
    .join("\n");
  return createHash("sha256").update(sorted).digest("hex");
}

function sha256File(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath, "utf-8")).digest("hex");
}

// ── Load artifacts ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queue: any = existsSync(QUEUE_PATH) ? JSON.parse(readFileSync(QUEUE_PATH, "utf-8")) : null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const audit: any = existsSync(AUDIT_PATH) ? JSON.parse(readFileSync(AUDIT_PATH, "utf-8")) : null;

// ── Validation suite ───────────────────────────────────────────────────────────

const results: ProofResult[] = [];

// ─── §100 Artifact Schema ────────────────────────────────────────────────────

results.push(proof("101: queue artifact exists at expected path", () => {
  assert(existsSync(QUEUE_PATH), `queue artifact not found at: ${QUEUE_PATH}`);
}));

results.push(proof("102: schemaVersion === 'EP6-P5B-v1'", () => {
  assert(queue?.schemaVersion === "EP6-P5B-v1",
    `expected schemaVersion "EP6-P5B-v1"; got "${queue?.schemaVersion}"`);
}));

results.push(proof("103: generatedBy contains 'EP6-P5B'", () => {
  assert(queue?.generatedBy?.includes("EP6-P5B") === true,
    `expected generatedBy to contain "EP6-P5B"; got "${queue?.generatedBy}"`);
}));

results.push(proof("104: graphFingerprint matches post-P5A baseline", () => {
  assert(queue?.graphFingerprint === POST_P5A_FINGERPRINT,
    `expected graphFingerprint ${POST_P5A_FINGERPRINT}; got ${queue?.graphFingerprint}`);
}));

results.push(proof("105: units is an array", () => {
  assert(Array.isArray(queue?.units), "queue.units is not an array");
}));

results.push(proof("106: summary object exists", () => {
  assert(typeof queue?.summary === "object" && queue.summary !== null,
    "queue.summary is not an object");
}));

results.push(proof("107: summary.totalUnits equals units.length", () => {
  const len = (queue?.units as unknown[])?.length ?? -1;
  const sumTotal = queue?.summary?.totalUnits ?? -2;
  assert(sumTotal === len,
    `summary.totalUnits ${sumTotal} !== units.length ${len}`);
}));

results.push(proof("108: generatedAt is a valid ISO timestamp", () => {
  const ts = queue?.generatedAt;
  const d = ts ? new Date(ts) : null;
  assert(d !== null && !isNaN(d.getTime()),
    `generatedAt "${ts}" is not a valid ISO timestamp`);
}));

results.push(proof("109: all units have required top-level keys", () => {
  const REQUIRED = [
    "reviewId", "pairType", "slugA", "slugB",
    "proposalProvenance", "governanceState", "status",
    "auditEvidence", "evidenceLimitations",
    "requiresExternalResearch", "blockingReason",
    "createdAt", "updatedAt", "founderNotes",
  ];
  const units: unknown[] = queue?.units ?? [];
  for (const u of units) {
    for (const key of REQUIRED) {
      assert(key in (u as object), `unit missing key "${key}": ${JSON.stringify(u)}`);
    }
  }
}));

results.push(proof("110: all unit createdAt and updatedAt are valid ISO timestamps", () => {
  const units: Array<{createdAt: string; updatedAt: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units) {
    const ca = new Date(u.createdAt);
    const ua = new Date(u.updatedAt);
    assert(!isNaN(ca.getTime()), `createdAt invalid for ${u.reviewId}: "${u.createdAt}"`);
    assert(!isNaN(ua.getTime()), `updatedAt invalid for ${u.reviewId}: "${u.updatedAt}"`);
  }
}));

// ─── §200 Pair Counts ────────────────────────────────────────────────────────

results.push(proof("201: 168 total review units", () => {
  const count = (queue?.units as unknown[])?.length ?? -1;
  assert(count === 168, `expected 168 units; got ${count}`);
}));

results.push(proof("202: 91 alternative pairs", () => {
  const count = (queue?.units as Array<{pairType: string}>)
    ?.filter(u => u.pairType === "alternatives").length ?? -1;
  assert(count === 91, `expected 91 alternative pairs; got ${count}`);
}));

results.push(proof("203: 71 wardrobe partner pairs", () => {
  const count = (queue?.units as Array<{pairType: string}>)
    ?.filter(u => u.pairType === "wardrobePartners").length ?? -1;
  assert(count === 71, `expected 71 wardrobe partner pairs; got ${count}`);
}));

results.push(proof("204: 6 evolution pairs", () => {
  const count = (queue?.units as Array<{pairType: string}>)
    ?.filter(u => u.pairType === "evolution").length ?? -1;
  assert(count === 6, `expected 6 evolution pairs; got ${count}`);
}));

results.push(proof("205: summary.alternativePairs === 91", () => {
  const v = queue?.summary?.alternativePairs;
  assert(v === 91, `expected summary.alternativePairs 91; got ${v}`);
}));

results.push(proof("206: summary.wardrobePartnerPairs === 71", () => {
  const v = queue?.summary?.wardrobePartnerPairs;
  assert(v === 71, `expected summary.wardrobePartnerPairs 71; got ${v}`);
}));

results.push(proof("207: summary.evolutionPairs === 6", () => {
  const v = queue?.summary?.evolutionPairs;
  assert(v === 6, `expected summary.evolutionPairs 6; got ${v}`);
}));

results.push(proof("208: summary.requiresExternalResearch === 6", () => {
  const v = queue?.summary?.requiresExternalResearch;
  assert(v === 6, `expected summary.requiresExternalResearch 6; got ${v}`);
}));

// ─── §300 Review ID Determinism ──────────────────────────────────────────────

results.push(proof("301: all 168 review IDs are unique", () => {
  const ids: string[] = (queue?.units as Array<{reviewId: string}>)?.map(u => u.reviewId) ?? [];
  const unique = new Set(ids);
  assert(unique.size === 168, `expected 168 unique IDs; got ${unique.size} (${168 - unique.size} duplicates)`);
}));

results.push(proof("302: alternative pair IDs have REL-alternatives- prefix", () => {
  const units: Array<{pairType: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units.filter(u => u.pairType === "alternatives")) {
    assert(u.reviewId.startsWith("REL-alternatives-"),
      `alt pair ID "${u.reviewId}" does not start with "REL-alternatives-"`);
  }
}));

results.push(proof("303: wardrobe partner pair IDs have REL-wardrobe-partners- prefix", () => {
  const units: Array<{pairType: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units.filter(u => u.pairType === "wardrobePartners")) {
    assert(u.reviewId.startsWith("REL-wardrobe-partners-"),
      `wp pair ID "${u.reviewId}" does not start with "REL-wardrobe-partners-"`);
  }
}));

results.push(proof("304: evolution pair IDs have REL-evolution- prefix", () => {
  const units: Array<{pairType: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units.filter(u => u.pairType === "evolution")) {
    assert(u.reviewId.startsWith("REL-evolution-"),
      `evo pair ID "${u.reviewId}" does not start with "REL-evolution-"`);
  }
}));

results.push(proof("305: spot check — REL-alternatives-1-million-inspired--azzaro-most-wanted-inspired exists", () => {
  const units: Array<{reviewId: string}> = queue?.units ?? [];
  const found = units.some(u => u.reviewId === "REL-alternatives-1-million-inspired--azzaro-most-wanted-inspired");
  assert(found, "REL-alternatives-1-million-inspired--azzaro-most-wanted-inspired not found in queue");
}));

results.push(proof("306: spot check — REL-evolution-aqua-di-gio-inspired--acqua-di-gio-parfum-inspired exists", () => {
  const units: Array<{reviewId: string}> = queue?.units ?? [];
  const found = units.some(u => u.reviewId === "REL-evolution-aqua-di-gio-inspired--acqua-di-gio-parfum-inspired");
  assert(found, "REL-evolution-aqua-di-gio-inspired--acqua-di-gio-parfum-inspired not found in queue");
}));

results.push(proof("307: spot check — REL-evolution-y-inspired--y-edp-inspired exists", () => {
  const units: Array<{reviewId: string}> = queue?.units ?? [];
  const found = units.some(u => u.reviewId === "REL-evolution-y-inspired--y-edp-inspired");
  assert(found, "REL-evolution-y-inspired--y-edp-inspired not found in queue");
}));

results.push(proof("308: all alternative pair units have slugA < slugB (lexical)", () => {
  const units: Array<{pairType: string; slugA: string; slugB: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units.filter(u => u.pairType === "alternatives")) {
    assert(u.slugA < u.slugB,
      `alt pair "${u.reviewId}" has slugA "${u.slugA}" >= slugB "${u.slugB}" (not lexically ordered)`);
  }
}));

results.push(proof("309: all wardrobe partner pair units have slugA < slugB (lexical)", () => {
  const units: Array<{pairType: string; slugA: string; slugB: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units.filter(u => u.pairType === "wardrobePartners")) {
    assert(u.slugA < u.slugB,
      `wp pair "${u.reviewId}" has slugA "${u.slugA}" >= slugB "${u.slugB}" (not lexically ordered)`);
  }
}));

// ─── §400 Status Invariants ──────────────────────────────────────────────────

results.push(proof("401: all 168 units have status pending-review", () => {
  const units: Array<{status: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units) {
    assert(u.status === "pending-review",
      `unit "${u.reviewId}" has status "${u.status}" (expected pending-review)`);
  }
}));

results.push(proof("402: summary.byStatus.pending-review === 168", () => {
  const v = queue?.summary?.byStatus?.["pending-review"];
  assert(v === 168, `expected byStatus.pending-review 168; got ${v}`);
}));

results.push(proof("403: byStatus values sum to 168", () => {
  const s = queue?.summary?.byStatus ?? {};
  const total = Object.values(s).reduce((acc: number, v) => acc + (v as number), 0);
  assert(total === 168, `byStatus sum is ${total}; expected 168`);
}));

results.push(proof("404: summary.byStatus.approved === 0", () => {
  const v = queue?.summary?.byStatus?.approved;
  assert(v === 0, `expected byStatus.approved 0; got ${v}`);
}));

results.push(proof("405: summary.byStatus.rejected === 0", () => {
  const v = queue?.summary?.byStatus?.rejected;
  assert(v === 0, `expected byStatus.rejected 0; got ${v}`);
}));

results.push(proof("406: summary.byStatus.in-review === 0", () => {
  const v = queue?.summary?.byStatus?.["in-review"];
  assert(v === 0, `expected byStatus.in-review 0; got ${v}`);
}));

results.push(proof("407: summary.byStatus.needs-research + deferred === 0", () => {
  const nr = queue?.summary?.byStatus?.["needs-research"] ?? 0;
  const d  = queue?.summary?.byStatus?.deferred ?? 0;
  assert(nr + d === 0, `expected needs-research+deferred 0; got ${nr + d}`);
}));

// ─── §500 Provenance & Governance ────────────────────────────────────────────

results.push(proof("501: all units have proposalProvenance AI_GENERATED", () => {
  const units: Array<{proposalProvenance: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units) {
    assert(u.proposalProvenance === "AI_GENERATED",
      `unit "${u.reviewId}" has proposalProvenance "${u.proposalProvenance}" (expected AI_GENERATED)`);
  }
}));

results.push(proof("502: all units have governanceState REPOSITORY_SUPPORTED", () => {
  const units: Array<{governanceState: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units) {
    assert(u.governanceState === "REPOSITORY_SUPPORTED",
      `unit "${u.reviewId}" has governanceState "${u.governanceState}" (expected REPOSITORY_SUPPORTED)`);
  }
}));

results.push(proof("503: summary.byGovernanceState.REPOSITORY_SUPPORTED === 168", () => {
  const v = queue?.summary?.byGovernanceState?.REPOSITORY_SUPPORTED;
  assert(v === 168, `expected byGovernanceState.REPOSITORY_SUPPORTED 168; got ${v}`);
}));

results.push(proof("504: summary.byGovernanceState.FOUNDER_APPROVED === 0", () => {
  const v = queue?.summary?.byGovernanceState?.FOUNDER_APPROVED;
  assert(v === 0, `expected FOUNDER_APPROVED 0; got ${v}`);
}));

results.push(proof("505: summary.byGovernanceState.FOUNDER_REJECTED === 0", () => {
  const v = queue?.summary?.byGovernanceState?.FOUNDER_REJECTED;
  assert(v === 0, `expected FOUNDER_REJECTED 0; got ${v}`);
}));

results.push(proof("506: all units have founderNotes === null", () => {
  const units: Array<{founderNotes: unknown; reviewId: string}> = queue?.units ?? [];
  for (const u of units) {
    assert(u.founderNotes === null,
      `unit "${u.reviewId}" has founderNotes "${u.founderNotes}" (expected null)`);
  }
}));

results.push(proof("507: all units have auditEvidence object with required fields", () => {
  const EV_KEYS = ["familyOverlap", "scentCharacterMatch", "genderMatch", "collectionMatch",
                   "topNoteOverlap", "baseNoteOverlap", "overlapScore"];
  const units: Array<{auditEvidence: unknown; reviewId: string}> = queue?.units ?? [];
  for (const u of units) {
    assert(typeof u.auditEvidence === "object" && u.auditEvidence !== null,
      `unit "${u.reviewId}" has null/missing auditEvidence`);
    for (const key of EV_KEYS) {
      assert(key in (u.auditEvidence as object),
        `unit "${u.reviewId}" auditEvidence missing key "${key}"`);
    }
  }
}));

results.push(proof("508: all 6 external-research units are evolution pairs", () => {
  const units: Array<{requiresExternalResearch: boolean; pairType: string; reviewId: string}> = queue?.units ?? [];
  const researchUnits = units.filter(u => u.requiresExternalResearch);
  assert(researchUnits.length === 6,
    `expected 6 external-research units; got ${researchUnits.length}`);
  for (const u of researchUnits) {
    assert(u.pairType === "evolution",
      `external-research unit "${u.reviewId}" has pairType "${u.pairType}" (expected evolution)`);
  }
}));

// ─── §600 Catalogue Integrity ─────────────────────────────────────────────────

results.push(proof("601: alien-goddess-inspired.ts SHA matches post-P5A protected baseline", () => {
  const path = join(NATIVE_DIR, "alien-goddess-inspired.ts");
  const actual = sha256File(path);
  const expected = PROTECTED_SHAS["alien-goddess-inspired.ts"];
  assert(actual === expected,
    `alien-goddess-inspired.ts SHA mismatch\n  expected: ${expected}\n  actual:   ${actual}`);
}));

results.push(proof("602: delina-inspired.ts SHA matches post-P5A protected baseline", () => {
  const path = join(NATIVE_DIR, "delina-inspired.ts");
  const actual = sha256File(path);
  const expected = PROTECTED_SHAS["delina-inspired.ts"];
  assert(actual === expected,
    `delina-inspired.ts SHA mismatch\n  expected: ${expected}\n  actual:   ${actual}`);
}));

results.push(proof("603: baccarat-rouge-540-inspired.ts SHA matches post-P5A protected baseline", () => {
  const path = join(NATIVE_DIR, "baccarat-rouge-540-inspired.ts");
  const actual = sha256File(path);
  const expected = PROTECTED_SHAS["baccarat-rouge-540-inspired.ts"];
  assert(actual === expected,
    `baccarat-rouge-540-inspired.ts SHA mismatch\n  expected: ${expected}\n  actual:   ${actual}`);
}));

results.push(proof("604: live audit JSON graph fingerprint matches post-P5A baseline", () => {
  assert(audit !== null, "audit artifact not found");
  const edges: AuditEdge[] = audit.edges;
  const actual = buildRelationshipFingerprint(edges);
  assert(actual === POST_P5A_FINGERPRINT,
    `live audit fingerprint mismatch\n  expected: ${POST_P5A_FINGERPRINT}\n  actual:   ${actual}`);
}));

results.push(proof("605: 0 structural defects in relationship audit", () => {
  const count = audit?.summary?.structuralDefectCount ?? -1;
  assert(count === 0, `expected 0 structural defects; got ${count}`);
}));

results.push(proof("606: 336 total edges in relationship audit", () => {
  const count = audit?.summary?.totalRelationshipEdges ?? -1;
  assert(count === 336, `expected 336 total edges; got ${count}`);
}));

// ─── §700 Security Control ────────────────────────────────────────────────────

results.push(proof("701: APPROVED_IDENTITY_ID governance sentinel is null (no founder decisions authorized)", () => {
  assert(APPROVED_IDENTITY_ID === null,
    `APPROVED_IDENTITY_ID must be null; got ${APPROVED_IDENTITY_ID}`);
}));

results.push(proof("702: FORCE governance sentinel is false (no forced mutations authorized)", () => {
  assert(FORCE === false, `FORCE must be false; got ${FORCE}`);
}));

results.push(proof("703: builder does not import @anthropic-ai/sdk", () => {
  const src = readFileSync(BUILDER_PATH, "utf-8");
  assert(!src.includes("@anthropic-ai/sdk"),
    "build-relationship-review-queue.ts must not import @anthropic-ai/sdk");
}));

results.push(proof("704: builder does not import MKC factory module", () => {
  const src = readFileSync(BUILDER_PATH, "utf-8");
  assert(!src.includes("scripts/factory"),
    "build-relationship-review-queue.ts must not import MKC factory");
}));

// ── Report ─────────────────────────────────────────────────────────────────────

const passed = results.filter(r => r.ok).length;
const failed = results.filter(r => !r.ok);

console.log(`\nEP6-P5B — Relationship Editorial Review Foundation Validator`);
console.log(`===========================================================`);
console.log(`Proofs: ${passed}/${results.length} passed\n`);

for (const r of results) {
  const icon = r.ok ? "✓" : "✗";
  console.log(`  ${icon} ${r.label}`);
  if (!r.ok && r.error) {
    for (const line of r.error.split("\n")) {
      console.log(`      ${line}`);
    }
  }
}

if (failed.length > 0) {
  console.log(`\nFAILED: ${failed.length} proof(s) failed.`);
  process.exit(1);
} else {
  console.log(`\nALL ${results.length} PROOFS PASSED.`);
  console.log(`\nGovernance: APPROVED_IDENTITY_ID=null, FORCE=false, EP6-P5C NOT AUTHORIZED.`);
  console.log(`Queue: 168 review units (91 alt + 71 wp + 6 evo), all pending-review / REPOSITORY_SUPPORTED.`);
}

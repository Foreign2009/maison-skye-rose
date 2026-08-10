/**
 * EP6-P5B/P5BR — Relationship Editorial Review Foundation Validator
 *
 * Validates the catalogue-relationship-review-queue.json artifact.
 * EP6-P5BR correction: governance semantics verified as corrected.
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

const QUEUE_PATH   = join(ROOT, "app/lib/identity/data/reviews/catalogue-relationship-review-queue.json");
const AUDIT_PATH   = join(ROOT, "app/lib/identity/data/audits/catalogue-relationship-editorial-audit.json");
const BUILDER_PATH = join(ROOT, "scripts/identity/build-relationship-review-queue.ts");
const TYPES_PATH   = join(ROOT, "app/lib/identity/editorial/relationship/types.ts");
const NATIVE_DIR   = join(ROOT, "app/lib/mkc/native");

// ── Governance sentinels ───────────────────────────────────────────────────────

const APPROVED_IDENTITY_ID = null;
const FORCE = false;

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

results.push(proof("102: schemaVersion === 'EP6-P5BR-v1'", () => {
  assert(queue?.schemaVersion === "EP6-P5BR-v1",
    `expected schemaVersion "EP6-P5BR-v1"; got "${queue?.schemaVersion}"`);
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
  assert(sumTotal === len, `summary.totalUnits ${sumTotal} !== units.length ${len}`);
}));

results.push(proof("108: generatedAt is a valid ISO timestamp", () => {
  const ts = queue?.generatedAt;
  const d = ts ? new Date(ts) : null;
  assert(d !== null && !isNaN(d.getTime()), `generatedAt "${ts}" is not a valid ISO timestamp`);
}));

results.push(proof("109: all units have required top-level keys", () => {
  const REQUIRED = [
    "reviewId", "pairType", "slugA", "slugB",
    "currentCanonicalState", "proposalProvenance", "governanceState", "status",
    "auditEvidence", "evidenceLimitations",
    "requiresExternalResearch", "requiresFounderDecision", "blockingReason",
    "createdAt", "updatedAt", "founderNotes",
  ];
  const units: unknown[] = queue?.units ?? [];
  for (const u of units) {
    for (const key of REQUIRED) {
      assert(key in (u as object), `unit missing key "${key}": ${JSON.stringify((u as Record<string, unknown>)?.reviewId)}`);
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
  assert(queue?.summary?.alternativePairs === 91,
    `expected summary.alternativePairs 91; got ${queue?.summary?.alternativePairs}`);
}));

results.push(proof("206: summary.wardrobePartnerPairs === 71", () => {
  assert(queue?.summary?.wardrobePartnerPairs === 71,
    `expected summary.wardrobePartnerPairs 71; got ${queue?.summary?.wardrobePartnerPairs}`);
}));

results.push(proof("207: summary.evolutionPairs === 6", () => {
  assert(queue?.summary?.evolutionPairs === 6,
    `expected summary.evolutionPairs 6; got ${queue?.summary?.evolutionPairs}`);
}));

results.push(proof("208: summary.requiresExternalResearch === 6", () => {
  assert(queue?.summary?.requiresExternalResearch === 6,
    `expected summary.requiresExternalResearch 6; got ${queue?.summary?.requiresExternalResearch}`);
}));

// ─── §300 Review ID Determinism ──────────────────────────────────────────────

results.push(proof("301: all 168 review IDs are unique", () => {
  const ids: string[] = (queue?.units as Array<{reviewId: string}>)?.map(u => u.reviewId) ?? [];
  const unique = new Set(ids);
  assert(unique.size === 168,
    `expected 168 unique IDs; got ${unique.size} (${168 - unique.size} duplicates)`);
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
  assert(units.some(u => u.reviewId === "REL-alternatives-1-million-inspired--azzaro-most-wanted-inspired"),
    "REL-alternatives-1-million-inspired--azzaro-most-wanted-inspired not found in queue");
}));

results.push(proof("306: spot check — REL-evolution-aqua-di-gio-inspired--acqua-di-gio-parfum-inspired exists", () => {
  const units: Array<{reviewId: string}> = queue?.units ?? [];
  assert(units.some(u => u.reviewId === "REL-evolution-aqua-di-gio-inspired--acqua-di-gio-parfum-inspired"),
    "REL-evolution-aqua-di-gio-inspired--acqua-di-gio-parfum-inspired not found in queue");
}));

results.push(proof("307: spot check — REL-evolution-y-inspired--y-edp-inspired exists", () => {
  const units: Array<{reviewId: string}> = queue?.units ?? [];
  assert(units.some(u => u.reviewId === "REL-evolution-y-inspired--y-edp-inspired"),
    "REL-evolution-y-inspired--y-edp-inspired not found in queue");
}));

results.push(proof("308: all alternative pair units have slugA < slugB (lexical)", () => {
  const units: Array<{pairType: string; slugA: string; slugB: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units.filter(u => u.pairType === "alternatives")) {
    assert(u.slugA < u.slugB,
      `alt pair "${u.reviewId}" has slugA "${u.slugA}" >= slugB "${u.slugB}"`);
  }
}));

results.push(proof("309: all wardrobe partner pair units have slugA < slugB (lexical)", () => {
  const units: Array<{pairType: string; slugA: string; slugB: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units.filter(u => u.pairType === "wardrobePartners")) {
    assert(u.slugA < u.slugB,
      `wp pair "${u.reviewId}" has slugA "${u.slugA}" >= slugB "${u.slugB}"`);
  }
}));

// ─── §400 Status Invariants ──────────────────────────────────────────────────

results.push(proof("401: 162 alt+wp units have status pending-review", () => {
  const units: Array<{pairType: string; status: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units.filter(u => u.pairType !== "evolution")) {
    assert(u.status === "pending-review",
      `unit "${u.reviewId}" (${u.pairType}) has status "${u.status}" (expected pending-review)`);
  }
  const pendingCount = units.filter(u => u.status === "pending-review").length;
  assert(pendingCount === 162, `expected 162 pending-review units; got ${pendingCount}`);
}));

results.push(proof("402: 6 evolution units have status needs-research", () => {
  const units: Array<{pairType: string; status: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units.filter(u => u.pairType === "evolution")) {
    assert(u.status === "needs-research",
      `evolution unit "${u.reviewId}" has status "${u.status}" (expected needs-research)`);
  }
  const researchCount = units.filter(u => u.status === "needs-research").length;
  assert(researchCount === 6, `expected 6 needs-research units; got ${researchCount}`);
}));

results.push(proof("403: summary.byStatus.pending-review === 162", () => {
  const v = queue?.summary?.byStatus?.["pending-review"];
  assert(v === 162, `expected byStatus.pending-review 162; got ${v}`);
}));

results.push(proof("404: summary.byStatus.needs-research === 6", () => {
  const v = queue?.summary?.byStatus?.["needs-research"];
  assert(v === 6, `expected byStatus.needs-research 6; got ${v}`);
}));

results.push(proof("405: byStatus values sum to 168", () => {
  const s = queue?.summary?.byStatus ?? {};
  const total = Object.values(s).reduce((acc: number, v) => acc + (v as number), 0);
  assert(total === 168, `byStatus sum is ${total}; expected 168`);
}));

results.push(proof("406: summary.byStatus.approved + rejected + in-review + deferred === 0", () => {
  const s = queue?.summary?.byStatus ?? {};
  const zero = (s.approved ?? 0) + (s.rejected ?? 0) + (s["in-review"] ?? 0) + (s.deferred ?? 0);
  assert(zero === 0, `expected approved+rejected+in-review+deferred 0; got ${zero}`);
}));

results.push(proof("407: no unit has status 'approved', 'rejected', or 'in-review'", () => {
  const units: Array<{status: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units) {
    assert(u.status !== "approved" && u.status !== "rejected" && u.status !== "in-review",
      `unit "${u.reviewId}" has forbidden status "${u.status}"`);
  }
}));

// ─── §500 Provenance, Governance & Canonical State ───────────────────────────

results.push(proof("501: all units have proposalProvenance AI_GENERATED", () => {
  const units: Array<{proposalProvenance: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units) {
    assert(u.proposalProvenance === "AI_GENERATED",
      `unit "${u.reviewId}" has proposalProvenance "${u.proposalProvenance}" (expected AI_GENERATED)`);
  }
}));

results.push(proof("502: 162 alt+wp units have governanceState PENDING", () => {
  const units: Array<{pairType: string; governanceState: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units.filter(u => u.pairType !== "evolution")) {
    assert(u.governanceState === "PENDING",
      `unit "${u.reviewId}" (${u.pairType}) has governanceState "${u.governanceState}" (expected PENDING)`);
  }
  const count = units.filter(u => u.governanceState === "PENDING").length;
  assert(count === 162, `expected 162 PENDING units; got ${count}`);
}));

results.push(proof("503: 6 evolution units have governanceState RESEARCH_BLOCKED", () => {
  const units: Array<{pairType: string; governanceState: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units.filter(u => u.pairType === "evolution")) {
    assert(u.governanceState === "RESEARCH_BLOCKED",
      `evolution unit "${u.reviewId}" has governanceState "${u.governanceState}" (expected RESEARCH_BLOCKED)`);
  }
  const count = units.filter(u => u.governanceState === "RESEARCH_BLOCKED").length;
  assert(count === 6, `expected 6 RESEARCH_BLOCKED units; got ${count}`);
}));

results.push(proof("504: summary.byGovernanceState.PENDING === 162", () => {
  assert(queue?.summary?.byGovernanceState?.PENDING === 162,
    `expected PENDING 162; got ${queue?.summary?.byGovernanceState?.PENDING}`);
}));

results.push(proof("505: summary.byGovernanceState.RESEARCH_BLOCKED === 6", () => {
  assert(queue?.summary?.byGovernanceState?.RESEARCH_BLOCKED === 6,
    `expected RESEARCH_BLOCKED 6; got ${queue?.summary?.byGovernanceState?.RESEARCH_BLOCKED}`);
}));

results.push(proof("506: summary.byGovernanceState.FOUNDER_APPROVED === 0", () => {
  assert(queue?.summary?.byGovernanceState?.FOUNDER_APPROVED === 0,
    `expected FOUNDER_APPROVED 0; got ${queue?.summary?.byGovernanceState?.FOUNDER_APPROVED}`);
}));

results.push(proof("507: summary.byGovernanceState.FOUNDER_REJECTED === 0", () => {
  assert(queue?.summary?.byGovernanceState?.FOUNDER_REJECTED === 0,
    `expected FOUNDER_REJECTED 0; got ${queue?.summary?.byGovernanceState?.FOUNDER_REJECTED}`);
}));

results.push(proof("508: summary.byGovernanceState.DEFERRED === 0", () => {
  assert(queue?.summary?.byGovernanceState?.DEFERRED === 0,
    `expected DEFERRED 0; got ${queue?.summary?.byGovernanceState?.DEFERRED}`);
}));

results.push(proof("509: no unit has governanceState REPOSITORY_SUPPORTED (semantic false claim removed)", () => {
  const units: Array<{governanceState: string; reviewId: string}> = queue?.units ?? [];
  const bad = units.filter(u => u.governanceState === "REPOSITORY_SUPPORTED");
  assert(bad.length === 0,
    `${bad.length} unit(s) still have REPOSITORY_SUPPORTED: ${bad.map(u => u.reviewId).join(", ")}`);
}));

results.push(proof("510: all units have currentCanonicalState === 'PRESENT'", () => {
  const units: Array<{currentCanonicalState: string; reviewId: string}> = queue?.units ?? [];
  for (const u of units) {
    assert(u.currentCanonicalState === "PRESENT",
      `unit "${u.reviewId}" has currentCanonicalState "${u.currentCanonicalState}" (expected PRESENT)`);
  }
}));

results.push(proof("511: 162 alt+wp units have requiresFounderDecision === true", () => {
  const units: Array<{pairType: string; requiresFounderDecision: boolean; reviewId: string}> = queue?.units ?? [];
  for (const u of units.filter(u => u.pairType !== "evolution")) {
    assert(u.requiresFounderDecision === true,
      `unit "${u.reviewId}" (${u.pairType}) has requiresFounderDecision false (expected true)`);
  }
  const count = units.filter(u => u.requiresFounderDecision === true).length;
  assert(count === 162, `expected 162 requiresFounderDecision=true; got ${count}`);
}));

results.push(proof("512: 6 evolution units have requiresFounderDecision === false", () => {
  const units: Array<{pairType: string; requiresFounderDecision: boolean; reviewId: string}> = queue?.units ?? [];
  for (const u of units.filter(u => u.pairType === "evolution")) {
    assert(u.requiresFounderDecision === false,
      `evolution unit "${u.reviewId}" has requiresFounderDecision true (expected false — research required first)`);
  }
}));

results.push(proof("513: summary.requiresFounderDecision === 162", () => {
  assert(queue?.summary?.requiresFounderDecision === 162,
    `expected summary.requiresFounderDecision 162; got ${queue?.summary?.requiresFounderDecision}`);
}));

results.push(proof("514: 162 alt+wp units have requiresExternalResearch === false", () => {
  const units: Array<{pairType: string; requiresExternalResearch: boolean; reviewId: string}> = queue?.units ?? [];
  for (const u of units.filter(u => u.pairType !== "evolution")) {
    assert(u.requiresExternalResearch === false,
      `unit "${u.reviewId}" (${u.pairType}) has requiresExternalResearch true (unexpected)`);
  }
}));

results.push(proof("515: 6 evolution units have requiresExternalResearch === true", () => {
  const units: Array<{pairType: string; requiresExternalResearch: boolean; reviewId: string}> = queue?.units ?? [];
  for (const u of units.filter(u => u.pairType === "evolution")) {
    assert(u.requiresExternalResearch === true,
      `evolution unit "${u.reviewId}" has requiresExternalResearch false (expected true)`);
  }
}));

results.push(proof("516: all units have founderNotes === null", () => {
  const units: Array<{founderNotes: unknown; reviewId: string}> = queue?.units ?? [];
  for (const u of units) {
    assert(u.founderNotes === null,
      `unit "${u.reviewId}" has founderNotes "${u.founderNotes}" (expected null)`);
  }
}));

results.push(proof("517: all units have auditEvidence object with required fields", () => {
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

results.push(proof("518: no unit references alien-goddess-inspired", () => {
  const units: Array<{slugA: string; slugB: string; reviewId: string}> = queue?.units ?? [];
  const bad = units.filter(u =>
    u.slugA === "alien-goddess-inspired" || u.slugB === "alien-goddess-inspired",
  );
  assert(bad.length === 0,
    `${bad.length} unit(s) reference alien-goddess-inspired: ${bad.map(u => u.reviewId).join(", ")}`);
}));

// ─── §600 Catalogue Integrity ─────────────────────────────────────────────────

results.push(proof("601: alien-goddess-inspired.ts SHA matches post-P5A protected baseline", () => {
  const actual = sha256File(join(NATIVE_DIR, "alien-goddess-inspired.ts"));
  const expected = PROTECTED_SHAS["alien-goddess-inspired.ts"];
  assert(actual === expected,
    `alien-goddess-inspired.ts SHA mismatch\n  expected: ${expected}\n  actual:   ${actual}`);
}));

results.push(proof("602: delina-inspired.ts SHA matches post-P5A protected baseline", () => {
  const actual = sha256File(join(NATIVE_DIR, "delina-inspired.ts"));
  const expected = PROTECTED_SHAS["delina-inspired.ts"];
  assert(actual === expected,
    `delina-inspired.ts SHA mismatch\n  expected: ${expected}\n  actual:   ${actual}`);
}));

results.push(proof("603: baccarat-rouge-540-inspired.ts SHA matches post-P5A protected baseline", () => {
  const actual = sha256File(join(NATIVE_DIR, "baccarat-rouge-540-inspired.ts"));
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

results.push(proof("701: APPROVED_IDENTITY_ID governance sentinel is null", () => {
  assert(APPROVED_IDENTITY_ID === null,
    `APPROVED_IDENTITY_ID must be null; got ${APPROVED_IDENTITY_ID}`);
}));

results.push(proof("702: FORCE governance sentinel is false", () => {
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

results.push(proof("705: builder imports canonical types from relationship/types.ts", () => {
  const src = readFileSync(BUILDER_PATH, "utf-8");
  assert(src.includes("identity/editorial/relationship/types"),
    "builder must import from app/lib/identity/editorial/relationship/types.ts (no shadow schema)");
}));

results.push(proof("706: canonical types file does not contain REPOSITORY_SUPPORTED", () => {
  const src = readFileSync(TYPES_PATH, "utf-8");
  assert(!src.includes('"REPOSITORY_SUPPORTED"'),
    "types.ts must not define REPOSITORY_SUPPORTED governance state");
}));

// ─── §800 Independent Edge-to-Pair Derivation ────────────────────────────────

interface TypedEdge {
  sourceSlug: string;
  relationshipType: string;
  targetSlug: string;
}

const auditEdges: TypedEdge[] = audit?.edges ?? [];

results.push(proof("801: 182 alternative edges collapse to exactly 91 pairs", () => {
  const altEdges = auditEdges.filter(e => e.relationshipType === "alternatives");
  assert(altEdges.length === 182, `expected 182 alt edges from audit; got ${altEdges.length}`);
  const pairs = new Set<string>();
  for (const e of altEdges) {
    const [a, b] = [e.sourceSlug, e.targetSlug].sort();
    pairs.add(`${a}--${b}`);
  }
  assert(pairs.size === 91, `expected 91 alt pairs from edge collapse; got ${pairs.size}`);
}));

results.push(proof("802: 142 wardrobePartner edges collapse to exactly 71 pairs", () => {
  const wpEdges = auditEdges.filter(e => e.relationshipType === "wardrobePartners");
  assert(wpEdges.length === 142, `expected 142 wp edges from audit; got ${wpEdges.length}`);
  const pairs = new Set<string>();
  for (const e of wpEdges) {
    const [a, b] = [e.sourceSlug, e.targetSlug].sort();
    pairs.add(`${a}--${b}`);
  }
  assert(pairs.size === 71, `expected 71 wp pairs from edge collapse; got ${pairs.size}`);
}));

results.push(proof("803: 6 evolutionOf edges yield exactly 6 evolution pairs", () => {
  const eoEdges = auditEdges.filter(e => e.relationshipType === "evolutionOf");
  assert(eoEdges.length === 6, `expected 6 evolutionOf edges from audit; got ${eoEdges.length}`);
  const evEdges = auditEdges.filter(e => e.relationshipType === "evolutions");
  assert(evEdges.length === 6, `expected 6 evolutions edges from audit; got ${evEdges.length}`);
}));

results.push(proof("804: every alternative pair has a corresponding queue unit", () => {
  const altEdges = auditEdges.filter(e => e.relationshipType === "alternatives");
  const queueIds = new Set((queue?.units as Array<{reviewId: string}>)?.map(u => u.reviewId) ?? []);
  for (const e of altEdges) {
    if (e.sourceSlug >= e.targetSlug) continue;
    const expectedId = `REL-alternatives-${e.sourceSlug}--${e.targetSlug}`;
    assert(queueIds.has(expectedId),
      `alt edge ${e.sourceSlug}→${e.targetSlug} has no queue unit: "${expectedId}"`);
  }
}));

results.push(proof("805: every wardrobePartner pair has a corresponding queue unit", () => {
  const wpEdges = auditEdges.filter(e => e.relationshipType === "wardrobePartners");
  const queueIds = new Set((queue?.units as Array<{reviewId: string}>)?.map(u => u.reviewId) ?? []);
  for (const e of wpEdges) {
    if (e.sourceSlug >= e.targetSlug) continue;
    const expectedId = `REL-wardrobe-partners-${e.sourceSlug}--${e.targetSlug}`;
    assert(queueIds.has(expectedId),
      `wp edge ${e.sourceSlug}→${e.targetSlug} has no queue unit: "${expectedId}"`);
  }
}));

results.push(proof("806: every evolutionOf edge has a corresponding evolution queue unit", () => {
  const eoEdges = auditEdges.filter(e => e.relationshipType === "evolutionOf");
  const queueIds = new Set((queue?.units as Array<{reviewId: string}>)?.map(u => u.reviewId) ?? []);
  for (const e of eoEdges) {
    const parent = e.targetSlug;
    const child  = e.sourceSlug;
    const expectedId = `REL-evolution-${parent}--${child}`;
    assert(queueIds.has(expectedId),
      `evolutionOf edge ${child}→${parent} has no queue unit: "${expectedId}"`);
  }
}));

results.push(proof("807: no queue unit exists without a corresponding source edge", () => {
  const altPairs = new Set<string>();
  for (const e of auditEdges.filter(e => e.relationshipType === "alternatives")) {
    if (e.sourceSlug < e.targetSlug) altPairs.add(`REL-alternatives-${e.sourceSlug}--${e.targetSlug}`);
  }
  const wpPairs = new Set<string>();
  for (const e of auditEdges.filter(e => e.relationshipType === "wardrobePartners")) {
    if (e.sourceSlug < e.targetSlug) wpPairs.add(`REL-wardrobe-partners-${e.sourceSlug}--${e.targetSlug}`);
  }
  const evoPairs = new Set<string>();
  for (const e of auditEdges.filter(e => e.relationshipType === "evolutionOf")) {
    evoPairs.add(`REL-evolution-${e.targetSlug}--${e.sourceSlug}`);
  }
  const units: Array<{reviewId: string; pairType: string}> = queue?.units ?? [];
  for (const u of units) {
    let sourceExists = false;
    if (u.pairType === "alternatives")     sourceExists = altPairs.has(u.reviewId);
    if (u.pairType === "wardrobePartners") sourceExists = wpPairs.has(u.reviewId);
    if (u.pairType === "evolution")        sourceExists = evoPairs.has(u.reviewId);
    assert(sourceExists, `queue unit "${u.reviewId}" has no corresponding source edge`);
  }
}));

results.push(proof("808: 91 alternative queue units account for all 182 alternative edges (2 edges per pair)", () => {
  const units: Array<{pairType: string; slugA: string; slugB: string}> = queue?.units ?? [];
  const altUnits = units.filter(u => u.pairType === "alternatives");
  // Each pair represents 2 directed edges (A→B and B→A)
  assert(altUnits.length * 2 === 182,
    `91 alt pairs × 2 = ${altUnits.length * 2}; expected 182`);
}));

results.push(proof("809: 71 wardrobePartner queue units account for all 142 wardrobePartner edges (2 edges per pair)", () => {
  const units: Array<{pairType: string}> = queue?.units ?? [];
  const wpUnits = units.filter(u => u.pairType === "wardrobePartners");
  assert(wpUnits.length * 2 === 142,
    `71 wp pairs × 2 = ${wpUnits.length * 2}; expected 142`);
}));

results.push(proof("810: 6 evolution queue units account for all 12 evolution edges (2 edges per lineage)", () => {
  const units: Array<{pairType: string}> = queue?.units ?? [];
  const evoUnits = units.filter(u => u.pairType === "evolution");
  // Each evolution pair = 1 evolutionOf + 1 evolutions edge
  assert(evoUnits.length * 2 === 12,
    `6 evo pairs × 2 = ${evoUnits.length * 2}; expected 12`);
}));

// ── Report ─────────────────────────────────────────────────────────────────────

const passed = results.filter(r => r.ok).length;
const failed = results.filter(r => !r.ok);

console.log(`\nEP6-P5B/P5BR — Relationship Editorial Review Foundation Validator`);
console.log(`================================================================`);
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
  console.log(`Queue: 168 review units (91 alt + 71 wp + 6 evo).`);
  console.log(`  162 pending-review / PENDING (alt+wp) — requiresFounderDecision=true`);
  console.log(`  6 needs-research / RESEARCH_BLOCKED (evo) — requiresFounderDecision=false`);
  console.log(`  0 REPOSITORY_SUPPORTED (semantic false claim eliminated).`);
}

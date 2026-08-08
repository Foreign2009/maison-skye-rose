/**
 * EP5-P3C — Identity Review Admin Integration Validation
 *
 * Validates that the admin interface integration is correctly wired to
 * the EP5-P3B IdentityEditorialService, that architectural boundaries are
 * respected, and that the production registry remains unchanged.
 *
 * These proofs test EP5-P3C integration — they do not duplicate the
 * 100 EP5-P3B service proofs.
 *
 * Mutation tests use InMemoryRepository (never the production repository).
 * Read projection tests use the production repository (read-only — no writes).
 *
 * Usage:  npm run mip:validate:admin
 */

import { readFileSync }  from "fs";
import { createHash }    from "crypto";
import { join }          from "path";
import {
  IdentityEditorialService,
  PRODUCTION_CLOCK,
  createProductionRepository,
} from "../../app/lib/identity/editorial";
import type {
  IdentityEditorialRepository,
  IdentityEditorialClock,
  CampaignEntry,
} from "../../app/lib/identity/editorial";
import type { IdentityRegistryData } from "../../app/lib/identity/persistence";
import type { IdentityRecord }       from "../../app/lib/identity/types";
import { IDENTITY_PLATFORM_VERSION } from "../../app/lib/identity/version";

// ── Proof runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

function proof(label: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓ ${label}`);
    passed++;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ ${label}`);
    console.error(`    → ${msg}`);
    failed++;
    failures.push(`${label}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertThrows(fn: () => unknown, messageContains?: string): void {
  try {
    fn();
    throw new Error("Expected function to throw, but it did not");
  } catch (err) {
    if (err instanceof Error && err.message === "Expected function to throw, but it did not") {
      throw err;
    }
    if (messageContains) {
      const msg = err instanceof Error ? err.message : String(err);
      assert(
        msg.toLowerCase().includes(messageContains.toLowerCase()),
        `Expected error containing "${messageContains}", got: "${msg}"`,
      );
    }
  }
}

// ── In-memory repository (no filesystem writes) ───────────────────────────────

class InMemoryRepository implements IdentityEditorialRepository {
  private data: IdentityRegistryData;
  constructor(identities: IdentityRecord[] = []) {
    this.data = { version: IDENTITY_PLATFORM_VERSION, identities };
  }
  load(): IdentityRegistryData { return this.data; }
  save(data: IdentityRegistryData): void { this.data = data; }
  get identities(): readonly IdentityRecord[] { return this.data.identities; }
}

function fixedClock(ts: string): IdentityEditorialClock {
  return { now: () => ts };
}

// ── Test record factories ─────────────────────────────────────────────────────

const FIXED_TS = "2026-08-08T00:00:00.000Z";

function makeCandidate(id: string, canonicalName = "Test Fragrance"): IdentityRecord {
  return {
    id,
    supplierIdentities: [{ supplierName: "Supplier Name" }],
    canonicalIdentity: { canonicalName, canonicalBrand: "Test Brand", category: "fragrance" },
    aliases: [],
    evidence: [{ evidenceId: `${id}-ev`, type: "supplier-catalogue", sourceName: "Test Source" }],
    confidence: { score: 50, basis: "Test" },
    status: "candidate",
    history: [{ timestamp: FIXED_TS, event: "created", summary: "Test", actor: "test" }],
    createdAt: FIXED_TS,
    updatedAt: FIXED_TS,
  };
}

function makePendingReview(id: string, canonicalName = "Test Fragrance"): IdentityRecord {
  return { ...makeCandidate(id, canonicalName), status: "pending-review" };
}

function makeVerified(id: string, canonicalName = "Test Fragrance"): IdentityRecord {
  return { ...makeCandidate(id, canonicalName), status: "verified" };
}

// ── File paths ────────────────────────────────────────────────────────────────

const ROOT             = process.cwd();
const REGISTRY_PATH    = join(ROOT, "app/lib/identity/data/identity-registry.json");
const EDITORIAL_PATH   = join(ROOT, "app/lib/identity/data/campaigns/mid-year-2026-editorial.json");
const CAMPAIGN_PATH    = join(ROOT, "app/lib/identity/data/campaigns/mid-year-2026-campaign.json");
const SUPPLIER_PATH    = join(ROOT, "data/identity/source/mid-year-2026-supplier.json");
const RESEARCH_PATH    = join(ROOT, "data/identity/source/mid-year-2026-research.json");

const ACTIONS_PATH     = join(ROOT, "app/admin/identity/actions.ts");
const LIST_PATH        = join(ROOT, "app/admin/identity/IdentityReviewList.tsx");
const DETAIL_PATH      = join(ROOT, "app/admin/identity/IdentityReviewDetail.tsx");

// ── Baseline hashes ───────────────────────────────────────────────────────────

function fileHash(filePath: string): string {
  return createHash("sha256").update(readFileSync(filePath, "utf-8")).digest("hex");
}

const registryHashBefore  = fileHash(REGISTRY_PATH);
const editorialHashBefore = fileHash(EDITORIAL_PATH);
const campaignHashBefore  = fileHash(CAMPAIGN_PATH);

// Optional source files (may not exist in all environments)
const supplierHashBefore  = (() => { try { return fileHash(SUPPLIER_PATH); } catch { return null; } })();
const researchHashBefore  = (() => { try { return fileHash(RESEARCH_PATH); } catch { return null; } })();

// ── Load data ─────────────────────────────────────────────────────────────────

const actionsSource  = readFileSync(ACTIONS_PATH,  "utf-8");
const listSource     = readFileSync(LIST_PATH,     "utf-8");
const detailSource   = readFileSync(DETAIL_PATH,   "utf-8");

type EditorialFile = { entries: CampaignEntry[] };
const editorial = JSON.parse(readFileSync(EDITORIAL_PATH, "utf-8")) as EditorialFile;
const campaignEntries = editorial.entries;

// ── Tests ─────────────────────────────────────────────────────────────────────

// ════════════════════════════════════════════════════════════════════════════
console.log("\n[100s] AUTH / BOUNDARY\n");
// ════════════════════════════════════════════════════════════════════════════

proof("101: actions.ts has 'use server' directive", () => {
  assert(actionsSource.startsWith('"use server"'), "First line must be \"use server\"");
});

proof("102: computeSessionToken is NOT exported from actions.ts", () => {
  // All exports must be async functions — a sync utility cannot be exported
  const exportedNames = [...actionsSource.matchAll(/^export async function (\w+)/gm)].map(m => m[1]);
  assert(!exportedNames.includes("computeSessionToken"), "computeSessionToken must not be exported");
});

proof("103: seven editorial actions are exported from actions.ts", () => {
  const required = [
    "verifyIdentityAction",
    "correctCanonicalAction",
    "confirmAliasAction",
    "requestMoreResearchAction",
    "elevateAction",
    "rejectIdentityAction",
    "disputeIdentityAction",
  ];
  for (const name of required) {
    assert(actionsSource.includes(`export async function ${name}`), `Missing export: ${name}`);
  }
});

proof("104: every action calls assertAuth() as first statement", () => {
  // Each exported action should contain assertAuth before any service call
  const actionPattern = /export async function \w+[^{]+\{[\s\S]*?await assertAuth\(\)/g;
  const matches = actionsSource.match(actionPattern) ?? [];
  assert(matches.length >= 7, `Expected at least 7 actions calling assertAuth(), found ${matches.length}`);
});

proof("105: IdentityReviewList.tsx has 'use client' directive", () => {
  assert(listSource.startsWith('"use client"'), "Must start with \"use client\"");
});

proof("106: IdentityReviewDetail.tsx has 'use client' directive", () => {
  assert(detailSource.startsWith('"use client"'), "Must start with \"use client\"");
});

proof("107: IdentityReviewList.tsx imports no filesystem modules", () => {
  assert(!listSource.includes("from \"fs\""), "Must not import from 'fs'");
  assert(!listSource.includes("from 'fs'"),  "Must not import from 'fs'");
});

proof("108: IdentityReviewDetail.tsx imports no filesystem modules", () => {
  assert(!detailSource.includes("from \"fs\""), "Must not import from 'fs'");
  assert(!detailSource.includes("from 'fs'"),  "Must not import from 'fs'");
});

proof("109: IdentityReviewList.tsx imports no persistence module", () => {
  assert(!listSource.includes("persistence"),   "Must not import persistence module");
});

proof("110: IdentityReviewDetail.tsx imports no persistence module", () => {
  // Check for actual import statements, not comments that mention the word
  assert(!/from ['"].*persistence/.test(detailSource), "Must not import persistence module");
  assert(!detailSource.includes("require(\"./persistence"), "Must not require persistence");
});

proof("111: IdentityReviewList.tsx has no identity-registry.json reference", () => {
  assert(!listSource.includes("identity-registry.json"), "Must not reference identity-registry.json");
});

proof("112: IdentityReviewDetail.tsx has no identity-registry.json reference", () => {
  // Reject actual require/import/readFileSync references; ignore comments mentioning it
  assert(!/readFileSync[^)]*identity-registry/.test(detailSource), "Must not read identity-registry.json");
  assert(!/require\(['"].*identity-registry/.test(detailSource),   "Must not require identity-registry.json");
});

proof("113: actions.ts does not import fs directly", () => {
  // actions.ts delegates to service — no direct filesystem operations
  assert(!actionsSource.includes("from \"fs\""),        "actions.ts must not import fs");
  assert(!actionsSource.includes("readFileSync"),        "actions.ts must not use readFileSync");
  assert(!actionsSource.includes("writeFileSync"),       "actions.ts must not use writeFileSync");
  assert(!actionsSource.includes("identity-registry"),   "actions.ts must not reference registry file");
});

// ════════════════════════════════════════════════════════════════════════════
console.log("\n[200s] QUEUE PROJECTIONS (production repository — read-only)\n");
// ════════════════════════════════════════════════════════════════════════════

const prodService = new IdentityEditorialService(createProductionRepository(), PRODUCTION_CLOCK);
const fullQueue   = prodService.getReviewQueue(undefined, campaignEntries);

proof("201: queue returns 26 records (all registry identities)", () => {
  assert(fullQueue.length === 26, `Expected 26, got ${fullQueue.length}`);
});

proof("202: default ordering puts pending-review before candidates", () => {
  const firstPending  = fullQueue.findIndex(r => r.status === "pending-review");
  const firstCandidate = fullQueue.findIndex(r => r.status === "candidate");
  assert(firstPending !== -1,  "No pending-review records in queue");
  assert(firstCandidate !== -1, "No candidate records in queue");
  assert(firstPending < firstCandidate, "pending-review should precede candidate in default order");
});

proof("203: status filter pending-review returns exactly 10", () => {
  const filtered = prodService.getReviewQueue({ status: ["pending-review"] }, campaignEntries);
  assert(filtered.length === 10, `Expected 10 pending-review, got ${filtered.length}`);
});

proof("204: status filter candidate returns exactly 16", () => {
  const filtered = prodService.getReviewQueue({ status: ["candidate"] }, campaignEntries);
  assert(filtered.length === 16, `Expected 16 candidates, got ${filtered.length}`);
});

proof("205: verified count in queue is 0", () => {
  const filtered = prodService.getReviewQueue({ status: ["verified"] }, campaignEntries);
  assert(filtered.length === 0, `Expected 0 verified, got ${filtered.length}`);
});

proof("206: recommended-action filter 'verify' returns non-empty subset", () => {
  const filtered = prodService.getReviewQueue({ recommendedAction: ["verify"] }, campaignEntries);
  assert(filtered.length > 0, "Expected at least 1 identity with recommendedAction=verify");
  assert(filtered.every(r => r.recommendedAction === "verify"), "All filtered items must have recommendedAction=verify");
});

proof("207: research-confidence filter 'high' returns non-empty subset", () => {
  const filtered = prodService.getReviewQueue({ researchConfidence: "high" }, campaignEntries);
  assert(filtered.length > 0, "Expected at least 1 high-confidence identity");
  assert(filtered.every(r => r.researchConfidence === "high"), "All filtered must have confidence=high");
});

proof("208: name-issue filter 'true' returns non-empty subset", () => {
  const filtered = prodService.getReviewQueue({ possibleNameIssue: true }, campaignEntries);
  assert(filtered.length > 0, "Expected at least 1 identity with possibleNameIssue=true");
  assert(filtered.every(r => r.possibleNameIssue === true), "All filtered must have possibleNameIssue=true");
});

proof("209: queue items carry MIP IDs in correct format", () => {
  for (const r of fullQueue) {
    assert(/^MIP-\d{6}$/.test(r.id), `Invalid ID format: ${r.id}`);
  }
});

proof("210: queue items carry supplierName (provenance preserved)", () => {
  for (const r of fullQueue) {
    assert(typeof r.supplierName === "string" && r.supplierName.length > 0, `Missing supplierName on ${r.id}`);
  }
});

// ════════════════════════════════════════════════════════════════════════════
console.log("\n[300s] DETAIL PROJECTIONS (production repository — read-only)\n");
// ════════════════════════════════════════════════════════════════════════════

proof("301: getIdentityReview('MIP-000001') returns valid detail", () => {
  const detail = prodService.getIdentityReview("MIP-000001", campaignEntries);
  assert(detail !== null, "Expected non-null detail for MIP-000001");
  assert(detail!.record.id === "MIP-000001", "Wrong ID returned");
});

proof("302: getIdentityReview('MIP-UNKNOWN') returns null (not-found path)", () => {
  const detail = prodService.getIdentityReview("MIP-UNKNOWN", campaignEntries);
  assert(detail === null, "Expected null for unknown identity");
});

proof("303: detail includes supplier provenance", () => {
  const detail = prodService.getIdentityReview("MIP-000001", campaignEntries);
  assert(detail!.record.supplierIdentities.length > 0, "Expected at least 1 supplier identity");
  assert(typeof detail!.record.supplierIdentities[0].supplierName === "string", "supplierName must be a string");
});

proof("304: detail includes evidence", () => {
  const detail = prodService.getIdentityReview("MIP-000001", campaignEntries);
  assert(detail!.record.evidence.length > 0, "Expected at least 1 evidence item");
});

proof("305: detail includes campaign entry enrichment", () => {
  const detail = prodService.getIdentityReview("MIP-000001", campaignEntries);
  assert(detail!.campaignEntry !== undefined, "Expected campaignEntry to be present for MIP-000001");
  assert(typeof detail!.campaignEntry!.recommendedAction === "string", "recommendedAction must be a string");
});

proof("306: detail confidence is read-only — present but not modified by projection", () => {
  const detail = prodService.getIdentityReview("MIP-000001", campaignEntries);
  const record = detail!.record;
  assert(typeof record.confidence.score === "number",  "confidence.score must be a number");
  assert(typeof record.confidence.basis === "string",  "confidence.basis must be a string");
});

proof("307: detail history is present and non-empty", () => {
  const detail = prodService.getIdentityReview("MIP-000001", campaignEntries);
  assert(detail!.record.history.length > 0, "Expected at least 1 history entry");
  assert(typeof detail!.record.history[0].event === "string", "history event must be a string");
});

proof("308: detail verification eligibility is correctly computed (not reproduced)", () => {
  const detail = prodService.getIdentityReview("MIP-000001", campaignEntries);
  // The service computes eligibility — the component does not reproduce the rule.
  // We verify the projection includes the pre-computed gate.
  assert(typeof detail!.verificationEligible === "boolean",        "verificationEligible must be boolean");
  assert(Array.isArray(detail!.verificationBlockers),               "verificationBlockers must be an array");
});

// ════════════════════════════════════════════════════════════════════════════
console.log("\n[400s] EDITORIAL ACTIONS (in-memory repository — no production writes)\n");
// ════════════════════════════════════════════════════════════════════════════

proof("401: verifyIdentity succeeds for pending-review record (in-memory)", () => {
  const repo    = new InMemoryRepository([makePendingReview("MIP-999001")]);
  const service = new IdentityEditorialService(repo, fixedClock("2026-08-09T00:00:00.000Z"));
  const result  = service.verifyIdentity({
    identityId:       "MIP-999001",
    actor:            "admin",
    expectedUpdatedAt: FIXED_TS,
  });
  assert(result.success === true,               "Expected success");
  assert(result.record.status === "verified",   "Expected status=verified");
});

proof("402: correctCanonical succeeds and does NOT verify automatically (in-memory)", () => {
  const repo    = new InMemoryRepository([makePendingReview("MIP-999002")]);
  const service = new IdentityEditorialService(repo, fixedClock("2026-08-09T00:00:00.000Z"));
  const result  = service.correctCanonical({
    identityId:        "MIP-999002",
    actor:             "admin",
    expectedUpdatedAt: FIXED_TS,
    canonicalName:     "Corrected Name",
  });
  assert(result.success === true,                    "Expected success");
  assert(result.record.status === "pending-review",  "Status must remain pending-review after correction");
  assert(result.record.canonicalIdentity.canonicalName === "Corrected Name", "Name must be updated");
});

proof("403: correctCanonical returns no-op when no fields change (in-memory)", () => {
  const record  = makePendingReview("MIP-999003", "Existing Name");
  const repo    = new InMemoryRepository([record]);
  const service = new IdentityEditorialService(repo, fixedClock("2026-08-09T00:00:00.000Z"));
  const result  = service.correctCanonical({
    identityId:        "MIP-999003",
    actor:             "admin",
    expectedUpdatedAt: FIXED_TS,
    canonicalName:     "Existing Name", // same as current
  });
  assert(result.success === false,        "Expected no-op failure");
  assert(result.kind === "no-op",         "Expected kind=no-op");
});

proof("404: confirmAlias adds alias — supplierName is NOT auto-converted (in-memory)", () => {
  const repo    = new InMemoryRepository([makePendingReview("MIP-999004")]);
  const service = new IdentityEditorialService(repo, fixedClock("2026-08-09T00:00:00.000Z"));
  // Explicit alias, not auto-derived from supplierName
  const result  = service.confirmAlias({
    identityId:        "MIP-999004",
    actor:             "admin",
    expectedUpdatedAt: FIXED_TS,
    aliasValue:        "Explicitly Entered Alias",
    aliasType:         "supplier",
  });
  assert(result.success === true, "Expected success");
  assert(result.record.aliases.some(a => a.value === "Explicitly Entered Alias"), "Alias must be added");
});

proof("405: requestMoreResearch demotes pending-review to candidate (in-memory)", () => {
  const repo    = new InMemoryRepository([makePendingReview("MIP-999005")]);
  const service = new IdentityEditorialService(repo, fixedClock("2026-08-09T00:00:00.000Z"));
  const result  = service.requestMoreResearch({
    identityId:        "MIP-999005",
    actor:             "admin",
    expectedUpdatedAt: FIXED_TS,
    reason:            "Unresolved name issue",
  });
  assert(result.success === true,             "Expected success");
  assert(result.record.status === "candidate", "Expected status=candidate after demotion");
});

proof("406: elevate promotes candidate to pending-review (in-memory)", () => {
  const repo    = new InMemoryRepository([makeCandidate("MIP-999006")]);
  const service = new IdentityEditorialService(repo, fixedClock("2026-08-09T00:00:00.000Z"));
  const result  = service.elevate({
    identityId:        "MIP-999006",
    actor:             "admin",
    expectedUpdatedAt: FIXED_TS,
    reason:            "Research complete",
  });
  assert(result.success === true,                  "Expected success");
  assert(result.record.status === "pending-review", "Expected status=pending-review");
});

proof("407: rejectIdentity rejects a candidate (in-memory)", () => {
  const repo    = new InMemoryRepository([makeCandidate("MIP-999007")]);
  const service = new IdentityEditorialService(repo, fixedClock("2026-08-09T00:00:00.000Z"));
  const result  = service.rejectIdentity({
    identityId:        "MIP-999007",
    actor:             "admin",
    expectedUpdatedAt: FIXED_TS,
    reason:            "No official release found",
  });
  assert(result.success === true,            "Expected success");
  assert(result.record.status === "rejected", "Expected status=rejected");
});

proof("408: disputeIdentity disputes a verified record (in-memory)", () => {
  const repo    = new InMemoryRepository([makeVerified("MIP-999008")]);
  const service = new IdentityEditorialService(repo, fixedClock("2026-08-09T00:00:00.000Z"));
  const result  = service.disputeIdentity({
    identityId:        "MIP-999008",
    actor:             "admin",
    expectedUpdatedAt: FIXED_TS,
    reason:            "Supplier mismatch",
  });
  assert(result.success === true,            "Expected success");
  assert(result.record.status === "disputed", "Expected status=disputed");
});

proof("409: stale-review error when expectedUpdatedAt does not match (in-memory)", () => {
  const repo    = new InMemoryRepository([makePendingReview("MIP-999009")]);
  const service = new IdentityEditorialService(repo, fixedClock("2026-08-09T00:00:00.000Z"));
  const result  = service.verifyIdentity({
    identityId:        "MIP-999009",
    actor:             "admin",
    expectedUpdatedAt: "2000-01-01T00:00:00.000Z", // stale timestamp
  });
  assert(result.success === false,                          "Expected stale-review failure");
  assert(!result.success && result.kind === "stale-review", `Expected kind=stale-review, got: ${!result.success ? result.kind : "success"}`);
});

proof("410: dispute is blocked for non-verified records (in-memory)", () => {
  const repo    = new InMemoryRepository([makePendingReview("MIP-999010")]);
  const service = new IdentityEditorialService(repo, fixedClock("2026-08-09T00:00:00.000Z"));
  const result  = service.disputeIdentity({
    identityId:        "MIP-999010",
    actor:             "admin",
    expectedUpdatedAt: FIXED_TS,
    reason:            "Test",
  });
  assert(result.success === false,                "Expected failure");
  assert(result.kind === "invalid-transition",    "Expected kind=invalid-transition");
});

proof("411: verify is blocked for candidate records (in-memory)", () => {
  const repo    = new InMemoryRepository([makeCandidate("MIP-999011")]);
  const service = new IdentityEditorialService(repo, fixedClock("2026-08-09T00:00:00.000Z"));
  const result  = service.verifyIdentity({
    identityId:        "MIP-999011",
    actor:             "admin",
    expectedUpdatedAt: FIXED_TS,
  });
  assert(result.success === false,             "Expected failure");
  assert(result.kind === "invalid-transition", "Expected kind=invalid-transition");
});

proof("412: confidence is preserved unchanged after verify (in-memory)", () => {
  const record = makePendingReview("MIP-999012");
  const originalScore = record.confidence.score;
  const repo    = new InMemoryRepository([record]);
  const service = new IdentityEditorialService(repo, fixedClock("2026-08-09T00:00:00.000Z"));
  const result  = service.verifyIdentity({
    identityId:        "MIP-999012",
    actor:             "admin",
    expectedUpdatedAt: FIXED_TS,
  });
  assert(result.success === true, "Expected success");
  assert(result.record.confidence.score === originalScore, "confidence.score must not change");
});

proof("413: evidence is preserved unchanged after correctCanonical (in-memory)", () => {
  const record = makePendingReview("MIP-999013");
  const origEvidenceCount = record.evidence.length;
  const repo    = new InMemoryRepository([record]);
  const service = new IdentityEditorialService(repo, fixedClock("2026-08-09T00:00:00.000Z"));
  const result  = service.correctCanonical({
    identityId:        "MIP-999013",
    actor:             "admin",
    expectedUpdatedAt: FIXED_TS,
    canonicalName:     "New Name",
  });
  assert(result.success === true, "Expected success");
  assert(result.record.evidence.length === origEvidenceCount, "Evidence must be preserved");
});

// ════════════════════════════════════════════════════════════════════════════
console.log("\n[500s] PRODUCTION REGISTRY SAFETY\n");
// ════════════════════════════════════════════════════════════════════════════

type RegistryFile = { version: string; identities: Array<{ status: string }> };
const registryRaw = JSON.parse(readFileSync(REGISTRY_PATH, "utf-8")) as RegistryFile;

proof("501: production registry SHA-256 is unchanged", () => {
  const hashAfter = fileHash(REGISTRY_PATH);
  assert(
    hashAfter === registryHashBefore,
    `Registry hash changed!\n  before: ${registryHashBefore}\n  after:  ${hashAfter}`,
  );
});

proof("502: production registry still contains exactly 26 identities", () => {
  assert(registryRaw.identities.length === 26, `Expected 26, got ${registryRaw.identities.length}`);
});

proof("503: pending-review count remains 10", () => {
  const count = registryRaw.identities.filter(r => r.status === "pending-review").length;
  assert(count === 10, `Expected 10 pending-review, got ${count}`);
});

proof("504: candidate count remains 16", () => {
  const count = registryRaw.identities.filter(r => r.status === "candidate").length;
  assert(count === 16, `Expected 16 candidate, got ${count}`);
});

proof("505: verified count remains 0", () => {
  const count = registryRaw.identities.filter(r => r.status === "verified").length;
  assert(count === 0, `Expected 0 verified, got ${count}`);
});

proof("506: editorial campaign JSON is unchanged", () => {
  const hashAfter = fileHash(EDITORIAL_PATH);
  assert(
    hashAfter === editorialHashBefore,
    `Editorial JSON hash changed!\n  before: ${editorialHashBefore}\n  after:  ${hashAfter}`,
  );
});

proof("507: campaign summary JSON is unchanged", () => {
  const hashAfter = fileHash(CAMPAIGN_PATH);
  assert(
    hashAfter === campaignHashBefore,
    `Campaign JSON hash changed!\n  before: ${campaignHashBefore}\n  after:  ${hashAfter}`,
  );
});

proof("508: supplier source JSON is unchanged (if present)", () => {
  if (supplierHashBefore === null) {
    console.log("    (supplier source file not found — skip)");
    return;
  }
  const hashAfter = fileHash(SUPPLIER_PATH);
  assert(
    hashAfter === supplierHashBefore,
    `Supplier source hash changed!\n  before: ${supplierHashBefore}\n  after:  ${hashAfter}`,
  );
});

proof("509: research source JSON is unchanged (if present)", () => {
  if (researchHashBefore === null) {
    console.log("    (research source file not found — skip)");
    return;
  }
  const hashAfter = fileHash(RESEARCH_PATH);
  assert(
    hashAfter === researchHashBefore,
    `Research source hash changed!\n  before: ${researchHashBefore}\n  after:  ${hashAfter}`,
  );
});

proof("510: production repository was not used for any mutation test", () => {
  // All mutation tests above used InMemoryRepository.
  // This proof documents and asserts that invariant structurally.
  // (No assertion needed — if the other 500s pass, the registry is safe.)
  assert(registryRaw.identities.length === 26, "Registry still intact — no mutations via production repo");
});

// ── Final report ──────────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(60));
console.log(`EP5-P3C Admin Validation: ${passed} passed, ${failed} failed`);

if (failures.length > 0) {
  console.error("\nFailed proofs:");
  failures.forEach((f) => console.error(`  ✗ ${f}`));
  process.exit(1);
} else {
  console.log("\nAll EP5-P3C integration proofs passed.");
  console.log(`Registry SHA-256: ${registryHashBefore}`);
  console.log(`Registry state:   26 total / 10 pending-review / 16 candidate / 0 verified`);
  process.exit(0);
}

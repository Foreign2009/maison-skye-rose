/**
 * EP5-P3B — Identity Editorial Transaction Service Validation Suite
 *
 * 100 deterministic proofs covering the editorial domain.
 * All tests use in-memory repository — the real registry is NEVER written.
 *
 * Proof sections:
 *   [1xx] Editorial Domain Types
 *   [2xx] Knowledge Eligibility Contract
 *   [3xx] Verification Gate
 *   [4xx] Canonical Correction
 *   [5xx] Alias Confirmation
 *   [6xx] Request More Research
 *   [7xx] Candidate Elevation
 *   [8xx] Rejection
 *   [9xx] Dispute
 *   [10xx] Optimistic Concurrency
 *   [11xx] Transaction Integrity
 *   [12xx] Review Queue Projection
 *   [13xx] Confidence Preservation
 *   [14xx] Evidence Immutability
 *   [15xx] Real Registry Protection
 *   [16xx] Platform Isolation
 */

import { readFileSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";

import type {
  IdentityRecord,
  IdentityId,
  IdentityHistoryEventType,
} from "../../app/lib/identity/types";
import { IDENTITY_PLATFORM_VERSION } from "../../app/lib/identity/version";
import { isIdentityKnowledgeEligible } from "../../app/lib/identity/eligibility";
import type { IdentityRegistryData } from "../../app/lib/identity/persistence";

import {
  IdentityEditorialService,
  StaleReviewError,
  PRODUCTION_CLOCK,
  createProductionRepository,
  type IdentityEditorialClock,
  type IdentityEditorialRepository,
  type EditorialResult,
  type CorrectCanonicalInput,
} from "../../app/lib/identity/editorial/index";

// ── Proof runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function proof(label: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓  ${label}`);
    passed++;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ✗  ${label}`);
    console.error(`       ${msg}`);
    failed++;
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
}

function assertThrows(fn: () => unknown, ErrorClass: new (...a: unknown[]) => Error): void {
  try {
    fn();
    throw new Error(`FAIL: expected ${ErrorClass.name} to be thrown but nothing was thrown`);
  } catch (err) {
    if (!(err instanceof ErrorClass)) {
      throw new Error(
        `FAIL: expected ${ErrorClass.name} but got ${err instanceof Error ? err.constructor.name : String(err)}`,
      );
    }
  }
}

function assertThrowsMessage(fn: () => unknown, substring: string): void {
  try {
    fn();
    throw new Error(`FAIL: expected an error containing "${substring}" but nothing was thrown`);
  } catch (err) {
    if (err instanceof Error && err.message.includes("FAIL: expected")) throw err;
    const msg = err instanceof Error ? err.message : String(err);
    if (!msg.includes(substring)) {
      throw new Error(`FAIL: expected error containing "${substring}" but got: "${msg}"`);
    }
  }
}

// ── In-memory repository ──────────────────────────────────────────────────────

class InMemoryRepository implements IdentityEditorialRepository {
  private data: IdentityRegistryData;

  constructor(identities: IdentityRecord[] = []) {
    this.data = { version: IDENTITY_PLATFORM_VERSION, identities };
  }

  load(): IdentityRegistryData {
    return this.data;
  }

  save(data: IdentityRegistryData): void {
    this.data = data;
  }

  get identities(): readonly IdentityRecord[] {
    return this.data.identities;
  }
}

// ── Fixed clock ───────────────────────────────────────────────────────────────

function fixedClock(ts: string): IdentityEditorialClock {
  return { now: () => ts };
}

const TS = "2026-08-08T00:00:00.000Z";
const TS2 = "2026-08-09T00:00:00.000Z";

// ── Fixture helpers ───────────────────────────────────────────────────────────

function makeRecord(overrides: Partial<IdentityRecord> & { id: IdentityId }): IdentityRecord {
  return {
    id: overrides.id,
    supplierIdentities: overrides.supplierIdentities ?? [
      { supplierName: "Test Supplier Product", supplierCategory: "L" },
    ],
    canonicalIdentity: overrides.canonicalIdentity ?? {
      canonicalName: "Test Fragrance",
      canonicalBrand: "Test Brand",
      category: "fragrance",
    },
    aliases: overrides.aliases ?? [],
    evidence: overrides.evidence ?? [],
    confidence: overrides.confidence ?? { score: 60, basis: "fixture" },
    status: overrides.status ?? "candidate",
    history: overrides.history ?? [],
    createdAt: overrides.createdAt ?? TS,
    updatedAt: overrides.updatedAt ?? TS,
  };
}

function makePendingRecord(id: IdentityId): IdentityRecord {
  return makeRecord({
    id,
    status: "pending-review",
    canonicalIdentity: {
      canonicalName: "Verified Fragrance Name",
      canonicalBrand: "Verified Brand",
      category: "fragrance",
    },
  });
}

function makeCandidateRecord(id: IdentityId): IdentityRecord {
  return makeRecord({
    id,
    status: "candidate",
    canonicalIdentity: {
      canonicalName: "Candidate Fragrance",
      category: "fragrance",
      // no canonicalBrand — typical for candidates
    },
  });
}

function makeVerifiedRecord(id: IdentityId): IdentityRecord {
  return makeRecord({
    id,
    status: "verified",
    canonicalIdentity: {
      canonicalName: "Verified Fragrance",
      canonicalBrand: "Verified Brand",
      category: "fragrance",
    },
  });
}

function makeService(
  records: IdentityRecord[],
  clockTs: string = TS,
): { service: IdentityEditorialService; repo: InMemoryRepository } {
  const repo = new InMemoryRepository(records);
  const clock = fixedClock(clockTs);
  return { service: new IdentityEditorialService(repo, clock), repo };
}

// ── Real registry hash (computed BEFORE any tests run) ───────────────────────

const REGISTRY_PATH = join(
  process.cwd(),
  "app",
  "lib",
  "identity",
  "data",
  "identity-registry.json",
);

const registryHashBefore = createHash("sha256")
  .update(readFileSync(REGISTRY_PATH, "utf-8"))
  .digest("hex");

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: Editorial Domain Types
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 1] Editorial Domain Types\n");

proof("101: IdentityHistoryEventType now includes 'rejected'", () => {
  const events: IdentityHistoryEventType[] = ["rejected"];
  assert(events[0] === "rejected", "rejected should be a valid event type");
});

proof("102: IdentityHistoryEventType now includes 'candidate-promoted'", () => {
  const events: IdentityHistoryEventType[] = ["candidate-promoted"];
  assert(events[0] === "candidate-promoted", "candidate-promoted should be a valid event type");
});

proof("103: IdentityHistoryEventType now includes 'candidate-demoted'", () => {
  const events: IdentityHistoryEventType[] = ["candidate-demoted"];
  assert(events[0] === "candidate-demoted", "candidate-demoted should be a valid event type");
});

proof("104: StaleReviewError is an Error subclass", () => {
  const err = new StaleReviewError("MIP-000001", "2026-01-01T00:00:00.000Z", "2026-01-02T00:00:00.000Z");
  assert(err instanceof Error, "StaleReviewError should be an Error");
  assert(err instanceof StaleReviewError, "StaleReviewError should be a StaleReviewError");
  assert(err.name === "StaleReviewError", `name should be StaleReviewError, got ${err.name}`);
  assert(err.identityId === "MIP-000001", "identityId should be set");
});

proof("105: PRODUCTION_CLOCK.now() returns an ISO 8601 string", () => {
  const ts = PRODUCTION_CLOCK.now();
  assert(typeof ts === "string", "PRODUCTION_CLOCK.now() should return a string");
  assert(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(ts), `should be ISO 8601, got: ${ts}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: Knowledge Eligibility Contract
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 2] Knowledge Eligibility Contract\n");

proof("201: verified record is knowledge-eligible", () => {
  const record = makeVerifiedRecord("MIP-000001");
  assert(isIdentityKnowledgeEligible(record), "verified should be eligible");
});

proof("202: candidate record is NOT knowledge-eligible", () => {
  const record = makeCandidateRecord("MIP-000001");
  assert(!isIdentityKnowledgeEligible(record), "candidate should not be eligible");
});

proof("203: pending-review record is NOT knowledge-eligible", () => {
  const record = makePendingRecord("MIP-000001");
  assert(!isIdentityKnowledgeEligible(record), "pending-review should not be eligible");
});

proof("204: disputed record is NOT knowledge-eligible", () => {
  const record = makeRecord({ id: "MIP-000001", status: "disputed" });
  assert(!isIdentityKnowledgeEligible(record), "disputed should not be eligible");
});

proof("205: deprecated record is NOT knowledge-eligible", () => {
  const record = makeRecord({ id: "MIP-000001", status: "deprecated" });
  assert(!isIdentityKnowledgeEligible(record), "deprecated should not be eligible");
});

proof("206: rejected record is NOT knowledge-eligible", () => {
  const record = makeRecord({ id: "MIP-000001", status: "rejected" });
  assert(!isIdentityKnowledgeEligible(record), "rejected should not be eligible");
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3: Verification Gate
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 3] Verification Gate\n");

proof("301: pending-review with brand and clean name verifies successfully", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  const result = service.verifyIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
  });
  assert(result.success, `should succeed, got: ${result.success ? "" : (result as any).message}`);
  assert((result as any).record.status === "verified", "status should be verified");
});

proof("302: disputed record can be verified", () => {
  const rec = makeRecord({
    id: "MIP-000001",
    status: "disputed",
    canonicalIdentity: { canonicalName: "Clean Name", canonicalBrand: "Brand", category: "fragrance" },
  });
  const { service } = makeService([rec]);
  const result = service.verifyIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
  });
  assert(result.success, `disputed → verified should succeed: ${result.success ? "" : (result as any).message}`);
});

proof("303: candidate cannot be directly verified", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.verifyIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
  });
  assert(!result.success, "candidate should not be directly verifiable");
  assert((result as any).kind === "invalid-transition", `should be invalid-transition, got ${(result as any).kind}`);
});

proof("304: already-verified cannot be re-verified", () => {
  const rec = makeVerifiedRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.verifyIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
  });
  assert(!result.success, "verified should not be re-verified");
  assert((result as any).kind === "invalid-transition", "should be invalid-transition");
});

proof("305: verification blocked when canonicalBrand absent", () => {
  const rec = makeRecord({
    id: "MIP-000001",
    status: "pending-review",
    canonicalIdentity: { canonicalName: "Clean Name", category: "fragrance" },
  });
  const { service } = makeService([rec]);
  const result = service.verifyIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
  });
  assert(!result.success, "missing brand should block verification");
  assert((result as any).kind === "validation", "should be validation error");
});

proof("306: verification blocked when name contains ' / ' ambiguity marker", () => {
  const rec = makeRecord({
    id: "MIP-000001",
    status: "pending-review",
    canonicalIdentity: {
      canonicalName: "Fragrance A / Fragrance B",
      canonicalBrand: "Brand",
      category: "fragrance",
    },
  });
  const { service } = makeService([rec]);
  const result = service.verifyIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
  });
  assert(!result.success, "ambiguous name should block verification");
  assert((result as any).kind === "validation", "should be validation error");
});

proof("307: verification blocked when name contains '(Note:' marker", () => {
  const rec = makeRecord({
    id: "MIP-000001",
    status: "pending-review",
    canonicalIdentity: {
      canonicalName: "Fragrance (Note: possibly rebranded)",
      canonicalBrand: "Brand",
      category: "fragrance",
    },
  });
  const { service } = makeService([rec]);
  const result = service.verifyIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
  });
  assert(!result.success, "Note marker should block verification");
  assert((result as any).kind === "validation", "should be validation error");
});

proof("308: verification blocked when name contains '(unverified)' marker", () => {
  const rec = makeRecord({
    id: "MIP-000001",
    status: "pending-review",
    canonicalIdentity: {
      canonicalName: "Fragrance Name (unverified)",
      canonicalBrand: "Brand",
      category: "fragrance",
    },
  });
  const { service } = makeService([rec]);
  const result = service.verifyIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
  });
  assert(!result.success, "unverified marker should block verification");
  assert((result as any).kind === "validation", "should be validation error");
});

proof("309: empty actor blocks verification", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.verifyIdentity({
    identityId: "MIP-000001",
    actor: "   ",
    expectedUpdatedAt: rec.updatedAt,
  });
  assert(!result.success, "empty actor should block verification");
  assert((result as any).kind === "invalid-input", "should be invalid-input");
});

proof("310: verified record history appends 'verified' event", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service, repo } = makeService([rec], TS2);
  service.verifyIdentity({ identityId: "MIP-000001", actor: "admin", expectedUpdatedAt: rec.updatedAt });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  const lastEntry = updated.history[updated.history.length - 1];
  assert(lastEntry.event === "verified", `last event should be 'verified', got '${lastEntry.event}'`);
  assert(lastEntry.actor === "admin", "actor should be 'admin'");
  assert(lastEntry.timestamp === TS2, `timestamp should be ${TS2}`);
});

proof("311: verified record updatedAt equals clock now", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service, repo } = makeService([rec], TS2);
  service.verifyIdentity({ identityId: "MIP-000001", actor: "admin", expectedUpdatedAt: rec.updatedAt });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.updatedAt === TS2, `updatedAt should be ${TS2}, got ${updated.updatedAt}`);
});

proof("312: verification reason appears in history summary when provided", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service, repo } = makeService([rec], TS2);
  service.verifyIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Confirmed by brand website",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  const lastEntry = updated.history[updated.history.length - 1];
  assert(
    lastEntry.summary.includes("Confirmed by brand website"),
    `reason should appear in summary, got: "${lastEntry.summary}"`,
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4: Canonical Correction
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 4] Canonical Correction\n");

proof("401: canonical name can be corrected on pending-review record", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  const result = service.correctCanonical({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    canonicalName: "Corrected Fragrance Name",
  });
  assert(result.success, `should succeed: ${result.success ? "" : (result as any).message}`);
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(
    updated.canonicalIdentity.canonicalName === "Corrected Fragrance Name",
    `canonicalName should be updated, got: "${updated.canonicalIdentity.canonicalName}"`,
  );
});

proof("402: canonical brand can be added to candidate record", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  const result = service.correctCanonical({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    canonicalBrand: "New Brand",
  });
  assert(result.success, `should succeed: ${result.success ? "" : (result as any).message}`);
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.canonicalIdentity.canonicalBrand === "New Brand", "brand should be set");
});

proof("403: launchYear can be set", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.correctCanonical({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    launchYear: 2018,
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.canonicalIdentity.launchYear === 2018, "launchYear should be 2018");
});

proof("404: launchYear can be cleared with null", () => {
  const rec = makeRecord({
    id: "MIP-000001",
    canonicalIdentity: { canonicalName: "Frag", canonicalBrand: "Brand", category: "fragrance", launchYear: 2015 },
  });
  const { service, repo } = makeService([rec]);
  const input: CorrectCanonicalInput = {
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    launchYear: null,
  };
  const result = service.correctCanonical(input);
  assert(result.success, `should succeed: ${result.success ? "" : (result as any).message}`);
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.canonicalIdentity.launchYear === undefined, "launchYear should be cleared");
});

proof("405: marketedGender can be set", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.correctCanonical({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    marketedGender: "female",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.canonicalIdentity.marketedGender === "female", "marketedGender should be female");
});

proof("406: marketedGender can be cleared with null", () => {
  const rec = makeRecord({
    id: "MIP-000001",
    canonicalIdentity: { canonicalName: "Frag", canonicalBrand: "Brand", category: "fragrance", marketedGender: "male" },
  });
  const { service, repo } = makeService([rec]);
  const input: CorrectCanonicalInput = {
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    marketedGender: null,
  };
  service.correctCanonical(input);
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.canonicalIdentity.marketedGender === undefined, "marketedGender should be cleared");
});

proof("407: no-op rejected when all values identical", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.correctCanonical({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    canonicalName: "Verified Fragrance Name",
    canonicalBrand: "Verified Brand",
  });
  assert(!result.success, "no-op should fail");
  assert((result as any).kind === "no-op", `should be no-op, got ${(result as any).kind}`);
});

proof("408: correction blocked when new name contains ambiguity marker", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.correctCanonical({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    canonicalName: "Name A / Name B",
  });
  assert(!result.success, "ambiguous name should be rejected");
  assert((result as any).kind === "validation", "should be validation error");
});

proof("409: correction blocked when canonicalName provided as empty string", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.correctCanonical({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    canonicalName: "",
  });
  assert(!result.success, "empty canonicalName should fail");
  assert((result as any).kind === "invalid-input", "should be invalid-input");
});

proof("410: correction blocked when canonicalBrand provided as empty string", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.correctCanonical({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    canonicalBrand: "",
  });
  assert(!result.success, "empty canonicalBrand should fail");
  assert((result as any).kind === "invalid-input", "should be invalid-input");
});

proof("411: launchYear below 1800 rejected", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.correctCanonical({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    launchYear: 1799,
  });
  assert(!result.success, "launchYear 1799 should fail");
  assert((result as any).kind === "invalid-input", "should be invalid-input");
});

proof("412: canonical collision blocked when brand+name+category matches existing verified", () => {
  const recordA = makeRecord({
    id: "MIP-000001",
    status: "verified",
    canonicalIdentity: { canonicalName: "Same Frag", canonicalBrand: "Same Brand", category: "fragrance" },
  });
  const recordB = makeCandidateRecord("MIP-000002");
  const { service } = makeService([recordA, recordB]);
  const result = service.correctCanonical({
    identityId: "MIP-000002",
    actor: "admin",
    expectedUpdatedAt: recordB.updatedAt,
    canonicalName: "Same Frag",
    canonicalBrand: "Same Brand",
  });
  assert(!result.success, "canonical collision should be blocked");
  assert((result as any).kind === "canonical-collision", `should be canonical-collision, got ${(result as any).kind}`);
});

proof("413: correction history appends canonical-name-changed event when name changed", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec], TS2);
  service.correctCanonical({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    canonicalName: "New Name",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  const lastEntry = updated.history[updated.history.length - 1];
  assert(lastEntry.event === "canonical-name-changed", `expected canonical-name-changed, got ${lastEntry.event}`);
  assert(lastEntry.timestamp === TS2, "timestamp should match clock");
});

proof("414: category is always preserved during correction", () => {
  const rec = makeRecord({
    id: "MIP-000001",
    canonicalIdentity: { canonicalName: "Old Name", canonicalBrand: "Brand", category: "home-fragrance" },
  });
  const { service, repo } = makeService([rec]);
  service.correctCanonical({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    canonicalName: "New Name",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.canonicalIdentity.category === "home-fragrance", "category should be preserved");
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5: Alias Confirmation
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 5] Alias Confirmation\n");

proof("501: alias can be added to candidate record", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  const result = service.confirmAlias({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    aliasValue: "Short Alias",
    aliasType: "common",
  });
  assert(result.success, `should succeed: ${result.success ? "" : (result as any).message}`);
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.aliases.length === 1, `should have 1 alias, got ${updated.aliases.length}`);
  assert(updated.aliases[0].value === "Short Alias", "alias value should match");
  assert(updated.aliases[0].type === "common", "alias type should match");
  assert(updated.aliases[0].verified === true, "alias should be marked verified");
});

proof("502: alias can be added to pending-review record", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.confirmAlias({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    aliasValue: "Another Name",
    aliasType: "editorial",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.aliases.length === 1, "should have alias");
});

proof("503: alias actor is recorded as source", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.confirmAlias({
    identityId: "MIP-000001",
    actor: "curator",
    expectedUpdatedAt: rec.updatedAt,
    aliasValue: "An Alias",
    aliasType: "common",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.aliases[0].source === "curator", "actor should be alias source");
});

proof("504: alias createdAt equals clock now", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec], TS2);
  service.confirmAlias({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    aliasValue: "Alias X",
    aliasType: "supplier",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.aliases[0].createdAt === TS2, `alias createdAt should be ${TS2}`);
});

proof("505: duplicate alias (same normalized value) on same record is no-op", () => {
  const rec = makeRecord({
    id: "MIP-000001",
    aliases: [{ value: "My Alias", type: "common", verified: true, source: "admin", createdAt: TS }],
  });
  const { service } = makeService([rec]);
  const result = service.confirmAlias({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    aliasValue: "MY ALIAS", // same after normalization
    aliasType: "common",
  });
  assert(!result.success, "duplicate alias should fail");
  assert((result as any).kind === "no-op", `should be no-op, got ${(result as any).kind}`);
});

proof("506: alias cross-record collision blocked", () => {
  const recA = makeRecord({
    id: "MIP-000001",
    aliases: [{ value: "Shared Alias", type: "supplier", verified: true, source: "admin", createdAt: TS }],
  });
  const recB = makeCandidateRecord("MIP-000002");
  const { service } = makeService([recA, recB]);
  const result = service.confirmAlias({
    identityId: "MIP-000002",
    actor: "admin",
    expectedUpdatedAt: recB.updatedAt,
    aliasValue: "Shared Alias", // same as recA's alias
    aliasType: "common",
  });
  assert(!result.success, "cross-record alias collision should be blocked");
  assert((result as any).kind === "alias-collision", `should be alias-collision, got ${(result as any).kind}`);
});

proof("507: empty alias value blocked", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.confirmAlias({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    aliasValue: "   ",
    aliasType: "common",
  });
  assert(!result.success, "empty alias should fail");
  assert((result as any).kind === "invalid-input", "should be invalid-input");
});

proof("508: alias history appends 'alias-added' event", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.confirmAlias({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    aliasValue: "Another Name",
    aliasType: "historical",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  const lastEntry = updated.history[updated.history.length - 1];
  assert(lastEntry.event === "alias-added", `expected alias-added, got ${lastEntry.event}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6: Request More Research
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 6] Request More Research\n");

proof("601: pending-review demoted to candidate", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  const result = service.requestMoreResearch({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Brand website contradicts supplier data",
  });
  assert(result.success, `should succeed: ${result.success ? "" : (result as any).message}`);
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.status === "candidate", "status should be candidate");
});

proof("602: candidate cannot request more research (already candidate)", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.requestMoreResearch({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Test",
  });
  assert(!result.success, "candidate cannot request more research");
  assert((result as any).kind === "invalid-transition", "should be invalid-transition");
});

proof("603: reason required for request-more-research", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.requestMoreResearch({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "   ",
  });
  assert(!result.success, "empty reason should fail");
  assert((result as any).kind === "invalid-input", "should be invalid-input");
});

proof("604: request-more-research appends 'candidate-demoted' event", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.requestMoreResearch({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Need more evidence",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  const lastEntry = updated.history[updated.history.length - 1];
  assert(lastEntry.event === "candidate-demoted", `expected candidate-demoted, got ${lastEntry.event}`);
  assert(lastEntry.summary.includes("Need more evidence"), "reason should appear in summary");
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7: Candidate Elevation
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 7] Candidate Elevation\n");

proof("701: candidate elevated to pending-review", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  const result = service.elevate({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Research complete, ready for review",
  });
  assert(result.success, `should succeed: ${result.success ? "" : (result as any).message}`);
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.status === "pending-review", "status should be pending-review");
});

proof("702: pending-review cannot be elevated (already pending-review)", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.elevate({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Test",
  });
  assert(!result.success, "pending-review should not be elevatable");
  assert((result as any).kind === "invalid-transition", "should be invalid-transition");
});

proof("703: reason required for elevation", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.elevate({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "",
  });
  assert(!result.success, "empty reason should fail");
  assert((result as any).kind === "invalid-input", "should be invalid-input");
});

proof("704: elevation appends 'candidate-promoted' event", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.elevate({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Research complete",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  const lastEntry = updated.history[updated.history.length - 1];
  assert(lastEntry.event === "candidate-promoted", `expected candidate-promoted, got ${lastEntry.event}`);
  assert(lastEntry.summary.includes("Research complete"), "reason should appear in summary");
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 8: Rejection
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 8] Rejection\n");

proof("801: candidate can be rejected", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  const result = service.rejectIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Not a real distinguishable product",
  });
  assert(result.success, `should succeed: ${result.success ? "" : (result as any).message}`);
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.status === "rejected", "status should be rejected");
});

proof("802: pending-review can be rejected", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.rejectIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Duplicate of another product line",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.status === "rejected", "pending-review should be rejectable");
});

proof("803: disputed can be rejected", () => {
  const rec = makeRecord({ id: "MIP-000001", status: "disputed" });
  const { service, repo } = makeService([rec]);
  service.rejectIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Unresolvable conflict — treating as non-entity",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.status === "rejected", "disputed should be rejectable");
});

proof("804: verified CANNOT be directly rejected (must dispute first)", () => {
  const rec = makeVerifiedRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.rejectIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Trying to reject a verified record",
  });
  assert(!result.success, "verified should not be directly rejectable");
  assert((result as any).kind === "invalid-transition", "should be invalid-transition");
});

proof("805: reason required for rejection", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.rejectIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "",
  });
  assert(!result.success, "empty reason should fail");
  assert((result as any).kind === "invalid-input", "should be invalid-input");
});

proof("806: rejection appends 'rejected' event", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.rejectIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Not a product",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  const lastEntry = updated.history[updated.history.length - 1];
  assert(lastEntry.event === "rejected", `expected rejected, got ${lastEntry.event}`);
});

proof("807: rejected record is not knowledge-eligible", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.rejectIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Not a product",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(!isIdentityKnowledgeEligible(updated), "rejected record should not be knowledge-eligible");
});

proof("808: rejection reason appears in history summary", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.rejectIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Sample supplier entry only",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  const lastEntry = updated.history[updated.history.length - 1];
  assert(
    lastEntry.summary.includes("Sample supplier entry only"),
    `reason should appear in summary, got: "${lastEntry.summary}"`,
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 9: Dispute
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 9] Dispute\n");

proof("901: verified can be disputed", () => {
  const rec = makeVerifiedRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  const result = service.disputeIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "New supplier data contradicts verified canonical name",
  });
  assert(result.success, `should succeed: ${result.success ? "" : (result as any).message}`);
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.status === "disputed", "status should be disputed");
});

proof("902: candidate cannot be disputed (only verified can)", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.disputeIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Test",
  });
  assert(!result.success, "candidate should not be disputable");
  assert((result as any).kind === "invalid-transition", "should be invalid-transition");
});

proof("903: pending-review cannot be disputed", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.disputeIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Test",
  });
  assert(!result.success, "pending-review should not be disputable");
  assert((result as any).kind === "invalid-transition", "should be invalid-transition");
});

proof("904: reason required for dispute", () => {
  const rec = makeVerifiedRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.disputeIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "  ",
  });
  assert(!result.success, "empty reason should fail");
  assert((result as any).kind === "invalid-input", "should be invalid-input");
});

proof("905: dispute appends 'disputed' event with reason", () => {
  const rec = makeVerifiedRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.disputeIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Evidence X contradicts this",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  const lastEntry = updated.history[updated.history.length - 1];
  assert(lastEntry.event === "disputed", `expected disputed, got ${lastEntry.event}`);
  assert(lastEntry.summary.includes("Evidence X contradicts this"), "reason should appear in summary");
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 10: Optimistic Concurrency
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 10] Optimistic Concurrency\n");

proof("1001: stale-review error when expectedUpdatedAt does not match", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.verifyIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: "2024-01-01T00:00:00.000Z", // wrong timestamp
  });
  assert(!result.success, "stale timestamp should fail");
  assert((result as any).kind === "stale-review", `should be stale-review, got ${(result as any).kind}`);
});

proof("1002: stale-review message contains expected and actual timestamps", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service } = makeService([rec]);
  const result = service.verifyIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: "2024-01-01T00:00:00.000Z",
  });
  const message = (result as any).message as string;
  assert(message.includes("2024-01-01T00:00:00.000Z"), "message should include expected timestamp");
  assert(message.includes(rec.updatedAt), "message should include actual timestamp");
});

proof("1003: not-found error when identity ID not in registry", () => {
  const { service } = makeService([]);
  const result = service.verifyIdentity({
    identityId: "MIP-999999",
    actor: "admin",
    expectedUpdatedAt: TS,
  });
  assert(!result.success, "missing ID should fail");
  assert((result as any).kind === "not-found", `should be not-found, got ${(result as any).kind}`);
});

proof("1004: sequential mutations use updated timestamps correctly", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service, repo } = makeService([rec], TS2);

  // First mutation
  service.requestMoreResearch({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Need more research",
  });
  const afterFirst = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(afterFirst.updatedAt === TS2, `after first mutation, updatedAt should be ${TS2}`);

  // Second mutation using updated timestamp
  const result2 = service.elevate({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: TS2, // correct — matches what was just written
    reason: "Re-elevating after research",
  });
  assert(result2.success, `second mutation should succeed: ${result2.success ? "" : (result2 as any).message}`);
});

proof("1005: second mutation with stale timestamp blocked after first write", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service } = makeService([rec], TS2);

  // First mutation succeeds
  service.requestMoreResearch({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Test",
  });

  // Second attempt with original (now stale) timestamp
  const result = service.elevate({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt, // stale — record was already updated
    reason: "Test",
  });
  assert(!result.success, "stale second attempt should fail");
  assert((result as any).kind === "stale-review", `should be stale-review, got ${(result as any).kind}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 11: Transaction Integrity
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 11] Transaction Integrity\n");

proof("1101: failed verification does not write to repository", () => {
  const rec = makeCandidateRecord("MIP-000001"); // candidate — cannot be verified
  const { service, repo } = makeService([rec]);
  service.verifyIdentity({ identityId: "MIP-000001", actor: "admin", expectedUpdatedAt: rec.updatedAt });
  const unchanged = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(unchanged.status === "candidate", "status should be unchanged after failed verify");
  assert(unchanged.history.length === 0, "history should be unchanged after failed verify");
});

proof("1102: successful operation writes exactly one history entry", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.elevate({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Ready",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.history.length === 1, `should have exactly 1 history entry, got ${updated.history.length}`);
});

proof("1103: other records in registry are not affected by a mutation", () => {
  const recA = makeCandidateRecord("MIP-000001");
  const recB = makeCandidateRecord("MIP-000002");
  const { service, repo } = makeService([recA, recB]);
  service.elevate({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: recA.updatedAt,
    reason: "Test",
  });
  const bAfter = repo.identities.find(r => r.id === "MIP-000002")!;
  assert(bAfter.status === "candidate", "record B should be untouched");
  assert(bAfter.updatedAt === recB.updatedAt, "record B updatedAt should be unchanged");
});

proof("1104: registry length does not change after a mutation", () => {
  const records = [
    makeCandidateRecord("MIP-000001"),
    makeCandidateRecord("MIP-000002"),
    makePendingRecord("MIP-000003"),
  ];
  const { service, repo } = makeService(records);
  service.elevate({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: records[0].updatedAt,
    reason: "Test",
  });
  assert(repo.identities.length === 3, `registry should still have 3 records, got ${repo.identities.length}`);
});

proof("1105: multiple identities can be mutated independently in sequence", () => {
  const recA = makeCandidateRecord("MIP-000001");
  const recB = makePendingRecord("MIP-000002");
  const { service, repo } = makeService([recA, recB]);

  service.elevate({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: recA.updatedAt,
    reason: "Test A",
  });
  service.verifyIdentity({
    identityId: "MIP-000002",
    actor: "admin",
    expectedUpdatedAt: recB.updatedAt,
  });

  const a = repo.identities.find(r => r.id === "MIP-000001")!;
  const b = repo.identities.find(r => r.id === "MIP-000002")!;
  assert(a.status === "pending-review", "A should be pending-review");
  assert(b.status === "verified", "B should be verified");
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 12: Review Queue Projection
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 12] Review Queue Projection\n");

proof("1201: getReviewQueue returns pending-review and candidate records by default", () => {
  const records = [
    makePendingRecord("MIP-000001"),
    makeCandidateRecord("MIP-000002"),
    makeVerifiedRecord("MIP-000003"),
    makeRecord({ id: "MIP-000004", status: "rejected" }),
  ];
  const { service } = makeService(records);
  const queue = service.getReviewQueue();
  assert(queue.length === 2, `should have 2 reviewable records, got ${queue.length}`);
  assert(
    queue.every(r => r.status === "pending-review" || r.status === "candidate"),
    "queue should only include pending-review and candidate",
  );
});

proof("1202: getReviewQueue orders pending-review before candidate", () => {
  const records = [
    makeCandidateRecord("MIP-000001"),
    makePendingRecord("MIP-000002"),
  ];
  const { service } = makeService(records);
  const queue = service.getReviewQueue();
  assert(queue[0].id === "MIP-000002", `pending-review should come first, got ${queue[0].id}`);
  assert(queue[1].id === "MIP-000001", `candidate should come second, got ${queue[1].id}`);
});

proof("1203: getReviewQueue orders by id ascending within same status", () => {
  const records = [
    makeCandidateRecord("MIP-000003"),
    makeCandidateRecord("MIP-000001"),
    makeCandidateRecord("MIP-000002"),
  ];
  const { service } = makeService(records);
  const queue = service.getReviewQueue();
  assert(queue[0].id === "MIP-000001", `first should be MIP-000001, got ${queue[0].id}`);
  assert(queue[1].id === "MIP-000002", `second should be MIP-000002, got ${queue[1].id}`);
  assert(queue[2].id === "MIP-000003", `third should be MIP-000003, got ${queue[2].id}`);
});

proof("1204: getReviewQueue with status filter respects filter", () => {
  const records = [
    makePendingRecord("MIP-000001"),
    makeCandidateRecord("MIP-000002"),
    makeRecord({ id: "MIP-000003", status: "disputed" }),
  ];
  const { service } = makeService(records);
  const queue = service.getReviewQueue({ status: ["pending-review"] });
  assert(queue.length === 1, `should have 1 record, got ${queue.length}`);
  assert(queue[0].id === "MIP-000001", "should be the pending-review record");
});

proof("1205: getIdentityReview returns null for unknown ID", () => {
  const { service } = makeService([makeCandidateRecord("MIP-000001")]);
  const detail = service.getIdentityReview("MIP-999999");
  assert(detail === null, "unknown ID should return null");
});

proof("1206: getIdentityReview returns verificationEligible false for candidate", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service } = makeService([rec]);
  const detail = service.getIdentityReview("MIP-000001");
  assert(detail !== null, "detail should not be null");
  assert(!detail!.verificationEligible, "candidate should not be verification-eligible");
  assert(detail!.verificationBlockers.length > 0, "should have blockers");
});

proof("1207: getIdentityReview returns verificationEligible true for clean pending-review", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service } = makeService([rec]);
  const detail = service.getIdentityReview("MIP-000001");
  assert(detail !== null, "detail should not be null");
  assert(detail!.verificationEligible, "clean pending-review should be verification-eligible");
  assert(detail!.verificationBlockers.length === 0, "should have no blockers");
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 13: Confidence Preservation
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 13] Confidence Preservation\n");

proof("1301: confidence.score unchanged after verify", () => {
  const rec = makePendingRecord("MIP-000001");
  const originalScore = rec.confidence.score;
  const { service, repo } = makeService([rec]);
  service.verifyIdentity({ identityId: "MIP-000001", actor: "admin", expectedUpdatedAt: rec.updatedAt });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.confidence.score === originalScore, `score should be ${originalScore}, got ${updated.confidence.score}`);
});

proof("1302: confidence.basis unchanged after verify", () => {
  const rec = makePendingRecord("MIP-000001");
  const originalBasis = rec.confidence.basis;
  const { service, repo } = makeService([rec]);
  service.verifyIdentity({ identityId: "MIP-000001", actor: "admin", expectedUpdatedAt: rec.updatedAt });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.confidence.basis === originalBasis, `basis should be "${originalBasis}", got "${updated.confidence.basis}"`);
});

proof("1303: confidence unchanged after correct-canonical", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.correctCanonical({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    canonicalName: "New Name",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.confidence.score === rec.confidence.score, "score should be unchanged");
  assert(updated.confidence.basis === rec.confidence.basis, "basis should be unchanged");
});

proof("1304: confidence unchanged after reject", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.rejectIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Test",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.confidence.score === rec.confidence.score, "score should be unchanged after rejection");
});

proof("1305: confidence unchanged after dispute", () => {
  const rec = makeVerifiedRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.disputeIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Test",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.confidence.score === rec.confidence.score, "score should be unchanged after dispute");
});

proof("1306: confidence unchanged after elevate", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const { service, repo } = makeService([rec]);
  service.elevate({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Test",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.confidence.score === rec.confidence.score, "score should be unchanged after elevate");
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 14: Evidence Immutability
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 14] Evidence Immutability\n");

const EVIDENCE_FIXTURE = [
  {
    evidenceId: "EV-001",
    type: "official-brand" as const,
    sourceName: "Brand Official Site",
    observedValue: "Test Fragrance",
    createdAt: TS,
  },
  {
    evidenceId: "EV-002",
    type: "supplier-catalogue" as const,
    sourceName: "2026 Catalogue",
    observedValue: "TEST FRAG",
    createdAt: TS,
  },
];

proof("1401: evidence preserved exactly through verify", () => {
  const rec = makeRecord({
    id: "MIP-000001",
    status: "pending-review",
    canonicalIdentity: { canonicalName: "Test Frag", canonicalBrand: "Brand", category: "fragrance" },
    evidence: EVIDENCE_FIXTURE,
  });
  const { service, repo } = makeService([rec]);
  service.verifyIdentity({ identityId: "MIP-000001", actor: "admin", expectedUpdatedAt: rec.updatedAt });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.evidence.length === 2, `should still have 2 evidence items, got ${updated.evidence.length}`);
  assert(updated.evidence[0].evidenceId === "EV-001", "first evidence should be EV-001");
  assert(updated.evidence[1].evidenceId === "EV-002", "second evidence should be EV-002");
});

proof("1402: evidence preserved through canonical correction", () => {
  const rec = makeRecord({
    id: "MIP-000001",
    canonicalIdentity: { canonicalName: "Old Name", category: "fragrance" },
    evidence: EVIDENCE_FIXTURE,
  });
  const { service, repo } = makeService([rec]);
  service.correctCanonical({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    canonicalName: "New Name",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.evidence.length === 2, "evidence count should be preserved");
});

proof("1403: evidence preserved through alias confirmation", () => {
  const rec = makeRecord({
    id: "MIP-000001",
    evidence: EVIDENCE_FIXTURE,
  });
  const { service, repo } = makeService([rec]);
  service.confirmAlias({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    aliasValue: "New Alias",
    aliasType: "common",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.evidence.length === 2, "evidence count should be preserved after alias confirmation");
});

proof("1404: evidence preserved through reject (evidence is history, not status-dependent)", () => {
  const rec = makeRecord({
    id: "MIP-000001",
    status: "candidate",
    evidence: EVIDENCE_FIXTURE,
  });
  const { service, repo } = makeService([rec]);
  service.rejectIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
    reason: "Not a real product",
  });
  const updated = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(updated.evidence.length === 2, "evidence should be preserved through rejection");
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 15: Real Registry Protection
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 15] Real Registry Protection\n");

proof("1501: real registry file hash unchanged after test suite", () => {
  const hashAfter = createHash("sha256")
    .update(readFileSync(REGISTRY_PATH, "utf-8"))
    .digest("hex");
  assert(
    hashAfter === registryHashBefore,
    `Registry was modified during tests!\nBefore: ${registryHashBefore}\nAfter:  ${hashAfter}`,
  );
});

proof("1502: in-memory repository does not share state with real registry", () => {
  const { repo } = makeService([makeCandidateRecord("MIP-TEST-999")]);
  // MIP-TEST-999 is not a valid MIP ID but demonstrates isolation
  const inMemoryIds = repo.identities.map(r => r.id);
  const registryRaw = JSON.parse(readFileSync(REGISTRY_PATH, "utf-8")) as { identities: Array<{ id: string }> };
  const realIds = registryRaw.identities.map(r => r.id);
  assert(
    !realIds.includes("MIP-TEST-999"),
    "in-memory test record should not appear in real registry",
  );
  assert(
    !inMemoryIds.some(id => realIds.includes(id)),
    "test records should not share IDs with real registry records",
  );
});

proof("1503: production repository adapter exists and is callable", () => {
  const repo = createProductionRepository();
  assert(typeof repo.load === "function", "production repo should have load()");
  assert(typeof repo.save === "function", "production repo should have save()");
});

proof("1504: production repository loads real registry with correct version", () => {
  const repo = createProductionRepository();
  const data = repo.load();
  assert(data.version === IDENTITY_PLATFORM_VERSION, `version should be ${IDENTITY_PLATFORM_VERSION}`);
  assert(data.identities.length === 26, `should have 26 identities, got ${data.identities.length}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 16: Platform Isolation
// ─────────────────────────────────────────────────────────────────────────────

console.log("\n  [Section 16] Platform Isolation\n");

proof("1601: editorial service does not modify confidence during any action", () => {
  const confidenceFixture = { score: 73, basis: "strong-evidence", lastEvaluatedAt: TS };
  const actions = [
    (svc: IdentityEditorialService, ts: string) => svc.elevate({ identityId: "MIP-000001", actor: "a", expectedUpdatedAt: ts, reason: "r" }),
    (svc: IdentityEditorialService, ts: string) => svc.rejectIdentity({ identityId: "MIP-000001", actor: "a", expectedUpdatedAt: ts, reason: "r" }),
  ];

  for (const action of actions) {
    const rec = makeCandidateRecord("MIP-000001");
    const recWithConfidence: IdentityRecord = { ...rec, confidence: confidenceFixture };
    const { service, repo } = makeService([recWithConfidence]);
    action(service, recWithConfidence.updatedAt);
    const updated = repo.identities.find(r => r.id === "MIP-000001")!;
    assert(updated.confidence.score === 73, `score should be 73, got ${updated.confidence.score}`);
    assert(updated.confidence.basis === "strong-evidence", "basis should be unchanged");
    assert(updated.confidence.lastEvaluatedAt === TS, "lastEvaluatedAt should be unchanged");
  }
});

proof("1602: verify → dispute → reject lifecycle path works end-to-end", () => {
  const rec = makePendingRecord("MIP-000001");
  const { service, repo } = makeService([rec], TS2);

  // Step 1: verify
  const r1 = service.verifyIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: rec.updatedAt,
  });
  assert(r1.success, "verify should succeed");

  const afterVerify = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(afterVerify.status === "verified", "should be verified");

  // Step 2: dispute
  const r2 = service.disputeIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: afterVerify.updatedAt,
    reason: "New evidence",
  });
  assert(r2.success, "dispute should succeed");

  const afterDispute = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(afterDispute.status === "disputed", "should be disputed");

  // Step 3: reject
  const r3 = service.rejectIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: afterDispute.updatedAt,
    reason: "Unresolvable",
  });
  assert(r3.success, "reject should succeed");

  const final = repo.identities.find(r => r.id === "MIP-000001")!;
  assert(final.status === "rejected", "final status should be rejected");
  assert(final.history.length === 3, `should have 3 history entries, got ${final.history.length}`);
  assert(!isIdentityKnowledgeEligible(final), "rejected record should not be knowledge-eligible");
});

proof("1603: candidate → elevate → verify full path produces correct history", () => {
  const rec = makeCandidateRecord("MIP-000001");
  const recWithBrand = makeRecord({
    id: "MIP-000001",
    status: "candidate",
    canonicalIdentity: { canonicalName: "Candidate Name", category: "fragrance" },
  });
  const { service, repo } = makeService([recWithBrand], TS2);

  // Step 1: correct canonical to add brand
  const r1 = service.correctCanonical({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: recWithBrand.updatedAt,
    canonicalBrand: "Full Brand",
  });
  assert(r1.success, `correctCanonical should succeed: ${r1.success ? "" : (r1 as any).message}`);
  const afterCorrection = repo.identities.find(r => r.id === "MIP-000001")!;

  // Step 2: elevate
  const r2 = service.elevate({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: afterCorrection.updatedAt,
    reason: "Ready for review",
  });
  assert(r2.success, "elevate should succeed");
  const afterElevate = repo.identities.find(r => r.id === "MIP-000001")!;

  // Step 3: verify
  const r3 = service.verifyIdentity({
    identityId: "MIP-000001",
    actor: "admin",
    expectedUpdatedAt: afterElevate.updatedAt,
  });
  assert(r3.success, "verify should succeed");
  const final = repo.identities.find(r => r.id === "MIP-000001")!;

  assert(final.status === "verified", "final status should be verified");
  assert(final.history.length === 3, `should have 3 history entries, got ${final.history.length}`);
  assert(isIdentityKnowledgeEligible(final), "verified record should be knowledge-eligible");

  const eventTypes = final.history.map(h => h.event);
  assert(eventTypes[0] === "brand-changed", `first event should be brand-changed, got ${eventTypes[0]}`);
  assert(eventTypes[1] === "candidate-promoted", `second event should be candidate-promoted, got ${eventTypes[1]}`);
  assert(eventTypes[2] === "verified", `third event should be verified, got ${eventTypes[2]}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// Results
// ─────────────────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\n  Results: ${passed}/${total} proofs passed.\n`);

if (failed > 0) {
  console.error(`  ${failed} proof(s) FAILED. See above for details.\n`);
  process.exit(1);
}

console.log("  All proofs passed.\n");

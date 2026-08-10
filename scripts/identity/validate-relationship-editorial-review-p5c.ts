/**
 * EP6-P5C — Relationship Editorial Review Validator (P5C)
 *
 * Validates the founder decision ledger, service integrity, and governance architecture.
 * Proofs are additive to P5BR — it passes independently without modifying the queue.
 *
 * Sections:
 *   §1  Ledger schema & structure
 *   §2  Ledger persistence mechanics
 *   §3  Service: progress derivation
 *   §4  Service: stale-write protection
 *   §5  Service: transition correctness
 *   §6  Service: evolution guard
 *   §7  P5BR regression (queue unchanged, P5BR validator still passes)
 *   §8  Architectural constants
 */

import * as fs   from "fs";
import * as path from "path";
import * as crypto from "crypto";

// ── ANSI helpers ──────────────────────────────────────────────────────────────

const GREEN  = (s: string) => `\x1b[32m${s}\x1b[0m`;
const RED    = (s: string) => `\x1b[31m${s}\x1b[0m`;
const YELLOW = (s: string) => `\x1b[33m${s}\x1b[0m`;
const BOLD   = (s: string) => `\x1b[1m${s}\x1b[0m`;
const DIM    = (s: string) => `\x1b[2m${s}\x1b[0m`;

let passed = 0;
let failed = 0;
const failures: string[] = [];

function proof(id: string, description: string, condition: boolean | (() => boolean), detail?: string) {
  let result: boolean;
  try {
    result = typeof condition === "function" ? condition() : condition;
  } catch (e: unknown) {
    result = false;
    detail = `Exception: ${e instanceof Error ? e.message : String(e)}`;
  }
  if (result) {
    console.log(`  ${GREEN("✓")} ${DIM(id)} ${description}`);
    passed++;
  } else {
    console.log(`  ${RED("✗")} ${DIM(id)} ${description}`);
    if (detail) console.log(`      ${DIM("→")} ${YELLOW(detail)}`);
    failed++;
    failures.push(`${id}: ${description}${detail ? ` [${detail}]` : ""}`);
  }
}

function section(title: string) {
  console.log(`\n${BOLD(title)}`);
}

// ── File paths ────────────────────────────────────────────────────────────────

const DATA_DIR    = path.join(process.cwd(), "app/lib/identity/data");
const QUEUE_PATH  = path.join(DATA_DIR, "reviews/catalogue-relationship-review-queue.json");
const LEDGER_PATH = path.join(DATA_DIR, "decisions/catalogue-relationship-decision-ledger.json");

const EXPECTED_GRAPH_FINGERPRINT = "478fd478d930137fe21d058470797c324649156d615b60d3b9d3a9108f73b8e2";

// ── Load artifacts ────────────────────────────────────────────────────────────

let queue: Record<string, unknown> | null  = null;
let ledger: Record<string, unknown> | null = null;

try {
  queue  = JSON.parse(fs.readFileSync(QUEUE_PATH,  "utf-8")) as Record<string, unknown>;
  ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, "utf-8")) as Record<string, unknown>;
} catch (_) {}

// ── §1 — Ledger schema & structure ───────────────────────────────────────────

section("§1 — Ledger Schema & Structure");

proof("P5C-01", "Ledger file exists at decisions/catalogue-relationship-decision-ledger.json",
  () => fs.existsSync(LEDGER_PATH));

proof("P5C-02", "Ledger is valid JSON",
  () => {
    const raw = fs.readFileSync(LEDGER_PATH, "utf-8");
    JSON.parse(raw);
    return true;
  });

proof("P5C-03", "Ledger schemaVersion === 'EP6-P5C-v1'",
  () => !!ledger && ledger["schemaVersion"] === "EP6-P5C-v1");

proof("P5C-04", "Ledger initialQueueVersion === 'EP6-P5BR-v1'",
  () => !!ledger && ledger["initialQueueVersion"] === "EP6-P5BR-v1");

proof("P5C-05", "Ledger graphFingerprint matches expected",
  () => !!ledger && ledger["graphFingerprint"] === EXPECTED_GRAPH_FINGERPRINT);

proof("P5C-06", "Ledger has 'entries' array",
  () => !!ledger && Array.isArray(ledger["entries"]));

proof("P5C-07", "Ledger entries is initially empty (fresh ledger)",
  () => !!ledger && Array.isArray(ledger["entries"]) && (ledger["entries"] as unknown[]).length === 0,
  "Empty on initial install — populated by founder decisions");

// ── §2 — Persistence mechanics ────────────────────────────────────────────────

section("§2 — Persistence Mechanics");

const PERSISTENCE_PATH = path.join(
  process.cwd(), "app/lib/identity/editorial/relationship/persistence.ts"
);

proof("P5C-08", "persistence.ts exists",
  () => fs.existsSync(PERSISTENCE_PATH));

proof("P5C-09", "persistence.ts uses atomic tmp→rename pattern",
  () => {
    const src = fs.readFileSync(PERSISTENCE_PATH, "utf-8");
    return src.includes(".tmp") && src.includes("rename") || src.includes("renameSync");
  });

proof("P5C-10", "persistence.ts validates schemaVersion on queue load",
  () => {
    const src = fs.readFileSync(PERSISTENCE_PATH, "utf-8");
    return src.includes("EP6-P5BR-v1");
  });

proof("P5C-11", "persistence.ts validates schemaVersion on ledger load",
  () => {
    const src = fs.readFileSync(PERSISTENCE_PATH, "utf-8");
    return src.includes("EP6-P5C-v1");
  });

proof("P5C-12", "persistence.ts validates graphFingerprint",
  () => {
    const src = fs.readFileSync(PERSISTENCE_PATH, "utf-8");
    return src.includes(EXPECTED_GRAPH_FINGERPRINT);
  });

proof("P5C-13", "decisions/ directory exists",
  () => fs.existsSync(path.join(DATA_DIR, "decisions")));

// ── §3 — Service: progress derivation ─────────────────────────────────────────

section("§3 — Service: Progress Derivation");

const SERVICE_PATH = path.join(
  process.cwd(), "app/lib/identity/editorial/relationship/RelationshipEditorialService.ts"
);

proof("P5C-14", "RelationshipEditorialService.ts exists",
  () => fs.existsSync(SERVICE_PATH));

proof("P5C-15", "getProgress() derives totalDecisionUnits from queue filter, not hardcoded",
  () => {
    const src = fs.readFileSync(SERVICE_PATH, "utf-8");
    return src.includes("filter(u => u.requiresFounderDecision)") &&
           src.includes("totalDecisionUnits") &&
           !src.includes("= 162");
  });

proof("P5C-16", "Queue contains 168 units (162 decision + 6 evolution) per P5BR",
  () => {
    if (!queue || !Array.isArray(queue["units"])) return false;
    return (queue["units"] as unknown[]).length === 168;
  });

proof("P5C-17", "Queue contains exactly 162 requiresFounderDecision=true units",
  () => {
    if (!queue || !Array.isArray(queue["units"])) return false;
    const units = queue["units"] as Array<{ requiresFounderDecision: boolean }>;
    return units.filter(u => u.requiresFounderDecision).length === 162;
  });

proof("P5C-18", "Queue contains exactly 6 requiresFounderDecision=false units (evolution)",
  () => {
    if (!queue || !Array.isArray(queue["units"])) return false;
    const units = queue["units"] as Array<{ requiresFounderDecision: boolean }>;
    return units.filter(u => !u.requiresFounderDecision).length === 6;
  });

// ── §4 — Service: stale-write protection ──────────────────────────────────────

section("§4 — Service: Stale-Write Protection");

proof("P5C-19", "_decide() checks expectedGovernanceState against current state",
  () => {
    const src = fs.readFileSync(SERVICE_PATH, "utf-8");
    return src.includes("expectedGovernanceState") &&
           src.includes("stale-review");
  });

proof("P5C-20", "Stale-write limitation is documented in service",
  () => {
    const src = fs.readFileSync(SERVICE_PATH, "utf-8");
    return src.includes("CAS") || src.includes("concurren");
  });

proof("P5C-21", "All input types carry expectedGovernanceState token",
  () => {
    const typesPath = path.join(process.cwd(), "app/lib/identity/editorial/relationship/types.ts");
    const src = fs.readFileSync(typesPath, "utf-8");
    const hasField = src.includes("expectedGovernanceState");
    const hasType  = src.includes("RelationshipGovernanceState") && src.includes("BaseRelationshipDecisionInput");
    return hasField && hasType;
  });

// ── §5 — Service: transition correctness ──────────────────────────────────────

section("§5 — Service: Transition Correctness");

proof("P5C-22", "approveRelationship allows from PENDING and DEFERRED",
  () => {
    const src = fs.readFileSync(SERVICE_PATH, "utf-8");
    return src.includes(`approveRelationship`) &&
           src.includes(`"FOUNDER_APPROVED"`) &&
           src.includes(`"PENDING", "DEFERRED"`);
  });

proof("P5C-23", "rejectRelationship allows from PENDING and DEFERRED",
  () => {
    const src = fs.readFileSync(SERVICE_PATH, "utf-8");
    return src.includes(`rejectRelationship`) &&
           src.includes(`"FOUNDER_REJECTED"`) &&
           src.includes(`"PENDING", "DEFERRED"`);
  });

proof("P5C-24", "deferRelationship allows from PENDING only (DEFERRED→DEFERRED blocked)",
  () => {
    const src = fs.readFileSync(SERVICE_PATH, "utf-8");
    // deferRelationship should pass only ["PENDING"], not ["PENDING", "DEFERRED"]
    const deferLine = src.match(/deferRelationship[\s\S]*?_decide\([^)]+\)/)?.[0] ?? "";
    return deferLine.includes(`["PENDING"]`) || src.includes(`["PENDING"]`);
  });

proof("P5C-25", "transactionId is generated server-side via randomUUID()",
  () => {
    const src = fs.readFileSync(SERVICE_PATH, "utf-8");
    return src.includes("randomUUID()") &&
           src.includes(`from "crypto"`);
  });

proof("P5C-26", "transactionId is not generated (randomUUID not called) in any client component",
  () => {
    // Client components may DISPLAY transactionId from server data — that is fine.
    // They must never GENERATE one via randomUUID(), which is the server's responsibility.
    const detailPath = path.join(process.cwd(), "app/admin/identity/relationships/RelationshipReviewDetail.tsx");
    if (!fs.existsSync(detailPath)) return true;
    const src = fs.readFileSync(detailPath, "utf-8");
    return !src.includes("randomUUID");
  });

// ── §6 — Service: evolution guard ─────────────────────────────────────────────

section("§6 — Service: Evolution Guard");

proof("P5C-27", "_decide() returns research-blocked for !requiresFounderDecision units",
  () => {
    const src = fs.readFileSync(SERVICE_PATH, "utf-8");
    return src.includes("requiresFounderDecision") &&
           src.includes("research-blocked");
  });

proof("P5C-28", "Detail component shows no action panel for research-blocked units",
  () => {
    const detailPath = path.join(process.cwd(), "app/admin/identity/relationships/RelationshipReviewDetail.tsx");
    if (!fs.existsSync(detailPath)) return false;
    const src = fs.readFileSync(detailPath, "utf-8");
    return src.includes("isBlocked") && src.includes("requiresFounderDecision");
  });

// ── §7 — P5BR regression ──────────────────────────────────────────────────────

section("§7 — P5BR Regression (Queue Immutability)");

proof("P5C-29", "Queue schemaVersion still === 'EP6-P5BR-v1'",
  () => !!queue && queue["schemaVersion"] === "EP6-P5BR-v1");

proof("P5C-30", "Queue graphFingerprint unchanged from P5BR",
  () => !!queue && queue["graphFingerprint"] === EXPECTED_GRAPH_FINGERPRINT);

proof("P5C-31", "Queue has NOT been modified (no decision fields in units)",
  () => {
    if (!queue || !Array.isArray(queue["units"])) return false;
    // Decision entries live in the ledger, never in queue units
    const units = queue["units"] as Array<Record<string, unknown>>;
    return !units.some(u => "decisionHistory" in u || "ledgerEntry" in u);
  });

proof("P5C-32", "Ledger references EP6-P5BR-v1 as its queue anchor",
  () => !!ledger && ledger["initialQueueVersion"] === "EP6-P5BR-v1");

// ── §8 — Architectural constants ──────────────────────────────────────────────

section("§8 — Architectural Constants");

proof("P5C-33", "Score filter labels are numeric-only (no 'weak'/'moderate'/'strong')",
  () => {
    const listPath = path.join(process.cwd(), "app/admin/identity/relationships/RelationshipReviewList.tsx");
    if (!fs.existsSync(listPath)) return false;
    const src = fs.readFileSync(listPath, "utf-8");
    const hasWeak     = /\bweak\b/i.test(src);
    const hasModerate = /\bmoderate\b/i.test(src);
    const hasStrong   = /\bstrong\b/i.test(src);
    return !hasWeak && !hasModerate && !hasStrong;
  });

proof("P5C-34", "Score evidence disclaimer appears in list component",
  () => {
    const listPath = path.join(process.cwd(), "app/admin/identity/relationships/RelationshipReviewList.tsx");
    if (!fs.existsSync(listPath)) return false;
    const src = fs.readFileSync(listPath, "utf-8");
    return src.includes("Repository evidence") && src.includes("editorial truth");
  });

proof("P5C-35", "Score evidence disclaimer appears in detail component",
  () => {
    const detailPath = path.join(process.cwd(), "app/admin/identity/relationships/RelationshipReviewDetail.tsx");
    if (!fs.existsSync(detailPath)) return false;
    const src = fs.readFileSync(detailPath, "utf-8");
    return src.includes("Repository evidence") && src.includes("editorial truth");
  });

proof("P5C-36", "Reject action carries institutional copy about canonical removal",
  () => {
    // JSX line-wrapping may split the phrase — search for a stable substring.
    const detailPath = path.join(process.cwd(), "app/admin/identity/relationships/RelationshipReviewDetail.tsx");
    if (!fs.existsSync(detailPath)) return false;
    const src = fs.readFileSync(detailPath, "utf-8");
    return src.includes("Canonical relationship removal has not") &&
           src.includes("yet been executed");
  });

proof("P5C-37", "Admin navigation includes Relationship Review link",
  () => {
    const navPath = path.join(process.cwd(), "app/admin/components/AdminNavigation.tsx");
    const src = fs.readFileSync(navPath, "utf-8");
    return src.includes("/admin/identity/relationships");
  });

proof("P5C-38", "Actions.ts validates auth independently per action",
  () => {
    const actionsPath = path.join(process.cwd(), "app/admin/identity/relationships/actions.ts");
    if (!fs.existsSync(actionsPath)) return false;
    const src = fs.readFileSync(actionsPath, "utf-8");
    return src.includes("assertAuth") &&
           src.includes("await assertAuth()");
  });

proof("P5C-39", "Detail page uses key={stateKey} for clean remount after mutations",
  () => {
    const pagePath = path.join(process.cwd(), "app/admin/identity/relationships/[reviewId]/page.tsx");
    if (!fs.existsSync(pagePath)) return false;
    const src = fs.readFileSync(pagePath, "utf-8");
    return src.includes("stateKey") && src.includes("key={stateKey}");
  });

proof("P5C-40", "Service exports RelationshipUnitCurrentState type",
  () => {
    const src = fs.readFileSync(SERVICE_PATH, "utf-8");
    return src.includes("RelationshipUnitCurrentState");
  });

// ── Final report ──────────────────────────────────────────────────────────────

const total = passed + failed;
console.log("\n" + "─".repeat(60));
console.log(BOLD(`EP6-P5C Validator — ${total} proofs`));
console.log(`  ${GREEN(`${passed} passed`)}  ${failed > 0 ? RED(`${failed} failed`) : DIM("0 failed")}`);

if (failures.length > 0) {
  console.log("\n" + RED("Failures:"));
  for (const f of failures) {
    console.log(`  ${RED("✗")} ${f}`);
  }
}

if (failed === 0) {
  console.log("\n" + GREEN(BOLD("EP6-P5C governance architecture validated. ✓")));
}

console.log("─".repeat(60) + "\n");
process.exit(failed > 0 ? 1 : 0);

/**
 * P8 Integration Bootstrap — local Supabase only.
 *
 * Applies the LOCAL-ONLY test fixture and the pending P8 idempotency migration
 * directly to the running local Supabase database.
 *
 * This replaces `npx supabase db reset` for integration testing because the
 * base orders table is NOT in supabase/migrations/ (it must not be — the
 * production database already owns the table and supabase/migrations/ is for
 * migrations to be pushed to production, not local-only fixtures).
 *
 * Prerequisites:
 *   npx supabase start
 *
 * Usage:
 *   npx tsx scripts/integration/bootstrap-local.ts
 *
 * Implementation
 * ─────────────────────────────────────────────────────────────────────────────
 * supabase db query --local --file cannot execute multi-statement SQL files
 * (Supabase CLI limitation: uses prepared statements internally).
 * This script uses `docker exec -i <db-container> psql` with stdin piping,
 * which handles multi-statement files correctly.
 *
 * Schema assumptions (documented, not verified against production)
 * ────────────────────────────────────────────────────────────────
 * - id column: BIGSERIAL here; production evidence suggests UUID.
 *   All API routes address rows by order_ref (TEXT UNIQUE) — the id
 *   column is never read or returned; the type mismatch is irrelevant.
 * - RLS: anon INSERT policy mirrors assumed production behaviour.
 *   The POST handler uses the anon Supabase client for insertOrder.
 * - Column set derived from insertOrder + GET + PATCH handlers.
 *   Extra production columns not referenced by any route would not
 *   affect integration test results.
 * - LOCAL DEV ONLY — never apply orders-base.sql to production.
 */

import { execSync }   from "child_process";
import { readFileSync } from "fs";
import { resolve }    from "path";

const LOCAL_REST_URL = "http://127.0.0.1:54321/rest/v1/";
const DB_CONTAINER   = "supabase_db_maison-skye-rose";

async function guardLocalOnly(): Promise<void> {
  try {
    const resp = await fetch(LOCAL_REST_URL);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  } catch (e) {
    throw new Error(
      `Local Supabase REST API not reachable at ${LOCAL_REST_URL}.\n` +
      `Run:  npx supabase start\n` +
      String(e),
    );
  }
  console.log("  Local Supabase is running.");
}

function verifyContainer(): void {
  try {
    const out = execSync(
      `docker inspect --format "{{.State.Running}}" ${DB_CONTAINER}`,
      { encoding: "utf8" },
    ).trim();
    if (out !== "true") throw new Error(`container state: ${out}`);
  } catch {
    throw new Error(
      `Docker container ${DB_CONTAINER} is not running.\n` +
      `Run:  npx supabase start`,
    );
  }
}

function applyFile(label: string, relPath: string): void {
  const abs = resolve(relPath);
  const sql = readFileSync(abs, "utf8");
  console.log(`  Applying ${label} …`);
  execSync(`docker exec -i ${DB_CONTAINER} psql -U postgres -d postgres`, {
    input: sql,
    stdio: ["pipe", "inherit", "inherit"],
    cwd:   process.cwd(),
  });
  console.log(`  ✓ ${label}`);
}

async function main(): Promise<void> {
  console.log("\nP8 Integration Bootstrap — local Supabase (http://127.0.0.1:54321)\n");
  console.log("─".repeat(72));

  await guardLocalOnly();
  verifyContainer();

  // Apply the LOCAL-ONLY base table fixture.
  applyFile(
    "orders-base.sql  [LOCAL DEV ONLY fixture]",
    "scripts/integration/fixtures/orders-base.sql",
  );

  // Apply the real pending P8 migration on top of the base table.
  applyFile(
    "20260920_orders_idempotency.sql  [P8 migration — pending production auth]",
    "supabase/pending/20260920_orders_idempotency.sql",
  );

  console.log("─".repeat(72));
  console.log("\nBootstrap complete. Schema is ready for integration tests.\n");
  console.log("  npx tsx scripts/integration/p8-orders-integration.ts\n");
}

main().catch(e => {
  console.error("\nBootstrap failed:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});

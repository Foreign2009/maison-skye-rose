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

import { execSync } from "child_process";
import { resolve }  from "path";

const LOCAL_HEALTH_URL = "http://127.0.0.1:54321/health";

async function guardLocalOnly(): Promise<void> {
  try {
    const resp = await fetch(LOCAL_HEALTH_URL);
    if (!resp.ok) throw new Error(`status ${resp.status}`);
  } catch (e) {
    throw new Error(
      `Local Supabase is not responding at ${LOCAL_HEALTH_URL}.\n` +
      `Run:  npx supabase start\n` +
      String(e),
    );
  }
  console.log("  Local Supabase is running.");
}

function applyFile(label: string, relPath: string): void {
  const abs = resolve(relPath).replace(/\\/g, "/");
  console.log(`  Applying ${label} …`);
  execSync(`npx supabase db query --local --file "${abs}"`, {
    stdio: "inherit",
    cwd:   process.cwd(),
  });
  console.log(`  ✓ ${label}`);
}

async function main(): Promise<void> {
  console.log("\nP8 Integration Bootstrap — local Supabase (http://127.0.0.1:54321)\n");
  console.log("─".repeat(72));

  await guardLocalOnly();

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
  console.log(
    "  npx tsx scripts/integration/p8-orders-integration.ts\n",
  );
}

main().catch(e => {
  console.error("\nBootstrap failed:", e instanceof Error ? e.message : String(e));
  process.exit(1);
});

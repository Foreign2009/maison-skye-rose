/**
 * Knowledge Factory — Batch CLI Entry Point
 *
 * Usage:
 *
 *   npm run mkc:factory:batch
 *     Process all remaining supplier records (skip native + drafted).
 *
 *   npm run mkc:factory:batch -- --collection=Rose
 *     Process one collection only.
 *
 *   npm run mkc:factory:batch -- slug-1 slug-2
 *     Process specific slugs.
 *
 *   npm run mkc:factory:batch -- --limit=10
 *     Process first N records from the queue.
 *
 *   npm run mkc:factory:batch -- --concurrency=5
 *     Override the parallel pipeline pool size (default: 3).
 *
 *   npm run mkc:factory:batch -- --force
 *     Regenerate records that already have drafts.
 *
 *   npm run mkc:factory:batch -- --dry-run
 *     Show queue and skip logic without making any API calls.
 *
 *   npm run mkc:factory:batch -- --resume
 *     Skip records already completed in an interrupted batch.
 *
 *   npm run mkc:factory:batch -- --stop-on-failure
 *     Halt the batch on first failure (default: continue).
 *
 *   npm run mkc:factory:batch -- --retry=2
 *     Retry failed records up to N additional times (default: 1).
 */

import { DEFAULT_BATCH_CONFIG, parseBatchArgs } from "./BatchConfig";
import { BatchFactory }                          from "./BatchFactory";

async function main(): Promise<void> {
  const rawArgs        = process.argv.slice(2);
  const { config: parsed } = parseBatchArgs(rawArgs);
  const config         = { ...DEFAULT_BATCH_CONFIG, ...parsed };

  const factory = new BatchFactory();
  const report  = await factory.run({ config });

  process.exit(report.failed > 0 ? 1 : 0);
}

main().catch((err: unknown) => {
  console.error(`\n[mkc:batch] Unexpected error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});

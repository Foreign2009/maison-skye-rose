/**
 * Knowledge Factory — CLI Entry Point
 *
 * Routes CLI arguments to the appropriate factory command.
 *
 * Commands:
 *
 *   mkc:factory -- "Fragrance Name"
 *     Generate a draft for the named fragrance.
 *     Skip if already native or already drafted (unless --force).
 *
 *   mkc:factory -- "Fragrance Name" --force
 *     Force regeneration, overwriting existing drafts.
 *
 *   mkc:factory:promote -- slug-name
 *     Promote an approved draft to the native registry.
 *
 *   mkc:factory:promote -- slug-name --force
 *     Overwrite an existing native record (use with care).
 *
 * Usage examples:
 *   npm run mkc:factory -- "Bleu de Chanel Inspired"
 *   npm run mkc:factory:promote -- bleu-de-chanel-inspired
 */

import { run }     from "./orchestrator";
import { promote } from "./promotion/promotionManager";
import { deriveSlug } from "./intake";

// ── Argument parsing ──────────────────────────────────────────────────────────

const args  = process.argv.slice(2);
const force = args.includes("--force");
const clean = args.filter(a => !a.startsWith("--"));

// Determine mode from the script name used to invoke this file.
// package.json sets: mkc:factory → node index.ts
//                   mkc:factory:promote → node index.ts --mode=promote
const modeArg  = args.find(a => a.startsWith("--mode="));
const mode     = modeArg ? modeArg.replace("--mode=", "") : "generate";

// ── Dispatch ──────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (mode === "promote") {
    // mkc:factory:promote -- slug-name [--force]
    const raw = clean[0]?.trim();
    if (!raw) {
      console.error("\nUsage: npm run mkc:factory:promote -- \"slug-or-name\" [--force]\n");
      process.exit(1);
    }

    // Accept either a slug or a display name
    const slug = raw.includes(" ") ? deriveSlug(raw) : raw;

    console.log(`\n[mkc:factory:promote] ${slug}\n`);

    const result = await promote({ slug, force });

    console.log(`\n  ${result.message}\n`);

    if (result.errors.length > 0) {
      console.log("  Errors:");
      for (const err of result.errors) {
        console.log(`    ${err}`);
      }
    }

    process.exit(result.status === "promoted" ? 0 : 1);

  } else {
    // mkc:factory -- "Fragrance Name" [--force]
    const raw = clean[0]?.trim();
    if (!raw) {
      console.error("\nUsage: npm run mkc:factory -- \"Fragrance Name\" [--force]\n");
      process.exit(1);
    }

    // Accept either a name or a slug
    const slug = raw.includes(" ") ? deriveSlug(raw) : raw;

    const result = await run({ slug, force, dryRun: false });

    if (result.status === "failed") {
      console.error(`\n[mkc:factory] Failed: ${result.message}\n`);
      process.exit(1);
    }

    process.exit(0);
  }
}

main().catch((err: unknown) => {
  console.error(`\n[mkc:factory] Unexpected error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});

/**
 * Knowledge Factory — Wave 5 Controlled Batch Generation
 *
 * CATALOGUE-W5-P2: Governed draft generation for exactly 20 Wave 5 identities.
 *
 * Invocation:
 *   npx tsx scripts/factory/run-wave-5-controlled.ts
 *
 * Safety constraints (enforced by this script):
 *   • APPROVED: boolean must be true to allow AI generation.
 *     When false: STOP. Zero AI calls. Zero draft writes. Zero cost.
 *   • Exactly 20 slugs processed — no additions.
 *   • Devotion excluded (FD-5: DUPLICATE_EXISTING_MKC).
 *   • No promotion. No native write. No Concierge modification.
 *   • ANTHROPIC_API_KEY must be set in environment.
 *
 * Governance:
 *   All draft generation uses the existing BatchFactory pipeline.
 *   Wave 5 candidates sourced from scripts/factory/data/wave-5-catalogue.ts
 *   (registered in intake.ts as senary catalogue fallback).
 *   Evidence locked in data/identity/source/wave-5-2026-research.json.
 *
 * CATALOGUE-W5-P2 authorises exactly 20 identities — see WAVE_5_SLUGS below.
 * DO NOT add more slugs. DO NOT run promotion. DO NOT write native records.
 */

import { readFileSync, existsSync } from "fs";
import path from "path";
import { BatchFactory }         from "./batch/BatchFactory";
import type { BatchConfig }     from "./batch/BatchConfig";

// Load .env.local for local development — tsx does not load it automatically.
// ??= preserves vars already set in the environment (CI, shell export).
// Identical pattern to scripts/factory/index.ts.
{
  const envPath = path.join(process.cwd(), ".env.local");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
    }
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// FOUNDER-AUTHORISED GENERATION GATE
// ═════════════════════════════════════════════════════════════════════════════
//
// When false: script prints STOP report and exits. Zero AI calls. Zero cost.
// When true:  batch generation executes for all 20 Wave 5 identities.
//
// CATALOGUE-W5-P2 authorises this flag to be true for the Wave 5 run.

const APPROVED = true;

// Force policy: regenerate if a draft already exists.
// Set to true only if a prior partial run left orphan drafts to regenerate.
const FORCE = false;

// ═════════════════════════════════════════════════════════════════════════════

const WAVE_5_SLUGS = [
  // ELITE (6)
  "earl-grey-cucumber-inspired",
  "myrrh-tonka-inspired",
  "ck-everyone-inspired",
  "greenley-inspired",
  "smoking-hot-inspired",
  "les-sables-roses-inspired",
  // SKYE (7)
  "the-one-pour-homme-inspired",
  "azzaro-wanted-inspired",
  "azzaro-chrome-inspired",
  "boss-the-scent-inspired",
  "ralph's-club-inspired",
  "bad-boy-inspired",
  "uomo-by-zegna-inspired",
  // ROSE (7)
  "the-one-pour-femme-inspired",
  "angel-inspired",
  "daisy-inspired",
  "chanel-allure-inspired",
  "ange-ou-demon-inspired",
  "amor-amor-inspired",
  "dolce-inspired",
] as const;

const SEP = "═".repeat(72);
const DIV = "─".repeat(72);

async function main(): Promise<void> {
  console.log(`\n${SEP}`);
  console.log("CATALOGUE-W5-P2 — Governed Wave 5 Draft Generation");
  console.log(`Candidates: ${WAVE_5_SLUGS.length}  |  APPROVED: ${APPROVED}  |  FORCE: ${FORCE}`);
  console.log(DIV);

  if (!APPROVED) {
    console.log(`
  STOP — APPROVED is false.

  No AI call has been made.
  No draft has been written.
  No cost has been incurred.

  To proceed (only after CATALOGUE-W5-P2 authorization):
    1. Open: scripts/factory/run-wave-5-controlled.ts
    2. Set: const APPROVED = true;
    3. Ensure ANTHROPIC_API_KEY is set in your environment.
    4. Re-run: npx tsx scripts/factory/run-wave-5-controlled.ts
${SEP}
`);
    process.exit(0);
  }

  // Gate: ANTHROPIC_API_KEY required
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error(`
  STOP — ANTHROPIC_API_KEY is not set.
  AI generation requires a valid API key.
  Set ANTHROPIC_API_KEY in your environment before proceeding.
${SEP}
`);
    process.exit(1);
  }

  console.log(`\n  ✓ Gate — APPROVED = true`);
  console.log(`  ✓ Gate — ANTHROPIC_API_KEY present`);
  console.log(`  ✓ Gate — ${WAVE_5_SLUGS.length} governed slugs loaded`);
  console.log(`\n${DIV}`);
  console.log("  Wave 5 slugs:");
  WAVE_5_SLUGS.forEach((slug, i) => {
    const col = i < 6 ? "ELITE" : i < 13 ? "SKYE " : "ROSE ";
    console.log(`    ${String(i + 1).padStart(2, " ")}. [${col}] ${slug}`);
  });
  console.log(DIV);
  console.log("  Invoking BatchFactory...\n");

  const config: BatchConfig = {
    slugs:          [...WAVE_5_SLUGS],
    maxConcurrency: 1,
    retryCount:     1,
    resumeMode:     false,
    skipExisting:   true,
    stopOnFailure:  false,
    dryRun:         false,
    force:          FORCE,
  };

  const factory = new BatchFactory();
  const report  = await factory.run({ config });

  console.log(`\n${SEP}`);
  console.log("CATALOGUE-W5-P2 — BATCH COMPLETE");
  console.log(DIV);
  console.log(`  Total:     ${report.total}`);
  console.log(`  Generated: ${report.generated}`);
  console.log(`  Failed:    ${report.failed}`);
  console.log(`  Skipped:   ${report.skipped}`);
  console.log(DIV);

  if (report.failed > 0) {
    console.error("  STOP — Generation failures detected. Review failures above before committing.");
    process.exit(1);
  }

  console.log(`
  Drafts written to: scripts/factory/drafts/

  ABSOLUTE STOP AFTER GENERATION.
  DO NOT promote. DO NOT modify native MKC. DO NOT push.

  Next episode: CATALOGUE-W5-P3 — Editorial Review + Correction.
${SEP}
`);

  process.exit(0);
}

main().catch((err: unknown) => {
  console.error(
    `\n[wave-5-controlled] Fatal: ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exit(1);
});

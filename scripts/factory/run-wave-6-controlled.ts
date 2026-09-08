/**
 * Knowledge Factory — Wave 6 Controlled Batch Generation
 *
 * CATALOGUE-WAVE6-P2: Governed draft generation for exactly 13 Wave 6 identities.
 *
 * Invocation:
 *   npx tsx scripts/factory/run-wave-6-controlled.ts
 *
 * Safety constraints (enforced by this script):
 *   • APPROVED: boolean must be true to allow AI generation.
 *     When false: STOP. Zero AI calls. Zero draft writes. Zero cost.
 *   • Exactly 13 slugs processed — no additions.
 *   • No promotion. No native write. No Concierge modification.
 *   • ANTHROPIC_API_KEY must be set in environment.
 *
 * Governance:
 *   All draft generation uses the existing BatchFactory pipeline.
 *   Wave 6 candidates sourced from scripts/factory/data/wave-6-catalogue.ts
 *   (registered in intake.ts as septenary catalogue fallback).
 *
 * CATALOGUE-WAVE6-P2 authorises exactly 13 identities — see WAVE_6_SLUGS below.
 * DO NOT add more slugs. DO NOT run promotion. DO NOT write native records.
 *
 * Blocked candidates (require separate governance before generation):
 *   - agua-mistica-inspired       (FD-W6-2: perfume mist format — governance unresolved)
 *   - danca-mistica-inspired      (FD-W6-3: perfume mist format — governance unresolved)
 *   - gucci-oud-inspired          (FD-W6-4: identity ambiguous — supplier clarification needed)
 *   - the-one-rose-inspired       (FD-W6-5: discontinuation risk — availability unconfirmed)
 *   - boss-orange-ladies-inspired (FD-W6-6: Hugo Boss Orange line discontinued)
 *   - black-opium-inspired        (FD-W6-1: ELIMINATED — already in MKC)
 *
 * P1 Negative evidence locks enforced via wave-6-catalogue.ts comments and notesEvidenceLocked.
 * All 13 slugs confirmed clear: native MKC, fragrances.ts, Waves 1–5, drafts.
 *
 * HARD STOP AFTER GENERATION + VALIDATION + EDITORIAL QUEUE PREPARATION.
 * Next episode: CATALOGUE-WAVE6-P3 — Editorial Review + Incremental Value Assessment.
 */

import { readFileSync, existsSync } from "fs";
import path from "path";
import { BatchFactory }         from "./batch/BatchFactory";
import type { BatchConfig }     from "./batch/BatchConfig";

// Load .env.local for local development — tsx does not load it automatically.
// ??= preserves vars already set in the environment (CI, shell export).
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
// When true:  batch generation executes for all 13 Wave 6 identities.
//
// CATALOGUE-WAVE6-P2 authorises this flag to be true for the Wave 6 run.

const APPROVED = true;

// Force policy: regenerate if a draft already exists.
// Set to true only if a prior partial run left orphan drafts to regenerate.
const FORCE = false;

// ═════════════════════════════════════════════════════════════════════════════

const WAVE_6_SLUGS = [
  // ELITE (4) — Premium/Niche Unisex
  "versace-rose-flamboyante-inspired",
  "tobacco-honey-inspired",
  "oud-bouquet-inspired",
  "matiere-noire-inspired",
  // SKYE (4) — Male
  "kouros-silver-inspired",
  "212-heroes-inspired",
  "stronger-with-you-sandalwood-inspired",
  "euphoria-men-inspired",
  // ROSE (5) — Female
  "light-blue-capri-in-love-inspired",
  "jasmin-noir-inspired",
  "cloud-inspired",
  "bombshell-escape-inspired",
  "opium-inspired",
] as const;

const SEP = "═".repeat(72);
const DIV = "─".repeat(72);

async function main(): Promise<void> {
  console.log(`\n${SEP}`);
  console.log("CATALOGUE-WAVE6-P2 — Governed Wave 6 Draft Generation");
  console.log(`Candidates: ${WAVE_6_SLUGS.length}  |  APPROVED: ${APPROVED}  |  FORCE: ${FORCE}`);
  console.log(DIV);

  if (!APPROVED) {
    console.log(`
  STOP — APPROVED is false.

  No AI call has been made.
  No draft has been written.
  No cost has been incurred.

  To proceed (only after CATALOGUE-WAVE6-P2 authorization):
    1. Open: scripts/factory/run-wave-6-controlled.ts
    2. Set: const APPROVED = true;
    3. Ensure ANTHROPIC_API_KEY is set in your environment.
    4. Re-run: npx tsx scripts/factory/run-wave-6-controlled.ts
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
  console.log(`  ✓ Gate — ${WAVE_6_SLUGS.length} governed slugs loaded`);
  console.log(`\n${DIV}`);
  console.log("  Wave 6 slugs:");
  WAVE_6_SLUGS.forEach((slug, i) => {
    const col = i < 4 ? "ELITE" : i < 8 ? "SKYE " : "ROSE ";
    console.log(`    ${String(i + 1).padStart(2, " ")}. [${col}] ${slug}`);
  });
  console.log(DIV);
  console.log("  Invoking BatchFactory...\n");

  const config: BatchConfig = {
    slugs:          [...WAVE_6_SLUGS],
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
  console.log("CATALOGUE-WAVE6-P2 — BATCH COMPLETE");
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

  Next episode: CATALOGUE-WAVE6-P3 — Editorial Review + Incremental Value Assessment.
${SEP}
`);

  process.exit(0);
}

main().catch((err: unknown) => {
  console.error(
    `\n[wave-6-controlled] Fatal: ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exit(1);
});

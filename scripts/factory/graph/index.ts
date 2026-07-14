/**
 * Relationship Graph — CLI entry point and module exports.
 *
 * CLI usage:
 *   npm run mkc:graph             — show graph report
 *   npm run mkc:graph -- --report — same as above
 *   npm run mkc:graph -- --validate  — exit 1 if issues found
 *   npm run mkc:graph -- --stats     — JSON statistics
 *   npm run mkc:graph -- --sync      — add reciprocals to native records for all approved drafts
 */

import path from "path";
import { existsSync, readFileSync } from "fs";

import { buildGraphFromFiles }   from "./RelationshipGraphBuilder";
import { synchronizeForPromotion } from "./RelationshipSynchronizer";
import { validateGraph }         from "./RelationshipValidator";
import { computeStatistics }     from "./RelationshipStatistics";
import { formatReport }          from "./RelationshipReport";
import { logGraphAction }        from "./RelationshipLogger";

// Re-export for PromotionTransaction integration
export { synchronizeForPromotion } from "./RelationshipSynchronizer";
export type { SyncResult, SyncedFile } from "./RelationshipSynchronizer";

// ── Paths ─────────────────────────────────────────────────────────────────────

const NATIVE_DIR = path.join(process.cwd(), "app", "lib", "mkc", "native");
const DRAFT_DIR  = path.join(process.cwd(), "scripts", "factory", "drafts");

// ── CLI ───────────────────────────────────────────────────────────────────────

const args    = process.argv.slice(2);
const hasFlag = (f: string) => args.includes(f);

async function main(): Promise<void> {
  const graph      = buildGraphFromFiles(NATIVE_DIR, DRAFT_DIR);
  const validation = validateGraph(graph);
  const stats      = computeStatistics(graph, validation);

  if (hasFlag("--stats")) {
    console.log(JSON.stringify(stats, null, 2));
    return;
  }

  if (hasFlag("--validate")) {
    console.log(formatReport(stats, validation));
    process.exit(validation.valid ? 0 : 1);
  }

  if (hasFlag("--sync")) {
    const { findRecord } = await import("../review/ReviewRegistry");
    const { readdirSync } = await import("fs");

    const draftSlugs = readdirSync(DRAFT_DIR)
      .filter(f => f.endsWith(".ts"))
      .map(f => f.replace(/\.ts$/, ""))
      .filter(slug => findRecord(slug)?.status === "approved");

    console.log(`[graph:sync] Synchronising ${draftSlugs.length} approved draft(s) into native records`);

    const allResults = [];
    for (const slug of draftSlugs) {
      const draftPath = path.join(DRAFT_DIR, `${slug}.ts`);
      if (!existsSync(draftPath)) continue;
      const draftContent = readFileSync(draftPath, "utf-8");
      const result       = synchronizeForPromotion(slug, draftContent, NATIVE_DIR);
      if (result.reciprocalsAdded.length > 0) {
        console.log(
          `  ✓  ${slug}  reciprocals:${result.reciprocalsAdded.length}  files:${result.modifiedFiles.length}`,
        );
        logGraphAction(
          "sync", slug,
          `reciprocals:${result.reciprocalsAdded.join(",")}  files:${result.modifiedFiles.length}`,
        );
      }
      allResults.push(result);
    }

    // Re-evaluate after sync
    const updated           = buildGraphFromFiles(NATIVE_DIR, DRAFT_DIR);
    const updatedValidation = validateGraph(updated);
    const updatedStats      = computeStatistics(updated, updatedValidation);
    console.log(formatReport(updatedStats, updatedValidation, allResults));
    return;
  }

  // Default: report
  console.log(formatReport(stats, validation));
}

main().catch(err => {
  console.error("[graph] Error:", err);
  process.exit(1);
});

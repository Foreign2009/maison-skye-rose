import { type GraphStatistics } from "./RelationshipStatistics";
import { type GraphValidationResult } from "./RelationshipValidator";
import { type SyncResult } from "./RelationshipSynchronizer";

export function formatReport(
  stats:       GraphStatistics,
  validation:  GraphValidationResult,
  syncResults?: SyncResult[],
): string {
  const lines: string[] = [];

  lines.push("══════════════════════════════════════════════════════");
  lines.push("  Relationship Graph Report");
  lines.push("══════════════════════════════════════════════════════");
  lines.push("");
  lines.push("── Graph Model ──────────────────────────────────────");
  lines.push(`  Nodes:               ${stats.nodeCount}  (native:${stats.nativeNodeCount}  drafts:${stats.draftNodeCount})`);
  lines.push(`  Edges:               ${stats.edgeCount}  (alternatives:${stats.alternativeEdges}  wardrobePartners:${stats.wpEdges})`);
  lines.push(`  Average degree:      ${stats.averageDegree}`);
  lines.push("");
  lines.push("── Validation ───────────────────────────────────────");
  lines.push(`  Status:              ${validation.valid ? "CLEAN" : "ISSUES FOUND"}`);
  lines.push(`  Missing reciprocals: ${stats.missingReciprocals}`);
  lines.push(`  Orphan references:   ${stats.orphanReferences}`);
  lines.push(`  Self references:     ${stats.selfReferences}`);

  if (!validation.valid) {
    lines.push("");
    lines.push("── Issues ───────────────────────────────────────────");
    const shown = validation.issues.slice(0, 25);
    for (const issue of shown) {
      lines.push(`  [${issue.type}] ${issue.message}`);
    }
    if (validation.issues.length > 25) {
      lines.push(`  ... and ${validation.issues.length - 25} more`);
    }
  }

  if (syncResults && syncResults.length > 0) {
    const totalAdded    = syncResults.reduce((n, r) => n + r.reciprocalsAdded.length, 0);
    const totalModified = syncResults.reduce((n, r) => n + r.modifiedFiles.length, 0);
    const totalSkipped  = syncResults.reduce((n, r) => n + r.skipped.length, 0);
    lines.push("");
    lines.push("── Synchronisation ──────────────────────────────────");
    lines.push(`  Records synced:      ${syncResults.length}`);
    lines.push(`  Reciprocals added:   ${totalAdded}`);
    lines.push(`  Files modified:      ${totalModified}`);
    lines.push(`  References skipped:  ${totalSkipped}`);
  }

  lines.push("══════════════════════════════════════════════════════");
  return lines.join("\n");
}

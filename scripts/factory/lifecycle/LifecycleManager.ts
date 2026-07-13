/**
 * Knowledge Lifecycle Manager — Orchestrator
 *
 * Coordinates: scan → save queue → build report → render.
 * This is the only public interface for the lifecycle subsystem.
 */

import { scanLifecycle }                   from "./LifecycleScanner";
import { saveQueue, loadQueue, filterQueue } from "./LifecycleQueue";
import { getResolvedIds, markResolved }    from "./LifecycleRegistry";
import { buildReport, printReport, toJSON } from "./LifecycleReport";
import { logLifecycleAction }              from "./LifecycleLogger";
import type { LifecycleReason }            from "./LifecycleJob";

// ── Manager input ─────────────────────────────────────────────────────────────

export interface LifecycleManagerInput {
  // Filters for scan
  slug?:          string;
  collection?:    "Skye" | "Rose" | "Elite";
  reason?:        string;
  onlyStale?:     boolean;
  onlyFailed?:    boolean;
  onlyRejected?:  boolean;
  // Queue view mode (don't re-scan)
  showQueue?:     boolean;
  showResolved?:  boolean;
  // Resolve a job by ID
  resolveJobId?:  string;
  // Output mode
  json?:          boolean;
}

// ── Main entry ────────────────────────────────────────────────────────────────

export function runLifecycleManager(input: LifecycleManagerInput): void {
  // ── Resolve a job ─────────────────────────────────────────────────────────
  if (input.resolveJobId) {
    markResolved(input.resolveJobId);
    logLifecycleAction("resolve", `job:${input.resolveJobId}`);
    console.log(`[lifecycle] Resolved: ${input.resolveJobId}`);
    return;
  }

  // ── Show persisted queue (no re-scan) ─────────────────────────────────────
  if (input.showQueue) {
    const file        = loadQueue();
    const resolvedIds = getResolvedIds();
    const filtered    = filterQueue(file.jobs, resolvedIds, {
      collection:   input.collection,
      slug:         input.slug,
      reason:       input.reason as LifecycleReason | undefined,
      hideResolved: !input.showResolved,
    });
    const report = buildReport(filtered, resolvedIds, file.scannedCount, file.lastScannedAt);
    if (input.json) {
      console.log(toJSON(report));
    } else {
      printReport(report, resolvedIds);
    }
    return;
  }

  // ── Full scan ─────────────────────────────────────────────────────────────
  const { jobs, scannedCount, scannedAt } = scanLifecycle({
    slugFilter:       input.slug,
    collectionFilter: input.collection,
    reasonFilter:     input.reason as LifecycleReason | undefined,
    onlyStale:        input.onlyStale,
    onlyFailed:       input.onlyFailed,
    onlyRejected:     input.onlyRejected,
  });

  // Save full (unfiltered) queue for subsequent --queue calls
  saveQueue(jobs, scannedAt, scannedCount);
  logLifecycleAction("scan", `scanned:${scannedCount}  jobs:${jobs.length}`);

  const resolvedIds = getResolvedIds();
  const report      = buildReport(jobs, resolvedIds, scannedCount, scannedAt);

  if (input.json) {
    console.log(toJSON(report));
  } else {
    printReport(report, resolvedIds);
  }
}

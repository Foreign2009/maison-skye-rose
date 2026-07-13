/**
 * Knowledge Lifecycle Manager — Queue
 *
 * Persists the latest scan result to lifecycle-queue.json.
 * The queue is the authoritative view of pending lifecycle work.
 *
 * Overwrites on each scan — always reflects current codebase state.
 * Resolved jobs are tracked separately in LifecycleRegistry.
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import type { LifecycleJob, LifecycleSeverity, LifecycleReason } from "./LifecycleJob";

const QUEUE_PATH = path.join(
  process.cwd(), "scripts", "factory", "lifecycle", "lifecycle-queue.json"
);

interface LifecycleQueueFile {
  version:       string;
  lastScannedAt: string;
  scannedCount:  number;
  jobs:          LifecycleJob[];
}

// ── I/O ───────────────────────────────────────────────────────────────────────

function readFile(): LifecycleQueueFile {
  if (!existsSync(QUEUE_PATH)) {
    return { version: "1.0", lastScannedAt: "", scannedCount: 0, jobs: [] };
  }
  try {
    return JSON.parse(readFileSync(QUEUE_PATH, "utf-8")) as LifecycleQueueFile;
  } catch {
    return { version: "1.0", lastScannedAt: "", scannedCount: 0, jobs: [] };
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function saveQueue(
  jobs:         LifecycleJob[],
  scannedAt:    string,
  scannedCount: number,
): void {
  try {
    const file: LifecycleQueueFile = {
      version:       "1.0",
      lastScannedAt: scannedAt,
      scannedCount,
      jobs,
    };
    writeFileSync(QUEUE_PATH, JSON.stringify(file, null, 2) + "\n", "utf-8");
  } catch (err) {
    console.warn(`[lifecycle] Warning: could not write lifecycle-queue.json — ${err instanceof Error ? err.message : err}`);
  }
}

export function loadQueue(): LifecycleQueueFile {
  return readFile();
}

export function filterQueue(
  jobs:          LifecycleJob[],
  resolvedIds:   Set<string>,
  opts: {
    severity?:   LifecycleSeverity;
    reason?:     LifecycleReason;
    collection?: "Skye" | "Rose" | "Elite";
    slug?:       string;
    hideResolved?: boolean;
  } = {},
): LifecycleJob[] {
  return jobs.filter(job => {
    if (opts.hideResolved && resolvedIds.has(job.id)) return false;
    if (opts.severity   && job.severity   !== opts.severity)   return false;
    if (opts.reason     && job.reason     !== opts.reason)     return false;
    if (opts.collection && job.collection !== opts.collection) return false;
    if (opts.slug       && job.slug       !== opts.slug)       return false;
    return true;
  });
}

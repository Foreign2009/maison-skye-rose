/**
 * Knowledge Lifecycle Manager — Registry
 *
 * Tracks which lifecycle jobs have been resolved/acknowledged.
 * Persisted to lifecycle-registry.json.
 *
 * A resolved job is still detected on the next scan (detection is
 * always live from codebase state). Resolution affects display only —
 * resolved jobs are dimmed or hidden in the report.
 *
 * Jobs are resolved by ID: "${slug}::${reason}"
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";

const REGISTRY_PATH = path.join(
  process.cwd(), "scripts", "factory", "lifecycle", "lifecycle-registry.json"
);

interface LifecycleRegistryFile {
  version:    string;
  resolvedAt: Record<string, string>;   // jobId → ISO timestamp
}

// ── I/O ───────────────────────────────────────────────────────────────────────

function readFile(): LifecycleRegistryFile {
  if (!existsSync(REGISTRY_PATH)) return { version: "1.0", resolvedAt: {} };
  try {
    return JSON.parse(readFileSync(REGISTRY_PATH, "utf-8")) as LifecycleRegistryFile;
  } catch {
    return { version: "1.0", resolvedAt: {} };
  }
}

function writeFile(file: LifecycleRegistryFile): void {
  try {
    writeFileSync(REGISTRY_PATH, JSON.stringify(file, null, 2) + "\n", "utf-8");
  } catch (err) {
    console.warn(`[lifecycle] Warning: could not write lifecycle-registry.json — ${err instanceof Error ? err.message : err}`);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function markResolved(jobId: string): void {
  const file = readFile();
  file.resolvedAt[jobId] = new Date().toISOString();
  writeFile(file);
}

export function unmarkResolved(jobId: string): void {
  const file = readFile();
  delete file.resolvedAt[jobId];
  writeFile(file);
}

export function getResolvedIds(): Set<string> {
  return new Set(Object.keys(readFile().resolvedAt));
}

export function isResolved(jobId: string): boolean {
  return jobId in readFile().resolvedAt;
}

export function clearAllResolved(): void {
  writeFile({ version: "1.0", resolvedAt: {} });
}

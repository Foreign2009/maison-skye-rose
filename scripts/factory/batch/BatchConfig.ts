/**
 * Knowledge Factory — Batch Configuration
 *
 * Defines the BatchConfig interface, defaults, and CLI argument parser.
 */

export interface BatchConfig {
  slugs?:         string[];                  // specific slugs to process (undefined = full catalogue)
  collection?:    "Skye" | "Rose" | "Elite"; // filter by collection
  limit?:         number;                    // max records to process this run
  maxConcurrency: number;                    // parallel pipeline runs (default: 3)
  retryCount:     number;                    // retries per failed record (default: 1)
  resumeMode:     boolean;                   // honour .resume-state.json to skip completed records
  skipExisting:   boolean;                   // skip already-native and already-drafted records
  stopOnFailure:  boolean;                   // halt batch on first failure
  dryRun:         boolean;                   // no API calls
  force:          boolean;                   // regenerate existing drafts
}

export const DEFAULT_BATCH_CONFIG: BatchConfig = {
  maxConcurrency: 3,
  retryCount:     1,
  resumeMode:     false,
  skipExisting:   true,
  stopOnFailure:  false,
  dryRun:         false,
  force:          false,
};

export interface ParsedArgs {
  config: Partial<BatchConfig>;
  slugs:  string[];
}

export function parseBatchArgs(argv: string[]): ParsedArgs {
  const config: Partial<BatchConfig> = {};
  const slugs:  string[]             = [];

  for (const arg of argv) {
    if (arg.startsWith("--collection=")) {
      config.collection = arg.replace("--collection=", "") as BatchConfig["collection"];
    } else if (arg.startsWith("--limit=")) {
      const n = parseInt(arg.replace("--limit=", ""), 10);
      if (!isNaN(n) && n > 0) config.limit = n;
    } else if (arg.startsWith("--concurrency=")) {
      const n = parseInt(arg.replace("--concurrency=", ""), 10);
      if (!isNaN(n) && n > 0) config.maxConcurrency = n;
    } else if (arg.startsWith("--retry=")) {
      const n = parseInt(arg.replace("--retry=", ""), 10);
      if (!isNaN(n) && n >= 0) config.retryCount = n;
    } else if (arg === "--resume") {
      config.resumeMode = true;
    } else if (arg === "--force") {
      config.force = true;
    } else if (arg === "--dry-run") {
      config.dryRun = true;
    } else if (arg === "--stop-on-failure") {
      config.stopOnFailure = true;
    } else if (arg === "--continue-on-failure") {
      config.stopOnFailure = false;
    } else if (arg === "--no-skip") {
      config.skipExisting = false;
    } else if (!arg.startsWith("--")) {
      slugs.push(arg.trim());
    }
  }

  if (slugs.length > 0) config.slugs = slugs;

  return { config, slugs };
}

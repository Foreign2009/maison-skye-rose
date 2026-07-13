/**
 * Knowledge Lifecycle Manager — CLI Entry Point
 *
 * Usage:
 *   npm run mkc:lifecycle                         Full scan + report
 *   npm run mkc:lifecycle -- --json               JSON output
 *   npm run mkc:lifecycle -- --queue              Show persisted queue (no rescan)
 *   npm run mkc:lifecycle -- --slug <slug>         Filter by slug
 *   npm run mkc:lifecycle -- --collection Rose     Filter by collection
 *   npm run mkc:lifecycle -- --reason <reason>     Filter by lifecycle reason
 *   npm run mkc:lifecycle -- --only-stale          Version drift only
 *   npm run mkc:lifecycle -- --only-failed         Failed generation/promotion only
 *   npm run mkc:lifecycle -- --only-rejected       Rejected/needs-regen only
 *   npm run mkc:lifecycle -- --resolve <jobId>     Mark job as resolved
 *   npm run mkc:lifecycle -- --show-resolved       Include resolved jobs in report
 *   npm run mkc:lifecycle -- --help                Usage
 */

import { runLifecycleManager } from "./LifecycleManager";

const args    = process.argv.slice(2);
const has     = (f: string): boolean => args.includes(f);
const get     = (f: string): string | undefined => {
  const i = args.indexOf(f);
  return i >= 0 ? args[i + 1] : undefined;
};

if (has("--help") || has("-h")) {
  console.log(`
Knowledge Lifecycle Manager

  npm run mkc:lifecycle                         Scan all records, report lifecycle work
  npm run mkc:lifecycle -- --json               Machine-readable JSON output
  npm run mkc:lifecycle -- --queue              Show last scan (no rescan)
  npm run mkc:lifecycle -- --slug <slug>        Single record
  npm run mkc:lifecycle -- --collection <col>   Filter by Skye | Rose | Elite
  npm run mkc:lifecycle -- --reason <reason>    Filter by reason code
  npm run mkc:lifecycle -- --only-stale         Factory/prompt version drift only
  npm run mkc:lifecycle -- --only-failed        failed_generation | failed_promotion
  npm run mkc:lifecycle -- --only-rejected      rejected_review | needs_regeneration
  npm run mkc:lifecycle -- --resolve <jobId>    Acknowledge a job (slug::reason)
  npm run mkc:lifecycle -- --show-resolved      Include resolved jobs in output

Reason codes:
  factory_version_drift   prompt_version_drift   rejected_review
  needs_regeneration      failed_promotion        failed_generation
  missing_draft           missing_discovery       missing_relationships
  missing_education       validation_regression
`);
  process.exit(0);
}

const collection = get("--collection") as "Skye" | "Rose" | "Elite" | undefined;

runLifecycleManager({
  slug:          get("--slug"),
  collection:    collection,
  reason:        get("--reason"),
  onlyStale:     has("--only-stale"),
  onlyFailed:    has("--only-failed"),
  onlyRejected:  has("--only-rejected"),
  showQueue:     has("--queue"),
  showResolved:  has("--show-resolved"),
  resolveJobId:  get("--resolve"),
  json:          has("--json"),
});

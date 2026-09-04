/**
 * Knowledge Factory — Promotion Transaction
 *
 * Transactional core of the Promotion Pipeline.
 *
 * Sequence per slug:
 *   1. Review gate      — slug must be approved in ReviewRegistry
 *   2. Duplicate check  — not already promoted (unless force)
 *   3. Draft check      — draft file must exist
 *   4. Symbol extract   — parse export name from draft
 *   5. Backup           — snapshot native file + index.ts if they exist
 *   6. Copy             — write draft → app/lib/mkc/native/${slug}.ts (rewrite import path)
 *   7. Index update     — splice import + Map entry into native/index.ts
 *   8. Validate         — npm run mkc:validate
 *   9. Build            — npm run build
 *  10. Commit           — update registries, record history, log
 *
 * Rollback on any failure after step 6: restore native file + index.ts.
 */

import { existsSync, readFileSync, writeFileSync, unlinkSync, copyFileSync } from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { nanoid } from "nanoid";

import { synchronizeForPromotion } from "../graph/RelationshipSynchronizer";
import type { SyncedFile } from "../graph/RelationshipSynchronizer";

import { findRecord, updateRecord } from "../review/ReviewRegistry";
import { logReviewAction } from "../review/ReviewLogger";
import {
  findPromotionRecord, upsertPromotionRecord, updatePromotionRecord,
} from "./PromotionRegistry";
import type { PromotionRecord, PromotionTransactionResult } from "./PromotionRegistry";
import { logPromotionAction } from "./PromotionLogger";
import { recordHistory } from "./PromotionHistory";
import type { PromotionHistoryEntry } from "./PromotionHistory";

const DRAFT_DIR   = path.join(process.cwd(), "scripts", "factory", "drafts");
const NATIVE_DIR  = path.join(process.cwd(), "app", "lib", "mkc", "native");
const NATIVE_IDX  = path.join(NATIVE_DIR, "index.ts");

const DRAFT_IMPORT_PATTERN = "../../../app/lib/mkc/types";
const NATIVE_IMPORT_TARGET = "../types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractSymbol(content: string): string | null {
  const m = content.match(/export const (\w+)\s*:\s*FragranceKnowledge/);
  return m ? m[1] : null;
}

function rewriteImportPath(content: string): string {
  return content.replace(
    /import type\s*\{([^}]+)\}\s*from\s*["']\.\.\/\.\.\/\.\.\/app\/lib\/mkc\/types["']/g,
    `import type {$1} from "${NATIVE_IMPORT_TARGET}"`,
  );
}

function run(cmd: string, args: string[]): { ok: boolean; output: string } {
  const result = spawnSync(cmd, args, {
    cwd:      process.cwd(),
    encoding: "utf-8",
    shell:    true,
    timeout:  300_000,   // 5 min — build can be slow
  });
  const output = (result.stdout ?? "") + (result.stderr ?? "");
  return { ok: result.status === 0, output };
}

function runValidate(): { ok: boolean; output: string; status: PromotionRecord["validationStatus"] } {
  const r = run("npm", ["run", "mkc:validate"]);
  let status: PromotionRecord["validationStatus"] = r.ok ? "PASS" : "FAIL";
  if (r.ok && r.output.includes("warning")) status = "PASS_WITH_WARNINGS";
  return { ...r, status };
}

function runBuild(): { ok: boolean; output: string } {
  return run("npm", ["run", "build"]);
}

// ── Index splice ──────────────────────────────────────────────────────────────

function addToIndex(slug: string, symbol: string): void {
  let content = readFileSync(NATIVE_IDX, "utf-8");

  // Insert import after the last import line (before the blank line before `export const`)
  const importLine = `import { ${symbol} } from "./${slug}";`;
  // Find the last import statement
  const lastImportIdx = content.lastIndexOf("\nimport ");
  const lineEnd = content.indexOf("\n", lastImportIdx + 1);
  content = content.slice(0, lineEnd + 1) + importLine + "\n" + content.slice(lineEnd + 1);

  // Insert Map entry before the closing `]);`
  const mapEntry = `  ["${slug}", ${symbol}],`;
  const closingIdx = content.lastIndexOf("]);");
  content = content.slice(0, closingIdx) + mapEntry + "\n" + content.slice(closingIdx);

  writeFileSync(NATIVE_IDX, content, "utf-8");
}

function removeFromIndex(slug: string, symbol: string): void {
  let content = readFileSync(NATIVE_IDX, "utf-8");
  // Remove import line (with trailing newline)
  content = content.replace(new RegExp(`import \\{ ${symbol} \\} from "\\.\\/${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}";\n`), "");
  // Remove Map entry (with trailing newline)
  content = content.replace(new RegExp(`  \\["${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}", ${symbol}\\],\n`), "");
  writeFileSync(NATIVE_IDX, content, "utf-8");
}

// ── Rollback ──────────────────────────────────────────────────────────────────

interface Backup {
  nativePath:    string;
  nativeContent: string | null;   // null = file did not exist before
  indexContent:  string;
  syncedFiles:   SyncedFile[];    // native files modified by relationship sync
}

function rollback(backup: Backup, slug: string, symbol: string): void {
  // Restore index.ts
  writeFileSync(NATIVE_IDX, backup.indexContent, "utf-8");

  // Restore native file
  if (backup.nativeContent === null) {
    if (existsSync(backup.nativePath)) unlinkSync(backup.nativePath);
  } else {
    writeFileSync(backup.nativePath, backup.nativeContent, "utf-8");
  }

  // Restore native records modified by relationship sync
  for (const f of backup.syncedFiles) {
    writeFileSync(f.path, f.originalContent, "utf-8");
  }
}

// ── Guard helper ─────────────────────────────────────────────────────────────

/**
 * Pure guard decision: should normal promotion be blocked because a native
 * MKC file already exists and the operator has not asserted --force?
 *
 * Exported for regression testing only — do not call outside PromotionTransaction.
 */
export function shouldBlockNativeOverwrite(nativeExists: boolean, force: boolean): boolean {
  return !force && nativeExists;
}

// ── Main transaction ──────────────────────────────────────────────────────────

export async function promoteSingle(
  slug:     string,
  operator: string,
  force:    boolean = false,
): Promise<PromotionTransactionResult> {
  const startedAt  = Date.now();
  const promotionId = nanoid(12);

  const elapsed = (): number => Date.now() - startedAt;
  const fail = (
    outcome: PromotionTransactionResult["outcome"],
    message: string,
    error: string | null = null,
  ): PromotionTransactionResult => ({
    outcome, slug, name: slug, nativePath: null,
    validationStatus: null, buildResult: null,
    durationMs: elapsed(), error, message,
  });

  // ── 1. Review gate ────────────────────────────────────────────────────────
  const reviewRecord = findRecord(slug);
  if (!reviewRecord) {
    return fail("review_required", `${slug} is not in the review queue — add it first.`);
  }
  if (reviewRecord.status !== "approved") {
    return fail(
      "review_required",
      `${slug} has not been approved (status: ${reviewRecord.status}).`,
    );
  }

  const name       = reviewRecord.name;
  const collection = reviewRecord.collection;
  const reviewedBy = reviewRecord.reviewer ?? "unknown";

  // ── 2. Duplicate check ────────────────────────────────────────────────────
  if (!force) {
    const existing = findPromotionRecord(slug);
    if (existing?.status === "promoted") {
      return { ...fail("already_promoted", `${name} is already promoted to native.`), name };
    }
  }

  // ── 3. Draft check ────────────────────────────────────────────────────────
  const draftPath  = path.join(DRAFT_DIR, `${slug}.ts`);
  if (!existsSync(draftPath)) {
    return { ...fail("no_draft", `Draft not found: drafts/${slug}.ts`), name };
  }

  const draftContent = readFileSync(draftPath, "utf-8");

  // ── 4. Symbol extraction ──────────────────────────────────────────────────
  const symbol = extractSymbol(draftContent);
  if (!symbol) {
    return {
      ...fail("error", `Could not extract export symbol from drafts/${slug}.ts`),
      name,
    };
  }

  const nativePath = path.join(NATIVE_DIR, `${slug}.ts`);

  // ── 4.5 Native existence guard ────────────────────────────────────────────
  // Normal promotion must never overwrite an existing native MKC record.
  // This guard fires before any registry write, log entry, or file mutation.
  // Use --force only when intentional native replacement is required and the
  // draft has been fully reconciled with the existing native record.
  if (shouldBlockNativeOverwrite(existsSync(nativePath), force)) {
    return {
      ...fail(
        "native_exists",
        `${name} already has a native MKC record ` +
        `(${path.relative(process.cwd(), nativePath).replace(/\\/g, "/")}). ` +
        `Normal promotion cannot overwrite an existing native record. ` +
        `Use --force only if intentional replacement is required and ` +
        `the draft has been fully reconciled with the native record.`,
      ),
      name,
    };
  }

  // ── 5. Backup ─────────────────────────────────────────────────────────────
  const backup: Backup = {
    nativePath,
    nativeContent: existsSync(nativePath) ? readFileSync(nativePath, "utf-8") : null,
    indexContent:  readFileSync(NATIVE_IDX, "utf-8"),
    syncedFiles:   [],
  };

  // ── Register in-progress ──────────────────────────────────────────────────
  const promotionRecord: PromotionRecord = {
    slug, name, collection, operator, reviewedBy,
    status:           "in_progress",
    startedAt:        new Date(startedAt).toISOString(),
    completedAt:      null,
    nativePath:       path.relative(process.cwd(), nativePath).replace(/\\/g, "/"),
    validationStatus: null,
    buildResult:      null,
    durationMs:       null,
    error:            null,
  };
  upsertPromotionRecord(promotionRecord);
  logPromotionAction("promotion_started", slug, operator, `symbol:${symbol}  reviewedBy:${reviewedBy}`);

  // ── 6. Copy draft → native ────────────────────────────────────────────────
  const nativeContent = rewriteImportPath(draftContent);
  writeFileSync(nativePath, nativeContent, "utf-8");

  // ── 7. Index update ───────────────────────────────────────────────────────
  // Guard: only add if not already in the index
  const currentIndex = readFileSync(NATIVE_IDX, "utf-8");
  const alreadyInIndex = currentIndex.includes(`from "./${slug}"`);
  if (!alreadyInIndex) {
    addToIndex(slug, symbol);
  }

  // ── Helper: perform rollback + fail ───────────────────────────────────────
  const doRollback = (
    outcome: PromotionTransactionResult["outcome"],
    message: string,
    errMsg:  string,
    valStatus: PromotionRecord["validationStatus"],
    buildRes:  PromotionRecord["buildResult"],
    diagnosticOutput?: string,
  ): PromotionTransactionResult => {
    rollback(backup, slug, symbol);

    const completedAt = new Date().toISOString();

    // Persist full validator/build output in history for post-mortem diagnosis
    const errorDetail = diagnosticOutput
      ? `${errMsg}\n--- validator output ---\n${diagnosticOutput.trim()}`
      : errMsg;

    const historyEntry: PromotionHistoryEntry = {
      promotionId,
      slug, name, collection, operator, reviewedBy,
      factoryVersion:   extractFactoryVersion(draftContent),
      promptVersions:   extractPromptVersions(draftContent),
      startedAt:        new Date(startedAt).toISOString(),
      completedAt,
      durationMs:       elapsed(),
      outcome:          "rolled_back",
      validationStatus: valStatus,
      buildResult:      buildRes,
      nativePath:       null,
      error:            errorDetail,
    };
    recordHistory(historyEntry);

    updatePromotionRecord(slug, {
      status:           "rolled_back",
      completedAt,
      validationStatus: valStatus,
      buildResult:      buildRes,
      durationMs:       elapsed(),
      error:            errorDetail,
    });

    logPromotionAction("promotion_rolled_back", slug, operator, `reason:${errMsg}`);

    return {
      outcome, slug, name, nativePath: null,
      validationStatus: valStatus,
      buildResult:      buildRes,
      durationMs:       elapsed(),
      error:            errorDetail,
      message,
    };
  };

  // ── 7.5 Relationship sync ─────────────────────────────────────────────────
  // Adds reciprocal edges to referenced native records before validation runs.
  const syncResult = synchronizeForPromotion(slug, draftContent, NATIVE_DIR);
  backup.syncedFiles = syncResult.modifiedFiles;
  if (syncResult.reciprocalsAdded.length > 0) {
    logPromotionAction(
      "relationships_synced", slug, operator,
      `reciprocals:${syncResult.reciprocalsAdded.length}  files:${syncResult.modifiedFiles.length}`,
    );
  }

  // ── 8. Validate ───────────────────────────────────────────────────────────
  const validateResult = runValidate();
  if (!validateResult.ok) {
    return doRollback(
      "validation_failed",
      `Validation failed for ${name} — files rolled back.`,
      "mkc:validate returned non-zero exit code",
      "FAIL",
      null,
      validateResult.output,
    );
  }

  // ── 9. Build ──────────────────────────────────────────────────────────────
  const buildResult = runBuild();
  if (!buildResult.ok) {
    return doRollback(
      "build_failed",
      `Build failed for ${name} — files rolled back.`,
      "npm run build returned non-zero exit code",
      validateResult.status,
      "fail",
      buildResult.output,
    );
  }

  // ── 10. Commit ────────────────────────────────────────────────────────────
  const completedAt = new Date().toISOString();
  const relNativePath = path.relative(process.cwd(), nativePath).replace(/\\/g, "/");

  const historyEntry: PromotionHistoryEntry = {
    promotionId,
    slug, name, collection, operator, reviewedBy,
    factoryVersion:   extractFactoryVersion(draftContent),
    promptVersions:   extractPromptVersions(draftContent),
    startedAt:        new Date(startedAt).toISOString(),
    completedAt,
    durationMs:       elapsed(),
    outcome:          "promoted",
    validationStatus: validateResult.status,
    buildResult:      "pass",
    nativePath:       relNativePath,
    error:            null,
  };
  recordHistory(historyEntry);

  updatePromotionRecord(slug, {
    status:           "promoted",
    completedAt,
    validationStatus: validateResult.status,
    buildResult:      "pass",
    durationMs:       elapsed(),
    error:            null,
  });

  // Mark the review record as no longer actionable (optional audit trail)
  logReviewAction("promoted", slug, operator, `promotionId:${promotionId}  nativePath:${relNativePath}`);
  logPromotionAction("promotion_completed", slug, operator, `promotionId:${promotionId}  validation:${validateResult.status}  nativePath:${relNativePath}`);

  return {
    outcome:          "promoted",
    slug,
    name,
    nativePath:       relNativePath,
    validationStatus: validateResult.status,
    buildResult:      "pass",
    durationMs:       elapsed(),
    error:            null,
    message:          `${name} successfully promoted to native MKC.`,
  };
}

// ── Draft header parsers ──────────────────────────────────────────────────────

function extractFactoryVersion(content: string): string {
  const m = content.match(/Factory version:\s+(.+)/);
  return m?.[1]?.trim() ?? "unknown";
}

function extractPromptVersions(content: string): string {
  const m = content.match(/Prompt versions:\s+(.+)/);
  return m?.[1]?.trim() ?? "unknown";
}

/**
 * Knowledge Factory — Promotion Manager
 *
 * The only factory module that writes to app/lib/mkc/native/.
 *
 * Promotion flow:
 *   1. Verify the draft file exists in scripts/factory/drafts/
 *   2. Re-derive the scaffold record for validation
 *      (P1 limitation: validates the scaffold, not the draft file content.
 *       P2 will implement draft-content validation via dynamic import.)
 *   3. Run full validation including cross-record relationship checks
 *   4. If FAIL → abort, print errors, return validation_failed
 *   5. If PASS → copy draft to app/lib/mkc/native/[slug].ts
 *   6. Update app/lib/mkc/native/index.ts (import + Map entry)
 *   7. Run npm run build
 *   8. If build FAIL → revert both writes, return build_failed
 *   9. If all PASS → log promotion, print commit instructions, return promoted
 *
 * Invariant: the repository is always left in a clean state.
 *            No partial writes survive a failure.
 */

import { existsSync, readFileSync, writeFileSync, copyFileSync, unlinkSync } from "fs";
import path from "path";
import { intake }                from "../intake";
import { scaffold }              from "../scaffold";
import { validateKnowledgeRecord } from "../../../app/lib/mkc/validator";
import { nativeFragrances }        from "../../../app/lib/mkc/native/index";
import { markPromoted }            from "../metrics/factoryLogger";
import { verifyBuild }             from "./buildVerifier";
import type { PromotionInput, PromotionResult } from "../types";
import { deriveConstName }         from "../intake";

// ── Paths ─────────────────────────────────────────────────────────────────────

const ROOT       = process.cwd();
const DRAFT_DIR  = path.join(ROOT, "scripts", "factory", "drafts");
const NATIVE_DIR = path.join(ROOT, "app", "lib", "mkc", "native");
const INDEX_PATH = path.join(NATIVE_DIR, "index.ts");

// ── Promotion ─────────────────────────────────────────────────────────────────

export async function promote(input: PromotionInput): Promise<PromotionResult> {
  const { slug, force } = input;

  // ── 1. Verify draft exists ──────────────────────────────────────────────────
  const draftPath  = path.join(DRAFT_DIR, `${slug}.ts`);
  const nativePath = path.join(NATIVE_DIR, `${slug}.ts`);

  if (!existsSync(draftPath)) {
    return {
      status:     "no_draft",
      nativePath: null,
      errors:     [`No draft found at scripts/factory/drafts/${slug}.ts`],
      message:    `No draft found. Run: npm run mkc:factory -- "${slug}" first.`,
    };
  }

  // ── Guard: already promoted? ────────────────────────────────────────────────
  if (existsSync(nativePath) && !force) {
    return {
      status:     "rejected",
      nativePath: null,
      errors:     [`${slug} is already in the native registry.`],
      message:    `Already promoted. Use --force to overwrite.`,
    };
  }

  // ── 2. Re-derive record for validation ─────────────────────────────────────
  // P1 limitation: validates the derived scaffold, not the draft file content.
  // This is correct for P1 where drafts contain only deterministic fields.
  // P2 will replace this with dynamic import of the authored draft content.
  const intakeResult = intake({ slug, force: true });
  if (intakeResult.status === "not_found" || !intakeResult.intake) {
    return {
      status:     "rejected",
      nativePath: null,
      errors:     [`Could not locate supplier record for slug: ${slug}`],
      message:    `Supplier record not found. Slug: ${slug}`,
    };
  }

  // Only fragrance slugs can reach this point today: home fragrance has no
  // producer set, so no drafts are ever created for it. The guard below makes
  // this constraint explicit and narrows the intake type for TypeScript so no
  // type assertion is needed at the scaffold() call site.
  const productIntake = intakeResult.intake;
  if (productIntake.category !== "fragrance") {
    return {
      status:     "rejected",
      nativePath: null,
      errors:     [`Promotion for category "${productIntake.category}" is not supported yet.`],
      message:    `Promotion is not supported for category "${productIntake.category}". Only fragrance records can be promoted.`,
    };
  }
  // productIntake is now FragranceIntake (narrowed by TypeScript control-flow analysis).
  const { record } = scaffold(productIntake);

  // ── 3. Full cross-record validation ─────────────────────────────────────────
  // allRecords includes the current native registry (cross-record relationship checks)
  const allRecords = new Map(nativeFragrances);
  const result = validateKnowledgeRecord(record, allRecords);

  if (result.status === "FAIL") {
    const errorLines = result.errors.map(e =>
      `  [${e.code}] ${e.field}: ${e.message}`
    );
    return {
      status:     "validation_failed",
      nativePath: null,
      errors:     errorLines,
      message:    `Validation FAIL — ${result.totalErrors} error(s), ${result.totalWarnings} warning(s). Resolve all errors before promotion.`,
    };
  }

  // ── 4. Copy draft to native registry ───────────────────────────────────────
  let nativeWritten  = false;
  let indexBackup    = "";
  let indexModified  = false;

  try {
    copyFileSync(draftPath, nativePath);
    nativeWritten = true;
    console.log(`  ✓  Copied  app/lib/mkc/native/${slug}.ts`);

    // ── 5. Update native/index.ts ─────────────────────────────────────────────
    const constName = deriveConstName(slug);
    indexBackup     = readFileSync(INDEX_PATH, "utf-8");

    const updatedIndex = updateNativeIndex(indexBackup, slug, constName);
    writeFileSync(INDEX_PATH, updatedIndex, "utf-8");
    indexModified = true;
    console.log(`  ✓  Registered ${constName} in native/index.ts`);

    // ── 6. Build verification ─────────────────────────────────────────────────
    console.log(`  ⏳  Running npm run build...`);
    const buildResult = verifyBuild();

    if (!buildResult.success) {
      // Revert all writes
      if (indexModified && indexBackup) {
        writeFileSync(INDEX_PATH, indexBackup, "utf-8");
        console.log(`  ↩  Reverted native/index.ts`);
      }
      if (nativeWritten) {
        unlinkSync(nativePath);
        console.log(`  ↩  Removed app/lib/mkc/native/${slug}.ts`);
      }

      return {
        status:     "build_failed",
        nativePath: null,
        errors:     ["Build failed after promotion. All writes reverted."],
        message:    "Build failure. Run `npm run build` manually to diagnose.",
      };
    }

    // ── 7. Log and report ─────────────────────────────────────────────────────
    markPromoted(slug);

    console.log(`\n  ✅  Promotion complete: ${slug}`);
    console.log(`\n  Next step:`);
    console.log(`      git add app/lib/mkc/native/${slug}.ts app/lib/mkc/native/index.ts`);
    console.log(`      git commit -m "Add native record: ${slug} (P7.0 factory)"\n`);

    return {
      status:     "promoted",
      nativePath: `app/lib/mkc/native/${slug}.ts`,
      errors:     [],
      message:    `Promoted ${slug} to native registry. Build verified.`,
    };

  } catch (err) {
    // Unexpected error — attempt rollback
    if (indexModified && indexBackup) {
      try { writeFileSync(INDEX_PATH, indexBackup, "utf-8"); } catch { /* ignore */ }
    }
    if (nativeWritten && existsSync(nativePath)) {
      try { unlinkSync(nativePath); } catch { /* ignore */ }
    }

    const msg = err instanceof Error ? err.message : String(err);
    return {
      status:     "build_failed",
      nativePath: null,
      errors:     [msg],
      message:    `Unexpected error during promotion: ${msg}`,
    };
  }
}

// ── Index updater ─────────────────────────────────────────────────────────────

function updateNativeIndex(source: string, slug: string, constName: string): string {
  const lines = source.split("\n");

  // Insert import after the last `import` line
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("import ")) lastImportIdx = i;
  }

  if (lastImportIdx < 0) {
    throw new Error("Could not find import block in native/index.ts — add the import manually.");
  }

  lines.splice(lastImportIdx + 1, 0, `import { ${constName} } from "./${slug}";`);

  // Insert Map entry before the closing `]);`
  const closingIdx = lines.findIndex(l => l.trim() === "]);");
  if (closingIdx < 0) {
    throw new Error("Could not find `]);` in native/index.ts — add the Map entry manually.");
  }

  lines.splice(closingIdx, 0, `  ["${slug}", ${constName}],`);

  return lines.join("\n");
}

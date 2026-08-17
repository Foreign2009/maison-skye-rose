import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { extractRelationships } from "./RelationshipGraphBuilder";

export interface SyncedFile {
  path:            string;
  originalContent: string;
}

export interface SyncResult {
  slug:             string;
  reciprocalsAdded: string[];    // "field:targetSlug" entries
  modifiedFiles:    SyncedFile[];
  skipped:          string[];    // "field:targetSlug" — target not in native
}

type SymmetricField = "alternatives" | "wardrobePartners";

// ── String manipulation ───────────────────────────────────────────────────────

const BLOCK_RX = /(  relationships:\s*\{)([^}]*?)(\s*\},)/;

/**
 * Adds `slugToAdd` to the `fieldName` array inside the relationships block of
 * a native record file. Returns the modified content, or null if the slug is
 * already present (no change needed).
 *
 * Handles three cases:
 *  A. relationships block exists, field exists  → append to existing array
 *  B. relationships block exists, field missing → add new field to block
 *  C. no relationships block                    → add block before Intelligence section
 */
export function addSlugToRelationshipField(
  content:    string,
  fieldName:  SymmetricField,
  slugToAdd:  string,
): string | null {
  const blockMatch = content.match(BLOCK_RX);

  if (blockMatch) {
    const innerContent = blockMatch[2];

    // Already present in this block — nothing to do
    if (innerContent.includes(`"${slugToAdd}"`)) return null;

    // Try to find the specific field inside the block
    const fieldRx = new RegExp(`(\\s+${fieldName}\\s*:\\s*\\[)([^\\]]*)(\\])`);
    const fieldMatch = innerContent.match(fieldRx);

    if (fieldMatch) {
      // A. Append slug to the existing array
      const existing = fieldMatch[2];
      let newInner: string;

      if (existing.includes("\n")) {
        // Multi-line: existing ends with ",<indent>" before the closing `]`.
        // A naive sep+slug after this whitespace creates a sparse-array comma hole.
        // Extract the closing whitespace and insert the new element on its own line.
        const closingWsMatch = existing.match(/,(\s+)$/);
        if (closingWsMatch) {
          const closingWs   = closingWsMatch[1];
          const elemWsMatch = existing.match(/^(\s+)/);
          const elemWs      = elemWsMatch ? elemWsMatch[1] : closingWs + "  ";
          const base        = existing.slice(0, existing.length - closingWs.length);
          newInner = innerContent.replace(
            fieldRx,
            `$1${base}${elemWs}"${slugToAdd}",${closingWs}$3`,
          );
        } else {
          // Multi-line without trailing comma — trim and append inline
          const trimmed = existing.trimEnd();
          const sep     = trimmed ? ", " : "";
          newInner = innerContent.replace(
            fieldRx,
            `$1${trimmed}${sep}"${slugToAdd}"$3`,
          );
        }
      } else {
        // Single-line array
        const sep = existing.trim() ? ", " : "";
        newInner = innerContent.replace(
          fieldRx,
          `$1${existing}${sep}"${slugToAdd}"$3`,
        );
      }

      return content.replace(BLOCK_RX, `$1${newInner}$3`);
    } else {
      // B. Add a new field before the closing brace
      const trimmed    = innerContent.trimEnd();
      const closingWs  = innerContent.length === 0 ? "\n  " : innerContent.slice(trimmed.length);
      const newField   = `\n    ${fieldName}: ["${slugToAdd}"],`;
      const newInner   = trimmed + newField + closingWs;
      return content.replace(BLOCK_RX, `$1${newInner}$3`);
    }
  } else {
    // C. No relationships block — insert one before the Intelligence section
    const intelligenceRx = /\n  \/\/ ── Intelligence/;
    if (!intelligenceRx.test(content)) return null;

    const block = [
      ``,
      `  // ── Relationships ─────────────────────────────────────────────────────────────`,
      `  relationships: {`,
      `    ${fieldName}: ["${slugToAdd}"],`,
      `  },`,
    ].join("\n");

    return content.replace(intelligenceRx, block + "\n\n  // ── Intelligence");
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Called by the Promotion Pipeline (between index-update and validation).
 *
 * Reads relationship data from the draft content, finds the corresponding
 * native records, and adds reciprocal edges. Returns modified file paths +
 * original content so the Promotion Transaction can roll back if needed.
 */
export function synchronizeForPromotion(
  slug:         string,
  draftContent: string,
  nativeDir:    string,
): SyncResult {
  const result: SyncResult = {
    slug,
    reciprocalsAdded: [],
    modifiedFiles:    [],
    skipped:          [],
  };

  const rels = extractRelationships(draftContent);
  const targets: Array<{ slugs: string[]; field: SymmetricField }> = [
    { slugs: rels.alternatives,     field: "alternatives" },
    { slugs: rels.wardrobePartners, field: "wardrobePartners" },
  ];

  for (const { slugs, field } of targets) {
    for (const targetSlug of slugs) {
      const targetPath = path.join(nativeDir, `${targetSlug}.ts`);

      if (!existsSync(targetPath)) {
        result.skipped.push(`${field}:${targetSlug}`);
        continue;
      }

      const originalContent = readFileSync(targetPath, "utf-8");
      const updated = addSlugToRelationshipField(originalContent, field, slug);

      if (updated === null) continue;  // Already had reciprocal

      writeFileSync(targetPath, updated, "utf-8");
      result.modifiedFiles.push({ path: targetPath, originalContent });
      result.reciprocalsAdded.push(`${field}:${targetSlug}`);
    }
  }

  return result;
}

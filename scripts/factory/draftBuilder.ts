/**
 * Knowledge Factory — Draft Builder
 *
 * Produces the TypeScript draft file from the complete PipelineState.
 * The draft is a valid TypeScript module that the author reviews before promotion.
 *
 * Draft format:
 *   - Factory header block (metadata, validation status, review checklist)
 *   - import type { FragranceKnowledge } from "../../../app/lib/mkc/types"
 *   - export const [constName]: FragranceKnowledge = { ... }
 *   - Inline FACTORY_ERROR / FACTORY_WARN annotations after affected fields
 *   - Relationship suggestions footer (empty in P1)
 *
 * The generated file is always valid TypeScript — TypeScript errors would break
 * `npm run build`. All required FragranceKnowledge fields are present even if
 * with placeholder values. The validator catches semantic incompleteness.
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";
import type { PipelineState, DraftBuilderInput, DraftBuilderResult } from "./types";
import type { ValidationIssue } from "../../app/lib/mkc/validator";
import type { FragranceKnowledge } from "../../app/lib/mkc/types";
import { deriveConstName } from "./intake";

// ── Annotation map ────────────────────────────────────────────────────────────
// Maps field paths (as used in ValidationIssue.field) to annotation strings.

type AnnotationMap = Map<string, string[]>;

function buildAnnotationMap(issues: ValidationIssue[]): AnnotationMap {
  const map = new Map<string, string[]>();
  for (const issue of issues) {
    const tag     = issue.severity === "error" ? "FACTORY_ERROR" : "FACTORY_WARN";
    const comment = `// ${tag}: ${issue.code} — ${issue.message}`;
    const existing = map.get(issue.field) ?? [];
    existing.push(comment);
    map.set(issue.field, existing);
  }
  return map;
}

// ── Value rendering ───────────────────────────────────────────────────────────

function renderStr(s: string): string {
  return JSON.stringify(s);
}

function renderStrArray(arr: string[], indent = "  "): string {
  if (arr.length === 0) return "[]";
  // Inline for short arrays (≤ 4 items, each ≤ 40 chars)
  if (arr.length <= 4 && arr.every(s => s.length <= 40)) {
    return `[${arr.map(renderStr).join(", ")}]`;
  }
  const inner = arr.map(s => `${indent}  ${renderStr(s)}`).join(",\n");
  return `[\n${inner},\n${indent}]`;
}

function renderAnnotations(map: AnnotationMap, field: string): string {
  const lines = map.get(field);
  if (!lines || lines.length === 0) return "";
  return `  ${lines.join("\n  ")}\n`;
}

// Appends trailing annotation(s) to a field line.
// Returns "" if no annotation for this field.
function trailingAnnotation(map: AnnotationMap, field: string): string {
  const lines = map.get(field);
  if (!lines || lines.length === 0) return "";
  return "  " + lines.join("  ");
}

// ── Field line builder ────────────────────────────────────────────────────────

function fieldLine(
  name:  string,
  value: string,
  annotation: string,
): string {
  const base = `  ${name.padEnd(14)}: ${value},`;
  return annotation ? `${base}${annotation}` : base;
}

// ── Section: Identity ─────────────────────────────────────────────────────────

function renderIdentity(r: FragranceKnowledge, ann: AnnotationMap): string {
  return [
    `  // ── Identity ──────────────────────────────────────────────────────────────────`,
    fieldLine("id",             renderStr(r.id),             trailingAnnotation(ann, "id")),
    fieldLine("slug",           renderStr(r.slug),           trailingAnnotation(ann, "slug")),
    fieldLine("brand",          renderStr(r.brand),          trailingAnnotation(ann, "brand")),
    fieldLine("name",           renderStr(r.name),           trailingAnnotation(ann, "name")),
    fieldLine("collection",     renderStr(r.collection),     trailingAnnotation(ann, "collection")),
    fieldLine("catalogVersion", renderStr(r.catalogVersion ?? "1.0"), trailingAnnotation(ann, "catalogVersion")),
    fieldLine("status",         renderStr(r.status ?? "active"), trailingAnnotation(ann, "status")),
  ].join("\n");
}

// ── Section: Classification ───────────────────────────────────────────────────

function renderClassification(r: FragranceKnowledge, ann: AnnotationMap): string {
  return [
    ``,
    `  // ── Classification ────────────────────────────────────────────────────────────`,
    fieldLine("gender",         renderStr(r.gender),           trailingAnnotation(ann, "gender")),
    fieldLine("family",         renderStrArray(r.family),      trailingAnnotation(ann, "family")),
    fieldLine("scentCharacter", renderStr(r.scentCharacter),   trailingAnnotation(ann, "scentCharacter")),
    fieldLine("projection",     renderStr(r.projection),       trailingAnnotation(ann, "projection")),
  ].join("\n");
}

// ── Section: Composition ──────────────────────────────────────────────────────

function renderComposition(r: FragranceKnowledge, ann: AnnotationMap): string {
  const topAnn   = trailingAnnotation(ann, "notes.top");
  const heartAnn = trailingAnnotation(ann, "notes.heart");
  const baseAnn  = trailingAnnotation(ann, "notes.base");

  const topLine   = `    top:   ${renderStrArray(r.notes.top,   "    ")},${topAnn}`;
  const heartLine = `    heart: ${renderStrArray(r.notes.heart, "    ")},${heartAnn}`;
  const baseLine  = `    base:  ${renderStrArray(r.notes.base,  "    ")},${baseAnn}`;

  return [
    ``,
    `  // ── Composition ─────────────────────────────────────────────────────────────`,
    fieldLine("profile", renderStr(r.profile), trailingAnnotation(ann, "profile")),
    fieldLine("season",  renderStr(r.season),  trailingAnnotation(ann, "season")),
    `  notes: {`,
    topLine,
    heartLine,
    baseLine,
    `  },`,
    fieldLine("mood",    renderStr(r.mood),    trailingAnnotation(ann, "mood")),
  ].join("\n");
}

// ── Section: Discovery ────────────────────────────────────────────────────────

function renderDiscovery(r: FragranceKnowledge, ann: AnnotationMap): string {
  return [
    ``,
    `  // ── Discovery ───────────────────────────────────────────────────────────────`,
    fieldLine("vibe",           renderStrArray(r.vibe),           trailingAnnotation(ann, "vibe")),
    fieldLine("occasions",      renderStrArray(r.occasions),      trailingAnnotation(ann, "occasions")),
    fieldLine("seasons",        renderStrArray(r.seasons),        trailingAnnotation(ann, "seasons")),
    fieldLine("signatureStyle", renderStrArray(r.signatureStyle), trailingAnnotation(ann, "signatureStyle")),
    fieldLine("recommendedFor", renderStrArray(r.recommendedFor), trailingAnnotation(ann, "recommendedFor")),
  ].join("\n");
}

// ── Section: Merchandising ────────────────────────────────────────────────────

function renderMerchandising(r: FragranceKnowledge, ann: AnnotationMap): string {
  const p = r.prices;
  const i = r.images;

  const pricesBlock = [
    `  prices: {`,
    `    "5ml":  ${p["5ml"]},${trailingAnnotation(ann, "prices.5ml")}`,
    `    "10ml": ${p["10ml"]},${trailingAnnotation(ann, "prices.10ml")}`,
    `    "30ml": ${p["30ml"]},${trailingAnnotation(ann, "prices.30ml")}`,
    `  },`,
  ].join("\n");

  const imagesBlock = [
    `  images: {`,
    `    "5ml":  ${renderStr(i["5ml"])},${trailingAnnotation(ann, "images.5ml")}`,
    `    "10ml": ${renderStr(i["10ml"])},${trailingAnnotation(ann, "images.10ml")}`,
    `    "30ml": ${renderStr(i["30ml"])},${trailingAnnotation(ann, "images.30ml")}`,
    `  },`,
  ].join("\n");

  return [
    ``,
    `  // ── Merchandising ───────────────────────────────────────────────────────────`,
    pricesBlock,
    imagesBlock,
    fieldLine("bestSeller", String(r.bestSeller), trailingAnnotation(ann, "bestSeller")),
    fieldLine("newArrival",  String(r.newArrival), trailingAnnotation(ann, "newArrival")),
  ].join("\n");
}

// ── Section: Education ────────────────────────────────────────────────────────

function renderEducation(r: FragranceKnowledge, ann: AnnotationMap): string {
  const lines: string[] = [
    ``,
    `  // ── Education ───────────────────────────────────────────────────────────────`,
  ];

  if (r.subtitle !== undefined) {
    lines.push(fieldLine("subtitle", renderStr(r.subtitle), trailingAnnotation(ann, "subtitle")));
  } else {
    lines.push(`  // subtitle:     (not set)`);
  }

  // description — render when set (after P3 Editorial Producer), otherwise comment
  if (r.description !== undefined) {
    lines.push(fieldLine("description", renderStr(r.description), trailingAnnotation(ann, "description")));
  } else {
    const descAnn = ann.get("description");
    if (descAnn) {
      lines.push(`  // description:  (not set — required)`);
      lines.push(`  //  ${descAnn.join("\n  //  ")}`);
    } else {
      lines.push(`  // description:  (not set)`);
    }
  }

  // Academy fields — omitted until P4
  const academyAnn = ann.get("academyArticleIds");
  if (academyAnn) {
    lines.push(`  // academyArticleIds: (not set — will be linked in P4)  ${academyAnn.join("  ")}`);
  }

  return lines.join("\n");
}

// ── Section: Intelligence ─────────────────────────────────────────────────────

function renderIntelligence(r: FragranceKnowledge, ann: AnnotationMap): string {
  return [
    ``,
    `  // ── Intelligence ────────────────────────────────────────────────────────────`,
    `  // Approximated from profile + season. Calibrated by Intelligence Producer in P2.`,
    fieldLine("sweetness",   String(r.sweetness),   trailingAnnotation(ann, "sweetness")),
    fieldLine("freshness",   String(r.freshness),   trailingAnnotation(ann, "freshness")),
    fieldLine("warmth",      String(r.warmth),       trailingAnnotation(ann, "warmth")),
    fieldLine("intensity",   String(r.intensity),   trailingAnnotation(ann, "intensity")),
    fieldLine("versatility", String(r.versatility), trailingAnnotation(ann, "versatility")),
    fieldLine("popularity",  String(r.popularity),  trailingAnnotation(ann, "popularity")),
  ].join("\n");
}

// ── Relationship suggestions footer ──────────────────────────────────────────

function renderRelationshipFooter(): string {
  return `
  // ── FACTORY: Relationship Suggestions (P1 — not populated) ──────────────────
  // Relationship suggestions require the Relationship Producer (P3 AI enrichment).
  // They will appear here after re-running the factory with P3 active.
  //
  // To implement manually, add a relationships block:
  //   relationships: {
  //     alternatives:     [],  // slugs of comparable alternatives — must be symmetric
  //     wardrobePartners: [],  // slugs to own alongside this — must be symmetric
  //     evolutionOf:      "",  // predecessor slug if this is a line evolution
  //     evolutions:       [],  // successor slugs that evolved from this
  //   },
  //
  // IMPORTANT: All relationship fields require reciprocal entries in the
  // referenced records. Run npm run mkc:validate to verify integrity.`;
}

// ── Header ────────────────────────────────────────────────────────────────────

function renderPromptVersions(state: PipelineState): string {
  const results = state.producerResults?.filter(r => r.promptVersion !== null) ?? [];
  if (results.length === 0) return "(none — structural scaffold only)";
  return results
    .map(r => `${r.producerName}@${r.promptVersion}`)
    .join("  ");
}

function renderHeader(state: PipelineState): string {
  const SEP = "═".repeat(65);
  const DIV = "─".repeat(65);
  const val = state.validationResult;
  const status = val?.status ?? "UNKNOWN";

  const warningCount = val?.totalWarnings ?? 0;
  const errorCount   = val?.totalErrors   ?? 0;
  const countStr     = `${errorCount} error(s), ${warningCount} warning(s)`;

  return `// ${SEP}
// FACTORY DRAFT — ${state.slug}
// ${DIV}
// Generated:         ${new Date().toISOString()}
// Factory version:   ${state.factoryVersion}
// Prompt versions:   ${renderPromptVersions(state)}
// Validation status: ${status}  [${countStr}]
// Projected KQ tier: (not available — requires Intelligence Producer)
// ${DIV}
// REVIEW CHECKLIST
//   □ Notes pyramid verified (≥ 2 per tier, no cross-tier duplicates)
//   □ Description reviewed in Maison editorial voice
//   □ Vibe tags meet minimum of 3 (from approved vocabulary)
//   □ recommendedFor has minimum of 2 persona statements
//   □ All FACTORY_ERROR markers resolved
//   □ All FACTORY_WARN markers reviewed
//   □ Relationship suggestions reviewed (see footer)
//   □ npm run mkc:validate passes before promotion
// ${SEP}`;
}

// ── Main export ───────────────────────────────────────────────────────────────

export function buildDraft(input: DraftBuilderInput): DraftBuilderResult {
  const { state, draftDir } = input;
  const { slug, record, validationResult } = state;

  const constName  = deriveConstName(slug);
  const draftPath  = path.join(draftDir, `${slug}.ts`);
  const allIssues  = validationResult
    ? [...validationResult.errors, ...validationResult.warnings]
    : [];
  const ann = buildAnnotationMap(allIssues);

  // Ensure drafts directory exists
  if (!existsSync(draftDir)) {
    mkdirSync(draftDir, { recursive: true });
  }

  const sections = [
    renderHeader(state),
    ``,
    `import type { FragranceKnowledge } from "../../../app/lib/mkc/types";`,
    ``,
    `export const ${constName}: FragranceKnowledge = {`,
    renderIdentity(record, ann),
    renderClassification(record, ann),
    renderComposition(record, ann),
    renderDiscovery(record, ann),
    renderMerchandising(record, ann),
    renderEducation(record, ann),
    renderIntelligence(record, ann),
    renderRelationshipFooter(),
    `};`,
    ``,
  ];

  const content = sections.join("\n");

  writeFileSync(draftPath, content, "utf-8");

  return {
    path:    draftPath,
    written: true,
    bytes:   Buffer.byteLength(content, "utf-8"),
  };
}

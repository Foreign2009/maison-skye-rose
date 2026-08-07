/**
 * Knowledge Factory — Home Fragrance Draft Builder
 *
 * Produces a TypeScript draft string from a HomeFragranceKnowledge record
 * and its ValidationResult. Returns the draft as a string — does not write
 * to disk. The caller decides whether and where to persist it.
 *
 * Draft format:
 *   - Factory header (metadata, validation status, review checklist)
 *   - import type { HomeFragranceKnowledge } from "..."
 *   - export const [ConstName]: HomeFragranceKnowledge = { ... }
 *   - Inline FACTORY_ERROR / FACTORY_WARN annotations after affected fields
 *
 * Differences from draftBuilder.ts (fragrance):
 *   - Imports HomeFragranceKnowledge, not FragranceKnowledge
 *   - No collection, gender, scentCharacter, projection, family
 *   - No intelligence metrics (sweetness, freshness, warmth, intensity, versatility, popularity)
 *   - No relationships block
 *   - Prices and images iterate dynamic variant keys — not hardcoded "5ml"/"10ml"/"30ml"
 *   - Home Fragrance-specific review checklist
 */

import type { HomeFragranceKnowledge } from "../../app/lib/mkc/homeFragranceTypes";
import type { ValidationIssue, ValidationResult } from "../../app/lib/mkc/validator";

// ── Annotation map ────────────────────────────────────────────────────────────

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
  if (arr.length <= 4 && arr.every((s) => s.length <= 40)) {
    return `[${arr.map(renderStr).join(", ")}]`;
  }
  const inner = arr.map((s) => `${indent}  ${renderStr(s)}`).join(",\n");
  return `[\n${inner},\n${indent}]`;
}

function trailingAnnotation(map: AnnotationMap, field: string): string {
  const lines = map.get(field);
  if (!lines || lines.length === 0) return "";
  return "  " + lines.join("  ");
}

function fieldLine(name: string, value: string, annotation: string): string {
  const base = `  ${name.padEnd(14)}: ${value},`;
  return annotation ? `${base}${annotation}` : base;
}

function deriveConstName(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

// ── Section: Identity ─────────────────────────────────────────────────────────
// catalogVersion and status are optional on HomeFragranceKnowledge.
// When absent: rendered as a comment so the author can confirm values before promotion.
// When present: rendered as a property preserving the exact supplied value.
// The validator emits CATALOG_VERSION_MISSING / STATUS_NOT_SET warnings regardless.

function renderIdentity(r: HomeFragranceKnowledge, ann: AnnotationMap): string {
  const lines: string[] = [
    `  // ── Identity ──────────────────────────────────────────────────────────────────`,
    fieldLine("id",          renderStr(r.id),          trailingAnnotation(ann, "id")),
    fieldLine("slug",        renderStr(r.slug),        trailingAnnotation(ann, "slug")),
    fieldLine("brand",       renderStr(r.brand),       trailingAnnotation(ann, "brand")),
    fieldLine("name",        renderStr(r.name),        trailingAnnotation(ann, "name")),
    fieldLine("category",    renderStr(r.category),    trailingAnnotation(ann, "category")),
    fieldLine("productType", renderStr(r.productType), trailingAnnotation(ann, "productType")),
    fieldLine("range",       renderStr(r.range),       trailingAnnotation(ann, "range")),
  ];

  if (r.catalogVersion !== undefined) {
    lines.push(fieldLine("catalogVersion", renderStr(r.catalogVersion), trailingAnnotation(ann, "catalogVersion")));
  } else {
    const catVerAnn = ann.get("catalogVersion");
    if (catVerAnn) {
      lines.push(`  // catalogVersion: (not set — confirm before promotion)`);
      lines.push(`  //   ${catVerAnn.join("\n  //   ")}`);
    } else {
      lines.push(`  // catalogVersion: (not set — confirm before promotion)`);
    }
  }

  if (r.status !== undefined) {
    lines.push(fieldLine("status", renderStr(r.status), trailingAnnotation(ann, "status")));
  } else {
    const statusAnn = ann.get("status");
    if (statusAnn) {
      lines.push(`  // status:         (not set — confirm "active" or "discontinued" before promotion)`);
      lines.push(`  //   ${statusAnn.join("\n  //   ")}`);
    } else {
      lines.push(`  // status:         (not set — confirm "active" or "discontinued" before promotion)`);
    }
  }

  return lines.join("\n");
}

// ── Section: Composition ──────────────────────────────────────────────────────

function renderComposition(r: HomeFragranceKnowledge, ann: AnnotationMap): string {
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
    fieldLine("mood",    renderStr(r.mood),    trailingAnnotation(ann, "mood")),
    `  notes: {`,
    topLine,
    heartLine,
    baseLine,
    `  },`,
  ].join("\n");
}

// ── Section: Editorial ────────────────────────────────────────────────────────

function renderEditorial(r: HomeFragranceKnowledge, ann: AnnotationMap): string {
  const lines: string[] = [
    ``,
    `  // ── Editorial ───────────────────────────────────────────────────────────────`,
  ];

  if (r.subtitle !== undefined) {
    lines.push(fieldLine("subtitle", renderStr(r.subtitle), trailingAnnotation(ann, "subtitle")));
  } else {
    lines.push(`  // subtitle:     (not set)`);
  }

  if (r.description !== undefined) {
    lines.push(fieldLine("description", renderStr(r.description), trailingAnnotation(ann, "description")));
  } else {
    const descAnn = ann.get("description");
    if (descAnn) {
      lines.push(`  // description:  (not set — add after Editorial Producer or manually)`);
      lines.push(`  //  ${descAnn.join("\n  //  ")}`);
    } else {
      lines.push(`  // description:  (not set — add after Editorial Producer or manually)`);
    }
  }

  return lines.join("\n");
}

// ── Section: Discovery ────────────────────────────────────────────────────────

function renderDiscovery(r: HomeFragranceKnowledge, ann: AnnotationMap): string {
  return [
    ``,
    `  // ── Discovery (populated by Discovery Producer in EP4-P4) ─────────────────`,
    fieldLine("vibe",           renderStrArray(r.vibe),           trailingAnnotation(ann, "vibe")),
    fieldLine("seasons",        renderStrArray(r.seasons),        trailingAnnotation(ann, "seasons")),
    fieldLine("signatureStyle", renderStrArray(r.signatureStyle), trailingAnnotation(ann, "signatureStyle")),
    fieldLine("recommendedFor", renderStrArray(r.recommendedFor), trailingAnnotation(ann, "recommendedFor")),
  ].join("\n");
}

// ── Section: Merchandising ────────────────────────────────────────────────────
// Iterates dynamic variant keys — never hardcodes "5ml"/"10ml"/"30ml".

function renderMerchandising(r: HomeFragranceKnowledge, ann: AnnotationMap): string {
  const priceLines = Object.entries(r.prices).map(
    ([variant, price]) =>
      `    ${renderStr(variant)}: ${price},${trailingAnnotation(ann, `prices.${variant}`)}`,
  );
  const imageLines = Object.entries(r.images).map(
    ([variant, img]) =>
      `    ${renderStr(variant)}: ${renderStr(img)},${trailingAnnotation(ann, `images.${variant}`)}`,
  );

  return [
    ``,
    `  // ── Merchandising ───────────────────────────────────────────────────────────`,
    `  prices: {`,
    ...priceLines,
    `  },`,
    `  images: {`,
    ...imageLines,
    `  },`,
    fieldLine("bestSeller", String(r.bestSeller), trailingAnnotation(ann, "bestSeller")),
    fieldLine("newArrival",  String(r.newArrival), trailingAnnotation(ann, "newArrival")),
  ].join("\n");
}

// ── Header ────────────────────────────────────────────────────────────────────

function renderHeader(
  slug:             string,
  factoryVersion:   string,
  validationResult: ValidationResult,
): string {
  const SEP    = "═".repeat(65);
  const DIV    = "─".repeat(65);
  const status = validationResult.status;
  const countStr = `${validationResult.totalErrors} error(s), ${validationResult.totalWarnings} warning(s)`;

  return `// ${SEP}
// FACTORY DRAFT — ${slug}
// ${DIV}
// Generated:         ${new Date().toISOString()}
// Factory version:   ${factoryVersion}
// Validation status: ${status}  [${countStr}]
// ${DIV}
// REVIEW CHECKLIST (Home Fragrance)
//   □ Notes pyramid: at least 1 note per tier (2+ per tier recommended)
//   □ Subtitle reviewed in Maison editorial voice
//   □ Description written or queued for Editorial Producer
//   □ Discovery arrays populated by Discovery Producer (vibe, seasons, signatureStyle, recommendedFor)
//   □ All FACTORY_ERROR markers resolved
//   □ All FACTORY_WARN markers reviewed
//   □ npm run mkc:validate:home-fragrance passes before promotion
// ${SEP}`;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function buildHomeFragranceDraft(
  record:           HomeFragranceKnowledge,
  validationResult: ValidationResult,
  factoryVersion    = "ep4-p3b",
  importBase        = "../../../app/lib/mkc",
): string {
  const slug      = record.slug;
  const constName = deriveConstName(slug);
  const allIssues = [...validationResult.errors, ...validationResult.warnings];
  const ann       = buildAnnotationMap(allIssues);

  const sections = [
    renderHeader(slug, factoryVersion, validationResult),
    ``,
    `import type { HomeFragranceKnowledge } from "${importBase}/homeFragranceTypes";`,
    ``,
    `export const ${constName}: HomeFragranceKnowledge = {`,
    renderIdentity(record, ann),
    renderComposition(record, ann),
    renderEditorial(record, ann),
    renderDiscovery(record, ann),
    renderMerchandising(record, ann),
    `};`,
    ``,
  ];

  return sections.join("\n");
}

/**
 * Knowledge Factory — Review Queue
 *
 * Queue views and draft scanning.
 *
 * Responsibilities:
 *   - Scan scripts/factory/drafts/ and register new drafts
 *   - Display pending and in-review queues
 *   - Print draft content for review
 *   - Show scaffold-vs-generated field comparison
 */

import { existsSync, readdirSync, readFileSync } from "fs";
import path from "path";
import { getAllRecords, getByStatus, findRecord, addRecord } from "./ReviewRegistry";
import { logReviewAction } from "./ReviewLogger";
import type { ReviewRecord, ReviewStatus } from "./ReviewState";

const DRAFT_DIR = path.join(process.cwd(), "scripts", "factory", "drafts");

// ── Draft header parsing ──────────────────────────────────────────────────────

function parseDraftHeader(content: string, slug: string): Pick<ReviewRecord, "factoryVersion" | "promptVersions" | "validationStatus"> {
  const versionMatch    = content.match(/Factory version:\s+(.+)/);
  const promptMatch     = content.match(/Prompt versions:\s+(.+)/);
  const validationMatch = content.match(/Validation status:\s+(PASS_WITH_WARNINGS|PASS|FAIL|UNKNOWN)/);

  return {
    factoryVersion:   versionMatch?.[1]?.trim()  ?? "unknown",
    promptVersions:   promptMatch?.[1]?.trim()   ?? "unknown",
    validationStatus: (validationMatch?.[1] as ReviewRecord["validationStatus"]) ?? "UNKNOWN",
  };
}

function parseCollection(content: string): ReviewRecord["collection"] {
  const match = content.match(/collection\s*:\s*["'](.+?)["']/);
  const raw   = match?.[1];
  if (raw === "Skye" || raw === "Rose" || raw === "Elite") return raw;
  return "Skye";
}

function parseName(content: string, slug: string): string {
  const match = content.match(/name\s*:\s*["'](.+?)["']/);
  return match?.[1] ?? slug;
}

// ── Queue management ──────────────────────────────────────────────────────────

export function addDraftToQueue(slug: string): ReviewRecord | null {
  const draftPath = path.join(DRAFT_DIR, `${slug}.ts`);
  if (!existsSync(draftPath)) {
    console.error(`[review] Draft not found: drafts/${slug}.ts`);
    return null;
  }

  const existing = findRecord(slug);
  if (existing) {
    console.log(`[review] ${slug} already in queue (status: ${existing.status})`);
    return existing;
  }

  const content    = readFileSync(draftPath, "utf-8");
  const meta       = parseDraftHeader(content, slug);
  const collection = parseCollection(content);
  const name       = parseName(content, slug);

  const record: ReviewRecord = {
    slug,
    name,
    collection,
    factoryVersion:   meta.factoryVersion,
    promptVersions:   meta.promptVersions,
    validationStatus: meta.validationStatus,
    status:           "pending",
    addedAt:          new Date().toISOString(),
    reviewStartedAt:  null,
    decidedAt:        null,
    reviewer:         null,
    notes:            [],
    decision:         null,
  };

  addRecord(record);
  logReviewAction("added_to_queue", slug, "system", `validation:${meta.validationStatus}  factory:${meta.factoryVersion}`);
  console.log(`  +  ${name}  (${slug})  ${meta.validationStatus}`);
  return record;
}

export function addAllPendingDrafts(): number {
  if (!existsSync(DRAFT_DIR)) {
    console.log(`[review] No drafts directory found.`);
    return 0;
  }

  const files = readdirSync(DRAFT_DIR).filter(
    f => f.endsWith(".ts") && f !== ".gitkeep.ts",
  );

  if (files.length === 0) {
    console.log(`[review] No draft files found.`);
    return 0;
  }

  let added = 0;
  for (const file of files) {
    const slug    = file.replace(/\.ts$/, "");
    const before  = findRecord(slug);
    const result  = addDraftToQueue(slug);
    const isNew   = !before && result !== null;
    if (isNew) added++;
  }
  return added;
}

// ── Display helpers ───────────────────────────────────────────────────────────

const STATUS_ICON: Record<ReviewStatus, string> = {
  pending:            "○",
  in_review:          "◉",
  approved:           "✓",
  rejected:           "✗",
  needs_regeneration: "↺",
};

const STATUS_LABEL: Record<ReviewStatus, string> = {
  pending:            "Pending",
  in_review:          "In Review",
  approved:           "Approved",
  rejected:           "Rejected",
  needs_regeneration: "Needs Regen",
};

// ── Queue summary ─────────────────────────────────────────────────────────────

export function printQueueSummary(): void {
  const pending    = getByStatus("pending");
  const inReview   = getByStatus("in_review");
  const approved   = getByStatus("approved");
  const rejected   = getByStatus("rejected");
  const needsRegen = getByStatus("needs_regeneration");

  const SEP = "═".repeat(58);
  const DIV = "─".repeat(58);

  console.log(`\n${SEP}`);
  console.log(`  Editorial Review Queue`);
  console.log(`${SEP}`);
  console.log(`  Pending       ${String(pending.length).padStart(3)}    In Review    ${String(inReview.length).padStart(3)}`);
  console.log(`  Approved      ${String(approved.length).padStart(3)}    Rejected     ${String(rejected.length).padStart(3)}    Needs Regen  ${needsRegen.length}`);
  console.log(`${SEP}`);

  if (inReview.length > 0) {
    console.log(`\n  IN REVIEW`);
    console.log(DIV);
    for (const r of inReview) {
      const openNotes = r.notes.filter(n => !n.resolved).length;
      const notesStr  = openNotes > 0 ? `  [${openNotes} open note(s)]` : "";
      console.log(`  ${STATUS_ICON.in_review}  ${r.name.padEnd(38)}  ${r.validationStatus}${notesStr}`);
      if (r.reviewer) console.log(`       reviewer: ${r.reviewer}`);
    }
  }

  if (pending.length > 0) {
    console.log(`\n  PENDING REVIEW`);
    console.log(DIV);
    for (const r of pending) {
      console.log(`  ${STATUS_ICON.pending}  ${r.name.padEnd(38)}  ${r.validationStatus}`);
    }
  }

  if (pending.length === 0 && inReview.length === 0) {
    console.log(`\n  Queue is clear — no records pending or in review.`);
  }

  console.log(`\n  Run: npm run mkc:review:report  for full status breakdown`);
  console.log(`  Run: npm run mkc:review -- --add  to add new drafts\n`);
  console.log(SEP);
}

// ── Draft view ────────────────────────────────────────────────────────────────

export function printDraft(slug: string): void {
  const draftPath = path.join(DRAFT_DIR, `${slug}.ts`);
  if (!existsSync(draftPath)) {
    console.error(`[review] Draft not found: drafts/${slug}.ts`);
    return;
  }
  const content = readFileSync(draftPath, "utf-8");
  console.log(`\n${"─".repeat(70)}`);
  console.log(`  Draft: ${slug}`);
  console.log(`${"─".repeat(70)}\n`);
  console.log(content);
}

// ── Scaffold vs generated comparison ─────────────────────────────────────────
// Highlights which fields were populated by AI producers versus scaffold defaults.

export function printComparison(slug: string): void {
  const draftPath = path.join(DRAFT_DIR, `${slug}.ts`);
  if (!existsSync(draftPath)) {
    console.error(`[review] Draft not found: drafts/${slug}.ts`);
    return;
  }

  const content = readFileSync(draftPath, "utf-8");
  const SEP = "═".repeat(58);
  const DIV = "─".repeat(58);

  // Extracts a string field value from the draft
  function str(pattern: RegExp): string {
    const m = content.match(pattern);
    return m ? m[1].slice(0, 72) + (m[1].length > 72 ? "…" : "") : "(not set)";
  }

  // Extracts an array field and checks if it's non-empty
  function arr(pattern: RegExp): { value: string; populated: boolean } {
    const m = content.match(pattern);
    if (!m) return { value: "[]", populated: false };
    const raw       = m[1].replace(/\s+/g, " ").trim();
    const populated  = raw !== "[]" && raw.length > 2;
    const truncated  = raw.length > 72 ? raw.slice(0, 72) + "…" : raw;
    return { value: truncated, populated };
  }

  const profile     = str(/profile\s*:\s*"(.+?)"/);
  const description = str(/description\s*:\s*"((?:[^"\\]|\\.)*)"/);
  // Use [\s\S] instead of dotall flag (project target is ES2017)
  const notes = {
    top:   arr(/top\s*:\s*(\[[\s\S]+?\])/),
    heart: arr(/heart\s*:\s*(\[[\s\S]+?\])/),
    base:  arr(/base\s*:\s*(\[[\s\S]+?\])/),
  };
  const vibe           = arr(/vibe\s*:\s*(\[[\s\S]+?\])/);
  const occasions      = arr(/occasions\s*:\s*(\[[\s\S]+?\])/);
  const seasons        = arr(/seasons\s*:\s*(\[[\s\S]+?\])/);
  const signatureStyle = arr(/signatureStyle\s*:\s*(\[[\s\S]+?\])/);
  const recommendedFor = arr(/recommendedFor\s*:\s*(\[[\s\S]+?\])/);
  const hasRel         = content.includes("relationships:") && !content.includes("(not populated)");
  const eduTags        = arr(/educationTags\s*:\s*(\[[\s\S]+?\])/);
  const learningPath   = arr(/learningPath\s*:\s*(\[[\s\S]+?\])/);
  const academyIds     = arr(/academyArticleIds\s*:\s*(\[[\s\S]+?\])/);

  const record         = findRecord(slug);
  const promptVersions = record?.promptVersions ?? "unknown";
  const valStatus      = record?.validationStatus ?? "unknown";

  const check = (populated: boolean): string => populated ? "✓" : "○";

  console.log(`\n${SEP}`);
  console.log(`  Scaffold vs Generated — ${slug}`);
  console.log(`${SEP}`);
  console.log(`  Producers:   ${promptVersions}`);
  console.log(`  Validation:  ${valStatus}`);
  console.log(`${DIV}`);
  console.log(`  SCAFFOLD  (structural defaults — deterministic, no AI)`);
  console.log(`    Profile:         ${profile}`);
  console.log(`    Notes (top):     ${notes.top.value}`);
  console.log(`    Notes (heart):   ${notes.heart.value}`);
  console.log(`    Notes (base):    ${notes.base.value}`);
  console.log(`${DIV}`);
  console.log(`  GENERATED  (AI producers enriched from scaffold)`);
  console.log(`    ${check(description !== "(not set)")}  Description:     ${description}`);
  console.log(`    ${check(vibe.populated)}  Vibe:            ${vibe.value}`);
  console.log(`    ${check(occasions.populated)}  Occasions:       ${occasions.value}`);
  console.log(`    ${check(seasons.populated)}  Seasons:         ${seasons.value}`);
  console.log(`    ${check(signatureStyle.populated)}  SignatureStyle:   ${signatureStyle.value}`);
  console.log(`    ${check(recommendedFor.populated)}  RecommendedFor:  ${recommendedFor.value}`);
  console.log(`    ${check(hasRel)}  Relationships:   ${hasRel ? "populated" : "not populated"}`);
  console.log(`    ${check(academyIds.populated)}  AcademyArticles: ${academyIds.value}`);
  console.log(`    ${check(eduTags.populated)}  EducationTags:   ${eduTags.value}`);
  console.log(`    ${check(learningPath.populated)}  LearningPath:    ${learningPath.value}`);
  console.log(`${SEP}\n`);
}

// ── Full list ─────────────────────────────────────────────────────────────────

export function listAll(): void {
  const all = getAllRecords();
  if (all.length === 0) {
    console.log(`[review] Queue is empty — run: npm run mkc:review -- --add`);
    return;
  }

  const SEP = "═".repeat(58);
  const DIV = "─".repeat(58);
  console.log(`\n${SEP}`);
  console.log(`  All Review Records  (${all.length})`);
  console.log(`${SEP}`);

  const groups: ReviewStatus[] = ["in_review", "pending", "approved", "rejected", "needs_regeneration"];
  for (const status of groups) {
    const records = all.filter(r => r.status === status);
    if (records.length === 0) continue;
    console.log(`\n  ${STATUS_LABEL[status].toUpperCase()}`);
    console.log(DIV);
    for (const r of records) {
      const by = r.reviewer ? `  by ${r.reviewer}` : "";
      console.log(`  ${STATUS_ICON[status]}  ${r.name.padEnd(38)}  ${r.validationStatus}${by}`);
    }
  }
  console.log(`\n${SEP}\n`);
}

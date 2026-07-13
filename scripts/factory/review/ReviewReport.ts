/**
 * Knowledge Factory — Review Report
 *
 * Builds and prints the full editorial review status report.
 * Shows all records grouped by status, with notes and decisions.
 */

import { getAllRecords } from "./ReviewRegistry";
import type { ReviewRecord, ReviewStatus } from "./ReviewState";

export interface ReviewReport {
  generatedAt:   string;
  total:         number;
  byStatus:      Record<ReviewStatus, number>;
  pending:       ReviewRecord[];
  inReview:      ReviewRecord[];
  approved:      ReviewRecord[];
  rejected:      ReviewRecord[];
  needsRegen:    ReviewRecord[];
  withOpenNotes: ReviewRecord[];
}

export function buildReviewReport(): ReviewReport {
  const all      = getAllRecords();
  const byStatus: Record<ReviewStatus, number> = {
    pending:            0,
    in_review:          0,
    approved:           0,
    rejected:           0,
    needs_regeneration: 0,
  };

  for (const r of all) byStatus[r.status]++;

  return {
    generatedAt:   new Date().toISOString(),
    total:         all.length,
    byStatus,
    pending:       all.filter(r => r.status === "pending"),
    inReview:      all.filter(r => r.status === "in_review"),
    approved:      all.filter(r => r.status === "approved"),
    rejected:      all.filter(r => r.status === "rejected"),
    needsRegen:    all.filter(r => r.status === "needs_regeneration"),
    withOpenNotes: all.filter(r => r.notes.some(n => !n.resolved)),
  };
}

export function printReviewReport(report: ReviewReport): void {
  const SEP = "═".repeat(58);
  const DIV = "─".repeat(58);

  console.log(`\n${SEP}`);
  console.log(`  Editorial Review Report  —  ${report.generatedAt.slice(0, 10)}`);
  console.log(`${SEP}`);
  console.log(`  Total records:        ${report.total}`);
  console.log(`  Pending:              ${report.byStatus.pending}`);
  console.log(`  In Review:            ${report.byStatus.in_review}`);
  console.log(`  Approved:             ${report.byStatus.approved}`);
  console.log(`  Rejected:             ${report.byStatus.rejected}`);
  console.log(`  Needs Regeneration:   ${report.byStatus.needs_regeneration}`);
  console.log(`  Records with notes:   ${report.withOpenNotes.length}`);

  if (report.approved.length > 0) {
    console.log(`\n${DIV}`);
    console.log(`  APPROVED`);
    for (const r of report.approved) {
      const by = r.reviewer     ? `  by ${r.reviewer}`              : "";
      const at = r.decidedAt    ? `  ${r.decidedAt.slice(0, 10)}`   : "";
      console.log(`  ✓  ${r.name.padEnd(38)}${at}${by}`);
      if (r.decision?.reason) {
        console.log(`       "${r.decision.reason}"`);
      }
    }
  }

  if (report.inReview.length > 0) {
    console.log(`\n${DIV}`);
    console.log(`  IN REVIEW`);
    for (const r of report.inReview) {
      const openNotes = r.notes.filter(n => !n.resolved).length;
      const notesStr  = openNotes > 0 ? `  [${openNotes} open note(s)]` : "";
      const by        = r.reviewer ? `  reviewer: ${r.reviewer}` : "";
      console.log(`  ◉  ${r.name.padEnd(38)}  ${r.validationStatus}${by}${notesStr}`);
    }
  }

  if (report.pending.length > 0) {
    console.log(`\n${DIV}`);
    console.log(`  PENDING REVIEW`);
    for (const r of report.pending) {
      console.log(`  ○  ${r.name.padEnd(38)}  ${r.validationStatus}  factory:${r.factoryVersion}`);
    }
  }

  if (report.rejected.length > 0) {
    console.log(`\n${DIV}`);
    console.log(`  REJECTED`);
    for (const r of report.rejected) {
      const by     = r.reviewer       ? `  by ${r.reviewer}` : "";
      const reason = r.decision?.reason ? `\n       "${r.decision.reason}"` : "";
      console.log(`  ✗  ${r.name.padEnd(38)}${by}${reason}`);
    }
  }

  if (report.needsRegen.length > 0) {
    console.log(`\n${DIV}`);
    console.log(`  NEEDS REGENERATION`);
    for (const r of report.needsRegen) {
      const reason = r.decision?.reason ? `\n       "${r.decision.reason}"` : "";
      console.log(`  ↺  ${r.name.padEnd(38)}  ${r.validationStatus}${reason}`);
    }
  }

  if (report.withOpenNotes.length > 0) {
    console.log(`\n${DIV}`);
    console.log(`  OPEN NOTES`);
    for (const r of report.withOpenNotes) {
      const openNotes = r.notes.filter(n => !n.resolved);
      for (const note of openNotes) {
        const excerpt = note.note.length > 52 ? note.note.slice(0, 52) + "…" : note.note;
        console.log(`  !  ${r.slug.padEnd(38)}  [${note.section}] ${excerpt}`);
      }
    }
  }

  console.log(`\n${SEP}\n`);
}

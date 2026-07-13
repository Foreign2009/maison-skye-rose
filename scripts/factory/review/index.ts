/**
 * Knowledge Factory — Review Queue CLI
 *
 * Usage:
 *
 *   npm run mkc:review
 *     Show pending + in-review queue summary.
 *
 *   npm run mkc:review -- --add
 *     Scan scripts/factory/drafts/ and add any unregistered drafts to the queue.
 *
 *   npm run mkc:review -- --add sauvage-inspired
 *     Add a specific draft slug to the queue.
 *
 *   npm run mkc:review -- --start sauvage-inspired --reviewer "Adi"
 *     Mark a record as in-review. Tracks who opened it and when.
 *
 *   npm run mkc:review -- --approve sauvage-inspired --reviewer "Adi" --reason "LGTM"
 *     Approve a draft (status → approved). Does NOT promote. See EP29-P3.
 *
 *   npm run mkc:review -- --reject sauvage-inspired --reviewer "Adi" --reason "Description off-brand"
 *     Reject a draft (status → rejected).
 *
 *   npm run mkc:review -- --regen sauvage-inspired --reviewer "Adi" --reason "Composition weak"
 *     Mark for regeneration (status → needs_regeneration).
 *
 *   npm run mkc:review -- --note sauvage-inspired --reviewer "Adi" --section composition --text "Top notes feel generic"
 *     Add a section-specific review note.
 *
 *   npm run mkc:review -- --view sauvage-inspired
 *     Print the draft file content to the terminal.
 *
 *   npm run mkc:review -- --compare sauvage-inspired
 *     Show scaffold-vs-generated field comparison.
 *
 *   npm run mkc:review -- --list
 *     List all records with their current status.
 *
 *   npm run mkc:review:report
 *     Full report grouped by status.
 */

import {
  addDraftToQueue,
  addAllPendingDrafts,
  printQueueSummary,
  printDraft,
  printComparison,
  listAll,
}                              from "./ReviewQueue";
import {
  approve,
  reject,
  markForRegeneration,
  startReview,
  resetToPending,
}                              from "./ReviewDecision";
import { addNote, resolveNote, printNotes } from "./ReviewNotes";
import { buildReviewReport, printReviewReport } from "./ReviewReport";

// ── Arg helpers ───────────────────────────────────────────────────────────────

function flag(args: string[], name: string): boolean {
  return args.includes(name);
}

function after(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx < 0) return undefined;
  const next = args[idx + 1];
  return next && !next.startsWith("--") ? next : undefined;
}

function required(args: string[], name: string, context: string): string {
  const val = after(args, name);
  if (!val) {
    console.error(`[review] ${context} requires ${name} <value>`);
    process.exit(1);
  }
  return val;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Default: queue summary
  if (args.length === 0) {
    printQueueSummary();
    return;
  }

  // Full report
  if (flag(args, "--report")) {
    printReviewReport(buildReviewReport());
    return;
  }

  // List all with status
  if (flag(args, "--list")) {
    listAll();
    return;
  }

  // Add draft(s) to queue
  if (flag(args, "--add")) {
    const slug = after(args, "--add");
    if (slug) {
      addDraftToQueue(slug);
    } else {
      console.log(`[review] Scanning drafts directory...`);
      const n = addAllPendingDrafts();
      console.log(`[review] ${n} new record(s) added to queue.`);
    }
    printQueueSummary();
    return;
  }

  // View draft content
  if (flag(args, "--view")) {
    const slug = required(args, "--view", "--view");
    printDraft(slug);
    return;
  }

  // Scaffold vs generated comparison
  if (flag(args, "--compare")) {
    const slug = required(args, "--compare", "--compare");
    printComparison(slug);
    return;
  }

  // Start review
  if (flag(args, "--start")) {
    const slug     = required(args, "--start",    "--start");
    const reviewer = after(args, "--reviewer") ?? "unknown";
    startReview(slug, reviewer);
    return;
  }

  // Approve
  if (flag(args, "--approve")) {
    const slug     = required(args, "--approve",  "--approve");
    const reviewer = after(args, "--reviewer") ?? "unknown";
    const reason   = after(args, "--reason")   ?? "";
    approve(slug, reviewer, reason);
    return;
  }

  // Reject
  if (flag(args, "--reject")) {
    const slug     = required(args, "--reject",   "--reject");
    const reviewer = after(args, "--reviewer") ?? "unknown";
    const reason   = after(args, "--reason")   ?? "";
    reject(slug, reviewer, reason);
    return;
  }

  // Mark for regeneration
  if (flag(args, "--regen")) {
    const slug     = required(args, "--regen",    "--regen");
    const reviewer = after(args, "--reviewer") ?? "unknown";
    const reason   = after(args, "--reason")   ?? "";
    markForRegeneration(slug, reviewer, reason);
    return;
  }

  // Reset to pending (after regeneration)
  if (flag(args, "--reset")) {
    const slug = required(args, "--reset", "--reset");
    resetToPending(slug);
    return;
  }

  // Add note
  if (flag(args, "--note")) {
    const slug     = required(args, "--note",     "--note");
    const reviewer = after(args, "--reviewer") ?? "unknown";
    const section  = after(args, "--section")  ?? "general";
    const text     = after(args, "--text");
    if (!text) {
      console.error(`[review] --note requires --text <note text>`);
      process.exit(1);
    }
    addNote(slug, reviewer, section, text);
    return;
  }

  // Resolve note
  if (flag(args, "--resolve")) {
    const noteId   = required(args, "--resolve",  "--resolve");
    const slug     = required(args, "--slug",     "--resolve");
    const reviewer = after(args, "--reviewer") ?? "unknown";
    resolveNote(slug, noteId, reviewer);
    return;
  }

  // Print notes for a slug
  if (flag(args, "--notes")) {
    const slug = required(args, "--notes", "--notes");
    printNotes(slug);
    return;
  }

  console.error(`[review] Unknown command. Run with no arguments to see queue summary.`);
  process.exit(1);
}

main().catch((err: unknown) => {
  console.error(`\n[mkc:review] Unexpected error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});

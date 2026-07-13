/**
 * Knowledge Factory — Review Decisions
 *
 * State transitions for the editorial review workflow.
 *
 * Valid transitions:
 *   pending        → in_review
 *   in_review      → approved | rejected | needs_regeneration
 *   rejected       → in_review  (re-review after changes)
 *   needs_regen    → pending    (after regeneration completes)
 *
 * Does NOT invoke promotion — that is EP29-P3.
 */

import { findRecord, updateRecord }    from "./ReviewRegistry";
import { logReviewAction }             from "./ReviewLogger";
import type { ReviewStatus, ReviewDecisionRecord } from "./ReviewState";

// ── Internal helper ───────────────────────────────────────────────────────────

function applyDecision(
  slug:     string,
  reviewer: string,
  decision: ReviewDecisionRecord["decision"],
  reason:   string,
): boolean {
  const record = findRecord(slug);
  if (!record) {
    console.error(`[review] No record found for slug: ${slug}`);
    return false;
  }

  const statusMap: Record<ReviewDecisionRecord["decision"], ReviewStatus> = {
    approved:           "approved",
    rejected:           "rejected",
    needs_regeneration: "needs_regeneration",
  };

  const decisionRecord: ReviewDecisionRecord = {
    decision,
    reviewer,
    timestamp: new Date().toISOString(),
    reason,
  };

  updateRecord(slug, {
    status:    statusMap[decision],
    decidedAt: new Date().toISOString(),
    reviewer,
    decision:  decisionRecord,
  });

  logReviewAction(decision, slug, reviewer, reason);
  return true;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function startReview(slug: string, reviewer: string): boolean {
  const record = findRecord(slug);
  if (!record) {
    console.error(`[review] No record found for slug: ${slug}`);
    return false;
  }

  updateRecord(slug, {
    status:          "in_review",
    reviewStartedAt: new Date().toISOString(),
    reviewer,
  });

  logReviewAction("review_started", slug, reviewer, "");
  console.log(`[review] ${record.name}  →  in_review  (reviewer: ${reviewer})`);
  return true;
}

export function approve(slug: string, reviewer: string, reason: string): boolean {
  const record = findRecord(slug);
  const ok = applyDecision(slug, reviewer, "approved", reason);
  if (ok) console.log(`[review] ${record?.name ?? slug}  →  approved`);
  return ok;
}

export function reject(slug: string, reviewer: string, reason: string): boolean {
  const record = findRecord(slug);
  const ok = applyDecision(slug, reviewer, "rejected", reason);
  if (ok) console.log(`[review] ${record?.name ?? slug}  →  rejected`);
  return ok;
}

export function markForRegeneration(slug: string, reviewer: string, reason: string): boolean {
  const record = findRecord(slug);
  const ok = applyDecision(slug, reviewer, "needs_regeneration", reason);
  if (ok) console.log(`[review] ${record?.name ?? slug}  →  needs_regeneration`);
  return ok;
}

export function resetToPending(slug: string): boolean {
  const record = findRecord(slug);
  if (!record) {
    console.error(`[review] No record found for slug: ${slug}`);
    return false;
  }
  updateRecord(slug, { status: "pending", decidedAt: null, decision: null });
  logReviewAction("reset_to_pending", slug, "system", "Queued for re-review after regeneration");
  console.log(`[review] ${record.name}  →  pending`);
  return true;
}

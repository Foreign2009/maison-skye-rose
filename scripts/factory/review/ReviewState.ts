/**
 * Knowledge Factory — Review Queue State Types
 *
 * All shared types for the Editorial Review Queue.
 * No dependencies on other review modules.
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type ReviewStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"
  | "needs_regeneration";

// ── Note ──────────────────────────────────────────────────────────────────────

export interface ReviewNote {
  id:        string;
  reviewer:  string;
  timestamp: string;
  section:   string;  // e.g. "composition", "discovery", "relationships", "general"
  note:      string;
  resolved:  boolean;
}

// ── Decision ──────────────────────────────────────────────────────────────────

export interface ReviewDecisionRecord {
  decision:  "approved" | "rejected" | "needs_regeneration";
  reviewer:  string;
  timestamp: string;
  reason:    string;
}

// ── Record ────────────────────────────────────────────────────────────────────

export interface ReviewRecord {
  slug:             string;
  name:             string;
  collection:       "Skye" | "Rose" | "Elite";
  factoryVersion:   string;
  promptVersions:   string;
  validationStatus: "PASS" | "PASS_WITH_WARNINGS" | "FAIL" | "UNKNOWN";
  status:           ReviewStatus;
  addedAt:          string;           // ISO — when first added to queue
  reviewStartedAt:  string | null;    // ISO — when reviewer opened it
  decidedAt:        string | null;    // ISO — when approved/rejected/marked
  reviewer:         string | null;
  notes:            ReviewNote[];
  decision:         ReviewDecisionRecord | null;
}

// ── Persistence ───────────────────────────────────────────────────────────────

export interface ReviewQueueFile {
  version: string;
  records: ReviewRecord[];
}

"use client";

/**
 * EP5-P3C — Identity Review Queue Client Component
 *
 * Renders the filterable identity review queue. Receives serialisable projection
 * data from the Server Component — no filesystem or registry access here.
 *
 * Filtering is client-side only (26 records; no pagination needed).
 */

import Link            from "next/link";
import { useState }    from "react";
import AdminNavigation from "@/app/admin/components/AdminNavigation";
import { logoutAction } from "@/app/admin/actions";
import type {
  IdentityReviewSummary,
  RecommendedAction,
} from "@/app/lib/identity/editorial";
import type { IdentityStatus } from "@/app/lib/identity/types";

// ── Display helpers ───────────────────────────────────────────────────────────

const STATUS_LABELS: Record<IdentityStatus, string> = {
  "candidate":      "Candidate",
  "pending-review": "Pending Review",
  "verified":       "Verified",
  "disputed":       "Disputed",
  "deprecated":     "Deprecated",
  "rejected":       "Rejected",
};

const STATUS_COLOURS: Record<IdentityStatus, string> = {
  "candidate":      "bg-amber-100 text-amber-800",
  "pending-review": "bg-blue-100 text-blue-800",
  "verified":       "bg-green-100 text-green-800",
  "disputed":       "bg-orange-100 text-orange-800",
  "deprecated":     "bg-gray-100 text-gray-500",
  "rejected":       "bg-red-100 text-red-700",
};

const ACTION_LABELS: Record<RecommendedAction, string> = {
  "verify":            "Verify",
  "correct-canonical": "Correct Name",
  "confirm-alias":     "Confirm Alias",
  "research-more":     "Research More",
  "reject":            "Reject",
};

const ACTION_COLOURS: Record<RecommendedAction, string> = {
  "verify":            "bg-green-50 text-green-700 ring-1 ring-green-200",
  "correct-canonical": "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  "confirm-alias":     "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  "research-more":     "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "reject":            "bg-red-50 text-red-700 ring-1 ring-red-200",
};

const CONF_COLOURS: Record<"high" | "medium" | "low" | "none", string> = {
  "high":   "text-green-700 font-medium",
  "medium": "text-amber-700 font-medium",
  "low":    "text-red-600 font-medium",
  "none":   "text-gray-400",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-ZA", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// ── Filter types ──────────────────────────────────────────────────────────────

type StatusFilter     = IdentityStatus | "all";
type ActionFilter     = RecommendedAction | "all";
type ConfFilter       = "high" | "medium" | "low" | "none" | "all";
type NameIssueFilter  = "all" | "yes" | "no";

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  queue: IdentityReviewSummary[];
}

export default function IdentityReviewList({ queue }: Props) {
  const [statusFilter,    setStatusFilter]    = useState<StatusFilter>("all");
  const [actionFilter,    setActionFilter]    = useState<ActionFilter>("all");
  const [confFilter,      setConfFilter]      = useState<ConfFilter>("all");
  const [nameIssueFilter, setNameIssueFilter] = useState<NameIssueFilter>("all");

  const filtered = queue.filter((r) => {
    if (statusFilter    !== "all" && r.status              !== statusFilter)    return false;
    if (actionFilter    !== "all" && r.recommendedAction   !== actionFilter)    return false;
    if (confFilter      !== "all" && r.researchConfidence  !== confFilter)      return false;
    if (nameIssueFilter === "yes" && !r.possibleNameIssue)                      return false;
    if (nameIssueFilter === "no"  && r.possibleNameIssue)                       return false;
    return true;
  });

  const filtersActive =
    statusFilter !== "all" ||
    actionFilter !== "all" ||
    confFilter   !== "all" ||
    nameIssueFilter !== "all";

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f5]">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between bg-[#4f4a52] px-6 py-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-[#d89ca4]">Internal</p>
            <p className="text-sm font-black uppercase tracking-widest text-white">Maison Operations</p>
          </div>
          <AdminNavigation />
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-xs text-white/60 transition hover:text-white">
            Sign Out
          </button>
        </form>
      </header>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <main className="mx-auto w-full max-w-[1200px] px-6 py-10">

        {/* Title */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Identity Platform</p>
          <h1 className="mt-1 text-2xl font-black text-[#4f4a52]">Identity Review Queue</h1>
          <p className="mt-1 text-sm text-[#4f4a52]/50">
            {queue.length} {queue.length === 1 ? "identity" : "identities"} total
            {filtersActive && ` — ${filtered.length} shown after filters`}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#4f4a52]/50">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#4f4a52] focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20"
            >
              <option value="all">All statuses</option>
              <option value="pending-review">Pending Review</option>
              <option value="candidate">Candidate</option>
              <option value="disputed">Disputed</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#4f4a52]/50">
              Recommended Action
            </label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value as ActionFilter)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#4f4a52] focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20"
            >
              <option value="all">All actions</option>
              <option value="verify">Verify</option>
              <option value="correct-canonical">Correct Name</option>
              <option value="research-more">Research More</option>
              <option value="reject">Reject</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#4f4a52]/50">
              Research Confidence
            </label>
            <select
              value={confFilter}
              onChange={(e) => setConfFilter(e.target.value as ConfFilter)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#4f4a52] focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20"
            >
              <option value="all">All confidence levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="none">None</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#4f4a52]/50">
              Name Issue
            </label>
            <select
              value={nameIssueFilter}
              onChange={(e) => setNameIssueFilter(e.target.value as NameIssueFilter)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#4f4a52] focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20"
            >
              <option value="all">All</option>
              <option value="yes">Has name issue</option>
              <option value="no">No name issue</option>
            </select>
          </div>

          {filtersActive && (
            <button
              onClick={() => {
                setStatusFilter("all");
                setActionFilter("all");
                setConfFilter("all");
                setNameIssueFilter("all");
              }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#4f4a52]/60 transition hover:text-[#4f4a52]"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table / Empty state */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
            <p className="text-sm text-[#4f4a52]/40">
              {queue.length === 0
                ? "No identities in review queue"
                : "No identities match the current filters"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-wider text-[#4f4a52]/40">
                  <th className="px-4 py-3 font-semibold">MIP ID</th>
                  <th className="px-4 py-3 font-semibold">Canonical Name</th>
                  <th className="px-4 py-3 font-semibold">Brand</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Rec. Action</th>
                  <th className="px-4 py-3 font-semibold">Confidence</th>
                  <th className="px-4 py-3 font-semibold">Name Issue</th>
                  <th className="px-4 py-3 font-semibold">Supplier Name</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="transition hover:bg-[#f5f0eb]/60"
                  >
                    <td className="px-4 py-3 font-mono text-[11px] text-[#4f4a52]/50">
                      <Link
                        href={`/admin/identity/${r.id}`}
                        className="hover:text-[#d89ca4] hover:underline"
                      >
                        {r.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#4f4a52]">
                      <Link
                        href={`/admin/identity/${r.id}`}
                        className="hover:text-[#d89ca4]"
                      >
                        {r.canonicalName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[#4f4a52]/60">
                      {r.canonicalBrand ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_COLOURS[r.status]}`}>
                        {STATUS_LABELS[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.recommendedAction ? (
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-medium ${ACTION_COLOURS[r.recommendedAction]}`}>
                          {ACTION_LABELS[r.recommendedAction]}
                        </span>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className={`px-4 py-3 text-xs ${r.researchConfidence ? CONF_COLOURS[r.researchConfidence] : "text-gray-300"}`}>
                      {r.researchConfidence ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {r.possibleNameIssue ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600 ring-1 ring-red-200">
                          ⚠ Yes
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td
                      className="max-w-[160px] truncate px-4 py-3 text-[11px] text-[#4f4a52]/50"
                      title={r.supplierName}
                    >
                      {r.supplierName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[11px] text-[#4f4a52]/40">
                      {formatDate(r.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

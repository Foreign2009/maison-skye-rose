"use client";

/**
 * EP6-P5C — Relationship Review Queue Client Component
 *
 * Renders the filterable relationship review queue.
 * Receives serialisable data from the Server Component — no filesystem access here.
 * Client-side filtering (168 units; no pagination needed).
 *
 * Overlap score filter labels use numeric ranges only ("0–3", "4–7", "8+").
 * They must NEVER imply editorial quality, confidence, or correctness.
 * All score display is labelled "Repository evidence — not editorial truth".
 */

import { useState }    from "react";
import Link            from "next/link";
import AdminNavigation from "@/app/admin/components/AdminNavigation";
import { logoutAction } from "@/app/admin/actions";

import type {
  RelationshipReviewSummary,
  RelationshipReviewProgress,
  RelationshipPairType,
  RelationshipGovernanceState,
} from "@/app/lib/identity/editorial/relationship/types";

// ── Display helpers ───────────────────────────────────────────────────────────

const PAIR_TYPE_LABELS: Record<RelationshipPairType, string> = {
  alternatives:    "Alternative",
  wardrobePartners: "Wardrobe Partner",
  evolution:       "Evolution",
};

const GOV_COLOURS: Record<RelationshipGovernanceState, string> = {
  PENDING:          "bg-blue-100 text-blue-800",
  DEFERRED:         "bg-amber-100 text-amber-800",
  FOUNDER_APPROVED: "bg-green-100 text-green-800",
  FOUNDER_REJECTED: "bg-red-100 text-red-700",
  RESEARCH_BLOCKED: "bg-gray-100 text-gray-500 italic",
};

const GOV_LABELS: Record<RelationshipGovernanceState, string> = {
  PENDING:          "Pending",
  DEFERRED:         "Deferred",
  FOUNDER_APPROVED: "Approved",
  FOUNDER_REJECTED: "Rejected",
  RESEARCH_BLOCKED: "Research Blocked",
};

// ── Filter types ──────────────────────────────────────────────────────────────

type PairTypeFilter    = RelationshipPairType | "all";
type GovStateFilter    = RelationshipGovernanceState | "all";
type ScoreRangeFilter  = "all" | "0-3" | "4-7" | "8+";
type SortKey           = "reviewId" | "overlapScore" | "pairType";

function filterByScore(score: number, range: ScoreRangeFilter): boolean {
  if (range === "all")  return true;
  if (range === "0-3")  return score <= 3;
  if (range === "4-7")  return score >= 4 && score <= 7;
  if (range === "8+")   return score >= 8;
  return true;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  queue:    RelationshipReviewSummary[];
  progress: RelationshipReviewProgress;
}

export default function RelationshipReviewList({ queue, progress }: Props) {
  const [pairTypeFilter, setPairTypeFilter]   = useState<PairTypeFilter>("all");
  const [govStateFilter, setGovStateFilter]   = useState<GovStateFilter>("all");
  const [scoreFilter,    setScoreFilter]      = useState<ScoreRangeFilter>("all");
  const [sortKey,        setSortKey]          = useState<SortKey>("reviewId");

  const filtered = queue
    .filter((r) => {
      if (pairTypeFilter !== "all" && r.pairType      !== pairTypeFilter)  return false;
      if (govStateFilter !== "all" && r.governanceState !== govStateFilter) return false;
      if (!filterByScore(r.overlapScore, scoreFilter))                      return false;
      return true;
    })
    .sort((a, b) => {
      if (sortKey === "overlapScore") return b.overlapScore - a.overlapScore;
      if (sortKey === "pairType") {
        const order: Record<RelationshipPairType, number> = { alternatives: 0, wardrobePartners: 1, evolution: 2 };
        const diff = order[a.pairType] - order[b.pairType];
        return diff !== 0 ? diff : a.reviewId.localeCompare(b.reviewId);
      }
      return a.reviewId.localeCompare(b.reviewId);
    });

  const filtersActive = pairTypeFilter !== "all" || govStateFilter !== "all" || scoreFilter !== "all";

  const pctBar = Math.min(progress.completionPercent, 100);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f5]">

      {/* Header */}
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

      <main className="mx-auto w-full max-w-[1200px] px-6 py-10">

        {/* Title */}
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Identity Platform</p>
          <h1 className="mt-1 text-2xl font-black text-[#4f4a52]">Relationship Review Queue</h1>
          <p className="mt-1 text-sm text-[#4f4a52]/50">
            Founder governance decisions for AI-generated relationship proposals.
            {" "}
            {filtersActive && `${filtered.length} shown after filters. `}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-6">
              <Stat label="Decisions Remaining" value={progress.pending} />
              <Stat label="Approved"            value={progress.founderApproved} colour="text-green-700" />
              <Stat label="Rejected"            value={progress.founderRejected} colour="text-red-600" />
              <Stat label="Deferred"            value={progress.deferred} colour="text-amber-700" />
              <Stat label="Research Blocked"    value={progress.researchBlocked} colour="text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-[#4f4a52]">
              {progress.completionPercent}% complete
            </p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#4f4a52] transition-all"
              style={{ width: `${pctBar}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-[#4f4a52]/40">
            {progress.founderApproved + progress.founderRejected} of {progress.totalDecisionUnits} terminal decisions recorded
          </p>
        </div>

        {/* Filters + Sort */}
        <div className="mb-5 flex flex-wrap items-end gap-4">
          <FilterSelect
            label="Pair Type"
            value={pairTypeFilter}
            onChange={(v) => setPairTypeFilter(v as PairTypeFilter)}
          >
            <option value="all">All types</option>
            <option value="alternatives">Alternatives</option>
            <option value="wardrobePartners">Wardrobe Partners</option>
            <option value="evolution">Evolution (Research Blocked)</option>
          </FilterSelect>

          <FilterSelect
            label="Governance State"
            value={govStateFilter}
            onChange={(v) => setGovStateFilter(v as GovStateFilter)}
          >
            <option value="all">All states</option>
            <option value="PENDING">Pending</option>
            <option value="DEFERRED">Deferred</option>
            <option value="FOUNDER_APPROVED">Approved</option>
            <option value="FOUNDER_REJECTED">Rejected</option>
            <option value="RESEARCH_BLOCKED">Research Blocked</option>
          </FilterSelect>

          <FilterSelect
            label="Evidence Score"
            value={scoreFilter}
            onChange={(v) => setScoreFilter(v as ScoreRangeFilter)}
          >
            <option value="all">All scores</option>
            <option value="0-3">0–3</option>
            <option value="4-7">4–7</option>
            <option value="8+">8+</option>
          </FilterSelect>

          <FilterSelect
            label="Sort By"
            value={sortKey}
            onChange={(v) => setSortKey(v as SortKey)}
          >
            <option value="reviewId">Review ID</option>
            <option value="overlapScore">Evidence Score ↓</option>
            <option value="pairType">Pair Type</option>
          </FilterSelect>

          {filtersActive && (
            <button
              onClick={() => { setPairTypeFilter("all"); setGovStateFilter("all"); setScoreFilter("all"); }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#4f4a52]/60 transition hover:text-[#4f4a52]"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Evidence score note */}
        <p className="mb-3 text-[10px] text-[#4f4a52]/40 italic">
          Evidence Score = repository overlap data only. Not editorial truth, confidence, or approval probability.
        </p>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center">
            <p className="text-sm text-[#4f4a52]/40">
              {queue.length === 0
                ? "No review units in queue"
                : "No units match the current filters"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-[10px] uppercase tracking-wider text-[#4f4a52]/40">
                  <th className="px-4 py-3 font-semibold">Review ID</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Fragrance A</th>
                  <th className="px-4 py-3 font-semibold">Fragrance B</th>
                  <th className="px-4 py-3 font-semibold text-right">Evidence Score</th>
                  <th className="px-4 py-3 font-semibold">Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => (
                  <tr key={r.reviewId} className="transition hover:bg-[#f5f0eb]/60">
                    <td className="px-4 py-3 font-mono text-[10px] text-[#4f4a52]/50">
                      <Link
                        href={`/admin/identity/relationships/${encodeURIComponent(r.reviewId)}`}
                        className="hover:text-[#d89ca4] hover:underline"
                      >
                        {r.reviewId.replace(/^REL-(alternatives|wardrobe-partners|evolution)-/, "")}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[#4f4a52]/60">
                        {PAIR_TYPE_LABELS[r.pairType]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[#4f4a52]">
                      <Link
                        href={`/admin/identity/relationships/${encodeURIComponent(r.reviewId)}`}
                        className="hover:text-[#d89ca4]"
                      >
                        {r.nameA}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#4f4a52]/70">
                      {r.nameB}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-xs text-[#4f4a52]/60">{r.overlapScore}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${GOV_COLOURS[r.governanceState]}`}>
                        {GOV_LABELS[r.governanceState]}
                      </span>
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function Stat({ label, value, colour = "text-[#4f4a52]" }: { label: string; value: number; colour?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-[#4f4a52]/40">{label}</p>
      <p className={`text-xl font-black ${colour}`}>{value}</p>
    </div>
  );
}

function FilterSelect({
  label, value, onChange, children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-[#4f4a52]/50">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#4f4a52] focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/20"
      >
        {children}
      </select>
    </div>
  );
}

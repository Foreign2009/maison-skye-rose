"use client";

import React            from "react";
import Link             from "next/link";
import { logoutAction } from "./actions";
import type { AlertSeverity } from "@/app/lib/operations/OperationsAlertTypes";
import type {
  ExecutiveReportHistory,
  ExecutiveReportHistoryEntry,
} from "@/app/lib/operations/ExecutiveReportHistoryTypes";

// ── UI helpers ────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-[#4f4a52]">
      {children}
    </h2>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

// ── Formatter ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Style maps ────────────────────────────────────────────────────────────────

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  "critical": "border-red-200    bg-red-50    text-red-700",
  "high":     "border-orange-200 bg-orange-50 text-orange-700",
  "medium":   "border-amber-100  bg-amber-50  text-amber-700",
  "low":      "border-gray-200   bg-gray-100  text-gray-500",
};

const SEVERITY_LABELS: Record<AlertSeverity, string> = {
  "critical": "Critical",
  "high":     "High",
  "medium":   "Medium",
  "low":      "Low",
};

// ── Section 1: History Workspace Overview ─────────────────────────────────────

function HistoryWorkspaceOverviewSection({ history }: { history: ExecutiveReportHistory }) {
  return (
    <section>
      <SectionLabel>Executive Report History Center</SectionLabel>
      <SectionHeading>History Workspace Overview</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Workspace view of the executive report history. Refreshed on every page load.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Total Records</p>
          <p className="mt-2 text-3xl font-black text-[#4f4a52]">{history.records.length}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">History Generated</p>
          <p className="mt-2 text-sm font-bold text-[#4f4a52]">{fmtDate(history.generatedAt)}</p>
        </Card>
      </div>
    </section>
  );
}

// ── Section 2: Executive Summary Workspace ────────────────────────────────────

function ExecutiveSummaryWorkspaceSection({ history }: { history: ExecutiveReportHistory }) {
  if (history.records.length === 0) {
    return (
      <section>
        <SectionLabel>Workspace</SectionLabel>
        <SectionHeading>Executive Summary Workspace</SectionHeading>
        <p className="mt-2 mb-5 text-sm text-[#7b7480]">
          Executive summaries for review. Displayed exactly as received.
        </p>
        <Card>
          <p className="text-sm text-[#7b7480]">No history records available.</p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <SectionLabel>Workspace</SectionLabel>
      <SectionHeading>Executive Summary Workspace</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Executive summaries for review. Displayed exactly as received. No processing applied.
      </p>

      <div className="space-y-4">
        {history.records.map((record, i) => (
          <Card key={i}>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">{record.headline.text}</p>
            <p className="mt-3 text-base leading-relaxed text-[#4f4a52]">{record.executiveSummary}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ── Section 3: History Review Workspace ───────────────────────────────────────

function HistoryWorkspaceCard({ record }: { record: ExecutiveReportHistoryEntry }) {
  return (
    <Card>
      <div className="mb-3 flex items-start justify-between gap-4">
        <p className="text-sm font-bold uppercase tracking-wide text-[#4f4a52]">
          {record.headline.text}
        </p>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${SEVERITY_STYLES[record.overallStatus]}`}>
          {SEVERITY_LABELS[record.overallStatus]}
        </span>
      </div>
      <div className="h-px bg-gray-100" />
      <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">{record.executiveSummary}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="text-[10px] text-[#a09aa6]">{fmtDate(record.generatedAt)}</span>
        <span className="text-[10px] uppercase tracking-wider text-[#a09aa6]">
          {record.entryCount} entr{record.entryCount === 1 ? "y" : "ies"}
        </span>
      </div>
    </Card>
  );
}

function HistoryReviewWorkspaceSection({ history }: { history: ExecutiveReportHistory }) {
  if (history.records.length === 0) {
    return (
      <section>
        <SectionLabel>Review</SectionLabel>
        <SectionHeading>History Review Workspace</SectionHeading>
        <p className="mt-2 mb-5 text-sm text-[#7b7480]">
          History records for executive review.
        </p>
        <Card>
          <p className="text-sm text-[#7b7480]">No history records available.</p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <SectionLabel>Review</SectionLabel>
      <SectionHeading>History Review Workspace</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        {history.records.length} record{history.records.length === 1 ? "" : "s"} for executive review.
        Displayed exactly as received.
      </p>

      <div className="space-y-4">
        {history.records.map((record, i) => (
          <HistoryWorkspaceCard key={i} record={record} />
        ))}
      </div>
    </section>
  );
}

// ── Section 4: History Readiness ──────────────────────────────────────────────

function HistoryReadinessSection({ history }: { history: ExecutiveReportHistory }) {
  const latestGeneratedAt = history.records.length > 0
    ? history.records[history.records.length - 1].generatedAt
    : null;

  return (
    <section>
      <SectionLabel>Readiness</SectionLabel>
      <SectionHeading>History Readiness</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Aggregate history readiness at generation time.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Total History Records</p>
          <p className="mt-3 text-3xl font-black text-[#4f4a52]">{history.records.length}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Latest Generated At</p>
          <p className="mt-3 text-sm font-bold text-[#4f4a52]">
            {latestGeneratedAt ? fmtDate(latestGeneratedAt) : "—"}
          </p>
        </Card>
      </div>
    </section>
  );
}

// ── Section 5: History Metadata ───────────────────────────────────────────────

function HistoryMetadataSection({ history }: { history: ExecutiveReportHistory }) {
  return (
    <section>
      <SectionLabel>Metadata</SectionLabel>
      <SectionHeading>History Metadata</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        History generation metadata. No data is stored or persisted.
      </p>

      <Card>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">Generated At</td>
              <td className="py-3 text-right text-[#4f4a52]">{fmtDate(history.generatedAt)}</td>
            </tr>
            <tr>
              <td className="py-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">History Records</td>
              <td className="py-3 text-right text-[#4f4a52]">{history.records.length}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </section>
  );
}

// ── Section 6: Quick Navigation ───────────────────────────────────────────────

const QUICK_NAV_LINKS = [
  { href: "/admin",                                  label: "Operations" },
  { href: "/admin/operations",                       label: "Unified Operations" },
  { href: "/admin/executive-operations",             label: "Executive Operations" },
  { href: "/admin/alerts",                           label: "Alerts" },
  { href: "/admin/alert-center",                     label: "Alert Center" },
  { href: "/admin/executive-digest",                 label: "Executive Digest" },
  { href: "/admin/executive-briefing",               label: "Executive Briefing" },
  { href: "/admin/executive-report",                 label: "Executive Report" },
  { href: "/admin/executive-report-center",          label: "Executive Report Center" },
  { href: "/admin/executive-report-archive",         label: "Executive Report Archive" },
  { href: "/admin/executive-report-archive-center",  label: "Executive Report Archive Center" },
  { href: "/admin/executive-report-history",         label: "Executive Report History" },
  { href: "/admin/executive-report-history-center",  label: "Executive Report History Center" },
] as const;

function QuickNavigationSection() {
  return (
    <section>
      <SectionLabel>Navigation</SectionLabel>
      <SectionHeading>Quick Navigation</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Direct access to operations and intelligence consoles.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium text-[#4f4a52] shadow-sm transition hover:border-[#d89ca4] hover:text-[#d89ca4]"
          >
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  history: ExecutiveReportHistory;
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function ExecutiveReportHistoryCenter({ history }: Props) {
  return (
    <div className="min-h-screen bg-[#f5f1eb]">

      {/* ── Header ── */}
      <header className="flex items-center justify-between bg-[#4f4a52] px-6 py-4 print:hidden">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-[#d89ca4]">Internal</p>
            <p className="text-sm font-black uppercase tracking-widest text-white">Maison Operations</p>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-xs text-white/60 transition hover:text-white">
              Operations
            </Link>
            <Link href="/admin/briefing" className="text-xs text-white/60 transition hover:text-white">
              Briefing
            </Link>
            <Link href="/admin/intelligence" className="text-xs text-white/60 transition hover:text-white">
              Intelligence
            </Link>
            <Link href="/admin/recommendation-performance" className="text-xs text-white/60 transition hover:text-white">
              Performance
            </Link>
            <Link href="/admin/customer-intelligence" className="text-xs text-white/60 transition hover:text-white">
              Customer Intelligence
            </Link>
            <Link href="/admin/commerce-intelligence" className="text-xs text-white/60 transition hover:text-white">
              Commerce Intelligence
            </Link>
            <Link href="/admin/executive-operations" className="text-xs text-white/60 transition hover:text-white">
              Executive Operations
            </Link>
            <Link href="/admin/operations" className="text-xs text-white/60 transition hover:text-white">
              Unified Operations
            </Link>
            <Link href="/admin/alerts" className="text-xs text-white/60 transition hover:text-white">
              Alerts
            </Link>
            <Link href="/admin/alert-center" className="text-xs text-white/60 transition hover:text-white">
              Alert Center
            </Link>
            <Link href="/admin/executive-digest" className="text-xs text-white/60 transition hover:text-white">
              Executive Digest
            </Link>
            <Link href="/admin/executive-briefing" className="text-xs text-white/60 transition hover:text-white">
              Executive Briefing
            </Link>
            <Link href="/admin/executive-report" className="text-xs text-white/60 transition hover:text-white">
              Executive Report
            </Link>
            <Link href="/admin/executive-report-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Center
            </Link>
            <Link href="/admin/executive-report-archive" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Archive
            </Link>
            <Link href="/admin/executive-report-archive-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Archive Center
            </Link>
            <Link href="/admin/executive-report-history" className="text-xs text-white/60 transition hover:text-white">
              Executive Report History
            </Link>
            <span className="text-xs font-bold text-white">Executive Report History Center</span>
          </nav>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-xs text-white/60 transition hover:text-white">
            Sign Out
          </button>
        </form>
      </header>

      {/* ── Content ── */}
      <div className="mx-auto w-full max-w-[780px] space-y-14 px-6 py-12">

        <HistoryWorkspaceOverviewSection history={history} />

        <hr className="border-gray-200" />

        <ExecutiveSummaryWorkspaceSection history={history} />

        <hr className="border-gray-200" />

        <HistoryReviewWorkspaceSection history={history} />

        <hr className="border-gray-200" />

        <HistoryReadinessSection history={history} />

        <hr className="border-gray-200" />

        <HistoryMetadataSection history={history} />

        <hr className="border-gray-200" />

        <QuickNavigationSection />

      </div>
    </div>
  );
}

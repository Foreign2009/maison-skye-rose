"use client";

import React            from "react";
import Link             from "next/link";
import { logoutAction } from "./actions";
import type { AlertCategory, AlertSeverity } from "@/app/lib/operations/OperationsAlertTypes";
import type {
  ExecutiveReportArchive,
  ExecutiveReportArchiveEntry,
} from "@/app/lib/operations/ExecutiveReportArchiveTypes";

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

const CATEGORY_LABELS: Record<AlertCategory, string> = {
  "platform":       "Platform",
  "recommendation": "Recommendation",
  "customer":       "Customer",
  "commerce":       "Commerce",
  "operations":     "Operations",
};

// ── Section 1: Archive Headline ───────────────────────────────────────────────

function ArchiveHeadlineSection({ archive }: { archive: ExecutiveReportArchive }) {
  return (
    <section>
      <SectionLabel>Executive Report Archive</SectionLabel>
      <SectionHeading>Archive Headline</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Authoritative executive headline derived from the platform operations report.
        Refreshed on every page load.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${SEVERITY_STYLES[archive.overallStatus]}`}>
          {SEVERITY_LABELS[archive.overallStatus]}
        </span>
        <span className="rounded-full border border-gray-100 bg-white px-3 py-1 text-xs text-[#7b7480]">
          Generated: {fmtDate(archive.generatedAt)}
        </span>
      </div>

      <Card>
        <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Platform Headline</p>
        <p className="mt-3 text-lg font-black leading-snug text-[#4f4a52]">
          {archive.headline.text}
        </p>
      </Card>
    </section>
  );
}

// ── Section 2: Executive Summary ──────────────────────────────────────────────

function ExecutiveSummarySection({ archive }: { archive: ExecutiveReportArchive }) {
  return (
    <section>
      <SectionLabel>Summary</SectionLabel>
      <SectionHeading>Executive Summary</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Executive summary projected from the operations report. Displayed exactly as received.
      </p>

      <Card>
        <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Summary</p>
        <p className="mt-3 text-base leading-relaxed text-[#4f4a52]">{archive.executiveSummary}</p>
      </Card>
    </section>
  );
}

// ── Section 3: Archive Entries ────────────────────────────────────────────────

function ArchiveEntryCard({ entry }: { entry: ExecutiveReportArchiveEntry }) {
  const num = String(entry.sequence).padStart(2, "0");

  return (
    <Card>
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-[#e8e3ef]">{num}</span>
          <p className="text-sm font-bold uppercase tracking-wide text-[#4f4a52]">{entry.title}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5 text-[9px] font-mono text-[#a09aa6]">
            {entry.alertId}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-[#a09aa6]">
            {CATEGORY_LABELS[entry.category]}
          </span>
        </div>
      </div>
      <div className="h-px bg-gray-100" />
      <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">{entry.body}</p>
    </Card>
  );
}

function ArchiveEntriesSection({ archive }: { archive: ExecutiveReportArchive }) {
  if (archive.entries.length === 0) {
    return (
      <section>
        <SectionLabel>Entries</SectionLabel>
        <SectionHeading>Archive Entries</SectionHeading>
        <p className="mt-2 mb-5 text-sm text-[#7b7480]">
          Archive entries projected from the executive report.
        </p>
        <Card>
          <p className="text-sm text-[#7b7480]">No archive entries. All alerts resolved.</p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <SectionLabel>Entries</SectionLabel>
      <SectionHeading>Archive Entries</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        {archive.entries.length} entr{archive.entries.length === 1 ? "y" : "ies"} projected from the executive report.
        Displayed exactly as received.
      </p>

      <div className="space-y-4">
        {archive.entries.map((entry) => (
          <ArchiveEntryCard key={entry.alertId} entry={entry} />
        ))}
      </div>
    </section>
  );
}

// ── Section 4: Archive Status ─────────────────────────────────────────────────

function ArchiveStatusSection({ archive }: { archive: ExecutiveReportArchive }) {
  return (
    <section>
      <SectionLabel>Status</SectionLabel>
      <SectionHeading>Archive Status</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Overall platform status and analytics connectivity at archive generation time.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Overall Status</p>
          <div className="mt-3">
            <span className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${SEVERITY_STYLES[archive.overallStatus]}`}>
              {SEVERITY_LABELS[archive.overallStatus]}
            </span>
          </div>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Analytics</p>
          <p className="mt-3 text-sm font-bold text-[#4f4a52]">
            {archive.analyticsAvailable ? "Connected" : "Offline"}
          </p>
          {!archive.analyticsAvailable && (
            <p className="mt-1 text-[10px] text-[#7b7480]">
              Configure PostHog environment variables to enable live intelligence.
            </p>
          )}
        </Card>
      </div>
    </section>
  );
}

// ── Section 5: Archive Metadata ───────────────────────────────────────────────

function ArchiveMetadataSection({ archive }: { archive: ExecutiveReportArchive }) {
  return (
    <section>
      <SectionLabel>Metadata</SectionLabel>
      <SectionHeading>Archive Metadata</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Archive generation metadata. No data is stored or persisted.
      </p>

      <Card>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">Generated At</td>
              <td className="py-3 text-right text-[#4f4a52]">{fmtDate(archive.generatedAt)}</td>
            </tr>
            <tr>
              <td className="py-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">Analytics Available</td>
              <td className="py-3 text-right text-[#4f4a52]">{archive.analyticsAvailable ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td className="py-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">Archive Entries</td>
              <td className="py-3 text-right text-[#4f4a52]">{archive.entries.length}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </section>
  );
}

// ── Section 6: Quick Navigation ───────────────────────────────────────────────

const QUICK_NAV_LINKS = [
  { href: "/admin",                          label: "Operations" },
  { href: "/admin/operations",               label: "Unified Operations" },
  { href: "/admin/executive-operations",     label: "Executive Operations" },
  { href: "/admin/alerts",                   label: "Alerts" },
  { href: "/admin/alert-center",             label: "Alert Center" },
  { href: "/admin/executive-digest",         label: "Executive Digest" },
  { href: "/admin/executive-briefing",       label: "Executive Briefing" },
  { href: "/admin/executive-report",         label: "Executive Report" },
  { href: "/admin/executive-report-center",  label: "Executive Report Center" },
  { href: "/admin/executive-report-archive", label: "Executive Report Archive" },
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
  archive: ExecutiveReportArchive;
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function ExecutiveReportArchiveDashboard({ archive }: Props) {
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
            <span className="text-xs font-bold text-white">Executive Report Archive</span>
            <Link href="/admin/executive-report-archive-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Archive Center
            </Link>
            <Link href="/admin/executive-report-history" className="text-xs text-white/60 transition hover:text-white">
              Executive Report History
            </Link>
            <Link href="/admin/executive-report-history-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report History Center
            </Link>
            <Link href="/admin/executive-report-comparison" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Comparison
            </Link>
            <Link href="/admin/executive-report-comparison-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Comparison Center
            </Link>
            <Link href="/admin/executive-report-delta" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Delta
            </Link>
            <Link href="/admin/executive-report-delta-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Delta Center
            </Link>
            <Link href="/admin/executive-report-insight" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Insight
            </Link>
            <Link href="/admin/executive-report-insight-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Insight Center
            </Link>
            <Link href="/admin/executive-report-trend" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Trend
            </Link>
            <Link href="/admin/executive-report-trend-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Trend Center
            </Link>
            <Link href="/admin/executive-report-forecast" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Forecast
            </Link>
            <Link href="/admin/executive-report-forecast-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Forecast Center
            </Link>
            <Link href="/admin/executive-report-outlook" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Outlook
            </Link>
            <Link href="/admin/executive-report-outlook-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Outlook Center
            </Link>
            <Link href="/admin/executive-report-strategy" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Strategy
            </Link>
            <Link href="/admin/executive-report-strategy-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Strategy Center
            </Link>
            <Link href="/admin/executive-report-action" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Action
            </Link>
            <Link href="/admin/executive-report-action-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Action Center
            </Link>
            <Link href="/admin/executive-report-decision" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Decision
            </Link>
            <Link href="/admin/executive-report-decision-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Decision Center
            </Link>
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

        <ArchiveHeadlineSection archive={archive} />

        <hr className="border-gray-200" />

        <ExecutiveSummarySection archive={archive} />

        <hr className="border-gray-200" />

        <ArchiveEntriesSection archive={archive} />

        <hr className="border-gray-200" />

        <ArchiveStatusSection archive={archive} />

        <hr className="border-gray-200" />

        <ArchiveMetadataSection archive={archive} />

        <hr className="border-gray-200" />

        <QuickNavigationSection />

      </div>
    </div>
  );
}

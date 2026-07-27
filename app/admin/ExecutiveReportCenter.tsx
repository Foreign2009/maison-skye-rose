"use client";

import React            from "react";
import Link             from "next/link";
import { logoutAction } from "./actions";
import type { AlertSeverity }          from "@/app/lib/operations/OperationsAlertTypes";
import type {
  ExecutiveReport,
  ExecutiveReportSection,
} from "@/app/lib/operations/ExecutiveReportTypes";

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

const READINESS_LABELS: Record<AlertSeverity, string> = {
  "critical": "Attention Required",
  "high":     "Review Required",
  "medium":   "Monitoring",
  "low":      "Ready",
};

// ── Section 1: Executive Overview ─────────────────────────────────────────────

function ExecutiveOverviewSection({ report }: { report: ExecutiveReport }) {
  return (
    <section>
      <SectionLabel>Executive Report Center</SectionLabel>
      <SectionHeading>Executive Overview</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Workspace view of the current executive report. Refreshed on every page load.
      </p>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${SEVERITY_STYLES[report.overallStatus]}`}>
          {SEVERITY_LABELS[report.overallStatus]}
        </span>
        <span className="rounded-full border border-gray-100 bg-white px-3 py-1 text-xs text-[#7b7480]">
          {fmtDate(report.generatedAt)}
        </span>
      </div>

      <Card>
        <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Executive Headline</p>
        <p className="mt-3 text-lg font-black leading-snug text-[#4f4a52]">
          {report.headline.text}
        </p>
      </Card>
    </section>
  );
}

// ── Section 2: Executive Summary Workspace ────────────────────────────────────

function ExecutiveSummaryWorkspaceSection({ report }: { report: ExecutiveReport }) {
  return (
    <section>
      <SectionLabel>Workspace</SectionLabel>
      <SectionHeading>Executive Summary Workspace</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Executive summary for review. Displayed exactly as received. No processing applied.
      </p>

      <Card>
        <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Executive Summary</p>
        <p className="mt-3 text-base leading-relaxed text-[#4f4a52]">{report.executiveSummary}</p>
      </Card>
    </section>
  );
}

// ── Section 3: Report Review Workspace ───────────────────────────────────────

function ReviewWorkspaceCard({
  section,
  index,
}: {
  section: ExecutiveReportSection;
  index:   number;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <Card>
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-[#e8e3ef]">{num}</span>
          <p className="text-sm font-bold uppercase tracking-wide text-[#4f4a52]">{section.title}</p>
        </div>
        <span className="shrink-0 rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5 text-[9px] font-mono text-[#a09aa6]">
          {section.alertId}
        </span>
      </div>
      <div className="h-px bg-gray-100" />
      <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">{section.body}</p>
    </Card>
  );
}

function ReportReviewWorkspaceSection({ report }: { report: ExecutiveReport }) {
  if (report.sections.length === 0) {
    return (
      <section>
        <SectionLabel>Review</SectionLabel>
        <SectionHeading>Report Review Workspace</SectionHeading>
        <p className="mt-2 mb-5 text-sm text-[#7b7480]">
          Report sections for executive review.
        </p>
        <Card>
          <p className="text-sm text-[#7b7480]">No active sections. All alerts resolved.</p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <SectionLabel>Review</SectionLabel>
      <SectionHeading>Report Review Workspace</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        {report.sections.length} section{report.sections.length === 1 ? "" : "s"} for executive review.
        Displayed exactly as received.
      </p>

      <div className="space-y-4">
        {report.sections.map((section, i) => (
          <ReviewWorkspaceCard key={section.alertId} section={section} index={i} />
        ))}
      </div>
    </section>
  );
}

// ── Section 4: Operational Status ─────────────────────────────────────────────

function OperationalStatusSection({ report }: { report: ExecutiveReport }) {
  return (
    <section>
      <SectionLabel>Status</SectionLabel>
      <SectionHeading>Operational Status</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Platform readiness and analytics connectivity at report generation time.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Platform Readiness</p>
          <p className="mt-3 text-xl font-black text-[#4f4a52]">
            {READINESS_LABELS[report.overallStatus]}
          </p>
          <div className="mt-3">
            <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${SEVERITY_STYLES[report.overallStatus]}`}>
              {SEVERITY_LABELS[report.overallStatus]}
            </span>
          </div>
        </Card>

        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Intelligence Availability</p>
          <p className="mt-3 text-xl font-black text-[#4f4a52]">
            {report.analyticsAvailable ? "Connected" : "Offline"}
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-wider text-[#a09aa6]">
            {report.analyticsAvailable
              ? "Live analytics connected"
              : "Configure PostHog to enable"}
          </p>
        </Card>
      </div>
    </section>
  );
}

// ── Section 5: Report Metadata ────────────────────────────────────────────────

function ReportMetadataSection({ report }: { report: ExecutiveReport }) {
  return (
    <section>
      <SectionLabel>Metadata</SectionLabel>
      <SectionHeading>Report Metadata</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Report generation metadata. No data is stored or persisted.
      </p>

      <Card>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">Generated At</td>
              <td className="py-3 text-right text-[#4f4a52]">{fmtDate(report.generatedAt)}</td>
            </tr>
            <tr>
              <td className="py-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">Analytics Available</td>
              <td className="py-3 text-right text-[#4f4a52]">{report.analyticsAvailable ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td className="py-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">Report Sections</td>
              <td className="py-3 text-right text-[#4f4a52]">{report.sections.length}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </section>
  );
}

// ── Section 6: Quick Navigation ───────────────────────────────────────────────

const QUICK_NAV_LINKS = [
  { href: "/admin",                         label: "Operations" },
  { href: "/admin/operations",              label: "Unified Operations" },
  { href: "/admin/executive-operations",    label: "Executive Operations" },
  { href: "/admin/alerts",                  label: "Alerts" },
  { href: "/admin/alert-center",            label: "Alert Center" },
  { href: "/admin/executive-digest",        label: "Executive Digest" },
  { href: "/admin/executive-briefing",      label: "Executive Briefing" },
  { href: "/admin/executive-report",        label: "Executive Report" },
  { href: "/admin/executive-report-center", label: "Executive Report Center" },
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
  report: ExecutiveReport;
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function ExecutiveReportCenter({ report }: Props) {
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
            <span className="text-xs font-bold text-white">Executive Report Center</span>
            <Link href="/admin/executive-report-archive" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Archive
            </Link>
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

        <ExecutiveOverviewSection report={report} />

        <hr className="border-gray-200" />

        <ExecutiveSummaryWorkspaceSection report={report} />

        <hr className="border-gray-200" />

        <ReportReviewWorkspaceSection report={report} />

        <hr className="border-gray-200" />

        <OperationalStatusSection report={report} />

        <hr className="border-gray-200" />

        <ReportMetadataSection report={report} />

        <hr className="border-gray-200" />

        <QuickNavigationSection />

      </div>
    </div>
  );
}

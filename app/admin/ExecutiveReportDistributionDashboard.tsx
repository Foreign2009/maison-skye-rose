"use client";

import React            from "react";
import Link             from "next/link";
import { logoutAction } from "./actions";
import type { AlertSeverity } from "@/app/lib/operations/OperationsAlertTypes";
import type {
  ExecutiveReportDistribution,
  ExecutiveReportDistributionEntry,
  ExecutiveReportDistributionState,
} from "@/app/lib/operations/ExecutiveReportDistributionTypes";

// â”€â”€ UI helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€ Formatter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// â”€â”€ Style maps â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

const DISTRIBUTION_STATE_STYLES: Record<ExecutiveReportDistributionState, string> = {
  "distributing": "border-gray-200  bg-gray-100  text-gray-500",
  "distributed":  "border-green-200 bg-green-50  text-green-700",
};

const DISTRIBUTION_STATE_LABELS: Record<ExecutiveReportDistributionState, string> = {
  "distributing": "Distributing",
  "distributed":  "Distributed",
};

// â”€â”€ Section 1: Distribution Overview â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function DistributionOverviewSection({ distribution }: { distribution: ExecutiveReportDistribution }) {
  return (
    <section>
      <SectionLabel>Executive Report Distribution</SectionLabel>
      <SectionHeading>Distribution Overview</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Aggregate view of the executive report distribution pipeline. Refreshed on every page load.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Total Records</p>
          <p className="mt-2 text-3xl font-black text-[#4f4a52]">{distribution.records.length}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Distribution Generated</p>
          <p className="mt-2 text-sm font-bold text-[#4f4a52]">{fmtDate(distribution.generatedAt)}</p>
        </Card>
      </div>
    </section>
  );
}

// â”€â”€ Section 2: Distribution Timeline â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function DistributionTimelineSection({ distribution }: { distribution: ExecutiveReportDistribution }) {
  if (distribution.records.length === 0) {
    return (
      <section>
        <SectionLabel>Timeline</SectionLabel>
        <SectionHeading>Distribution Timeline</SectionHeading>
        <p className="mt-2 mb-5 text-sm text-[#7b7480]">
          Chronological view of all distribution records.
        </p>
        <Card>
          <p className="text-sm text-[#7b7480]">No distribution records available.</p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <SectionLabel>Timeline</SectionLabel>
      <SectionHeading>Distribution Timeline</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        {distribution.records.length} record{distribution.records.length === 1 ? "" : "s"} in the distribution pipeline.
      </p>

      <Card>
        <div className="divide-y divide-gray-100">
          {distribution.records.map((entry, i) => (
            <div key={i} className="py-4 first:pt-0 last:pb-0">
              <div className="mb-2 flex items-center gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${DISTRIBUTION_STATE_STYLES[entry.state]}`}>
                  {DISTRIBUTION_STATE_LABELS[entry.state]}
                </span>
                <span className="ml-auto text-[10px] text-[#a09aa6]">{fmtDate(entry.generatedAt)}</span>
              </div>
              <p className="text-sm font-bold text-[#4f4a52]">
                {entry.publication.completion.execution.approval.decision.action.strategy.outlook.forecast.trend.insight.delta.comparison.current.headline.text}
              </p>
              <p className="mt-1 text-[10px] text-[#a09aa6]">
                Previous: {entry.publication.completion.execution.approval.decision.action.strategy.outlook.forecast.trend.insight.delta.comparison.previous?.headline.text ?? "â€”"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#7b7480]">
                {entry.publication.completion.execution.approval.decision.action.strategy.outlook.forecast.trend.insight.delta.comparison.current.executiveSummary}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

// â”€â”€ Section 3: Distribution Records â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function DistributionWorkspaceCard({ entry }: { entry: ExecutiveReportDistributionEntry }) {
  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${DISTRIBUTION_STATE_STYLES[entry.state]}`}>
          {DISTRIBUTION_STATE_LABELS[entry.state]}
        </span>
        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${SEVERITY_STYLES[entry.publication.completion.execution.approval.decision.action.strategy.outlook.forecast.trend.insight.delta.comparison.current.overallStatus]}`}>
          {SEVERITY_LABELS[entry.publication.completion.execution.approval.decision.action.strategy.outlook.forecast.trend.insight.delta.comparison.current.overallStatus]}
        </span>
        <span className="ml-auto text-[10px] text-[#a09aa6]">{fmtDate(entry.generatedAt)}</span>
      </div>
      <p className="text-sm font-bold text-[#4f4a52]">
        {entry.publication.completion.execution.approval.decision.action.strategy.outlook.forecast.trend.insight.delta.comparison.current.headline.text}
      </p>
      <div className="my-3 h-px bg-gray-100" />
      <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Previous Headline</p>
      <p className="mt-1 text-sm text-[#7b7480]">
        {entry.publication.completion.execution.approval.decision.action.strategy.outlook.forecast.trend.insight.delta.comparison.previous?.headline.text ?? "â€”"}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">
        {entry.publication.completion.execution.approval.decision.action.strategy.outlook.forecast.trend.insight.delta.comparison.current.executiveSummary}
      </p>
    </Card>
  );
}

function DistributionRecordsSection({ distribution }: { distribution: ExecutiveReportDistribution }) {
  if (distribution.records.length === 0) {
    return (
      <section>
        <SectionLabel>Records</SectionLabel>
        <SectionHeading>Distribution Records</SectionHeading>
        <p className="mt-2 mb-5 text-sm text-[#7b7480]">
          Detailed review cards for every distribution record.
        </p>
        <Card>
          <p className="text-sm text-[#7b7480]">No distribution records available.</p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <SectionLabel>Records</SectionLabel>
      <SectionHeading>Distribution Records</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        {distribution.records.length} record{distribution.records.length === 1 ? "" : "s"} in distribution review.
        Displayed exactly as received.
      </p>

      <div className="space-y-4">
        {distribution.records.map((entry, i) => (
          <DistributionWorkspaceCard key={i} entry={entry} />
        ))}
      </div>
    </section>
  );
}

// â”€â”€ Section 4: Distribution Status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function DistributionStatusSection({ distribution }: { distribution: ExecutiveReportDistribution }) {
  const latestGeneratedAt = distribution.records.length > 0
    ? distribution.records[distribution.records.length - 1].generatedAt
    : null;

  return (
    <section>
      <SectionLabel>Status</SectionLabel>
      <SectionHeading>Distribution Status</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Distribution readiness indicators at generation time.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Total Distribution Records</p>
          <p className="mt-3 text-3xl font-black text-[#4f4a52]">{distribution.records.length}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Latest Generated At</p>
          <p className="mt-3 text-sm font-bold text-[#4f4a52]">
            {latestGeneratedAt ? fmtDate(latestGeneratedAt) : "â€”"}
          </p>
        </Card>
      </div>
    </section>
  );
}

// â”€â”€ Section 5: Distribution Metadata â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function DistributionMetadataSection({ distribution }: { distribution: ExecutiveReportDistribution }) {
  return (
    <section>
      <SectionLabel>Metadata</SectionLabel>
      <SectionHeading>Distribution Metadata</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Distribution generation metadata. No data is stored or persisted.
      </p>

      <Card>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">Generated At</td>
              <td className="py-3 text-right text-[#4f4a52]">{fmtDate(distribution.generatedAt)}</td>
            </tr>
            <tr>
              <td className="py-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">Distribution Records</td>
              <td className="py-3 text-right text-[#4f4a52]">{distribution.records.length}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </section>
  );
}

// â”€â”€ Section 6: Quick Navigation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const QUICK_NAV_LINKS = [
  { href: "/admin",                                          label: "Operations" },
  { href: "/admin/operations",                               label: "Unified Operations" },
  { href: "/admin/executive-operations",                     label: "Executive Operations" },
  { href: "/admin/alerts",                                   label: "Alerts" },
  { href: "/admin/alert-center",                             label: "Alert Center" },
  { href: "/admin/executive-digest",                         label: "Executive Digest" },
  { href: "/admin/executive-briefing",                       label: "Executive Briefing" },
  { href: "/admin/executive-report",                         label: "Executive Report" },
  { href: "/admin/executive-report-center",                  label: "Executive Report Center" },
  { href: "/admin/executive-report-archive",                 label: "Executive Report Archive" },
  { href: "/admin/executive-report-archive-center",          label: "Executive Report Archive Center" },
  { href: "/admin/executive-report-history",                 label: "Executive Report History" },
  { href: "/admin/executive-report-history-center",          label: "Executive Report History Center" },
  { href: "/admin/executive-report-comparison",              label: "Executive Report Comparison" },
  { href: "/admin/executive-report-comparison-center",       label: "Executive Report Comparison Center" },
  { href: "/admin/executive-report-delta",                   label: "Executive Report Delta" },
  { href: "/admin/executive-report-delta-center",            label: "Executive Report Delta Center" },
  { href: "/admin/executive-report-insight",                 label: "Executive Report Insight" },
  { href: "/admin/executive-report-insight-center",          label: "Executive Report Insight Center" },
  { href: "/admin/executive-report-trend",                   label: "Executive Report Trend" },
  { href: "/admin/executive-report-trend-center",            label: "Executive Report Trend Center" },
  { href: "/admin/executive-report-forecast",                label: "Executive Report Forecast" },
  { href: "/admin/executive-report-forecast-center",         label: "Executive Report Forecast Center" },
  { href: "/admin/executive-report-outlook",                 label: "Executive Report Outlook" },
  { href: "/admin/executive-report-outlook-center",          label: "Executive Report Outlook Center" },
  { href: "/admin/executive-report-strategy",                label: "Executive Report Strategy" },
  { href: "/admin/executive-report-strategy-center",         label: "Executive Report Strategy Center" },
  { href: "/admin/executive-report-action",                  label: "Executive Report Action" },
  { href: "/admin/executive-report-action-center",           label: "Executive Report Action Center" },
  { href: "/admin/executive-report-decision",                label: "Executive Report Decision" },
  { href: "/admin/executive-report-decision-center",         label: "Executive Report Decision Center" },
  { href: "/admin/executive-report-approval",                label: "Executive Report Approval" },
  { href: "/admin/executive-report-approval-center",         label: "Executive Report Approval Center" },
  { href: "/admin/executive-report-execution",               label: "Executive Report Execution" },
  { href: "/admin/executive-report-execution-center",        label: "Executive Report Execution Center" },
  { href: "/admin/executive-report-completion",              label: "Executive Report Completion" },
  { href: "/admin/executive-report-completion-center",       label: "Executive Report Completion Center" },
  { href: "/admin/executive-report-publication",             label: "Executive Report Publication" },
  { href: "/admin/executive-report-publication-center",      label: "Executive Report Publication Center" },
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

// â”€â”€ Props â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface Props {
  distribution: ExecutiveReportDistribution;
}

// â”€â”€ Main export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ExecutiveReportDistributionDashboard({ distribution }: Props) {
  return (
    <div className="min-h-screen bg-[#f5f1eb]">

      {/* â”€â”€ Header â”€â”€ */}
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
            <Link href="/admin/executive-report-approval" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Approval
            </Link>
            <Link href="/admin/executive-report-approval-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Approval Center
            </Link>
            <Link href="/admin/executive-report-execution" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Execution
            </Link>
            <Link href="/admin/executive-report-execution-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Execution Center
            </Link>
            <Link href="/admin/executive-report-completion" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Completion
            </Link>
            <Link href="/admin/executive-report-completion-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Completion Center
            </Link>
            <Link href="/admin/executive-report-publication" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Publication
            </Link>
            <Link href="/admin/executive-report-publication-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Publication Center
            </Link>
            <span className="text-xs font-bold text-white">Executive Report Distribution</span>
            <Link href="/admin/executive-report-distribution-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Distribution Center
            </Link>
            <Link href="/admin/executive-report-delivery" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Delivery
            </Link>
            <Link href="/admin/executive-report-delivery-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Delivery Center
            </Link>
            <Link href="/admin/executive-report-acknowledgement" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Acknowledgement
            </Link>
            <Link href="/admin/executive-report-acknowledgement-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Acknowledgement Center
            </Link>
            <Link href="/admin/executive-report-receipt" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Receipt
            </Link>
            <Link href="/admin/executive-report-receipt-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Receipt Center
            </Link>
            <Link href="/admin/executive-report-confirmation" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Confirmation
            </Link>
            <Link href="/admin/executive-report-confirmation-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Confirmation Center
            </Link>
            <Link href="/admin/executive-report-validation" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Validation
            </Link>
            <Link href="/admin/executive-report-validation-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Validation Center
            </Link>
            <Link href="/admin/executive-report-certification" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Certification
            </Link>
            <Link href="/admin/executive-report-certification-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Certification Center
            </Link>
            <Link href="/admin/executive-report-authorization" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Authorization
            </Link>
            <Link href="/admin/executive-report-authorization-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Authorization Center
            </Link>
            <Link href="/admin/executive-report-authentication" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Authentication
            </Link>
            <Link href="/admin/executive-report-authentication-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Authentication Center
            </Link>
            <Link href="/admin/executive-report-ratification" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Ratification
            </Link>
            <Link href="/admin/executive-report-ratification-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Ratification Center
            </Link>
            <Link href="/admin/executive-report-endorsement" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Endorsement
            </Link>
            <Link href="/admin/executive-report-endorsement-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Endorsement Center
            </Link>
            <Link href="/admin/executive-report-acceptance" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Acceptance
            </Link>
            <Link href="/admin/executive-report-acceptance-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Acceptance Center
            </Link>
            <Link href="/admin/executive-report-adoption" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Adoption
            </Link>
            <Link href="/admin/executive-report-adoption-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Adoption Center
            </Link>
            <Link href="/admin/executive-report-commitment" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Commitment
            </Link>
          </nav>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-xs text-white/60 transition hover:text-white">
            Sign Out
          </button>
        </form>
      </header>

      {/* â”€â”€ Content â”€â”€ */}
      <div className="mx-auto w-full max-w-[780px] space-y-14 px-6 py-12">

        <DistributionOverviewSection distribution={distribution} />

        <hr className="border-gray-200" />

        <DistributionTimelineSection distribution={distribution} />

        <hr className="border-gray-200" />

        <DistributionRecordsSection distribution={distribution} />

        <hr className="border-gray-200" />

        <DistributionStatusSection distribution={distribution} />

        <hr className="border-gray-200" />

        <DistributionMetadataSection distribution={distribution} />

        <hr className="border-gray-200" />

        <QuickNavigationSection />

      </div>
    </div>
  );
}

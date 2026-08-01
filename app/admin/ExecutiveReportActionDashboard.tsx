"use client";

import React            from "react";
import Link             from "next/link";
import { logoutAction } from "./actions";
import type { AlertSeverity } from "@/app/lib/operations/OperationsAlertTypes";
import type {
  ExecutiveReportAction,
  ExecutiveReportActionEntry,
  ExecutiveReportActionState,
} from "@/app/lib/operations/ExecutiveReportActionTypes";

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

const ACTION_STATE_STYLES: Record<ExecutiveReportActionState, string> = {
  "plan":     "border-amber-100  bg-amber-50  text-amber-700",
  "continue": "border-gray-200   bg-gray-100  text-gray-500",
  "execute":  "border-green-200  bg-green-50  text-green-700",
};

const ACTION_STATE_LABELS: Record<ExecutiveReportActionState, string> = {
  "plan":     "Plan",
  "continue": "Continue",
  "execute":  "Execute",
};

// ── Section 1: Action Overview ────────────────────────────────────────────────

function ActionOverviewSection({ action }: { action: ExecutiveReportAction }) {
  return (
    <section>
      <SectionLabel>Executive Report Action</SectionLabel>
      <SectionHeading>Action Overview</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Aggregate view of the executive report action layer. Refreshed on every page load.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Total Records</p>
          <p className="mt-2 text-3xl font-black text-[#4f4a52]">{action.records.length}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Action Generated</p>
          <p className="mt-2 text-sm font-bold text-[#4f4a52]">{fmtDate(action.generatedAt)}</p>
        </Card>
      </div>
    </section>
  );
}

// ── Section 2: Action Timeline ────────────────────────────────────────────────

function ActionTimelineSection({ action }: { action: ExecutiveReportAction }) {
  if (action.records.length === 0) {
    return (
      <section>
        <SectionLabel>Timeline</SectionLabel>
        <SectionHeading>Action Timeline</SectionHeading>
        <p className="mt-2 mb-5 text-sm text-[#7b7480]">
          Chronological view of all action records.
        </p>
        <Card>
          <p className="text-sm text-[#7b7480]">No action records available.</p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <SectionLabel>Timeline</SectionLabel>
      <SectionHeading>Action Timeline</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        {action.records.length} record{action.records.length === 1 ? "" : "s"} in the action timeline.
      </p>

      <Card>
        <div className="divide-y divide-gray-100">
          {action.records.map((entry, i) => (
            <div key={i} className="py-4 first:pt-0 last:pb-0">
              <div className="mb-2 flex items-center gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${ACTION_STATE_STYLES[entry.state]}`}>
                  {ACTION_STATE_LABELS[entry.state]}
                </span>
                <span className="ml-auto text-[10px] text-[#a09aa6]">{fmtDate(entry.generatedAt)}</span>
              </div>
              <p className="text-sm font-bold text-[#4f4a52]">
                {entry.strategy.outlook.forecast.trend.insight.delta.comparison.current.headline.text}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

// ── Section 3: Action Records ─────────────────────────────────────────────────

function ActionRecordCard({ entry }: { entry: ExecutiveReportActionEntry }) {
  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${ACTION_STATE_STYLES[entry.state]}`}>
          {ACTION_STATE_LABELS[entry.state]}
        </span>
        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${SEVERITY_STYLES[entry.strategy.outlook.forecast.trend.insight.delta.comparison.current.overallStatus]}`}>
          {SEVERITY_LABELS[entry.strategy.outlook.forecast.trend.insight.delta.comparison.current.overallStatus]}
        </span>
        <span className="ml-auto text-[10px] text-[#a09aa6]">{fmtDate(entry.generatedAt)}</span>
      </div>
      <p className="text-sm font-bold text-[#4f4a52]">
        {entry.strategy.outlook.forecast.trend.insight.delta.comparison.current.headline.text}
      </p>
      <div className="my-3 h-px bg-gray-100" />
      <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Previous Headline</p>
      <p className="mt-1 text-sm text-[#7b7480]">
        {entry.strategy.outlook.forecast.trend.insight.delta.comparison.previous?.headline.text ?? "—"}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">
        {entry.strategy.outlook.forecast.trend.insight.delta.comparison.current.executiveSummary}
      </p>
    </Card>
  );
}

function ActionRecordsSection({ action }: { action: ExecutiveReportAction }) {
  if (action.records.length === 0) {
    return (
      <section>
        <SectionLabel>Records</SectionLabel>
        <SectionHeading>Action Records</SectionHeading>
        <p className="mt-2 mb-5 text-sm text-[#7b7480]">
          Detailed review cards for every action record.
        </p>
        <Card>
          <p className="text-sm text-[#7b7480]">No action records available.</p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <SectionLabel>Records</SectionLabel>
      <SectionHeading>Action Records</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        {action.records.length} record{action.records.length === 1 ? "" : "s"} displayed exactly as received.
      </p>

      <div className="space-y-4">
        {action.records.map((entry, i) => (
          <ActionRecordCard key={i} entry={entry} />
        ))}
      </div>
    </section>
  );
}

// ── Section 4: Action Status ──────────────────────────────────────────────────

function ActionStatusSection({ action }: { action: ExecutiveReportAction }) {
  const latestGeneratedAt = action.records.length > 0
    ? action.records[action.records.length - 1].generatedAt
    : null;

  return (
    <section>
      <SectionLabel>Status</SectionLabel>
      <SectionHeading>Action Status</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Action status indicators at generation time.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Total Action Records</p>
          <p className="mt-3 text-3xl font-black text-[#4f4a52]">{action.records.length}</p>
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

// ── Section 5: Action Metadata ────────────────────────────────────────────────

function ActionMetadataSection({ action }: { action: ExecutiveReportAction }) {
  return (
    <section>
      <SectionLabel>Metadata</SectionLabel>
      <SectionHeading>Action Metadata</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Action generation metadata. No data is stored or persisted.
      </p>

      <Card>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">Generated At</td>
              <td className="py-3 text-right text-[#4f4a52]">{fmtDate(action.generatedAt)}</td>
            </tr>
            <tr>
              <td className="py-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">Action Records</td>
              <td className="py-3 text-right text-[#4f4a52]">{action.records.length}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </section>
  );
}

// ── Section 6: Quick Navigation ───────────────────────────────────────────────

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
  action: ExecutiveReportAction;
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function ExecutiveReportActionDashboard({ action }: Props) {
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
            <span className="text-xs font-bold text-white">Executive Report Action</span>
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
            <Link href="/admin/executive-report-distribution" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Distribution
            </Link>
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

        <ActionOverviewSection action={action} />

        <hr className="border-gray-200" />

        <ActionTimelineSection action={action} />

        <hr className="border-gray-200" />

        <ActionRecordsSection action={action} />

        <hr className="border-gray-200" />

        <ActionStatusSection action={action} />

        <hr className="border-gray-200" />

        <ActionMetadataSection action={action} />

        <hr className="border-gray-200" />

        <QuickNavigationSection />

      </div>
    </div>
  );
}

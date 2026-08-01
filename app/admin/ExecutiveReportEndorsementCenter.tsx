"use client";

import React            from "react";
import Link             from "next/link";
import { logoutAction } from "./actions";
import type { AlertSeverity } from "@/app/lib/operations/OperationsAlertTypes";
import type {
  ExecutiveReportEndorsement,
  ExecutiveReportEndorsementEntry,
  ExecutiveReportEndorsementState,
} from "@/app/lib/operations/ExecutiveReportEndorsementTypes";

// ── UI helpers ─────────────────────���──────────────────────────────────────────

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

// ── Formatter ─────────────────────────────────────────────────────���───────────

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Style maps ───────────────────────────────────────────────��────────────────

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

const ENDORSEMENT_STATE_STYLES: Record<ExecutiveReportEndorsementState, string> = {
  "endorsing": "border-gray-200  bg-gray-100  text-gray-500",
  "endorsed":  "border-green-200 bg-green-50  text-green-700",
};

const ENDORSEMENT_STATE_LABELS: Record<ExecutiveReportEndorsementState, string> = {
  "endorsing": "Endorsing",
  "endorsed":  "Endorsed",
};

// ── Section 1: Endorsement Workspace Overview ─────────────────────���───────────

function EndorsementWorkspaceOverviewSection({ endorsement }: { endorsement: ExecutiveReportEndorsement }) {
  const endorsed  = endorsement.records.filter(r => r.state === "endorsed").length;
  const endorsing = endorsement.records.filter(r => r.state === "endorsing").length;

  return (
    <section>
      <SectionLabel>Executive Report Endorsement</SectionLabel>
      <SectionHeading>Endorsement Workspace Overview</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Workspace-level view of the executive report endorsement pipeline. Refreshed on every page load.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Total Records</p>
          <p className="mt-2 text-3xl font-black text-[#4f4a52]">{endorsement.records.length}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Endorsed</p>
          <p className="mt-2 text-3xl font-black text-green-700">{endorsed}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Endorsing</p>
          <p className="mt-2 text-3xl font-black text-[#a09aa6]">{endorsing}</p>
        </Card>
      </div>
    </section>
  );
}

// ── Section 2: Executive Endorsement Workspace ──────────────────────��─────────

function ExecutiveEndorsementWorkspaceCard({ entry }: { entry: ExecutiveReportEndorsementEntry }) {
  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${ENDORSEMENT_STATE_STYLES[entry.state]}`}>
          {ENDORSEMENT_STATE_LABELS[entry.state]}
        </span>
        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${SEVERITY_STYLES[entry.ratification.authentication.authorization.certification.validation.verification.confirmation.receipt.acknowledgement.delivery.distribution.publication.completion.execution.approval.decision.action.strategy.outlook.forecast.trend.insight.delta.comparison.current.overallStatus]}`}>
          {SEVERITY_LABELS[entry.ratification.authentication.authorization.certification.validation.verification.confirmation.receipt.acknowledgement.delivery.distribution.publication.completion.execution.approval.decision.action.strategy.outlook.forecast.trend.insight.delta.comparison.current.overallStatus]}
        </span>
        <span className="ml-auto text-[10px] text-[#a09aa6]">{fmtDate(entry.generatedAt)}</span>
      </div>
      <p className="text-sm font-bold text-[#4f4a52]">
        {entry.ratification.authentication.authorization.certification.validation.verification.confirmation.receipt.acknowledgement.delivery.distribution.publication.completion.execution.approval.decision.action.strategy.outlook.forecast.trend.insight.delta.comparison.current.headline.text}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[#7b7480]">
        {entry.ratification.authentication.authorization.certification.validation.verification.confirmation.receipt.acknowledgement.delivery.distribution.publication.completion.execution.approval.decision.action.strategy.outlook.forecast.trend.insight.delta.comparison.current.executiveSummary}
      </p>
    </Card>
  );
}

function ExecutiveEndorsementWorkspaceSection({ endorsement }: { endorsement: ExecutiveReportEndorsement }) {
  if (endorsement.records.length === 0) {
    return (
      <section>
        <SectionLabel>Workspace</SectionLabel>
        <SectionHeading>Executive Endorsement Workspace</SectionHeading>
        <p className="mt-2 mb-5 text-sm text-[#7b7480]">
          Operational workspace view of all endorsement entries.
        </p>
        <Card>
          <p className="text-sm text-[#7b7480]">No endorsement entries available.</p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <SectionLabel>Workspace</SectionLabel>
      <SectionHeading>Executive Endorsement Workspace</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        {endorsement.records.length} endorsement {endorsement.records.length === 1 ? "entry" : "entries"} in the executive workspace.
      </p>

      <div className="space-y-4">
        {endorsement.records.map((entry, i) => (
          <ExecutiveEndorsementWorkspaceCard key={i} entry={entry} />
        ))}
      </div>
    </section>
  );
}

// ── Section 3: Endorsement Review Workspace ─────────────────────���─────────────

function EndorsementReviewWorkspaceSection({ endorsement }: { endorsement: ExecutiveReportEndorsement }) {
  if (endorsement.records.length === 0) {
    return (
      <section>
        <SectionLabel>Review</SectionLabel>
        <SectionHeading>Endorsement Review Workspace</SectionHeading>
        <p className="mt-2 mb-5 text-sm text-[#7b7480]">
          Review workspace for endorsement entry comparison.
        </p>
        <Card>
          <p className="text-sm text-[#7b7480]">No endorsement entries to review.</p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <SectionLabel>Review</SectionLabel>
      <SectionHeading>Endorsement Review Workspace</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Current and previous headline comparison across all endorsement entries.
      </p>

      <Card>
        <div className="divide-y divide-gray-100">
          {endorsement.records.map((entry, i) => (
            <div key={i} className="py-4 first:pt-0 last:pb-0">
              <div className="mb-2 flex items-center gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${ENDORSEMENT_STATE_STYLES[entry.state]}`}>
                  {ENDORSEMENT_STATE_LABELS[entry.state]}
                </span>
                <span className="ml-auto text-[10px] text-[#a09aa6]">{fmtDate(entry.generatedAt)}</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Current</p>
              <p className="mt-1 text-sm font-bold text-[#4f4a52]">
                {entry.ratification.authentication.authorization.certification.validation.verification.confirmation.receipt.acknowledgement.delivery.distribution.publication.completion.execution.approval.decision.action.strategy.outlook.forecast.trend.insight.delta.comparison.current.headline.text}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-[#a09aa6]">Previous</p>
              <p className="mt-1 text-sm text-[#7b7480]">
                {entry.ratification.authentication.authorization.certification.validation.verification.confirmation.receipt.acknowledgement.delivery.distribution.publication.completion.execution.approval.decision.action.strategy.outlook.forecast.trend.insight.delta.comparison.previous?.headline.text ?? "—"}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

// ── Section 4: Endorsement Readiness ─────────────────────────────────────────

function EndorsementReadinessSection({ endorsement }: { endorsement: ExecutiveReportEndorsement }) {
  const endorsed  = endorsement.records.filter(r => r.state === "endorsed").length;
  const endorsing = endorsement.records.filter(r => r.state === "endorsing").length;
  const total     = endorsement.records.length;
  const readyPct  = total > 0 ? Math.round((endorsed / total) * 100) : 0;

  return (
    <section>
      <SectionLabel>Readiness</SectionLabel>
      <SectionHeading>Endorsement Readiness</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Endorsement readiness indicators at generation time. No data is stored or persisted.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Endorsement Readiness</p>
          <p className="mt-2 text-3xl font-black text-[#4f4a52]">{readyPct}%</p>
          <p className="mt-1 text-[10px] text-[#a09aa6]">{endorsed} of {total} endorsed</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Pending Endorsement</p>
          <p className="mt-2 text-3xl font-black text-[#4f4a52]">{endorsing}</p>
          <p className="mt-1 text-[10px] text-[#a09aa6]">{endorsing === 1 ? "record" : "records"} endorsing</p>
        </Card>
      </div>
    </section>
  );
}

// ── Section 5: Endorsement Metadata ────────────────────────────────────────���─

function EndorsementMetadataSection({ endorsement }: { endorsement: ExecutiveReportEndorsement }) {
  return (
    <section>
      <SectionLabel>Metadata</SectionLabel>
      <SectionHeading>Endorsement Metadata</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Endorsement generation metadata. No data is stored or persisted.
      </p>

      <Card>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">Generated At</td>
              <td className="py-3 text-right text-[#4f4a52]">{fmtDate(endorsement.generatedAt)}</td>
            </tr>
            <tr>
              <td className="py-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">Endorsement Records</td>
              <td className="py-3 text-right text-[#4f4a52]">{endorsement.records.length}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </section>
  );
}

// ── Section 6: Quick Navigation ────────���──────────────────────────────────────

const QUICK_NAV_LINKS = [
  { href: "/admin",                                              label: "Operations" },
  { href: "/admin/operations",                                   label: "Unified Operations" },
  { href: "/admin/executive-operations",                         label: "Executive Operations" },
  { href: "/admin/alerts",                                       label: "Alerts" },
  { href: "/admin/alert-center",                                 label: "Alert Center" },
  { href: "/admin/executive-digest",                             label: "Executive Digest" },
  { href: "/admin/executive-briefing",                           label: "Executive Briefing" },
  { href: "/admin/executive-report",                             label: "Executive Report" },
  { href: "/admin/executive-report-center",                      label: "Executive Report Center" },
  { href: "/admin/executive-report-archive",                     label: "Executive Report Archive" },
  { href: "/admin/executive-report-archive-center",              label: "Executive Report Archive Center" },
  { href: "/admin/executive-report-history",                     label: "Executive Report History" },
  { href: "/admin/executive-report-history-center",              label: "Executive Report History Center" },
  { href: "/admin/executive-report-comparison",                  label: "Executive Report Comparison" },
  { href: "/admin/executive-report-comparison-center",           label: "Executive Report Comparison Center" },
  { href: "/admin/executive-report-delta",                       label: "Executive Report Delta" },
  { href: "/admin/executive-report-delta-center",                label: "Executive Report Delta Center" },
  { href: "/admin/executive-report-insight",                     label: "Executive Report Insight" },
  { href: "/admin/executive-report-insight-center",              label: "Executive Report Insight Center" },
  { href: "/admin/executive-report-trend",                       label: "Executive Report Trend" },
  { href: "/admin/executive-report-trend-center",                label: "Executive Report Trend Center" },
  { href: "/admin/executive-report-forecast",                    label: "Executive Report Forecast" },
  { href: "/admin/executive-report-forecast-center",             label: "Executive Report Forecast Center" },
  { href: "/admin/executive-report-outlook",                     label: "Executive Report Outlook" },
  { href: "/admin/executive-report-outlook-center",              label: "Executive Report Outlook Center" },
  { href: "/admin/executive-report-strategy",                    label: "Executive Report Strategy" },
  { href: "/admin/executive-report-strategy-center",             label: "Executive Report Strategy Center" },
  { href: "/admin/executive-report-action",                      label: "Executive Report Action" },
  { href: "/admin/executive-report-action-center",               label: "Executive Report Action Center" },
  { href: "/admin/executive-report-decision",                    label: "Executive Report Decision" },
  { href: "/admin/executive-report-decision-center",             label: "Executive Report Decision Center" },
  { href: "/admin/executive-report-approval",                    label: "Executive Report Approval" },
  { href: "/admin/executive-report-approval-center",             label: "Executive Report Approval Center" },
  { href: "/admin/executive-report-execution",                   label: "Executive Report Execution" },
  { href: "/admin/executive-report-execution-center",            label: "Executive Report Execution Center" },
  { href: "/admin/executive-report-completion",                  label: "Executive Report Completion" },
  { href: "/admin/executive-report-completion-center",           label: "Executive Report Completion Center" },
  { href: "/admin/executive-report-publication",                 label: "Executive Report Publication" },
  { href: "/admin/executive-report-publication-center",          label: "Executive Report Publication Center" },
  { href: "/admin/executive-report-distribution",                label: "Executive Report Distribution" },
  { href: "/admin/executive-report-distribution-center",         label: "Executive Report Distribution Center" },
  { href: "/admin/executive-report-delivery",                    label: "Executive Report Delivery" },
  { href: "/admin/executive-report-delivery-center",             label: "Executive Report Delivery Center" },
  { href: "/admin/executive-report-acknowledgement",             label: "Executive Report Acknowledgement" },
  { href: "/admin/executive-report-acknowledgement-center",      label: "Executive Report Acknowledgement Center" },
  { href: "/admin/executive-report-receipt",                     label: "Executive Report Receipt" },
  { href: "/admin/executive-report-receipt-center",              label: "Executive Report Receipt Center" },
  { href: "/admin/executive-report-confirmation",                label: "Executive Report Confirmation" },
  { href: "/admin/executive-report-confirmation-center",         label: "Executive Report Confirmation Center" },
  { href: "/admin/executive-report-validation",                  label: "Executive Report Validation" },
  { href: "/admin/executive-report-validation-center",           label: "Executive Report Validation Center" },
  { href: "/admin/executive-report-certification",               label: "Executive Report Certification" },
  { href: "/admin/executive-report-certification-center",        label: "Executive Report Certification Center" },
  { href: "/admin/executive-report-authorization",               label: "Executive Report Authorization" },
  { href: "/admin/executive-report-authorization-center",        label: "Executive Report Authorization Center" },
  { href: "/admin/executive-report-authentication",              label: "Executive Report Authentication" },
  { href: "/admin/executive-report-authentication-center",       label: "Executive Report Authentication Center" },
  { href: "/admin/executive-report-ratification",                label: "Executive Report Ratification" },
  { href: "/admin/executive-report-ratification-center",         label: "Executive Report Ratification Center" },
  { href: "/admin/executive-report-endorsement",                 label: "Executive Report Endorsement" },
  { href: "/admin/executive-report-endorsement-center",          label: "Executive Report Endorsement Center" },
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
  endorsement: ExecutiveReportEndorsement;
}

// ── Main export ──────────────────────────────────────────��────────────────────

export default function ExecutiveReportEndorsementCenter({ endorsement }: Props) {
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
            <Link href="/admin/executive-report-endorsement" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Endorsement
            </Link>
            <Link href="/admin/executive-report-endorsement-center" className="text-xs text-white/60 transition hover:text-white">
              Executive Report Endorsement Center
            </Link>
            <span className="text-xs font-bold text-white">Executive Report Acceptance</span>
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

        <EndorsementWorkspaceOverviewSection endorsement={endorsement} />

        <hr className="border-gray-200" />

        <ExecutiveEndorsementWorkspaceSection endorsement={endorsement} />

        <hr className="border-gray-200" />

        <EndorsementReviewWorkspaceSection endorsement={endorsement} />

        <hr className="border-gray-200" />

        <EndorsementReadinessSection endorsement={endorsement} />

        <hr className="border-gray-200" />

        <EndorsementMetadataSection endorsement={endorsement} />

        <hr className="border-gray-200" />

        <QuickNavigationSection />

      </div>
    </div>
  );
}

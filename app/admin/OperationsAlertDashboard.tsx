"use client";

import React            from "react";
import Link             from "next/link";
import { logoutAction } from "./actions";
import AdminNavigation from "./components/AdminNavigation";
import type {
  AlertSeverity,
  AlertStatus,
  OperationsAlert,
  OperationsAlertReport,
} from "@/app/lib/operations/OperationsAlertTypes";

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

const STATUS_STYLES: Record<AlertStatus, string> = {
  "active":     "border-red-200   bg-red-50   text-red-700",
  "monitoring": "border-amber-100 bg-amber-50 text-amber-700",
  "resolved":   "border-green-100 bg-green-50 text-green-700",
};

const STATUS_LABELS: Record<AlertStatus, string> = {
  "active":     "Active",
  "monitoring": "Monitoring",
  "resolved":   "Resolved",
};

// ── Alert Card ────────────────────────────────────────────────────────────────

function AlertCard({ alert }: { alert: OperationsAlert }) {
  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${SEVERITY_STYLES[alert.severity]}`}>
          {SEVERITY_LABELS[alert.severity]}
        </span>
        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${STATUS_STYLES[alert.status]}`}>
          {STATUS_LABELS[alert.status]}
        </span>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-[#a09aa6]">
          {alert.origin}
        </span>
      </div>
      <p className="text-sm font-bold text-[#4f4a52]">{alert.title}</p>
      <p className="mt-1 text-sm text-[#7b7480]">{alert.summary}</p>
      <p className="mt-3 text-[10px] text-[#a09aa6]">{fmtDate(alert.generatedAt)}</p>
    </Card>
  );
}

// ── Section 1: Executive Summary ──────────────────────────────────────────────

function ExecutiveSummarySection({ report }: { report: OperationsAlertReport }) {
  return (
    <section>
      <SectionLabel>Operations Alerts</SectionLabel>
      <SectionHeading>Executive Summary</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Standardized alert state derived from all intelligence domains. Updated on every page load.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Critical</p>
          <p className="mt-2 text-2xl font-black text-[#4f4a52]">{report.criticalCount}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Active</p>
          <p className="mt-2 text-2xl font-black text-[#4f4a52]">{report.activeCount}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Total</p>
          <p className="mt-2 text-2xl font-black text-[#4f4a52]">{report.alerts.length}</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Analytics</p>
          <p className="mt-2 text-sm font-bold text-[#4f4a52]">
            {report.analyticsAvailable ? "Connected" : "Offline"}
          </p>
        </Card>
      </div>

      <p className="mt-4 text-[10px] text-[#a09aa6]">Generated: {fmtDate(report.generatedAt)}</p>
    </section>
  );
}

// ── Section 2: Platform Alert ─────────────────────────────────────────────────

function PlatformAlertSection({ report }: { report: OperationsAlertReport }) {
  const alert = report.alerts.find((a) => a.id === "platform-summary");

  return (
    <section>
      <SectionLabel>Platform</SectionLabel>
      <SectionHeading>Platform Alert</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Aggregated platform status derived from all intelligence domains.
      </p>

      {alert ? (
        <AlertCard alert={alert} />
      ) : (
        <Card>
          <p className="text-sm text-[#7b7480]">Platform alert unavailable.</p>
        </Card>
      )}
    </section>
  );
}

// ── Section 3: Domain Alerts ──────────────────────────────────────────────────

function DomainAlertsSection({ report }: { report: OperationsAlertReport }) {
  const domainAlerts = report.alerts.filter((a) => a.id !== "platform-summary");

  return (
    <section>
      <SectionLabel>Domains</SectionLabel>
      <SectionHeading>Domain Alerts</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Alert state for each intelligence domain.
      </p>

      <div className="space-y-4">
        {domainAlerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </section>
  );
}

// ── Section 4: Alert Statistics ───────────────────────────────────────────────

function AlertStatisticsSection({ report }: { report: OperationsAlertReport }) {
  const resolvedCount  = report.alerts.length - report.activeCount;

  return (
    <section>
      <SectionLabel>Statistics</SectionLabel>
      <SectionHeading>Alert Statistics</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Aggregated alert counts. No calculations performed in the UI layer.
      </p>

      <Card>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Critical</p>
            <p className="mt-2 text-2xl font-black text-[#4f4a52]">{report.criticalCount}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Active</p>
            <p className="mt-2 text-2xl font-black text-[#4f4a52]">{report.activeCount}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Resolved</p>
            <p className="mt-2 text-2xl font-black text-[#4f4a52]">{resolvedCount}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Total</p>
            <p className="mt-2 text-2xl font-black text-[#4f4a52]">{report.alerts.length}</p>
          </div>
        </div>

        {!report.analyticsAvailable && (
          <p className="mt-4 text-sm text-[#7b7480]">
            Analytics offline — alerts reflect unavailable domain status only.
          </p>
        )}
      </Card>
    </section>
  );
}

// ── Section 5: Alert Timeline ─────────────────────────────────────────────────

function AlertTimelineSection({ report }: { report: OperationsAlertReport }) {
  return (
    <section>
      <SectionLabel>Timeline</SectionLabel>
      <SectionHeading>Alert Timeline</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        All alerts in the order they were generated. No sorting applied.
      </p>

      <div className="space-y-4">
        {report.alerts.map((alert, i) => (
          <div key={alert.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-[10px] font-bold text-[#a09aa6]">
                {i + 1}
              </div>
              {i < report.alerts.length - 1 && (
                <div className="mt-1 w-px flex-1 bg-gray-200" />
              )}
            </div>
            <div className="min-w-0 flex-1 pb-4">
              <AlertCard alert={alert} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Section 6: Quick Navigation ───────────────────────────────────────────────

const QUICK_NAV_LINKS = [
  { href: "/admin",                      label: "Operations" },
  { href: "/admin/operations",           label: "Unified Operations" },
  { href: "/admin/executive-operations", label: "Executive Operations" },
  { href: "/admin/alerts",               label: "Alerts" },
] as const;

function QuickNavigationSection() {
  return (
    <section>
      <SectionLabel>Navigation</SectionLabel>
      <SectionHeading>Quick Navigation</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Direct access to operations consoles.
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
  report: OperationsAlertReport;
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function OperationsAlertDashboard({ report }: Props) {
  return (
    <div className="min-h-screen bg-[#f5f1eb]">

      {/* ── Header ── */}
      <header className="flex items-center justify-between bg-[#4f4a52] px-6 py-4 print:hidden">
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

      {/* ── Content ── */}
      <div className="mx-auto w-full max-w-[780px] space-y-14 px-6 py-12">

        <ExecutiveSummarySection report={report} />

        <hr className="border-gray-200" />

        <PlatformAlertSection report={report} />

        <hr className="border-gray-200" />

        <DomainAlertsSection report={report} />

        <hr className="border-gray-200" />

        <AlertStatisticsSection report={report} />

        <hr className="border-gray-200" />

        <AlertTimelineSection report={report} />

        <hr className="border-gray-200" />

        <QuickNavigationSection />

      </div>
    </div>
  );
}

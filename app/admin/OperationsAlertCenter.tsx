"use client";

import React            from "react";
import Link             from "next/link";
import { logoutAction } from "./actions";
import type {
  AlertCategory,
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

const CATEGORY_LABELS: Record<AlertCategory, string> = {
  "platform":       "Platform",
  "recommendation": "Recommendation",
  "customer":       "Customer",
  "commerce":       "Commerce",
  "operations":     "Operations",
};

const ALL_SEVERITIES: readonly AlertSeverity[] = ["critical", "high", "medium", "low"];
const ALL_CATEGORIES: readonly AlertCategory[] = ["platform", "recommendation", "customer", "commerce", "operations"];

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

// ── Section 1: Executive Overview ─────────────────────────────────────────────

function ExecutiveOverviewSection({ report }: { report: OperationsAlertReport }) {
  return (
    <section>
      <SectionLabel>Operations Alert Center</SectionLabel>
      <SectionHeading>Executive Overview</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Aggregated alert state across all intelligence domains. Updated on every page load.
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

// ── Section 2: Alert Queue ────────────────────────────────────────────────────

function AlertQueueSection({ report }: { report: OperationsAlertReport }) {
  return (
    <section>
      <SectionLabel>Queue</SectionLabel>
      <SectionHeading>Alert Queue</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        All alerts in the exact order received. No sorting applied.
      </p>

      <Card>
        <div className="divide-y divide-gray-100">
          {report.alerts.map((alert, i) => (
            <div key={alert.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className="w-5 shrink-0 text-center text-[10px] font-bold text-[#a09aa6]">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#4f4a52]">{alert.title}</p>
                <p className="mt-0.5 truncate text-[10px] text-[#7b7480]">{alert.origin}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase ${SEVERITY_STYLES[alert.severity]}`}>
                  {SEVERITY_LABELS[alert.severity]}
                </span>
                <span className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase ${STATUS_STYLES[alert.status]}`}>
                  {STATUS_LABELS[alert.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

// ── Section 3: Severity Summary ───────────────────────────────────────────────

function SeveritySummarySection({ report }: { report: OperationsAlertReport }) {
  return (
    <section>
      <SectionLabel>Severity</SectionLabel>
      <SectionHeading>Severity Summary</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Alert counts grouped by severity level.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {ALL_SEVERITIES.map((sev) => {
          const sevAlerts = report.alerts.filter((a) => a.severity === sev);
          return (
            <Card key={sev}>
              <span className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${SEVERITY_STYLES[sev]}`}>
                {SEVERITY_LABELS[sev]}
              </span>
              <p className="mt-3 text-2xl font-black text-[#4f4a52]">{sevAlerts.length}</p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-[#a09aa6]">
                {sevAlerts.length === 1 ? "alert" : "alerts"}
              </p>
              {sevAlerts.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {sevAlerts.map((a) => (
                    <li key={a.id} className="text-[10px] text-[#7b7480]">— {a.title}</li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}

// ── Section 4: Category Summary ───────────────────────────────────────────────

function CategorySummarySection({ report }: { report: OperationsAlertReport }) {
  const activeCategories = ALL_CATEGORIES.filter((cat) =>
    report.alerts.some((a) => a.category === cat),
  );

  return (
    <section>
      <SectionLabel>Categories</SectionLabel>
      <SectionHeading>Category Summary</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Alert distribution across operational categories.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {activeCategories.map((cat) => {
          const catAlerts = report.alerts.filter((a) => a.category === cat);
          return (
            <Card key={cat}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">
                  {CATEGORY_LABELS[cat]}
                </p>
                <p className="text-xl font-black text-[#4f4a52]">{catAlerts.length}</p>
              </div>
              <div className="space-y-2">
                {catAlerts.map((a) => (
                  <div key={a.id} className="flex items-center gap-2">
                    <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase ${SEVERITY_STYLES[a.severity]}`}>
                      {SEVERITY_LABELS[a.severity]}
                    </span>
                    <span className="text-[10px] text-[#7b7480]">{a.title}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

// ── Section 5: Alert Detail List ──────────────────────────────────────────────

function AlertDetailListSection({ report }: { report: OperationsAlertReport }) {
  return (
    <section>
      <SectionLabel>Detail</SectionLabel>
      <SectionHeading>Alert Detail List</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Full detail for every alert in the report.
      </p>

      <div className="space-y-4">
        {report.alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
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
  { href: "/admin/alert-center",         label: "Alert Center" },
] as const;

function QuickNavigationSection() {
  return (
    <section>
      <SectionLabel>Navigation</SectionLabel>
      <SectionHeading>Quick Navigation</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Direct access to operations consoles.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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

export default function OperationsAlertCenter({ report }: Props) {
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
            <span className="text-xs font-bold text-white">Alert Center</span>
            <Link href="/admin/executive-digest" className="text-xs text-white/60 transition hover:text-white">
              Executive Digest
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

        <AlertQueueSection report={report} />

        <hr className="border-gray-200" />

        <SeveritySummarySection report={report} />

        <hr className="border-gray-200" />

        <CategorySummarySection report={report} />

        <hr className="border-gray-200" />

        <AlertDetailListSection report={report} />

        <hr className="border-gray-200" />

        <QuickNavigationSection />

      </div>
    </div>
  );
}

"use client";

import React            from "react";
import Link             from "next/link";
import { logoutAction } from "./actions";
import type { ExecutiveOperationsReport, ExecutiveStatus } from "@/app/lib/operations/ExecutiveOperationsTypes";
import type { ExecutiveBriefing, ObservationPriority }    from "@/app/lib/operations/ExecutiveBriefingTypes";

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

const STATUS_STYLES: Record<ExecutiveStatus, string> = {
  "operational":        "border-green-100 bg-green-50  text-green-700",
  "monitoring":         "border-amber-100 bg-amber-50  text-amber-700",
  "attention-required": "border-red-100   bg-red-50    text-red-700",
  "offline":            "border-gray-200  bg-gray-100  text-gray-500",
};

const STATUS_LABELS: Record<ExecutiveStatus, string> = {
  "operational":        "Operational",
  "monitoring":         "Monitoring",
  "attention-required": "Attention Required",
  "offline":            "Offline",
};

const PRIORITY_STYLES: Record<ObservationPriority, string> = {
  "high":   "border-red-100   bg-red-50   text-red-700",
  "medium": "border-amber-100 bg-amber-50 text-amber-700",
  "low":    "border-gray-200  bg-gray-100 text-gray-500",
};

// ── Section 1: Executive Header ───────────────────────────────────────────────

function ExecutiveHeaderSection({ briefing }: { briefing: ExecutiveBriefing }) {
  return (
    <section>
      <SectionLabel>Unified Operations</SectionLabel>
      <SectionHeading>Executive Header</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Cross-domain platform status at a glance. Updated on every page load.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[briefing.platformStatus]}`}>
          {STATUS_LABELS[briefing.platformStatus]}
        </span>
        <span className="rounded-full border border-gray-100 bg-white px-3 py-1 text-xs text-[#7b7480]">
          Generated: {fmtDate(briefing.generatedAt)}
        </span>
      </div>

      <Card>
        <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Platform Headline</p>
        <p className="mt-2 text-base font-bold text-[#4f4a52]">{briefing.platformHeadline}</p>
      </Card>
    </section>
  );
}

// ── Section 2: Executive Briefing ─────────────────────────────────────────────

function ExecutiveBriefingSection({ briefing }: { briefing: ExecutiveBriefing }) {
  return (
    <section>
      <SectionLabel>Intelligence Briefing</SectionLabel>
      <SectionHeading>Executive Briefing</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Observations derived from platform and domain status. No analytics queries.
      </p>

      <Card className="mb-4">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-black text-[#4f4a52]">{briefing.activeIntelligence}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Active</p>
          </div>
          <div className="h-8 w-px bg-gray-100" />
          <div className="text-center">
            <p className="text-2xl font-black text-[#4f4a52]">{briefing.totalDomains}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Total Domains</p>
          </div>
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">Observations</p>
        <ul className="space-y-3">
          {briefing.observations.map((obs, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className={`mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${PRIORITY_STYLES[obs.priority]}`}>
                {obs.priority}
              </span>
              <p className="text-sm text-[#7b7480]">{obs.text}</p>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}

// ── Section 3: Platform Status ────────────────────────────────────────────────

function PlatformStatusSection({ operations }: { operations: ExecutiveOperationsReport }) {
  const { sections, summary } = operations;

  return (
    <section>
      <SectionLabel>Platform Health</SectionLabel>
      <SectionHeading>Platform Status</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Status of each intelligence domain. Active domains have PostHog analytics connected.
      </p>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {sections.map((s) => (
          <Card key={s.domain}>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">{s.domain}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${STATUS_STYLES[s.status]}`}>
                {STATUS_LABELS[s.status]}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-[#4f4a52]">{s.keyMetric}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-[#a09aa6]">
              {s.analyticsAvailable ? "Analytics connected" : "No analytics"}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-black text-[#4f4a52]">{summary.activeIntelligence}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Active</p>
          </div>
          <div className="h-8 w-px bg-gray-100" />
          <div className="text-center">
            <p className="text-2xl font-black text-[#4f4a52]">{summary.totalDomains - summary.activeIntelligence}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Offline</p>
          </div>
          <div className="h-8 w-px bg-gray-100" />
          <div className="text-center">
            <p className="text-2xl font-black text-[#4f4a52]">{summary.totalDomains}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Total</p>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ── Section 4: Domain Overview ────────────────────────────────────────────────

function DomainOverviewSection({ operations }: { operations: ExecutiveOperationsReport }) {
  const { sections } = operations;

  return (
    <section>
      <SectionLabel>Domain Intelligence</SectionLabel>
      <SectionHeading>Domain Overview</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Status, headline, and key metric for each intelligence domain.
      </p>

      <div className="space-y-4">
        {sections.map((s) => (
          <div key={s.domain} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">{s.domain}</p>
              <div className="mt-2">
                <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${STATUS_STYLES[s.status]}`}>
                  {STATUS_LABELS[s.status]}
                </span>
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-wider text-[#a09aa6]">
                {s.analyticsAvailable ? "Analytics connected" : "No analytics"}
              </p>
            </Card>
            <Card className="sm:col-span-2">
              <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Headline</p>
              <p className="mt-2 text-sm font-medium leading-snug text-[#4f4a52]">{s.headline}</p>
              <p className="mt-3 text-xl font-black text-[#4f4a52]">{s.keyMetric}</p>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Section 5: Operations Report ──────────────────────────────────────────────

function OperationsReportSection({ operations }: { operations: ExecutiveOperationsReport }) {
  const { summary, analyticsAvailable } = operations;

  return (
    <section>
      <SectionLabel>Operations</SectionLabel>
      <SectionHeading>Operations Report</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Aggregated platform health signal across all intelligence domains.
      </p>

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[summary.platformStatus]}`}>
            {STATUS_LABELS[summary.platformStatus]}
          </span>
          <p className="text-sm text-[#7b7480]">{summary.headline}</p>
        </div>
      </Card>

      {!analyticsAvailable && (
        <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          No analytics available across any domain. Configure PostHog environment variables to enable intelligence.
        </div>
      )}
    </section>
  );
}

// ── Section 6: Quick Navigation ───────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/admin",                            label: "Operations" },
  { href: "/admin/briefing",                   label: "Briefing" },
  { href: "/admin/intelligence",               label: "Intelligence" },
  { href: "/admin/recommendation-performance", label: "Recommendation" },
  { href: "/admin/customer-intelligence",      label: "Customer" },
  { href: "/admin/commerce-intelligence",      label: "Commerce" },
  { href: "/admin/executive-operations",       label: "Executive Operations" },
] as const;

function QuickNavigationSection() {
  return (
    <section>
      <SectionLabel>Navigation</SectionLabel>
      <SectionHeading>Quick Navigation</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Direct access to all intelligence and operations consoles.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {NAV_LINKS.map(({ href, label }) => (
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
  operations: ExecutiveOperationsReport;
  briefing:   ExecutiveBriefing;
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function UnifiedOperationsConsole({ operations, briefing }: Props) {
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
            <span className="text-xs font-bold text-white">Unified Operations</span>
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

        <ExecutiveHeaderSection briefing={briefing} />

        <hr className="border-gray-200" />

        <ExecutiveBriefingSection briefing={briefing} />

        <hr className="border-gray-200" />

        <PlatformStatusSection operations={operations} />

        <hr className="border-gray-200" />

        <DomainOverviewSection operations={operations} />

        <hr className="border-gray-200" />

        <OperationsReportSection operations={operations} />

        <hr className="border-gray-200" />

        <QuickNavigationSection />

      </div>
    </div>
  );
}

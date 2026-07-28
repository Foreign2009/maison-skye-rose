"use client";

import React            from "react";
import Link             from "next/link";
import { logoutAction } from "./actions";
import type { AlertSeverity }              from "@/app/lib/operations/OperationsAlertTypes";
import type {
  ExecutiveDigestSection,
  ExecutiveOperationsDigest,
} from "@/app/lib/operations/ExecutiveOperationsDigestTypes";

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

// ── Section 1: Executive Headline ─────────────────────────────────────────────

function ExecutiveHeadlineSection({ digest }: { digest: ExecutiveOperationsDigest }) {
  return (
    <section>
      <SectionLabel>Executive Operations Digest</SectionLabel>
      <SectionHeading>Executive Headline</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Top-level executive framing of current platform operational state.
        Updated on every page load.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${SEVERITY_STYLES[digest.overallStatus]}`}>
          {SEVERITY_LABELS[digest.overallStatus]}
        </span>
        <span className="rounded-full border border-gray-100 bg-white px-3 py-1 text-xs text-[#7b7480]">
          Generated: {fmtDate(digest.generatedAt)}
        </span>
      </div>

      <Card>
        <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Platform Headline</p>
        <p className="mt-2 text-base font-bold text-[#4f4a52]">{digest.headline.text}</p>
      </Card>
    </section>
  );
}

// ── Section 2: Digest Summary ─────────────────────────────────────────────────

function DigestSummarySection({ digest }: { digest: ExecutiveOperationsDigest }) {
  return (
    <section>
      <SectionLabel>Summary</SectionLabel>
      <SectionHeading>Digest Summary</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Concise executive summary synthesized from the operational alert briefing.
      </p>

      <Card>
        <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Executive Summary</p>
        <p className="mt-3 text-sm leading-relaxed text-[#4f4a52]">{digest.summary}</p>
      </Card>
    </section>
  );
}

// ── Section 3: Key Observations ───────────────────────────────────────────────

function KeyObservationsSection({ digest }: { digest: ExecutiveOperationsDigest }) {
  if (digest.keyObservations.length === 0) {
    return (
      <section>
        <SectionLabel>Observations</SectionLabel>
        <SectionHeading>Key Observations</SectionHeading>
        <p className="mt-2 mb-5 text-sm text-[#7b7480]">
          Observations projected from alert briefing.
        </p>
        <Card>
          <p className="text-sm text-[#7b7480]">No active observations. All alerts resolved.</p>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <SectionLabel>Observations</SectionLabel>
      <SectionHeading>Key Observations</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        {digest.keyObservations.length} observation{digest.keyObservations.length === 1 ? "" : "s"} projected from the alert briefing.
      </p>

      <div className="space-y-4">
        {digest.keyObservations.map((obs: ExecutiveDigestSection) => (
          <Card key={obs.alertId}>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">{obs.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-[#4f4a52]">{obs.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ── Section 4: Operational Status ─────────────────────────────────────────────

function OperationalStatusSection({ digest }: { digest: ExecutiveOperationsDigest }) {
  return (
    <section>
      <SectionLabel>Status</SectionLabel>
      <SectionHeading>Operational Status</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Overall platform status and analytics connectivity.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Overall Status</p>
          <div className="mt-3">
            <span className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${SEVERITY_STYLES[digest.overallStatus]}`}>
              {SEVERITY_LABELS[digest.overallStatus]}
            </span>
          </div>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Analytics</p>
          <p className="mt-3 text-sm font-bold text-[#4f4a52]">
            {digest.analyticsAvailable ? "Connected" : "Offline"}
          </p>
          {!digest.analyticsAvailable && (
            <p className="mt-1 text-[10px] text-[#7b7480]">
              Configure PostHog environment variables to enable live intelligence.
            </p>
          )}
        </Card>
      </div>
    </section>
  );
}

// ── Section 5: Generated Information ─────────────────────────────────────────

function GeneratedInformationSection({ digest }: { digest: ExecutiveOperationsDigest }) {
  return (
    <section>
      <SectionLabel>Metadata</SectionLabel>
      <SectionHeading>Generated Information</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Digest generation metadata. No user data is stored or persisted.
      </p>

      <Card>
        <div className="space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Generated At</p>
            <p className="mt-1 text-sm text-[#4f4a52]">{fmtDate(digest.generatedAt)}</p>
          </div>
          <div className="h-px bg-gray-100" />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Analytics Available</p>
            <p className="mt-1 text-sm text-[#4f4a52]">{digest.analyticsAvailable ? "Yes" : "No"}</p>
          </div>
          <div className="h-px bg-gray-100" />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Key Observations</p>
            <p className="mt-1 text-sm text-[#4f4a52]">{digest.keyObservations.length}</p>
          </div>
        </div>
      </Card>
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
  { href: "/admin/executive-digest",     label: "Executive Digest" },
] as const;

function QuickNavigationSection() {
  return (
    <section>
      <SectionLabel>Navigation</SectionLabel>
      <SectionHeading>Quick Navigation</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Direct access to operations and intelligence consoles.
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
  digest: ExecutiveOperationsDigest;
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function ExecutiveOperationsDigestDashboard({ digest }: Props) {
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
            <span className="text-xs font-bold text-white">Executive Digest</span>
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

        <ExecutiveHeadlineSection digest={digest} />

        <hr className="border-gray-200" />

        <DigestSummarySection digest={digest} />

        <hr className="border-gray-200" />

        <KeyObservationsSection digest={digest} />

        <hr className="border-gray-200" />

        <OperationalStatusSection digest={digest} />

        <hr className="border-gray-200" />

        <GeneratedInformationSection digest={digest} />

        <hr className="border-gray-200" />

        <QuickNavigationSection />

      </div>
    </div>
  );
}

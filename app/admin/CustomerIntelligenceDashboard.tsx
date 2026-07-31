"use client";

import React             from "react";
import Link              from "next/link";
import { logoutAction }  from "./actions";
import type { CustomerBehaviourReport, FunnelStep } from "@/app/lib/customer/behaviour/CustomerBehaviourTypes";
import type { CustomerJourneyReport, CustomerJourneyStage } from "@/app/lib/customer/behaviour/CustomerJourneyAnalytics";
import type {
  CustomerSegmentReport,
  SegmentSummary,
  CustomerSegment,
  SegmentConfidence,
} from "@/app/lib/customer/behaviour/CustomerSegmentation";

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

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtCount(n: number | null): string {
  return n !== null ? n.toLocaleString() : "—";
}

function fmtRate(n: number | null): string {
  return n !== null ? (n * 100).toFixed(1) + "%" : "—";
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day:    "2-digit",
    month:  "short",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  });
}

// ── Style maps ────────────────────────────────────────────────────────────────

const CONFIDENCE_STYLES: Record<SegmentConfidence, string> = {
  "high":   "bg-green-50  text-green-700  border-green-100",
  "medium": "bg-amber-50  text-amber-700  border-amber-100",
  "low":    "bg-yellow-50 text-yellow-700 border-yellow-100",
  "none":   "bg-gray-100  text-gray-500   border-gray-200",
};

const CONFIDENCE_LABELS: Record<SegmentConfidence, string> = {
  "high":   "High",
  "medium": "Medium",
  "low":    "Low",
  "none":   "None",
};

const SEGMENT_LABELS: Record<CustomerSegment, string> = {
  "explorer":              "Explorer",
  "researcher":            "Researcher",
  "engaged-shopper":       "Engaged Shopper",
  "purchase-oriented":     "Purchase-Oriented",
  "insufficient-evidence": "Insufficient Evidence",
};

// ── Section 1: Executive Overview ─────────────────────────────────────────────

function ExecutiveOverviewSection({
  behaviourReport,
  journeyReport,
  segmentReport,
}: {
  behaviourReport: CustomerBehaviourReport;
  journeyReport:   CustomerJourneyReport;
  segmentReport:   CustomerSegmentReport;
}) {
  const { analyticsAvailable, analyticsWindowDays, generatedAt } = behaviourReport;
  const { overallCompletionRate } = journeyReport;
  const { dominantSegment }       = segmentReport.distribution;

  return (
    <section>
      <SectionLabel>Customer Intelligence</SectionLabel>
      <SectionHeading>Executive Overview</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Population-level summary of customer behaviour, journey completion, and segmentation.
        All values are derived from PostHog events. Updated on every page load.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            analyticsAvailable
              ? "border-green-100 bg-green-50 text-green-700"
              : "border-gray-200 bg-gray-100 text-gray-500"
          }`}
        >
          {analyticsAvailable ? "Analytics Available" : "No Analytics"}
        </span>
        <span className="rounded-full border border-gray-100 bg-white px-3 py-1 text-xs text-[#7b7480]">
          Window: {analyticsWindowDays}d
        </span>
        <span className="rounded-full border border-gray-100 bg-white px-3 py-1 text-xs text-[#7b7480]">
          Generated: {fmtDate(generatedAt)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">End-to-End Completion</p>
          <p className="mt-2 text-2xl font-black text-[#4f4a52]">{fmtRate(overallCompletionRate)}</p>
          <p className="mt-1 text-xs text-[#7b7480]">Discovery → Purchase</p>
        </Card>

        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Dominant Segment</p>
          <p className="mt-2 text-lg font-black text-[#4f4a52]">
            {dominantSegment ? SEGMENT_LABELS[dominantSegment] : "—"}
          </p>
          <p className="mt-1 text-xs text-[#7b7480]">Highest proxy count</p>
        </Card>

        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Analytics Window</p>
          <p className="mt-2 text-2xl font-black text-[#4f4a52]">{analyticsWindowDays}d</p>
          <p className="mt-1 text-xs text-[#7b7480]">Rolling event window</p>
        </Card>
      </div>

      {!analyticsAvailable && (
        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          No analytics available. Configure PostHog environment variables to enable customer intelligence.
        </div>
      )}
    </section>
  );
}

// ── Section 2: Behaviour Overview ─────────────────────────────────────────────

function BehaviourOverviewSection({ report }: { report: CustomerBehaviourReport }) {
  const { discoveryBreakdown: d, engagementMetrics: e, signalHealth: s, analyticsAvailable } = report;

  return (
    <section>
      <SectionLabel>Customer Behaviour</SectionLabel>
      <SectionHeading>Behaviour Overview</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Aggregate event counts across the discovery and engagement layers.
        Counts are population totals — not distinct user counts.
      </p>

      {!analyticsAvailable && (
        <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-[#7b7480]">
          No analytics available.
        </div>
      )}

      {/* Discovery */}
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#4f4a52]">Discovery</h3>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[
          { label: "Product Views",      value: d.productDetailViews },
          { label: "Quiz Completions",   value: d.quizCompletions },
          { label: "AI Chat Sessions",   value: d.aiChatSessions },
          { label: "Browse Mode",        value: d.discoveryModeBrowse },
          { label: "AI Mode",            value: d.discoveryModeAI },
          { label: "Character Mode",     value: d.discoveryModeCharacter },
        ].map(({ label, value }) => (
          <Card key={label}>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">{label}</p>
            <p className="mt-2 text-xl font-black text-[#4f4a52]">{fmtCount(value)}</p>
          </Card>
        ))}
      </div>

      {/* Engagement */}
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#4f4a52]">Engagement</h3>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Favourites Added",   value: e.favouritesAdded },
          { label: "Cart Adds",          value: e.cartAdds },
          { label: "Checkouts Started",  value: e.checkoutsStarted },
          { label: "Purchases",          value: e.purchaseCompletions },
        ].map(({ label, value }) => (
          <Card key={label}>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">{label}</p>
            <p className="mt-2 text-xl font-black text-[#4f4a52]">{fmtCount(value)}</p>
          </Card>
        ))}
      </div>

      {/* Signal Health */}
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#4f4a52]">Signal Health</h3>
      <Card>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Active Sources</p>
            <p className="mt-1 text-xl font-black text-[#4f4a52]">{s.activeSources.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Unused Sources</p>
            <p className="mt-1 text-xl font-black text-[#4f4a52]">{s.unusedSources.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Active Types</p>
            <p className="mt-1 text-xl font-black text-[#4f4a52]">{s.activeTypes.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Dead Types</p>
            <p className="mt-1 text-xl font-black text-[#4f4a52]">{s.deadTypes.length}</p>
          </div>
        </div>
        {s.deadTypes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {s.deadTypes.map((t) => (
              <span
                key={t}
                className="rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}

// ── Section 3: Journey Overview ───────────────────────────────────────────────

function FunnelStageRow({ stage }: { stage: CustomerJourneyStage }) {
  return (
    <tr className="border-b border-gray-50 last:border-0">
      <td className="py-3 pr-4 text-sm font-medium text-[#4f4a52]">{stage.label}</td>
      <td className="py-3 pr-4 text-right text-sm tabular-nums text-[#7b7480]">
        {fmtCount(stage.count)}
      </td>
      <td className="py-3 pr-4 text-right text-sm tabular-nums text-[#7b7480]">
        {fmtRate(stage.conversionRate)}
      </td>
      <td className="py-3 pr-4 text-right text-sm tabular-nums text-[#7b7480]">
        {fmtRate(stage.dropOffRate)}
      </td>
      <td className="py-3">
        <div className="flex justify-end gap-1.5">
          {stage.entered && (
            <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase text-blue-600">
              Entered
            </span>
          )}
          {stage.completed && (
            <span className="rounded-full border border-green-100 bg-green-50 px-2 py-0.5 text-[9px] font-bold uppercase text-green-600">
              Measured
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}

function JourneyOverviewSection({ report }: { report: CustomerJourneyReport }) {
  const { stages, overallCompletionRate, highestDropOffStage, strongestStage, analyticsAvailable } = report;

  return (
    <section>
      <SectionLabel>Customer Journey</SectionLabel>
      <SectionHeading>Journey Overview</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Population-level funnel progression. Conversion and drop-off rates are relative to the previous stage.
        Steps 2–6 only carry conversion data — the first stage has no previous stage to measure against.
      </p>

      {!analyticsAvailable && (
        <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-[#7b7480]">
          No analytics available.
        </div>
      )}

      {/* Callout cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">End-to-End Completion</p>
          <p className="mt-2 text-2xl font-black text-[#4f4a52]">{fmtRate(overallCompletionRate)}</p>
          <p className="mt-1 text-xs text-[#7b7480]">Discovery → Purchase</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Strongest Stage</p>
          <p className="mt-2 text-lg font-black text-[#4f4a52]">
            {strongestStage
              ? (stages.find((s) => s.stage === strongestStage)?.label ?? strongestStage)
              : "—"}
          </p>
          <p className="mt-1 text-xs text-[#7b7480]">Highest conversion rate</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Highest Drop-Off</p>
          <p className="mt-2 text-lg font-black text-[#4f4a52]">
            {highestDropOffStage
              ? (stages.find((s) => s.stage === highestDropOffStage)?.label ?? highestDropOffStage)
              : "—"}
          </p>
          <p className="mt-1 text-xs text-[#7b7480]">Largest funnel leak</p>
        </Card>
      </div>

      {/* Funnel table */}
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[520px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-5 py-3 text-left text-[10px] uppercase tracking-widest text-[#a09aa6]">Stage</th>
              <th className="px-5 py-3 text-right text-[10px] uppercase tracking-widest text-[#a09aa6]">Count</th>
              <th className="px-5 py-3 text-right text-[10px] uppercase tracking-widest text-[#a09aa6]">Conversion</th>
              <th className="px-5 py-3 text-right text-[10px] uppercase tracking-widest text-[#a09aa6]">Drop-Off</th>
              <th className="px-5 py-3 text-right text-[10px] uppercase tracking-widest text-[#a09aa6]">Status</th>
            </tr>
          </thead>
          <tbody className="px-5">
            {stages.map((stage) => (
              <tr key={stage.stage} className="border-b border-gray-50 last:border-0">
                <td className="px-5 py-3 text-sm font-medium text-[#4f4a52]">{stage.label}</td>
                <td className="px-5 py-3 text-right text-sm tabular-nums text-[#7b7480]">
                  {fmtCount(stage.count)}
                </td>
                <td className="px-5 py-3 text-right text-sm tabular-nums text-[#7b7480]">
                  {fmtRate(stage.conversionRate)}
                </td>
                <td className="px-5 py-3 text-right text-sm tabular-nums text-[#7b7480]">
                  {fmtRate(stage.dropOffRate)}
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-1.5">
                    {stage.entered && (
                      <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase text-blue-600">
                        Entered
                      </span>
                    )}
                    {stage.completed && (
                      <span className="rounded-full border border-green-100 bg-green-50 px-2 py-0.5 text-[9px] font-bold uppercase text-green-600">
                        Measured
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}

// ── Section 4: Segmentation Overview ──────────────────────────────────────────

function SegmentCard({ summary }: { summary: SegmentSummary }) {
  return (
    <Card className={summary.present ? "" : "opacity-60"}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-[#4f4a52]">{summary.label}</p>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${CONFIDENCE_STYLES[summary.confidence]}`}
        >
          {CONFIDENCE_LABELS[summary.confidence]}
        </span>
      </div>
      <p className="mt-2 text-xl font-black text-[#4f4a52]">{fmtCount(summary.count)}</p>
      <p className="mt-2 text-xs leading-relaxed text-[#7b7480]">{summary.reason}</p>
      {!summary.present && (
        <p className="mt-2 text-[10px] uppercase tracking-wider text-[#a09aa6]">No evidence</p>
      )}
    </Card>
  );
}

function SegmentationOverviewSection({ report }: { report: CustomerSegmentReport }) {
  const { segments, distribution, analyticsAvailable } = report;
  const { dominantSegment, countsBySegment }           = distribution;

  const evidencedSegments = segments.filter((s) => s.segment !== "insufficient-evidence");
  const insufficientEvidence = segments.find((s) => s.segment === "insufficient-evidence");

  return (
    <section>
      <SectionLabel>Customer Segmentation</SectionLabel>
      <SectionHeading>Segmentation Overview</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Behavioural archetypes derived from aggregate event counts. Proxy counts are population
        totals — not distinct user counts. Evidence basis is stated in each segment card.
      </p>

      {!analyticsAvailable && insufficientEvidence && (
        <div className="mb-5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {insufficientEvidence.reason}
        </div>
      )}

      {analyticsAvailable && dominantSegment && (
        <div className="mb-5 rounded-xl border border-[#d89ca4]/20 bg-white px-4 py-3">
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Dominant Segment</p>
          <p className="mt-1 text-base font-black text-[#4f4a52]">{SEGMENT_LABELS[dominantSegment]}</p>
          <p className="text-xs text-[#7b7480]">
            Highest proxy count: {fmtCount(countsBySegment[dominantSegment])}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {evidencedSegments.map((s) => (
          <SegmentCard key={s.segment} summary={s} />
        ))}
      </div>
    </section>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  behaviourReport: CustomerBehaviourReport;
  journeyReport:   CustomerJourneyReport;
  segmentReport:   CustomerSegmentReport;
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function CustomerIntelligenceDashboard({ behaviourReport, journeyReport, segmentReport }: Props) {
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
            <span className="text-xs font-bold text-white">Customer Intelligence</span>
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

        <ExecutiveOverviewSection
          behaviourReport={behaviourReport}
          journeyReport={journeyReport}
          segmentReport={segmentReport}
        />

        <hr className="border-gray-200" />

        <BehaviourOverviewSection report={behaviourReport} />

        <hr className="border-gray-200" />

        <JourneyOverviewSection report={journeyReport} />

        <hr className="border-gray-200" />

        <SegmentationOverviewSection report={segmentReport} />

      </div>
    </div>
  );
}

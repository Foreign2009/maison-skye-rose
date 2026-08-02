"use client";

import React            from "react";
import Link             from "next/link";
import { logoutAction } from "./actions";
import type { CommerceBehaviourReport } from "@/app/lib/commerce/CommerceBehaviourTypes";
import type {
  CheckoutFunnelReport,
  CheckoutStage,
  CheckoutStageKey,
} from "@/app/lib/commerce/CheckoutFunnelIntelligence";
import type {
  ProductPerformanceReport,
  PerformanceSummary,
  PerformanceCategory,
  PerformanceHealth,
  CommerceHealth,
} from "@/app/lib/commerce/ProductPerformanceIntelligence";

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
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Style maps ────────────────────────────────────────────────────────────────

const COMMERCE_HEALTH_STYLES: Record<CommerceHealth, string> = {
  "healthy":               "border-green-100 bg-green-50  text-green-700",
  "needs-attention":       "border-amber-100 bg-amber-50  text-amber-700",
  "insufficient-evidence": "border-gray-200  bg-gray-100  text-gray-500",
};

const COMMERCE_HEALTH_LABELS: Record<CommerceHealth, string> = {
  "healthy":               "Healthy",
  "needs-attention":       "Needs Attention",
  "insufficient-evidence": "Awaiting Evidence",
};

const PERFORMANCE_HEALTH_STYLES: Record<PerformanceHealth, string> = {
  "strong":                "border-green-100 bg-green-50  text-green-700",
  "moderate":              "border-blue-100  bg-blue-50   text-blue-700",
  "weak":                  "border-red-100   bg-red-50    text-red-700",
  "insufficient-evidence": "border-gray-200  bg-gray-100  text-gray-500",
};

const PERFORMANCE_HEALTH_LABELS: Record<PerformanceHealth, string> = {
  "strong":                "Strong",
  "moderate":              "Moderate",
  "weak":                  "Weak",
  "insufficient-evidence": "No Data",
};

const STAGE_LABELS: Record<CheckoutStageKey, string> = {
  "cart-opened":        "Cart Opened",
  "cart-addition":      "Cart Addition",
  "checkout-started":   "Checkout Started",
  "payment-started":    "Payment Started",
  "payment-successful": "Payment Successful",
};

const CATEGORY_LABELS: Record<PerformanceCategory, string> = {
  "discovery": "Discovery",
  "cart":      "Cart",
  "checkout":  "Checkout",
  "payment":   "Payment",
};

// ── Section 1: Executive Overview ─────────────────────────────────────────────

function ExecutiveOverviewSection({
  behaviourReport,
  funnelReport,
  performanceReport,
}: {
  behaviourReport:   CommerceBehaviourReport;
  funnelReport:      CheckoutFunnelReport;
  performanceReport: ProductPerformanceReport;
}) {
  const { analyticsAvailable, analyticsWindowDays, generatedAt } = behaviourReport;
  const { overallCompletionRate } = funnelReport;
  const { overallCommerceHealth } = performanceReport;

  return (
    <section>
      <SectionLabel>Commerce Intelligence</SectionLabel>
      <SectionHeading>Executive Overview</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Population-level commerce funnel metrics derived from PostHog events.
        All values are computed from live analytics on every page load.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
          analyticsAvailable
            ? "border-green-100 bg-green-50 text-green-700"
            : "border-gray-200 bg-gray-100 text-gray-500"
        }`}>
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
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Commerce Health</p>
          <p className="mt-2 text-base font-black text-[#4f4a52]">
            {COMMERCE_HEALTH_LABELS[overallCommerceHealth]}
          </p>
          <span className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${COMMERCE_HEALTH_STYLES[overallCommerceHealth]}`}>
            {COMMERCE_HEALTH_LABELS[overallCommerceHealth]}
          </span>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">End-to-End Completion</p>
          <p className="mt-2 text-2xl font-black text-[#4f4a52]">{fmtRate(overallCompletionRate)}</p>
          <p className="mt-1 text-xs text-[#7b7480]">Cart opened → payment successful</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Reporting Window</p>
          <p className="mt-2 text-2xl font-black text-[#4f4a52]">{analyticsWindowDays}d</p>
          <p className="mt-1 text-xs text-[#7b7480]">Rolling event window</p>
        </Card>
      </div>

      {!analyticsAvailable && (
        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          No commerce analytics available. Configure PostHog environment variables to enable commerce intelligence.
        </div>
      )}
    </section>
  );
}

// ── Section 2: Commerce Behaviour ─────────────────────────────────────────────

function CommerceBehaviourSection({ report }: { report: CommerceBehaviourReport }) {
  const { cartMetrics: c, checkoutMetrics: ch, paymentMetrics: p, commerceMetrics: cm, analyticsAvailable } = report;

  return (
    <section>
      <SectionLabel>Commerce Behaviour</SectionLabel>
      <SectionHeading>Behaviour Metrics</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Aggregate event counts and derived conversion rates across the commerce funnel.
      </p>

      {!analyticsAvailable && (
        <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-[#7b7480]">
          No analytics available.
        </div>
      )}

      {/* Cart */}
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#4f4a52]">Cart</h3>
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { label: "Cart Opens",      value: fmtCount(c.cartOpens) },
          { label: "Cart Additions",  value: fmtCount(c.cartAdditions) },
          { label: "Cart Conversion", value: fmtRate(c.cartConversion) },
        ].map(({ label, value }) => (
          <Card key={label}>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">{label}</p>
            <p className="mt-2 text-xl font-black text-[#4f4a52]">{value}</p>
          </Card>
        ))}
      </div>

      {/* Checkout */}
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#4f4a52]">Checkout</h3>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Checkout Starts",    value: fmtCount(ch.checkoutStarts) },
          { label: "Payment Starts",     value: fmtCount(ch.paymentStarts) },
          { label: "Checkout → Payment", value: fmtRate(ch.checkoutToPaymentRate) },
          { label: "Abandon Rate",       value: fmtRate(ch.checkoutAbandonRate) },
        ].map(({ label, value }) => (
          <Card key={label}>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">{label}</p>
            <p className="mt-2 text-xl font-black text-[#4f4a52]">{value}</p>
          </Card>
        ))}
      </div>

      {/* Payment */}
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#4f4a52]">Payment</h3>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Successful",    value: fmtCount(p.successfulPayments) },
          { label: "Cancelled",     value: fmtCount(p.cancelledPayments) },
          { label: "Success Rate",  value: fmtRate(p.paymentSuccessRate) },
          { label: "Cancel Rate",   value: fmtRate(p.paymentCancelRate) },
        ].map(({ label, value }) => (
          <Card key={label}>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">{label}</p>
            <p className="mt-2 text-xl font-black text-[#4f4a52]">{value}</p>
          </Card>
        ))}
      </div>

      {/* Commerce rates */}
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#4f4a52]">Commerce Rates</h3>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Cart → Checkout",  value: fmtRate(cm.cartToCheckoutRate) },
          { label: "Checkout → Order", value: fmtRate(cm.checkoutToOrderRate) },
          { label: "Cart → Order",     value: fmtRate(cm.cartToOrderRate) },
        ].map(({ label, value }) => (
          <Card key={label}>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">{label}</p>
            <p className="mt-2 text-xl font-black text-[#4f4a52]">{value}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ── Section 3: Checkout Funnel ────────────────────────────────────────────────

function CheckoutFunnelSection({ report }: { report: CheckoutFunnelReport }) {
  const { stages, primaryAbandonStage, strongestStage, paymentSummary, overallCompletionRate, analyticsAvailable } = report;

  return (
    <section>
      <SectionLabel>Checkout Funnel</SectionLabel>
      <SectionHeading>Funnel Overview</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Ordered five-stage checkout funnel. Conversion and drop-off rates are relative to the previous stage.
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
          <p className="mt-1 text-xs text-[#7b7480]">Cart opened → payment successful</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Primary Abandonment</p>
          <p className="mt-2 text-base font-black text-[#4f4a52]">
            {primaryAbandonStage ? STAGE_LABELS[primaryAbandonStage] : "—"}
          </p>
          <p className="mt-1 text-xs text-[#7b7480]">Highest drop-off stage</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Strongest Stage</p>
          <p className="mt-2 text-base font-black text-[#4f4a52]">
            {strongestStage ? STAGE_LABELS[strongestStage] : "—"}
          </p>
          <p className="mt-1 text-xs text-[#7b7480]">Highest conversion rate</p>
        </Card>
      </div>

      {/* Funnel table */}
      <Card className="mb-6 overflow-x-auto p-0">
        <table className="w-full min-w-[520px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-5 py-3 text-left   text-[10px] uppercase tracking-widest text-[#a09aa6]">Stage</th>
              <th className="px-5 py-3 text-right  text-[10px] uppercase tracking-widest text-[#a09aa6]">Count</th>
              <th className="px-5 py-3 text-right  text-[10px] uppercase tracking-widest text-[#a09aa6]">Conversion</th>
              <th className="px-5 py-3 text-right  text-[10px] uppercase tracking-widest text-[#a09aa6]">Drop-Off</th>
              <th className="px-5 py-3 text-right  text-[10px] uppercase tracking-widest text-[#a09aa6]">Status</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage) => (
              <tr key={stage.stage} className="border-b border-gray-50 last:border-0">
                <td className="px-5 py-3 text-sm font-medium text-[#4f4a52]">{stage.label}</td>
                <td className="px-5 py-3 text-right text-sm tabular-nums text-[#7b7480]">{fmtCount(stage.count)}</td>
                <td className="px-5 py-3 text-right text-sm tabular-nums text-[#7b7480]">{fmtRate(stage.conversionRate)}</td>
                <td className="px-5 py-3 text-right text-sm tabular-nums text-[#7b7480]">{fmtRate(stage.dropOffRate)}</td>
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

      {/* Payment summary */}
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#4f4a52]">Payment Summary</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Successful",   value: fmtCount(paymentSummary.successfulPayments) },
          { label: "Cancelled",    value: fmtCount(paymentSummary.cancelledPayments) },
          { label: "Success Rate", value: fmtRate(paymentSummary.paymentSuccessRate) },
          { label: "Cancel Rate",  value: fmtRate(paymentSummary.paymentCancelRate) },
        ].map(({ label, value }) => (
          <Card key={label}>
            <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">{label}</p>
            <p className="mt-2 text-xl font-black text-[#4f4a52]">{value}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ── Section 4: Product Performance ───────────────────────────────────────────

function CategoryCard({ summary }: { summary: PerformanceSummary }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-[#4f4a52]">{summary.label}</p>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${PERFORMANCE_HEALTH_STYLES[summary.health]}`}>
          {PERFORMANCE_HEALTH_LABELS[summary.health]}
        </span>
      </div>
      <p className="mt-3 text-2xl font-black text-[#4f4a52]">{fmtCount(summary.count)}</p>
      <p className="mt-1 text-xs text-[#7b7480]">
        Conversion: <span className="font-semibold text-[#4f4a52]">{fmtRate(summary.conversionRate)}</span>
      </p>
    </Card>
  );
}

function ProductPerformanceSection({ report }: { report: ProductPerformanceReport }) {
  const { categories, strongestCategory, weakestCategory, analyticsAvailable } = report;

  return (
    <section>
      <SectionLabel>Product Performance</SectionLabel>
      <SectionHeading>Category Performance</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Commerce funnel classified into four categories. Health is a relative ranking —
        strong and weak labels require at least two categories with evidence.
      </p>

      {!analyticsAvailable && (
        <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-[#7b7480]">
          No analytics available.
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((s) => (
          <CategoryCard key={s.category} summary={s} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Strongest Category</p>
          <p className="mt-2 text-base font-black text-[#4f4a52]">
            {strongestCategory ? CATEGORY_LABELS[strongestCategory] : "—"}
          </p>
          <p className="mt-1 text-xs text-[#7b7480]">Highest conversion rate</p>
        </Card>
        <Card>
          <p className="text-[10px] uppercase tracking-widest text-[#a09aa6]">Weakest Category</p>
          <p className="mt-2 text-base font-black text-[#4f4a52]">
            {weakestCategory ? CATEGORY_LABELS[weakestCategory] : "—"}
          </p>
          <p className="mt-1 text-xs text-[#7b7480]">Lowest conversion rate</p>
        </Card>
      </div>
    </section>
  );
}

// ── Section 5: Commerce Health ────────────────────────────────────────────────

function CommerceHealthSection({
  performanceReport,
  funnelReport,
}: {
  performanceReport: ProductPerformanceReport;
  funnelReport:      CheckoutFunnelReport;
}) {
  const { overallCommerceHealth, weakestCategory, analyticsAvailable } = performanceReport;
  const { primaryAbandonStage } = funnelReport;

  const observations: string[] = [];
  if (primaryAbandonStage) {
    observations.push(`Primary funnel drop-off at: ${STAGE_LABELS[primaryAbandonStage]}.`);
  }
  if (weakestCategory) {
    observations.push(`Weakest performing category: ${CATEGORY_LABELS[weakestCategory]}.`);
  }
  if (!analyticsAvailable) {
    observations.push("Configure PostHog environment variables to enable commerce analytics.");
  }

  return (
    <section>
      <SectionLabel>Commerce Health</SectionLabel>
      <SectionHeading>Health Summary</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Overall health signal derived from end-to-end funnel measurability. Updated on every page load.
      </p>

      <Card className="mb-5">
        <div className="flex items-center gap-4">
          <span className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${COMMERCE_HEALTH_STYLES[overallCommerceHealth]}`}>
            {COMMERCE_HEALTH_LABELS[overallCommerceHealth]}
          </span>
          <p className="text-sm text-[#7b7480]">
            {overallCommerceHealth === "healthy"         && "End-to-end commerce funnel is measurable."}
            {overallCommerceHealth === "needs-attention" && "End-to-end completion rate could not be measured."}
            {overallCommerceHealth === "insufficient-evidence" && "Analytics unavailable — health cannot be assessed."}
          </p>
        </div>
      </Card>

      {observations.length > 0 && (
        <Card>
          <p className="mb-3 text-[10px] uppercase tracking-widest text-[#a09aa6]">Observations</p>
          <ul className="space-y-2">
            {observations.map((obs) => (
              <li key={obs} className="text-sm text-[#7b7480]">
                — {obs}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  behaviourReport:   CommerceBehaviourReport;
  funnelReport:      CheckoutFunnelReport;
  performanceReport: ProductPerformanceReport;
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function CommerceIntelligenceDashboard({ behaviourReport, funnelReport, performanceReport }: Props) {
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
            <span className="text-xs font-bold text-white">Commerce Intelligence</span>
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
          funnelReport={funnelReport}
          performanceReport={performanceReport}
        />

        <hr className="border-gray-200" />

        <CommerceBehaviourSection report={behaviourReport} />

        <hr className="border-gray-200" />

        <CheckoutFunnelSection report={funnelReport} />

        <hr className="border-gray-200" />

        <ProductPerformanceSection report={performanceReport} />

        <hr className="border-gray-200" />

        <CommerceHealthSection
          performanceReport={performanceReport}
          funnelReport={funnelReport}
        />

      </div>
    </div>
  );
}

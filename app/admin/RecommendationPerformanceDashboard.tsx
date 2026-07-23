"use client";

import React, { useState } from "react";
import Link                 from "next/link";
import { logoutAction }     from "./actions";
import {
  QUALITY_THRESHOLDS,
  QUALITY_BAND_COLORS,
  QUALITY_BAND_DESCRIPTIONS,
  computeCoverage,
  formatRate,
  type QualityBand,
  type QualityMetricKey,
} from "@/app/lib/customer/recommendations/RecommendationQuality";

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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-white/20"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const KPI_FRAMEWORK = [
  { kpi: "Impressions (EI)",      event: "experience_intelligence_shown",     field: "renderSource",           note: "One per EI recommendation set render" },
  { kpi: "Impressions (SE)",      event: "recommendation_set_shown",           field: "surface",                note: "One per similarity engine render" },
  { kpi: "Impressions (MiniCart)",event: "cart_recommendations_shown",         field: "renderSource",           note: "Panel-level; breakdown in count fields" },
  { kpi: "Clicks",                event: "product_clicked",                    field: "source",                 note: "Filter where source is a rec surface" },
  { kpi: "CTR",                   event: "Derived",                            field: "clicks ÷ impressions",   note: "Compute in PostHog via HogQL subquery" },
  { kpi: "Favourites",            event: "favourite_toggled",                  field: "source + action = 'add'",note: "Filter where action = 'add'" },
  { kpi: "Favourite Rate",        event: "Derived",                            field: "favourites ÷ impressions",note: "Surface-level join in PostHog" },
  { kpi: "Add to Cart",           event: "add_to_cart",                        field: "recommendationSource",   note: "Set when triggered from rec surface" },
  { kpi: "Add-to-Cart Rate",      event: "Derived",                            field: "adds ÷ impressions",     note: "Surface-level join in PostHog" },
  { kpi: "Checkout Attribution",  event: "recommendation_checkout_attributed", field: "surface",                note: "Fires at checkout if rec session exists" },
] as const;

const ENGINES = [
  {
    name:  "Experience Intelligence",
    abbr:  "EI",
    color: "#d89ca4",
    impressionEvent: "experience_intelligence_shown",
    surfaces: [
      { id: "shop-recommendation",            label: "Shop" },
      { id: "profile-page-recommendation",    label: "Fragrance Profile" },
      { id: "best-sellers-recommendation",    label: "Best Sellers" },
      { id: "new-arrivals-recommendation",    label: "New Arrivals" },
      { id: "favorites-recommendation",       label: "Favourites" },
      { id: "recently-viewed-recommendation", label: "Recently Viewed" },
      { id: "collection-skye-recommendation", label: "Collection — Skye" },
      { id: "collection-rose-recommendation", label: "Collection — Rose" },
      { id: "collection-elite-recommendation",label: "Collection — Elite" },
      { id: "quiz-continuation",              label: "Quiz Results" },
      { id: "character-journey-profile",      label: "Character Journey" },
      { id: "homepage-curated",               label: "Homepage — Curated For You" },
      { id: "discover-intelligence",          label: "Discover Collections" },
      { id: "academy-intelligence",           label: "Academy Articles" },
      { id: "pdp-recommendation",             label: "PDP — Intelligence Panel" },
      { id: "compare-post-decision",          label: "Compare — Post Decision" },
    ],
  },
  {
    name:  "Similarity Engine",
    abbr:  "SE",
    color: "#7b9cc4",
    impressionEvent: "recommendation_set_shown",
    surfaces: [
      { id: "pdp-recommendation", label: "PDP — Why You'll Love It" },
    ],
  },
  {
    name:  "Editorial",
    abbr:  "ED",
    color: "#8fa87a",
    impressionEvent: "— (no impression event; clicks are primary signal)",
    surfaces: [
      { id: "pdp-journey",    label: "PDP — Continue Your Journey" },
      { id: "pdp-collection", label: "PDP — You May Also Like" },
    ],
  },
  {
    name:  "Behavioural MiniCart",
    abbr:  "BM",
    color: "#a07ab4",
    impressionEvent: "cart_recommendations_shown (panel-level aggregate)",
    surfaces: [
      { id: "minicart-favorites",           label: "MiniCart — From Favourites" },
      { id: "minicart-recently-viewed",     label: "MiniCart — Recently Viewed" },
      { id: "minicart-complete-collection", label: "MiniCart — Complete Your Collection" },
    ],
  },
] as const;

type CoverageCell = "✓" | "—" | "✓*";

interface CoverageRow {
  surface:     string;
  engine:      string;
  impression:  CoverageCell;
  click:       CoverageCell;
  favourite:   CoverageCell;
  addToCart:   CoverageCell;
  attribution: CoverageCell;
}

const COVERAGE: CoverageRow[] = [
  // EI surfaces — full lifecycle
  ...([
    "shop-recommendation",
    "profile-page-recommendation",
    "best-sellers-recommendation",
    "new-arrivals-recommendation",
    "favorites-recommendation",
    "recently-viewed-recommendation",
    "collection-skye-recommendation",
    "collection-rose-recommendation",
    "collection-elite-recommendation",
    "quiz-continuation",
    "character-journey-profile",
    "homepage-curated",
    "discover-intelligence",
    "academy-intelligence",
    "pdp-recommendation (EI)",
    "compare-post-decision",
  ] as const).map((surface) => ({
    surface,
    engine:      "EI",
    impression:  "✓" as CoverageCell,
    click:       "✓" as CoverageCell,
    favourite:   "✓" as CoverageCell,
    addToCart:   "✓" as CoverageCell,
    attribution: "✓" as CoverageCell,
  })),
  // Similarity Engine
  {
    surface:     "pdp-recommendation (SE)",
    engine:      "SE",
    impression:  "✓",
    click:       "✓",
    favourite:   "—",
    addToCart:   "—",
    attribution: "—",
  },
  // Editorial — click only
  {
    surface:     "pdp-journey",
    engine:      "ED",
    impression:  "—",
    click:       "✓",
    favourite:   "—",
    addToCart:   "—",
    attribution: "—",
  },
  {
    surface:     "pdp-collection",
    engine:      "ED",
    impression:  "—",
    click:       "✓",
    favourite:   "—",
    addToCart:   "—",
    attribution: "—",
  },
  // Behavioural MiniCart — impression is panel-level
  {
    surface:     "minicart-favorites",
    engine:      "BM",
    impression:  "✓*",
    click:       "—",
    favourite:   "—",
    addToCart:   "✓",
    attribution: "✓",
  },
  {
    surface:     "minicart-recently-viewed",
    engine:      "BM",
    impression:  "✓*",
    click:       "—",
    favourite:   "—",
    addToCart:   "✓",
    attribution: "✓",
  },
  {
    surface:     "minicart-complete-collection",
    engine:      "BM",
    impression:  "✓*",
    click:       "—",
    favourite:   "—",
    addToCart:   "✓",
    attribution: "✓",
  },
];

const QUERIES = [
  {
    title: "EI Impressions by Surface — 30 days",
    sql:
`SELECT
  properties.renderSource                            AS surface,
  count()                                            AS impressions,
  avg(toInt64OrNull(properties.recommendationCount)) AS avg_recs_shown,
  properties.strategy                                AS strategy,
  properties.profileType                             AS profile_type
FROM events
WHERE event = 'experience_intelligence_shown'
  AND timestamp >= now() - interval 30 day
GROUP BY surface, strategy, profile_type
ORDER BY impressions DESC`,
  },
  {
    title: "Similarity Engine Impressions — 30 days",
    sql:
`SELECT
  properties.surface                       AS surface,
  count()                                  AS impressions,
  avg(toInt64OrNull(properties.count))     AS avg_recs_shown
FROM events
WHERE event = 'recommendation_set_shown'
  AND timestamp >= now() - interval 30 day
GROUP BY surface
ORDER BY impressions DESC`,
  },
  {
    title: "Recommendation Clicks by Surface — 30 days",
    sql:
`SELECT
  properties.source                        AS surface,
  count()                                  AS clicks,
  avg(toFloat64OrNull(properties.rank))    AS avg_rank_clicked
FROM events
WHERE event = 'product_clicked'
  AND properties.source IN (
    'pdp-recommendation',
    'academy-intelligence',
    'discover-intelligence',
    'shop-recommendation',
    'profile-page-recommendation',
    'best-sellers-recommendation',
    'new-arrivals-recommendation',
    'favorites-recommendation',
    'recently-viewed-recommendation',
    'collection-skye-recommendation',
    'collection-rose-recommendation',
    'collection-elite-recommendation',
    'quiz-continuation',
    'character-journey-profile',
    'homepage-curated',
    'compare-post-decision',
    'pdp-journey',
    'pdp-collection'
  )
  AND timestamp >= now() - interval 30 day
GROUP BY surface
ORDER BY clicks DESC`,
  },
  {
    title: "Add-to-Cart by Recommendation Source — 30 days",
    sql:
`SELECT
  properties.recommendationSource          AS surface,
  count()                                  AS adds
FROM events
WHERE event = 'add_to_cart'
  AND isNotNull(properties.recommendationSource)
  AND timestamp >= now() - interval 30 day
GROUP BY surface
ORDER BY adds DESC`,
  },
  {
    title: "Favourites Added by Surface — 30 days",
    sql:
`SELECT
  properties.source                        AS surface,
  countIf(properties.action = 'add')       AS favourites_added,
  countIf(properties.action = 'remove')    AS favourites_removed
FROM events
WHERE event = 'favourite_toggled'
  AND isNotNull(properties.source)
  AND timestamp >= now() - interval 30 day
GROUP BY surface
ORDER BY favourites_added DESC`,
  },
  {
    title: "Checkout Attribution by Surface — 30 days",
    sql:
`SELECT
  properties.surface                                      AS surface,
  count()                                                 AS checkout_attributions,
  avg(toFloat64OrNull(properties.ageMs)) / 1000.0        AS avg_age_seconds,
  avg(toFloat64OrNull(properties.ageMs)) / 60000.0       AS avg_age_minutes
FROM events
WHERE event = 'recommendation_checkout_attributed'
  AND timestamp >= now() - interval 30 day
GROUP BY surface
ORDER BY checkout_attributions DESC`,
  },
  {
    title: "MiniCart Panel Impressions — 30 days",
    sql:
`SELECT
  count()                                                      AS panel_opens,
  avg(toInt64OrNull(properties.fromFavoritesCount))            AS avg_from_favorites,
  avg(toInt64OrNull(properties.recentlyViewedCount))           AS avg_recently_viewed,
  avg(toInt64OrNull(properties.completeYourCollectionCount))   AS avg_collection,
  avg(toInt64OrNull(properties.totalCount))                    AS avg_total
FROM events
WHERE event = 'cart_recommendations_shown'
  AND timestamp >= now() - interval 30 day`,
  },
  {
    title: "EI Strategy Distribution — 30 days",
    sql:
`SELECT
  properties.strategy                                AS strategy,
  properties.profileType                             AS profile_type,
  count()                                            AS impressions,
  avg(toInt64OrNull(properties.recommendationCount)) AS avg_recs
FROM events
WHERE event = 'experience_intelligence_shown'
  AND timestamp >= now() - interval 30 day
GROUP BY strategy, profile_type
ORDER BY impressions DESC`,
  },
] as const;

const EVENT_SCHEMAS = [
  {
    event: "experience_intelligence_shown",
    fields: [
      { name: "experience",          type: "string",   values: "academy | discover | quiz-continuation | shop | …" },
      { name: "strategy",            type: "string",   values: "personalised | discovery | trending | similar | complementary" },
      { name: "profileType",         type: "string",   values: "personalised | seeded | discovery" },
      { name: "seeded",              type: "boolean",  values: "true | false" },
      { name: "recommendationCount", type: "number",   values: "1–12" },
      { name: "slugs",               type: "string[]", values: "rendered product slugs (join key)" },
      { name: "renderSource",        type: "string",   values: "AnalyticsSource — EI surface identifier" },
      { name: "processingTimeMs",    type: "number?",  values: "RE processing duration in ms" },
    ],
  },
  {
    event: "recommendation_set_shown",
    fields: [
      { name: "strategy",        type: "string",   values: "similar" },
      { name: "surface",         type: "string",   values: "pdp-recommendation" },
      { name: "count",           type: "number",   values: "1–8" },
      { name: "slugs",           type: "string[]", values: "rendered product slugs (join key)" },
      { name: "isPersonalised",  type: "boolean",  values: "false" },
      { name: "processingTimeMs",type: "number?",  values: "processing duration in ms" },
    ],
  },
  {
    event: "product_clicked",
    fields: [
      { name: "title",  type: "string",  values: "product name" },
      { name: "slug",   type: "string?", values: "product slug" },
      { name: "source", type: "string?", values: "AnalyticsSource — recommendation surface" },
      { name: "rank",   type: "number?", values: "position in rendered set (1-indexed)" },
    ],
  },
  {
    event: "add_to_cart",
    fields: [
      { name: "title",               type: "string",  values: "product name" },
      { name: "size",                type: "string",  values: "5ml | 10ml | 30ml" },
      { name: "price",               type: "number",  values: "retail price in ZAR" },
      { name: "source",              type: "string?", values: "pdp | quick-add | buy-now | minicart" },
      { name: "recommendationSource",type: "string?", values: "AnalyticsSource — set when rec-driven" },
    ],
  },
  {
    event: "favourite_toggled",
    fields: [
      { name: "title",  type: "string",  values: "product name" },
      { name: "slug",   type: "string?", values: "product slug" },
      { name: "source", type: "string?", values: "AnalyticsSource — surface where heart was clicked" },
      { name: "action", type: "string",  values: "add | remove" },
    ],
  },
  {
    event: "recommendation_checkout_attributed",
    fields: [
      { name: "surface", type: "string",  values: "recommendation surface" },
      { name: "slug",    type: "string?", values: "last interacted product slug" },
      { name: "ageMs",   type: "number?", values: "ms elapsed between rec interaction and checkout" },
    ],
  },
  {
    event: "cart_recommendations_shown",
    fields: [
      { name: "fromFavoritesCount",          type: "number", values: "recs sourced from favourites" },
      { name: "recentlyViewedCount",         type: "number", values: "recs from recently viewed" },
      { name: "completeYourCollectionCount", type: "number", values: "recs for collection completion" },
      { name: "totalCount",                  type: "number", values: "total recommendations shown" },
      { name: "renderSource",                type: "string", values: "minicart" },
    ],
  },
] as const;

// ── Quality Framework Section ─────────────────────────────────────────────────

const ORDERED_METRICS: QualityMetricKey[] = [
  "ctr",
  "favouriteRate",
  "addToCartRate",
  "checkoutAttributionRate",
  "coverage",
];

const BANDS: QualityBand[] = ["Excellent", "Healthy", "Needs Attention", "Critical"];

function QualityFrameworkSection() {
  const coverage = computeCoverage();

  return (
    <section>
      <SectionLabel>Quality Framework</SectionLabel>
      <SectionHeading>KPI Thresholds &amp; Classification</SectionHeading>
      <p className="mt-2 mb-5 text-sm text-[#7b7480]">
        Centralized quality bands and thresholds for every recommendation KPI.
        All dashboards and future optimisation work reference this single source.
        Coverage is computed from the codebase — all other KPIs require PostHog data.
      </p>

      {/* Quality band legend */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BANDS.map((band) => (
          <div
            key={band}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div
              className="mb-2 h-1.5 w-8 rounded-full"
              style={{ backgroundColor: QUALITY_BAND_COLORS[band] }}
            />
            <p className="text-xs font-bold text-[#4f4a52]">{band}</p>
            <p className="mt-1 text-[11px] text-[#a09aa6] leading-snug">
              {QUALITY_BAND_DESCRIPTIONS[band]}
            </p>
          </div>
        ))}
      </div>

      {/* Threshold table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">KPI</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Formula</th>
              <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest" style={{ color: QUALITY_BAND_COLORS["Excellent"] }}>Excellent</th>
              <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest" style={{ color: QUALITY_BAND_COLORS["Healthy"] }}>Healthy</th>
              <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest" style={{ color: QUALITY_BAND_COLORS["Needs Attention"] }}>OK</th>
              <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest" style={{ color: QUALITY_BAND_COLORS["Critical"] }}>Critical</th>
              <th className="px-3 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Status</th>
            </tr>
          </thead>
          <tbody>
            {ORDERED_METRICS.map((key) => {
              const t      = QUALITY_THRESHOLDS[key];
              const isLive = key === "coverage";
              return (
                <tr key={key} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-semibold text-[#4f4a52]">{t.label}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#7b7480]">{t.formula}</td>
                  <td className="px-3 py-3 text-center font-mono tabular-nums text-[#4f4a52]">≥ {formatRate(t.excellent)}</td>
                  <td className="px-3 py-3 text-center font-mono tabular-nums text-[#4f4a52]">≥ {formatRate(t.healthy)}</td>
                  <td className="px-3 py-3 text-center font-mono tabular-nums text-[#4f4a52]">≥ {formatRate(t.needsAttention)}</td>
                  <td className="px-3 py-3 text-center font-mono tabular-nums text-[#4f4a52]">&lt; {formatRate(t.needsAttention)}</td>
                  <td className="px-3 py-3 text-center">
                    {isLive ? (
                      <span
                        className="rounded-lg border px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          color:           QUALITY_BAND_COLORS[coverage.band as QualityBand],
                          borderColor:     QUALITY_BAND_COLORS[coverage.band as QualityBand] + "33",
                          backgroundColor: QUALITY_BAND_COLORS[coverage.band as QualityBand] + "11",
                        }}
                      >
                        {formatRate(coverage.value ?? 0)} · {coverage.band}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#a09aa6]">Pending PostHog</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Coverage live result */}
      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#a09aa6]">Live — computed from codebase</p>
            <p className="mt-1 font-black uppercase tracking-tight text-[#4f4a52]">
              Recommendation Coverage
            </p>
            <p className="mt-1 text-xs text-[#7b7480]">
              {String(coverage.value !== null ? coverage.value * 20 : 0)}/20 instrumented surfaces · {QUALITY_THRESHOLDS.coverage.formula}
            </p>
            <p className="mt-2 text-xs text-[#a09aa6] leading-relaxed max-w-sm">
              {QUALITY_THRESHOLDS.coverage.interpretation}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p
              className="text-3xl font-black tabular-nums"
              style={{ color: QUALITY_BAND_COLORS[coverage.band as QualityBand] }}
            >
              {formatRate(coverage.value ?? 0)}
            </p>
            <p
              className="mt-1 text-xs font-bold uppercase tracking-widest"
              style={{ color: QUALITY_BAND_COLORS[coverage.band as QualityBand] }}
            >
              {coverage.band}
            </p>
          </div>
        </div>
      </div>

      {/* Pending KPIs note */}
      <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
        <p className="text-xs font-semibold text-amber-700">
          CTR · Favourite Rate · Add-to-Cart Rate · Checkout Attribution Rate
        </p>
        <p className="mt-1 text-[11px] text-amber-600">
          These KPIs require PostHog data. Run the HogQL queries in the section below, then apply
          the thresholds above to classify each surface. Thresholds are defined once in
          RecommendationQuality.ts and shared across all admin dashboards.
        </p>
      </div>
    </section>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  generatedAt: string;
}

export default function RecommendationPerformanceDashboard({ generatedAt }: Props) {
  const ts = new Date(generatedAt).toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  });

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
            <span className="text-xs font-bold text-white">Performance</span>
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

        {/* Intro */}
        <section>
          <SectionLabel>Recommendation Analytics</SectionLabel>
          <SectionHeading>Performance Framework</SectionHeading>
          <p className="mt-3 text-sm leading-relaxed text-[#7b7480]">
            Analytics taxonomy, surface coverage matrix, and PostHog HogQL query reference for
            the Maison Skye &amp; Rose recommendation system. Run queries in PostHog Insights → SQL
            to compute live KPIs. No live data is computed here — this dashboard is the permanent
            operational reference.
          </p>
          <p className="mt-1.5 text-[11px] text-[#a09aa6]">Generated {ts}</p>
        </section>

        <hr className="border-gray-200" />

        {/* ── 1 · KPI Framework ── */}
        <section>
          <SectionLabel>KPI Framework</SectionLabel>
          <SectionHeading>Metric Definitions</SectionHeading>
          <p className="mt-2 mb-5 text-sm text-[#7b7480]">
            Each metric is anchored to a specific PostHog event and field. Derived metrics
            (CTR, favourite rate, add-to-cart rate) require a surface-level join in HogQL.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">KPI</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Event</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Field</th>
                  <th className="hidden px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480] md:table-cell">Note</th>
                </tr>
              </thead>
              <tbody>
                {KPI_FRAMEWORK.map((row) => (
                  <tr key={`${row.kpi}-${row.event}`} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-semibold text-[#4f4a52]">{row.kpi}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#7b7480]">{row.event}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#d89ca4]">{row.field}</td>
                    <td className="hidden px-4 py-3 text-xs text-[#a09aa6] md:table-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* ── 2 · Quality Framework ── */}
        <QualityFrameworkSection />

        <hr className="border-gray-200" />

        {/* ── 3 · Engine Breakdown ── */}
        <section>
          <SectionLabel>Engine Breakdown</SectionLabel>
          <SectionHeading>Surfaces by Engine</SectionHeading>
          <p className="mt-2 mb-5 text-sm text-[#7b7480]">
            Four recommendation engines operate across 24 surfaces. Editorial surfaces have no
            impression event — clicks are the primary engagement signal. MiniCart impressions are
            panel-level aggregates, not per-surface.
          </p>
          <div className="space-y-4">
            {ENGINES.map((engine) => (
              <Card key={engine.abbr}>
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black uppercase tracking-tight text-[#4f4a52]">{engine.name}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-[#a09aa6]">
                      impression: {engine.impressionEvent}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                    style={{ backgroundColor: engine.color }}
                  >
                    {engine.surfaces.length} {engine.surfaces.length === 1 ? "surface" : "surfaces"}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {engine.surfaces.map((s) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <code className="min-w-0 flex-1 truncate rounded-lg bg-gray-50 px-3 py-1.5 font-mono text-[11px] text-[#7b7480]">
                        {s.id}
                      </code>
                      <span className="shrink-0 text-xs text-[#a09aa6]">{s.label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* ── 3 · Coverage Matrix ── */}
        <section>
          <SectionLabel>Coverage Matrix</SectionLabel>
          <SectionHeading>Analytics Lifecycle by Surface</SectionHeading>
          <p className="mt-2 mb-5 text-sm text-[#7b7480]">
            Which analytics events fire at each surface across the full recommendation lifecycle.
            Missing impressions on editorial surfaces and MiniCart click gaps are expected.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Surface</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Engine</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Impression</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Click</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Favourite</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Add-to-Cart</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-[#7b7480]">Attribution</th>
                </tr>
              </thead>
              <tbody>
                {COVERAGE.map((row) => (
                  <tr key={row.surface} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-2 font-mono text-[11px] text-[#7b7480]">{row.surface}</td>
                    <td className="px-4 py-2">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-[#7b7480]">
                        {row.engine}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center font-semibold text-green-600">{row.impression}</td>
                    <td className="px-4 py-2 text-center font-semibold text-green-600">{row.click}</td>
                    <td className="px-4 py-2 text-center font-semibold text-green-600">{row.favourite}</td>
                    <td className="px-4 py-2 text-center font-semibold text-green-600">{row.addToCart}</td>
                    <td className="px-4 py-2 text-center font-semibold text-green-600">{row.attribution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-[#a09aa6]">
            ✓ Tracked &nbsp;·&nbsp; ✓* Panel-level aggregate &nbsp;·&nbsp; — Not applicable
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* ── 4 · PostHog Query Reference ── */}
        <section>
          <SectionLabel>PostHog Query Reference</SectionLabel>
          <SectionHeading>HogQL Queries</SectionHeading>
          <p className="mt-2 mb-5 text-sm text-[#7b7480]">
            Open PostHog → Insights → SQL and paste any query below. All queries use a 30-day
            window — change the interval clause to adjust the date range.
          </p>
          <div className="space-y-4">
            {QUERIES.map((q) => (
              <div key={q.title} className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between bg-[#4f4a52] px-4 py-3">
                  <span className="text-xs font-semibold text-white">{q.title}</span>
                  <CopyButton text={q.sql} />
                </div>
                <pre className="overflow-x-auto bg-white p-4 font-mono text-[11px] leading-relaxed text-[#7b7480]">
                  {q.sql}
                </pre>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* ── 5 · Schema Reference ── */}
        <section>
          <SectionLabel>Schema Reference</SectionLabel>
          <SectionHeading>Event Schemas</SectionHeading>
          <p className="mt-2 mb-5 text-sm text-[#7b7480]">
            PostHog event properties for all recommendation analytics events. Use these schemas
            when building PostHog Insights, funnels, or dashboards.
          </p>
          <div className="space-y-4">
            {EVENT_SCHEMAS.map((schema) => (
              <Card key={schema.event}>
                <p className="mb-3 font-mono text-sm font-bold text-[#4f4a52]">{schema.event}</p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-2 text-left font-semibold text-[#7b7480]">Field</th>
                      <th className="pb-2 text-left font-semibold text-[#7b7480]">Type</th>
                      <th className="pb-2 text-left font-semibold text-[#7b7480]">Values</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {schema.fields.map((f) => (
                      <tr key={f.name} className="border-b border-gray-50 last:border-0">
                        <td className="py-1.5 text-[#d89ca4]">{f.name}</td>
                        <td className="py-1.5 text-[#a09aa6]">{f.type}</td>
                        <td className="py-1.5 text-[10px] text-[#7b7480]">{f.values}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

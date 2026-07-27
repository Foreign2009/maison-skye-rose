"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { logoutAction } from "./actions";
import type { OrderStatus } from "@/app/lib/orderStatus";
import type { DiscoverySource } from "@/app/lib/discoveryAttribution";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SimpleOrder {
  ref:       string;
  name:      string;
  status:    OrderStatus;
  total:     number;
  createdAt: string;
}

export interface FragranceInsight {
  title:      string;
  orderCount: number;
  unitCount:  number;
}

export interface DiscoveryPathwayStat {
  source:  DiscoverySource;
  label:   string;
  count:   number;
}

export interface CatalogueHealthRecord {
  slug:         string;
  tier:         "rich" | "standard" | "minimal";
  overallScore: number;
}

export interface CatalogueHealth {
  totalRecords:             number;
  tierCounts: {
    rich:     number;
    standard: number;
    minimal:  number;
  };
  avgOverallScore:          number;
  avgEditorialCompleteness: number;
  avgEducationalRichness:   number;
  avgRelationshipRichness:  number;
  avgDiscoveryReadiness:    number;
  avgCompositionDepth:      number;
  avgCommerceCompleteness:  number;
  bottomTen:                CatalogueHealthRecord[];
}

export interface DiscoveryCollectionRecord {
  id:            string;
  name:          string;
  depth:         number;
  avgRepQuality: number;
  repCount:      number;
}

export interface DiscoveryHealth {
  totalCollections: number;
  depthCounts:      { depth1: number; depth2: number; depth3: number };
  avgRepQuality:    number;
  topCollections:   DiscoveryCollectionRecord[];
  needsEnrichment:  DiscoveryCollectionRecord[];
}

export interface MaisonBrief {
  generatedAt:          string;
  todayRevenue:         number;
  todayOrders:          number;
  weekRevenue:          number;
  weekOrders:           number;
  allTimeRevenue:       number;
  activeCount:          number;
  needsAttention:       SimpleOrder[];
  readyToShip:          SimpleOrder[];
  discoveryPathways:    DiscoveryPathwayStat[];
  noAttributionCount:   number;
  totalWithAttribution: number;
  topFragrances:        FragranceInsight[];
  pipeline:             Record<OrderStatus, number>;
  totalOrders:          number;
  cancelRate:           number;
  last7DayOrders:       number;
  last7DayRevenue:      number;
  last30DayOrders:      number;
  last30DayRevenue:     number;
  avgHoursToConfirm:    number | null;
  avgHoursToDispatch:   number | null;
  avgHoursToDeliver:    number | null;
  reflection:           string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtR(n: number): string {
  const parts = n.toFixed(2).split(".");
  const int   = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `R ${int}.${parts[1]}`;
}

function fmtHours(h: number): string {
  if (h < 1) return "< 1h";
  if (h < 24) return `${Math.round(h)}h`;
  const d = Math.floor(h / 24);
  const r = Math.round(h % 24);
  return r > 0 ? `${d}d ${r}h` : `${d}d`;
}

function ageLabel(createdAt: string, ref: Date): string {
  const h = (ref.getTime() - new Date(createdAt).getTime()) / 3600000;
  if (h < 1) return "< 1h ago";
  if (h < 24) return `${Math.round(h)}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const TIER_META: Record<"rich" | "standard" | "minimal", { label: string; color: string }> = {
  rich:     { label: "Rich",     color: "text-emerald-600"   },
  standard: { label: "Standard", color: "text-[#4f4a52]/50"  },
  minimal:  { label: "Minimal",  color: "text-[#d89ca4]"     },
};

function slugToTitle(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  awaiting_payment:  "Awaiting Payment",
  payment_confirmed: "Payment Confirmed",
  processing:        "Processing",
  dispatched:        "Dispatched",
  delivered:         "Delivered",
  cancelled:         "Cancelled",
};

// ── MaisonNotes ───────────────────────────────────────────────────────────────

function MaisonNotes() {
  const [notes,     setNotes]     = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("msr_briefing_notes");
      if (saved) setNotes(saved);
    } catch { /* sessionStorage unavailable */ }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  function handleChange(val: string) {
    setNotes(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem("msr_briefing_notes", val);
        setLastSaved(new Date());
      } catch { /* silent */ }
    }, 600);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Private Notes</span>
        {lastSaved && (
          <span className="text-[10px] text-[#4f4a52]/40">
            Auto-saved · {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Notes visible only in this browser…"
        rows={6}
        aria-label="Private notes"
        className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm text-[#4f4a52] placeholder-[#4f4a52]/30 focus:outline-none focus:ring-2 focus:ring-[#4f4a52]/10"
      />
    </div>
  );
}

// ── BriefingDashboard ─────────────────────────────────────────────────────────

export default function BriefingDashboard({
  brief,
  catalogueHealth,
  discoveryHealth,
}: {
  brief:            MaisonBrief;
  catalogueHealth:  CatalogueHealth;
  discoveryHealth:  DiscoveryHealth;
}) {
  const [greeting, setGreeting] = useState("");
  const [dateStr,  setDateStr]  = useState("");

  useEffect(() => {
    const d = new Date();
    const h = d.getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
    setDateStr(
      d.toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    );
  }, []);

  const briefTime = new Date(brief.generatedAt);
  const generatedLabel = briefTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const PIPELINE_ORDER: OrderStatus[] = [
    "awaiting_payment", "payment_confirmed", "processing",
    "dispatched", "delivered", "cancelled",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f5]">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
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
            <span className="text-xs font-bold text-white">Briefing</span>
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
          </nav>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="text-xs text-white/60 transition hover:text-white">
            Sign Out
          </button>
        </form>
      </header>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[780px] space-y-14 px-6 py-12">

        {/* 1 · Good Morning ─────────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Maison Briefing</p>
          {greeting && (
            <h2 className="mt-2 text-3xl font-black text-[#4f4a52]">{greeting}.</h2>
          )}
          {dateStr && (
            <p className="mt-1 text-sm text-[#4f4a52]/50">{dateStr}</p>
          )}

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#4f4a52]/40">Today</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-[#4f4a52]">{fmtR(brief.todayRevenue)}</p>
              <p className="mt-0.5 text-xs text-[#4f4a52]/40">
                {brief.todayOrders} {brief.todayOrders === 1 ? "order" : "orders"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#4f4a52]/40">This Week</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-[#4f4a52]">{fmtR(brief.weekRevenue)}</p>
              <p className="mt-0.5 text-xs text-[#4f4a52]/40">
                {brief.weekOrders} {brief.weekOrders === 1 ? "order" : "orders"}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#4f4a52]/40">All Time</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-[#4f4a52]">{fmtR(brief.allTimeRevenue)}</p>
              <p className="mt-0.5 text-xs text-[#4f4a52]/40">confirmed revenue</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#4f4a52]/40">Active</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-[#4f4a52]">{brief.activeCount}</p>
              <p className="mt-0.5 text-xs text-[#4f4a52]/40">in progress</p>
            </div>
          </div>

          <p className="mt-6 text-xs text-[#4f4a52]/30">Generated at {generatedLabel}.</p>
        </section>

        <hr className="border-gray-200" />

        {/* 2 · Today's Priorities ───────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Today&apos;s Priorities</p>
          <h2 className="mt-2 text-xl font-black text-[#4f4a52]">Orders Requiring Attention</h2>

          {brief.needsAttention.length === 0 && brief.readyToShip.length === 0 ? (
            <p className="mt-6 text-sm text-[#4f4a52]/50">Everything is in order.</p>
          ) : (
            <div className="mt-6 space-y-8">

              {brief.needsAttention.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#4f4a52]/40">
                    Needs Attention
                  </p>
                  <div className="space-y-2">
                    {brief.needsAttention.map((o) => (
                      <div
                        key={o.ref}
                        className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#4f4a52]">{o.name}</p>
                          <p className="text-[11px] text-[#4f4a52]/40">
                            {o.ref} · {ageLabel(o.createdAt, briefTime)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold tabular-nums text-[#4f4a52]">{fmtR(o.total)}</p>
                          <p className="text-[11px] text-[#4f4a52]/50">{STATUS_LABELS[o.status]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {brief.readyToShip.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#4f4a52]/40">
                    Ready to Ship
                  </p>
                  <div className="space-y-2">
                    {brief.readyToShip.map((o) => (
                      <div
                        key={o.ref}
                        className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#4f4a52]">{o.name}</p>
                          <p className="text-[11px] text-[#4f4a52]/40">
                            {o.ref} · {ageLabel(o.createdAt, briefTime)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold tabular-nums text-[#4f4a52]">{fmtR(o.total)}</p>
                          <p className="text-[11px] text-[#4f4a52]/50">{STATUS_LABELS[o.status]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </section>

        <hr className="border-gray-200" />

        {/* 3 · Discovery Pathways ───────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Discovery Pathways</p>
          <h2 className="mt-2 text-xl font-black text-[#4f4a52]">How Customers Found Their Fragrance</h2>

          {brief.discoveryPathways.length === 0 ? (
            <p className="mt-6 text-sm leading-7 text-[#4f4a52]/50">
              Discovery pathways will appear here as customers complete journeys through
              Discover by Moment and the Scent Finder.
            </p>
          ) : (
            <div className="mt-6 space-y-2">
              {brief.discoveryPathways.map((p) => (
                <div
                  key={`${p.source}:${p.label}`}
                  className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm"
                >
                  <p className="text-sm font-semibold text-[#4f4a52]">{p.label}</p>
                  <p className="text-sm tabular-nums text-[#4f4a52]">
                    {p.count}{" "}
                    <span className="text-[#4f4a52]/40">{p.count === 1 ? "order" : "orders"}</span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {brief.noAttributionCount > 0 && (
            <p className="mt-4 text-xs text-[#4f4a52]/40">
              {brief.noAttributionCount}{" "}
              {brief.noAttributionCount === 1 ? "order has" : "orders have"} no recorded discovery context.
            </p>
          )}
        </section>

        <hr className="border-gray-200" />

        {/* 4 · Fragrances Creating Conversation ────────────────────────────── */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">
            Fragrances Creating Conversation
          </p>
          <h2 className="mt-2 text-xl font-black text-[#4f4a52]">Your Most Ordered Fragrances</h2>

          {brief.topFragrances.length === 0 ? (
            <p className="mt-6 text-sm text-[#4f4a52]/50">
              Fragrance insights will appear here as confirmed orders arrive.
            </p>
          ) : (
            <div className="mt-6 space-y-2">
              {brief.topFragrances.map((f, i) => (
                <div
                  key={f.title}
                  className="flex items-center gap-4 rounded-xl bg-white px-4 py-3 shadow-sm"
                >
                  <span className="w-5 shrink-0 text-center text-[11px] font-black text-[#4f4a52]/25">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-sm font-semibold text-[#4f4a52]">{f.title}</p>
                  <p className="shrink-0 text-xs tabular-nums text-[#4f4a52]/50">
                    {f.orderCount} {f.orderCount === 1 ? "order" : "orders"}
                    {" · "}
                    {f.unitCount} {f.unitCount === 1 ? "unit" : "units"}
                  </p>
                </div>
              ))}
            </div>
          )}

          <p className="mt-4 text-xs text-[#4f4a52]/30">From confirmed and delivered orders.</p>
        </section>

        <hr className="border-gray-200" />

        {/* 5 · Operational Health ───────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Operational Health</p>
          <h2 className="mt-2 text-xl font-black text-[#4f4a52]">Maison at a Glance</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            {/* Pipeline */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#4f4a52]/40">Order Pipeline</p>
              <div className="space-y-2.5">
                {PIPELINE_ORDER.map((s) => (
                  <div key={s} className="flex items-center justify-between">
                    <span className="text-xs text-[#4f4a52]/60">{STATUS_LABELS[s]}</span>
                    <span className="text-xs font-semibold tabular-nums text-[#4f4a52]">
                      {brief.pipeline[s]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-1 border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#4f4a52]/40">Total orders</span>
                  <span className="text-xs font-bold tabular-nums text-[#4f4a52]">{brief.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#4f4a52]/40">Cancel rate</span>
                  <span className="text-xs font-semibold tabular-nums text-[#4f4a52]">
                    {(brief.cancelRate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Fulfilment timing */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#4f4a52]/40">
                Fulfilment Timing
              </p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#4f4a52]/60">Avg. to confirm</span>
                  <span className="text-xs font-semibold tabular-nums text-[#4f4a52]">
                    {brief.avgHoursToConfirm !== null ? fmtHours(brief.avgHoursToConfirm) : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#4f4a52]/60">Avg. to dispatch</span>
                  <span className="text-xs font-semibold tabular-nums text-[#4f4a52]">
                    {brief.avgHoursToDispatch !== null ? fmtHours(brief.avgHoursToDispatch) : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#4f4a52]/60">Avg. to deliver</span>
                  <span className="text-xs font-semibold tabular-nums text-[#4f4a52]">
                    {brief.avgHoursToDeliver !== null ? fmtHours(brief.avgHoursToDeliver) : "—"}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-[10px] text-[#4f4a52]/30">Averages exclude outliers over 7 days.</p>
              <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#4f4a52]/60">Last 7 days</span>
                  <span className="text-xs font-semibold tabular-nums text-[#4f4a52]">
                    {brief.last7DayOrders} orders · {fmtR(brief.last7DayRevenue)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#4f4a52]/60">Last 30 days</span>
                  <span className="text-xs font-semibold tabular-nums text-[#4f4a52]">
                    {brief.last30DayOrders} orders · {fmtR(brief.last30DayRevenue)}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        <hr className="border-gray-200" />

        {/* 6 · Maison Reflection ────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Maison Reflection</p>
          <h2 className="mt-2 text-xl font-black text-[#4f4a52]">A Note on Your Week</h2>
          <p className="mt-5 text-sm leading-7 text-[#4f4a52]/70">{brief.reflection}</p>
        </section>

        <hr className="border-gray-200" />

        {/* 7 · Catalogue Health ─────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Catalogue Health</p>
          <h2 className="mt-2 text-xl font-black text-[#4f4a52]">Knowledge Catalogue at a Glance</h2>

          {/* Tier distribution */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm text-center">
              <p className="text-2xl font-black tabular-nums text-[#4f4a52]">{catalogueHealth.tierCounts.rich}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-emerald-600">Rich</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm text-center">
              <p className="text-2xl font-black tabular-nums text-[#4f4a52]">{catalogueHealth.tierCounts.standard}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#4f4a52]/50">Standard</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm text-center">
              <p className="text-2xl font-black tabular-nums text-[#4f4a52]">{catalogueHealth.tierCounts.minimal}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#d89ca4]">Minimal</p>
            </div>
          </div>

          {/* Average scores */}
          <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#4f4a52]/60">Avg. overall score</span>
              <span className="text-xs font-bold tabular-nums text-[#4f4a52]">
                {(catalogueHealth.avgOverallScore * 100).toFixed(1)}%
              </span>
            </div>
            <div className="mt-4 space-y-2.5 border-t border-gray-100 pt-4">
              {(
                [
                  ["Editorial Completeness",  catalogueHealth.avgEditorialCompleteness],
                  ["Educational Richness",    catalogueHealth.avgEducationalRichness],
                  ["Relationship Richness",   catalogueHealth.avgRelationshipRichness],
                  ["Discovery Readiness",     catalogueHealth.avgDiscoveryReadiness],
                  ["Composition Depth",       catalogueHealth.avgCompositionDepth],
                  ["Commerce Completeness",   catalogueHealth.avgCommerceCompleteness],
                ] as [string, number][]
              ).map(([label, score]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-[#4f4a52]/60">{label}</span>
                  <span className="text-xs font-semibold tabular-nums text-[#4f4a52]">
                    {(score * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom 10 authoring candidates */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#4f4a52]/40">
              Authoring Candidates
            </p>
            <div className="space-y-2">
              {catalogueHealth.bottomTen.map((r, i) => (
                <div
                  key={r.slug}
                  className="flex items-center gap-4 rounded-xl bg-white px-4 py-3 shadow-sm"
                >
                  <span className="w-5 shrink-0 text-center text-[11px] font-black text-[#4f4a52]/25">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-sm font-semibold text-[#4f4a52]">{slugToTitle(r.slug)}</p>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${TIER_META[r.tier].color}`}>
                      {TIER_META[r.tier].label}
                    </span>
                    <span className="text-xs tabular-nums text-[#4f4a52]/50">
                      {(r.overallScore * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-[#4f4a52]/30">
            {catalogueHealth.totalRecords} records · Scores computed from 6 knowledge dimensions.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* 8 · Discovery Intelligence ───────────────────────────────────────── */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Discovery Intelligence</p>
          <h2 className="mt-2 text-xl font-black text-[#4f4a52]">Discovery System at a Glance</h2>

          {/* Depth distribution */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm text-center">
              <p className="text-2xl font-black tabular-nums text-[#4f4a52]">{discoveryHealth.depthCounts.depth1}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#4f4a52]/50">Accessible</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm text-center">
              <p className="text-2xl font-black tabular-nums text-[#4f4a52]">{discoveryHealth.depthCounts.depth2}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[#4f4a52]/50">Versatile</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm text-center">
              <p className="text-2xl font-black tabular-nums text-[#4f4a52]">{discoveryHealth.depthCounts.depth3}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-emerald-600">Specialised</p>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#4f4a52]/60">Avg. representative quality</span>
              <span className="text-xs font-bold tabular-nums text-[#4f4a52]">
                {(discoveryHealth.avgRepQuality * 100).toFixed(1)}%
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-[#4f4a52]/60">Total collections</span>
              <span className="text-xs font-semibold tabular-nums text-[#4f4a52]">{discoveryHealth.totalCollections}</span>
            </div>
          </div>

          {/* Strongest collections */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#4f4a52]/40">
              Strongest Collections
            </p>
            <div className="space-y-2">
              {discoveryHealth.topCollections.map((c, i) => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 rounded-xl bg-white px-4 py-3 shadow-sm"
                >
                  <span className="w-5 shrink-0 text-center text-[11px] font-black text-[#4f4a52]/25">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-sm font-semibold text-[#4f4a52]">{c.name}</p>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4f4a52]/40">
                      Depth {c.depth}
                    </span>
                    <span className="text-xs tabular-nums text-[#4f4a52]/50">
                      {(c.avgRepQuality * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enrichment candidates */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#4f4a52]/40">
              Enrichment Candidates
            </p>
            <div className="space-y-2">
              {discoveryHealth.needsEnrichment.map((c, i) => (
                <div
                  key={c.id}
                  className="flex items-center gap-4 rounded-xl bg-white px-4 py-3 shadow-sm"
                >
                  <span className="w-5 shrink-0 text-center text-[11px] font-black text-[#4f4a52]/25">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-sm font-semibold text-[#4f4a52]">{c.name}</p>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#d89ca4]">
                      Depth {c.depth}
                    </span>
                    <span className="text-xs tabular-nums text-[#4f4a52]/50">
                      {(c.avgRepQuality * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs text-[#4f4a52]/30">
            {discoveryHealth.totalCollections} collections · Representative quality measured by discovery readiness.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* 9 · Private Notes ────────────────────────────────────────────────── */}
        <section className="pb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#d89ca4]">Your Space</p>
          <h2 className="mt-2 mb-6 text-xl font-black text-[#4f4a52]">Maison Notes</h2>
          <MaisonNotes />
        </section>

      </div>
    </div>
  );
}

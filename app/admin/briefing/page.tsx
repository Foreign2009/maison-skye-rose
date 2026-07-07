import type { Metadata }   from "next";
import { cookies }         from "next/headers";
import { createHash }      from "crypto";
import { redirect }        from "next/navigation";
import { getSupabaseAdmin } from "@/app/lib/supabaseAdmin";
import { MOMENT_CONTENT }  from "@/app/lib/discovery/momentContent";
import { COLLECTION_SPECS } from "@/app/lib/discovery/collectionEngine";
import type { OrderRow }   from "@/app/admin/AdminConsole";
import BriefingDashboard, { type MaisonBrief } from "@/app/admin/BriefingDashboard";
import type { DiscoverySource } from "@/app/lib/discoveryAttribution";
import type { OrderStatus }     from "@/app/lib/orderStatus";

export const metadata: Metadata = {
  title:  "Briefing | Maison Skye & Rose",
  robots: { index: false, follow: false },
};

// ── Auth ──────────────────────────────────────────────────────────────────────

function computeSessionToken(): string {
  return createHash("sha256")
    .update((process.env.ADMIN_SECRET ?? "") + "msr-ops-v1")
    .digest("hex");
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const SOURCE_LABELS: Record<DiscoverySource, string> = {
  "discover-moment": "Discover by Moment",
  "quiz":            "Scent Finder",
  "concierge":       "AI Concierge",
  "shop-curated":    "Curated Shop",
  "search":          "Search",
};

function momentLookup(momentId: string): string {
  return (
    MOMENT_CONTENT.find((m) => m.collectionId === momentId)?.label ??
    COLLECTION_SPECS.find((s) => s.id === momentId)?.name ??
    momentId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

function fmtR(n: number): string {
  const parts = n.toFixed(2).split(".");
  const int   = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `R ${int}.${parts[1]}`;
}

function avg(arr: number[]): number | null {
  return arr.length === 0 ? null : arr.reduce((a, b) => a + b, 0) / arr.length;
}

function computeReflection(data: {
  weekOrders:        number;
  weekRevenue:       number;
  discoveryPathways: Array<{ source: DiscoverySource; label: string; count: number }>;
  topFragrances:     Array<{ title: string; orderCount: number }>;
}): string {
  const sentences: string[] = [];

  if (data.weekOrders > 0) {
    const s = data.weekOrders === 1;
    sentences.push(
      `This week, ${data.weekOrders} ${s ? "customer" : "customers"} confirmed their fragrance ${s ? "order" : "orders"}, bringing ${fmtR(data.weekRevenue)} to Maison.`
    );
  }

  if (data.discoveryPathways.length > 0) {
    const top = data.discoveryPathways[0];
    const n   = top.count;
    if (top.source === "discover-moment") {
      sentences.push(
        `${top.label} guided ${n} ${n === 1 ? "customer" : "customers"} toward their fragrance this week.`
      );
    } else if (top.source === "quiz") {
      sentences.push(
        `The Scent Finder guided ${n} ${n === 1 ? "customer" : "customers"} to their fragrance this week.`
      );
    }
  }

  if (data.topFragrances.length > 0) {
    const top = data.topFragrances[0];
    sentences.push(
      `${top.title} resonated most with customers — chosen across ${top.orderCount} ${top.orderCount === 1 ? "order" : "orders"}.`
    );
  }

  if (sentences.length === 0) {
    return "Maison is ready for its first discovery journey. Orders and discoveries will begin shaping these insights as customers find their fragrance.";
  }

  return sentences.join(" ");
}

// ── Brief computation ─────────────────────────────────────────────────────────

function computeBrief(orders: OrderRow[], now: Date): MaisonBrief {
  const CONFIRMED = new Set<OrderStatus>([
    "payment_confirmed", "processing", "dispatched", "delivered",
  ]);

  const todayStart  = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const weekStart   = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
  const monthStart  = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  let todayRevenue = 0, todayOrders = 0;
  let weekRevenue  = 0, weekOrders  = 0;
  let last30DayRevenue = 0, last30DayOrders = 0;
  let allTimeRevenue = 0;
  let activeCount    = 0;
  let noAttributionCount = 0;

  const pipeline: Record<OrderStatus, number> = {
    awaiting_payment: 0, payment_confirmed: 0, processing: 0,
    dispatched: 0, delivered: 0, cancelled: 0,
  };

  const needsAttention: MaisonBrief["needsAttention"] = [];
  const readyToShip:    MaisonBrief["readyToShip"]    = [];

  const attributionMap = new Map<string, { source: DiscoverySource; label: string; count: number }>();
  const fragranceMap   = new Map<string, { orderCount: number; unitCount: number }>();

  const confirmTimes:  number[] = [];
  const dispatchTimes: number[] = [];
  const deliverTimes:  number[] = [];

  const MAX_HOURS = 7 * 24;

  for (const order of orders) {
    const status    = order.payment_status;
    const createdMs = new Date(order.created_at).getTime();
    const confirmed = CONFIRMED.has(status);

    pipeline[status]++;

    if (confirmed) {
      allTimeRevenue += order.total;
      if (createdMs >= todayStart.getTime()) { todayRevenue += order.total; todayOrders++;      }
      if (createdMs >= weekStart.getTime())  { weekRevenue  += order.total; weekOrders++;       }
      if (createdMs >= monthStart.getTime()) { last30DayRevenue += order.total; last30DayOrders++; }
    }

    if (status !== "cancelled" && status !== "delivered") {
      activeCount++;
    }

    const ageHours = (now.getTime() - createdMs) / 3600000;
    const simple   = {
      ref: order.order_ref, name: order.customer_name,
      status, total: order.total, createdAt: order.created_at,
    };

    if (status === "payment_confirmed") {
      needsAttention.push(simple);
    } else if (status === "awaiting_payment" && ageHours > 24) {
      needsAttention.push(simple);
    }

    if (status === "processing") {
      readyToShip.push(simple);
    }

    // Attribution
    if (order.discovery_context) {
      const dc = order.discovery_context;
      let key: string;
      let label: string;
      if (dc.source === "discover-moment" && dc.momentId) {
        key   = `discover-moment:${dc.momentId}`;
        label = momentLookup(dc.momentId);
      } else {
        key   = dc.source;
        label = SOURCE_LABELS[dc.source] ?? dc.source;
      }
      const prev = attributionMap.get(key) ?? { source: dc.source, label, count: 0 };
      attributionMap.set(key, { ...prev, count: prev.count + 1 });
    } else if (status !== "cancelled") {
      noAttributionCount++;
    }

    // Fragrance frequency — confirmed orders only
    if (confirmed) {
      const seen = new Set<string>();
      for (const item of order.items) {
        const title = item.title;
        const prev  = fragranceMap.get(title) ?? { orderCount: 0, unitCount: 0 };
        if (!seen.has(title)) {
          seen.add(title);
          fragranceMap.set(title, {
            orderCount: prev.orderCount + 1,
            unitCount:  prev.unitCount  + item.quantity,
          });
        } else {
          fragranceMap.set(title, { ...prev, unitCount: prev.unitCount + item.quantity });
        }
      }
    }

    // Lifecycle timing
    if (order.payment_confirmed_at) {
      const h = (new Date(order.payment_confirmed_at).getTime() - createdMs) / 3600000;
      if (h >= 0 && h <= MAX_HOURS) confirmTimes.push(h);
    }
    if (order.dispatched_at && order.payment_confirmed_at) {
      const h = (new Date(order.dispatched_at).getTime() - new Date(order.payment_confirmed_at).getTime()) / 3600000;
      if (h >= 0 && h <= MAX_HOURS) dispatchTimes.push(h);
    }
    if (order.delivered_at && order.dispatched_at) {
      const h = (new Date(order.delivered_at).getTime() - new Date(order.dispatched_at).getTime()) / 3600000;
      if (h >= 0 && h <= MAX_HOURS) deliverTimes.push(h);
    }
  }

  // Sort: payment_confirmed first (urgency 0), awaiting_payment > 24h (urgency 1), then by age asc
  needsAttention.sort((a, b) => {
    const pa = a.status === "payment_confirmed" ? 0 : 1;
    const pb = b.status === "payment_confirmed" ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  readyToShip.sort((a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const discoveryPathways = [...attributionMap.values()].sort((a, b) => b.count - a.count);
  const totalWithAttribution = discoveryPathways.reduce((s, p) => s + p.count, 0);

  const topFragrances = [...fragranceMap.entries()]
    .map(([title, s]) => ({ title, ...s }))
    .sort((a, b) => b.orderCount - a.orderCount || b.unitCount - a.unitCount)
    .slice(0, 8);

  const totalOrders = orders.length;
  const cancelRate  = totalOrders > 0 ? pipeline.cancelled / totalOrders : 0;

  return {
    generatedAt:          now.toISOString(),
    todayRevenue, todayOrders,
    weekRevenue, weekOrders,
    allTimeRevenue,
    activeCount,
    needsAttention,
    readyToShip,
    discoveryPathways,
    noAttributionCount,
    totalWithAttribution,
    topFragrances,
    pipeline,
    totalOrders,
    cancelRate,
    last7DayOrders:  weekOrders,
    last7DayRevenue: weekRevenue,
    last30DayOrders,
    last30DayRevenue,
    avgHoursToConfirm:  avg(confirmTimes),
    avgHoursToDispatch: avg(dispatchTimes),
    avgHoursToDeliver:  avg(deliverTimes),
    reflection: computeReflection({ weekOrders, weekRevenue, discoveryPathways, topFragrances }),
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BriefingPage() {
  const cookieStore = await cookies();
  const session     = cookieStore.get("msr-ops-session")?.value;
  const isAuth      = !!session && session === computeSessionToken();

  if (!isAuth) redirect("/admin");

  let orders: OrderRow[] = [];
  try {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Briefing] Orders fetch error:", error.message);
    } else {
      orders = (data ?? []) as OrderRow[];
    }
  } catch (err) {
    console.warn("[Briefing] Could not fetch orders:", err instanceof Error ? err.message : err);
  }

  const brief = computeBrief(orders, new Date());
  return <BriefingDashboard brief={brief} />;
}

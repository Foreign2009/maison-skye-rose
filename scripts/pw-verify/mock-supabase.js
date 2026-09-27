// @ts-check
/**
 * Minimal mock Supabase server for isolated Playwright tests.
 *
 * Listens on port 54322 (offset from the real Supabase port so they can
 * coexist). Returns synthetic test orders shaped as the AdminConsole
 * OrderRow type expects. Responds to /rest/v1/orders GET with the synthetic
 * dataset; PATCH applies updates to in-memory state so router.refresh()
 * returns updated order data. All other paths return an empty JSON array.
 *
 * No production credentials are used or required — this server never
 * connects to any external service.
 */

const http = require("http");

// ── Time constants ────────────────────────────────────────────────────────────

const NOW       = new Date().toISOString();
const YESTERDAY = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();

// ── In-memory patch state ─────────────────────────────────────────────────────
// Stores partial updates applied via PATCH during tests so that subsequent
// GET requests return the updated order data (simulating DB writes).

/** @type {Map<string, Record<string, unknown>>} */
const orderPatches = new Map();

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * Extracts the value from a Supabase eq filter query param.
 * e.g. "order_ref=eq.MSR-TEST-001" → "MSR-TEST-001"
 * @param {URLSearchParams} params
 * @param {string} key
 * @returns {string|null}
 */
function parseEqFilter(params, key) {
  const val = params.get(key);
  if (!val || !val.startsWith("eq.")) return null;
  return val.slice(3);
}

// ── Synthetic orders ──────────────────────────────────────────────────────────
// Clearly-labelled test orders covering different statuses, provinces and
// dispatch scenarios. None of these refs will ever appear in the production DB.

/** @type {Array<Record<string, unknown>>} */
const SYNTHETIC_ORDERS = [
  // ── Existing orders (used by focused-order-nav.spec.js) ──────────────────
  {
    id:                   "00000000-0000-0000-0000-000000000001",
    order_ref:            "MSR-TEST-PWTEST-001",
    customer_name:        "Alex Mokoena",
    phone:                "0820000001",
    address:              "1 Test Street, Sandton",
    province:             "Gauteng",
    items: [
      { id: "sauvage-inspired", title: "Sauvage Inspired",   price: 180, image: "/img/test.jpg", quantity: 1, size: "50ml" },
      { id: "bleu-inspired",    title: "Bleu de Chanel",     price: 100, image: "/img/test.jpg", quantity: 1, size: "30ml" },
    ],
    subtotal: 280, vat: 0, delivery: 0, total: 280,
    payment_status:       "awaiting_payment",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    payment_confirmed_at: null,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment", changed_at: YESTERDAY, note: "Order placed" },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  {
    id:                   "00000000-0000-0000-0000-000000000002",
    order_ref:            "MSR-TEST-PWTEST-002",
    customer_name:        "Priya Naidoo",
    phone:                "0820000002",
    address:              "2 Test Road, Durban",
    province:             "KwaZulu-Natal",
    items: [
      { id: "aventus-inspired", title: "Aventus Inspired", price: 560, image: "/img/test.jpg", quantity: 1, size: "100ml" },
    ],
    subtotal: 560, vat: 0, delivery: 0, total: 560,
    payment_status:       "payment_confirmed",
    notes:                "Proof of payment received via WhatsApp",
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    payment_confirmed_at: NOW,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed" },
      { status: "payment_confirmed", changed_at: NOW,       note: "Proof of payment received via WhatsApp" },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  {
    id:                   "00000000-0000-0000-0000-000000000003",
    order_ref:            "MSR-TEST-PWTEST-003",
    customer_name:        "Nadia Olivier",
    phone:                "0820000003",
    address:              "3 Test Avenue, Cape Town",
    province:             "Western Cape",
    items: [
      { id: "black-orchid", title: "Black Orchid Inspired", price: 420, image: "/img/test.jpg", quantity: 1, size: "50ml" },
    ],
    subtotal: 420, vat: 0, delivery: 0, total: 420,
    payment_status:       "processing",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    payment_confirmed_at: YESTERDAY,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"    },
      { status: "payment_confirmed", changed_at: YESTERDAY, note: "Bank confirmed"  },
      { status: "processing",        changed_at: NOW,       note: "Packing started" },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  // ── Dispatch-specific test orders ─────────────────────────────────────────
  // Already-dispatched order: tests "reopen WA section after refresh".
  {
    id:                   "00000000-0000-0000-0000-000000000004",
    order_ref:            "MSR-TEST-PWTEST-004",
    customer_name:        "Amara Dlamini",
    phone:                "0820000004",
    address:              "4 Test Lane, Johannesburg",
    province:             "Gauteng",
    items: [
      { id: "oud-intense", title: "Oud Intense Inspired", price: 490, image: "/img/test.jpg", quantity: 1, size: "50ml" },
    ],
    subtotal: 490, vat: 0, delivery: 0, total: 490,
    payment_status:       "dispatched",
    notes:                null,
    tracking_number:      "TCG987654",
    courier_name:         "The Courier Guy",
    tracking_url:         "https://track.thecourierguy.co.za/TCG987654",
    payment_confirmed_at: YESTERDAY,
    dispatched_at:        NOW,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"       },
      { status: "payment_confirmed", changed_at: YESTERDAY, note: "Bank confirmed"     },
      { status: "processing",        changed_at: YESTERDAY, note: "Packing started"    },
      { status: "dispatched",        changed_at: NOW,       note: "Handed to courier"  },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  // Already-dispatched order with invalid phone: tests Copy-message fallback.
  {
    id:                   "00000000-0000-0000-0000-000000000005",
    order_ref:            "MSR-TEST-PWNOPH-001",
    customer_name:        "Zara Botha",
    phone:                "INVALID",
    address:              "5 Test Crescent, Pretoria",
    province:             "Gauteng",
    items: [
      { id: "velvet-noir", title: "Velvet Noir Inspired", price: 380, image: "/img/test.jpg", quantity: 1, size: "30ml" },
    ],
    subtotal: 380, vat: 0, delivery: 0, total: 380,
    payment_status:       "dispatched",
    notes:                null,
    tracking_number:      "FS-TEST-001",
    courier_name:         "FastShip",
    tracking_url:         null,
    payment_confirmed_at: YESTERDAY,
    dispatched_at:        NOW,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"      },
      { status: "payment_confirmed", changed_at: YESTERDAY, note: "Bank confirmed"    },
      { status: "processing",        changed_at: YESTERDAY, note: "Packing started"   },
      { status: "dispatched",        changed_at: NOW,       note: "Handed to courier" },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  // Processing order that always returns HTTP 500 on PATCH: tests "failed save".
  {
    id:                   "00000000-0000-0000-0000-000000000006",
    order_ref:            "MSR-TEST-PWFAIL-00001",
    customer_name:        "TestFail Customer",
    phone:                "0820000006",
    address:              "6 Fail Street, Cape Town",
    province:             "Western Cape",
    items: [
      { id: "test-fragrance", title: "Test Fragrance", price: 250, image: "/img/test.jpg", quantity: 1, size: "50ml" },
    ],
    subtotal: 250, vat: 0, delivery: 0, total: 250,
    payment_status:       "processing",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    payment_confirmed_at: YESTERDAY,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"    },
      { status: "payment_confirmed", changed_at: YESTERDAY, note: "Bank confirmed"  },
      { status: "processing",        changed_at: NOW,       note: "Packing started" },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
];

const EMPTY_JSON = JSON.stringify([]);

// ── Server ────────────────────────────────────────────────────────────────────

const PORT = Number(process.env.MOCK_SUPABASE_PORT || 54322);

const server = http.createServer((req, res) => {
  const url    = req.url || "";
  const urlObj = new URL(url, "http://localhost");

  // Supabase health check (used by the JS client on init)
  if (url === "/rest/v1/" || url === "/rest/v1" || url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end('{"status":"ok"}');
    return;
  }

  // Auth endpoints — return minimal valid responses
  if (url.startsWith("/auth/")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end("{}");
    return;
  }

  // Orders table
  if (urlObj.pathname === "/rest/v1/orders") {
    const refFilter  = parseEqFilter(urlObj.searchParams, "order_ref");
    const limitParam = urlObj.searchParams.get("limit");

    if (req.method === "GET" || req.method === "HEAD") {
      // Merge in-memory patches with base synthetic data so router.refresh()
      // reflects PATCH writes applied during the current test session.
      let orders = SYNTHETIC_ORDERS.map(o => ({
        ...o,
        ...(orderPatches.get(/** @type {string} */ (o.order_ref)) || {}),
      }));

      // Filter by order_ref when present (preflight SELECT in PATCH handler)
      if (refFilter) {
        orders = orders.filter(o => o.order_ref === refFilter);
      }

      // Apply limit
      if (limitParam) {
        orders = orders.slice(0, parseInt(limitParam, 10));
      }

      res.writeHead(200, {
        "Content-Type":  "application/json",
        "Content-Range": `0-${Math.max(0, orders.length - 1)}/${orders.length}`,
      });
      res.end(req.method === "HEAD" ? undefined : JSON.stringify(orders));
      return;
    }

    if (req.method === "PATCH") {
      // Return 500 for the PWFAIL test ref to simulate a DB write failure.
      // The Next.js PATCH handler checks for updateError and returns 500,
      // which updateStatusAction surfaces as { success: false }.
      if (refFilter === "MSR-TEST-PWFAIL-00001") {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Simulated database error" }));
        return;
      }

      // Read body async and apply patch to in-memory state.
      let body = "";
      req.on("data", chunk => { body += chunk; });
      req.on("end", () => {
        try {
          const patch = JSON.parse(body || "{}");
          if (refFilter) {
            orderPatches.set(refFilter, {
              ...(orderPatches.get(refFilter) || {}),
              ...patch,
            });
          }
        } catch {
          // Ignore parse errors — respond 200 regardless
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(EMPTY_JSON);
      });
      return;
    }

    // POST / DELETE — no-op
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(EMPTY_JSON);
    return;
  }

  // All other tables — return empty array
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(EMPTY_JSON);
});

server.on("error", err => {
  console.error("[mock-supabase] Server error:", err.message);
  process.exit(1);
});

server.listen(PORT, "127.0.0.1", () => {
  // Print to stdout so Playwright webServer can detect readiness via the log line.
  console.log(`[mock-supabase] Listening on http://127.0.0.1:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => server.close());
process.on("SIGINT",  () => server.close());

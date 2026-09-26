// @ts-check
/**
 * Minimal mock Supabase server for isolated Playwright tests.
 *
 * Listens on port 54322 (offset from the real Supabase port so they can
 * coexist). Returns synthetic test orders shaped as the AdminConsole
 * OrderRow type expects. Responds to any /rest/v1/orders* GET with the
 * synthetic dataset; all other paths return an empty JSON array.
 *
 * No production credentials are used or required — this server never
 * connects to any external service.
 */

const http = require("http");

// ── Synthetic orders ──────────────────────────────────────────────────────────
// Three clearly-labelled test orders covering different statuses and provinces.
// None of these refs will ever appear in the production database.

const NOW = new Date().toISOString();
const YESTERDAY = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();

/** @type {import('./types').OrderRow[]} */
const SYNTHETIC_ORDERS = [
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
    subtotal:             280,
    vat:                  0,
    delivery:             0,
    total:                280,
    payment_status:       "awaiting_payment",
    notes:                null,
    tracking_number:      null,
    payment_confirmed_at: null,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment", changed_at: YESTERDAY, note: "Order placed" },
    ],
    discovery_context:    null,
    created_at:           YESTERDAY,
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
    subtotal:             560,
    vat:                  0,
    delivery:             0,
    total:                560,
    payment_status:       "payment_confirmed",
    notes:                "Proof of payment received via WhatsApp",
    tracking_number:      null,
    payment_confirmed_at: NOW,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"                      },
      { status: "payment_confirmed", changed_at: NOW,       note: "Proof of payment received via WhatsApp" },
    ],
    discovery_context:    null,
    created_at:           YESTERDAY,
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
    subtotal:             420,
    vat:                  0,
    delivery:             0,
    total:                420,
    payment_status:       "processing",
    notes:                null,
    tracking_number:      null,
    payment_confirmed_at: YESTERDAY,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"    },
      { status: "payment_confirmed", changed_at: YESTERDAY, note: "Bank confirmed"  },
      { status: "processing",        changed_at: NOW,       note: "Packing started" },
    ],
    discovery_context:    null,
    created_at:           YESTERDAY,
  },
];

// Supabase REST returns newest-first when ordered by created_at desc.
// All three share the same created_at here, so the order is stable.
const ORDERS_JSON   = JSON.stringify(SYNTHETIC_ORDERS);
const EMPTY_JSON    = JSON.stringify([]);

// ── Server ────────────────────────────────────────────────────────────────────

const PORT = Number(process.env.MOCK_SUPABASE_PORT || 54322);

const server = http.createServer((req, res) => {
  const url = req.url || "";

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

  // Orders table — return the synthetic dataset for any GET
  if (url.startsWith("/rest/v1/orders")) {
    if (req.method === "GET" || req.method === "HEAD") {
      res.writeHead(200, {
        "Content-Type":  "application/json",
        "Content-Range": `0-${SYNTHETIC_ORDERS.length - 1}/${SYNTHETIC_ORDERS.length}`,
      });
      res.end(req.method === "HEAD" ? undefined : ORDERS_JSON);
      return;
    }
    // PATCH / POST / DELETE — return 200 with empty response (writes are no-ops)
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

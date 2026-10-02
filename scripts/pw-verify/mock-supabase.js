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

// Counts how many times the mock PATCH handler is reached. Reset before a
// request, read after: count = 0 proves the mock PATCH handler was not reached.
let patchCallCount = 0;

// Counts how many times the mock GET (SELECT) handler is reached for
// /rest/v1/orders. Reset before a request, read after: count = 0 proves the
// mock SELECT handler was not reached. Together with patchCallCount = 0 these
// prove no DB access of any kind for the tested request.
let selectCallCount = 0;

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

/**
 * Extracts the values from a Supabase in-filter query param.
 * e.g. "payment_status=in.(dispatched,delivered)" → ["dispatched","delivered"]
 * @param {URLSearchParams} params
 * @param {string} key
 * @returns {string[]|null}
 */
function parseInFilter(params, key) {
  const val = params.get(key);
  if (!val || !val.startsWith("in.(") || !val.endsWith(")")) return null;
  return val.slice(4, -1).split(",").map(s => s.trim()).filter(Boolean);
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
    courier_cost:         null,
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
    courier_cost:         null,
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
    courier_cost:         null,
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
    courier_cost:         null,
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
    courier_cost:         null,
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
  // ── Courier-cost persistence test orders ─────────────────────────────────────
  // Each starts as processing so it can be dispatched exactly once per test run.
  // Used by dispatch-api.spec.js to verify zero, positive, and blank/omit cost.
  {
    id:                   "00000000-0000-0000-0000-000000000007",
    order_ref:            "MSR-TEST-PWCOST-001",
    customer_name:        "Cost Test Zero",
    phone:                "0820000007",
    address:              "7 Cost Street, Cape Town",
    province:             "Western Cape",
    items: [
      { id: "cost-test", title: "Cost Test Fragrance", price: 300, image: "/img/test.jpg", quantity: 1, size: "50ml" },
    ],
    subtotal: 300, vat: 0, delivery: 0, total: 300,
    payment_status:       "processing",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    courier_cost:         null,
    payment_confirmed_at: YESTERDAY,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"   },
      { status: "payment_confirmed", changed_at: YESTERDAY, note: "Bank confirmed" },
      { status: "processing",        changed_at: NOW,       note: "Packing"        },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  {
    id:                   "00000000-0000-0000-0000-000000000008",
    order_ref:            "MSR-TEST-PWCOST-002",
    customer_name:        "Cost Test Positive",
    phone:                "0820000008",
    address:              "8 Cost Street, Cape Town",
    province:             "Western Cape",
    items: [
      { id: "cost-test-2", title: "Cost Test Fragrance 2", price: 320, image: "/img/test.jpg", quantity: 1, size: "50ml" },
    ],
    subtotal: 320, vat: 0, delivery: 0, total: 320,
    payment_status:       "processing",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    courier_cost:         null,
    payment_confirmed_at: YESTERDAY,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"   },
      { status: "payment_confirmed", changed_at: YESTERDAY, note: "Bank confirmed" },
      { status: "processing",        changed_at: NOW,       note: "Packing"        },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  {
    id:                   "00000000-0000-0000-0000-000000000009",
    order_ref:            "MSR-TEST-PWCOST-003",
    customer_name:        "Cost Test Blank",
    phone:                "0820000009",
    address:              "9 Cost Street, Cape Town",
    province:             "Western Cape",
    items: [
      { id: "cost-test-3", title: "Cost Test Fragrance 3", price: 310, image: "/img/test.jpg", quantity: 1, size: "50ml" },
    ],
    subtotal: 310, vat: 0, delivery: 0, total: 310,
    payment_status:       "processing",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    courier_cost:         null,
    payment_confirmed_at: YESTERDAY,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"   },
      { status: "payment_confirmed", changed_at: YESTERDAY, note: "Bank confirmed" },
      { status: "processing",        changed_at: NOW,       note: "Packing"        },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  {
    id:                   "00000000-0000-0000-0000-000000000010",
    order_ref:            "MSR-TEST-PWCOST-004",
    customer_name:        "Cost Test WA",
    phone:                "0820000010",
    address:              "10 Cost Street, Durban",
    province:             "KwaZulu-Natal",
    items: [
      { id: "cost-test-4", title: "Cost Test Fragrance 4", price: 330, image: "/img/test.jpg", quantity: 1, size: "50ml" },
    ],
    subtotal: 330, vat: 0, delivery: 0, total: 330,
    payment_status:       "processing",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    courier_cost:         null,
    payment_confirmed_at: YESTERDAY,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"   },
      { status: "payment_confirmed", changed_at: YESTERDAY, note: "Bank confirmed" },
      { status: "processing",        changed_at: NOW,       note: "Packing"        },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  // ── Browser-test-only orders ──────────────────────────────────────────────
  // PWCOST-005: server-action validation browser test (test 13).
  // PWCOST-006: browser-reload positive-cost persistence test (test 14).
  // PWCOST-007: browser-reload zero-cost persistence test (test 15).
  // Not used by dispatch-api.spec.js so their state is never mutated by API tests.
  {
    id:                   "00000000-0000-0000-0000-000000000011",
    order_ref:            "MSR-TEST-PWCOST-005",
    customer_name:        "Cost Test SA Validate",
    phone:                "0820000011",
    address:              "11 Cost Street, Cape Town",
    province:             "Western Cape",
    items: [
      { id: "cost-test-5", title: "Cost Test Fragrance 5", price: 340, image: "/img/test.jpg", quantity: 1, size: "50ml" },
    ],
    subtotal: 340, vat: 0, delivery: 0, total: 340,
    payment_status:       "processing",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    courier_cost:         null,
    payment_confirmed_at: YESTERDAY,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"   },
      { status: "payment_confirmed", changed_at: YESTERDAY, note: "Bank confirmed" },
      { status: "processing",        changed_at: NOW,       note: "Packing"        },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  {
    id:                   "00000000-0000-0000-0000-000000000012",
    order_ref:            "MSR-TEST-PWCOST-006",
    customer_name:        "Cost Test Reload",
    phone:                "0820000012",
    address:              "12 Cost Street, Cape Town",
    province:             "Western Cape",
    items: [
      { id: "cost-test-6", title: "Cost Test Fragrance 6", price: 350, image: "/img/test.jpg", quantity: 1, size: "50ml" },
    ],
    subtotal: 350, vat: 0, delivery: 0, total: 350,
    payment_status:       "processing",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    courier_cost:         null,
    payment_confirmed_at: YESTERDAY,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"   },
      { status: "payment_confirmed", changed_at: YESTERDAY, note: "Bank confirmed" },
      { status: "processing",        changed_at: NOW,       note: "Packing"        },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  {
    id:                   "00000000-0000-0000-0000-000000000013",
    order_ref:            "MSR-TEST-PWCOST-007",
    customer_name:        "Cost Test Zero Reload",
    phone:                "0820000013",
    address:              "13 Cost Street, Cape Town",
    province:             "Western Cape",
    items: [
      { id: "cost-test-7", title: "Cost Test Fragrance 7", price: 360, image: "/img/test.jpg", quantity: 1, size: "50ml" },
    ],
    subtotal: 360, vat: 0, delivery: 0, total: 360,
    payment_status:       "processing",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    courier_cost:         null,
    payment_confirmed_at: YESTERDAY,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"   },
      { status: "payment_confirmed", changed_at: YESTERDAY, note: "Bank confirmed" },
      { status: "processing",        changed_at: NOW,       note: "Packing"        },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  // ── Admin-notes regression orders ────────────────────────────────────────────
  // PWNTE-001: processing order with a pre-existing admin note.
  //   Used to verify that a status-transition PATCH does not overwrite orders.notes.
  // PWNTE-002: processing order with no notes.
  //   Used to verify that updateNotesAction writes orders.notes without touching status_history.
  {
    id:                   "00000000-0000-0000-0000-000000000014",
    order_ref:            "MSR-TEST-PWNTE-001",
    customer_name:        "Notes Test Dispatch",
    phone:                "0820000014",
    address:              "14 Notes Lane, Johannesburg",
    province:             "Gauteng",
    items: [
      { id: "notes-test-1", title: "Notes Test Fragrance", price: 250, image: "/img/test.jpg", quantity: 1, size: "50ml" },
    ],
    subtotal: 250, vat: 0, delivery: 0, total: 250,
    payment_status:       "processing",
    notes:                "Pre-existing admin note — must survive dispatch",
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    courier_cost:         null,
    payment_confirmed_at: YESTERDAY,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"   },
      { status: "payment_confirmed", changed_at: YESTERDAY, note: "Bank confirmed" },
      { status: "processing",        changed_at: NOW,       note: "Packing started" },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  {
    id:                   "00000000-0000-0000-0000-000000000015",
    order_ref:            "MSR-TEST-PWNTE-002",
    customer_name:        "Notes Test Edit",
    phone:                "0820000015",
    address:              "15 Notes Lane, Cape Town",
    province:             "Western Cape",
    items: [
      { id: "notes-test-2", title: "Notes Test Fragrance 2", price: 280, image: "/img/test.jpg", quantity: 1, size: "50ml" },
    ],
    subtotal: 280, vat: 0, delivery: 0, total: 280,
    payment_status:       "processing",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    courier_cost:         null,
    payment_confirmed_at: YESTERDAY,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"   },
      { status: "payment_confirmed", changed_at: YESTERDAY, note: "Bank confirmed" },
      { status: "processing",        changed_at: NOW,       note: "Packing started" },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  // ── Courier-cost editor test orders ──────────────────────────────────────────
  // Pre-dispatched orders for testing the post-dispatch cost editor.
  // Not used by dispatch-api.spec.js or dispatch-handoff.spec.js.
  {
    id:                   "00000000-0000-0000-0000-000000000016",
    order_ref:            "MSR-20261001-00016",
    customer_name:        "CCE Test Positive",
    phone:                "0820000016",
    address:              "16 CCE Lane, Johannesburg",
    province:             "Gauteng",
    items: [
      { id: "cce-test-1", title: "CCE Test Fragrance 1", price: 200, image: "/img/test.jpg", quantity: 1, size: "10ml" },
    ],
    subtotal: 200, vat: 0, delivery: 180, total: 380,
    payment_status:       "dispatched",
    notes:                "CCE field-preservation note",
    tracking_number:      "PNA-CCE-001",
    courier_name:         "PostNet",
    tracking_url:         "https://www.postnet.co.za",
    courier_cost:         null,
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
  {
    id:                   "00000000-0000-0000-0000-000000000017",
    order_ref:            "MSR-20261001-00017",
    customer_name:        "CCE Test Zero",
    phone:                "0820000017",
    address:              "17 CCE Lane, Durban",
    province:             "KwaZulu-Natal",
    items: [
      { id: "cce-test-2", title: "CCE Test Fragrance 2", price: 250, image: "/img/test.jpg", quantity: 1, size: "10ml" },
    ],
    subtotal: 250, vat: 0, delivery: 180, total: 430,
    payment_status:       "dispatched",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    courier_cost:         null,
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
  {
    id:                   "00000000-0000-0000-0000-000000000018",
    order_ref:            "MSR-20261001-00018",
    customer_name:        "CCE Test Clear",
    phone:                "0820000018",
    address:              "18 CCE Lane, Cape Town",
    province:             "Western Cape",
    items: [
      { id: "cce-test-3", title: "CCE Test Fragrance 3", price: 300, image: "/img/test.jpg", quantity: 1, size: "10ml" },
    ],
    subtotal: 300, vat: 0, delivery: 100, total: 400,
    payment_status:       "dispatched",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    courier_cost:         45.50,
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
  {
    id:                   "00000000-0000-0000-0000-000000000019",
    order_ref:            "MSR-20261001-00019",
    customer_name:        "CCE Test Ineligible",
    phone:                "0820000019",
    address:              "19 CCE Lane, Pretoria",
    province:             "Gauteng",
    items: [
      { id: "cce-test-4", title: "CCE Test Fragrance 4", price: 150, image: "/img/test.jpg", quantity: 1, size: "10ml" },
    ],
    subtotal: 150, vat: 0, delivery: 180, total: 330,
    payment_status:       "payment_confirmed",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    courier_cost:         null,
    payment_confirmed_at: NOW,
    dispatched_at:        null,
    delivered_at:         null,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"   },
      { status: "payment_confirmed", changed_at: NOW,       note: "Bank confirmed" },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  {
    id:                   "00000000-0000-0000-0000-000000000020",
    order_ref:            "MSR-20261001-00020",
    customer_name:        "CCE Test Delivered",
    phone:                "0820000020",
    address:              "20 CCE Lane, Bloemfontein",
    province:             "Free State",
    items: [
      { id: "cce-test-5", title: "CCE Test Fragrance 5", price: 200, image: "/img/test.jpg", quantity: 1, size: "10ml" },
    ],
    subtotal: 200, vat: 0, delivery: 180, total: 380,
    payment_status:       "delivered",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    courier_cost:         null,
    payment_confirmed_at: YESTERDAY,
    dispatched_at:        YESTERDAY,
    delivered_at:         NOW,
    cancelled_at:         null,
    status_history: [
      { status: "awaiting_payment",  changed_at: YESTERDAY, note: "Order placed"      },
      { status: "payment_confirmed", changed_at: YESTERDAY, note: "Bank confirmed"    },
      { status: "processing",        changed_at: YESTERDAY, note: "Packing started"   },
      { status: "dispatched",        changed_at: YESTERDAY, note: "Handed to courier" },
      { status: "delivered",         changed_at: NOW,       note: "Delivered"         },
    ],
    discovery_context: null,
    created_at:        YESTERDAY,
  },
  // CCE-FAIL: dispatched order where PATCH returns 500 — tests failed-save feedback.
  {
    id:                   "00000000-0000-0000-0000-000000000021",
    order_ref:            "MSR-20261001-00021",
    customer_name:        "CCE Test Fail Save",
    phone:                "0820000021",
    address:              "21 CCE Lane, East London",
    province:             "Eastern Cape",
    items: [
      { id: "cce-test-6", title: "CCE Test Fragrance 6", price: 200, image: "/img/test.jpg", quantity: 1, size: "10ml" },
    ],
    subtotal: 200, vat: 0, delivery: 180, total: 380,
    payment_status:       "dispatched",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    courier_cost:         null,
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
  // CCE-022: dispatched order reserved for action-ID capture in courier-cost-editor tests.
  // A real browser dispatch to this order captures the Next-Action header for updateCourierCostAction.
  {
    id:                   "00000000-0000-0000-0000-000000000022",
    order_ref:            "MSR-20261001-00022",
    customer_name:        "CCE ID Capture",
    phone:                "0820000022",
    address:              "22 CCE Lane, Johannesburg",
    province:             "Gauteng",
    items: [
      { id: "cce-test-7", title: "CCE Test Fragrance 7", price: 200, image: "/img/test.jpg", quantity: 1, size: "10ml" },
    ],
    subtotal: 200, vat: 0, delivery: 180, total: 380,
    payment_status:       "dispatched",
    notes:                null,
    tracking_number:      null,
    courier_name:         null,
    tracking_url:         null,
    courier_cost:         null,
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
    courier_cost:         null,
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

  // ── Test-instrumentation endpoints ───────────────────────────────────────
  // Used by tests to prove zero DB access for requests rejected by the
  // Next.js route before reaching the Supabase layer.

  if (urlObj.pathname === "/mock/patch-count") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ count: patchCallCount }));
    return;
  }

  if (urlObj.pathname === "/mock/reset-count") {
    patchCallCount  = 0;
    selectCallCount = 0;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (urlObj.pathname === "/mock/select-count") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ count: selectCallCount }));
    return;
  }

  // Orders table
  if (urlObj.pathname === "/rest/v1/orders") {
    const refFilter  = parseEqFilter(urlObj.searchParams, "order_ref");
    const limitParam = urlObj.searchParams.get("limit");

    if (req.method === "GET" || req.method === "HEAD") {
      // Count SELECT calls. Tests that prove zero DB access reset this before
      // sending a request and check it = 0 after to verify no SELECT reached here.
      selectCallCount += 1;

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
      // Increment counter every time the mock PATCH handler is reached.
      // This is AFTER the Next.js route's validation layer — if a request
      // is rejected by the route before the Supabase PATCH, this counter
      // stays at its pre-request value (proving zero DB access).
      patchCallCount += 1;

      // Return 500 for specific test refs to simulate DB write failures.
      // MSR-TEST-PWFAIL-00001: used by dispatch-api.spec.js (status transition fails).
      // MSR-20261001-00021:    used by courier-cost-editor.spec.js (cost save fails).
      if (refFilter === "MSR-TEST-PWFAIL-00001" || refFilter === "MSR-20261001-00021") {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Simulated database error" }));
        return;
      }

      // Parse optional filters and select parameter from the URL.
      const statusFilter = parseInFilter(urlObj.searchParams, "payment_status");
      const selectCols   = urlObj.searchParams.get("select");

      // Read body async and apply patch to in-memory state.
      let body = "";
      req.on("data", chunk => { body += chunk; });
      req.on("end", () => {
        try {
          const patch = JSON.parse(body || "{}");

          // Find orders matching all URL filters (with existing patches applied).
          let matches = SYNTHETIC_ORDERS.map(o => ({
            ...o,
            ...(orderPatches.get(/** @type {string} */ (o.order_ref)) || {}),
          }));
          if (refFilter)    matches = matches.filter(o => o.order_ref === refFilter);
          if (statusFilter) matches = matches.filter(o => statusFilter.includes(/** @type {string} */ (o.payment_status)));

          // Apply patch only to matching orders.
          for (const o of matches) {
            orderPatches.set(/** @type {string} */ (o.order_ref), {
              ...(orderPatches.get(/** @type {string} */ (o.order_ref)) || {}),
              ...patch,
            });
          }

          // Build response: return updated rows if `select` requested, else empty.
          let responseRows;
          if (selectCols) {
            const cols = selectCols.split(",").map(s => s.trim()).filter(Boolean);
            responseRows = matches.map(o => {
              const updated = { ...o, ...(orderPatches.get(/** @type {string} */ (o.order_ref)) || {}) };
              return Object.fromEntries(cols.map(col => [col, updated[col]]));
            });
          } else {
            responseRows = [];
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(responseRows));
        } catch {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(EMPTY_JSON);
        }
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

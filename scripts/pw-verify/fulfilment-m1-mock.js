// @ts-check
/**
 * Read-only synthetic Supabase server for the Admin Fulfilment M1 browser checks.
 *
 * Serves GET /rest/v1/orders with clearly synthetic orders whose created_at
 * values are relative to the time each request arrives, so reminder stages are
 * deterministic. Every non-GET request is refused (405) and counted, which
 * proves the dashboard never writes. Never connects to any external service.
 *
 * Control endpoints (test-only):
 *   GET /mock/counts            → { get, nonGet }
 *   GET /mock/mode/<normal|empty|error>
 */

const http = require("http");

const PORT = Number(process.env.FULFILMENT_MOCK_PORT || 54399);
const HOUR = 60 * 60 * 1000;

let mode = "normal";
let getCount = 0;
let nonGetCount = 0;

/** @param {number} h */
const ago = (h) => new Date(Date.now() - h * HOUR).toISOString();

const history = (note = "Order placed via website") => [{ status: "awaiting_payment", changed_at: ago(1), note }];

/** @returns {Record<string, unknown>[]} */
function orders() {
  return [
    { order_ref: "MSR-M1TEST-0001", customer_name: "Synthetic Fresh",    phone: "0820000101", province: "Gauteng",             total: 430,  payment_status: "awaiting_payment",  status_history: history(), created_at: ago(1) },
    { order_ref: "MSR-M1TEST-0023", customer_name: "Synthetic TwentyThree", phone: "0820000123", province: "Cape Town Metro",  total: 350,  payment_status: "awaiting_payment",  status_history: history(), created_at: ago(23.5) },
    { order_ref: "MSR-M1TEST-0024", customer_name: "Synthetic Friendly", phone: "082 000 0124", province: "Gauteng",             total: 2180, payment_status: "awaiting_payment",  status_history: history(), created_at: ago(24.5) },
    { order_ref: "MSR-M1TEST-0047", customer_name: "Synthetic FortySeven", phone: "+27 72 000 0147", province: "KwaZulu-Natal", total: 650, payment_status: "awaiting_payment",  status_history: history(), created_at: ago(47.5) },
    { order_ref: "MSR-M1TEST-0048", customer_name: "Synthetic Final",    phone: "0720000148", province: "Collection / Pickup", total: 250,  payment_status: "awaiting_payment",  status_history: history(), created_at: ago(48.5) },
    { order_ref: "MSR-M1TEST-0071", customer_name: "Synthetic SeventyOne", phone: "0610000171", province: "Outlying Areas",   total: 550,  payment_status: "awaiting_payment",  status_history: history(), created_at: ago(71.5) },
    { order_ref: "MSR-M1TEST-0072", customer_name: "Synthetic Review",   phone: "0820000172", province: "Gauteng",             total: 1848, payment_status: "awaiting_payment",  status_history: history(), created_at: ago(72.5) },
    { order_ref: "MSR-M1TEST-0120", customer_name: "Synthetic Long Overdue With A Very Long Customer Name For Wrapping", phone: "0820000120", province: "Western Cape Regional", total: 2250, payment_status: "awaiting_payment", status_history: history(), created_at: ago(120) },
    { order_ref: "MSR-M1TEST-LAND", customer_name: "Synthetic Landline", phone: "0211234567", province: "Cape Town Metro",     total: 350,  payment_status: "awaiting_payment",  status_history: history(), created_at: ago(30) },
    { order_ref: "MSR-M1TEST-NOPH", customer_name: "Synthetic NoPhone",  phone: "",           province: "Gauteng",             total: 430,  payment_status: "awaiting_payment",  status_history: history(), created_at: ago(50) },
    { order_ref: "MSR-M1TEST-NODT", customer_name: "Synthetic NoDate",   phone: "0820000199", province: "Gauteng",             total: 430,  payment_status: "awaiting_payment",  status_history: history(), created_at: null },
    { order_ref: "MSR-M1TEST-ITN1", customer_name: "Synthetic Itn",      phone: "0820000201", province: "Gauteng",             total: 430,  payment_status: "payment_confirmed", status_history: [...history(), { status: "payment_confirmed", changed_at: ago(2), note: "PayFast ITN: COMPLETE" }], created_at: ago(5) },
    { order_ref: "MSR-M1TEST-PAID", customer_name: "Synthetic Paid",     phone: "0820000202", province: "Gauteng",             total: 430,  payment_status: "payment_confirmed", status_history: [...history(), { status: "payment_confirmed", changed_at: ago(2), note: "EFT confirmed by team" }], created_at: ago(80) },
    { order_ref: "MSR-M1TEST-PROC", customer_name: "Synthetic Processing", phone: "0820000203", province: "Gauteng",           total: 430,  payment_status: "processing",        status_history: history(), created_at: ago(90) },
    { order_ref: "MSR-M1TEST-DISP", customer_name: "Synthetic Dispatched", phone: "0820000204", province: "Gauteng",           total: 430,  payment_status: "dispatched",        status_history: history(), created_at: ago(100) },
    { order_ref: "MSR-M1TEST-DELV", customer_name: "Synthetic Delivered", phone: "0820000205", province: "Gauteng",            total: 430,  payment_status: "delivered",         status_history: history(), created_at: ago(110) },
    { order_ref: "MSR-M1TEST-CANC", customer_name: "Synthetic Cancelled", phone: "0820000206", province: "Gauteng",            total: 430,  payment_status: "cancelled",         status_history: history(), created_at: ago(130) },
  ].sort((a, b) => String(b.created_at ?? "").localeCompare(String(a.created_at ?? "")));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
  const json = (status, body) => { res.writeHead(status, { "Content-Type": "application/json" }); res.end(JSON.stringify(body)); };

  if (url.pathname === "/mock/counts") return json(200, { get: getCount, nonGet: nonGetCount });
  const m = url.pathname.match(/^\/mock\/mode\/(normal|empty|error)$/);
  if (m) { mode = m[1]; return json(200, { mode }); }

  if (req.method !== "GET" && req.method !== "HEAD") { nonGetCount++; return json(405, { message: "read-only mock" }); }

  if (url.pathname === "/rest/v1/orders") {
    getCount++;
    if (mode === "error") return json(500, { message: "synthetic failure", code: "XX000" });
    return json(200, mode === "empty" ? [] : orders());
  }
  return json(200, []);
});

server.listen(PORT, "127.0.0.1", () => console.log(`[fulfilment-m1-mock] listening on 127.0.0.1:${PORT}`));

// @ts-check
/**
 * Counting stand-in for Supabase REST, used by admin-auth-runtime.js.
 *
 * Every request except the control endpoint is counted and answered with an
 * empty JSON array, so an admin page that reaches the database is observable.
 * Listens on loopback only and never contacts any external service.
 *
 *   GET /__count → { total, byPath }
 *
 * Usage: node scripts/pw-verify/admin-auth-mock.js [port]   (default 54399)
 */

const http = require("http");

const PORT = Number(process.argv[2] || process.env.ADMIN_AUTH_MOCK_PORT || 54399);

let total = 0;
/** @type {Record<string, number>} */
const byPath = {};

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url || "/", `http://127.0.0.1:${PORT}`).pathname;
  res.setHeader("Content-Type", "application/json");
  if (pathname === "/__count") return res.end(JSON.stringify({ total, byPath }));
  total++;
  const key = `${req.method} ${pathname}`;
  byPath[key] = (byPath[key] || 0) + 1;
  res.end("[]");
});

server.listen(PORT, "127.0.0.1", () => console.log(`[admin-auth-mock] listening on 127.0.0.1:${PORT}`));

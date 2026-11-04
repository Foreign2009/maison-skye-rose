/**
 * UI-1 — FloatingAssist is not rendered on admin routes.
 *
 *   G   isAdminPath: /admin, /admin/ and nested admin routes match; storefront
 *       routes and look-alikes such as /administration do not; null/empty safe
 *   H   hook order: usePathname and every other hook run before any early return,
 *       and the admin return precedes all rendered controls
 *
 * Browser behaviour (absence on admin pages, presence and behaviour on the
 * storefront, navigation transitions) is covered by
 * scripts/pw-verify/specs/ui1-floating-assist.spec.js.
 *
 * Run: npx tsx scripts/factory/__tests__/floating-assist-ui1.test.ts
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { isAdminPath } from "../../../app/components/FloatingAssist";

const ROOT = path.resolve(__dirname, "../../..");
let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓  ${name}`); passed++; }
  catch (e) { console.log(`  ✗  ${name}\n     ${e instanceof Error ? e.message : String(e)}`); failed++; }
}

console.log("\nG. isAdminPath");

const ADMIN = [
  "/admin", "/admin/", "/admin/fulfilment", "/admin/operations", "/admin/briefing",
  "/admin/identity", "/admin/identity/MIP-000005", "/admin/identity/relationships/REL-x--y",
];
const NOT_ADMIN = [
  "/", "/shop", "/collections/skye", "/collections/rose", "/academy", "/product/some-slug",
  "/administration", "/admins", "/admin-tools", "/adminfulfilment", "/shop/admin", "/collections/admin",
  "admin", "/Admin", "",
];

for (const p of ADMIN) test(`G "${p}" is an admin route`, () => assert.equal(isAdminPath(p), true));
for (const p of NOT_ADMIN) test(`G "${p}" is not an admin route`, () => assert.equal(isAdminPath(p), false));
test("G null and undefined pathnames are treated as storefront (controls kept)", () => {
  assert.equal(isAdminPath(null), false);
  assert.equal(isAdminPath(undefined), false);
});

console.log("\nH. Hook order and render guard (source)");

const src = readFileSync(path.join(ROOT, "app/components/FloatingAssist.tsx"), "utf8").replace(/\r\n/g, "\n");
const body = src.slice(src.indexOf("export default function FloatingAssist()"));

test("H1 usePathname comes from next/navigation and is called unconditionally first", () => {
  assert.match(src, /import \{ usePathname \} from "next\/navigation";/);
  assert.match(body, /^export default function FloatingAssist\(\) \{\n  const isAdmin = isAdminPath\(usePathname\(\)\);/);
});
test("H2 every hook call precedes the first early return", () => {
  const firstReturn = body.indexOf("return null;");
  assert.ok(firstReturn > 0);
  const hookCalls = [...body.matchAll(/\buse[A-Z][A-Za-z]*\(/g)].map((m) => m.index ?? 0);
  assert.ok(hookCalls.length >= 10, `found ${hookCalls.length} hook calls`);
  for (const i of hookCalls) assert.ok(i < firstReturn, `hook at ${i} after early return at ${firstReturn}`);
});
test("H3 admin routes return null before any control is rendered (absent, not hidden)", () => {
  const adminReturn = body.indexOf("if (isAdmin) return null;");
  assert.ok(adminReturn > 0, "admin guard missing");
  for (const marker of ["Ask Maison", "Chat with us on WhatsApp", "Get assistance"]) {
    assert.ok(body.indexOf(marker) > adminReturn, `${marker} rendered before the admin guard`);
  }
});
test("H4 the expanded mobile menu collapses on entering the admin console", () => {
  assert.match(body, /if \(isAdmin \|\| conciergeOpen \|\| cartOpen/);
  assert.match(body, /\}, \[isAdmin, conciergeOpen, cartOpen,/);
});

console.log(`\n${passed} passed, ${failed} failed (${passed + failed} checks)`);
if (failed > 0) process.exit(1);

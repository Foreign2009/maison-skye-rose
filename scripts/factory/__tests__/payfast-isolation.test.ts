/**
 * G12-S2 — static isolation check for the disabled PayFast routes.
 *
 * Both handlers must be fixed responses: they may import only next/server, export only a
 * no-argument POST, return 410 with the generic message, and must not read the request,
 * environment variables, payment credentials or order data, build signatures, or make
 * outbound requests.
 *
 * Run: npx tsx scripts/factory/__tests__/payfast-isolation.test.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "../../..");
const ROUTES = ["app/api/payfast/route.ts", "app/api/payfast/itn/route.ts"];

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓  ${name}`); passed++; }
  catch (e: any) { console.log(`  ✗  ${name}\n     ${e.message}`); failed++; }
}

for (const rel of ROUTES) {
  const src = readFileSync(path.join(ROOT, rel), "utf8");
  const code = src.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, ""); // ignore comments

  test(`${rel}: imports only next/server`, () => {
    const imports = [...code.matchAll(/import[\s\S]*?from\s+["']([^"']+)["']/g)].map((m) => m[1]);
    assert.deepEqual(imports, ["next/server"]);
    assert.doesNotMatch(code, /\bimport\s*\(|\brequire\s*\(/, "dynamic import or require");
  });
  test(`${rel}: exports only a POST handler that takes no request`, () => {
    const exportsFound = [...code.matchAll(/export\s+(?:async\s+)?(?:function|const|let|var|class)\s+(\w+)/g)].map((m) => m[1]);
    assert.deepEqual(exportsFound, ["POST"]);
    assert.match(code, /export\s+function\s+POST\s*\(\s*\)/);
    assert.doesNotMatch(code, /export\s+default|export\s*\{|export\s*\*/, "other export forms");
  });
  test(`${rel}: returns 410 with a generic message`, () => {
    assert.match(code, /status:\s*410/);
    assert.match(code, /Online payment processing is unavailable\./);
  });
  test(`${rel}: no environment, credentials, data access, signatures or outbound calls`, () => {
    for (const banned of [/process\.env/, /supabase/i, /createHash|md5|node:crypto/i, /\bfetch\s*\(/, /node:https?|child_process/, /request\.(json|text|formData|body)/, /merchant|passphrase|signature|paymentUrl|payfast\.co\.za/i, /orderStatus|payment_status|\.from\(|\.update\(|\.insert\(/])
      assert.doesNotMatch(code, banned, `${rel} contains ${banned}`);
  });
}

console.log(`\n${passed + failed} checks  |  ${passed} passed  |  ${failed} failed`);
process.exit(failed ? 1 : 0);

/**
 * Maison Knowledge Catalogue — Native Record Validation Runner
 *
 * Validates all records registered in the native catalogue against the
 * MKC quality gate. Exits with code 1 if any record fails.
 *
 * Usage: npx tsx validate-native-records.ts
 */

import { nativeFragrances } from "./app/lib/mkc/native/index";
import { validateKnowledgeRecord } from "./app/lib/mkc/validator";
import type { ValidationResult, ValidationGroup } from "./app/lib/mkc/validator";

// ── Formatting ────────────────────────────────────────────────────────────────

const DIVIDER = "─".repeat(60);

const STATUS_ICON: Record<string, string> = {
  PASS:               "✓",
  PASS_WITH_WARNINGS: "⚠",
  FAIL:               "✗",
};

function formatGroup(group: ValidationGroup, result: ValidationResult): string {
  const g = result.groups[group];
  const icon = STATUS_ICON[g.status] ?? "?";
  const label = group.padEnd(16);
  const lines = [`  ${icon}  ${label} ${g.status}`];

  for (const issue of g.issues) {
    const prefix = issue.severity === "error" ? "     ✗ ERROR" : "     ⚠ WARN ";
    lines.push(`${prefix}  [${issue.code}] ${issue.field}: ${issue.message}`);
  }

  return lines.join("\n");
}

function formatResult(result: ValidationResult): void {
  console.log(`\n${DIVIDER}`);
  console.log(`${STATUS_ICON[result.status]}  ${result.name}  (${result.slug})`);
  console.log(
    `   Status: ${result.status}` +
    `  |  Errors: ${result.totalErrors}` +
    `  |  Warnings: ${result.totalWarnings}`
  );
  console.log("");

  const groupOrder: ValidationGroup[] = [
    "identity", "classification", "composition", "editorial",
    "discovery", "intelligence", "commerce",
  ];

  for (const group of groupOrder) {
    console.log(formatGroup(group, result));
  }
}

// ── Runner ────────────────────────────────────────────────────────────────────

const records = [...nativeFragrances.values()];

console.log(`\n${"═".repeat(60)}`);
console.log("Maison Knowledge Catalogue — Native Record Validation");
console.log(`Records: ${records.length}`);
console.log("═".repeat(60));

const results: ValidationResult[] = records.map(validateKnowledgeRecord);

for (const result of results) {
  formatResult(result);
}

const passed           = results.filter((r) => r.status === "PASS").length;
const passedWithWarns  = results.filter((r) => r.status === "PASS_WITH_WARNINGS").length;
const failed           = results.filter((r) => r.status === "FAIL").length;

console.log(`\n${DIVIDER}`);
console.log(
  `✓ PASS: ${passed}` +
  `  ⚠ PASS_WITH_WARNINGS: ${passedWithWarns}` +
  `  ✗ FAIL: ${failed}`
);
console.log(DIVIDER);

if (failed > 0) {
  process.exit(1);
}

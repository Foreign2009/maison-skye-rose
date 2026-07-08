/**
 * Maison Knowledge Catalogue — Scaffold Generator
 *
 * Creates a new native FragranceKnowledge record from the canonical template,
 * registers it in the native catalogue, and runs the validator.
 *
 * Usage: npm run mkc:new -- "Fragrance Name"
 *
 * Example:
 *   npm run mkc:new -- "Layton Inspired"
 *   → Creates app/lib/mkc/native/layton-inspired.ts
 *   → Registers laytonInspired in app/lib/mkc/native/index.ts
 *   → Runs npm run mkc:validate
 */

import { writeFileSync, existsSync, readFileSync } from "fs";
import { execSync } from "child_process";
import path from "path";

// ── Arguments ─────────────────────────────────────────────────────────────────

const name = process.argv[2]?.trim();

if (!name) {
  console.error('\nUsage: npm run mkc:new -- "Fragrance Name"\n');
  process.exit(1);
}

// ── Derive identifiers ────────────────────────────────────────────────────────

const slug      = name.toLowerCase().replace(/\s+/g, "-");
const constName = slug.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());

// ── Resolve paths ─────────────────────────────────────────────────────────────

const ROOT         = process.cwd();
const recordPath   = path.join(ROOT, "app", "lib", "mkc", "native", `${slug}.ts`);
const indexPath    = path.join(ROOT, "app", "lib", "mkc", "native", "index.ts");
const templatePath = path.join(ROOT, "app", "lib", "mkc", "templates", "fragrance-template.ts");

// ── Guards ────────────────────────────────────────────────────────────────────

if (!existsSync(templatePath)) {
  console.error(`\n✗  Template not found at:\n   ${templatePath}\n`);
  process.exit(1);
}

if (existsSync(recordPath)) {
  console.error(`\n✗  Record already exists: app/lib/mkc/native/${slug}.ts\n`);
  process.exit(1);
}

// ── Generate record from template ─────────────────────────────────────────────

const template = readFileSync(templatePath, "utf-8");

const record = template
  // Replace the template's doc comment block with a per-record header
  .replace(/\/\*\*[\s\S]*?\*\//, `// Maison Knowledge Catalogue — ${name}\n// Run: npm run mkc:validate before committing`)
  // Replace markers
  .replace(/TEMPLATE_CONST/g, constName)
  .replace(/TEMPLATE_SLUG/g,  slug)
  .replace(/TEMPLATE_NAME/g,  name);

writeFileSync(recordPath, record, "utf-8");
console.log(`\n✓  Created   app/lib/mkc/native/${slug}.ts`);

// ── Update native registry ────────────────────────────────────────────────────

const lines = readFileSync(indexPath, "utf-8").split("\n");

// Insert import after the last `import` line
let lastImportIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith("import ")) lastImportIdx = i;
}

if (lastImportIdx < 0) {
  console.error("✗  Could not find import block in native/index.ts — add the import manually");
} else {
  lines.splice(lastImportIdx + 1, 0, `import { ${constName} } from "./${slug}";`);

  // Insert Map entry before the closing `]);`
  const closingIdx = lines.findIndex((l) => l.trim() === "]);");
  if (closingIdx < 0) {
    console.error("✗  Could not find `]);` in native/index.ts — add the Map entry manually");
  } else {
    lines.splice(closingIdx, 0, `  ["${slug}", ${constName}],`);
    writeFileSync(indexPath, lines.join("\n"), "utf-8");
    console.log(`✓  Registered ${constName} in native/index.ts`);
  }
}

// ── Run validator ─────────────────────────────────────────────────────────────

console.log("\nRunning validation...\n");

try {
  execSync("npx tsx validate-native-records.ts", { stdio: "inherit", cwd: ROOT });
} catch {
  // Validation failure is expected for a fresh scaffold.
  // The report above shows exactly which fields the author must complete.
}

// ── Next steps ────────────────────────────────────────────────────────────────

const SEP = "─".repeat(60);
console.log(`\n${SEP}`);
console.log("Next steps:");
console.log(`  1. Open  app/lib/mkc/native/${slug}.ts`);
console.log("  2. Fill in every field  (docs/mkc-authoring-guide.md)");
console.log("  3. Run   npm run mkc:validate");
console.log("  4. Fix any errors until the record achieves PASS");
console.log("  5. Commit the record and the updated native/index.ts");
console.log(`${SEP}\n`);

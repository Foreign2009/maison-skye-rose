/**
 * Knowledge Factory — Prompt Registry
 *
 * Lazy-cached prompt loader. Supports two storage layouts:
 *   Flat:      {promptsDir}/{name}.v{version}.txt
 *   Directory: {promptsDir}/{name}/v{version}.md
 *
 * Producers call load(name, version) and receive the full prompt content.
 * Files are read once per session and cached in memory.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import type { PromptVersion } from "./types";

export class PromptRegistry {
  private readonly cache = new Map<string, PromptVersion>();

  constructor(private readonly promptDir: string) {}

  load(name: string, version: string): PromptVersion {
    const key    = `${name}@${version}`;
    const cached = this.cache.get(key);
    if (cached) return cached;

    const filePath = this.resolve(name, version);
    if (!filePath) {
      throw new Error(
        `Prompt not found: ${name} v${version}. ` +
        `Expected "${name}.v${version}.txt" or "${name}/v${version}.md" ` +
        `in scripts/factory/prompts/`,
      );
    }

    const prompt: PromptVersion = {
      name,
      version,
      content:    readFileSync(filePath, "utf-8"),
      loadedFrom: filePath,
      loadedAt:   new Date(),
    };

    this.cache.set(key, prompt);
    return prompt;
  }

  loadLatest(name: string): PromptVersion {
    const all = this.listAvailable().filter(p => p.name === name);
    if (all.length === 0) throw new Error(`No prompts found for producer: ${name}`);
    all.sort((a, b) => compareSemver(b.version, a.version));
    return all[0];
  }

  listAvailable(): PromptVersion[] {
    if (!existsSync(this.promptDir)) return [];
    const result: PromptVersion[] = [];

    for (const entry of readdirSync(this.promptDir)) {
      const entryPath = path.join(this.promptDir, entry);

      // Flat format: {name}.v{version}.txt
      const flat = entry.match(/^(.+)\.v(\d+\.\d+\.\d+)\.txt$/);
      if (flat) {
        try { result.push(this.load(flat[1], flat[2])); } catch { /* skip */ }
        continue;
      }

      // Directory format: {name}/v{version}.md
      try {
        if (!statSync(entryPath).isDirectory()) continue;
        for (const f of readdirSync(entryPath)) {
          const dir = f.match(/^v(\d+\.\d+\.\d+)\.md$/);
          if (dir) {
            try { result.push(this.load(entry, dir[1])); } catch { /* skip */ }
          }
        }
      } catch { /* skip */ }
    }

    return result;
  }

  private resolve(name: string, version: string): string | null {
    const flat = path.join(this.promptDir, `${name}.v${version}.txt`);
    if (existsSync(flat)) return flat;

    const dir = path.join(this.promptDir, name, `v${version}.md`);
    if (existsSync(dir)) return dir;

    return null;
  }
}

function compareSemver(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
  }
  return 0;
}

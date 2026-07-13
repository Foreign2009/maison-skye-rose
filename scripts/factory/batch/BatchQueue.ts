/**
 * Knowledge Factory — Batch Queue
 *
 * Builds the ordered work list from the supplier catalogue and applies
 * collection filter, skip logic (native + drafted), resume state, and limit.
 *
 * Workers call next() concurrently; the shared pointer is advanced atomically
 * (safe in Node.js's single-threaded event loop).
 */

import { existsSync }         from "fs";
import path                   from "path";
import { fragrances }         from "../../../app/data/fragrances";
import { nativeFragrances }   from "../../../app/lib/mkc/native/index";
import { deriveSlug }         from "../intake";
import type { BatchConfig }   from "./BatchConfig";

const DRAFT_DIR = path.join(process.cwd(), "scripts", "factory", "drafts");

export interface QueueEntry {
  slug:       string;
  name:       string;
  collection: "Skye" | "Rose" | "Elite";
}

export class BatchQueue {
  private readonly items: QueueEntry[];
  private pointer = 0;

  private constructor(items: QueueEntry[]) {
    this.items = items;
  }

  static build(config: BatchConfig, skipSlugs: Set<string> = new Set()): BatchQueue {
    const catalogue = fragrances as Array<{ title: string; collection: string }>;

    // Build initial pool
    let pool: QueueEntry[];

    if (config.slugs && config.slugs.length > 0) {
      pool = config.slugs.map(slug => {
        const match = catalogue.find(f => deriveSlug(f.title) === slug);
        return {
          slug,
          name:       match?.title ?? slug,
          collection: (match?.collection ?? "Skye") as "Skye" | "Rose" | "Elite",
        };
      });
    } else {
      pool = catalogue.map(f => ({
        slug:       deriveSlug(f.title),
        name:       f.title,
        collection: f.collection as "Skye" | "Rose" | "Elite",
      }));
    }

    // Filter by collection
    if (config.collection) {
      pool = pool.filter(e => e.collection === config.collection);
    }

    // Skip already-native and already-drafted (unless force)
    if (config.skipExisting && !config.force) {
      pool = pool.filter(e => {
        if (nativeFragrances.has(e.slug)) return false;
        if (existsSync(path.join(DRAFT_DIR, `${e.slug}.ts`))) return false;
        return true;
      });
    }

    // Skip resume-completed slugs
    if (skipSlugs.size > 0) {
      pool = pool.filter(e => !skipSlugs.has(e.slug));
    }

    // Apply limit
    if (config.limit !== undefined && config.limit > 0) {
      pool = pool.slice(0, config.limit);
    }

    return new BatchQueue(pool);
  }

  next(): QueueEntry | undefined {
    if (this.pointer >= this.items.length) return undefined;
    return this.items[this.pointer++];
  }

  hasMore(): boolean {
    return this.pointer < this.items.length;
  }

  size(): number {
    return this.items.length;
  }

  remaining(): number {
    return this.items.length - this.pointer;
  }

  all(): readonly QueueEntry[] {
    return this.items;
  }
}

/**
 * Maison Knowledge Catalogue — Native Record Registry
 *
 * Native records are authored FragranceKnowledge entries that take precedence
 * over the hydrateFromDisplay() adapter fallback in catalogue.ts. Add records
 * here as each fragrance is migrated to the native format.
 *
 * Keys are slugs matching the id formula in adaptFragrance():
 *   title.toLowerCase().replace(/\s+/g, "-")
 *
 * Example: "Sauvage Inspired" → "sauvage-inspired"
 */

import type { FragranceKnowledge } from "../types";

export const nativeFragrances = new Map<string, FragranceKnowledge>();

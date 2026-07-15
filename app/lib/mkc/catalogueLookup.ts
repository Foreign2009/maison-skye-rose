/**
 * MKC Catalogue — Shared Lookup Maps
 *
 * Precomputed lookup maps over mkcCatalogue.
 * Built once at module level; import from here instead of constructing
 * per-component or per-module maps that would duplicate this work.
 *
 * mkcNameToSlug — FragranceName → slug (canonical string identifier)
 *   Use for resolving display names (from FavoritesContext, localStorage,
 *   quiz results) to the slug expected by all platform APIs.
 *
 * Integration points:
 *   quiz/page.tsx         — resolve quiz result titles to slugs for lastQuizSlugs
 *   MiniCart (future)     — resolve saved/viewed titles to slugs for RE
 */

import { mkcCatalogue } from "./catalogue";

export const mkcNameToSlug = new Map<string, string>(
  mkcCatalogue.map((k) => [k.name, k.slug]),
);

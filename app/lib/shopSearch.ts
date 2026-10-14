/**
 * Shop search — chooses which products the shop grid shows for a search query.
 *
 *   Mode 0 — empty query: full catalogue in catalogue order.
 *   Mode 1 — intent: the query carries scent preferences ("something sexy for an evening",
 *            "vanilla fragrances for men"); results come from the recommendation engine.
 *   Mode 2 — keyword: fragrances the query names first, then the substring search over name,
 *            subtitle, mood, profile and notes.
 *
 * A query that names catalogue fragrances is a keyword search, even when its words are also
 * scent vocabulary: "212 Sexy Men" names a product rather than asking for sexy men's
 * fragrances, and "Euphoria Men" names a product rather than asking for men's fragrances.
 * Mode 2 keeps the recommendation chips and confidence label off name searches. Names inside
 * a longer request ("212 Sexy for men", "Find Burberry Body") are recognised with the
 * Concierge's resolver; preference requests that name nothing stay with Mode 1.
 */

import { parseIntent, type IntentSignals } from "./intentParser";
import { catalogueMaps } from "./discovery";
import { recommendFragrances } from "./recommendFragrances";
import { fragrancesNamedIn } from "./concierge/intentResolver";
import type { DisplayFragrance } from "./knowledgeAdapter";

export interface ShopQuery {
  mode:        0 | 1 | 2;
  signals:     IntentSignals | null;
  nameMatches: DisplayFragrance[] | null;
}

// Lower-case word tokens with accents and apostrophes removed, so "Rosé", "Man's" and
// "Rose N' Roses" compare the same on the query and catalogue sides.
function tokens(s: string): string[] {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['‘’ʼ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

// Catalogue names end in "Inspired"; guests may or may not type it.
function nameTokens(s: string): string[] {
  const t = tokens(s);
  return t[t.length - 1] === "inspired" ? t.slice(0, -1) : t;
}

const CATALOGUE_NAMES = catalogueMaps.display.map((item) => ({ item, tokens: nameTokens(item.title) }));

const hasSignals = (signals: IntentSignals): boolean => Object.values(signals).some((v) => v !== undefined);

// Words that carry no product identity on their own: "for her" is a preference even though
// "Narciso Rodriguez for Her" contains it.
const FUNCTION_WORDS = new Set(["a", "an", "and", "the", "of", "for", "with", "in", "to", "my", "me", "her", "him", "them", "something", "some"]);

// True when the word identifies a product rather than describing a preference.
const isNameWord = (t: string): boolean => !FUNCTION_WORDS.has(t) && !hasSignals(parseIntent(t));

// Index where `needle` occurs in `hay` as a run of whole tokens, or -1. Whole tokens keep
// short names from matching inside other words ("ani" never matches "vanilla").
function tokenRunIndex(hay: string[], needle: string[]): number {
  for (let i = 0; i + needle.length <= hay.length; i++) {
    if (needle.every((t, j) => hay[i + j] === t)) return i;
  }
  return -1;
}

// Products whose name contains every word of `q`, in order, as whole words ("212 VIP" →
// 212 VIP Black, 212 VIP Rose, 212 VIP Men). Exact names come first, then names that begin
// with `q`, then the rest, each in catalogue order. Words made only of scent vocabulary and
// function words ("sexy men", "for her", "vanilla") count only as a complete product name
// ("Cloud", "Dark Vanilla").
function namesContaining(q: string[]): DisplayFragrance[] {
  const hits = CATALOGUE_NAMES
    .map(({ item, tokens: t }) => ({ item, at: tokenRunIndex(t, q), exact: t.length === q.length }))
    .filter((h) => h.at >= 0);
  if (hits.length === 0) return [];
  if (!q.some(isNameWord) && !hits.some((h) => h.exact)) return [];

  const rank = (h: (typeof hits)[number]) => (h.exact ? 0 : h.at === 0 ? 1 : 2);
  return hits
    .map((h, i) => ({ ...h, i }))
    .sort((a, b) => rank(a) - rank(b) || a.i - b.i)
    .map((h) => h.item);
}

const DISPLAY_BY_SLUG = new Map(
  [...catalogueMaps.byName].map(([name, k]) => [k.slug, catalogueMaps.displayByName.get(name)] as const),
);

// Names inside a longer request ("212 Sexy for men", "Find Burberry Body", "Tell me about
// 212 Sexy"), recognised by the Concierge's resolver: whole names only, flanker protection,
// and the gender-qualified 212 aliases. Inside a request, a name made only of scent
// vocabulary ("a cloud-like scent", "a dark vanilla for men") describes a preference, so
// the name must share an identifying word with the query.
function namesRequestedIn(query: string): DisplayFragrance[] {
  const q = new Set(nameTokens(query));
  return fragrancesNamedIn(query)
    .map((slug) => DISPLAY_BY_SLUG.get(slug))
    .filter((d): d is DisplayFragrance => !!d && nameTokens(d.title).some((t) => q.has(t) && isNameWord(t)));
}

/**
 * Catalogue fragrances the query names: the query itself as a name or part of one, or else
 * names the query mentions within a longer request.
 */
export function findNamedFragrances(query: string): DisplayFragrance[] {
  const q = nameTokens(query);
  if (q.length === 0) return [];
  const direct = namesContaining(q);
  return direct.length > 0 ? direct : namesRequestedIn(query);
}

// A name followed by words no product carries — usually the designer ("212 VIP Carolina
// Herrera", "Good Girl Carolina Herrera") — finds the products named by its longest leading
// words; every matching variant is listed, so no single identity is guessed.
function leadingNameMatches(query: string): DisplayFragrance[] {
  const q = nameTokens(query);
  for (let k = q.length - 1; k > 0; k--) {
    const hits = namesContaining(q.slice(0, k));
    if (hits.length > 0) return hits;
  }
  return [];
}

export function resolveShopQuery(query: string): ShopQuery {
  if (!query.trim()) return { mode: 0, signals: null, nameMatches: null };
  const named = findNamedFragrances(query);
  const signals = parseIntent(query.toLowerCase());
  if (named.length > 0) return { mode: 2, signals: null, nameMatches: named };
  if (hasSignals(signals)) return { mode: 1, signals, nameMatches: null };
  return { mode: 2, signals: null, nameMatches: leadingNameMatches(query) };
}

export function matchesShopTab(item: DisplayFragrance, tab: string): boolean {
  if (tab === "All") return true;
  if (tab === "Skye" || tab === "Rose" || tab === "Elite") return item.collection === tab;
  if (tab === "Best Sellers") return item.bestSeller;
  if (tab === "New Arrivals") return item.newArrival;
  return true;
}

// Products for the grid before dimension filters and sorting, restricted to the active tab.
export function shopSearchResults(query: string, resolved: ShopQuery, tab: string): DisplayFragrance[] {
  const inTab = (item: DisplayFragrance) => matchesShopTab(item, tab);

  if (resolved.mode === 0) return catalogueMaps.display.filter(inTab);

  if (resolved.signals) {
    const results = recommendFragrances(catalogueMaps.adapted, resolved.signals);
    const seen = new Set<string>();
    const ranked: DisplayFragrance[] = [];
    for (const f of [results.bestMatch, ...results.similarMatches, results.luxuryUpgrade, results.hiddenGem]) {
      if (!f || seen.has(f.name)) continue;
      const display = catalogueMaps.displayByName.get(f.name);
      if (!display) continue;
      if (!inTab(display)) continue;
      seen.add(f.name);
      ranked.push(display);
    }
    return ranked;
  }

  // Keyword: named fragrances first, then the remaining substring matches in catalogue order.
  const named = resolved.nameMatches ?? [];
  const searchTerm = query.toLowerCase();
  const keyword = catalogueMaps.display.filter((item) => {
    if (named.includes(item)) return false;
    return (
      item.title.toLowerCase().includes(searchTerm) ||
      item.subtitle?.toLowerCase().includes(searchTerm) ||
      item.mood?.toLowerCase().includes(searchTerm) ||
      item.profile?.toLowerCase().includes(searchTerm) ||
      item.notes?.some((note: string) => note.toLowerCase().includes(searchTerm))
    );
  });
  return [...named, ...keyword].filter(inTab);
}

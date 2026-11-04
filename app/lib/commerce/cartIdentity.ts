import { mkcCatalogue } from "../mkc/catalogue";
import { deriveSlug } from "../mkc/deriveSlug";

/**
 * Canonical cart identity.
 *
 * Cart item IDs must be authoritative MKC catalogue slugs, because the server
 * resolves order items by slug. Display names are not a reliable source of
 * slugs: a governed slug exception (for example the Capri record) does not
 * equal deriveSlug(name). These helpers resolve exact catalogue names only,
 * fail closed on unknown or ambiguous identities, and repair only recognised
 * legacy cart IDs. They never change catalogue records or pricing.
 */

const CATALOGUE_SLUGS = new Set(mkcCatalogue.map((k) => k.slug));

// Exact name -> slug. null marks an ambiguous name (one name, several slugs).
const SLUG_BY_NAME = new Map<string, string | null>();
for (const k of mkcCatalogue) {
  const existing = SLUG_BY_NAME.get(k.name);
  SLUG_BY_NAME.set(k.name, existing === undefined || existing === k.slug ? k.slug : null);
}

/**
 * Authoritative slug for an exact catalogue name, or undefined when the name
 * is unknown or ambiguous. When a slug is supplied it must match the named
 * record; a mismatch also returns undefined.
 */
export function canonicalSlugForName(name: string, suppliedSlug?: string): string | undefined {
  const slug = SLUG_BY_NAME.get(name);
  if (!slug) return undefined;
  if (suppliedSlug !== undefined && suppliedSlug !== slug) return undefined;
  return slug;
}

/**
 * Legacy cart ID -> canonical slug, for IDs that older add-to-cart paths
 * derived from display names. An entry exists only when the derived ID differs
 * from the record's slug, is not itself a catalogue slug, is derived from
 * exactly one record, and the record's name is unambiguous.
 */
export const LEGACY_CART_ID_MAP: ReadonlyMap<string, string> = (() => {
  const derivedCount = new Map<string, number>();
  for (const k of mkcCatalogue) {
    const d = deriveSlug(k.name);
    derivedCount.set(d, (derivedCount.get(d) ?? 0) + 1);
  }
  const map = new Map<string, string>();
  for (const k of mkcCatalogue) {
    const d = deriveSlug(k.name);
    if (d === k.slug) continue;
    if (CATALOGUE_SLUGS.has(d)) continue;
    if (derivedCount.get(d) !== 1) continue;
    if (SLUG_BY_NAME.get(k.name) !== k.slug) continue;
    map.set(d, k.slug);
  }
  return map;
})();

type CartLineLike = { id: string; size: string; quantity: number };

// A line takes part in migration only if its ID and size are strings and its
// quantity is a safe positive integer. Any other line is malformed: it is kept
// exactly as stored, in place, and never merged or counted.
function isValidLine(item: unknown): item is CartLineLike {
  if (!item || typeof item !== "object") return false;
  const l = item as Record<string, unknown>;
  return typeof l.id === "string" && typeof l.size === "string" &&
    typeof l.quantity === "number" && Number.isSafeInteger(l.quantity) && l.quantity >= 1;
}

const lineKey = (id: string, size: string): string => JSON.stringify([id, size]);

/**
 * Repairs recognised legacy cart IDs in a restored cart.
 *
 * 1. A group is opened only for a valid line whose ID is an exact
 *    LEGACY_CART_ID_MAP key; the group key is (canonical slug, size).
 * 2. Every valid line in the cart whose canonical ID and size match an open
 *    group - legacy or already canonical - is a member of that group.
 * 3. Each group becomes one line at the position of its first member, with
 *    id = canonical slug and quantity = the sum of member quantities.
 *    Metadata precedence: the first canonical member in cart order; if the
 *    group has no canonical member, the first legacy member.
 * 4. If a group's total is not a safe integer, the whole group is left
 *    untouched (no rewrite, no merge).
 *
 * Lines outside the open groups - unrelated products, unrelated duplicates,
 * unknown and forged IDs, malformed lines - are returned unchanged and in
 * order. Different sizes never merge. Prices are not touched. Idempotent: a
 * migrated cart contains no valid legacy line, so a second run opens no group.
 */
export function migrateCartItems<T extends CartLineLike>(items: readonly T[]): T[] {
  const groups = new Map<string, { canonical: string; members: number[] }>();
  items.forEach((item) => {
    if (!isValidLine(item)) return;
    const canonical = LEGACY_CART_ID_MAP.get(item.id);
    if (canonical === undefined) return;
    const key = lineKey(canonical, item.size);
    if (!groups.has(key)) groups.set(key, { canonical, members: [] });
  });
  if (groups.size === 0) return items.slice();

  items.forEach((item, index) => {
    if (!isValidLine(item)) return;
    const group = groups.get(lineKey(LEGACY_CART_ID_MAP.get(item.id) ?? item.id, item.size));
    if (group) group.members.push(index);
  });

  const replacement = new Map<number, T>();
  const absorbed    = new Set<number>();
  for (const group of groups.values()) {
    const total = group.members.reduce((sum, i) => sum + items[i].quantity, 0);
    if (!Number.isSafeInteger(total)) continue;
    const source = group.members.find((i) => items[i].id === group.canonical) ?? group.members[0];
    replacement.set(group.members[0], { ...items[source], id: group.canonical, quantity: total });
    for (const i of group.members.slice(1)) absorbed.add(i);
  }

  const out: T[] = [];
  items.forEach((item, index) => {
    if (absorbed.has(index)) return;
    out.push(replacement.get(index) ?? item);
  });
  return out;
}

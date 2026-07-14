/**
 * Customer Intelligence — Customer Index
 *
 * In-memory O(1)-lookup index for collections of CIE read models.
 * createCustomerIndex() builds the index once from an array; subsequent
 * get() / has() calls are Map lookups.
 *
 * The values() snapshot is frozen at creation time — it does not reflect
 * items added after construction. Build a new index when the underlying
 * collection changes.
 *
 * Integration points:
 *   Any CIE read model that extends CustomerIndexEntry (has customerId: string)
 *   Experience surfaces that need O(1) lookup across a batch of read models
 */

export interface CustomerIndexEntry {
  readonly customerId: string;
}

export interface CustomerIndex<T extends CustomerIndexEntry> {
  get(customerId: string): T | undefined;
  has(customerId: string): boolean;
  values(): readonly T[];
  readonly size: number;
}

export function createCustomerIndex<T extends CustomerIndexEntry>(
  items: readonly T[],
): CustomerIndex<T> {
  const map    = new Map<string, T>(items.map((item) => [item.customerId, item]));
  const frozen = Object.freeze([...items]) as readonly T[];

  return {
    get:    (id)  => map.get(id),
    has:    (id)  => map.has(id),
    values: ()    => frozen,
    get size()    { return map.size; },
  };
}

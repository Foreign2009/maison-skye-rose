import { createHash } from "crypto";

// ── Key validation ────────────────────────────────────────────────────────────

const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type KeyValidationResult =
  | { valid: true;  key: string }
  | { valid: false; absent: true }
  | { valid: false; absent: false; reason: string };

/**
 * Validates an idempotency key from an untrusted request body.
 *
 * Three outcomes:
 *   absent   — field was not present; legacy-client path, no idempotency check.
 *   invalid  — field was present but malformed; caller must reject with 400.
 *   valid    — UUID v4 confirmed; caller must perform the deduplication lookup.
 */
export function validateIdempotencyKey(key: unknown): KeyValidationResult {
  if (key === undefined || key === null) {
    return { valid: false, absent: true };
  }
  if (typeof key !== "string") {
    return { valid: false, absent: false, reason: "Key must be a string." };
  }
  if (!UUID_V4_RE.test(key)) {
    return { valid: false, absent: false, reason: "Key must be a valid UUID v4." };
  }
  return { valid: true, key };
}

// ── Fingerprint ───────────────────────────────────────────────────────────────

export type FingerprintInputs = {
  customer_name: string;
  phone:         string;
  address:       string;
  province:      string;
  items:         Array<{ id: string; size: string; quantity: number }>;
};

/**
 * Extracts the fields required for fingerprinting from an unvalidated body.
 * Returns null if any required field is missing or structurally invalid.
 *
 * Deliberately does NOT perform price validation; caller must run full
 * validateOrderBody separately for new inserts.
 */
export function extractFingerprintInputs(
  body: Record<string, unknown>,
): FingerprintInputs | null {
  const customer_name =
    typeof body.customer_name === "string" ? body.customer_name : null;
  const phone    = typeof body.phone    === "string" ? body.phone    : null;
  const province = typeof body.province === "string" ? body.province : null;
  if (!customer_name || !phone || !province) return null;

  const address = typeof body.address === "string" ? body.address : "";

  if (!Array.isArray(body.items) || body.items.length === 0) return null;
  const items: FingerprintInputs["items"] = [];
  for (const raw of body.items as unknown[]) {
    if (!raw || typeof raw !== "object") return null;
    const i = raw as Record<string, unknown>;
    if (
      typeof i.id       !== "string" ||
      typeof i.size     !== "string" ||
      typeof i.quantity !== "number"
    ) return null;
    items.push({ id: i.id, size: i.size, quantity: i.quantity });
  }

  return { customer_name, phone, address, province, items };
}

/**
 * Computes a deterministic SHA-256 fingerprint of the customer's canonical
 * order intent.
 *
 * Covers: customer name, phone, delivery address, province, and item identity
 * (id, size, quantity — NOT prices).
 *
 * Excluding prices means:
 *   • A matching retry recovers the ORIGINAL saved order even if the catalogue
 *     has been repriced since the first attempt.
 *   • New orders still use server-authoritative price validation.
 *   • If a product is retired, validateOrderBody rejects the retry at 400
 *     BEFORE the idempotency check — recovery is not possible for retired
 *     products on a first-ever attempt, only for already-committed orders.
 *
 * Items are merged by id+size to handle KI-04 duplicate line items (different
 * add-to-cart flows creating separate entries for the same product), then
 * sorted so item order does not affect the fingerprint.
 */
export function computePayloadFingerprint(inputs: FingerprintInputs): string {
  // Merge same id+size entries, then sort for determinism.
  const merged = new Map<string, { id: string; size: string; quantity: number }>();
  for (const item of inputs.items) {
    const k = `${item.id}\x00${item.size}`;
    const existing = merged.get(k);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      merged.set(k, { id: item.id, size: item.size, quantity: item.quantity });
    }
  }

  const sortedItems = Array.from(merged.values())
    .sort((a, b) =>
      `${a.id}\x00${a.size}`.localeCompare(`${b.id}\x00${b.size}`),
    )
    .map(({ id, size, quantity }) => ({ id, size, quantity }));

  const canonical = {
    customer_name: inputs.customer_name.trim().toLowerCase(),
    phone:         inputs.phone.trim().replace(/\D/g, ""),  // digits only
    address:       inputs.address.trim().toLowerCase(),
    province:      inputs.province,
    items:         sortedItems,
  };

  return createHash("sha256")
    .update(JSON.stringify(canonical))
    .digest("hex");
}

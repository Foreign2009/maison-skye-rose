import { NextResponse } from "next/server";
import type { StatusHistoryEntry } from "@/app/lib/orderStatus";
import { validateDiscoveryAttribution } from "@/app/lib/discoveryAttribution";
import { validateOrderBody } from "@/app/lib/commerce/orderValidation";
import {
  getReceiptSecret,
  signReceiptToken,
  RECEIPT_EXPIRY_SECONDS,
} from "@/app/lib/receiptToken";
import {
  validateIdempotencyKey,
  extractFingerprintInputs,
  computePayloadFingerprint,
} from "@/app/lib/commerce/idempotency";

// ── DB interface ──────────────────────────────────────────────────────────────

// Minimal DB interface — allows the real handler to be tested with a mock.
// The production POST adapter wraps the supabase client to satisfy this shape.
export interface OrderDb {
  insertOrder(row: Record<string, unknown>): Promise<{ error: unknown }>;
  /**
   * Looks up an existing order by its idempotency key.
   *
   * Required when a keyed request is received. A keyed request must not
   * silently bypass deduplication because this method is absent — handleOrder
   * returns 503 if the key is present and this method is undefined.
   *
   * Returns { data: null, error: null } when no matching order exists.
   * Returns { data: row, error: null } when a match is found.
   * Returns { data: null, error: <err> } on lookup failure.
   */
  findByIdempotencyKey?(key: string): Promise<{
    data: { order_ref: string; payload_fingerprint: string | null } | null;
    error: unknown;
  }>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateOrderRef(): string {
  const now     = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix  = Math.floor(10000 + Math.random() * 90000);
  return `MSR-${dateStr}-${suffix}`;
}

/**
 * Returns true only when the insert error is specifically a unique-constraint
 * violation on the idempotency_key column.
 *
 * Distinguishes idempotency conflicts from unrelated unique violations
 * (e.g. order_ref) by checking that the PostgreSQL error detail or message
 * names the idempotency_key constraint.
 */
function isIdempotencyConflict(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as Record<string, unknown>;
  if (e.code !== "23505") return false;
  const detail  = typeof e.details === "string" ? e.details.toLowerCase() : "";
  const message = typeof e.message === "string" ? e.message.toLowerCase() : "";
  return (
    detail.includes("idempotency_key") ||
    message.includes("idempotency_key")
  );
}

async function buildRecoveryResponse(
  orderRef: string,
): Promise<NextResponse> {
  const token    = await signReceiptToken(orderRef);
  const response = NextResponse.json({
    success:   true,
    orderRef:  orderRef,
    recovered: true,
  });
  response.cookies.set(`msr_receipt_${orderRef}`, token, {
    httpOnly: true,
    sameSite: "strict",
    path:     "/",
    maxAge:   RECEIPT_EXPIRY_SECONDS,
    secure:   process.env.NODE_ENV === "production",
  });
  console.log("[Orders] Recovered existing order", { orderRef });
  return response;
}

// ── Core handler (testable with a mock OrderDb) ───────────────────────────────

export async function handleOrder(
  body: unknown,
  db: OrderDb,
): Promise<NextResponse> {
  // Fail before any processing if receipt signing is not configured.
  try {
    getReceiptSecret();
  } catch {
    return NextResponse.json(
      { success: false, message: "Service unavailable." },
      { status: 503 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { success: false, message: "Invalid request." },
      { status: 400 },
    );
  }
  const rawBody = body as Record<string, unknown>;

  // ── 1. Validate idempotency key ────────────────────────────────────────────
  const keyResult = validateIdempotencyKey(rawBody.checkout_attempt_key);

  if (!keyResult.valid && !keyResult.absent) {
    // Key was supplied but is malformed — reject clearly.
    return NextResponse.json(
      { success: false, message: "Invalid retry key. Please refresh and try again." },
      { status: 400 },
    );
  }

  const idempotencyKey = keyResult.valid ? keyResult.key : null;

  // ── 2. Pre-insert deduplication check ─────────────────────────────────────
  //
  // Legacy clients that omit checkout_attempt_key skip this section entirely.
  // A keyed request MUST NOT bypass deduplication because the adapter lacks
  // findByIdempotencyKey — the handler returns 503 instead of proceeding.
  if (idempotencyKey !== null) {
    if (!db.findByIdempotencyKey) {
      console.error("[Orders] findByIdempotencyKey unavailable for keyed request");
      return NextResponse.json(
        { success: false, message: "Service unavailable." },
        { status: 503 },
      );
    }

    let lookupResult: {
      data: { order_ref: string; payload_fingerprint: string | null } | null;
      error: unknown;
    };
    try {
      lookupResult = await db.findByIdempotencyKey(idempotencyKey);
    } catch (lookupErr) {
      console.error(
        "[Orders] Idempotency lookup threw:",
        lookupErr instanceof Error ? lookupErr.message : "unknown",
      );
      return NextResponse.json(
        { success: false, message: "Service unavailable." },
        { status: 503 },
      );
    }

    if (lookupResult.error) {
      console.error(
        "[Orders] Idempotency lookup error:",
        lookupResult.error instanceof Error
          ? lookupResult.error.message
          : "unknown",
      );
      return NextResponse.json(
        { success: false, message: "Service unavailable." },
        { status: 503 },
      );
    }

    if (lookupResult.data !== null) {
      // An order already exists for this key.
      // Verify the customer's intent matches what was originally committed.
      const fingerprintInputs = extractFingerprintInputs(rawBody);
      const storedFingerprint = lookupResult.data.payload_fingerprint;

      if (fingerprintInputs === null || storedFingerprint === null) {
        // Cannot verify intent — protect the customer by not returning data.
        return NextResponse.json(
          {
            success: false,
            message:
              "An order with this reference may already exist. Please contact us to confirm before placing a new order.",
          },
          { status: 409 },
        );
      }

      const requestFingerprint = computePayloadFingerprint(fingerprintInputs);

      if (requestFingerprint !== storedFingerprint) {
        // Different customer intent — a prior order may have committed.
        // Do not insert and do not auto-rotate the key.
        return NextResponse.json(
          {
            success: false,
            message:
              "An earlier order may already exist with different items or delivery details. " +
              "Please contact us to confirm before placing a separate order.",
          },
          { status: 409 },
        );
      }

      // Intent matches — recover the original order.
      // Recovery bypasses price revalidation intentionally: the stored order
      // contains the authoritative totals from the original submission.
      // If catalogue prices changed between attempts the customer recovers the
      // price they agreed to, not a recalculated one.
      return buildRecoveryResponse(lookupResult.data.order_ref);
    }

    // No existing order found — fall through to full validation and insert.
  }

  // ── 3. Full body validation ────────────────────────────────────────────────
  try {
    const validation = validateOrderBody(body);
    if (!validation.ok) {
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 },
      );
    }

    const {
      customer_name,
      phone,
      address,
      province,
      discovery_context: rawDiscovery,
    } = body as {
      customer_name:      string;
      phone:              string;
      address?:           string;
      province:           string;
      discovery_context?: unknown;
    };

    const discoveryContext = rawDiscovery
      ? validateDiscoveryAttribution(rawDiscovery)
      : null;

    const order_ref = generateOrderRef();

    const initialHistory: StatusHistoryEntry[] = [
      {
        status:     "awaiting_payment",
        changed_at: new Date().toISOString(),
        note:       "Order created",
      },
    ];

    // Compute fingerprint for storage — uses the same normalization as the
    // pre-insert lookup so future retries produce the same hash.
    const fingerprintInputs = extractFingerprintInputs(rawBody);
    const payloadFingerprint = fingerprintInputs
      ? computePayloadFingerprint(fingerprintInputs)
      : null;

    // Use server-computed financial values — validation.items carries effective
    // (wholesale or retail) prices, not raw client prices.
    const { error: insertError } = await db.insertOrder({
      order_ref,
      customer_name:       customer_name.trim(),
      phone:               phone.trim(),
      address:             (address ?? "").trim(),
      province,
      items:               validation.items,
      subtotal:            validation.subtotal,
      vat:                 0,
      delivery:            validation.delivery,
      total:               validation.total,
      payment_status:      "awaiting_payment",
      status_history:      initialHistory,
      discovery_context:   discoveryContext ?? null,
      idempotency_key:     idempotencyKey ?? null,
      payload_fingerprint: payloadFingerprint,
    });

    if (insertError) {
      // ── Concurrent idempotency conflict ────────────────────────────────────
      // Another request committed the same key between our lookup and insert.
      // The unique constraint is the true atomic enforcement.
      if (idempotencyKey !== null && isIdempotencyConflict(insertError)) {
        if (!db.findByIdempotencyKey) {
          return NextResponse.json(
            { success: false, message: "Service unavailable." },
            { status: 503 },
          );
        }

        let raceResult: {
          data: { order_ref: string; payload_fingerprint: string | null } | null;
          error: unknown;
        };
        try {
          raceResult = await db.findByIdempotencyKey(idempotencyKey);
        } catch (raceErr) {
          console.error(
            "[Orders] Race recovery lookup threw:",
            raceErr instanceof Error ? raceErr.message : "unknown",
          );
          return NextResponse.json(
            { success: false, message: "Service unavailable." },
            { status: 503 },
          );
        }

        if (raceResult.error || raceResult.data === null) {
          console.error("[Orders] Race recovery lookup failed or returned null");
          return NextResponse.json(
            { success: false, message: "Service unavailable." },
            { status: 503 },
          );
        }

        // Verify intent on the race-committed row.
        const raceStored = raceResult.data.payload_fingerprint;
        if (raceStored === null || payloadFingerprint === null) {
          return NextResponse.json(
            {
              success: false,
              message:
                "An order with this reference may already exist. " +
                "Please contact us to confirm before placing a new order.",
            },
            { status: 409 },
          );
        }
        if (payloadFingerprint !== raceStored) {
          return NextResponse.json(
            {
              success: false,
              message:
                "An earlier order may already exist with different items or delivery details. " +
                "Please contact us to confirm before placing a separate order.",
            },
            { status: 409 },
          );
        }

        return buildRecoveryResponse(raceResult.data.order_ref);
      }

      // Unrelated insert failure.
      console.error(
        "Order save failed:",
        insertError instanceof Error ? insertError.message : "Supabase write error",
      );
      return NextResponse.json(
        {
          success: false,
          message: "We could not save your order. Please try again.",
        },
        { status: 500 },
      );
    }

    console.log("[Orders] Order created", {
      orderRef:  order_ref,
      province,
      itemCount: validation.items.length,
      total:     validation.total,
    });

    const token    = await signReceiptToken(order_ref);
    const response = NextResponse.json({ success: true, orderRef: order_ref });
    response.cookies.set(`msr_receipt_${order_ref}`, token, {
      httpOnly: true,
      sameSite: "strict",
      path:     "/",
      maxAge:   RECEIPT_EXPIRY_SECONDS,
      secure:   process.env.NODE_ENV === "production",
    });
    return response;

  } catch (err) {
    console.error(
      "Orders route error:",
      err instanceof Error ? err.message : "Unknown error",
    );
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
}

// ── Production POST handler ───────────────────────────────────────────────────

export async function POST(request: Request) {
  // JSON parse failure is a client error (400), not a server error (500).
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }
  try {
    // Supabase is imported lazily so the module can be loaded in tests
    // without triggering client initialization.
    const { supabase } = await import("@/app/lib/supabase");
    const db: OrderDb = {
      insertOrder: async (row) => supabase.from("orders").insert([row]),
      findByIdempotencyKey: async (key) => {
        const result = await supabase
          .from("orders")
          .select("order_ref, payload_fingerprint")
          .eq("idempotency_key", key)
          .maybeSingle();
        return result as {
          data: { order_ref: string; payload_fingerprint: string | null } | null;
          error: unknown;
        };
      },
    };
    return handleOrder(body, db);
  } catch (err) {
    console.error(
      "Orders route error:",
      err instanceof Error ? err.message : "Unknown error",
    );
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
}

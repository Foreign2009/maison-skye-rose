import { NextResponse } from "next/server";

// PayFast is intentionally disabled (G12-S2, 2026-10-22). Checkout is EFT-first with WhatsApp
// ordering and never calls this route. The previous handler signed payment links for any
// caller-supplied amount; it is removed until PayFast is reintroduced through a separate,
// security-reviewed and founder-approved implementation (see docs/PAYFAST.md). This handler
// reads no input, configuration or data. Other HTTP methods are not exported and receive 405.
export function POST() {
  return NextResponse.json(
    { success: false, error: "Online payment processing is unavailable." },
    { status: 410 },
  );
}

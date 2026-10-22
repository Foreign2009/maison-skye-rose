import { NextResponse } from "next/server";

// PayFast payment notifications (ITN) are intentionally disabled (G12-S2, 2026-10-22). No PayFast
// payments are taken, so there is nothing to notify about. The previous handler changed order
// payment status from notification data without merchant, amount, source or status-transition
// checks; it is removed until PayFast is reintroduced through a separate, security-reviewed and
// founder-approved implementation (see docs/PAYFAST.md). This handler reads no input,
// configuration or order data. Other HTTP methods are not exported and receive 405.
export function POST() {
  return NextResponse.json(
    { success: false, error: "Online payment processing is unavailable." },
    { status: 410 },
  );
}

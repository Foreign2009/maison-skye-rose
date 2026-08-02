import { NextResponse } from "next/server";
import { createHash } from "crypto";

const PAYFAST_LIVE_URL    = "https://www.payfast.co.za/eng/process";
const PAYFAST_SANDBOX_URL = "https://sandbox.payfast.co.za/eng/process";

function buildParamString(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, "+")}`)
    .join("&");
}

function computeSignature(
  params:     Record<string, string>,
  passphrase: string | undefined,
): string {
  const paramString = buildParamString(params);
  const sigInput    = passphrase
    ? `${paramString}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
    : paramString;
  return createHash("md5").update(sigInput).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      amount:          number;
      item_name:       string;
      name_first?:     string;
      name_last?:      string;
      email_address?:  string;
      m_payment_id?:   string;
    };

    const { amount, item_name, name_first, name_last, email_address, m_payment_id } = body;

    if (typeof amount !== "number" || !item_name) {
      return NextResponse.json(
        { success: false, error: "Missing required payment fields." },
        { status: 400 },
      );
    }

    const merchant_id  = process.env.PAYFAST_MERCHANT_ID;
    const merchant_key = process.env.PAYFAST_MERCHANT_KEY;
    const passphrase   = process.env.PAYFAST_PASSPHRASE;
    const website_url  = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000";
    const isLive       = process.env.PAYFAST_ENV === "live";

    if (!merchant_id || !merchant_key) {
      return NextResponse.json(
        { success: false, error: "Payment credentials not configured." },
        { status: 500 },
      );
    }

    const paymentId  = m_payment_id ?? `MSR-${Date.now()}`;
    const return_url = `${website_url}/payment-success?ref=${encodeURIComponent(paymentId)}&total=${amount.toFixed(2)}`;
    const cancel_url = `${website_url}/payment-cancel`;
    const notify_url = `${website_url}/api/payfast/itn`;

    // Field order must match PayFast specification for correct signature computation
    const paymentParams: Record<string, string> = {
      merchant_id,
      merchant_key,
      return_url,
      cancel_url,
      notify_url,
      ...(name_first    ? { name_first }    : {}),
      ...(name_last     ? { name_last }     : {}),
      ...(email_address ? { email_address } : {}),
      m_payment_id: paymentId,
      amount:       amount.toFixed(2),
      item_name,
    };

    const signature   = computeSignature(paymentParams, passphrase);
    const paramString = buildParamString(paymentParams);
    const baseUrl     = isLive ? PAYFAST_LIVE_URL : PAYFAST_SANDBOX_URL;
    const paymentUrl  = `${baseUrl}?${paramString}&signature=${signature}`;

    return NextResponse.json({ success: true, paymentUrl });

  } catch {
    return NextResponse.json(
      { success: false, error: "Payment initialization failed." },
      { status: 500 },
    );
  }
}

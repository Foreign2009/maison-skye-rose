import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const {
      amount,
      item_name,
    } = body;

    const merchant_id =
      process.env
        .NEXT_PUBLIC_PAYFAST_MERCHANT_ID;

    const merchant_key =
      process.env
        .NEXT_PUBLIC_PAYFAST_MERCHANT_KEY;

    const passphrase =
      process.env
        .NEXT_PUBLIC_PAYFAST_PASSPHRASE;

    const website_url =
      process.env
        .NEXT_PUBLIC_WEBSITE_URL;

    const paymentData = {

      merchant_id,
      merchant_key,

      return_url:
        `${website_url}/payment-success`,

      cancel_url:
        `${website_url}/payment-cancel`,

      notify_url:
        `${website_url}/api/payfast`,

      name_first:
        "Maison",

      name_last:
        "Customer",

      email_address:
        "customer@email.com",

      m_payment_id:
        `MSR-${Date.now()}`,

      amount:
        amount.toFixed(2),

      item_name,

    };

    const queryString =
      new URLSearchParams(
        paymentData as Record<
          string,
          string
        >
      ).toString();

    const paymentUrl =
      `https://sandbox.payfast.co.za/eng/process?${queryString}`;

    return NextResponse.json({
      success: true,
      paymentUrl,
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        error:
          "Payment initialization failed",
      },
      {
        status: 500,
      }
    );

  }

}
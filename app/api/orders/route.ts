import { NextResponse } from "next/server";

import { supabase } from "@/app/lib/supabase";

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const {
      customer_name,
      phone,
      address,
      province,
      items,
      subtotal,
      delivery,
      total,
    } = body;

    const { data, error } =
      await supabase
        .from("orders")
        .insert([
          {
            customer_name,
            phone,
            address,
            province,
            items,
            subtotal,
            vat: 0,
            delivery,
            total,
            payment_status:
              "pending",
          },
        ])
        .select();

    if (error) {

      console.error(
        "Order save failed:",
        error instanceof Error ? error.message : "Supabase write error"
      );

      return NextResponse.json(
        {
          success: false,
          error,
        },
        {
          status: 500,
        }
      );

    }

    return NextResponse.json({
      success: true,
      order: data,
    });

  } catch (error) {

    console.error(
      "Orders route error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );

  }

}
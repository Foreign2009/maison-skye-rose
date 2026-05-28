import { NextResponse } from "next/server";

import { supabase } from "@/app/lib/supabase";

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    console.log(
      "Incoming Order:",
      body
    );

    const {
      customer_name,
      phone,
      address,
      province,
      items,
      subtotal,
      vat,
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
            vat,
            delivery,
            total,
            payment_status:
              "pending",
          },
        ])
        .select();

    if (error) {

      console.log(
        "SUPABASE ERROR:",
        error
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

    console.log(
      "ORDER SAVED:",
      data
    );

    return NextResponse.json({
      success: true,
      order: data,
    });

  } catch (error) {

    console.log(
      "SERVER ERROR:",
      error
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
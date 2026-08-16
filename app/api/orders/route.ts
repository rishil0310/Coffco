import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../checkout/lib/SupaBaseAdmin";

export async function POST(req: Request) {
  try {
    const order = await req.json();

    const { error } = await supabaseAdmin
      .from("orders")
      .insert({
  order_id: order.id,
  customer: order.customer,
  items: order.items,
  total: order.total,
  payment: order.payment,
  status: "Pending",
  delivery_date: order.delivery.date,
  delivery_time_slot: order.delivery.timeSlot,
});

    if (error) {
      console.log("Supabase error:", error);

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log("API error:", error);

    return NextResponse.json(
      {
        error: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}
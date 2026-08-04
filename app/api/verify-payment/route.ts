import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/app/checkout/lib/SupaBaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
    } = body;


    const secret = process.env.RAZORPAY_KEY_SECRET!;


    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");


    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid signature",
        },
        { status: 400 }
      );
    }


    console.log("Updating order:", order_id);


    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "Paid",
        razorpay_payment_id: razorpay_payment_id,
      })
      .eq("order_id", order_id)
      .select();


    console.log("Updated data:", data);
    console.log("Update error:", error);


    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }


    return NextResponse.json({
      success: true,
    });


  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success:false,
        message:"Verification failed",
      },
      {status:500}
    );

  }
}
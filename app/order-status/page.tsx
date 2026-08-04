"use client";

import { useState } from "react";
import { supabase } from "../checkout/lib/supabase";

export default function OrderStatusPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [message, setMessage] = useState("");

  async function trackOrder() {
    setMessage("");
    setOrder(null);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId.trim())
      .single();

    if (error || !data) {
      setMessage("Order not found. Check your Order ID.");
      return;
    }

    setOrder(data);
  }

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-md">

        <h1 className="text-center text-4xl font-bold">
          Track <span className="text-[#D4AF37]">Order</span>
        </h1>

        <p className="mt-3 text-center text-gray-400">
          Enter your Coffco Order ID
        </p>


        <div className="mt-8 space-y-4">

          <input
            value={orderId}
            onChange={(e)=>setOrderId(e.target.value)}
            placeholder="Example: COFFCO12345"
            className="w-full rounded-xl border border-white/20 bg-[#111] p-4 outline-none focus:border-[#D4AF37]"
          />


          <button
            onClick={trackOrder}
            className="w-full rounded-full bg-[#D4AF37] py-4 font-bold text-black"
          >
            Track Order
          </button>

        </div>


        {message && (
          <p className="mt-6 text-center text-red-400">
            {message}
          </p>
        )}


        {order && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-[#111] p-6">

            <h2 className="text-xl font-bold">
              {order.order_id}
            </h2>


            <p className="mt-4 text-gray-400">
              Status
            </p>

            <p className="text-2xl font-bold text-[#D4AF37]">
              {order.status}
            </p>


            <p className="mt-4">
              Total: ₹{order.total}
            </p>


          </div>
        )}

      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type Order } from "../context/CartContext";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayOrderResponse = {
  id: string;
  amount: number;
  currency: string;
};

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<boolean> {
  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(Boolean(window.Razorpay)), {
        once: true,
      });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const router = useRouter();
  const { cart, createOrder } = useCart();

  const [payment, setPayment] = useState<"cod" | "razorpay">("cod");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [classroom, setClassroom] = useState("");
  const [division, setDivision] = useState("");
  const [year, setYear] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeSlot, setTimeSlot] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function validateCheckout(): boolean {
    if (cart.length === 0) {
      setErrorMessage("Your cart is empty. Add an item before checking out.");
      return false;
    }

   if (
  !name.trim() ||
  !phone.trim() ||
  !email.trim() ||
  !classroom.trim() ||
  !division.trim() ||
  !timeSlot
) {
     setErrorMessage("Please complete all delivery details and select a time slot.");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    setErrorMessage("");
    return true;
  }

  function buildOrder(paymentMethod: "cod" | "razorpay"): Order {
    return {
      id: `COF-${Date.now()}`,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        classroom: classroom.trim(),
        division: division.trim(),
      },
      items: cart,
      total,
      payment: paymentMethod,
      delivery: {
  date: "next-day",
  timeSlot,
},
    };
  }

  async function saveOrder(order: Order): Promise<void> {
    // CartContext's current type declares createOrder as void, while its implementation
    // is async. Promise.resolve preserves the returned Promise at runtime and keeps this
    // page compatible with the existing context type.
    await Promise.resolve(createOrder(order));
  }

  async function placeCashOnDeliveryOrder() {
    const order = buildOrder("cod");
    await saveOrder(order);
    router.push("/confirmation");
  }

  async function placeRazorpayOrder() {
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      throw new Error("Razorpay could not be loaded. Please check your connection and try again.");
    }

    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!key) {
      throw new Error("Razorpay is not configured. Please contact Coffco support.");
    }

    const order = buildOrder("razorpay");
    const createResponse = await fetch("/api/orders/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: order.total }),
    });

    const razorpayOrder = (await createResponse.json().catch(() => null)) as RazorpayOrderResponse | null;
    if (!createResponse.ok || !razorpayOrder?.id || !razorpayOrder.amount || !razorpayOrder.currency) {
      throw new Error("We could not start your payment. Please try again.");
    }

    await new Promise<void>((resolve, reject) => {
      const razorpay = new window.Razorpay!({
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Coffco",
        description: "Premium Coffee Order",
        order_id: razorpayOrder.id,
        prefill: {
          name: order.customer.name,
          email: order.customer.email,
          contact: order.customer.phone,
        },
        theme: { color: "#D4AF37" },
        handler: async (response) => {
          try {
            // Save first so the server-side verification route has an order to update.
            await saveOrder(order);

            const verificationResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order.id,
              }),
            });

            const verification = (await verificationResponse.json().catch(() => null)) as {
              success?: boolean;
              message?: string;
            } | null;

            if (!verificationResponse.ok || !verification?.success) {
              throw new Error(verification?.message ?? "Payment verification failed. Please contact Coffco support.");
            }

            resolve();
          } catch (error) {
            reject(error instanceof Error ? error : new Error("Payment verification failed."));
          }
        },
        modal: {
          ondismiss: () => reject(new Error("Payment was cancelled.")),
        },
      });

      razorpay.open();
    });

    router.push("/confirmation");
  }

  async function placeOrder() {
    if (!validateCheckout() || isProcessing) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      if (payment === "cod") {
        await placeCashOnDeliveryOrder();
      } else {
        await placeRazorpayOrder();
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-8 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-12 text-5xl font-bold">Checkout</h1>

        <div className="grid gap-12 md:grid-cols-2">
          <div className="rounded-3xl bg-[#111] p-8">
            <h2 className="mb-6 text-2xl font-bold">Delivery Details</h2>

            <input placeholder="Full Name" value={name} onChange={(event) => setName(event.target.value)} className="mb-4 w-full rounded-xl border border-white/20 bg-black p-4" />
            <input placeholder="Phone Number" value={phone} onChange={(event) => setPhone(event.target.value)} className="mb-4 w-full rounded-xl border border-white/20 bg-black p-4" />
            <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} className="mb-4 w-full rounded-xl border border-white/20 bg-black p-4" />
            <input placeholder="Classroom" value={classroom} onChange={(event) => setClassroom(event.target.value)} className="mb-4 w-full rounded-xl border border-white/20 bg-black p-4" />
            <input placeholder="Division" value={division} onChange={(event) => setDivision(event.target.value)} className="mb-4 w-full rounded-xl border border-white/20 bg-black p-4" />
            <input placeholder="Year" value={year} onChange={(event) => setYear(event.target.value)} className="w-full rounded-xl border border-white/20 bg-black p-4" />

<div className="mt-6">
  <h3 className="mb-3 text-lg font-bold">Delivery</h3>

  <p className="text-gray-400 mb-4">
    Next Day Delivery
  </p>

  <label className="mb-2 block text-sm text-gray-300">
    Select Time Slot
  </label>

  <select
    value={timeSlot}
    onChange={(event) => setTimeSlot(event.target.value)}
    className="w-full rounded-xl border border-white/20 bg-black p-4 text-white"
  >
    <option value="">Select a time slot</option>
    <option value="12:00 PM">12:00 PM</option>
    <option value="1:00 PM">1:00 PM</option>
    <option value="2:00 PM">2:00 PM</option>
    <option value="3:00 PM">3:00 PM</option>
    <option value="4:00 PM">4:00 PM</option>
    <option value="5:00 PM">5:00 PM</option>
    <option value="6:00 PM">6:00 PM</option>
  </select>
</div>
            <p className="mt-6 text-gray-400">📍 NMIMS Mumbai Campus</p>
          </div>

          <div className="rounded-3xl bg-[#111] p-8">
            <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>

            {cart.map((item) => (
              <div key={item.id} className="mb-4 flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <hr className="my-6 border-white/20" />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-[#D4AF37]">₹{total}</span>
            </div>

            <h3 className="mb-4 mt-8 text-xl font-bold">Payment Method</h3>

            <label className="mb-4 flex items-center gap-3">
              <input type="radio" name="payment" checked={payment === "cod"} onChange={() => setPayment("cod")} disabled={isProcessing} />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-3">
              <input type="radio" name="payment" checked={payment === "razorpay"} onChange={() => setPayment("razorpay")} disabled={isProcessing} />
              Razorpay (UPI / Card / Net Banking)
            </label>

            {errorMessage && <p role="alert" className="mt-5 text-sm text-red-400">{errorMessage}</p>}

            <button type="button" onClick={placeOrder} disabled={isProcessing} className="mt-8 w-full rounded-full bg-[#D4AF37] py-4 font-bold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100">
              {isProcessing ? "Processing…" : payment === "razorpay" ? "Continue to Payment" : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

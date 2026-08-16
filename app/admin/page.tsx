"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../checkout/lib/supabase";

type OrderStatus = "Pending" | "Preparing" | "Ready" | "Delivered";

type Customer = {
  name?: string;
  phone?: string;
  email?: string;
  classroom?: string;
  division?: string;
};

type OrderItem = {
  id?: number | string;
  name?: string;
  quantity?: number;
  price?: number;
};

type AdminOrder = {
  id: string;
  order_id: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  payment: string;
  payment_status: string;
  status: OrderStatus;
  created_at: string | null;
delivery_date: string;
delivery_time_slot: string;
};

const ORDER_STATUSES: OrderStatus[] = ["Pending", "Preparing", "Ready", "Delivered"];

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeOrder(value: unknown): AdminOrder {
  const order = asRecord(value);
  const customer = asRecord(order.customer);
  const rawItems = Array.isArray(order.items) ? order.items : [];
  const status = ORDER_STATUSES.includes(order.status as OrderStatus)
    ? (order.status as OrderStatus)
    : "Pending";

  return {
    id: String(order.id ?? ""),
    order_id: String(order.order_id ?? "Unknown order"),
    customer: {
      name: typeof customer.name === "string" ? customer.name : "Customer",
      phone: typeof customer.phone === "string" ? customer.phone : "—",
      email: typeof customer.email === "string" ? customer.email : "",
      classroom: typeof customer.classroom === "string" ? customer.classroom : "—",
      division: typeof customer.division === "string" ? customer.division : "",
    },
    items: rawItems.map((item) => {
      const entry = asRecord(item);
      return {
        id: typeof entry.id === "string" || typeof entry.id === "number" ? entry.id : undefined,
        name: typeof entry.name === "string" ? entry.name : "Item",
        quantity: typeof entry.quantity === "number" ? entry.quantity : 1,
        price: typeof entry.price === "number" ? entry.price : 0,
      };
    }),
    total: typeof order.total === "number" ? order.total : 0,
    payment: typeof order.payment === "string" ? order.payment : "cod",
    payment_status: typeof order.payment_status === "string" ? order.payment_status : "Pending",
    status,
created_at: typeof order.created_at === "string" ? order.created_at : null,
delivery_date: typeof order.delivery_date === "string" ? order.delivery_date : "next-day",
delivery_time_slot:
  typeof order.delivery_time_slot === "string"
    ? order.delivery_time_slot
    : "—",
  };
}

function formatDate(value: string | null): string {
  if (!value) return "Just now";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function statusClass(status: string): string {
  switch (status) {
    case "Delivered":
    case "Paid":
      return "bg-emerald-400/15 text-emerald-300";
    case "Ready":
      return "bg-sky-400/15 text-sky-300";
    case "Preparing":
      return "bg-[#D4AF37]/15 text-[#D4AF37]";
    default:
      return "bg-white/10 text-gray-300";
  }
}

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const getOrders = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage("Could not load orders. Please refresh and try again.");
    } else {
      setOrders((data ?? []).map(normalizeOrder));
      setErrorMessage("");
    }

    if (showLoading) setIsLoading(false);
  }, []);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let active = true;

    async function startAdmin() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      if (!active) return;

      setAdminEmail(data.user.email ?? "Admin");
      setIsAuthorizing(false);
      await getOrders(true);

      channel = supabase
        .channel("coffco-admin-orders")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "orders" },
          () => void getOrders(),
        )
        .subscribe();
    }

    void startAdmin();

    return () => {
      active = false;
      if (channel) void supabase.removeChannel(channel);
    };
  }, [getOrders, router]);

  const counts = useMemo(
    () => ({
      pending: orders.filter((order) => order.status === "Pending").length,
      preparing: orders.filter((order) => order.status === "Preparing").length,
      ready: orders.filter((order) => order.status === "Ready").length,
    }),
    [orders],
  );

  async function updateStatus(id: string, status: OrderStatus) {
    setUpdatingOrderId(id);
    setErrorMessage("");

    const { error } = await supabase.from("orders").update({ status }).eq("id", id);

    if (error) {
      setErrorMessage("Could not update this order. Please try again.");
    } else {
      setOrders((currentOrders) =>
        currentOrders.map((order) => (order.id === id ? { ...order, status } : order)),
      );
    }

    setUpdatingOrderId(null);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (isAuthorizing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-gray-400">Checking admin access…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-gray-400">Order management</p>
            <h1 className="text-4xl font-bold md:text-5xl">
              Coffco <span className="text-[#D4AF37]">Admin</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-gray-400">{adminEmail}</span>
            <button type="button" onClick={() => void getOrders(true)} disabled={isLoading} className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium transition hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50">
              {isLoading ? "Refreshing…" : "Refresh orders"}
            </button>
            <button type="button" onClick={() => void signOut()} className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium transition hover:border-red-400 hover:text-red-300">
              Sign out
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#111] p-5"><p className="text-sm text-gray-400">New orders</p><p className="mt-2 text-3xl font-bold text-[#D4AF37]">{counts.pending}</p></div>
          <div className="rounded-2xl border border-white/10 bg-[#111] p-5"><p className="text-sm text-gray-400">Preparing</p><p className="mt-2 text-3xl font-bold">{counts.preparing}</p></div>
          <div className="rounded-2xl border border-white/10 bg-[#111] p-5"><p className="text-sm text-gray-400">Ready for pickup</p><p className="mt-2 text-3xl font-bold text-emerald-300">{counts.ready}</p></div>
        </div>

        {errorMessage && <p role="alert" className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{errorMessage}</p>}

        {isLoading ? (
          <p className="text-gray-400">Loading orders…</p>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-[#111] p-10 text-center text-gray-400">No orders yet.</div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isUpdating = updatingOrderId === order.id;
              const nextStatus = order.status === "Pending" ? "Preparing" : order.status === "Preparing" ? "Ready" : order.status === "Ready" ? "Delivered" : null;

              return (
                <article key={order.id} className="rounded-3xl border border-white/10 bg-[#111] p-6 md:p-8">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <h2 className="text-xl font-bold">{order.order_id}</h2>
                      <p className="mt-1 text-sm text-gray-400">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusClass(order.payment_status)}`}>{order.payment_status === "Paid" ? "Paid" : "Payment pending"}</span>
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusClass(order.status)}`}>{order.status}</span>
                      <span className="text-xl font-bold text-[#D4AF37]">₹{order.total}</span>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div className="space-y-1 text-gray-300">
                      <p><span className="text-gray-500">Customer:</span> {order.customer.name}</p>
                      <p><span className="text-gray-500">Phone:</span> {order.customer.phone}</p>
                      <p><span className="text-gray-500">Location:</span> {order.customer.classroom}{order.customer.division ? ` · ${order.customer.division}` : ""}</p>
                      <p><span className="text-gray-500">Payment:</span> {order.payment === "razorpay" ? "Razorpay" : "Cash on Delivery"}</p>
                      <p>
  <span className="text-gray-500">Delivery:</span> Next Day
</p>

<p>
  <span className="text-gray-500">Time:</span>{" "}
  <span className="font-bold text-[#D4AF37]">
    {order.delivery_time_slot}
  </span>
</p>
                    </div>
                    <div>
                      <h3 className="mb-2 font-bold">Items</h3>
                      <ul className="space-y-1 text-gray-300">
                        {order.items.map((item, index) => <li key={item.id ?? `${order.id}-${index}`}>{item.name} × {item.quantity}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3 border-t border-white/10 pt-6">
                    {nextStatus ? (
                      <button type="button" disabled={isUpdating} onClick={() => void updateStatus(order.id, nextStatus)} className="rounded-full bg-[#D4AF37] px-5 py-2 font-bold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100">
                        {isUpdating ? "Updating…" : nextStatus === "Preparing" ? "Accept Order" : nextStatus === "Ready" ? "Mark Ready" : "Mark Delivered"}
                      </button>
                    ) : <p className="py-2 text-sm text-emerald-300">This order is complete.</p>}

                    {order.status !== "Preparing" && <button type="button" disabled={isUpdating} onClick={() => void updateStatus(order.id, "Preparing")} className="rounded-full border border-[#D4AF37] px-5 py-2 text-sm transition hover:bg-[#D4AF37] hover:text-black disabled:cursor-not-allowed disabled:opacity-60">Set Preparing</button>}
                    {order.status !== "Ready" && <button type="button" disabled={isUpdating} onClick={() => void updateStatus(order.id, "Ready")} className="rounded-full border border-white/20 px-5 py-2 text-sm transition hover:border-white disabled:cursor-not-allowed disabled:opacity-60">Set Ready</button>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

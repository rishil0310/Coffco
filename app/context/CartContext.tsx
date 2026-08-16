"use client";

import { createContext, ReactNode, useContext, useState } from "react";

export type CartItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    classroom: string;
    division: string;
  };
  items: CartItem[];
  total: number;
payment: "cod" | "razorpay";
payment_status?: "Pending" | "Paid";
delivery: {
  date: "next-day";
  timeSlot: string;
};
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  createOrder: (order: Order) => Promise<void>;
  order: Order | null;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<Order | null>(null);

  function addToCart(item: CartItem) {
    setCart((currentCart) => {
      const existing = currentCart.find((product) => product.id === item.id);
      return existing
        ? currentCart.map((product) => product.id === item.id ? { ...product, quantity: product.quantity + 1 } : product)
        : [...currentCart, item];
    });
  }

  function removeFromCart(id: number) {
    setCart((currentCart) => currentCart.filter((product) => product.id !== id));
  }

  function increase(id: number) {
    setCart((currentCart) => currentCart.map((product) => product.id === id ? { ...product, quantity: product.quantity + 1 } : product));
  }

  function decrease(id: number) {
    setCart((currentCart) => currentCart
      .map((product) => product.id === id ? { ...product, quantity: product.quantity - 1 } : product)
      .filter((product) => product.quantity > 0));
  }

  async function createOrder(newOrder: Order) {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });

    if (!response.ok) {
      throw new Error("Your order could not be saved. Please try again.");
    }

    setOrder(newOrder);
    setCart([]);
  }

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, increase, decrease, createOrder, order }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}

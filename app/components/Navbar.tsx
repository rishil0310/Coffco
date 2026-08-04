"use client";

import { useState } from "react";
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";


export default function Navbar() {

  const [cartOpen, setCartOpen] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();

const cartCount = cart.reduce(
  (total, item) => total + item.quantity,
  0
);


  return (

    <>

    <nav className="
    sticky
    top-0
    z-50
    bg-black/70
    backdrop-blur-md
    border-b
    border-white/10
    ">

<button
  onClick={() => setMenuOpen(!menuOpen)}
  className="
  md:hidden
  text-[#D4AF37]
  text-3xl
  "
>
  ☰
</button>
     
      <div className="
      max-w-7xl
      mx-auto
      flex
      justify-between
      items-center
      px-8
      py-5
      ">



        <a
          href="/"
          className="
          text-2xl
          font-bold
          tracking-widest
          text-[#D4AF37]
          "
        >

          COFFCO

        </a>





        <div className="
        hidden
        md:flex
        gap-8
        text-sm
        uppercase
        ">


          <a href="/">
            Home
          </a>


          <a href="/shop">
            Shop
          </a>


          <a href="/order-status">
            Track Order
          </a>


          <a href="/about">
            About
          </a>


          <a href="/contact">
            Contact
          </a>


        </div>






        <div className="
        flex
        gap-4
        ">



         <button
  onClick={() => setCartOpen(true)}
  className="
  relative
  border
  border-[#D4AF37]
  px-4
  py-2
  rounded-full
  hover:bg-[#D4AF37]
  hover:text-black
  transition
  "
>

  Cart

  {cartCount > 0 && (
    <span
      className="
      absolute
      -top-2
      -right-2
      bg-[#D4AF37]
      text-black
      text-xs
      font-bold
      w-5
      h-5
      rounded-full
      flex
      items-center
      justify-center
      "
    >
      {cartCount}
    </span>
  )}

</button>





          



        </div>



      </div>


    </nav>
    {menuOpen && (
  <div className="
  md:hidden
  bg-black
  border-b
  border-white/10
  p-6
  flex
  flex-col
  gap-5
  text-center
  uppercase
  ">

    <a href="/">Home</a>

    <a href="/shop">Shop</a>

    <a href="/order-status">Track Order</a>

    <a href="/about">About</a>

    <a href="/contact">Contact</a>

  </div>
)}





    <CartDrawer
      open={cartOpen}
      close={()=>setCartOpen(false)}
    />


    </>

  );

}
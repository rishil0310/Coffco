"use client";

import Image from "next/image";
import { useCart } from "../context/CartContext";

type ProductCardProps = {
  id: number;
  image: string;
  name: string;
  price: number;
  description: string;
};

export default function ProductCard({
  id,
  image,
  name,
  price,
  description,
}: ProductCardProps) {

  const { cart, addToCart, increase, decrease } = useCart();
  const quantity =
  cart.find((item) => item.id === id)?.quantity || 0;

  return (
    <div
      className="
      group relative
      bg-[#111111]
      rounded-[2rem]
      p-8
      border border-white/10
      hover:border-[#D4AF37]
      transition-all duration-500
      hover:-translate-y-3
      overflow-hidden
      "
    >


      {/* Gold glow */}

      <div
        className="
        absolute top-10 left-1/2
        -translate-x-1/2
        w-48 h-48
        bg-[#D4AF37]/10
        blur-3xl
        rounded-full
        group-hover:bg-[#D4AF37]/20
        transition
        "
      />



      {/* Product Image */}

      <div className="relative flex justify-center h-[360px] items-center">

        <Image
          src={image}
          alt={name}
          width={260}
          height={380}
          className="
          object-contain
          transition-all duration-500
          group-hover:scale-110
          group-hover:-translate-y-3
          "
        />

      </div>



      {/* Product Details */}

      <h3 className="text-2xl font-bold mt-6">
        {name}
      </h3>


      <p className="text-gray-400 mt-3 leading-relaxed">
        {description}
      </p>



      <div className="flex justify-between items-center mt-8">


        <span className="text-3xl font-bold text-[#D4AF37]">
          ₹{price}
        </span>



        {quantity === 0 ? (
  <button
    onClick={() =>
      addToCart({
        id,
        name,
        image,
        price,
        quantity: 1,
      })
    }
    className="
    bg-[#D4AF37]
    text-black
    px-6 py-3
    rounded-full
    font-bold
    hover:scale-105
    transition
    "
  >
    Add to Cart
  </button>
) : (
  <div
    className="
    bg-[#D4AF37]
    text-black
    px-5 py-3
    rounded-full
    font-bold
    flex
    items-center
    gap-5
    "
  >
    <button
      onClick={() => decrease(id)}
      className="text-xl"
    >
      −
    </button>

    <span>
      {quantity}
    </span>

    <button
      onClick={() => increase(id)}
      className="text-xl"
    >
      +
    </button>
  </div>
)}


      </div>


    </div>
  );
}
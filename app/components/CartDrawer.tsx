"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function CartDrawer({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) {

  const router = useRouter();

  const {
    cart,
    increase,
    decrease,
    removeFromCart,
  } = useCart();


  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


  return (
    <>

      {/* Overlay */}

      {open && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        />
      )}



      {/* Drawer */}

      <div
        className={`
        fixed top-0 right-0
        h-full w-full sm:w-[450px]
        bg-[#0b0b0b]
        text-white
        z-50
        p-8
        shadow-2xl
        transition-transform duration-500
        ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >


        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-3xl font-bold">
            Your <span className="text-[#D4AF37]">Cart</span>
          </h2>


          <button
            onClick={close}
            className="text-gray-400 text-2xl hover:text-white"
          >
            ✕
          </button>

        </div>



        {cart.length === 0 ? (

          <div className="text-center mt-20">

            <p className="text-gray-400 text-lg">
              Your cart is empty.
            </p>

          </div>


        ) : (

          <>


          {/* Items */}

          <div className="space-y-6">


          {cart.map((item)=>(

            <div
              key={item.id}
              className="
              flex gap-4
              bg-[#111]
              rounded-2xl
              p-4
              border border-white/10
              "
            >


              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={120}
                className="object-contain"
              />



              <div className="flex-1">


                <h3 className="font-bold text-lg">
                  {item.name}
                </h3>


                <p className="text-[#D4AF37] font-semibold">
                  ₹{item.price}
                </p>



                <div className="flex items-center gap-3 mt-3">


                  <button
                    onClick={()=>decrease(item.id)}
                    className="
                    w-8 h-8
                    rounded-full
                    border border-white/20
                    hover:border-[#D4AF37]
                    "
                  >
                    -
                  </button>



                  <span>
                    {item.quantity}
                  </span>



                  <button
                    onClick={()=>increase(item.id)}
                    className="
                    w-8 h-8
                    rounded-full
                    bg-[#D4AF37]
                    text-black
                    font-bold
                    "
                  >
                    +
                  </button>



                </div>


              </div>



              <button
                onClick={()=>removeFromCart(item.id)}
                className="text-red-400 text-sm"
              >
                Remove
              </button>


            </div>

          ))}


          </div>




          {/* Bottom */}

          <div className="absolute bottom-8 left-8 right-8">


            <div className="flex justify-between text-2xl font-bold">

              <span>
                Total
              </span>


              <span className="text-[#D4AF37]">
                ₹{total}
              </span>

            </div>



            <button

              onClick={()=>{
                close();
                router.push("/checkout");
              }}

              className="
              w-full
              mt-6
              bg-[#D4AF37]
              text-black
              py-4
              rounded-full
              font-bold
              text-lg
              hover:scale-105
              transition
              "
            >
              Proceed to Checkout
            </button>


          </div>


          </>

        )}


      </div>


    </>
  );
}
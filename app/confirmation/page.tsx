"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";


export default function Confirmation() {

  const router = useRouter();

  const { order } = useCart();



  if (!order) {

    return (

      <main className="
      min-h-screen
      bg-black
      text-white
      flex
      items-center
      justify-center
      ">

        <h1 className="text-3xl">
          No order found
        </h1>

      </main>

    );

  }




  return (

    <main className="
    min-h-screen
    bg-black
    text-white
    flex
    items-center
    justify-center
    px-8
    py-16
    ">


      <div className="
      max-w-xl
      w-full
      bg-[#111]
      p-10
      rounded-3xl
      border
      border-white/10
      ">



        <div className="text-center">


          <div className="text-6xl">
            ☕
          </div>



          <h1 className="
          text-4xl
          font-bold
          mt-6
          ">

            Order Confirmed!

          </h1>



          <p className="
          text-gray-400
          mt-3
          ">

            Thank you for choosing

            <span className="text-[#D4AF37]">

              {" "}Coffco

            </span>

          </p>


        </div>





        <div className="
        mt-8
        bg-black
        p-6
        rounded-2xl
        ">


          <h2 className="
          text-xl
          font-bold
          mb-4
          ">

            Order Details

          </h2>



          <p>

            Order ID:

            <span className="text-[#D4AF37] ml-2">

              {order.id}

            </span>

          </p>



          <p className="mt-2">

            Payment:

            {" "}

            {order.payment === "cod"
              ? "Cash on Delivery"
              : "Razorpay"}

          </p>



          <p className="mt-2">

            Total:

            <span className="text-[#D4AF37] ml-2">

              ₹{order.total}

            </span>

          </p>


        </div>





        <div className="
        mt-6
        bg-black
        p-6
        rounded-2xl
        ">


          <h2 className="
          text-xl
          font-bold
          mb-4
          ">

            Delivery

          </h2>



          <p>
            {order.customer.name}
          </p>



          <p>
            Classroom: {order.customer.classroom}
          </p>



          <p>
            Division: {order.customer.division}
          </p>



          <p className="
          mt-3
          text-gray-400
          ">

            📍 NMIMS Mumbai Campus

          </p>



          <p className="text-gray-400">

            🚚 Delivery: Next day in classroom

          </p>


        </div>






        <div className="
        mt-6
        bg-black
        p-6
        rounded-2xl
        ">


          <h2 className="
          text-xl
          font-bold
          mb-4
          ">

            Items

          </h2>




          {order.items.map((item)=>(

            <div
              key={item.id}
              className="
              flex
              justify-between
              mb-2
              "
            >


              <span>

                {item.name} × {item.quantity}

              </span>



              <span>

                ₹{item.price * item.quantity}

              </span>



            </div>

          ))}



        </div>





        <button

          onClick={()=>router.push("/order-status")}

          className="
          mt-6
          w-full
          border
          border-[#D4AF37]
          text-[#D4AF37]
          py-4
          rounded-full
          font-bold
          hover:bg-[#D4AF37]
          hover:text-black
          transition
          "

        >

          Track Order

        </button>





        <button

          onClick={()=>router.push("/")}

          className="
          mt-4
          w-full
          bg-[#D4AF37]
          text-black
          py-4
          rounded-full
          font-bold
          "

        >

          Continue Shopping

        </button>




      </div>


    </main>

  );

}
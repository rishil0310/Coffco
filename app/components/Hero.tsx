"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-screen bg-black text-white flex items-center overflow-hidden">

      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">


        {/* Text */}

        <div>

          <p className="text-[#D4AF37] uppercase tracking-[0.4em] mb-6">
            Premium Coffee Experience
          </p>


          <h1 className="text-6xl md:text-7xl font-bold leading-tight">
            Your Favourite Coffee,
            <br />
            <span className="text-[#D4AF37]">
              Anytime.
            </span>
          </h1>


          <p className="text-gray-400 text-xl mt-8 max-w-lg leading-relaxed">
            Coffco brings premium coffee beverages with rich
            flavours and a smooth experience, crafted for
            coffee lovers on the go.
          </p>
          <p className="text-sm text-[#D4AF37] mt-4">
  Delivered next day inside your classroom!
</p>


          <div className="flex gap-5 mt-10">

          <a
  href="#products"
  className="bg-[#D4AF37] text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition"
>
  Shop Now
</a>


            <a
              href="/about"
              className="border border-[#D4AF37] px-8 py-4 rounded-full hover:bg-[#D4AF37] hover:text-black transition"
            >
              About Coffco
            </a>

          </div>

        </div>




        {/* Premium Floating Bottle */}

        <div className="relative flex justify-center items-center">


          {/* Gold Glow */}

          <motion.div
            className="absolute w-[600px] h-[600px] bg-[#D4AF37]/20 blur-[140px] rounded-full"
            animate={{
              scale:[1,1.15,1],
              opacity:[0.4,0.7,0.4]
            }}
            transition={{
              duration:6,
              repeat:Infinity,
              ease:"easeInOut"
            }}
          />



          {/* Bottle */}

          <motion.img

            src="/products/original-new.png"

            alt="Coffco Original Cold Coffee"

            className="relative z-10 w-[450px] h-[680px] object-contain drop-shadow-2xl"


            animate={{
              y:[0,-20,0],
              scale:[1,1.03,1]
            }}


            whileHover={{
              rotateY:12,
              scale:1.08
            }}


            transition={{
              y:{
                duration:4,
                repeat:Infinity,
                ease:"easeInOut"
              },

              scale:{
                duration:6,
                repeat:Infinity,
                ease:"easeInOut"
              }
            }}

          />


        </div>


      </div>

    </section>
  );
}
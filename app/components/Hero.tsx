"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-black text-white flex items-center overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/2 right-[15%] -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 py-20 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* ================= TEXT ================= */}
        <div className="relative z-20">

          {/* Small heading */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-4 mb-7"
          >
            <span className="w-10 h-[1px] bg-[#D4AF37]" />

            <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs md:text-sm font-semibold">
              Premium Coffee Experience
            </p>
          </motion.div>


          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="
              text-[56px]
              sm:text-[68px]
              md:text-[72px]
              lg:text-[88px]
              xl:text-[96px]
              font-extrabold
              leading-[0.88]
              tracking-[-0.06em]
            "
          >
            Your Favourite
            <br />

            <span className="text-[#D4AF37]">
              Coffee,
            </span>

            <br />

            <span className="text-white">
              Anytime.
            </span>
          </motion.h1>


          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="
              text-gray-400
              text-base
              md:text-lg
              max-w-xl
              mt-8
              leading-relaxed
              tracking-wide
            "
          >
            Coffco brings premium coffee beverages with rich flavours
            and a smooth experience, crafted for coffee lovers on the go.
          </motion.p>


          {/* Delivery message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-2 mt-5"
          >
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />

            <p className="text-sm text-[#D4AF37] font-medium">
              Delivered next day inside your classroom
            </p>
          </motion.div>


          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-4 mt-10"
          >

            {/* Shop Now */}
            <a
              href="#products"
              className="
                group
                bg-[#D4AF37]
                text-black
                px-8
                py-4
                rounded-full
                font-bold
                text-sm
                tracking-wide
                transition-all
                duration-300
                hover:scale-105
                hover:bg-[#e4c45a]
              "
            >
              Shop Now
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>


            {/* About */}
            <a
              href="/about"
              className="
                px-8
                py-4
                rounded-full
                border
                border-white/20
                text-white
                font-semibold
                text-sm
                tracking-wide
                transition-all
                duration-300
                hover:border-[#D4AF37]
                hover:text-[#D4AF37]
              "
            >
              About Coffco
            </a>

          </motion.div>

        </div>


        {/* ================= BOTTLE ================= */}
        <div className="relative flex justify-center items-center min-h-[550px] md:min-h-[650px]">

          {/* Large gold glow */}
          <motion.div
            className="
              absolute
              w-[420px]
              h-[420px]
              md:w-[600px]
              md:h-[600px]
              bg-[#D4AF37]/20
              blur-[130px]
              rounded-full
            "
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.35, 0.6, 0.35],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />


          {/* Decorative circle */}
          <motion.div
            className="
              absolute
              w-[360px]
              h-[360px]
              md:w-[500px]
              md:h-[500px]
              rounded-full
              border
              border-[#D4AF37]/10
            "
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          />


          {/* Bottle */}
          <motion.img
            src="/products/original-new.png"
            alt="Coffco Original Cold Coffee"
            className="
              relative
              z-10
              w-[330px]
              sm:w-[380px]
              md:w-[430px]
              lg:w-[470px]
              h-[560px]
              md:h-[650px]
              object-contain
              drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]
            "
            animate={{
              y: [0, -18, 0],
              rotate: [0, 1, 0, -1, 0],
              scale: [1, 1.02, 1],
            }}
            whileHover={{
              scale: 1.07,
              rotateY: 8,
            }}
            transition={{
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
              rotate: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              },
              scale: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />

        </div>

      </div>


      {/* Bottom scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="
          absolute
          bottom-8
          left-1/2
          -translate-x-1/2
          hidden
          md:flex
          flex-col
          items-center
          gap-2
          text-gray-600
        "
      >
        <span className="text-[9px] uppercase tracking-[0.3em]">
          Scroll
        </span>

        <div className="w-[1px] h-8 bg-gradient-to-b from-[#D4AF37] to-transparent" />
      </motion.div>

    </section>
  );
}
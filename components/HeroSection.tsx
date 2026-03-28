"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-bg.jpg"
          alt="Car wash background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Yellow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFC400]/90 via-[#FFC400]/80 to-yellow-500/80 -z-10"></div>

      {/* Floating Bubble Effects */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-yellow-200/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-24">

        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* LEFT SIDE */}
          <div className="space-y-8">

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              PEXA Doorstep Car Care
            </motion.h1>

            <motion.p
              className="text-lg text-black/80 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Professional car wash services at your doorstep.  
              Start your own car care business with PEXA and earn daily income.
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/become-partner">
                <button className="bg-white text-black px-7 py-3 rounded-xl font-semibold shadow hover:scale-105 transition">
                  Become a Partner
                </button>
              </Link>

            </motion.div>

          </div>

          {/* RIGHT IMAGE */}
          <motion.div
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/30 backdrop-blur-lg"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >

            <div className="relative h-[380px] w-full">

              <Image
                src="/images/carwash.jpg"
                alt="Car washing service"
                fill
                className="object-cover"
              />

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}

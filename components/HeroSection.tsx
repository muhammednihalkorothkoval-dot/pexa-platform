"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="bg-[#FFC400] min-h-screen flex items-center">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-[#111111] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            PEXA Doorstep Car Care
          </motion.h1>
          <motion.p
            className="text-xl text-[#111111] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Professional car wash services at your doorstep.<br />
            Start your own car care business with PEXA.
          </motion.p>
          <motion.div
            className="space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              className="bg-[#111111] text-white px-6 py-3 rounded-lg font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Car Wash
            </motion.button>
            <Link href="/become-partner">
              <motion.button
                className="bg-[#111111] text-white px-6 py-3 rounded-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Become a Partner
              </motion.button>
            </Link>
          </motion.div>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <motion.div
            className="bg-gray-200 h-96 flex items-center justify-center rounded-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-gray-500 text-lg">Car Wash Illustration</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
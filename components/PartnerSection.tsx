"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PartnerSection() {
  return (
    <section className="bg-[#111111] py-16 px-4 text-white">
      <div className="container mx-auto text-center">
        <motion.h2
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Start Your Own Car Care Business
        </motion.h2>
        <motion.p
          className="text-lg mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Join our network of professional car care providers and start earning by offering doorstep services to customers in your area. No experience required - we provide training and equipment.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link href="/apply">
            <motion.button
              className="bg-[#FFC400] text-[#111111] px-8 py-4 rounded-lg font-semibold text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Apply Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ServicesSection() {
  const services = [
    {
      icon: "🚗",
      title: "Doorstep Car Wash",
      description:
        "Convenient car washing services delivered directly to your home or office.",
    },
    {
      icon: "🧼",
      title: "Interior Cleaning",
      description:
        "Professional interior detailing to keep your car fresh and spotless.",
    },
    {
      icon: "✨",
      title: "Ceramic Coating",
      description:
        "Long-lasting protective coating to maintain your car’s shine.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-[#F7F7F7]">
      <div className="max-w-7xl mx-auto">

        {/* Title + Logo */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >

          <Image
            src="/images/logo.png"
            alt="PEXA Logo"
            width={40}
            height={40}
          />

          <h2 className="text-3xl md:text-4xl font-bold text-[#111111]">
            Our Services
          </h2>

        </motion.div>

        {/* Services */}
        <div className="grid md:grid-cols-3 gap-10">

          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-10 text-center shadow-sm hover:shadow-2xl transition-all border border-transparent hover:border-yellow-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -12 }}
              viewport={{ once: true }}
            >

              <motion.div
                className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-yellow-100 text-3xl"
                whileHover={{ scale: 1.2 }}
              >
                {service.icon}
              </motion.div>

              <h3 className="text-xl font-semibold mb-3 text-[#111111]">
                {service.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {service.description}
              </p>

            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}

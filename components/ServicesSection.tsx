"use client";

import { motion } from 'framer-motion';

export default function ServicesSection() {
  const services = [
    {
      icon: '🚗',
      title: 'Doorstep Car Wash',
      description: 'Convenient car washing services delivered to your location.'
    },
    {
      icon: '🧼',
      title: 'Interior Cleaning',
      description: 'Thorough cleaning of your car\'s interior for a fresh feel.'
    },
    {
      icon: '✨',
      title: 'Ceramic Coating',
      description: 'Protective coating to keep your car looking new longer.'
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-[#111111]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Services
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-4 text-[#111111]">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
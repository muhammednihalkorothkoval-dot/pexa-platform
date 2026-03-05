"use client";

import { motion } from 'framer-motion';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Apply Online',
      description: 'Fill out our simple application form'
    },
    {
      number: 2,
      title: 'Complete Training',
      description: 'Learn our professional techniques'
    },
    {
      number: 3,
      title: 'Receive Equipment Kit',
      description: 'Get your starter kit delivered'
    },
    {
      number: 4,
      title: 'Start Earning',
      description: 'Begin providing services and earning'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-[#111111]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.h2>
        <div className="flex flex-col md:flex-row items-center justify-between relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center mb-8 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-[#FFC400] rounded-full flex items-center justify-center text-[#111111] font-bold text-xl mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#111111]">{step.title}</h3>
              <p className="text-gray-600 max-w-xs">{step.description}</p>
            </motion.div>
          ))}
          {/* Connecting line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-[#FFC400] z-0">
            {steps.slice(0, -1).map((_, index) => (
              <div key={index} className="absolute w-2 h-2 bg-[#111111] rounded-full" style={{ left: `${(index + 1) * 25}%`, top: '-2px' }}></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
'use client';

import { motion } from 'motion/react';
import { customers } from '@/constants';
import type { CustomersData } from '@/lib/cms/blocks/schemas';

const FALLBACK: CustomersData = {
  title_plain: 'Our',
  title_accent: 'Customers',
  subtitle: 'Trusted by industry leaders across the globe.',
  items: customers,
};

export default function Customers({ data }: { data?: CustomersData }) {
  const content = data ?? FALLBACK;
  return (
    <section id="customers" className="py-20 px-[5%] bg-black overflow-hidden border-b border-white/10 scroll-mt-[100px]">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter font-space">
            {content.title_plain} <span className="text-lime">{content.title_accent}</span>
          </h2>
          <p className="text-gray-400 text-xl mt-6">
            {content.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {content.items.map((customer, i) => (
            <motion.div
              key={customer}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="px-6 py-3 bg-black border border-white/10 shadow-sm hover:border-lime transition-colors duration-300"
            >
              <span className="font-space font-bold text-white uppercase tracking-wide">
                {customer}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

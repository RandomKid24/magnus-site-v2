'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FaqData } from '@/lib/cms/blocks/schemas';

export default function FAQBlock({ data }: { data: FaqData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 px-[5%] bg-black border-b border-white/10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-14">
          {data.eyebrow && (
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-lime" />
              <span className="font-sans text-[10px] font-bold tracking-[6px] uppercase text-gray-400">
                {data.eyebrow}
              </span>
            </div>
          )}
          <h2 className="font-space text-[clamp(32px,4vw,56px)] leading-[1.1] text-white tracking-tighter font-bold uppercase">
            {data.heading}
          </h2>
        </div>

        <div className="border-t border-white/10">
          {data.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="border-b border-white/10"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 py-7 text-left group cursor-pointer"
                >
                  <span
                    className={cn(
                      'font-space text-lg md:text-xl font-bold uppercase tracking-tight transition-colors duration-300',
                      isOpen ? 'text-lime' : 'text-white group-hover:text-lime'
                    )}
                  >
                    {item.question}
                  </span>
                  <Plus
                    size={20}
                    className={cn(
                      'flex-shrink-0 transition-transform duration-300',
                      isOpen ? 'rotate-45 text-lime' : 'text-zinc-500'
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="font-sans text-sm text-gray-400 leading-relaxed font-medium pb-8 max-w-2xl">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

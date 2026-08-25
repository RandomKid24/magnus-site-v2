'use client';

import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import type { TestimonialsData } from '@/lib/cms/blocks/schemas';

export default function TestimonialsBlock({ data }: { data: TestimonialsData }) {
  return (
    <section className="py-20 px-[5%] bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/10">
          {data.items.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-black p-10 flex flex-col min-h-[280px] hover:bg-zinc-950 transition-colors duration-500"
            >
              <Quote size={24} className="text-lime mb-8" />
              <blockquote className="font-sans text-base text-gray-300 leading-relaxed font-light flex-1">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 pt-6 border-t border-white/10">
                <p className="font-space text-sm font-bold text-white uppercase tracking-wide">
                  {t.author}
                </p>
                {t.role && (
                  <p className="font-sans text-[9px] font-bold tracking-[3px] uppercase text-zinc-500 mt-1">
                    {t.role}
                  </p>
                )}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import type { CtaData } from '@/lib/cms/blocks/schemas';

export default function CTABlock({ data }: { data: CtaData }) {
  return (
    <section className="py-24 px-[5%] bg-black border-b border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-dots text-white opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-lime/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <h2 className="font-space text-[clamp(32px,4.5vw,60px)] leading-[1.05] text-white tracking-tighter font-bold uppercase mb-6">
          {data.heading}
        </h2>

        {data.subheading && (
          <p className="font-sans text-base text-gray-400 leading-relaxed font-light max-w-xl mx-auto mb-10">
            {data.subheading}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={data.button_url || '#contact'}
            className="inline-flex items-center gap-3 bg-lime text-black font-bold text-[11px] tracking-[3px] uppercase px-12 py-5 transition-all duration-700 hover:bg-white"
          >
            {data.button_text}
            <ArrowUpRight size={14} />
          </a>

          {data.secondary_button_text && (
            <a
              href={data.secondary_button_url || '#contact'}
              className="btn-outline-custom"
            >
              {data.secondary_button_text}
            </a>
          )}
        </div>
      </motion.div>
    </section>
  );
}

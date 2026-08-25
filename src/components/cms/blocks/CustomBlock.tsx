'use client';

import { motion } from 'motion/react';
import { renderInlineText, splitParagraphs } from '@/components/cms/inline-text';
import type { CustomData } from '@/lib/cms/blocks/schemas';

export default function CustomBlock({ data }: { data: CustomData }) {
  return (
    <section className="py-20 px-[5%] bg-black border-b border-white/10">
      <div className="max-w-4xl mx-auto">
        {data.heading && (
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-space text-[clamp(28px,3.5vw,48px)] leading-[1.1] text-white tracking-tighter font-bold uppercase mb-10"
          >
            {data.heading}
          </motion.h2>
        )}

        {data.body && (
          <div className="mb-10">
            {splitParagraphs(data.body).map((p, i) => (
              <p
                key={i}
                className="font-sans text-base text-gray-400 leading-relaxed font-light mb-5 last:mb-0"
              >
                {renderInlineText(p)}
              </p>
            ))}
          </div>
        )}

        {data.entries.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-px bg-white/5 border border-white/10">
            {data.entries.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-black p-6 hover:bg-zinc-950 transition-colors duration-300"
              >
                <p className="font-sans text-[9px] font-bold tracking-[3px] uppercase text-zinc-500 mb-2">
                  {entry.label}
                </p>
                <p className="font-sans text-sm font-bold text-white">{entry.value}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

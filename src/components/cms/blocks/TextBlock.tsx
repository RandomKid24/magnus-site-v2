'use client';

import { motion } from 'motion/react';
import { renderInlineText, splitParagraphs } from '@/components/cms/inline-text';
import type { TextData } from '@/lib/cms/blocks/schemas';

export default function TextBlock({ data }: { data: TextData }) {
  const paragraphs = splitParagraphs(data.body);
  const centered = data.align === 'center';

  return (
    <section className="py-20 px-[5%] bg-black border-b border-white/10">
      <div className={`max-w-3xl mx-auto ${centered ? 'text-center' : ''}`}>
        {data.eyebrow && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`flex items-center gap-4 mb-8 ${centered ? 'justify-center' : ''}`}
          >
            <div className="h-[1px] w-12 bg-lime" />
            <span className="font-sans text-[10px] font-bold tracking-[6px] uppercase text-gray-400">
              {data.eyebrow}
            </span>
          </motion.div>
        )}

        {data.heading && (
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-space text-[clamp(32px,4vw,56px)] leading-[1.1] text-white tracking-tighter font-bold uppercase mb-10"
          >
            {data.heading}
          </motion.h2>
        )}

        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="font-sans text-lg text-gray-400 leading-relaxed font-light mb-6 last:mb-0"
          >
            {renderInlineText(p)}
          </motion.p>
        ))}
      </div>
    </section>
  );
}

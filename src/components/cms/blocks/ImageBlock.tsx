'use client';

import { motion } from 'motion/react';
import { safeTransformUrl } from '@/lib/cloudinary-utils';
import type { ImageData } from '@/lib/cms/blocks/schemas';

export default function ImageBlock({ data }: { data: ImageData }) {
  if (!data.url) return null;

  return (
    <section className="py-16 px-[5%] bg-black border-b border-white/10">
      <figure className={data.full_width ? 'w-full' : 'max-w-5xl mx-auto'}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden border border-white/10 shadow-2xl bg-zinc-950"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS URLs are arbitrary remote assets */}
          <img
            src={safeTransformUrl(data.url, 'full')}
            alt={data.alt || ''}
            className="w-full h-auto object-contain max-h-[720px]"
            loading="lazy"
          />
        </motion.div>
        {data.caption && (
          <figcaption className="font-sans text-[10px] font-bold tracking-[3px] uppercase text-zinc-500 mt-4 text-center">
            {data.caption}
          </figcaption>
        )}
      </figure>
    </section>
  );
}

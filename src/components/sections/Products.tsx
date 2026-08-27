'use client';

import React from 'react';
import { motion } from 'motion/react';
import { products } from '../../constants';
import { safeTransformUrl } from '@/lib/cloudinary-utils';
import type { ProductsData } from '@/lib/cms/blocks/schemas';

const FALLBACK: ProductsData = {
  eyebrow: 'Component Manifest',
  title_plain: 'PRECISION',
  title_accent: 'PRODUCT PORTFOLIO.',
  quote: '"Engineered for reliability, manufactured for micron-level fidelity."',
  items: products.map((p) => ({ title: p.title, image_url: p.image })),
};

export default function Products({ data }: { data?: ProductsData }) {
  const content = data ?? FALLBACK;
  return (
    <section id="products" className="py-20 px-[5%] bg-black overflow-hidden border-b border-white/10 scroll-mt-[100px]">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
             <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] w-12 bg-lime" />
                 <span className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-[6px]">{content.eyebrow}</span>
             </div>
             <h2 className="font-space text-[clamp(32px,4vw,56px)] leading-[1.1] text-white tracking-tighter font-bold uppercase">
                {content.title_plain} <br />
                <span className="text-lime">{content.title_accent}</span>
             </h2>
          </div>
          <div className="text-right">
            <p className="font-sans text-[10px] text-gray-400 uppercase tracking-[4px] font-bold max-w-xs leading-relaxed">
              {content.quote}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.items.map((product, i) =>
            product.image_url && product.image_url.trim().length > 0 ? (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.05 }}
              className="group relative aspect-square bg-zinc-950 overflow-hidden cursor-pointer rounded-sm"
            >
              {/* Image Container with Smooth Cross-Fade */}
              <div className="absolute inset-0 z-10 opacity-70 group-hover:opacity-100 transition-all duration-500 bg-black flex items-center justify-center">
                 {/* Crop View (Default) */}
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img 
                   src={safeTransformUrl(product.image_url, 'card')} 
                   alt={product.title}
                   className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:opacity-0 transition-all duration-500"
                 />
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img 
                   src={safeTransformUrl(product.image_url, 'card')} 
                   alt={product.title}
                   className="absolute inset-0 w-full h-full object-contain grayscale group-hover:grayscale-0 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100"
                 />
              </div>
            </motion.div>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { safeTransformUrl } from '@/lib/cloudinary-utils';
import type { GalleryData } from '@/lib/cms/blocks/schemas';

const FALLBACK: GalleryData = {
  eyebrow: 'Visuals',
  title_plain: 'THE SHOP',
  title_accent: 'FLOOR.',
  note: 'Capturing the raw precision of our daily operations.',
  images: [
    {
      url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
      title: "Vertical Milling",
      category: "Process"
    },
    {
      url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800",
      title: "Quality Control",
      category: "Inspection"
    },
    {
      url: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800",
      title: "CNC Turning",
      category: "Machining"
    }
  ]
};

export default function Gallery({ data }: { data?: GalleryData }) {
  const content = data ?? FALLBACK;
  const images = content.images;

  return (
    <section className="py-20 px-[5%] bg-black border-b border-white/10 relative overflow-hidden scroll-mt-[100px]" id="gallery">
      <div className="absolute inset-0 bg-dots text-brand-border opacity-[0.1] pointer-events-none"></div>

      <div className="container-custom relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="h-[1px] w-12 bg-lime"></div>
                <span className="font-sans text-[10px] font-bold tracking-[6px] uppercase text-gray-400">{content.eyebrow}</span>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-space text-[clamp(32px,4vw,56px)] leading-[1.1] text-white tracking-tighter font-bold uppercase"
              >
                {content.title_plain} <br />
                <span className="text-lime">{content.title_accent}</span>
              </motion.h2>
            </div>
            
            <p className="font-sans text-[10px] font-bold text-gray-400 tracking-[4px] uppercase max-w-[200px] leading-relaxed">
              {content.note}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {images.map((image, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden bg-zinc-950 mb-6 relative border border-white/10 shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={safeTransformUrl(image.url, 'card')} 
                    alt={image.title} 
                    className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-lime/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="inline-block bg-brand-dark text-lime font-space text-[9px] font-bold tracking-[2px] uppercase px-3 py-1 mb-2">
                      {image.category}
                    </span>
                    <h3 className="font-space text-xl font-bold text-white uppercase">{image.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

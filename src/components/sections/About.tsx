'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Target } from 'lucide-react';
import { philosophy } from '../../constants';
import { resolveIcon } from '@/components/cms/icon-map';
import { renderInlineText } from '@/components/cms/inline-text';
import { safeTransformUrl } from '@/lib/cloudinary-utils';
import type { AboutData } from '@/lib/cms/blocks/schemas';

const FALLBACK: AboutData = {
  established_label: 'Established 2012',
  title_plain: 'THE',
  title_accent: 'MAGNUS',
  title_suffix: 'CORE.',
  side_note: 'Engineered in Nashik. Deployed Globally.',
  narrative_lead:
    'Magnus Enterprises is a __high-precision__ manufacturing hub dedicated to the electrical, switchgear, and heavy engineering sectors.',
  narrative_body:
    'Since 2012, we have specialized in bridging the gap between complex design and physical reality. Our operations are governed by a single metric: **Geometric Fidelity.**',
  pillars: philosophy.map((p) => ({
    title: p.title,
    description: p.description,
    icon: p.icon === Target ? 'Target' : 'Shield',
  })),
  image_url:
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=2000',
};

export default function About({ data }: { data?: AboutData }) {
  const content = data ?? FALLBACK;
  return (
    <section className="py-20 px-[5%] bg-black relative overflow-hidden scroll-mt-[100px]" id="about">
      {/* Background technical grid - very subtle */}
      <div className="absolute inset-0 bg-dots opacity-[0.02] pointer-events-none text-white"></div>
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          
          {/* Left: Brand Identity (Sticky on Desktop) */}
          <div className="lg:w-1/3 lg:sticky lg:top-[150px]">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-lime"></div>
                <span className="font-sans text-[10px] font-bold tracking-[8px] text-zinc-400 uppercase">{content.established_label}</span>
              </div>
              
              <h2 className="font-space text-5xl font-bold text-white tracking-tighter leading-none uppercase">
                {content.title_plain} <br />
                <span className="text-lime">{content.title_accent}</span> <br />
                {content.title_suffix}
              </h2>
              
              <div className="pt-8 border-t border-white/10 max-w-[200px]">
                <p className="font-sans text-[10px] text-zinc-400 uppercase tracking-widest leading-relaxed font-bold">
                  {content.side_note.split('. ').map((line, i, arr) => (
                    <React.Fragment key={i}>
                      {line}{i < arr.length - 1 ? '.' : ''}
                      {i < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </motion.div>
          </div>
          
          {/* Right: Detailed Narrative & Pillars */}
          <div className="lg:w-2/3 space-y-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <h3 className="font-sans text-2xl font-light text-white leading-relaxed mb-10">
                {renderInlineText(content.narrative_lead)}
              </h3>
              <p className="font-sans text-lg text-zinc-400 leading-relaxed font-light">
                {renderInlineText(content.narrative_body)}
              </p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-24">
              {content.pillars.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  {/* HUD Corner Accent */}
                  <div className="absolute -top-4 -left-4 w-6 h-6 border-t border-l border-white/10 group-hover:border-lime transition-colors duration-500"></div>
                  
                  <div className="flex flex-col gap-6 pt-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center bg-zinc-950 border border-white/10 text-white group-hover:bg-lime group-hover:text-black transition-all duration-500 flex-shrink-0">
                        {(() => {
                          const Icon = resolveIcon(item.icon);
                          return <Icon size={20} />;
                        })()}
                      </div>
                      <h4 className="font-space text-xl font-bold text-white uppercase tracking-tight">{item.title}</h4>
                    </div>
                    <p className="font-sans text-[13px] text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Technical Schematic Image Container */}
            {content.image_url && content.image_url.trim().length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-video bg-zinc-950 overflow-hidden border border-white/10 group shadow-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={safeTransformUrl(content.image_url, 'full')} 
                alt="Process Precision" 
                className="w-full h-full object-cover grayscale brightness-90 contrast-125 group-hover:scale-105 transition-transform duration-1000"
              />
              {/* Technical Overlay */}
              <div className="absolute inset-0 bg-lime/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Decorative Scanning line for this image only */}
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-[1px] bg-lime/30 z-10 pointer-events-none shadow-[0_0_10px_#CCFF00]"
              ></motion.div>
            </motion.div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}

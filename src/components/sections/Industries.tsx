'use client';

import { motion } from 'motion/react';
import { industries } from '@/constants';
import type { IndustriesData } from '@/lib/cms/blocks/schemas';

const FALLBACK: IndustriesData = {
  eyebrow: 'Our Sectors',
  title_plain: 'Sectors We',
  title_accent: 'Work In.',
  intro: 'We provide precision manufacturing solutions tailored to the unique demands of multiple critical industries.',
  items: industries,
};

export default function Industries({ data }: { data?: IndustriesData }) {
  const content = data ?? FALLBACK;
  return (
    <section id="industries" className="py-20 px-[5%] bg-black overflow-hidden border-b border-white/10 scroll-mt-[100px]">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-12 mb-16 items-start">
           <div className="lg:w-1/2">
               <div className="inline-flex items-center gap-4 mb-8">
                  <div className="h-[1px] w-12 bg-lime" />
                  <span className="font-sans text-[10px] font-bold tracking-[6px] uppercase text-gray-400">{content.eyebrow}</span>
               </div>
               <h2 className="text-5xl md:text-7xl font-bold text-white leading-[0.85] tracking-tighter uppercase">
                  {content.title_plain} <br />
                  <span className="text-lime">{content.title_accent}</span>
               </h2>
            </div>
            <div className="lg:w-1/2 lg:pt-10">
               <p className="text-gray-400 font-medium text-xl leading-relaxed max-w-md border-l-4 border-white/10 pl-8">
                  {content.intro}
               </p>
            </div>
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-px bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.1)]">
            {content.items.map((industry, i) => (
              <motion.div
                key={industry}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-black p-8 min-h-[240px] flex flex-col justify-start overflow-hidden hover:bg-zinc-900 transition-colors duration-500"
              >
                 {/* Structural Grid Background */}
                 <div className="absolute inset-0 industrial-pattern opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" />
                 
                 {/* Status LED */}
                 <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-lime transition-colors duration-300 shadow-[0_0_6px_rgba(204,255,0,0.5)]" />

                 <div className="relative z-10">
                    <h4 className="text-2xl font-bold text-white leading-none uppercase tracking-tighter mb-4 group-hover:translate-x-1 transition-transform duration-500">
                       {industry}
                    </h4>
                    
                    <p className="text-gray-400 text-sm font-medium leading-relaxed mt-4">
                       Engineering solutions and precision component manufacturing for advanced applications in the {industry.toLowerCase()} sector.
                    </p>
                 </div>

                 {/* Bottom border stripe */}
                 <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-lime group-hover:w-full transition-all duration-500" />
              </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}

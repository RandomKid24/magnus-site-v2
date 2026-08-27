'use client';

import { motion } from 'motion/react';
import { usps } from '@/constants';
import type { UspsData } from '@/lib/cms/blocks/schemas';

const FALLBACK: UspsData = {
  title_plain: 'Our',
  title_accent: "USP's",
  intro: 'What sets us apart in the manufacturing landscape.',
  items: usps,
};

export default function USPs({ data }: { data?: UspsData }) {
  const content = data ?? FALLBACK;
  return (
    <section id="usps" className="py-20 px-[5%] bg-black overflow-hidden border-b border-white/10 scroll-mt-[100px]">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-12 mb-16 items-start">
            <div className="lg:w-1/2">
               <h3 className="text-5xl md:text-6xl font-bold text-white leading-[1] tracking-tighter uppercase font-space">
                  {content.title_plain} <br />
                  <span className="text-[#CCFF00] italic font-normal">{content.title_accent}</span>
               </h3>
            </div>
            <div className="lg:w-1/2 lg:pt-8">
               <p className="text-gray-400 text-xl font-medium leading-tight mb-8 tracking-tight">
                  {content.intro}
               </p>
            </div>
         </div>

         <div className="grid md:grid-cols-3 gap-px bg-white/5 border border-white/10">
            {content.items.map((usp, i) => (
             <motion.div
               key={usp.title}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="group relative bg-black p-8 hover:bg-zinc-950 transition-all duration-500 min-h-[240px]"
             >
                <div className="relative z-10">
                   <h4 className="text-2xl font-bold text-white uppercase tracking-tighter mb-4 group-hover:-translate-y-1 transition-transform duration-500 font-space">
                      {usp.title}
                   </h4>
                   
                   <p className="text-gray-400 text-base font-medium leading-relaxed transition-all duration-500">
                      {usp.description}
                   </p>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}

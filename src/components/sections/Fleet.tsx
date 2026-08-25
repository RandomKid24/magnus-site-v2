'use client';

import React from 'react';
import { motion } from 'motion/react';
import { machinery } from '../../constants';
import type { FleetData } from '@/lib/cms/blocks/schemas';

const FALLBACK: FleetData = {
  eyebrow: 'Infrastructure',
  title_plain: 'OUR PRECISION',
  title_accent: 'MACHINERY.',
  note: 'Tier-1 equipment maintained to micron-level accuracy standards.',
  machines: machinery,
  spec_rows: [
    { machine_class: 'CNC VMC', specification: '800x500x500 MM', application: 'Complex Profile Milling' },
    { machine_class: 'CNC VMC', specification: '800x500x500 MM', application: 'Complex Profile Milling' },
    { machine_class: 'CNC VMC', specification: '800x500x500 MM', application: 'Complex Profile Milling' },
  ],
};

export default function Fleet({ data }: { data?: FleetData }) {
  const content = data ?? FALLBACK;
  return (
    <section className="py-20 px-[5%] bg-black relative overflow-hidden scroll-mt-[100px]" id="fleet">
      <div className="absolute inset-0 bg-dots text-lime opacity-[0.05] pointer-events-none"></div>

      <div className="container-custom relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
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
            
            <div className="text-right">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-sans text-[10px] text-gray-400 uppercase tracking-[4px] font-bold max-w-xs mb-4 leading-relaxed"
              >
                {content.note}
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/10 shadow-2xl relative">
            {content.machines.map((machine, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-black p-8 flex flex-col group hover:bg-zinc-950 transition-colors duration-700 relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-lime translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                
                <h3 className="font-space text-2xl font-bold text-white transition-colors uppercase tracking-tight mb-8 mt-4">{machine}</h3>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 border border-white/10 bg-white/5 overflow-hidden shadow-2xl relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-black text-[10px] font-bold tracking-[3px] uppercase text-gray-400">
                    <th className="p-8">Machine Class</th>
                    <th className="p-8">Specification</th>
                    <th className="p-8">Primary Application</th>
                  </tr>
                </thead>
                <tbody className="text-white font-sans text-xs">
                  {content.spec_rows.map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-950 transition-colors border-b border-white/10">
                      <td className="p-8 font-bold text-lime uppercase tracking-widest font-space">{row.machine_class}</td>
                      <td className="p-8 text-gray-400 font-medium font-space">{row.specification}</td>
                      <td className="p-8 text-gray-400 uppercase tracking-widest font-bold">{row.application}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

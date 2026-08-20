import React from 'react';
import { motion } from 'motion/react';
import { services } from '../../constants';

export default function Services() {
  return (
    <section className="py-20 px-[5%] bg-black border-b border-white/10 scroll-mt-[100px]" id="solutions">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-[1px] w-12 bg-lime"></div>
              <span className="font-sans text-[10px] font-bold tracking-[6px] uppercase text-gray-400">Capabilities</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-space text-[clamp(32px,4vw,56px)] leading-[1.1] text-white tracking-tighter font-bold uppercase"
            >
              INDUSTRIAL <br />
              <span className="text-lime">SOLUTIONS GRID.</span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/10">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-black p-8 hover:bg-zinc-950 transition-all duration-500 group flex flex-col justify-between min-h-[240px] relative overflow-hidden"
              >
                <div>
                  <div className="w-12 h-12 bg-zinc-950 flex items-center justify-center border border-white/10 text-gray-400 group-hover:text-lime group-hover:bg-brand-dark transition-colors duration-500 mb-8">
                    <service.icon size={20} />
                  </div>
                  <h3 className="font-space text-xl font-bold text-white transition-colors uppercase tracking-tight mb-3">{service.title}</h3>
                  <ul className="space-y-1">
                    {service.description.map((point, i) => (
                      <li key={i} className="font-sans text-[11px] text-gray-400 leading-relaxed uppercase tracking-[1.5px] font-bold flex items-start gap-2">
                        <span className="text-lime mt-[2px] shrink-0">—</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

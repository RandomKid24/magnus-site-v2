'use client';

import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PricingData } from '@/lib/cms/blocks/schemas';

export default function PricingBlock({ data }: { data: PricingData }) {
  return (
    <section className="py-20 px-[5%] bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          {data.eyebrow && (
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="h-[1px] w-12 bg-lime" />
              <span className="font-sans text-[10px] font-bold tracking-[6px] uppercase text-gray-400">
                {data.eyebrow}
              </span>
            </div>
          )}
          <h2 className="font-space text-[clamp(32px,4vw,56px)] leading-[1.1] text-white tracking-tighter font-bold uppercase">
            {data.heading}
          </h2>
        </div>

        <div
          className={cn(
            'grid gap-6 max-w-6xl mx-auto',
            data.tiers.length === 1 && 'max-w-md',
            data.tiers.length === 2 && 'md:grid-cols-2',
            data.tiers.length === 3 && 'md:grid-cols-3',
            data.tiers.length >= 4 && 'md:grid-cols-2 xl:grid-cols-4'
          )}
        >
          {data.tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                'relative flex flex-col p-10 border transition-colors duration-500 bg-zinc-950',
                tier.highlighted
                  ? 'border-lime shadow-[0_0_40px_rgba(204,255,0,0.08)]'
                  : 'border-white/10 hover:border-white/25'
              )}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime text-black font-sans text-[9px] font-bold tracking-[2px] uppercase px-4 py-1.5">
                  Recommended
                </span>
              )}

              <h3 className="font-sans text-[11px] font-bold tracking-[4px] uppercase text-gray-400 mb-6">
                {tier.name}
              </h3>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-space text-5xl font-bold tracking-tighter text-white">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="font-sans text-xs font-bold tracking-widest uppercase text-zinc-500">
                    {tier.period}
                  </span>
                )}
              </div>

              {tier.description && (
                <p className="font-sans text-sm text-gray-400 leading-relaxed mb-8">
                  {tier.description}
                </p>
              )}

              <ul className="space-y-3 mb-10 flex-1">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircle size={15} className="text-lime mt-0.5 flex-shrink-0" />
                    <span className="font-sans text-xs font-bold uppercase tracking-[1.5px] text-white/80">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={tier.button_url || '#contact'}
                className={cn(
                  'block text-center font-bold text-[11px] tracking-[3px] uppercase px-8 py-4 transition-all duration-500',
                  tier.highlighted
                    ? 'bg-lime text-black hover:bg-white'
                    : 'border border-white/20 text-white hover:border-lime hover:text-lime'
                )}
              >
                {tier.button_text}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

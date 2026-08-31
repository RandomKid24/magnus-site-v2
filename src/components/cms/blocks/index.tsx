'use client';

import React from 'react';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import Products from '@/components/sections/Products';
import USPs from '@/components/sections/USPs';
import Customers from '@/components/sections/Customers';
import Services from '@/components/sections/Services';
import Industries from '@/components/sections/Industries';
import Fleet from '@/components/sections/Fleet';
import Gallery from '@/components/sections/Gallery';
import About from '@/components/sections/About';
import Quality from '@/components/sections/Quality';
import Contact from '@/components/sections/Contact';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import PricingBlock from './PricingBlock';
import TestimonialsBlock from './TestimonialsBlock';
import FaqBlock from './FaqBlock';
import CtaBlock from './CtaBlock';
import CustomBlock from './CustomBlock';
import { parseBlockData } from '@/lib/cms/blocks/schemas';

export interface SectionRendererContext {
  /** Contact details from site settings (used by the contact block). */
  contact?: { email: string; phone: string; address: string };
  scrollToId?: (e: React.MouseEvent, id: string) => void;
  /** Show a visible marker for blocks whose data failed validation. */
  debug?: boolean;
}

/**
 * Registry mapping block types to their rendering components. Data is
 * validated through the block's Zod schema before rendering; invalid or
 * unknown content renders nothing rather than crashing the page.
 */
const BLOCK_COMPONENTS: Record<
  string,
  React.ComponentType<Record<string, unknown>>
> = {
  hero: Hero,
  features: Features,
  products: Products,
  usps: USPs,
  customers: Customers,
  services: Services,
  industries: Industries,
  fleet: Fleet,
  gallery: Gallery,
  about: About,
  quality: Quality,
  contact: Contact,
  text: TextBlock,
  image: ImageBlock,
  pricing: PricingBlock,
  testimonials: TestimonialsBlock,
  faq: FaqBlock,
  cta: CtaBlock,
  custom: CustomBlock,
} as unknown as Record<string, React.ComponentType<Record<string, unknown>>>;

export function BlockRenderer({
  type,
  data,
  context,
}: {
  type: string;
  data: unknown;
  context?: SectionRendererContext;
}) {
  const Component = BLOCK_COMPONENTS[type];
  if (!Component) return null;

  const parsed = parseBlockData(type, data);
  if (!parsed) {
    if (context?.debug) {
      return (
        <div className="border border-dashed border-red-500/50 bg-red-500/5 px-6 py-4 text-center">
          <p className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-red-300">
            Block &quot;{type}&quot; has invalid data and is hidden on the live site.
          </p>
        </div>
      );
    }
    return null;
  }

  const extraProps: Record<string, unknown> = {};
  if (type === 'hero' && context?.scrollToId) extraProps.scrollToId = context.scrollToId;
  if (type === 'contact' && context?.contact) extraProps.contact = context.contact;

  return <Component data={parsed} {...extraProps} />;
}

export interface RenderableSection {
  id: string;
  type: string;
  position: number;
  data: Record<string, unknown>;
}

/** Renders an ordered list of page sections. */
export function SectionRenderer({
  sections,
  context,
}: {
  sections: RenderableSection[];
  context?: SectionRendererContext;
}) {
  return (
    <>
      {[...sections]
        .sort((a, b) => a.position - b.position)
        .map((section) => (
          <BlockRenderer
            key={section.id}
            type={section.type}
            data={section.data}
            context={context}
          />
        ))}
    </>
  );
}
